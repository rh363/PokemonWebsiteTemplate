import { expect, test } from '@playwright/test'

// L'anteprima rapida (quick-view) e' l'unico punto del sito dove tre cose si
// incontrano: un click delegato su HTML statico (NavBar.astro), uno store di
// modulo condiviso (~/stores/chrome) e la navigazione soft di <ClientRouter />.
// I due test qui sotto presidiano proprio quell'incrocio.

/** Apre l'anteprima rapida della prima tessera del catalogo e la restituisce.
 *  Attende che CatalogApp abbia nascosto #cat-static (stessa attesa di
 *  catalogo.spec.ts) cosi' la tessera cliccata e' sempre quella viva e non la
 *  copia statica di fallback, che dopo l'idratazione e' display:none. */
async function apriAnteprima(page: import('@playwright/test').Page) {
  await page.goto('/catalogo')
  await page.waitForFunction(() => document.getElementById('cat-static')?.hasAttribute('hidden'))
  await page.locator('[data-card]:visible').first().click()
  const anteprima = page.locator('dialog[open]')
  await expect(anteprima).toBeVisible()
  return anteprima
}

test('“Vedi la scheda” naviga e chiude l anteprima', async ({ page }) => {
  // Lo store che tiene aperta l'anteprima e' stato di modulo: sopravvive alla
  // navigazione soft di ClientRouter, che non rivaluta i moduli gia' caricati.
  // Senza una pulizia esplicita allo swap, la scheda si apre sotto un dialog
  // rimasto aperto sopra — e' il bug segnalato.
  const anteprima = await apriAnteprima(page)
  await anteprima.getByRole('link', { name: 'Vedi la scheda' }).click()
  await page.waitForURL(/\/carta\//)
  // Il dialog non riappare subito: l'isola della pagina nuova idrata su idle
  // e poi risolve lo slug con una fetch. Verificare troppo presto passerebbe
  // anche col difetto in piedi — di qui l'attesa che l'isola sia viva e la
  // rete ferma, che e' il primo momento in cui il difetto sarebbe visibile.
  await page.waitForFunction(() => !document.querySelector('astro-island[ssr]'))
  await page.waitForLoadState('networkidle')
  await expect(page.locator('dialog[open]')).toHaveCount(0)
  // Sheet e Dialog bloccano lo scroll del body mentre sono aperti. Chiudendo
  // gli store allo swap si passa da un dialog aperto a nessuno senza che il
  // componente possa ripristinare nulla: il body nuovo deve nascere libero.
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden')
})

test('su mobile il bottom sheet occupa tutta la larghezza', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'sopra 1080px l anteprima e un Dialog centrato, non uno Sheet')
  const sheet = await apriAnteprima(page)
  await expect(sheet).toHaveClass(/ds-sheet/)
  const box = (await sheet.boundingBox())!
  const viewport = page.viewportSize()!
  expect({ x: box.x, width: box.width }).toEqual({ x: 0, width: viewport.width })
})

test('su mobile il bottom sheet non taglia il contenuto', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'sopra 1080px l anteprima e un Dialog centrato, non uno Sheet')
  const sheet = await apriAnteprima(page)
  // Il foglio entra con sheetUp, che lo trasla verso l'alto: misurarne la
  // posizione prima della fine dell'animazione leggerebbe un fotogramma
  // qualsiasi della salita, non il posto in cui si ferma.
  await sheet.evaluate((d) => Promise.all(d.getAnimations().map((a) => a.finished)))
  // Il foglio e' un flex column senza altezza propria: e' il contenuto a
  // dettarla, fino al tetto di max-height. Finche' resta sotto quel tetto
  // nessuno dei tre pezzi puo' essere compresso — se il body si accorcia
  // sotto il proprio scrollHeight vuol dire che la sua altezza non arriva
  // piu' dal contenuto, ed e' esattamente il difetto visto su iOS Safari:
  // body collassato a zero, scheda tagliata dopo pochi pixel.
  const misure = await sheet.evaluate((d) => {
    const body = d.querySelector('.ds-sheet__body') as HTMLElement
    const foot = d.querySelector('.ds-sheet__foot') as HTMLElement
    return {
      altezzaFoglio: d.getBoundingClientRect().height,
      tetto: parseFloat(getComputedStyle(d).maxHeight),
      bodyVisibile: body.clientHeight,
      bodyContenuto: body.scrollHeight,
      fondoFooter: foot.getBoundingClientRect().bottom,
      viewport: window.innerHeight,
    }
  })
  expect(misure.altezzaFoglio).toBeLessThan(misure.tetto)
  expect(misure.bodyVisibile).toBeGreaterThanOrEqual(misure.bodyContenuto)
  // E il footer con i due bottoni deve restare dentro il viewport, non
  // finire sotto le barre del browser.
  expect(misure.fondoFooter).toBeLessThanOrEqual(misure.viewport + 1)
})
