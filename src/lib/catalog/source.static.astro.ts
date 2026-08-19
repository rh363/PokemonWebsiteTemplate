import { getCollection } from 'astro:content'
import { buildHaystack } from './search'
import { queryCards, type IndexedCard } from './query'
import type { Card, CardQuery, CardSet, CatalogSource, Page } from './types'

/** Lettura dalle content collections. Solo a build time (astro:content non
 *  e' risolvibile sotto Vitest puro): per questo sta in un file separato da
 *  source.static.ts, che resta testabile senza Astro. */
export async function getAllSets(): Promise<CardSet[]> {
  return (await getCollection('sets')).map((e) => e.data as CardSet)
}

export async function getAllCards(): Promise<Card[]> {
  return (await getCollection('cards')).map((e) => e.data as Card)
}

export async function getIndexedCards(): Promise<IndexedCard[]> {
  const [cards, sets] = await Promise.all([getAllCards(), getAllSets()])
  return cards.map((c) => ({
    ...c,
    haystack: buildHaystack(c, sets.find((s) => s.id === c.set) ?? sets[0]!),
  }))
}

/** Implementazione odierna di CatalogSource: legge le content collections.
 *  Domani un adapter Supabase implementera' la stessa interfaccia e le
 *  pagine non cambieranno, perche' importano solo da ~/lib/catalog. */
export const staticSource: CatalogSource = {
  listSets: getAllSets,
  async listCards(q: CardQuery): Promise<Page<Card>> {
    const [cards, sets] = await Promise.all([getIndexedCards(), getAllSets()])
    return queryCards(cards, sets, q)
  },
  async getCard(slug: string): Promise<Card | null> {
    return (await getAllCards()).find((c) => c.slug === slug) ?? null
  },
}
