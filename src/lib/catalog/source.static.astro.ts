import { getCollection } from 'astro:content'
import setsRaw from '../../content/sets.json'
import { buildHaystack } from './search'
import { queryCards, type IndexedCard } from './query'
import type { Card, CardQuery, CardSet, CatalogSource, Page } from './types'

// L'ordine in cui compaiono le espansioni in sets.json e' una scelta
// editoriale di chi cura il catalogo (come SETS in design-reference/dati.jsx,
// un array la cui sequenza non deriva da nessun campo), quindi e' quello
// l'ordine di visualizzazione. getCollection('sets') pero' NON lo preserva:
// il content layer di Astro restituisce le entry ordinate alfabeticamente
// per id, non nell'ordine di inserimento nel file. Coi dati demo il
// risultato di "anno desc" coincide col file per puro caso (i pareggi
// d'anno capitano gia' in ordine alfabetico di id) — non e' una prova che
// quest'ordinamento sia superfluo: chi aggiunge un'espansione nuova in
// cima al file va a finire altrove se questa riga sparisce.
const idOrder = new Map(setsRaw.map((s, i) => [s.id, i]))

/** Lettura dalle content collections. Solo a build time (astro:content non
 *  e' risolvibile sotto Vitest puro): per questo sta in un file separato da
 *  source.static.ts, che resta testabile senza Astro. */
export async function getAllSets(): Promise<CardSet[]> {
  const sets = (await getCollection('sets')).map((e) => e.data as CardSet)
  return sets.toSorted((a, b) => (idOrder.get(a.id) ?? 0) - (idOrder.get(b.id) ?? 0))
}

// Stesso difetto di getAllSets() sopra, sulla collection cards: getCollection()
// non preserva l'ordine delle righe di cards.csv, restituisce le entry
// ordinate alfabeticamente per id di collection (qui lo slug). La colonna
// "id" del CSV pero' e' significativa: e' assegnata in sequenza dal
// generatore (scripts/seed-demo.ts, come CARDS in design-reference/dati.jsx,
// dove `nuovo:i<=9` marca le prime carte generate) — le prime N carte in
// quell'ordine sono i "nuovi arrivi" che Hero e NuoviArrivi della Vetrina
// mostrano. Senza questo sort, quelle sezioni pescherebbero un sottoinsieme
// arbitrario (l'ordine alfabetico dello slug), non le carte piu' recenti.
export async function getAllCards(): Promise<Card[]> {
  const cards = (await getCollection('cards')).map((e) => e.data as Card)
  return cards.toSorted((a, b) => Number(a.id) - Number(b.id))
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
