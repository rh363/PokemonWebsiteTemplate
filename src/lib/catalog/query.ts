import { FOIL_RARITIES, PER_PAGE, RARITY_RANK } from './labels'
import { matches } from './search'
import type { Card, CardQuery, CardSet, Page, SortKey } from './types'

/** Una carta con il suo haystack di ricerca gia' calcolato. */
export type IndexedCard = Card & { haystack: string }

const none = (a: unknown[] | undefined): boolean => !a || a.length === 0

export function filterCards(cards: IndexedCard[], q: CardQuery): IndexedCard[] {
  return cards.filter(
    (c) =>
      (none(q.rarity) || q.rarity!.includes(c.rarity)) &&
      (none(q.sets) || q.sets!.includes(c.set)) &&
      (none(q.cond) || q.cond!.includes(c.cond)) &&
      (none(q.lang) || q.lang!.includes(c.lang)) &&
      (!q.foil || FOIL_RARITIES.includes(c.rarity)) &&
      matches(c.haystack, q.q ?? ''),
  )
}

export function sortCards(cards: IndexedCard[], sort: SortKey, sets: CardSet[]): IndexedCard[] {
  const setName = (id: string) => sets.find((s) => s.id === id)?.name ?? ''
  return cards.toSorted((a, b) => {
    switch (sort) {
      case 'az':
        return a.name.localeCompare(b.name)
      case 'rarita':
        return RARITY_RANK[b.rarity] - RARITY_RANK[a.rarity] || a.name.localeCompare(b.name)
      case 'espansione':
        return setName(a.set).localeCompare(setName(b.set)) || a.num.localeCompare(b.num)
      case 'novita':
      default:
        return (b.nuovo ? 1 : 0) - (a.nuovo ? 1 : 0) || a.ordine - b.ordine
    }
  })
}

export function paginate<T>(items: T[], page: number, perPage: number): Page<T> {
  const pages = Math.max(1, Math.ceil(items.length / perPage))
  const from = (page - 1) * perPage
  // Una pagina oltre il limite produce naturalmente un elenco vuoto:
  // slice() oltre la fine non esplode, quindi non serve nessun caso speciale.
  return { items: items.slice(from, from + perPage), total: items.length, page, pages }
}

export function queryCards(
  cards: IndexedCard[],
  sets: CardSet[],
  q: CardQuery,
): Page<IndexedCard> {
  const filtrate = filterCards(cards, q)
  const ordinate = sortCards(filtrate, q.sort ?? 'novita', sets)
  return paginate(ordinate, q.page ?? 1, q.perPage ?? PER_PAGE)
}
