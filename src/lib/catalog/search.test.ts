import { describe, expect, it } from 'vitest'
import { buildHaystack, cardCode, matches, normalizeQuery } from './search'
import type { Card, CardSet } from './types'

const set: CardSet = {
  id: 'alb',
  name: 'Alba Cromatica',
  code: 'ALB',
  year: 2024,
  total: 198,
  color: 'var(--cherry-500)',
}

const card: Card = {
  id: '1',
  slug: 'fulmine-di-notte-alb-042',
  name: 'Fulmine di Notte',
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
}

describe('cardCode', () => {
  it('compone codice espansione e numero, separati da spazio', () => {
    expect(cardCode(card, set)).toBe('ALB 042/198')
  })
})

describe('buildHaystack', () => {
  it('unisce i sette campi cercabili in minuscolo', () => {
    expect(buildHaystack(card, set)).toBe(
      'fulmine di notte alb 042/198 alba cromatica holo near mint italiano m. ferretti',
    )
  })

  it('include le etichette italiane di rarita e condizione, non i codici', () => {
    const h = buildHaystack({ ...card, rarity: 'ultra', cond: 'played' }, set)
    expect(h).toContain('ultra rara')
    expect(h).toContain('played')
  })
})

describe('matches', () => {
  const h = buildHaystack(card, set)

  it('trova una sottostringa a meta parola, come il prototipo', () => {
    expect(matches(h, 'olo')).toBe(true)
  })

  it('e insensibile a maiuscole e spazi ai bordi', () => {
    expect(matches(h, '  FULMINE  ')).toBe(true)
  })

  it('trova per codice espansione', () => {
    expect(matches(h, 'alb 042')).toBe(true)
  })

  it('non trova cio che non c e', () => {
    expect(matches(h, 'pikachu')).toBe(false)
  })

  it('con query vuota accetta tutto', () => {
    expect(matches(h, '')).toBe(true)
    expect(matches(h, '   ')).toBe(true)
  })
})

describe('normalizeQuery', () => {
  it('taglia gli spazi e minuscolizza', () => {
    expect(normalizeQuery('  Holo ')).toBe('holo')
  })
  it('tratta undefined come stringa vuota', () => {
    expect(normalizeQuery(undefined)).toBe('')
  })
})
