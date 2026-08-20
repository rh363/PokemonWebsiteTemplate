export type Rarity = 'common' | 'uncommon' | 'rare' | 'holo' | 'ultra' | 'secret'
export type Condition = 'mint' | 'near-mint' | 'excellent' | 'good' | 'played'
export type SortKey = 'novita' | 'rarita' | 'az' | 'espansione'

export interface CardSet {
  id: string
  name: string
  code: string
  year: number
  total: number
  color: string
}

export interface Card {
  id: string
  slug: string
  name: string
  set: string
  num: string
  rarity: Rarity
  cond: Condition
  lang: string
  artist: string
  nuovo: boolean
  vetrina: number
  entrata: string
  ordine: number
  image?: string
}

export interface CardQuery {
  q?: string
  sets?: string[]
  rarity?: Rarity[]
  cond?: Condition[]
  lang?: string[]
  foil?: boolean
  sort?: SortKey
  page?: number
  perPage?: number
}

export interface Page<T> {
  items: T[]
  total: number
  page: number
  pages: number
}

/** Contratto dello strato dati. Oggi lo implementa source.static.ts leggendo
 *  le content collections; domani potra' implementarlo un adapter Supabase
 *  senza che i componenti cambino. */
export interface CatalogSource {
  listSets(): Promise<CardSet[]>
  listCards(q: CardQuery): Promise<Page<Card>>
  getCard(slug: string): Promise<Card | null>
}
