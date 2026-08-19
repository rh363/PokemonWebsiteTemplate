// Il seam lato browser: /api/catalog.json esiste dal Task 8 (endpoint
// server), qui e' il punto unico da cui le isole lo scaricano. Una sola
// fetch per pagina — la promise e' un valore di modulo, e due import dello
// stesso URL di modulo risolvono alla stessa istanza (stesso meccanismo
// verificato dal Task 2 per ~/stores/chrome, §6.3 della spec): SiteChrome,
// HeroSearch e qualunque altra isola che chiami getCatalog() condividono la
// stessa richiesta di rete, anche se montano in momenti diversi.
//
// Tipi ripetuti qui invece che importati da ~/lib/catalog/source.static:
// un'isola non deve dipendere da un file che sta un passo dentro lo strato
// dati server — solo da labels/types, che sono la parte di quello strato
// pensata per il browser (vedi il commento in SiteChrome.svelte).
import type { Card, CardSet } from '~/lib/catalog/types'

export interface CatalogPayload {
  version: 1
  sets: CardSet[]
  cards: Card[]
}

let cache: Promise<CatalogPayload> | null = null

/** Scarica /api/catalog.json la prima volta che viene chiamata, poi tiene
 *  il risultato per il resto della pagina — chiamate successive (anche da
 *  isole diverse) restituiscono la stessa promise, non rifanno la fetch.
 *
 *  Un fallimento (rete assente, risposta non-ok, JSON malformato) NON viene
 *  messo in cache: senza questo, una promise rifiutata restava in `cache`
 *  per il resto della vita della pagina — un solo blip di rete disattivava
 *  la quick-view e i suggerimenti di ricerca in modo permanente, senza che
 *  nessun nuovo tentativo potesse mai ripartire. Il prossimo chiamante dopo
 *  un fallimento rifa' la fetch da zero. */
export function getCatalog(): Promise<CatalogPayload> {
  if (!cache) {
    cache = fetch('/api/catalog.json')
      .then((r) => {
        if (!r.ok) throw new Error(`/api/catalog.json ha risposto ${r.status}`)
        return r.json() as Promise<CatalogPayload>
      })
      .catch((err) => {
        cache = null
        throw err
      })
  }
  return cache
}
