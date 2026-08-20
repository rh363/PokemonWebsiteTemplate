import { expect, test } from '@playwright/test'

// Attende che CatalogApp (client:load) abbia preso il controllo: e' il
// momento in cui nasconde #cat-static (catalogo.astro) mettendo l'attributo
// `hidden`. Da quel momento il markup statico di fallback esce dall'albero
// di accessibilita' (display:none), quindi i locator per ruolo (checkbox,
// combobox) smettono di trovare due corrispondenze — la statica e quella
// idratata — e risolvono sempre alla sola versione viva. Senza quest'attesa
// il test e' una corsa contro l'idle callback che l'isola usa apposta per
// la vista di default (vedi il commento in CatalogApp.svelte): a volte si
// interagisce ancora con la copia statica, che non fa nulla.
async function attendiIdratazione(page: import('@playwright/test').Page): Promise<void> {
  await page.waitForFunction(() => document.getElementById('cat-static')?.hasAttribute('hidden'))
}

test('i filtri in querystring sono applicati all apertura', async ({ page, isMobile }) => {
  // Sotto 1080px .side sparisce (layout.css): i filtri vivono nello Sheet
  // che si apre dal bottone "Filtri", non nella pagina. Qui si verifica la
  // logica di parsing della querystring, non il layout responsive — basta
  // il profilo desktop, dove i checkbox sono sempre nel documento.
  test.skip(isMobile, 'i filtri stanno nello Sheet mobile sotto 1080px, non nella pagina')
  await page.goto('/catalogo?rar=holo')
  await expect(page.getByRole('checkbox', { name: /Holo/ })).toBeChecked()
})

test('filtrare aggiorna URL e risultati, e Indietro ripristina', async ({ page, isMobile }) => {
  test.skip(isMobile, 'i filtri stanno nello Sheet mobile sotto 1080px, non nella pagina')
  await page.goto('/catalogo')
  await attendiIdratazione(page)
  const griglia = page.locator('[data-card]:visible')
  const prima = await griglia.count()
  // Checkbox.svelte nasconde l'<input> reale (width/height:0, opacity:0) e
  // disegna la casella accanto dentro il <label> per lo stile — un pattern
  // "visivamente nascosto ma accessibile" voluto cosi' (vedi il commento
  // nel componente): niente da correggere li', ma un <input> 0×0 non ha un
  // punto valido su cui simulare un click puntatore. Un utente vero clicca
  // il <label> (la casella disegnata, o il testo): il browser attiva da
  // solo l'<input> che avvolge — stessa cosa qui, ed e' anche piu' fedele
  // di un click forzato sull'elemento invisibile. `:visible` esclude la
  // copia statica di #cat-static (nascosta ma ancora nel DOM).
  await page.locator('label.ds-checkbox:visible', { hasText: 'Ultra rara' }).click()
  await expect(page).toHaveURL(/rar=ultra/)
  await expect(griglia).not.toHaveCount(prima)
  await page.goBack()
  await expect(page).not.toHaveURL(/rar=ultra/)
})

test('la ricerca trova per codice espansione', async ({ page }) => {
  await page.goto('/catalogo')
  await attendiIdratazione(page)
  // SearchField (src/components/ds/SearchField.svelte) e' un combobox ARIA
  // — ha un elenco di suggerimenti — non un semplice campo di ricerca:
  // role="combobox" e' il ruolo accessibile reale, non "searchbox". Il
  // nome lo disambigua dal <select> dell'ordinamento (anche lui, a norma
  // ARIA, un combobox): senza un nome i due si confondono.
  await page.getByRole('combobox', { name: /cerca/i }).fill('ALB')
  await expect(page.locator('[data-card]:visible').first()).toBeVisible()
})

test('il catalogo mostra carte anche senza JavaScript', async ({ browser }) => {
  // Il test che protegge davvero la scelta architetturale (spec §6.1): la
  // griglia di /catalogo e' HTML statico prerenderizzato da catalogo.astro,
  // non un prodotto dell'isola. Con JS disattivato CatalogApp (client:load)
  // non idrata mai — il suo `{#if mostraApp}` (mostraApp parte `false`)
  // resta per sempre vuoto lato client, quindi l'unica fonte di `[data-card]`
  // possibile e' il markup statico di #cat-static. Se in futuro la griglia
  // si spostasse dentro l'isola (o #cat-static sparisse), qui il conteggio
  // crollerebbe a 0 tessere, non a un numero diverso da 24: non c'e' modo
  // di "far vedere per sbaglio" 24 carte senza che siano davvero statiche.
  const ctx = await browser.newContext({ javaScriptEnabled: false })
  const page = await ctx.newPage()
  await page.goto('/catalogo')
  await expect(page.locator('[data-card]')).toHaveCount(24)
  await ctx.close()
})
