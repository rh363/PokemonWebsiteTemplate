import { describe, expect, it } from 'vitest'
import { buildCatalogPayload, buildSearchPayload } from './source.static'
import type { Card, CardSet } from './types'

const SETS: CardSet[] = [
  { id: 'alb', name: 'Alba Cromatica', code: 'ALB', year: 2024, total: 198, color: 'x' },
]
const CARDS: Card[] = [
  {
    id: '1',
    slug: 's1',
    name: 'Alfa',
    set: 'alb',
    num: '042/198',
    rarity: 'holo',
    cond: 'near-mint',
    lang: 'Italiano',
    artist: 'M. Ferretti',
    nuovo: true,
    vetrina: 2,
    entrata: '4 marzo',
    ordine: 120,
  },
  {
    id: '2',
    slug: 's2',
    name: 'Beta',
    set: 'alb',
    num: '043/198',
    rarity: 'rare',
    cond: 'mint',
    lang: 'Italiano',
    artist: 'M. Ferretti',
    nuovo: false,
    vetrina: 0,
    entrata: '5 marzo',
    ordine: 121,
  },
  {
    id: '3',
    slug: 's3',
    name: 'Gamma',
    set: 'alb',
    num: '044/198',
    rarity: 'common',
    cond: 'good',
    lang: 'Italiano',
    artist: 'M. Ferretti',
    nuovo: false,
    vetrina: 0,
    entrata: '6 marzo',
    ordine: 122,
  },
]

describe('payload del catalogo', () => {
  it('porta versione, espansioni e carte', () => {
    const p = buildCatalogPayload(CARDS, SETS)
    expect(p.version).toBe(1)
    expect(p.sets).toHaveLength(1)
    expect(p.cards[0]!.slug).toBe('s1')
  })

  it('non include l haystack: sta nel file separato', () => {
    expect(buildCatalogPayload(CARDS, SETS).cards[0]).not.toHaveProperty('haystack')
  })
})

describe('payload della ricerca', () => {
  it('e parallelo per indice alle carte del catalogo', () => {
    // Fixture a tre carte con nomi distinguibili: con una sola carta qualsiasi
    // trasformazione che preserva il conteggio sembrerebbe "parallela" anche
    // se scambiasse l'ordine. Qui verifichiamo, per ogni indice, che
    // l'haystack corrisponda proprio alla carta di quello stesso indice.
    const c = buildCatalogPayload(CARDS, SETS)
    const s = buildSearchPayload(CARDS, SETS)
    expect(s.haystacks).toHaveLength(c.cards.length)
    c.cards.forEach((card, i) => {
      expect(s.haystacks[i]).toContain(card.name.toLowerCase())
    })
  })
})
