import { expect, test } from '@playwright/test'

const ROTTE = [
  { path: '/', h1: /schedate a mano/i },
  { path: '/catalogo', h1: /^Catalogo$/ },
  { path: '/espansioni', h1: /^Espansioni$/ },
  { path: '/negozio', h1: /^Il negozio$/ },
  { path: '/chi-siamo', h1: /catalogo lungo/i },
]

for (const r of ROTTE) {
  test(`${r.path} si carica senza errori`, async ({ page }) => {
    const errori: string[] = []
    page.on('pageerror', (e) => errori.push(e.message))
    page.on('console', (m) => {
      if (m.type() === 'error') errori.push(m.text())
    })

    await page.goto(r.path)
    await expect(page.locator('h1')).toHaveText(r.h1)
    await expect(page.locator('footer')).toBeVisible()
    expect(errori, `errori in console su ${r.path}`).toEqual([])
  })
}

test('la 404 risponde', async ({ page }) => {
  await page.goto('/questa-non-esiste')
  await expect(page.getByText(/non è in vetrina/i)).toBeVisible()
})

test('chi-siamo non spedisce JS oltre alla shell', async ({ browser }) => {
  // "La shell" e' tutto cio' che ClientRouter + SiteChrome (l'unica isola
  // presente su OGNI pagina, per il dialog "Chiedi una carta") trascinano
  // con se': misurato sul sito costruito e' un numero a due cifre (dialog,
  // sheet, toast, quick-view...), non i 2-3 che si potrebbero immaginare
  // guardando solo il markup — da qui l'istruzione a misurare, non stimare.
  // Invece di congelare quel numero (fragile: cambia con ogni dipendenza
  // in piu' che SiteChrome si porta dietro, a prescindere da chi-siamo),
  // lo si confronta con /negozio: un'altra pagina senza alcuna isola
  // propria (zero `client:` nel suo .astro, come chi-siamo). Le due
  // devono spedire esattamente lo stesso numero di script — se un giorno
  // chi-siamo guadagnasse un'isola tutta sua, il conteggio si scosterebbe
  // da quello di negozio, non da una soglia indovinata.
  async function scriptDi(path: string): Promise<string[]> {
    const context = await browser.newContext()
    const page = await context.newPage()
    const js: string[] = []
    page.on('request', (r) => {
      if (r.resourceType() === 'script') js.push(r.url())
    })
    await page.goto(path)
    await page.waitForLoadState('networkidle')
    await context.close()
    return js
  }

  const [negozio, chiSiamo] = await Promise.all([scriptDi('/negozio'), scriptDi('/chi-siamo')])
  expect(chiSiamo.length, `script su chi-siamo: ${chiSiamo.join(', ')}`).toEqual(negozio.length)
})
