import { expect, test } from '@playwright/test'

test('la carta grande e visibile su ogni viewport', async ({ page }) => {
  // La carta della scheda e' un .ds-cardart: width:100%, aspect-ratio, e
  // dentro solo figli in position:absolute — larghezza intrinseca zero.
  // Basta quindi un contenitore che la dimensioni sul contenuto invece che
  // sulla colonna (era justify-items:center su .det-fix sotto 1080px) e
  // sparisce del tutto, senza rompere nient'altro nella pagina: nessuna
  // altra verifica del sito se ne accorgeva. Qui si misura la sola cosa che
  // conta davvero — che la carta occupi spazio.
  await page.goto('/carta/fulmine-solare-eco-035')
  const carta = page.locator('.det-fix .ds-cardart')
  await expect(carta).toBeVisible()
  const box = (await carta.boundingBox())!
  expect(box.width).toBeGreaterThan(200)
  expect(box.height).toBeGreaterThan(280)
})
