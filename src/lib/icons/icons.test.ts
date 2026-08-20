import { describe, expect, it } from 'vitest'
import { ICONS, ICON_NAMES } from './index'

const ATTESE = [
  'arrow-left',
  'arrow-right',
  'check',
  'chevron-down',
  'chevron-right',
  'clock',
  'filter',
  'heart',
  'info',
  'instagram',
  'layers',
  'list',
  'map-pin',
  'message-circle',
  'search',
  'share-2',
  'sparkles',
  'x',
] as const

describe('inventario icone', () => {
  it('contiene esattamente le 18 icone usate dal prototipo', () => {
    expect(ICON_NAMES.toSorted()).toEqual([...ATTESE].toSorted())
  })

  it('ogni icona ha contenuto SVG non vuoto', () => {
    for (const n of ICON_NAMES) {
      expect(ICONS[n], n).toMatch(/<(path|circle|rect|line|polyline|polygon)/)
    }
  })

  it('nessuna icona porta con se il tag svg esterno', () => {
    for (const n of ICON_NAMES) expect(ICONS[n], n).not.toContain('<svg')
  })
})
