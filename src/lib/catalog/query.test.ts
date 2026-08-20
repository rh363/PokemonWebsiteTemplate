import { describe, expect, it } from 'vitest'
import { filterCards, paginate, queryCards, sortCards, type IndexedCard } from './query'
import { buildHaystack } from './search'
import type { CardSet } from './types'

const SETS: CardSet[] = [
  { id: 'alb', name: 'Alba Cromatica', code: 'ALB', year: 2024, total: 198, color: 'a' },
  { id: 'for', name: 'Fornace Antica', code: 'FOR', year: 1999, total: 102, color: 'b' },
]

const base = {
  lang: 'Italiano', artist: 'ignoto', nuovo: false,
  vetrina: 1, entrata: '1 marzo', image: undefined,
} as const

const mk = (o: Partial<IndexedCard> & { id: string; name: string; set: string }): IndexedCard => {
  const set = SETS.find((s) => s.id === o.set)!
  const card = {
    slug: `${o.id}-slug`, num: '001/198', rarity: 'common', cond: 'mint',
    ordine: 0, ...base, ...o,
  } as IndexedCard
  return { ...card, haystack: buildHaystack(card, set) }
}

const CARDS: IndexedCard[] = [
  mk({ id: '1', name: 'Alfa', set: 'alb', rarity: 'holo', cond: 'mint', nuovo: true, ordine: 30 }),
  mk({ id: '2', name: 'Beta', set: 'for', rarity: 'common', cond: 'played', lang: 'Inglese', ordine: 10 }),
  mk({ id: '3', name: 'Gamma', set: 'alb', rarity: 'ultra', cond: 'good', ordine: 20 }),
  mk({ id: '4', name: 'Delta', set: 'for', rarity: 'rare', cond: 'mint', nuovo: true, ordine: 5 }),
]

describe('filterCards', () => {
  it('senza filtri restituisce tutto', () => {
    expect(filterCards(CARDS, {})).toHaveLength(4)
  })

  it('filtra per espansione', () => {
    expect(filterCards(CARDS, { sets: ['alb'] }).map((c) => c.id)).toEqual(['1', '3'])
  })

  it('dentro una categoria i valori sono in OR', () => {
    expect(filterCards(CARDS, { rarity: ['holo', 'rare'] }).map((c) => c.id)).toEqual(['1', '4'])
  })

  it('fra categorie diverse i filtri sono in AND', () => {
    expect(filterCards(CARDS, { sets: ['alb'], rarity: ['ultra'] }).map((c) => c.id)).toEqual(['3'])
  })

  it('foil tiene solo holo, ultra e secret', () => {
    expect(filterCards(CARDS, { foil: true }).map((c) => c.id)).toEqual(['1', '3'])
  })

  it('filtra per lingua e per condizione', () => {
    expect(filterCards(CARDS, { lang: ['Inglese'] }).map((c) => c.id)).toEqual(['2'])
    expect(filterCards(CARDS, { cond: ['mint'] }).map((c) => c.id)).toEqual(['1', '4'])
  })

  it('la ricerca testuale si combina in AND coi filtri', () => {
    expect(filterCards(CARDS, { q: 'alfa', sets: ['for'] })).toHaveLength(0)
    expect(filterCards(CARDS, { q: 'alfa', sets: ['alb'] }).map((c) => c.id)).toEqual(['1'])
  })

  it('un array di filtro vuoto non filtra', () => {
    expect(filterCards(CARDS, { rarity: [], sets: [] })).toHaveLength(4)
  })
})

describe('sortCards', () => {
  it('novita: prima i nuovi, poi per campo ordine crescente', () => {
    expect(sortCards(CARDS, 'novita', SETS).map((c) => c.id)).toEqual(['4', '1', '2', '3'])
  })

  it('rarita: dalla piu alta alla piu bassa, pareggi per nome', () => {
    expect(sortCards(CARDS, 'rarita', SETS).map((c) => c.id)).toEqual(['3', '1', '4', '2'])
  })

  it('az: alfabetico per nome', () => {
    expect(sortCards(CARDS, 'az', SETS).map((c) => c.name)).toEqual(['Alfa', 'Beta', 'Delta', 'Gamma'])
  })

  it('espansione: per nome espansione, pareggi per numero carta', () => {
    expect(sortCards(CARDS, 'espansione', SETS).map((c) => c.set)).toEqual(['alb', 'alb', 'for', 'for'])
  })

  it('non muta l array in ingresso', () => {
    const prima = CARDS.map((c) => c.id)
    sortCards(CARDS, 'az', SETS)
    expect(CARDS.map((c) => c.id)).toEqual(prima)
  })
})

describe('paginate', () => {
  const items = Array.from({ length: 10 }, (_, i) => i)

  it('taglia la pagina richiesta', () => {
    expect(paginate(items, 2, 4)).toEqual({ items: [4, 5, 6, 7], total: 10, page: 2, pages: 3 })
  })

  it('con zero elementi resta una pagina sola', () => {
    expect(paginate([], 1, 4)).toEqual({ items: [], total: 0, page: 1, pages: 1 })
  })

  it('una pagina oltre il limite si aggancia all ultima pagina valida invece di restituire un elenco vuoto', () => {
    expect(paginate(items, 99, 4)).toEqual({ items: [8, 9], total: 10, page: 3, pages: 3 })
  })
})

describe('queryCards', () => {
  it('applica filtro, ordinamento e paginazione insieme', () => {
    const r = queryCards(CARDS, SETS, { foil: true, sort: 'az', page: 1, perPage: 1 })
    expect(r.total).toBe(2)
    expect(r.pages).toBe(2)
    expect(r.items.map((c) => c.name)).toEqual(['Alfa'])
  })

  it('senza sort usa novita, senza perPage usa 24', () => {
    const r = queryCards(CARDS, SETS, {})
    expect(r.items.map((c) => c.id)).toEqual(['4', '1', '2', '3'])
    expect(r.pages).toBe(1)
  })
})
