// Costruttore di URL per le foto delle carte su Cloudflare R2, dietro le
// trasformazioni di Cloudflare Images (spec §13, Task 23). Non importa nulla
// da ~/lib/catalog: e' pensato per essere sicuro da importare anche dentro
// un'isola idratata (SiteChrome, CatalogApp, ...), dove la barrel del
// catalogo trascinerebbe astro:content nel bundle del browser.
import { SITE } from '~/config/site'

/** True quando c'e' un'origine (il bucket R2) da cui prendere le foto.
 *  Vuota = placeholder foil ovunque: lo sviluppo locale funziona senza
 *  credenziali e senza rete, e il sito non si rompe mai per una
 *  configurazione mancante.
 *
 *  La zona NON serve per accendere le foto, solo per trasformarle: chi non
 *  ha ancora un dominio su Cloudflare compila la sola `origine` e vede le
 *  foto cosi' come le ha caricate. Vedi `urlImmagine`. */
export const immaginiAttive = (): boolean => Boolean(SITE.immagini.origine)

/** Con una zona configurata: https://<zona>/cdn-cgi/image/<opzioni>/<sorgente>
 *  — formato documentato da Cloudflare, dove la sorgente puo' stare su un
 *  host diverso dalla zona (qui il dominio del bucket R2). E' la strada
 *  buona: ridimensiona, sceglie WebP/AVIF e applica la qualita'.
 *
 *  Senza zona si serve la foto diretta dal bucket, `width` ignorata. Le
 *  trasformazioni `/cdn-cgi/image/` esistono solo su una zona Cloudflare,
 *  quindi senza dominio proprio non c'e' modo di ottenerle: l'alternativa
 *  onesta e' servire l'originale, non fabbricare un URL che risponderebbe
 *  404. Costa banda e byte — carica foto gia' ridimensionate se resti qui. */
export function urlImmagine(key: string, width: number): string {
  const { origine, zona, qualita } = SITE.immagini
  const foto = `${origine}/${encodeURIComponent(key)}`
  if (!zona) return foto
  const opzioni = `width=${width},format=auto,quality=${qualita},fit=scale-down`
  return `${zona}/cdn-cgi/image/${opzioni}/${foto}`
}

/** srcset con tutte le larghezze configurate, per i contesti che possono
 *  usare un'immagine responsive (la scheda carta, i candidati LCP).
 *
 *  `undefined` senza zona: li' esiste una sola foto, e dichiarare tre
 *  candidati identici mentirebbe al browser, che sceglierebbe in base a
 *  larghezze che nessuno serve. Chi lo usa deve omettere del tutto
 *  l'attributo, non scriverlo vuoto. */
export const srcsetImmagine = (key: string): string | undefined =>
  SITE.immagini.zona
    ? SITE.immagini.larghezze.map((w) => `${urlImmagine(key, w)} ${w}w`).join(', ')
    : undefined
