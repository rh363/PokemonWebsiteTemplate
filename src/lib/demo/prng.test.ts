import { describe, expect, it } from 'vitest'
import { createRng } from './prng'

describe('PRNG del prototipo', () => {
  it('riproduce la sequenza di Lehmer con seme 7', () => {
    const rng = createRng(7)
    expect(rng()).toBeCloseTo(((7 * 16807) % 2147483647) / 2147483647, 12)
  })

  it('e deterministico: due istanze con lo stesso seme coincidono', () => {
    const a = createRng(7),
      b = createRng(7)
    expect(Array.from({ length: 50 }, a)).toEqual(Array.from({ length: 50 }, b))
  })

  it('resta nell intervallo [0,1)', () => {
    const rng = createRng(7)
    for (let i = 0; i < 1000; i++) {
      const v = rng()
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThan(1)
    }
  })
})
