import { buildHaystack } from './search'
import type { Card, CardSet } from './types'

/** Forma di /api/catalog.json. E' un contratto pubblico: quando la sorgente
 *  diventera' Supabase, la risposta dovra' avere esattamente questa forma. */
export interface CatalogPayload {
  version: 1
  sets: CardSet[]
  cards: Card[]
}

/** Forma di /api/search-index.json: parallelo per indice a cards[]. */
export interface SearchPayload {
  version: 1
  haystacks: string[]
}

/** Pure: testabili senza Astro. Non dipendono dal formato dei contenuti
 *  (CSV oggi, potenzialmente Supabase domani) ne' da astro:content. */
export const buildCatalogPayload = (cards: Card[], sets: CardSet[]): CatalogPayload => ({
  version: 1,
  sets,
  cards,
})

export const buildSearchPayload = (cards: Card[], sets: CardSet[]): SearchPayload => ({
  version: 1,
  haystacks: cards.map((c) => buildHaystack(c, sets.find((s) => s.id === c.set) ?? sets[0]!)),
})
