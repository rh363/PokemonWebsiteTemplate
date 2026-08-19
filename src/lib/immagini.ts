// Costruttore di URL per le foto delle carte su Cloudflare R2, dietro le
// trasformazioni di Cloudflare Images (spec §13, Task 23). Non importa nulla
// da ~/lib/catalog: e' pensato per essere sicuro da importare anche dentro
// un'isola idratata (SiteChrome, CatalogApp, ...), dove la barrel del
// catalogo trascinerebbe astro:content nel bundle del browser.
import { SITE } from '~/config/site'

/** True solo quando sia l'origine (bucket R2) sia la zona (trasformazioni)
 *  sono configurate. Con uno dei due vuoto si ricade sempre sul placeholder
 *  foil — cosi' lo sviluppo locale funziona senza credenziali e senza rete,
 *  e il sito non si rompe mai per una configurazione mancante. */
export const immaginiAttive = (): boolean => Boolean(SITE.immagini.origine && SITE.immagini.zona)

/** https://<zona>/cdn-cgi/image/<opzioni>/<url sorgente assoluta>
 *  Formato documentato da Cloudflare: la sorgente puo' stare su un host
 *  diverso dalla zona (qui il dominio personalizzato del bucket R2). */
export function urlImmagine(key: string, width: number): string {
  const { origine, zona, qualita } = SITE.immagini
  const opzioni = `width=${width},format=auto,quality=${qualita},fit=scale-down`
  return `${zona}/cdn-cgi/image/${opzioni}/${origine}/${encodeURIComponent(key)}`
}

/** srcset con tutte le larghezze configurate, per i contesti che possono
 *  usare un'immagine responsive (la scheda carta, i candidati LCP). */
export const srcsetImmagine = (key: string): string =>
  SITE.immagini.larghezze.map((w) => `${urlImmagine(key, w)} ${w}w`).join(', ')
