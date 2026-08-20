import { cardCode, CONDITION_LABELS, RARITY_LABELS } from './labels'
import type { Card, CardSet } from './types'

export { cardCode }

export const normalizeQuery = (q: string | undefined) => (q ?? '').trim().toLowerCase()

/** I sette campi cercabili del prototipo, uniti e minuscolizzati una volta
 *  sola a build time. La ricerca a runtime e' un semplice includes(). */
export const buildHaystack = (card: Card, set: CardSet) =>
  [
    card.name,
    cardCode(card, set),
    set.name,
    RARITY_LABELS[card.rarity],
    CONDITION_LABELS[card.cond],
    card.lang,
    card.artist,
  ]
    .join(' ')
    .toLowerCase()

export const matches = (haystack: string, q: string) => {
  const n = normalizeQuery(q)
  return n === '' || haystack.includes(n)
}
