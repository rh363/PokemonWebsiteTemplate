import type { Card, CardSet, Condition, Rarity, SortKey } from './types'

export const RARITY_LABELS: Record<Rarity, string> = {
  common: 'Comune',
  uncommon: 'Non comune',
  rare: 'Rara',
  holo: 'Holo',
  ultra: 'Ultra rara',
  secret: 'Segreta',
}

export const CONDITION_LABELS: Record<Condition, string> = {
  mint: 'Mint',
  'near-mint': 'Near Mint',
  excellent: 'Excellent',
  good: 'Good',
  played: 'Played',
}

export const RARITY_RANK: Record<Rarity, number> = {
  common: 0,
  uncommon: 1,
  rare: 2,
  holo: 3,
  ultra: 4,
  secret: 5,
}

export const LANGUAGES = ['Italiano', 'Inglese', 'Giapponese'] as const
export const FOIL_RARITIES: Rarity[] = ['holo', 'ultra', 'secret']

/** Etichette dell'ordinamento, come le mostra il prototipo.
 *  Nota: 'az' usa una lineetta EN (U+2013), non un trattino. */
export const SORT_LABELS: Record<SortKey, string> = {
  novita: 'Novità',
  rarita: 'Rarità',
  az: 'A–Z',
  espansione: 'Espansione',
}

export const PER_PAGE = 24

/** Quante carte di un'espansione stanno in vetrina.
 *  Il prototipo (design-reference/dati.jsx) usa una stima fissa al 42%.
 *  Con dati reali questo diventera' un conteggio vero sulle carte schedate. */
export const inVetrina = (s: { total: number }) => Math.round(s.total * 0.42)

/** Sigla dell'espansione piu' il numero della carta, es. "ALB 007/198".
 *  Rispecchia codeOf() del prototipo (design-reference/dati.jsx). */
export const cardCode = (card: Card, set: CardSet): string => `${set.code} ${card.num}`

/** Slug canonico di una carta: nome normalizzato + sigla espansione + numero.
 *  I dati demo lo portano gia' pronto in Card.slug (calcolato da
 *  scripts/seed-demo.ts con la stessa formula); questa funzione ricalcola
 *  lo stesso valore, utile per un adapter futuro che non lo fornisce pronto. */
export const cardSlug = (card: Card, set: CardSet): string => {
  const numero = card.num.split('/')[0] ?? card.num
  const base = card.name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return `${base}-${set.code.toLowerCase()}-${numero}`
}
