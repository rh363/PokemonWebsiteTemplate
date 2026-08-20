import { beforeEach, describe, expect, it, vi } from 'vitest'

// La configurazione e' un modulo, non un parametro: si mocka invece di
// riscrivere la firma delle funzioni solo per renderle testabili.
const conf = vi.hoisted(() => ({
  immagini: { origine: '', zona: '', larghezze: [150, 300, 450], qualita: 82 },
}))
vi.mock('~/config/site', () => ({ SITE: conf }))

const { immaginiAttive, srcsetImmagine, urlImmagine } = await import('./immagini')

beforeEach(() => {
  conf.immagini = { origine: '', zona: '', larghezze: [150, 300, 450], qualita: 82 }
})

describe('senza configurazione', () => {
  it('le foto sono spente e si ricade sul placeholder', () => {
    expect(immaginiAttive()).toBe(false)
  })
})

describe('bucket piu zona (trasformazioni attive)', () => {
  beforeEach(() => {
    conf.immagini.origine = 'https://img.esempio.it'
    conf.immagini.zona = 'https://esempio.it'
  })

  it('passa dalle trasformazioni della zona', () => {
    expect(urlImmagine('alb-042.jpg', 300)).toBe(
      'https://esempio.it/cdn-cgi/image/width=300,format=auto,quality=82,fit=scale-down/https://img.esempio.it/alb-042.jpg',
    )
  })

  it('offre una sorgente per ogni larghezza configurata', () => {
    const srcset = srcsetImmagine('alb-042.jpg')!
    expect(srcset.split(', ')).toHaveLength(3)
    expect(srcset).toContain(' 450w')
  })
})

describe('solo bucket, nessuna zona', () => {
  // Il caso di chi non ha ancora un dominio su Cloudflare: le
  // trasformazioni /cdn-cgi/image/ vivono su una zona, il bucket no. Le foto
  // devono comunque comparire, servite cosi' come sono state caricate.
  beforeEach(() => {
    conf.immagini.origine = 'https://esempio.r2.dev'
  })

  it('le foto sono accese lo stesso', () => {
    expect(immaginiAttive()).toBe(true)
  })

  it('serve la foto diretta dal bucket, senza trasformazioni', () => {
    expect(urlImmagine('alb-042.jpg', 300)).toBe('https://esempio.r2.dev/alb-042.jpg')
  })

  it('non dichiara un srcset: le larghezze non esistono davvero', () => {
    // Un srcset con tre URL identici mentirebbe al browser, che sceglierebbe
    // in base a larghezze che nessuno serve.
    expect(srcsetImmagine('alb-042.jpg')).toBeUndefined()
  })
})
