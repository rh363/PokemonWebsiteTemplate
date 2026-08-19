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
 *  isole diverse) restituiscono la stessa promise, non rifanno la fetch. */
export function getCatalog(): Promise<CatalogPayload> {
  if (!cache) {
    cache = fetch('/api/catalog.json').then((r) => r.json() as Promise<CatalogPayload>)
  }
  return cache
}
