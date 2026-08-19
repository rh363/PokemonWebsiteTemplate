import { describe, expect, it } from 'vitest'
import { parseQuery, toSearchParams } from './url'

describe('parseQuery', () => {
  it('legge tutte le chiavi supportate', () => {
    const q = parseQuery(new URLSearchParams(
      'q=holo&set=alb&set=for&rar=ultra&cond=mint&lang=Italiano&foil=1&sort=rarita&p=3'))
    expect(q).toEqual({
      q: 'holo', sets: ['alb', 'for'], rarity: ['ultra'], cond: ['mint'],
      lang: ['Italiano'], foil: true, sort: 'rarita', page: 3,
    })
  })

  it('su querystring vuota restituisce i default', () => {
    expect(parseQuery(new URLSearchParams())).toEqual({
      q: '', sets: [], rarity: [], cond: [], lang: [], foil: false, sort: 'novita', page: 1,
    })
  })

  it('scarta valori non validi invece di fidarsi', () => {
    const q = parseQuery(new URLSearchParams('rar=leggendaria&sort=magia&p=-4'))
    expect(q.rarity).toEqual([])
    expect(q.sort).toBe('novita')
    expect(q.page).toBe(1)
  })
})

describe('toSearchParams', () => {
  it('omette i default per tenere l URL pulito', () => {
    expect(toSearchParams({ sort: 'novita', page: 1, foil: false }).toString()).toBe('')
  })

  it('e inverso di parseQuery', () => {
    const s = 'q=holo&set=alb&rar=ultra&foil=1&sort=az&p=2'
    expect(toSearchParams(parseQuery(new URLSearchParams(s))).toString())
      .toBe(new URLSearchParams(s).toString())
  })
})
