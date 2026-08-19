# Cartafolia — Piano di implementazione

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Trasformare il prototipo React/SPA «Cartafolia» in un sito Astro statico con isole Svelte 5, visivamente identico all'originale, deployato su Cloudflare Workers static assets.

**Architecture:** MPA Astro 7 `output: 'static'`. Il design system è portato da React a Svelte 5 preservando i token CSS verbatim; tutti gli stati hover/press passano da stato JavaScript a CSS, così le pagine senza interazione escono a 0 KB di JS. Il catalogo è un'isola che parla HTTP (`/api/catalog.json`), non filesystem: è il seam che permetterà di sostituire i file statici con Supabase senza toccare i componenti.

**Tech Stack:** Astro 7.2, Svelte 5.56 (runes), TypeScript strict, Vitest, Playwright, oxlint, Cloudflare Workers static assets, wrangler 4, pnpm 11, Node 22.

**Spec:** `docs/superpowers/specs/2026-08-18-cartafolia-astro-design.md`

---

## Global Constraints

Questi vincoli valgono per **ogni** task. Non vengono ripetuti nei singoli task.

- **Node 22, pnpm 11.** Mai `npm install` in questo repository.
- **Nessun Tailwind, nessuna utility class.** Lo stile passa esclusivamente dai token CSS del design system.
- **Nessun valore hardcoded al posto di un token.** Se il prototipo scrive `var(--sp-4)`, il porting scrive `var(--sp-4)`, non `16px`. Fanno eccezione i valori che il prototipo stesso scrive come numeri nudi (per esempio `gap: 12` in `CardTile`, `padding: "8px 16px"` in `Button`): quelli si copiano così come sono. La regola è **fedeltà letterale alla sorgente**, non normalizzazione.
- **Lingua dell'interfaccia: italiano.** Tutte le stringhe visibili, gli `aria-label` e i messaggi di errore sono in italiano, copiati alla lettera dal prototipo.
- **Fonte di verità per il porting:** `design-reference/_ds/_ds_bundle.js` e i file `.jsx` in `design-reference/`. Ogni task che porta un componente cita l'intervallo di righe esatto.
- **TypeScript strict.** `astro check` deve passare senza errori a ogni commit.
- **Commit frequenti**, uno per task completato, messaggio in italiano, corpo che spiega il perché.
- **Nessun segreto nel repository.** `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID` vivono solo nei GitHub Secrets.
- **Alias di import:** `~/` → `src/`. Configurato in `tsconfig.json`.

### Conversione hover/press da JavaScript a CSS

Il prototipo tiene gli stati di interazione in `React.useState`. Il porting li sposta in CSS **con gli stessi identici valori**. Regola generale, valida per tutti i componenti:

| Prototipo | Porting |
|---|---|
| `onMouseEnter`/`onMouseLeave` + `hover ? A : B` | `@media (hover:hover){ .x:hover{ …A } }`, con `B` come stato base |
| `onMouseDown`/`onMouseUp` + `press ? A : B` | `.x:active{ …A }` |
| `disabled ? A : B` | `.x:disabled{ …A }` / `.x[aria-disabled="true"]{ …A }` |

Il wrapper `@media (hover:hover)` serve a evitare l'hover appiccicoso sui dispositivi touch. È una correzione di comportamento su mobile, invisibile su desktop, ed è l'unica differenza consapevole rispetto al prototipo in questa conversione.

**Non convertire in CSS** ciò che dipende dalla posizione del puntatore: il tilt 3D di `CardTile` e `CardArt` (`rotateX`/`rotateY` calcolati dalle coordinate del mouse) resta JavaScript.

---
## Struttura dei file

Ogni file ha una responsabilità sola. La divisione è per responsabilità, non per layer tecnico: i componenti del catalogo stanno insieme, non sparsi fra «components» e «utils».

| File | Responsabilità |
|---|---|
| `src/styles/tokens/*.css` | I 9 file di token, copiati verbatim dal design system. **Non si modificano mai.** |
| `src/styles/ds.css` | Le classi dei componenti del design system: layout base e stati hover/press convertiti da JS a CSS |
| `src/styles/layout.css` | Le utility di pagina del prototipo (`.wrap`, `.sez`, `.g2`, `.g3`, `.cards`, `.cat`, `.det`, `.foot`) e le media query |
| `src/config/site.ts` | Branding: nome negozio, indirizzo, orari, social, SEO. **L'unico file che il cliente tocca per il branding** |
| `src/content.config.ts` | Schemi Zod delle collection `cards` e `sets` |
| `src/lib/catalog/types.ts` | `Card`, `Set`, `CardQuery`, `Page<T>`, `CatalogSource`. Nessuna logica |
| `src/lib/catalog/query.ts` | Filtri, ordinamento, paginazione. Funzioni pure, nessun I/O |
| `src/lib/catalog/search.ts` | Costruzione haystack e scan. Funzioni pure |
| `src/lib/catalog/source.static.ts` | Implementa `CatalogSource` leggendo le content collections. Usato **solo a build time** |
| `src/lib/catalog/index.ts` | Facade: è ciò che le pagine `.astro` importano |
| `src/lib/demo/prng.ts` | PRNG seeded del prototipo, portato identico. Genera i dati demo |
| `src/lib/icons/index.ts` | Path SVG Lucide inline, solo le icone usate |
| `src/integrations/catalog-index.ts` | Integration Astro: emette `/api/catalog.json` e `/api/search-index.json` a build time |
| `src/stores/chrome.ts` | Store condiviso fra isole: dialog «Chiedi», sheet mobile, toast |
| `src/components/ds/*.svelte` | I 26 componenti del design system |
| `src/components/islands/*.svelte` | Componenti con stato: `CatalogApp`, `SiteChrome`, `CardViewer`, `QuickView`, `HeroSearch`, `SetTabs` |
| `src/layouts/Base.astro` | Shell: `<head>`, NavBar statica, Footer, `SiteChrome` |
| `src/pages/*.astro` | Una pagina per rotta |

---

# FASE 0 — Fondamenta

### Task 1: Scaffold del progetto e riferimento di design

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `.prettierrc`, `.prettierignore`, `oxlintrc.json`
- Create: `design-reference/` (popolata dal progetto Claude Design)
- Create: `src/pages/index.astro` (segnaposto minimo, sostituito al Task 18)

**Interfaces:**
- Consumes: niente, è il primo task
- Produces: `pnpm dev` sulla porta 4321, `pnpm dev:ref` sulla porta 4322, alias `~/` → `src/`

- [ ] **Step 1: Inizializzare il progetto e installare le dipendenze**

```bash
cd /home/alex/WebstormProjects/PokemonWebsiteTemplate
pnpm init
pnpm add astro@^7.2.2 svelte@^5.56.9 @astrojs/svelte@^9.0.1 @astrojs/sitemap@^3.7.3
pnpm add csv-parse@^7.0.2
pnpm add -D typescript@^5 vitest@^3 @playwright/test@^1 oxlint@^1 \
  prettier@^3 prettier-plugin-svelte@^3 prettier-plugin-astro@^0 \
  wrangler@^4.123.0 serve@^14
```

- [ ] **Step 2: Scrivere `package.json`**

Sostituire il blocco `scripts` con:

```json
{
  "name": "cartafolia",
  "type": "module",
  "version": "0.1.0",
  "scripts": {
    "dev": "astro dev --port 4321",
    "dev:ref": "serve design-reference -l 4322",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "lint": "oxlint --config oxlintrc.json src",
    "format": "prettier --write .",
    "deploy": "pnpm build && wrangler deploy"
  }
}
```

`dev:ref` serve il prototipo originale su `:4322` per il confronto visivo del Task 25.

- [ ] **Step 3: Scrivere `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config'
import svelte from '@astrojs/svelte'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://cartafolia.example',   // Task 24: sostituire col dominio reale
  output: 'static',
  integrations: [svelte(), sitemap()],
  build: { inlineStylesheets: 'auto' },
  vite: { resolve: { alias: { '~': new URL('./src', import.meta.url).pathname } } },
})
```

- [ ] **Step 4: Scrivere `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist", "design-reference"],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "~/*": ["src/*"] },
    "verbatimModuleSyntax": true
  }
}
```

`design-reference` è escluso: è codice React del prototipo, non deve essere type-checkato.

- [ ] **Step 5: Scrivere `.prettierrc` e `.gitignore`**

`.prettierrc`:

```json
{
  "semi": false,
  "singleQuote": true,
  "printWidth": 100,
  "plugins": ["prettier-plugin-svelte", "prettier-plugin-astro"],
  "overrides": [
    { "files": "*.astro", "options": { "parser": "astro" } },
    { "files": "*.svelte", "options": { "parser": "svelte" } }
  ]
}
```

Aggiungere `.prettierignore` con `dist/`, `.astro/`, `design-reference/`, `src/content/`: il riferimento di design e i contenuti generati non vanno riformattati.

`.gitignore`:

```
node_modules/
dist/
.astro/
.wrangler/
test-results/
playwright-report/
.env
.env.*
!.env.example
.DS_Store
```

- [ ] **Step 6: Popolare `design-reference/` dal progetto Claude Design**

Usare il tool `DesignSync` con `method: "get_file"` e `projectId: "2f20bb1a-1b71-4f87-a1c6-dc996440a770"`, salvando ogni file mantenendo i percorsi relativi. `_ds/_ds_bundle.js` è già presente.

File da scaricare:

```
index.html
assets/logo.svg
assets/logo-mark.svg
dati.jsx  pezzi.jsx  vetrina.jsx  catalogo.jsx  carta.jsx
espansioni.jsx  negozio.jsx  about.jsx  guscio.jsx
_ds/cartafolia-design-system-3cbf7559-ef12-4ca1-9d34-2c119fcda054/styles.css
_ds/cartafolia-design-system-3cbf7559-ef12-4ca1-9d34-2c119fcda054/_adherence.oxlintrc.json
_ds/cartafolia-design-system-3cbf7559-ef12-4ca1-9d34-2c119fcda054/tokens/base.css
_ds/cartafolia-design-system-3cbf7559-ef12-4ca1-9d34-2c119fcda054/tokens/colors.css
_ds/cartafolia-design-system-3cbf7559-ef12-4ca1-9d34-2c119fcda054/tokens/effects.css
_ds/cartafolia-design-system-3cbf7559-ef12-4ca1-9d34-2c119fcda054/tokens/elevation.css
_ds/cartafolia-design-system-3cbf7559-ef12-4ca1-9d34-2c119fcda054/tokens/fonts.css
_ds/cartafolia-design-system-3cbf7559-ef12-4ca1-9d34-2c119fcda054/tokens/motion.css
_ds/cartafolia-design-system-3cbf7559-ef12-4ca1-9d34-2c119fcda054/tokens/radius.css
_ds/cartafolia-design-system-3cbf7559-ef12-4ca1-9d34-2c119fcda054/tokens/spacing.css
_ds/cartafolia-design-system-3cbf7559-ef12-4ca1-9d34-2c119fcda054/tokens/typography.css
```

Il percorso lungo `_ds/cartafolia-design-system-.../` va **mantenuto identico**, altrimenti `index.html` del prototipo non risolve i suoi `<link>` e il confronto visivo del Task 25 non funziona.

- [ ] **Step 7: Verificare che il prototipo giri**

```bash
pnpm dev:ref
```

Aprire `http://localhost:4322/index.html`. Atteso: la home «Cartafolia» si renderizza, con hero, griglia carte e footer. Se la pagina è bianca, controllare la console: significa che manca un `.jsx` o che il percorso `_ds/` è stato accorciato.

- [ ] **Step 8: Segnaposto minimo e verifica del dev server**

`src/pages/index.astro`:

```astro
---
---
<html lang="it">
  <head><meta charset="utf-8" /><title>Cartafolia</title></head>
  <body><h1>Cartafolia</h1></body>
</html>
```

```bash
pnpm dev
```
Atteso: `http://localhost:4321` mostra «Cartafolia». Poi `pnpm check` → 0 errori.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: scaffold Astro 7 + Svelte 5 e riferimento di design

Il prototipo originale entra nel repository sotto design-reference/ e viene
servito su :4322 da 'pnpm dev:ref'. Serve al confronto visivo affiancato che
e' il meccanismo di verifica della fedelta' al design (pilastro 1)."
```

---

### Task 2: Spike — store condiviso fra isole

La spec §6.3 dichiara un'assunzione da verificare **prima** di iniziare il porting: che due isole Svelte distinte sulla stessa pagina condividano l'istanza di uno store importato a livello di modulo. Se non regge, cambia il modo in cui le pagine pilotano `SiteChrome`, e scoprirlo dopo aver portato 26 componenti sarebbe costoso.

**Files:**
- Create: `src/stores/chrome.ts`, `src/components/islands/__spike/Emitter.svelte`, `src/components/islands/__spike/Receiver.svelte`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Produces: conferma (o smentita) del meccanismo di comunicazione usato dal Task 14

- [ ] **Step 1: Scrivere lo store minimo**

`src/stores/chrome.ts`:

```ts
import { writable } from 'svelte/store'

export const spikeCounter = writable(0)
```

- [ ] **Step 2: Scrivere le due isole**

`src/components/islands/__spike/Emitter.svelte`:

```svelte
<script lang="ts">
  import { spikeCounter } from '~/stores/chrome'
</script>

<button onclick={() => spikeCounter.update((n) => n + 1)}>incrementa</button>
```

`src/components/islands/__spike/Receiver.svelte`:

```svelte
<script lang="ts">
  import { spikeCounter } from '~/stores/chrome'
</script>

<p data-testid="spike-value">valore: {$spikeCounter}</p>
```

- [ ] **Step 3: Montarle come isole separate**

In `src/pages/index.astro`, dentro `<body>`:

```astro
---
import Emitter from '~/components/islands/__spike/Emitter.svelte'
import Receiver from '~/components/islands/__spike/Receiver.svelte'
---
<Emitter client:load />
<Receiver client:load />
```

Devono essere **due direttive `client:` distinte**: è questo che le rende isole separate.

- [ ] **Step 4: Verificare — due prove indipendenti**

La verifica deve essere automatica: «aprire il browser e cliccare» non è eseguibile né ripetibile.

**Prova A — comportamentale, con Playwright.** È quella che conta.

```bash
pnpm exec playwright install chromium
```

`scripts/spike-store.mjs` (file usa e getta, cancellato allo Step 6):

```js
import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage()
const errori = []
page.on('pageerror', (e) => errori.push(e.message))
await page.goto('http://localhost:4321/')
await page.getByRole('button', { name: 'incrementa' }).click({ clickCount: 3, delay: 50 })
const testo = await page.getByTestId('spike-value').textContent()
await browser.close()
console.log('valore letto:', JSON.stringify(testo))
console.log('errori di pagina:', errori.length ? errori : 'nessuno')
console.log(testo?.includes('3') ? 'ESITO: store CONDIVISO' : 'ESITO: store NON condiviso')
```

Avviare `pnpm dev` in background, eseguire `node scripts/spike-store.mjs`, poi fermare il server.

- **Atteso se l'assunzione regge:** `valore: 3` → store condiviso.
- **Se resta `valore: 0`:** le isole hanno istanze separate, l'assunzione è smentita.

**Prova B — strutturale, sul build.** Spiega *perché* il risultato è quello che è.

```bash
pnpm build
grep -rl 'spikeCounter\|writable' dist/_astro/*.js | head
```

Se lo store finisce in **un solo chunk** importato da entrambe le isole, l'istanza è condivisa: due `import` dello stesso URL restituiscono lo stesso modulo. Se ogni isola porta la propria copia dello store, non lo è.

Le due prove devono concordare. **Se discordano, riportare BLOCKED**: significa che il meccanismo non è quello che crediamo, e proseguire su un'assunzione sbagliata costerebbe il Task 15 intero.

- [ ] **Step 5: Registrare l'esito nella spec**

Aggiungere in fondo a `docs/superpowers/specs/2026-08-18-cartafolia-astro-design.md` §6.3 una riga: `**Esito della verifica (data):** confermata` oppure `smentita — si usa CustomEvent su window`.

Se smentita, il Task 14 usa questo contratto al posto dello store:

```ts
// src/stores/chrome.ts — variante CustomEvent
export type ChromeEvent =
  | { type: 'ask'; card: Card | null }
  | { type: 'quick'; card: Card }
  | { type: 'toast'; title: string; description: string; tone: 'success' | 'info' }

export const emitChrome = (e: ChromeEvent) =>
  window.dispatchEvent(new CustomEvent('cartafolia:chrome', { detail: e }))

export const onChrome = (fn: (e: ChromeEvent) => void) => {
  const h = (ev: Event) => fn((ev as CustomEvent<ChromeEvent>).detail)
  window.addEventListener('cartafolia:chrome', h)
  return () => window.removeEventListener('cartafolia:chrome', h)
}
```

- [ ] **Step 6: Rimuovere lo spike e committare**

Vanno via **tutti** i pezzi dello spike: le due isole, lo store (che al Task 15 verra' ricreato con il contenuto vero), lo script di verifica e le modifiche a `index.astro`. Se `index.astro` restasse a importare componenti cancellati, il build si romperebbe al Task 3.

```bash
rm -rf src/components/islands/__spike
rm -f src/stores/chrome.ts scripts/spike-store.mjs
git checkout -- src/pages/index.astro   # torna al segnaposto del Task 1
git add -A
git commit -m "spike: verificata la condivisione dello store fra isole Svelte

Lo spike e' rimosso; resta l'esito annotato nella spec, che decide il
meccanismo con cui le pagine pilotano SiteChrome nel Task 14."
```

---
### Task 3: Token CSS e webfont self-hosted

**Files:**
- Create: `src/styles/tokens/{base,colors,effects,elevation,fonts,motion,radius,spacing,typography}.css`
- Create: `src/styles/global.css`, `src/styles/layout.css`

**Interfaces:**
- Consumes: `design-reference/_ds/cartafolia-design-system-*/tokens/*.css` (Task 1)
- Produces: tutte le custom property del design system disponibili globalmente; `.wrap`, `.sez`, `.g2`, `.hero`, `.g3`, `.cards`, `.cat`, `.side`, `.det`, `.det-fix`, `.foot`, `.only-mob`, `.hide-mob`, `.rise`, `.fade-in`, `.sheet-in`

- [ ] **Step 1: Installare i webfont**

```bash
pnpm add @fontsource-variable/bricolage-grotesque@^5.3.0 \
         @fontsource-variable/plus-jakarta-sans@^5.3.0 \
         @fontsource-variable/jetbrains-mono@^5.3.0
```

- [ ] **Step 2: Copiare gli 8 file di token che non cambiano**

```bash
SRC=design-reference/_ds/cartafolia-design-system-3cbf7559-ef12-4ca1-9d34-2c119fcda054/tokens
mkdir -p src/styles/tokens
for f in base colors effects elevation motion radius spacing typography; do
  cp "$SRC/$f.css" "src/styles/tokens/$f.css"
done
```

**Copia byte per byte. Non riformattare, non riordinare, non «ripulire».** Questi file sono la fonte di verità della fedeltà visiva.

- [ ] **Step 3: Riscrivere `fonts.css`, l'unico che cambia**

Il file originale fa `@import url("https://fonts.googleapis.com/...")`, che blocca il rendering e aggiunge una dipendenza di rete. `src/styles/tokens/fonts.css`:

```css
/* I webfont sono self-hosted via @fontsource-variable (importati in global.css).
   L'originale caricava da Google Fonts con @import: render-blocking.
   Le tre famiglie e i loro fallback restano identici all'originale. */
:root{
  --font-display:"Bricolage Grotesque Variable","Bricolage Grotesque","Plus Jakarta Sans",system-ui,sans-serif;
  --font-body:"Plus Jakarta Sans Variable","Plus Jakarta Sans",system-ui,-apple-system,sans-serif;
  --font-mono:"JetBrains Mono Variable","JetBrains Mono",ui-monospace,"SF Mono",Menlo,monospace;
}
```

I nomi `... Variable` sono quelli che registra `@fontsource-variable`; i nomi originali restano come fallback immediato.

- [ ] **Step 4: Scrivere `src/styles/global.css`**

```css
@import '@fontsource-variable/bricolage-grotesque';
@import '@fontsource-variable/plus-jakarta-sans';
@import '@fontsource-variable/jetbrains-mono';

@import './tokens/fonts.css';
@import './tokens/colors.css';
@import './tokens/typography.css';
@import './tokens/spacing.css';
@import './tokens/radius.css';
@import './tokens/elevation.css';
@import './tokens/motion.css';
@import './tokens/effects.css';
@import './tokens/base.css';

@import './layout.css';
@import './ds.css';
```

L'ordine degli import dei token è **lo stesso di `_ds/styles.css`** e non va cambiato: `base.css` deve venire per ultimo perché consuma i token definiti sopra.

- [ ] **Step 5: Scrivere `src/styles/layout.css`**

Copiare il blocco `<style>` di `design-reference/index.html` **esclusa** la prima regola (`a{color:...}`, già in `base.css`) ed esclusa `#root span[style*="14cqw"]`, che era un workaround dell'anteprima del design system e non serve.

Contenuto atteso (verificarlo contro il sorgente, non fidarsi di questo estratto):

```css
.wrap{max-width:var(--page-max);margin:0 auto;padding-left:var(--gutter-lg);padding-right:var(--gutter-lg)}
.sez{padding-top:var(--section-y);padding-bottom:var(--section-y)}
.g2{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:var(--sp-12);align-items:center}
.hero{grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr)}
.g3{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:var(--sp-4)}
.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(var(--grid-card-min),1fr));gap:var(--grid-gap)}
.cat{display:grid;grid-template-columns:264px minmax(0,1fr);gap:var(--sp-10);align-items:start}
.side{position:sticky;top:92px;display:grid;gap:var(--sp-2)}
.det{display:grid;grid-template-columns:minmax(0,400px) minmax(0,1fr);gap:var(--sp-16);align-items:start}
.det-fix{position:sticky;top:100px;display:grid;gap:var(--sp-4)}
.foot{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:var(--sp-10)}
.only-mob{display:none!important}
.sheet-in{animation:sheetUp var(--dur-slow,340ms) var(--ease-out)}
@keyframes sheetUp{from{transform:translateY(101%)}to{transform:translateY(0)}}
.fade-in{animation:fadeIn 220ms var(--ease-out)}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.rise{animation:rise 340ms var(--ease-out) both}
@keyframes rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@media (max-width:1080px){.cat{grid-template-columns:minmax(0,1fr)}.hero{grid-template-columns:minmax(0,1fr)}.g2{grid-template-columns:minmax(0,1fr);gap:var(--sp-8)}.det{grid-template-columns:minmax(0,1fr);gap:var(--sp-8)}.det-fix{position:static;max-width:340px;margin-left:auto;margin-right:auto;justify-items:center}.foot{grid-template-columns:1fr 1fr}}
@media (max-width:1080px){.hide-mob{display:none!important}.only-mob{display:block!important}.side{display:none}}
@media (max-width:760px){:root{--fs-display-xl:42px;--fs-display-l:34px;--fs-display-m:27px;--fs-title-l:24px;--section-y:56px;--gutter-lg:20px;--grid-card-min:148px;--grid-gap:14px}.foot{grid-template-columns:minmax(0,1fr)}.g2{gap:var(--sp-6)}}
@media (prefers-reduced-motion:reduce){.rise,.fade-in,.sheet-in{animation:none}}
```

- [ ] **Step 6: Creare `src/styles/ds.css` vuoto**

```css
/* Classi dei componenti del design system.
   Popolato dai Task 9-14, un blocco per componente, in aggiunta.
   Nessun task riscrive questo file: ognuno accoda il proprio blocco
   preceduto da un commento che cita la sorgente nel bundle. */
```

Serve perché `global.css` lo importa già.

- [ ] **Step 7: Verificare che i token siano vivi**

In `src/pages/index.astro` importare `~/styles/global.css` e sostituire il body con:

```astro
<body>
  <div class="wrap sez">
    <h1 style="font:var(--type-hero);letter-spacing:var(--ls-display-xl)">Cartafolia</h1>
    <p style="font:var(--type-body);color:var(--text-muted)">Token attivi.</p>
  </div>
</body>
```

`pnpm dev` → il titolo deve essere in Bricolage Grotesque, molto grande, con tracking negativo stretto, su fondo `#FBF9F6`. Se il font è di sistema, `@fontsource` non è stato importato prima dei token.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: token del design system e webfont self-hosted

Gli 8 file di token sono copiati verbatim: sono la fonte di verita' della
fedelta' visiva. Solo fonts.css e' riscritto, per togliere l'@import da
Google Fonts che bloccava il rendering."
```

---

### Task 4: Icone Lucide locali

Il prototipo carica ogni glifo da `unpkg.com/lucide-static@0.446.0/icons/<nome>.svg` usando una CSS mask: una richiesta di rete per icona, a runtime, su ogni pagina. Le icone effettivamente usate sono **18**.

**Files:**
- Create: `src/lib/icons/index.ts`
- Create: `src/components/ds/Icon.svelte`
- Test: `src/lib/icons/icons.test.ts`

**Interfaces:**
- Produces: `type IconName`, `ICONS: Record<IconName, string>`, componente `Icon` con props `{ name: IconName; size?: number; label?: string; style?: string }`

- [ ] **Step 1: Scrivere il test che fissa l'inventario**

`src/lib/icons/icons.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { ICONS, ICON_NAMES } from './index'

const ATTESE = [
  'arrow-left', 'arrow-right', 'check', 'chevron-down', 'chevron-right',
  'clock', 'filter', 'heart', 'info', 'instagram', 'layers', 'list',
  'map-pin', 'message-circle', 'search', 'share-2', 'sparkles', 'x',
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
```

- [ ] **Step 2: Eseguire il test e verificare che fallisca**

Run: `pnpm test src/lib/icons`
Atteso: FAIL, `Failed to resolve import "./index"`.

- [ ] **Step 3: Generare `src/lib/icons/index.ts` dai sorgenti Lucide**

Usare la **stessa versione che il prototipo pinna**, `lucide-static@0.446.0`, così i glifi sono identici al pixel:

```bash
pnpm add -D lucide-static@0.446.0
node --input-type=module -e '
import { readFileSync, writeFileSync, mkdirSync } from "node:fs"
const names = ["arrow-left","arrow-right","check","chevron-down","chevron-right","clock","filter","heart","info","instagram","layers","list","map-pin","message-circle","search","share-2","sparkles","x"]
const body = s => s.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "").trim()
const entries = names.map(n => {
  const raw = readFileSync(`node_modules/lucide-static/icons/${n}.svg`, "utf8")
  return `  "${n}": ${JSON.stringify(body(raw))},`
}).join("\n")
mkdirSync("src/lib/icons", { recursive: true })
writeFileSync("src/lib/icons/index.ts", `// Generato da lucide-static@0.446.0, la stessa versione che il prototipo
// caricava da unpkg. Non modificare a mano: rigenerare con lo script del Task 4.
export const ICONS = {
${entries}
} as const

export type IconName = keyof typeof ICONS
export const ICON_NAMES = Object.keys(ICONS) as IconName[]
`)
'
pnpm remove lucide-static
```

`lucide-static` viene disinstallato subito dopo: serviva solo a generare, non è una dipendenza del sito.

- [ ] **Step 4: Eseguire il test e verificare che passi**

Run: `pnpm test src/lib/icons`
Atteso: PASS, 3 test.

- [ ] **Step 5: Scrivere `src/components/ds/Icon.svelte`**

Porting di `design-reference/_ds/_ds_bundle.js:499-533`. L'originale dipinge una CSS mask con `currentColor`; le icone Lucide sono stroke-only, quindi un `<svg stroke="currentColor" fill="none">` inline produce gli stessi pixel senza richieste di rete.

```svelte
<script lang="ts">
  import { ICONS, type IconName } from '~/lib/icons'

  let {
    name = 'sparkles' as IconName,
    size = 20,
    label = undefined as string | undefined,
    style = '',
  } = $props()
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  role={label ? 'img' : 'presentation'}
  aria-label={label}
  aria-hidden={label ? undefined : 'true'}
  style="display:inline-block;flex:none;{style}"
>{@html ICONS[name]}</svg>
```

`viewBox`, `stroke-width` e i `stroke-linecap`/`linejoin` sono i default di Lucide: vanno riprodotti esattamente o i glifi cambiano spessore.

`{@html}` qui è sicuro: il contenuto viene da un file generato in fase di build da un pacchetto npm, mai da input utente.

**La prop `color` del prototipo non viene portata, deliberatamente.** `design-reference/CONTRATTI-COMPONENTI.md` la elenca e il sorgente la implementa (`background: color || "currentColor"`), ma nessuno la passa mai: i quattro chiamanti nei `.jsx` usano `style={{color:…}}`, e dentro il bundle le occorrenze di `color` stanno anch'esse dentro `style`. È API morta già nell'originale, e `style` ottiene lo stesso risultato.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: icone Lucide inline, niente CDN a runtime

Il prototipo scaricava ogni glifo da unpkg via CSS mask: una richiesta di
rete per icona. Le 18 icone usate sono vendorizzate da lucide-static@0.446.0,
la stessa versione, quindi i glifi sono identici."
```

---
# FASE 1 — Strato dati

Questa fase è **interamente logica pura**: nessun DOM, nessun componente. È il posto giusto per il TDD, perché ogni funzione ha input e output espliciti e la semantica è già decisa dal prototipo — i test si scrivono leggendo `design-reference/catalogo.jsx`.

### Task 5: Tipi, configurazione del sito e dati demo

**Files:**
- Create: `src/lib/catalog/types.ts`, `src/lib/catalog/labels.ts`, `src/lib/demo/prng.ts`, `src/config/site.ts`
- Create: `scripts/seed-demo.ts`
- Create: `src/content/sets.json`, `src/content/cards.csv` (generati)
- Create: `src/content.config.ts`
- Test: `src/lib/demo/prng.test.ts`

**Interfaces:**
- Produces:
  - `type Rarity = 'common'|'uncommon'|'rare'|'holo'|'ultra'|'secret'`
  - `type Condition = 'mint'|'near-mint'|'excellent'|'good'|'played'`
  - `type SortKey = 'novita'|'rarita'|'az'|'espansione'`
  - `interface Card`, `interface CardSet`, `interface CardQuery`, `interface Page<T>`, `interface CatalogSource`
  - `RARITY_LABELS`, `CONDITION_LABELS`, `RARITY_RANK`, `LANGUAGES`, `FOIL_RARITIES`
  - `cardCode(card, set): string`, `cardSlug(card, set): string`
  - `SITE` da `~/config/site`

- [ ] **Step 1: Scrivere `src/lib/catalog/types.ts`**

```ts
export type Rarity = 'common' | 'uncommon' | 'rare' | 'holo' | 'ultra' | 'secret'
export type Condition = 'mint' | 'near-mint' | 'excellent' | 'good' | 'played'
export type SortKey = 'novita' | 'rarita' | 'az' | 'espansione'

export interface CardSet {
  id: string
  name: string
  code: string
  year: number
  total: number
  color: string
}

export interface Card {
  id: string
  slug: string
  name: string
  set: string
  num: string
  rarity: Rarity
  cond: Condition
  lang: string
  artist: string
  nuovo: boolean
  vetrina: number
  entrata: string
  ordine: number
  image?: string
}

export interface CardQuery {
  q?: string
  sets?: string[]
  rarity?: Rarity[]
  cond?: Condition[]
  lang?: string[]
  foil?: boolean
  sort?: SortKey
  page?: number
  perPage?: number
}

export interface Page<T> {
  items: T[]
  total: number
  page: number
  pages: number
}

/** Contratto dello strato dati. Oggi lo implementa source.static.ts leggendo
 *  le content collections; domani potra' implementarlo un adapter Supabase
 *  senza che i componenti cambino. */
export interface CatalogSource {
  listSets(): Promise<CardSet[]>
  listCards(q: CardQuery): Promise<Page<Card>>
  getCard(slug: string): Promise<Card | null>
}
```

- [ ] **Step 2: Scrivere `src/lib/catalog/labels.ts`**

Valori copiati da `design-reference/dati.jsx`. `PER_PAGINA` viene da `design-reference/catalogo.jsx`.

```ts
import type { Condition, Rarity, SortKey } from './types'

export const RARITY_LABELS: Record<Rarity, string> = {
  common: 'Comune', uncommon: 'Non comune', rare: 'Rara',
  holo: 'Holo', ultra: 'Ultra rara', secret: 'Segreta',
}

export const CONDITION_LABELS: Record<Condition, string> = {
  mint: 'Mint', 'near-mint': 'Near Mint', excellent: 'Excellent',
  good: 'Good', played: 'Played',
}

export const RARITY_RANK: Record<Rarity, number> = {
  common: 0, uncommon: 1, rare: 2, holo: 3, ultra: 4, secret: 5,
}

export const LANGUAGES = ['Italiano', 'Inglese', 'Giapponese'] as const
export const FOIL_RARITIES: Rarity[] = ['holo', 'ultra', 'secret']

/** Etichette dell'ordinamento, come le mostra il prototipo.
 *  Nota: 'az' usa una lineetta EN (U+2013), non un trattino. */
export const SORT_LABELS: Record<SortKey, string> = {
  novita: 'Novità', rarita: 'Rarità', az: 'A–Z', espansione: 'Espansione',
}

export const PER_PAGE = 24

/** Quante carte di un'espansione stanno in vetrina.
 *  Il prototipo (design-reference/dati.jsx) usa una stima fissa al 42%.
 *  Con dati reali questo diventera' un conteggio vero sulle carte schedate. */
export const inVetrina = (s: { total: number }) => Math.round(s.total * 0.42)
```

- [ ] **Step 3: Scrivere il test del PRNG**

`src/lib/demo/prng.test.ts`. I valori attesi sono quelli del generatore di Lehmer con moltiplicatore 16807, modulo 2147483647 e seme 7, cioè esattamente `design-reference/dati.jsx`.

```ts
import { describe, expect, it } from 'vitest'
import { createRng } from './prng'

describe('PRNG del prototipo', () => {
  it('riproduce la sequenza di Lehmer con seme 7', () => {
    const rng = createRng(7)
    expect(rng()).toBeCloseTo((7 * 16807 % 2147483647) / 2147483647, 12)
  })

  it('e deterministico: due istanze con lo stesso seme coincidono', () => {
    const a = createRng(7), b = createRng(7)
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
```

- [ ] **Step 4: Eseguire il test e verificare che fallisca**

Run: `pnpm test src/lib/demo`
Atteso: FAIL, `Failed to resolve import "./prng"`.

- [ ] **Step 5: Scrivere `src/lib/demo/prng.ts`**

```ts
/** PRNG del prototipo (design-reference/dati.jsx), portato identico:
 *  generatore di Lehmer, moltiplicatore 16807, modulo 2147483647.
 *  Serve a rigenerare gli stessi identici 100 record demo, il che rende
 *  possibile il confronto visivo affiancato col prototipo. */
export function createRng(seed = 7) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return s / 2147483647
  }
}

export const createPick =
  (rng: () => number) =>
  <T,>(arr: readonly T[]): T =>
    arr[Math.floor(rng() * arr.length)]!
```

- [ ] **Step 6: Eseguire il test e verificare che passi**

Run: `pnpm test src/lib/demo`
Atteso: PASS, 3 test.

- [ ] **Step 7: Scrivere `src/config/site.ts`**

Valori da `design-reference/dati.jsx`, oggetto `NEGOZIO`. **Questo è il file che il cliente modifica per il branding.**

```ts
/** Configurazione del sito. Per adattare il template a un negozio reale
 *  si modifica questo file e nient'altro. */
export const SITE = {
  brand: 'cartafolia',
  nome: 'Cartafolia',
  citta: 'Ceccano',
  via: 'via Roma 12',
  cap: '03023 Ceccano (FR)',
  orari: [
    ['Martedì – Sabato', '10:00 – 19:30'],
    ['Domenica', '15:00 – 19:00'],
    ['Lunedì', 'chiuso'],
  ] as const,
  social: [
    { id: 'instagram', icon: 'instagram', label: 'Instagram', valore: '@cartafolia.ceccano', href: '#' },
    { id: 'tiktok', icon: 'sparkles', label: 'TikTok', valore: '@cartafolia', href: '#' },
    { id: 'whatsapp', icon: 'message-circle', label: 'WhatsApp', valore: '+39 000 000 0000', href: '#' },
  ],
  seo: {
    titolo: 'Cartafolia — vetrina e catalogo, Ceccano',
    descrizione:
      'Vetrina e catalogo di carte da collezione a Ceccano. Cerca una carta, guarda com’è conservata, poi passa a vederla dal vero. Non vendiamo online.',
    locale: 'it_IT',
  },
  anno: 2026,
} as const
```

`social[].href` è `'#'` finché non arrivano i link reali (§13 della spec, domanda aperta 3).

- [ ] **Step 8: Scrivere lo script di seed**

`scripts/seed-demo.ts` riproduce la generazione di `design-reference/dati.jsx` e la **serializza su file**, così i dati demo diventano contenuto editabile invece che codice.

```ts
import { mkdirSync, writeFileSync } from 'node:fs'
import { createPick, createRng } from '../src/lib/demo/prng'
import type { Card, CardSet, Condition, Rarity } from '../src/lib/catalog/types'

const SETS: CardSet[] = [
  { id: 'alb', name: 'Alba Cromatica', code: 'ALB', year: 2024, total: 198, color: 'var(--cherry-500)' },
  { id: 'eco', name: 'Eco del Vulcano', code: 'ECO', year: 2024, total: 165, color: 'var(--lemon-500)' },
  { id: 'mar', name: 'Marea Silente', code: 'MAR', year: 2023, total: 172, color: 'var(--cyan-500)' },
  { id: 'rad', name: 'Radici Profonde', code: 'RAD', year: 2023, total: 154, color: 'var(--lime-500)' },
  { id: 'cie', name: 'Cieli Spezzati', code: 'CIE', year: 2022, total: 189, color: 'var(--grape-500)' },
  { id: 'for', name: 'Fornace Antica', code: 'FOR', year: 1999, total: 102, color: 'var(--ink-500)' },
]

const NOMI = ['Fulmine','Guardiano','Ala','Serpe','Riccio','Scudo','Volpe','Coleottero','Lupo','Rana','Falco','Tartaruga','Cervo','Salamandra','Gufo','Tasso','Corvo','Lince','Granchio','Pipistrello','Ariete','Talpa','Cavalletta','Anguilla','Istrice']
const QUAL = ['di Notte',"di Bosco",'di Cenere','di Marea','di Quarzo','di Bruma',"d'Ottone",'di Vetro','di Pioggia','di Sale','di Ferro',"d'Ambra",'di Nebbia','di Brace','di Sabbia',"d'Argento",'di Pietra','Cremisi','Solare','di Lampo']
const RAR: Rarity[] = ['common','common','common','common','uncommon','uncommon','uncommon','rare','rare','holo','holo','ultra','secret']
const COND: Condition[] = ['mint','near-mint','near-mint','excellent','excellent','good','good','played']
const LANG = ['Italiano','Italiano','Italiano','Italiano','Inglese','Inglese','Giapponese']
const ART = ['M. Ferretti','S. Adani','L. Bonetti','G. Prandi','R. Colella','ignoto']
const MESI = ['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','settembre','ottobre','novembre']

const slugify = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '')
   .toLowerCase().replace(/['’]/g, '-').replace(/[^a-z0-9]+/g, '-')
   .replace(/^-+|-+$/g, '')

const rnd = createRng(7)
const pick = createPick(rnd)

const cards: Card[] = []
const visti = new Set<string>()
while (cards.length < 100) {
  const name = `${pick(NOMI)} ${pick(QUAL)}`
  if (visti.has(name)) continue
  visti.add(name)
  const s = pick(SETS)
  const n = 1 + Math.floor(rnd() * s.total)
  const i = cards.length + 1
  const num = `${String(n).padStart(3, '0')}/${s.total}`
  cards.push({
    id: String(i),
    slug: `${slugify(name)}-${s.code.toLowerCase()}-${String(n).padStart(3, '0')}`,
    name, set: s.id, num,
    rarity: pick(RAR), cond: pick(COND), lang: pick(LANG), artist: pick(ART),
    nuovo: i <= 9,
    vetrina: 1 + Math.floor(rnd() * 4),
    entrata: `${1 + Math.floor(rnd() * 27)} ${pick(MESI)}`,
    ordine: Math.floor(rnd() * 1000),
  })
}

const slugs = new Set(cards.map((c) => c.slug))
if (slugs.size !== cards.length) throw new Error('slug duplicati fra le carte demo')

const COLONNE = [
  'id','slug','name','set','num','rarity','cond','lang','artist',
  'nuovo','vetrina','entrata','ordine','image',
] as const

/** Virgolette solo dove servono: virgola, virgoletta o a capo nel valore. */
const cella = (v: unknown) => {
  const t = v == null ? '' : String(v)
  return /[",\n]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t
}

mkdirSync('src/content', { recursive: true })
writeFileSync('src/content/sets.json', JSON.stringify(SETS, null, 2) + '\n')
writeFileSync(
  'src/content/cards.csv',
  [COLONNE.join(','), ...cards.map((c) => COLONNE.map((k) => cella((c as any)[k])).join(','))]
    .join('\n') + '\n',
)
console.log(`generate ${cards.length} carte e ${SETS.length} espansioni`)
```

**Perche' CSV e non un file JSON per carta.** Una carta non e' un documento, e' una riga di tabella: quindici campi piatti, nessun corpo. Un file per record non scala (5.000 carte = 5.000 file) e soprattutto nessuno lo aggiornerebbe a mano. Il catalogo arrivera' da un foglio di calcolo del negozio, e CSV e' cio' che un foglio esporta e cio' che Supabase importa nativamente.

**L'ordine delle chiamate a `rnd()` deve restare identico a `dati.jsx`**, altrimenti i dati demo divergono e il confronto visivo del Task 25 non è più 1:1.

- [ ] **Step 9: Eseguire il seed**

```bash
pnpm add -D tsx
pnpm tsx scripts/seed-demo.ts
wc -l src/content/cards.csv    # atteso: 101 (intestazione + 100 carte)
head -2 src/content/cards.csv
```

Aggiungere a `package.json`: `"seed": "tsx scripts/seed-demo.ts"`.

- [ ] **Step 10: Scrivere `src/content.config.ts`**

```ts
import { defineCollection, z } from 'astro:content'
import { file } from 'astro/loaders'
import { parse } from 'csv-parse/sync'

const rarity = z.enum(['common', 'uncommon', 'rare', 'holo', 'ultra', 'secret'])
const condition = z.enum(['mint', 'near-mint', 'excellent', 'good', 'played'])

const sets = defineCollection({
  loader: file('src/content/sets.json'),
  schema: z.object({
    id: z.string(), name: z.string(), code: z.string(),
    year: z.number().int(), total: z.number().int().positive(), color: z.string(),
  }),
})

const cards = defineCollection({
  loader: file('src/content/cards.csv', {
    parser: (text) => parse(text, { columns: true, skip_empty_lines: true, bom: true }),
  }),
  // Da CSV ogni campo arriva come stringa: z.coerce converte, e un valore
  // non convertibile fa fallire il build indicando la riga.
  schema: z.object({
    id: z.string(), slug: z.string(), name: z.string(), set: z.string(),
    num: z.string(), rarity, cond: condition, lang: z.string(), artist: z.string(),
    nuovo: z.union([z.boolean(), z.enum(['true', 'false'])]).transform((v) => v === true || v === 'true'),
    vetrina: z.coerce.number().int(),
    entrata: z.string(),
    ordine: z.coerce.number().int(),
    image: z.string().optional().transform((v) => (v === '' ? undefined : v)),
  }),
})

export const collections = { sets, cards }
```

Se l'API dei loader di Astro 7 differisce da questa firma, consultare `https://docs.astro.build/en/guides/content-collections/` e adattare **mantenendo gli stessi schemi Zod**: sono loro il guard-rail sui dati del cliente.

- [ ] **Step 11: Verificare la validazione**

```bash
pnpm check
```
Atteso: 0 errori. Poi rompere di proposito una riga — in `src/content/cards.csv` sostituire un `holo` con `leggendaria` — e rilanciare `pnpm check`. Atteso: errore che nomina il campo `rarity` e permette di risalire alla riga. **Ripristinare il valore** dopo la verifica.

Ripetere con una riga a cui manca una colonna, che e' l'errore piu' probabile quando i dati arrivano da un foglio di calcolo: anche quella deve fermare il build.

Questo step verifica il pilastro 5: se il cliente sbaglia un campo, il build lo dice invece di produrre una pagina rotta.

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "feat: tipi del catalogo, config del sito e dati demo su file

Il PRNG del prototipo e' portato identico, ma i 100 record vengono
serializzati in src/content/ una volta sola: i dati demo diventano
contenuto editabile invece che codice, e Zod li valida al build."
```

---
### Task 6: Ricerca — haystack precalcolato

Semantica copiata da `design-reference/catalogo.jsx`, funzione `cerca`:

```js
const cerca=c=>!q||[c.name,codeOf(c),setOf(c.set).name,labelRarita(c.rarity),
  labelCond(c.cond),c.lang,c.artist].join(" ").toLowerCase().includes(q);
```

dove `q = query.trim().toLowerCase()`. La ricerca è **substring, non per parole**: `"olo"` trova `"Holo"`. Va riprodotta così com'è.

**Files:**
- Create: `src/lib/catalog/search.ts`
- Test: `src/lib/catalog/search.test.ts`

**Interfaces:**
- Consumes: `Card`, `CardSet` da `./types`; `RARITY_LABELS`, `CONDITION_LABELS`, **`cardCode`** da `./labels` (definito al Task 5, non ridefinirlo qui)
- Produces:
  - `buildHaystack(card: Card, set: CardSet): string`
  - `matches(haystack: string, q: string): boolean`
  - `normalizeQuery(q: string | undefined): string`

- [ ] **Step 1: Scrivere il test**

`src/lib/catalog/search.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { cardCode } from './labels'
import { buildHaystack, matches, normalizeQuery } from './search'
import type { Card, CardSet } from './types'

const set: CardSet = {
  id: 'alb', name: 'Alba Cromatica', code: 'ALB',
  year: 2024, total: 198, color: 'var(--cherry-500)',
}

const card: Card = {
  id: '1', slug: 'fulmine-di-notte-alb-042', name: 'Fulmine di Notte',
  set: 'alb', num: '042/198', rarity: 'holo', cond: 'near-mint',
  lang: 'Italiano', artist: 'M. Ferretti', nuovo: true,
  vetrina: 2, entrata: '4 marzo', ordine: 120,
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
```

- [ ] **Step 2: Eseguire il test e verificare che fallisca**

Run: `pnpm test src/lib/catalog/search`
Atteso: FAIL, `Failed to resolve import "./search"`.

- [ ] **Step 3: Scrivere `src/lib/catalog/search.ts`**

```ts
import { cardCode, CONDITION_LABELS, RARITY_LABELS } from './labels'
import type { Card, CardSet } from './types'

export const normalizeQuery = (q: string | undefined) => (q ?? '').trim().toLowerCase()

/** I sette campi cercabili del prototipo, uniti e minuscolizzati una volta
 *  sola a build time. La ricerca a runtime e' un semplice includes(). */
export const buildHaystack = (card: Card, set: CardSet) =>
  [
    card.name,
    cardCode(card, set),
    set.name,
    RARITY_LABELS[card.rarity],
    CONDITION_LABELS[card.cond],
    card.lang,
    card.artist,
  ]
    .join(' ')
    .toLowerCase()

export const matches = (haystack: string, q: string) => {
  const n = normalizeQuery(q)
  return n === '' || haystack.includes(n)
}
```

- [ ] **Step 4: Eseguire il test e verificare che passi**

Run: `pnpm test src/lib/catalog/search`
Atteso: PASS, 9 test.

Se il test `buildHaystack` sui sette campi fallisce per uno spazio o un separatore, **correggere il test contro la stringa reale**, non l'implementazione: la verità è `design-reference/catalogo.jsx`, e l'implementazione la riproduce già.

- [ ] **Step 5: Commit**

```bash
git add src/lib/catalog/search.ts src/lib/catalog/search.test.ts
git commit -m "feat: ricerca del catalogo con haystack precalcolato

Riproduce alla lettera la semantica del prototipo: substring su sette campi
uniti e minuscolizzati. L'haystack si costruisce a build time, cosi' la
ricerca a runtime e' un includes()."
```

---

### Task 7: Filtri, ordinamento e paginazione

Semantica copiata da `design-reference/catalogo.jsx`. I filtri sono in AND fra categorie e in OR dentro una categoria; una categoria vuota non filtra.

**Files:**
- Create: `src/lib/catalog/query.ts`
- Test: `src/lib/catalog/query.test.ts`

**Interfaces:**
- Consumes: `Card`, `CardSet`, `CardQuery`, `Page`, `SortKey` da `./types`; `matches`, `buildHaystack` da `./search`; `RARITY_RANK`, `FOIL_RARITIES`, `PER_PAGE` da `./labels`
- Produces:
  - `type IndexedCard = Card & { haystack: string }`
  - `filterCards(cards: IndexedCard[], q: CardQuery): IndexedCard[]`
  - `sortCards(cards: IndexedCard[], sort: SortKey, sets: CardSet[]): IndexedCard[]`
  - `paginate<T>(items: T[], page: number, perPage: number): Page<T>`
  - `queryCards(cards: IndexedCard[], sets: CardSet[], q: CardQuery): Page<IndexedCard>`

- [ ] **Step 1: Scrivere il test**

`src/lib/catalog/query.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { filterCards, paginate, queryCards, sortCards, type IndexedCard } from './query'
import { buildHaystack } from './search'
import type { CardSet } from './types'

const SETS: CardSet[] = [
  { id: 'alb', name: 'Alba Cromatica', code: 'ALB', year: 2024, total: 198, color: 'a' },
  { id: 'for', name: 'Fornace Antica', code: 'FOR', year: 1999, total: 102, color: 'b' },
]

const base = {
  lang: 'Italiano', artist: 'ignoto', nuovo: false,
  vetrina: 1, entrata: '1 marzo', image: undefined,
} as const

const mk = (o: Partial<IndexedCard> & { id: string; name: string; set: string }): IndexedCard => {
  const set = SETS.find((s) => s.id === o.set)!
  const card = {
    slug: `${o.id}-slug`, num: '001/198', rarity: 'common', cond: 'mint',
    ordine: 0, ...base, ...o,
  } as IndexedCard
  return { ...card, haystack: buildHaystack(card, set) }
}

const CARDS: IndexedCard[] = [
  mk({ id: '1', name: 'Alfa', set: 'alb', rarity: 'holo', cond: 'mint', nuovo: true, ordine: 30 }),
  mk({ id: '2', name: 'Beta', set: 'for', rarity: 'common', cond: 'played', lang: 'Inglese', ordine: 10 }),
  mk({ id: '3', name: 'Gamma', set: 'alb', rarity: 'ultra', cond: 'good', ordine: 20 }),
  mk({ id: '4', name: 'Delta', set: 'for', rarity: 'rare', cond: 'mint', nuovo: true, ordine: 5 }),
]

describe('filterCards', () => {
  it('senza filtri restituisce tutto', () => {
    expect(filterCards(CARDS, {})).toHaveLength(4)
  })

  it('filtra per espansione', () => {
    expect(filterCards(CARDS, { sets: ['alb'] }).map((c) => c.id)).toEqual(['1', '3'])
  })

  it('dentro una categoria i valori sono in OR', () => {
    expect(filterCards(CARDS, { rarity: ['holo', 'rare'] }).map((c) => c.id)).toEqual(['1', '4'])
  })

  it('fra categorie diverse i filtri sono in AND', () => {
    expect(filterCards(CARDS, { sets: ['alb'], rarity: ['ultra'] }).map((c) => c.id)).toEqual(['3'])
  })

  it('foil tiene solo holo, ultra e secret', () => {
    expect(filterCards(CARDS, { foil: true }).map((c) => c.id)).toEqual(['1', '3'])
  })

  it('filtra per lingua e per condizione', () => {
    expect(filterCards(CARDS, { lang: ['Inglese'] }).map((c) => c.id)).toEqual(['2'])
    expect(filterCards(CARDS, { cond: ['mint'] }).map((c) => c.id)).toEqual(['1', '4'])
  })

  it('la ricerca testuale si combina in AND coi filtri', () => {
    expect(filterCards(CARDS, { q: 'alfa', sets: ['for'] })).toHaveLength(0)
    expect(filterCards(CARDS, { q: 'alfa', sets: ['alb'] }).map((c) => c.id)).toEqual(['1'])
  })

  it('un array di filtro vuoto non filtra', () => {
    expect(filterCards(CARDS, { rarity: [], sets: [] })).toHaveLength(4)
  })
})

describe('sortCards', () => {
  it('novita: prima i nuovi, poi per campo ordine crescente', () => {
    expect(sortCards(CARDS, 'novita', SETS).map((c) => c.id)).toEqual(['4', '1', '2', '3'])
  })

  it('rarita: dalla piu alta alla piu bassa, pareggi per nome', () => {
    expect(sortCards(CARDS, 'rarita', SETS).map((c) => c.id)).toEqual(['3', '1', '4', '2'])
  })

  it('az: alfabetico per nome', () => {
    expect(sortCards(CARDS, 'az', SETS).map((c) => c.name)).toEqual(['Alfa', 'Beta', 'Delta', 'Gamma'])
  })

  it('espansione: per nome espansione, pareggi per numero carta', () => {
    expect(sortCards(CARDS, 'espansione', SETS).map((c) => c.set)).toEqual(['alb', 'alb', 'for', 'for'])
  })

  it('non muta l array in ingresso', () => {
    const prima = CARDS.map((c) => c.id)
    sortCards(CARDS, 'az', SETS)
    expect(CARDS.map((c) => c.id)).toEqual(prima)
  })
})

describe('paginate', () => {
  const items = Array.from({ length: 10 }, (_, i) => i)

  it('taglia la pagina richiesta', () => {
    expect(paginate(items, 2, 4)).toEqual({ items: [4, 5, 6, 7], total: 10, page: 2, pages: 3 })
  })

  it('con zero elementi resta una pagina sola', () => {
    expect(paginate([], 1, 4)).toEqual({ items: [], total: 0, page: 1, pages: 1 })
  })

  it('una pagina oltre il limite restituisce elenco vuoto senza esplodere', () => {
    expect(paginate(items, 99, 4).items).toEqual([])
  })
})

describe('queryCards', () => {
  it('applica filtro, ordinamento e paginazione insieme', () => {
    const r = queryCards(CARDS, SETS, { foil: true, sort: 'az', page: 1, perPage: 1 })
    expect(r.total).toBe(2)
    expect(r.pages).toBe(2)
    expect(r.items.map((c) => c.name)).toEqual(['Alfa'])
  })

  it('senza sort usa novita, senza perPage usa 24', () => {
    const r = queryCards(CARDS, SETS, {})
    expect(r.items.map((c) => c.id)).toEqual(['4', '1', '2', '3'])
    expect(r.pages).toBe(1)
  })
})
```

- [ ] **Step 2: Eseguire il test e verificare che fallisca**

Run: `pnpm test src/lib/catalog/query`
Atteso: FAIL, `Failed to resolve import "./query"`.

- [ ] **Step 3: Scrivere `src/lib/catalog/query.ts`**

```ts
import { FOIL_RARITIES, PER_PAGE, RARITY_RANK } from './labels'
import { matches } from './search'
import type { Card, CardQuery, CardSet, Page, SortKey } from './types'

/** Una carta con il suo haystack di ricerca gia' calcolato. */
export type IndexedCard = Card & { haystack: string }

const none = (a: unknown[] | undefined): boolean => !a || a.length === 0

export function filterCards(cards: IndexedCard[], q: CardQuery): IndexedCard[] {
  return cards.filter(
    (c) =>
      (none(q.rarity) || q.rarity!.includes(c.rarity)) &&
      (none(q.sets) || q.sets!.includes(c.set)) &&
      (none(q.cond) || q.cond!.includes(c.cond)) &&
      (none(q.lang) || q.lang!.includes(c.lang)) &&
      (!q.foil || FOIL_RARITIES.includes(c.rarity)) &&
      matches(c.haystack, q.q ?? ''),
  )
}

export function sortCards(cards: IndexedCard[], sort: SortKey, sets: CardSet[]): IndexedCard[] {
  const setName = (id: string) => sets.find((s) => s.id === id)?.name ?? ''
  return [...cards].sort((a, b) => {
    switch (sort) {
      case 'az':
        return a.name.localeCompare(b.name)
      case 'rarita':
        return RARITY_RANK[b.rarity] - RARITY_RANK[a.rarity] || a.name.localeCompare(b.name)
      case 'espansione':
        return setName(a.set).localeCompare(setName(b.set)) || a.num.localeCompare(b.num)
      case 'novita':
      default:
        return (b.nuovo ? 1 : 0) - (a.nuovo ? 1 : 0) || a.ordine - b.ordine
    }
  })
}

export function paginate<T>(items: T[], page: number, perPage: number): Page<T> {
  const pages = Math.max(1, Math.ceil(items.length / perPage))
  const from = (page - 1) * perPage
  // Una pagina oltre il limite produce naturalmente un elenco vuoto:
  // slice() oltre la fine non esplode, quindi non serve nessun caso speciale.
  return { items: items.slice(from, from + perPage), total: items.length, page, pages }
}

export function queryCards(
  cards: IndexedCard[],
  sets: CardSet[],
  q: CardQuery,
): Page<IndexedCard> {
  const filtrate = filterCards(cards, q)
  const ordinate = sortCards(filtrate, q.sort ?? 'novita', sets)
  return paginate(ordinate, q.page ?? 1, q.perPage ?? PER_PAGE)
}
```

- [ ] **Step 4: Eseguire il test e verificare che passi**

Run: `pnpm test src/lib/catalog`
Atteso: PASS, tutti i test di `search` e `query`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/catalog/query.ts src/lib/catalog/query.test.ts
git commit -m "feat: filtri, ordinamento e paginazione del catalogo

Logica pura, senza I/O, con la stessa semantica del prototipo: AND fra
categorie, OR dentro una categoria, categoria vuota che non filtra.
E' il cuore del catalogo e sta tutto sotto test."
```

---
### Task 8: Sorgente statica, facade e indice emesso a build time

Qui si materializza il seam della spec §5.2: l'isola del catalogo **non importerà mai** `source.static.ts`, ma farà `fetch('/api/catalog.json')`. Questo task produce quel file.

**Files:**
- Create: `src/lib/catalog/source.static.ts`, `src/lib/catalog/index.ts`
- Create: `src/integrations/catalog-index.ts`
- Modify: `astro.config.mjs`
- Test: `src/lib/catalog/source.static.test.ts`

**Interfaces:**
- Consumes: `queryCards`, `IndexedCard` (Task 7); `buildHaystack` (Task 6); collection `cards` e `sets` (Task 5)
- Produces:
  - `staticSource: CatalogSource`
  - `getAllSets()`, `getAllCards()`, `getIndexedCards()` e `staticSource` (che espone `listSets`, `listCards`, `getCard`) da `~/lib/catalog`
  - a build time: `dist/api/catalog.json` e `dist/api/search-index.json`

**Forma del payload** — è un contratto pubblico: quando la sorgente diventerà Supabase, la risposta dovrà avere esattamente questa forma.

```jsonc
// /api/catalog.json
{
  "version": 1,
  "sets": [ { "id": "alb", "name": "Alba Cromatica", "code": "ALB", "year": 2024, "total": 198, "color": "var(--cherry-500)" } ],
  "cards": [ { "id": "1", "slug": "...", "name": "...", "set": "alb", "num": "042/198",
               "rarity": "holo", "cond": "near-mint", "lang": "Italiano",
               "artist": "M. Ferretti", "nuovo": true, "vetrina": 2,
               "entrata": "4 marzo", "ordine": 120 } ]
}

// /api/search-index.json  — parallelo per indice a cards[]
{ "version": 1, "haystacks": ["fulmine di notte alb 042/198 alba cromatica holo near mint italiano m. ferretti"] }
```

I due file sono separati di proposito: la griglia ha bisogno di `catalog.json` subito, l'indice serve solo quando l'utente scrive nel campo di ricerca.

**Questo payload non dipende dal formato dei contenuti.** Il catalogo sta in CSV, ma se domani diventasse JSON, SQLite o una tabella Supabase, `catalog.json` uscirebbe identico e nulla a valle cambierebbe. E' il motivo per cui il seam sta qui e non nell'interfaccia TypeScript.

- [ ] **Step 1: Scrivere il test**

`src/lib/catalog/source.static.test.ts` verifica la forma del payload, non i contenuti demo (che cambiano se il cliente sostituisce i dati).

```ts
import { describe, expect, it } from 'vitest'
import { buildCatalogPayload, buildSearchPayload } from './source.static'
import type { Card, CardSet } from './types'

const SETS: CardSet[] = [
  { id: 'alb', name: 'Alba Cromatica', code: 'ALB', year: 2024, total: 198, color: 'x' },
]
const CARDS: Card[] = [
  {
    id: '1', slug: 's1', name: 'Alfa', set: 'alb', num: '042/198',
    rarity: 'holo', cond: 'near-mint', lang: 'Italiano', artist: 'M. Ferretti',
    nuovo: true, vetrina: 2, entrata: '4 marzo', ordine: 120,
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
    const c = buildCatalogPayload(CARDS, SETS)
    const s = buildSearchPayload(CARDS, SETS)
    expect(s.haystacks).toHaveLength(c.cards.length)
    expect(s.haystacks[0]).toContain('alfa')
    expect(s.haystacks[0]).toContain('alba cromatica')
  })
})
```

- [ ] **Step 2: Eseguire il test e verificare che fallisca**

Run: `pnpm test src/lib/catalog/source`
Atteso: FAIL, `Failed to resolve import "./source.static"`.

- [ ] **Step 3: Scrivere `src/lib/catalog/source.static.ts`**

```ts
import { getCollection } from 'astro:content'
import { buildHaystack } from './search'
import { queryCards, type IndexedCard } from './query'
import type { Card, CardQuery, CardSet, CatalogSource, Page } from './types'

export interface CatalogPayload { version: 1; sets: CardSet[]; cards: Card[] }
export interface SearchPayload { version: 1; haystacks: string[] }

/** Pure: testabili senza Astro. */
export const buildCatalogPayload = (cards: Card[], sets: CardSet[]): CatalogPayload => ({
  version: 1, sets, cards,
})

export const buildSearchPayload = (cards: Card[], sets: CardSet[]): SearchPayload => ({
  version: 1,
  haystacks: cards.map((c) => buildHaystack(c, sets.find((s) => s.id === c.set) ?? sets[0]!)),
})

/** Lettura dalle content collections. Solo a build time. */
export async function getAllSets(): Promise<CardSet[]> {
  return (await getCollection('sets')).map((e) => e.data as CardSet)
}

export async function getAllCards(): Promise<Card[]> {
  return (await getCollection('cards')).map((e) => e.data as Card)
}

export async function getIndexedCards(): Promise<IndexedCard[]> {
  const [cards, sets] = await Promise.all([getAllCards(), getAllSets()])
  return cards.map((c) => ({
    ...c,
    haystack: buildHaystack(c, sets.find((s) => s.id === c.set) ?? sets[0]!),
  }))
}

export const staticSource: CatalogSource = {
  listSets: getAllSets,
  async listCards(q: CardQuery): Promise<Page<Card>> {
    const [cards, sets] = await Promise.all([getIndexedCards(), getAllSets()])
    return queryCards(cards, sets, q)
  },
  async getCard(slug: string): Promise<Card | null> {
    return (await getAllCards()).find((c) => c.slug === slug) ?? null
  },
}
```

- [ ] **Step 4: Eseguire il test e verificare che passi**

Run: `pnpm test src/lib/catalog/source`
Atteso: PASS, 3 test.

`getCollection` viene da `astro:content` e non è risolvibile sotto Vitest puro, ma i test toccano solo `buildCatalogPayload` e `buildSearchPayload`, che non lo importano a runtime. Se Vitest si lamenta comunque, aggiungere in `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config'
export default defineConfig({
  resolve: { alias: { '~': new URL('./src', import.meta.url).pathname } },
  test: { environment: 'node' },
})
```

e spostare `getAllSets`/`getAllCards`/`staticSource` in `source.static.astro.ts`, lasciando in `source.static.ts` solo le funzioni pure. **Questa separazione è preferibile comunque**: tiene l'I/O fuori dai file testabili.

- [ ] **Step 5: Scrivere la facade `src/lib/catalog/index.ts`**

```ts
export * from './types'
export * from './labels'
export { buildHaystack, matches, normalizeQuery } from './search'
export { filterCards, sortCards, paginate, queryCards, type IndexedCard } from './query'
export {
  staticSource, getAllCards, getAllSets, getIndexedCards,
  buildCatalogPayload, buildSearchPayload,
  type CatalogPayload, type SearchPayload,
} from './source.static'
```

Le pagine `.astro` importano **solo** da `~/lib/catalog`. Nessun file di pagina importa `source.static` direttamente: è ciò che permetterà di cambiare sorgente toccando un file solo.

- [ ] **Step 6: Scrivere l'integration che emette i due file**

`src/integrations/catalog-index.ts`:

```ts
import type { AstroIntegration } from 'astro'
import { mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

/** Emette /api/catalog.json e /api/search-index.json a fine build.
 *  Sono il seam verso Supabase: quando la sorgente cambiera', queste due
 *  URL diventeranno route SSR e l'isola del catalogo non cambiera'. */
export function catalogIndex(): AstroIntegration {
  return {
    name: 'cartafolia:catalog-index',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const { getAllCards, getAllSets, buildCatalogPayload, buildSearchPayload } =
          await import('~/lib/catalog')
        const [cards, sets] = await Promise.all([getAllCards(), getAllSets()])
        const out = join(fileURLToPath(dir), 'api')
        mkdirSync(out, { recursive: true })
        writeFileSync(join(out, 'catalog.json'), JSON.stringify(buildCatalogPayload(cards, sets)))
        writeFileSync(join(out, 'search-index.json'), JSON.stringify(buildSearchPayload(cards, sets)))
        logger.info(`emessi api/catalog.json (${cards.length} carte) e api/search-index.json`)
      },
    },
  }
}
```

Se l'import di `astro:content` dentro l'hook non risolve, la strada alternativa è creare due endpoint statici `src/pages/api/catalog.json.ts` e `src/pages/api/search-index.json.ts` che esportano `GET` e restituiscono lo stesso payload. **Preferire questa seconda strada se funziona**: è più idiomatica in Astro e produce gli stessi URL.

```ts
// src/pages/api/catalog.json.ts  — variante idiomatica
import type { APIRoute } from 'astro'
import { buildCatalogPayload, getAllCards, getAllSets } from '~/lib/catalog'

export const GET: APIRoute = async () => {
  const [cards, sets] = await Promise.all([getAllCards(), getAllSets()])
  return new Response(JSON.stringify(buildCatalogPayload(cards, sets)), {
    headers: { 'content-type': 'application/json' },
  })
}
```

- [ ] **Step 7: Registrare l'integration (solo se si è scelta la prima strada)**

In `astro.config.mjs`, aggiungere `catalogIndex()` all'array `integrations`.

- [ ] **Step 8: Verificare l'output del build**

```bash
pnpm build
node -e "const c=require('./dist/api/catalog.json');const s=require('./dist/api/search-index.json');
console.log('carte:',c.cards.length,'espansioni:',c.sets.length,'haystack:',s.haystacks.length);
if(c.cards.length!==s.haystacks.length) throw new Error('payload non paralleli')"
```
Atteso: `carte: 100 espansioni: 6 haystack: 100`.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: sorgente statica del catalogo e indice emesso a build time

/api/catalog.json e /api/search-index.json sono il seam verso Supabase:
l'isola del catalogo parlera' HTTP, non filesystem, quindi il giorno in cui
la sorgente diventera' un database queste URL passeranno a SSR senza che i
componenti cambino."
```

---
# FASE 2 — Design system in Svelte

## Protocollo di porting (vale per i Task 9-14)

Ogni componente segue gli stessi cinque passi. Non vengono ripetuti in ogni task.

1. **Leggere la sorgente** all'intervallo di righe indicato in `design-reference/_ds/_ds_bundle.js`.
2. **Separare** ciò che è stile statico (→ `src/styles/ds.css`) da ciò che è stato di interazione. Gli stati hover/press vanno in CSS secondo la tabella nei Global Constraints; sopravvive in JavaScript **solo** ciò che dipende dalla posizione del puntatore o da dati.
3. **Scrivere il `.svelte`** in `src/components/ds/`, riproducendo la struttura DOM elemento per elemento e attributo per attributo.
4. **Verificare affiancato** contro `http://localhost:4322/index.html`, sia a riposo sia in hover sia in focus da tastiera.
5. **Commit** a fine task.

### Il trabocchetto degli shorthand CSS

Emerso al Task 9 con un difetto vero e invisibile ai controlli automatici. **Leggerlo prima di dividere una regola in base + modificatore.**

Quando si separa uno stile React in una classe base e una classe modificatore, il modificatore che usa uno **shorthand** (`font`, `border`, `background`, `margin`, `padding`, `grid`, `flex`) **azzera silenziosamente tutte le longhand che quello shorthand copre** — comprese quelle dichiarate solo nella regola base. A parità di specificità vince la regola dichiarata dopo.

Il caso reale: `SpecList` nel sorgente fa

```js
font:     it.mono ? "var(--type-code)"  : "var(--type-body)",
fontSize: it.mono ? "var(--fs-body-s)"  : "var(--fs-body-s)",   // lo STESSO valore nei due rami
```

In React `fontSize` viene dopo `font` nello stesso oggetto, quindi vince sempre: il testo è 14px in entrambi i casi. Diviso in CSS diventava

```css
.ds-speclist__dd       { font:var(--type-body); font-size:var(--fs-body-s) }
.ds-speclist__dd--mono { font:var(--type-code) }   /* ← reimposta font-size a --fs-caption, 12px */
```

e ogni riga mono rendeva a 12px invece di 14.

**Regola:** un valore che il sorgente mantiene costante fra i rami di un ternario va **ridichiarato esplicitamente in ogni regola modificatore** che usa uno shorthand. In alternativa, e più sicuro: nel modificatore usare le longhand (`font-family`, `font-weight`, `line-height`) invece dello shorthand.

**Come accorgersene:** dopo aver diviso, chiedersi per ogni shorthand del modificatore quali longhand implica, e se la regola base ne dichiarava qualcuna.

### Stati persistenti contro `:hover` — conflitto di specificità

Emerso al Task 10. Un componente con uno stato **persistente** (`active` su `IconButton`, `selected` su `Chip`, la voce corrente di `Tabs` o di `NavBar`) ha una regola che deve **sopravvivere all'hover**, non essere sostituita da esso.

Se la regola dello stato persistente e quella di `:hover` hanno la stessa specificità, vince quella dichiarata dopo — di solito `:hover`, e lo stato attivo sparisce appena ci passi sopra il mouse. Il prototipo non ha questo problema perché in React lo stile è un unico oggetto calcolato, dove l'ordine delle chiavi decide.

**Regola:** la regola dello stato persistente deve avere specificità **maggiore** di quella di hover, e va scritta anche nella sua variante hover. Per esempio:

```css
@media (hover:hover){ .ds-iconbtn:hover{ … } }
.ds-iconbtn.is-active,
.ds-iconbtn.is-active:hover{ … }   /* vince su entrambi gli stati */
```

Riguarda i Task 11 (`Checkbox`, `Switch`), 13 (`Tabs`, `NavBar`) e 14 (`CardTile` con `liked`).

### Convenzioni comuni a tutti i componenti

- Props tipizzate con `$props()` e destrutturazione con valori di default identici a quelli React.
- Ogni componente accetta `style = ''` (stringa) e lo **appende in coda** al proprio `style` inline, così mantiene la stessa precedenza dello spread `...style` di React.
- I contenuti si passano con `children` e si rendono con `{@render children?.()}`. Gli slot nominati del prototipo (`icon`, `iconRight`, `badge`, `footer`, `action`, `right`) diventano **snippet** props.
- I gestori si chiamano `onclick`, `onchange`, `oninput` (Svelte 5, minuscolo), non `onClick`.
- Le classi CSS hanno prefisso `ds-`: `.ds-btn`, `.ds-panel`, `.ds-chip`.
- **Nessuna dimensione o colore hardcoded** che nella sorgente sia un token.

### Esempio completo A — componente senza stato: `CardArt`

Sorgente: `design-reference/_ds/_ds_bundle.js:11-90`. È il modello per Badge, RarityBadge, ConditionBadge, SpecList, Skeleton, EmptyState.

`src/components/ds/CardArt.svelte`:

```svelte
<script lang="ts">
  import type { Rarity } from '~/lib/catalog'

  let {
    src = undefined as string | undefined,
    alt = '',
    rarity = 'common' as Rarity,
    code = undefined as string | number | undefined,
    foil = false,
    sheen = 0,
    radius = 'var(--r-cardart)',
    style = '',
  } = $props()

  // Fedele a bundle:24 — un code non-stringa e falsy (0, NaN) rende stringa vuota.
  const caption = $derived(
    typeof code === 'string' ? code.trim() : code ? String(code) : '',
  )
  const isFoil = $derived(
    foil || rarity === 'holo' || rarity === 'ultra' || rarity === 'secret',
  )
</script>

<div
  class="ds-cardart"
  class:is-foil={isFoil}
  style="border-radius:{radius};{style}"
>
  {#if src}
    <img {src} {alt} class="ds-cardart__img" />
  {:else}
    <div class="ds-cardart__ph">
      <span class="ds-cardart__code">{caption}</span>
    </div>
  {/if}
  <div
    aria-hidden="true"
    class="ds-cardart__sheen"
    style="opacity:{sheen};transform:translateX({-60 + sheen * 120}%)"
  ></div>
</div>
```

in `src/styles/ds.css`:

```css
/* CardArt — bundle:11-90 */
.ds-cardart{position:relative;aspect-ratio:var(--card-aspect);width:100%;overflow:hidden;
  background:linear-gradient(160deg,var(--ink-100),var(--paper-100));
  box-shadow:var(--sh-inset-hairline)}
.ds-cardart.is-foil{background:var(--foil)}
.ds-cardart__img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
.ds-cardart__ph{position:absolute;inset:0;display:grid;place-items:center;container-type:inline-size;
  background:var(--pattern-dots) 0 0/var(--pattern-dots-size)}
.ds-cardart.is-foil .ds-cardart__ph{
  background:radial-gradient(120% 90% at 30% 15%,rgba(255,255,255,.65),transparent 60%)}
.ds-cardart__code{font:var(--type-code);letter-spacing:var(--ls-eyebrow);text-transform:uppercase;
  color:var(--text-faint);text-align:center;padding:0 8px;max-width:100%;overflow:hidden;
  text-overflow:ellipsis;white-space:nowrap;font-size:clamp(7px,14cqw,12px);container-type:inline-size}
.ds-cardart.is-foil .ds-cardart__code{color:rgba(14,11,18,.5)}
.ds-cardart__sheen{position:absolute;inset:0;background:var(--foil-sheen);mix-blend-mode:screen;
  pointer-events:none;
  transition:opacity var(--dur-base) var(--ease-out),transform var(--dur-slow) var(--ease-out)}
```

`opacity` e `transform` dello sheen restano inline perché derivano dalla prop `sheen`, che è un dato. Tutto il resto è CSS.

### Esempio completo B — hover e press da JavaScript a CSS: `Button`

Sorgente: `design-reference/_ds/_ds_bundle.js:378-498`. È il modello per IconButton, Chip, Panel, Tooltip, CardTile.

Nel prototipo `hover` e `press` sono due `useState`. Qui diventano `:hover` e `:active`, con **gli stessi identici valori**. Le cinque varianti diventano set di custom property, così il CSS resta una regola sola.

`src/components/ds/Button.svelte`:

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte'

  let {
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    disabled = false,
    href = undefined as string | undefined,
    onclick = undefined as ((e: MouseEvent) => void) | undefined,
    icon = undefined as Snippet | undefined,
    iconRight = undefined as Snippet | undefined,
    children = undefined as Snippet | undefined,
    style = '',
    ...rest
  } = $props()
</script>

{#snippet inner()}
  {@render icon?.()}{@render children?.()}{@render iconRight?.()}
{/snippet}

{#if href}
  <a
    class="ds-btn"
    class:ds-btn--full={fullWidth}
    data-variant={variant}
    data-size={size}
    {href}
    {onclick}
    {style}
    {...rest}>{@render inner()}</a>
{:else}
  <button
    class="ds-btn"
    class:ds-btn--full={fullWidth}
    data-variant={variant}
    data-size={size}
    {disabled}
    onclick={disabled ? undefined : onclick}
    {style}
    {...rest}>{@render inner()}</button>
{/if}
```

in `src/styles/ds.css`:

```css
/* Button — bundle:378-498. hover/press erano useState, qui sono :hover/:active. */
.ds-btn{display:inline-flex;align-items:center;justify-content:center;
  font:var(--type-label);font-weight:var(--fw-bold);letter-spacing:-.01em;
  text-decoration:none;white-space:nowrap;border-radius:var(--r-control);cursor:pointer;
  transition:var(--t-control);
  background:var(--btn-bg);color:var(--btn-fg);border:var(--btn-bd);box-shadow:var(--btn-sh)}

.ds-btn[data-size="sm"]{padding:8px 16px;font-size:var(--fs-body-s);gap:6px;min-height:36px}
.ds-btn[data-size="md"]{padding:12px 22px;font-size:var(--fs-body-m);gap:8px;min-height:46px}
.ds-btn[data-size="lg"]{padding:16px 30px;font-size:var(--fs-body-l);gap:10px;min-height:56px}

.ds-btn[data-variant="primary"]{--btn-bg:var(--surface-brand);--btn-fg:var(--text-invert);
  --btn-bd:var(--bw-strong) solid var(--ink-950);--btn-sh:var(--sh-sticker-sm);
  --btn-bg-hover:var(--surface-brand-hover)}
.ds-btn[data-variant="secondary"]{--btn-bg:var(--surface-card);--btn-fg:var(--text-strong);
  --btn-bd:var(--bw-strong) solid var(--ink-950);--btn-sh:var(--sh-sticker-sm);
  --btn-bg-hover:var(--paper-100)}
.ds-btn[data-variant="ghost"]{--btn-bg:transparent;--btn-fg:var(--text-strong);
  --btn-bd:var(--bw-strong) solid transparent;--btn-sh:none;--btn-bg-hover:var(--ink-50)}
.ds-btn[data-variant="foil"]{--btn-bg:var(--foil);--btn-fg:var(--ink-950);
  --btn-bd:var(--bw-strong) solid var(--ink-950);--btn-sh:var(--sh-sticker-sm);
  --btn-bg-hover:var(--foil)}
.ds-btn[data-variant="invert"]{--btn-bg:var(--surface-invert);--btn-fg:var(--text-invert);
  --btn-bd:var(--bw-strong) solid var(--ink-950);--btn-sh:none;--btn-bg-hover:var(--ink-800)}

@media (hover:hover){
  .ds-btn:not(:disabled):hover{background:var(--btn-bg-hover);
    box-shadow:var(--sh-sticker);transform:translateY(-2px)}
}
.ds-btn:not(:disabled):active{box-shadow:none;transform:translate(2px,2px)}
.ds-btn:disabled,.ds-btn[aria-disabled="true"]{opacity:.4;cursor:not-allowed;
  box-shadow:none;transform:none}
.ds-btn--full{width:100%}
```

Confronto con la sorgente, riga per riga: `padding`, `fontSize`, `gap`, `minHeight` dai `SIZES`; `background`, `color`, `border`, `shadow`, `hoverBg` dai `VARIANTS`; `boxShadow: hover ? "var(--sh-sticker)"`, `transform: press ? "translate(2px,2px)" : hover ? "translateY(-2px)"`, `opacity: disabled ? .4 : 1`. Tutti presenti, tutti con gli stessi valori.

---

### Task 9: Primitivi senza stato

**Files:**
- Create: `src/components/ds/{CardArt,Badge,RarityBadge,ConditionBadge,SpecList,Skeleton,EmptyState}.svelte`
- Modify: `src/styles/ds.css`
- Create: `src/pages/ds-gallery.astro` (galleria di verifica, rimossa al Task 27)

**Nota sul nome del file:** non usare un nome che inizi per `_`. Astro esclude dal routing ogni segmento di percorso che comincia con un underscore, quindi `__ds.astro` restituirebbe 404 sia in dev sia nel build.

**Interfaces:**
- Consumes: `Icon` (Task 4), token (Task 3), tipi `Rarity`/`Condition` (Task 5)
- Produces: i sette componenti, tutti **senza direttiva `client:`**: sono HTML statico

| Componente | Sorgente | Nota di porting |
|---|---|---|
| `CardArt` | `bundle:11-90` | Vedi Esempio A qui sopra |
| `ConditionBadge` | `bundle:91-167` | La mappa `COND` con `label`/`short`/`level`/`color` va copiata così com'è. I 5 trattini della scala hanno altezza `4 + i * 1.6` px: è una formula, resta in JS |
| `RarityBadge` | `bundle:168-250` | La mappa `RARITY` porta `dots` da 1 a 6. `size="sm"` cambia diametro (5 contro 6) e padding |
| `SpecList` | `bundle:251-299` | Struttura `<dl>/<div>/<dt>/<dd>`, da rispettare: è semantica, non decorazione. `it.mono` cambia il font del `<dd>` |
| `Badge` | `bundle:300-377` | Leggere la mappa `TONES` alla riga 303 e copiarne tutte le voci, compresa `foil` |
| `Skeleton` | `bundle:1192-1229` | L'animazione di pulsazione va in `ds.css` come `@keyframes`, non in JS |
| `EmptyState` | `bundle:1131-1191` | `action` diventa una prop snippet |

- [ ] **Step 1: Portare `CardArt`**

Copiare esattamente il codice dell'Esempio A (componente + blocco CSS).

- [ ] **Step 2: Portare gli altri sei**

Per ciascuno seguire il protocollo a 5 passi. Nessuno di questi ha stato di interazione: sono tutti pura traduzione struttura + stile.

- [ ] **Step 3: Costruire la galleria di verifica**

`src/pages/ds-gallery.astro` mostra ogni componente in tutte le sue varianti, affiancate:

```astro
---
import '~/styles/global.css'
import CardArt from '~/components/ds/CardArt.svelte'
import RarityBadge from '~/components/ds/RarityBadge.svelte'
import ConditionBadge from '~/components/ds/ConditionBadge.svelte'
import Badge from '~/components/ds/Badge.svelte'
import SpecList from '~/components/ds/SpecList.svelte'
import Skeleton from '~/components/ds/Skeleton.svelte'

const RARITA = ['common','uncommon','rare','holo','ultra','secret'] as const
const COND = ['mint','near-mint','excellent','good','played'] as const
---
<html lang="it"><head><meta charset="utf-8" /><title>DS</title></head>
<body>
  <div class="wrap sez" style="display:grid;gap:var(--sp-8)">
    <h2>CardArt — una per rarita</h2>
    <div class="cards">
      {RARITA.map((r) => <CardArt rarity={r} code={`ALB 042/198`} />)}
    </div>
    <h2>RarityBadge — md e sm</h2>
    <div style="display:flex;gap:var(--sp-3);flex-wrap:wrap">
      {RARITA.map((r) => <RarityBadge rarity={r} />)}
    </div>
    <div style="display:flex;gap:var(--sp-3);flex-wrap:wrap">
      {RARITA.map((r) => <RarityBadge rarity={r} size="sm" />)}
    </div>
    <h2>ConditionBadge — pieno e compatto</h2>
    <div style="display:flex;gap:var(--sp-3);flex-wrap:wrap">
      {COND.map((c) => <ConditionBadge condition={c} />)}
    </div>
    <div style="display:flex;gap:var(--sp-3);flex-wrap:wrap">
      {COND.map((c) => <ConditionBadge condition={c} compact />)}
    </div>
    <h2>Skeleton</h2>
    <div class="cards"><Skeleton shape="card" /><Skeleton count={3} /></div>
  </div>
</body></html>
```

`Badge` ed `EmptyState` vanno aggiunti alla galleria allo stesso modo, con tutte le loro varianti.

- [ ] **Step 4: Verificare la fedeltà**

Aprire `http://localhost:4321/ds-gallery` accanto a `http://localhost:4322/index.html`.

- Le sei `CardArt` con rarità alta (`holo`, `ultra`, `secret`) devono avere il fondo foil arcobaleno; le altre il retino a punti su grigio caldo.
- I pallini di `RarityBadge` devono essere 1, 2, 3, 4, 5, 6 e il bordo del colore della rarità.
- La scala a barre di `ConditionBadge` deve avere le prime N barre colorate e le restanti in `var(--ink-200)`.

- [ ] **Step 5: Verificare che non spediscano JavaScript**

```bash
pnpm build
grep -rl "client:" src/components/ds/ && echo "ERRORE: un componente ds ha una direttiva client" || echo "ok"
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: primitivi del design system (CardArt, badge, SpecList, Skeleton, EmptyState)

Sette componenti senza stato di interazione, resi come HTML statico: non
spediscono un byte di JavaScript. La galleria /__ds serve al confronto
affiancato col prototipo."
```

---
### Task 10: Controlli — hover e press in CSS

**Files:**
- Create: `src/components/ds/{Button,IconButton,Chip,Panel,Tooltip}.svelte`
- Modify: `src/styles/ds.css`, `src/pages/ds-gallery.astro`

**Interfaces:**
- Produces: `Button` (props `variant`, `size`, `fullWidth`, `disabled`, `href`, `onclick`, snippet `icon`/`iconRight`/`children`), `IconButton` (`icon: IconName`, `variant`, `size`, `label`, `onclick`), `Chip` (`onclick`, `onRemove`, snippet `children`), `Panel` (`variant`, `padding`, `hoverLift`, `as`), `Tooltip` (`label`, `side`)
- Tutti **senza direttiva `client:`**: dopo la conversione degli hover in CSS non hanno più stato

| Componente | Sorgente | Nota di porting |
|---|---|---|
| `Button` | `bundle:378-498` | Vedi Esempio B qui sopra |
| `IconButton` | `bundle:674-754` | Stessa struttura di `Button` ma quadrato. `label` è obbligatoria e diventa `aria-label`: è l'unico testo che un lettore di schermo trova |
| `Chip` | `bundle:610-673` | Quando c'è `onRemove` compare una `x`. Il bottone di rimozione va **annidato** ma con `onclick` che ferma la propagazione, altrimenti scatta anche l'`onclick` del chip |
| `Panel` | `bundle:902-965` | Cinque `SKINS`: `card`, `sunken`, `sticker`, `invert`, `foil`. `hoverLift` diventa la classe `.ds-panel--lift`, e **solo quella classe** attiva `:hover`. Attenzione: per `sticker` e `foil` l'ombra in hover è `6px 6px 0 var(--ink-950)`, non `var(--sh-3)` |
| `Tooltip` | `bundle:966-1029` | `open` era `useState` su mouse **e focus**: in CSS diventa `:hover` **e** `:focus-within`, entrambi necessari per l'accessibilità da tastiera. Le quattro posizioni (`top`/`bottom`/`left`/`right`) diventano `[data-side="..."]` |

- [ ] **Step 1: Portare `Button`**

Copiare esattamente il codice dell'Esempio B (componente + blocco CSS).

- [ ] **Step 2: Portare `IconButton`, `Chip`, `Panel`, `Tooltip`**

Seguire il protocollo. Per `Panel` la regola di hover è:

```css
@media (hover:hover){
  .ds-panel--lift:hover{transform:var(--lift-hover);box-shadow:var(--sh-3)}
  .ds-panel--lift[data-variant="sticker"]:hover,
  .ds-panel--lift[data-variant="foil"]:hover{box-shadow:6px 6px 0 var(--ink-950)}
}
```

Per `Tooltip`:

```css
.ds-tooltip{position:relative;display:inline-flex}
.ds-tooltip__bubble{position:absolute;z-index:60;pointer-events:none;opacity:0;
  background:var(--ink-950);color:var(--text-invert);padding:6px 10px;
  border-radius:var(--r-xs);font:var(--type-label);font-size:var(--fs-caption);
  white-space:nowrap;box-shadow:var(--sh-2);
  transition:opacity var(--dur-fast) var(--ease-out),transform var(--dur-fast) var(--ease-snap)}
.ds-tooltip__bubble[data-side="top"]{bottom:calc(100% + 8px);left:50%;transform:translateX(-50%) translateY(4px)}
.ds-tooltip__bubble[data-side="bottom"]{top:calc(100% + 8px);left:50%;transform:translateX(-50%) translateY(-4px)}
.ds-tooltip__bubble[data-side="left"]{right:calc(100% + 8px);top:50%;transform:translateY(-50%)}
.ds-tooltip__bubble[data-side="right"]{left:calc(100% + 8px);top:50%;transform:translateY(-50%)}
.ds-tooltip:hover .ds-tooltip__bubble[data-side="top"],
.ds-tooltip:focus-within .ds-tooltip__bubble[data-side="top"]{opacity:1;transform:translateX(-50%) translateY(0)}
.ds-tooltip:hover .ds-tooltip__bubble[data-side="bottom"],
.ds-tooltip:focus-within .ds-tooltip__bubble[data-side="bottom"]{opacity:1;transform:translateX(-50%) translateY(0)}
.ds-tooltip:hover .ds-tooltip__bubble[data-side="left"],
.ds-tooltip:focus-within .ds-tooltip__bubble[data-side="left"],
.ds-tooltip:hover .ds-tooltip__bubble[data-side="right"],
.ds-tooltip:focus-within .ds-tooltip__bubble[data-side="right"]{opacity:1}
```

- [ ] **Step 3: Estendere la galleria**

Aggiungere a `src/pages/ds-gallery.astro`: le 5 varianti di `Button` × 3 dimensioni, più uno `disabled` e uno `fullWidth`; `IconButton` in tutte le varianti; `Chip` con e senza `onRemove`; i 5 `Panel` con e senza `hoverLift`; `Tooltip` nelle 4 posizioni.

- [ ] **Step 4: Verificare hover, press e tastiera**

Affiancato al prototipo su `:4322`:
- passare il mouse su un `Button` primario: si alza di 2px e l'ombra sticker passa da 3px a 4px;
- tenere premuto: si sposta di `2px,2px` e l'ombra sparisce;
- **navigare con Tab**: ogni controllo deve mostrare l'anello di focus `2px solid var(--focus-ring)` da `base.css`, e il `Tooltip` deve aprirsi al focus, non solo all'hover;
- su un `Panel variant="sticker" hoverLift`, in hover l'ombra deve diventare `6px 6px 0` nera piena, non sfocata.

- [ ] **Step 5: Verificare che non spediscano JavaScript**

```bash
pnpm build
ls dist/_astro/*.js 2>/dev/null | head
```
Atteso: nessun bundle JS generato dalla pagina `__ds`, perché nessun componente ha `client:`.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: controlli del design system con hover e press in CSS

Nel prototipo hover e press erano React.useState: qui sono :hover e :active
con gli stessi identici valori. Il risultato visivo e' invariato ma i
controlli funzionano in pagine che non idratano nulla."
```

---

### Task 11: Campi e filtri

**Files:**
- Create: `src/components/ds/{Input,SearchField,Select,Checkbox,Switch,FilterGroup}.svelte`
- Modify: `src/styles/ds.css`, `src/pages/ds-gallery.astro`

**Interfaces:**
- Produces: `Input`, `SearchField` (`value`, `oninput`, `onclear`, `suggestions`, `onpick`, `size`), `Select` (`value`, `options`, `onchange`, `size`), `Checkbox` (`checked`, `label`, `description`, `count`, `onchange`), `Switch` (`checked`, `label`, `onchange`), `FilterGroup` (`title`, `activeCount`, `defaultOpen`, snippet `children`)
- `SearchField`, `Select`, `Checkbox`, `Switch`, `FilterGroup` hanno stato **vero** (valore, apertura): vanno usati dentro un'isola

| Componente | Sorgente | Nota di porting |
|---|---|---|
| `Input` | `bundle:1411-1482` | Il `focus` era `useState`: diventa `:focus-within` sul contenitore |
| `SearchField` | `bundle:1483-1596` | Vedi sotto: è il più delicato |
| `Select` | `bundle:1597-1670` | Resta un `<select>` nativo: accessibile e senza JS di posizionamento |
| `Checkbox` | `bundle:1323-1410` | `<input type="checkbox">` reale nascosto + riquadro disegnato, così Tab e Spazio funzionano da soli |
| `Switch` | `bundle:1671-1736` | `<input type="checkbox" role="switch">` |
| `FilterGroup` | `bundle:534-609` | L'apertura era `useState`. Usare `<details open={defaultOpen}>` + `<summary>`: apre e chiude **senza JavaScript**, con tastiera funzionante di serie. Il chevron ruota con `details[open] .ds-fg__chev{transform:rotate(180deg)}` |

**`SearchField` — due miglioramenti dichiarati.** Il prototipo (`bundle:1483-1596`) chiude il pannello dei suggerimenti con `onBlur: () => setTimeout(() => setFocus(false), 120)` e li seleziona con `onMouseDown`. Sono due limiti reali:

1. **Nessuna navigazione da tastiera** fra i suggerimenti.
2. Il `setTimeout` di 120 ms è una corsa fra blur e click.

Il porting aggiunge: `↓`/`↑` per scorrere, `Invio` per scegliere, `Esc` per chiudere, e la selezione su `pointerdown` invece che sul timeout. La struttura DOM e ogni valore di stile restano identici; cambia solo il comportamento da tastiera, che nel prototipo non esisteva. Marcare la lista con `role="listbox"`, le voci con `role="option"` e `aria-selected`, e il campo con `aria-expanded` e `aria-activedescendant`.

- [ ] **Step 1: Portare i sei componenti**

Seguire il protocollo. Per `FilterGroup` la conversione a `<details>` è un cambio di elemento rispetto al prototipo, che usava `<div>` + stato: è deliberato, perché elimina JavaScript e regala tastiera e semantica. Verificare che i padding e i bordi restino quelli della sorgente.

- [ ] **Step 2: Estendere la galleria**

Dentro `ds-gallery.astro` serve un'isola contenitore, perché questi componenti hanno stato. Creare `src/components/islands/DsForms.svelte` che li monta tutti con valori locali, e montarlo con `client:load`.

- [ ] **Step 3: Verificare la tastiera**

Su `http://localhost:4321/ds-gallery`:
- Tab raggiunge ogni campo; `Checkbox` e `Switch` si attivano con Spazio;
- `FilterGroup` apre e chiude con Invio sul `<summary>`;
- in `SearchField`, scrivendo appare la lista: `↓` evidenzia la prima voce, `Invio` la sceglie, `Esc` chiude;
- disattivando JavaScript nel browser, `FilterGroup` **continua ad aprirsi e chiudersi**.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: campi e filtri del design system

FilterGroup diventa <details>/<summary>: apre e chiude senza JavaScript e
guadagna la tastiera. SearchField aggiunge la navigazione con frecce e Invio,
che nel prototipo mancava, e sostituisce il setTimeout su blur con pointerdown."
```

---

### Task 12: Overlay — Dialog, Sheet, Toast

**Files:**
- Create: `src/components/ds/{Dialog,Sheet,Toast}.svelte`
- Modify: `src/styles/ds.css`

**Interfaces:**
- Produces: `Dialog` (`open`, `title`, `eyebrow`, `width`, `onclose`, snippet `children`/`footer`), `Sheet` (stessa API, sale dal basso), `Toast` (`tone`, `title`, `description`, `onclose`)
- Consumatori: `SiteChrome` (Task 15)

| Componente | Sorgente | Nota di porting |
|---|---|---|
| `Dialog` | `bundle:1030-1130` | Vedi sotto |
| `Sheet` | `design-reference/pezzi.jsx`, funzione `Sheet` | Non sta nel bundle: è definita nel prototipo. Blocca lo scroll del body con `document.body.style.overflow = 'hidden'` e lo ripristina in uscita — comportamento da mantenere |
| `Toast` | `bundle:1230-1322` | La mappa `TONES` alla riga 1233 va copiata intera |

**`Dialog` — tre lacune di accessibilità da colmare.** Il prototipo gestisce `Escape` ma non ha né focus trap né ripristino del focus, e il `<h2>` del titolo non è collegato al ruolo `dialog`. Sono difetti reali che non incidono sull'aspetto. Il porting:

- usa l'elemento nativo `<dialog>` con `showModal()`, che dà **focus trap, `Escape` e scrim inerte gratis** dal browser;
- ripristina il focus sull'elemento che ha aperto il dialog, alla chiusura;
- collega il titolo con `aria-labelledby` invece di `aria-label`.

Lo scrim del prototipo (`background: var(--scrim-modal)`, `backdrop-filter: blur(3px)`) si riproduce su `dialog::backdrop`. Tutti gli altri valori di stile restano quelli della sorgente: `border: var(--bw-strong) solid var(--ink-950)`, `border-radius: var(--r-xl)`, `box-shadow: var(--sh-3)`, `padding: var(--sp-8)`, `gap: var(--sp-5)`, `max-height: 86vh`, `max-width` dalla prop `width` (default 560).

- [ ] **Step 1: Portare `Dialog` con `<dialog>` nativo**

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte'
  import IconButton from './IconButton.svelte'

  let {
    open = false, title = '', eyebrow = '', width = 560,
    onclose = undefined as (() => void) | undefined,
    children = undefined as Snippet | undefined,
    footer = undefined as Snippet | undefined,
  } = $props()

  let el = $state<HTMLDialogElement | null>(null)
  let opener: HTMLElement | null = null
  const titleId = `dlg-${Math.random().toString(36).slice(2, 9)}`

  $effect(() => {
    if (!el) return
    if (open && !el.open) {
      opener = document.activeElement as HTMLElement | null
      el.showModal()
    } else if (!open && el.open) {
      el.close()
      opener?.focus()
    }
  })
</script>

<dialog
  bind:this={el}
  class="ds-dialog"
  style="max-width:{width}px"
  aria-labelledby={title ? titleId : undefined}
  oncancel={(e) => { e.preventDefault(); onclose?.() }}
  onclick={(e) => { if (e.target === el) onclose?.() }}
>
  <div class="ds-dialog__head">
    <div class="ds-dialog__titles">
      {#if eyebrow}<span class="ds-dialog__eyebrow">{eyebrow}</span>{/if}
      {#if title}<h2 id={titleId} class="ds-dialog__title">{title}</h2>{/if}
    </div>
    {#if onclose}<IconButton icon="x" variant="ghost" label="Chiudi" onclick={onclose} />{/if}
  </div>
  <div class="ds-dialog__body">{@render children?.()}</div>
  {#if footer}<div class="ds-dialog__foot">{@render footer()}</div>{/if}
</dialog>
```

`onclick` sul `<dialog>` con `e.target === el` riproduce la chiusura cliccando sullo scrim: sull'elemento nativo il backdrop conta come click sul dialog stesso.

- [ ] **Step 2: Portare `Sheet` e `Toast`**

`Sheet` mantiene l'animazione `.sheet-in` già presente in `layout.css` e il blocco dello scroll del body. Anche `Sheet` usa `<dialog>` nativo, per gli stessi motivi.

- [ ] **Step 3: Verificare**

- Aprire un `Dialog`: il focus entra dentro; Tab **non esce** verso la pagina sotto; `Escape` chiude; alla chiusura il focus torna sul bottone che l'aveva aperto.
- Lo scrim deve essere `var(--scrim-modal)` con sfocatura 3px, identico al prototipo.
- `Sheet` su viewport 390px deve salire dal basso con l'animazione `sheetUp` e mostrare la maniglia grigia in alto al centro.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: Dialog, Sheet e Toast su elemento <dialog> nativo

Il prototipo gestiva solo Escape, senza focus trap ne' ripristino del focus.
L'elemento nativo li fornisce gratis. Ogni valore di stile resta quello
della sorgente; lo scrim passa su ::backdrop."
```

---

### Task 13: Navigazione

**Files:**
- Create: `src/components/ds/{Tabs,Pagination,Breadcrumb}.svelte`
- Create: `src/components/NavBar.astro`, `src/components/Footer.astro`, `src/config/nav.ts`
- Modify: `src/styles/ds.css`, `src/pages/ds-gallery.astro`

**Interfaces:**
- Produces: `Tabs` (`items`, `value`, `onchange`, `variant`), `Pagination` (`page`, `pages`, `onchange`), `Breadcrumb` (`items`), `NavBar.astro` (props `{ active: string; catalogCount?: number }`), `Footer.astro`

| Componente | Sorgente | Nota di porting |
|---|---|---|
| `Tabs` | `bundle:1993-2050` | Due varianti, default e `pill`. Marcare con `role="tablist"`/`role="tab"` e `aria-selected` |
| `Pagination` | `bundle:1908-1992` | Nel catalogo diventa navigazione vera: ogni pagina è un `<a href="?p=N">`, non un bottone, così funziona senza JS ed è indicizzabile |
| `Breadcrumb` | `bundle:1737-1792` | Voci come `<a href>` reali; l'ultima senza link e con `aria-current="page"`. Avvolgere in `<nav aria-label="Percorso">` |

**`NavBar` diventa un componente Astro, non Svelte.** Nel prototipo (`bundle:1793-1907`) l'unico stato è `scrolled`, che al superamento di 8px di scroll cambia il fondo in `var(--glass-bg)`, attiva `backdrop-filter` e mostra il bordo inferiore. Non serve un framework per questo: bastano un attributo e uno script di dieci righe. Così la barra di navigazione resta HTML statico su **ogni** pagina del sito.

- [ ] **Step 1: Scrivere `src/components/NavBar.astro`**

```astro
---
import { SITE } from '~/config/site'
import Icon from '~/components/ds/Icon.svelte'
import { NAV } from '~/config/nav'
const { active, catalogCount } = Astro.props as { active: string; catalogCount?: number }
const voci = NAV.map((v) => (v.id === 'catalogo' ? { ...v, count: catalogCount } : v))
---
<header class="ds-nav" data-scrolled="false">
  <nav class="ds-nav__inner">
    <a class="ds-nav__brand" href="/">
      <img src="/assets/logo-mark.svg" alt="" width="32" height="32" />
      <span>{SITE.brand}</span>
    </a>
    <div class="ds-nav__links">
      {voci.map((it) => (
        <a href={it.href} class="ds-nav__link" data-on={it.id === active}
           aria-current={it.id === active ? 'page' : undefined}>
          {it.label}
          {it.count != null && <span class="ds-nav__count">{it.count}</span>}
        </a>
      ))}
    </div>
    <div class="ds-nav__right"><slot /></div>
  </nav>
</header>

<script>
  const el = document.querySelector<HTMLElement>('.ds-nav')
  const doc = document.scrollingElement || document.documentElement
  const sync = () => el?.setAttribute('data-scrolled', String(doc.scrollTop > 8))
  addEventListener('scroll', sync, { passive: true })
  sync()
</script>
```

Il CSS corrispondente porta `background`, `backdrop-filter` e `border-bottom` su `.ds-nav[data-scrolled="true"]`, con gli stessi valori di `bundle:1817-1823`.

`src/config/nav.ts` centralizza le voci, che nel prototipo stavano in `guscio.jsx`:

```ts
export const NAV = [
  { id: 'vetrina', label: 'Vetrina', href: '/' },
  { id: 'catalogo', label: 'Catalogo', href: '/catalogo', count: undefined as number | undefined },
  { id: 'espansioni', label: 'Espansioni', href: '/espansioni' },
  { id: 'negozio', label: 'Il negozio', href: '/negozio' },
  { id: 'about', label: 'Chi siamo', href: '/chi-siamo' },
]
```

Il `count` del catalogo viene riempito dalla pagina che monta la NavBar, con il numero reale di carte.

- [ ] **Step 2: Scrivere `src/components/Footer.astro`**

Porting di `design-reference/guscio.jsx`, funzione `Footer`. Quattro colonne (`.foot`): brand con logo e frase, elenco `Sito`, elenco `Orari`, elenco `Scrivici` dai social di `SITE`. Sotto, la riga con copyright e la nota sui diritti. **Tutti i link sono `<a href>` reali**, non più `onClick` con `preventDefault`.

- [ ] **Step 3: Portare `Tabs`, `Pagination`, `Breadcrumb`**

- [ ] **Step 4: Verificare**

Con la NavBar montata in `ds-gallery.astro`: a scroll 0 il fondo è `var(--surface-page)` senza bordo; superati 8px compaiono vetro, sfocatura e bordo. Il confronto va fatto affiancato al prototipo, che si comporta identico.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: navigazione, NavBar e Footer

NavBar e' un componente Astro con dieci righe di script per lo stato di
scroll, non un'isola: cosi' resta HTML statico su ogni pagina. Pagination e
Breadcrumb usano <a href> reali, quindi funzionano senza JS e sono indicizzabili."
```

---

### Task 14: CardTile — l'unico componente che ha davvero bisogno di JavaScript

Il tilt dipende dalla posizione del puntatore dentro l'elemento: `rotateY = (x/w - .5) * 10`, `rotateX = -(y/h - .5) * 10` (`bundle:775-783`). Non è esprimibile in CSS. Tutto il **resto** di `CardTile` — bordo che si scurisce, ombra che passa da `--sh-1` a `--sh-3`, sollevamento `--lift-hover`, comparsa del bottone «mi piace» — è hover, e va in CSS.

**Files:**
- Create: `src/components/ds/CardTile.svelte`
- Modify: `src/styles/ds.css`, `src/pages/ds-gallery.astro`

**Interfaces:**
- Consumes: `CardArt` (Task 9), `RarityBadge` (Task 9), `IconButton` (Task 10)
- Produces: `CardTile` con props `name`, `code`, `set`, `rarity`, `src`, `href`, `tilt`, `onclick`, snippet `badge`

- [ ] **Step 1: Portare `CardTile`**

Sorgente `bundle:755-901`. Struttura da rispettare: contenitore → `<div style="perspective:700">` → `CardArt` → badge in posizione assoluta `top:20;left:20` → blocco testo con nome e codice sulla stessa riga (`justify-content:space-between`) → riga con `RarityBadge size="sm"` e nome espansione.

Il tilt in Svelte 5:

```svelte
<script lang="ts">
  let { tilt = true, /* … */ } = $props()
  let rx = $state(0), ry = $state(0), hover = $state(false)

  function move(e: MouseEvent) {
    if (!tilt) return
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
    ry = ((e.clientX - r.left) / r.width - 0.5) * 10
    rx = -((e.clientY - r.top) / r.height - 0.5) * 10
  }
  const reset = () => { rx = 0; ry = 0; hover = false }
</script>
```

I coefficienti sono `10` per `CardTile` e `16` per la scheda carta (`design-reference/carta.jsx`), `14` sul tocco. **Non uniformarli**: sono valori distinti nella sorgente.

- [ ] **Step 2: Rendere il tilt opzionale e progressivo**

`CardTile` deve **renderizzare correttamente anche senza idratazione**: gli attributi `onmousemove` sono l'unica parte che richiede JS. Quando la tessera è dentro una pagina statica si monta senza `client:`, e resta una tessera perfettamente funzionante con hover, bordo, ombra e link — solo senza tilt. È questo che permette a `/espansioni` e alla home di non idratare la griglia.

Rispettare inoltre `prefers-reduced-motion`: se l'utente lo richiede, il tilt non si applica.

```svelte
const ridotto = typeof matchMedia === 'function'
  && matchMedia('(prefers-reduced-motion: reduce)').matches
```

- [ ] **Step 3: Verificare**

- Con `tilt` attivo e mouse sopra: la carta ruota seguendo il puntatore, con `scale(1.02)` e lo sheen foil che attraversa;
- senza idratazione: hover, bordo scuro, ombra e sollevamento funzionano lo stesso;
- con `prefers-reduced-motion: reduce` attivo nel browser: nessuna rotazione.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: CardTile con tilt 3D

E' l'unico componente del design system che ha bisogno di JavaScript, perche'
la rotazione dipende dalla posizione del puntatore. Tutto il resto dell'hover
e' in CSS, quindi la tessera resta corretta anche senza idratazione."
```

---
# FASE 3 — Shell e pagine

L'ordine delle pagine non è casuale: si parte dalla più semplice (`/chi-siamo`, zero interazione) per validare la catena layout → token → componenti su un caso senza variabili, e si finisce con la più complessa (`/catalogo`).

### Task 15: Layout di base e shell interattiva

**Files:**
- Create: `src/layouts/Base.astro`, `src/components/islands/SiteChrome.svelte`, `src/stores/chrome.ts`
- Consuma (creato al Task 13): `src/config/nav.ts`
- Create: `public/assets/logo-mark.svg`, `public/assets/logo.svg`

**Interfaces:**
- Consumes: esito del Task 2 (store condiviso o `CustomEvent`), `NavBar.astro`/`Footer.astro` (Task 13), `Dialog`/`Sheet`/`Toast` (Task 12)
- Produces:
  - `Base.astro` con props `{ title, description, active, catalogCount? }`
  - store `chrome` con: `apriChiedi(card | null)`, `apriQuick(card)`, `avviso(title, description, tone?)`
  - `SiteChrome` monta menu mobile, dialog «Chiedi una carta», quick-view e toast

- [ ] **Step 1: Copiare i loghi**

```bash
mkdir -p public/assets
cp design-reference/assets/logo-mark.svg design-reference/assets/logo.svg public/assets/
```

- [ ] **Step 2: Scrivere lo store**

`src/stores/chrome.ts` — usare il meccanismo confermato dal Task 2.

```ts
import { writable } from 'svelte/store'
import type { Card } from '~/lib/catalog'

export interface Toast { title: string; description: string; tone: 'success' | 'info' }

export const chiedi = writable<Card | true | null>(null)   // true = richiesta generica
export const quick  = writable<Card | null>(null)
export const menu   = writable(false)
export const toast  = writable<Toast | null>(null)

let t: ReturnType<typeof setTimeout>
export function avviso(title: string, description: string, tone: Toast['tone'] = 'success') {
  toast.set({ title, description, tone })
  clearTimeout(t)
  t = setTimeout(() => toast.set(null), 2800)
}
```

I 2800 ms sono quelli del prototipo (`design-reference/guscio.jsx`, funzione `avviso`).

- [ ] **Step 3: Scrivere `SiteChrome.svelte`**

Porting di `design-reference/guscio.jsx`: `MenuMobile`, `DettagliChiedi`, l'anteprima rapida e il contenitore del toast. Regole:

- sotto 1080px il quick-view e il «Chiedi» usano `Sheet`, sopra usano `Dialog` — come nel prototipo, che sceglie con `useMedia("(max-width:1080px)")`;
- il testo precompilato del messaggio è quello esatto del prototipo:
  `Ciao, ho visto ${nome} (${codice}) sul sito. È ancora in vetrina?` con carta,
  `Ciao, sto cercando una carta. La avete in vetrina?` senza;
- «Copia il messaggio» usa `navigator.clipboard.writeText` e poi `avviso('Messaggio copiato', 'Incollalo su Instagram o WhatsApp.')`.

- [ ] **Step 4: Scrivere `Base.astro`**

```astro
---
import '~/styles/global.css'
import { SITE } from '~/config/site'
import NavBar from '~/components/NavBar.astro'
import Footer from '~/components/Footer.astro'
import SiteChrome from '~/components/islands/SiteChrome.svelte'
import Button from '~/components/ds/Button.svelte'

interface Props { title: string; description?: string; active: string; catalogCount?: number }
const { title, description = SITE.seo.descrizione, active, catalogCount } = Astro.props
---
<!doctype html>
<html lang="it">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="icon" href="/assets/logo-mark.svg" />
    <link rel="canonical" href={new URL(Astro.url.pathname, Astro.site)} />
  </head>
  <body>
    <div style="min-height:100vh;display:flex;flex-direction:column">
      <NavBar {active} {catalogCount} />
      <main style="flex:1"><slot /></main>
      <Footer />
    </div>
    <SiteChrome client:idle />
  </body>
</html>
```

`client:idle` e non `client:load`: la shell interattiva serve solo quando l'utente agisce, quindi non deve competere col first paint.

- [ ] **Step 5: Verificare**

Montare `Base.astro` su una pagina di prova. Controllare: NavBar sticky che cambia a scroll, Footer a 4 colonne che diventano 2 sotto 1080px e 1 sotto 760px, `SiteChrome` che non genera errori in console.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: layout di base e shell interattiva

NavBar e Footer sono HTML statico su ogni pagina; una sola isola, montata
con client:idle, gestisce menu mobile, dialog e toast, cosi' non compete
col first paint."
```

---

### Task 16: `/chi-siamo` — la pagina a zero JavaScript

**Files:**
- Create: `src/pages/chi-siamo.astro`

**Interfaces:**
- Consumes: `Base.astro`, `Panel`, `ConditionBadge`, `Button`, `Icon`
- Produces: rotta `/chi-siamo`

Sorgente: `design-reference/about.jsx`. Cinque sezioni: hero con retino a punti, «Storia» a 4 pannelli, «Chi ci lavora» su fondo scuro con 3 avatar foil, «Come schediamo» a 4 pannelli, «Condizione» con i 5 gradi e i due bottoni finali.

- [ ] **Step 1: Portare la pagina**

Le costanti `PERSONE`, `PASSI`, `NOTE_COND` e i 4 anni della storia si spostano in `src/config/about.ts`, così il cliente li modifica senza toccare il markup. I testi vanno copiati **alla lettera**, apostrofi tipografici compresi.

- [ ] **Step 2: Verificare la fedeltà**

`http://localhost:4321/chi-siamo` accanto a `http://localhost:4322/index.html#/about`, a 390 / 1024 / 1440 px.

- [ ] **Step 3: Verificare che spedisca zero JavaScript**

```bash
pnpm build
```

Poi aprire `/chi-siamo` con il pannello Rete del browser e filtrare per `JS`. Atteso: **solo** il bundle di `SiteChrome` (`client:idle`). Nessun altro script.

Se compare altro, un componente della pagina è stato montato con una direttiva `client:` per errore.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: pagina Chi siamo

E' la pagina piu' semplice del sito e la si fa per prima di proposito:
valida la catena layout-token-componenti senza variabili di interazione.
Non spedisce JavaScript oltre alla shell."
```

---

### Task 17: `/negozio`

**Files:**
- Create: `src/pages/negozio.astro`, `src/components/Mappa.astro`

**Interfaces:**
- Consumes: `Base.astro`, `Panel`, `Button`, `Icon`, `SITE`
- Produces: rotta `/negozio`

Sorgente: `design-reference/negozio.jsx`. Intestazione, due colonne (indirizzo e orari a sinistra, mappa a destra), sezione «Scrivici» con i 3 social, sezione «In negozio» con 4 pannelli.

- [ ] **Step 1: Portare la pagina e la mappa segnaposto**

`Mappa.astro` riproduce il segnaposto del prototipo: pattern a griglia su fondo `--surface-sunken`, pin rosso con bordo nero e ombra sticker al 46%/44%, etichetta con la via, e la scritta in basso a sinistra «Mappa segnaposto — da sostituire con la mappa vera».

**Lasciare il segnaposto.** Sostituirlo con una mappa vera richiede l'indirizzo reale del cliente (spec §13, domanda aperta 3) e introdurrebbe un iframe di terze parti che pesa sul pilastro 3. È una decisione da prendere con dati alla mano.

- [ ] **Step 2: Collegare i bottoni alla shell**

«Chiedi una carta» chiama `chiedi.set(true)` dallo store. Poiché la pagina è statica, serve un frammento interattivo minimo: un `<AskButton client:visible />` che avvolge il `Button`. È l'unica isola della pagina.

- [ ] **Step 3: Verificare la fedeltà** a 390 / 1024 / 1440 px contro `#/negozio`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: pagina Il negozio

La mappa resta il segnaposto del prototipo: sostituirla richiede l'indirizzo
reale del cliente e un iframe di terze parti, due decisioni da prendere con
i dati in mano."
```

---

### Task 18: `/espansioni`

**Files:**
- Create: `src/pages/espansioni.astro`, `src/components/islands/SetFilter.svelte`

**Interfaces:**
- Consumes: `Base.astro`, `Panel`, `Tabs`, `Badge`, `CardArt`, `Button`, `getAllSets`/`getIndexedCards`
- Produces: rotta `/espansioni`; ogni «Vedi le carte» punta a `/catalogo?set=<id>`

Sorgente: `design-reference/espansioni.jsx`. Intestazione con Tabs (Tutte / Recenti / Vintage), poi un `Panel hoverLift` per espansione con pastiglia colorata, titolo, codice, barra di riempimento e le prime 6 miniature.

- [ ] **Step 1: Renderizzare tutte le espansioni staticamente**

Il filtro dei Tabs opera su 6 elementi: **renderizzarli tutti in HTML** e far nascondere/mostrare all'isola, invece di ricostruire la lista. Così la pagina è completa senza JS e il filtro è istantaneo.

```astro
{sets.map((s) => (
  <div data-set-year={s.year} data-recente={s.year >= 2023}>…</div>
))}
```

`SetFilter.svelte` è un'isola `client:visible` che monta solo i `Tabs` e commuta un attributo sul contenitore; il CSS nasconde ciò che non serve:

```css
.sets[data-tab="recenti"] [data-recente="false"]{display:none}
.sets[data-tab="vintage"] [data-recente="true"]{display:none}
```

- [ ] **Step 2: Portare `BarraSchedate`**

Percentuale `Math.round(inVetrina(s) / s.total * 100)`, dove `inVetrina(s) = Math.round(s.total * 0.42)` da `design-reference/dati.jsx`. Spostare `inVetrina` in `src/lib/catalog/labels.ts` come funzione esportata.

- [ ] **Step 3: Le miniature aprono il quick-view**

Le 6 `CardArt` per espansione sono bottoni che chiamano `quick.set(card)`. Stanno dentro l'isola `SetFilter` per avere accesso allo store.

- [ ] **Step 4: Verificare la fedeltà** contro `#/espansioni`. Controllare che le barre colorate abbiano il colore dell'espansione e larghezza 42%.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: pagina Espansioni

Le sei espansioni sono renderizzate tutte in HTML e i Tabs commutano un
attributo: la pagina e' completa senza JS e il filtro e' istantaneo."
```

---

### Task 19: `/` — la vetrina

**Files:**
- Create: `src/pages/index.astro`, `src/components/islands/{HeroSearch,NuoviArrivi}.svelte`
- Modify: `src/pages/index.astro` (sostituisce il segnaposto del Task 1)

**Interfaces:**
- Consumes: tutto il design system, `getIndexedCards`, `getAllSets`
- Produces: rotta `/`

Sorgente: `design-reference/vetrina.jsx`. Cinque sezioni: `Hero`, `NuoviArrivi`, `FasciaEspansioni`, `ComeFunziona`, `StriscaNegozio`.

- [ ] **Step 1: `Hero` — isola per la sola ricerca**

Occhiello, titolo `100 carte,<br/>schedate a mano.` (il numero viene dal conteggio reale delle carte), testo, `SearchField`, chip «Cercati oggi», e a destra le prime 4 carte ruotate di `±1.5deg`.

Solo il `SearchField` e le 4 `CardTile` hanno bisogno di JS: raggrupparli in `HeroSearch.svelte` (`client:load`, perché la ricerca è la prima cosa che l'utente tocca). Titolo, testo e chip restano HTML statico.

I suggerimenti filtrano su `name` e mostrano i primi 5, con `meta` uguale al codice carta. Scegliere un suggerimento porta a `/catalogo?q=<label>`.

- [ ] **Step 2: `NuoviArrivi` — stessa tecnica di `/espansioni`**

Le 10 carte si renderizzano tutte in HTML con `data-holo` e `data-vintage`; i Tabs commutano un attributo sul contenitore. `holo` significa rarità in `holo`/`ultra`/`secret`; `vintage` significa anno dell'espansione < 2010.

- [ ] **Step 3: `FasciaEspansioni`, `ComeFunziona`, `StriscaNegozio` — HTML statico**

`FasciaEspansioni` su fondo `--surface-invert`, 6 tessere che linkano a `/catalogo?set=<id>`; l'effetto hover che colora il bordo col colore dell'espansione va in CSS con `--set-color` impostata inline per tessera. `ComeFunziona` sono 3 `Panel hoverLift` con i tre passi. `StriscaNegozio` è due colonne, con gli orari in un `Panel variant="sticker"`.

- [ ] **Step 4: Verificare la fedeltà** a 390 / 1024 / 1440 px contro `#/vetrina`. Punti critici: il titolo hero a `--fs-display-xl` (76px, che scende a 42px sotto 760px), le 4 carte inclinate in alternanza, il retino a punti dietro l'hero con `opacity:.7`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: pagina Vetrina

Solo la ricerca dell'hero e le tessere carta sono isole; titolo, testi,
fascia espansioni, i tre passi e la striscia negozio restano HTML statico."
```

---

### Task 20: `/catalogo` — la pagina piu complessa

**Files:**
- Create: `src/pages/catalogo.astro`, `src/components/islands/CatalogApp.svelte`
- Create: `src/lib/catalog/url.ts`
- Test: `src/lib/catalog/url.test.ts`

**Interfaces:**
- Consumes: `queryCards`, `getIndexedCards`, `getAllSets`, tutti i componenti form e catalogo
- Produces:
  - `parseQuery(params: URLSearchParams): CardQuery`
  - `toSearchParams(q: CardQuery): URLSearchParams`
  - rotta `/catalogo` con stato in querystring

- [ ] **Step 1: Scrivere il test della serializzazione URL**

`src/lib/catalog/url.test.ts`:

```ts
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
```

- [ ] **Step 2: Eseguire il test e verificare che fallisca**

Run: `pnpm test src/lib/catalog/url` → FAIL, import non risolto.

- [ ] **Step 3: Scrivere `src/lib/catalog/url.ts`**

Validare ogni valore contro le costanti di `labels.ts`: la querystring è input esterno e non va mai passata ai filtri senza controllo. Chiavi: `q`, `set` (ripetibile), `rar` (ripetibile), `cond` (ripetibile), `lang` (ripetibile), `foil`, `sort`, `p`.

- [ ] **Step 4: Eseguire il test e verificare che passi** → PASS, 5 test.

Aggiungere poi `export * from './url'` a `src/lib/catalog/index.ts`, cosi' le pagine continuano a importare solo da `~/lib/catalog`.

- [ ] **Step 5: Renderizzare staticamente la prima pagina**

`src/pages/catalogo.astro` renderizza in HTML l'intestazione, la barra dei filtri e **le prime 24 carte** dell'ordinamento `novita` senza filtri (spec §6.1), dentro un contenitore che `CatalogApp` sostituirà quando l'utente interagisce.

```astro
---
import { getAllSets, getIndexedCards, queryCards, PER_PAGE } from '~/lib/catalog'
const [cards, sets] = await Promise.all([getIndexedCards(), getAllSets()])
const iniziale = queryCards(cards, sets, { sort: 'novita', page: 1, perPage: PER_PAGE })
---
```

**Perché non si renderizza la pagina corrispondente alla querystring:** con `output: 'static'` esiste un solo HTML per `/catalogo`, e la querystring non è nota al build. L'isola legge `location.search` all'avvio e riallinea la griglia. Il contenuto statico serve al primo paint e ai motori di ricerca.

- [ ] **Step 6: Scrivere `CatalogApp.svelte`**

Porting di `design-reference/catalogo.jsx`. Comportamenti da riprodurre:

- filtri laterali su desktop (`.side`, sticky a 92px), dentro uno `Sheet` sotto 1080px;
- conteggi per voce di filtro calcolati sul dataset completo, come `conta()` nel prototipo;
- chip dei filtri attivi, rimovibili;
- `Select` di ordinamento e `Tabs` griglia/lista;
- `Skeleton` per 340 ms a ogni cambio di filtro — è nel prototipo (`setTimeout(...,340)`) ed è una scelta estetica deliberata, va mantenuta;
- `EmptyState` quando non c'è nulla;
- paginazione a 24 per pagina.

**Caricamento dei dati (spec §6.1):**

```ts
let dati = $state<CatalogPayload | null>(null)
let indice = $state<SearchPayload | null>(null)

async function caricaCatalogo() {
  if (dati) return
  dati = await (await fetch('/api/catalog.json')).json()
}
async function caricaIndice() {
  if (indice) return
  indice = await (await fetch('/api/search-index.json')).json()
}
```

`caricaCatalogo()` parte al primo cambio di filtro **oppure** in `requestIdleCallback`. `caricaIndice()` parte solo quando l'utente scrive nella ricerca. Finché `dati` è `null` resta visibile l'HTML statico.

**L'isola non importa mai `source.static`.** È il seam: quando la sorgente diventerà Supabase cambieranno solo le due URL, non questo file.

- [ ] **Step 7: Sincronizzare lo stato con l'URL**

A ogni cambio di filtro, `history.replaceState` con `toSearchParams`. Sul cambio di pagina, `history.pushState`, così il tasto Indietro torna alla pagina precedente dei risultati. All'avvio e su `popstate`, rileggere con `parseQuery`.

- [ ] **Step 8: Verificare**

- `/catalogo` senza JS mostra 24 carte e i filtri come `<details>` funzionanti;
- `/catalogo?set=alb&rar=holo` all'apertura mostra i filtri già spuntati e la griglia già filtrata;
- cambiare filtro aggiorna l'URL; Indietro ripristina lo stato precedente;
- a 390px il bottone «Filtri (N)» apre lo `Sheet`;
- confronto affiancato con `#/catalogo` su griglia, lista, skeleton e stato vuoto.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: pagina Catalogo con stato in querystring

Le prime 24 carte escono dal build in HTML: primo paint immediato e
indicizzabile. L'isola scarica il dataset solo al primo filtro e l'indice di
ricerca solo quando serve, e parla con /api/catalog.json, mai col filesystem."
```

---

### Task 21: `/carta/[slug]`

**Files:**
- Create: `src/pages/carta/[slug].astro`, `src/components/islands/{CardViewer,CardActions}.svelte`

**Interfaces:**
- Consumes: `getAllCards`, `getAllSets`, `CardArt`, `SpecList`, `Breadcrumb`, `RarityBadge`, `ConditionBadge`, `Panel`, `Tooltip`
- Produces: una pagina statica per carta

Sorgente: `design-reference/carta.jsx`.

- [ ] **Step 1: Generare le rotte**

```astro
---
export async function getStaticPaths() {
  const cards = await getAllCards()
  return cards.map((card) => ({ params: { slug: card.slug }, props: { card } }))
}
---
```

- [ ] **Step 2: Rendere statico tutto ciò che è testo**

Breadcrumb, badge, titolo, descrizione, i due `Panel` con `SpecList`, la nota di condizione e le 5 carte «Nella stessa vetrina» sono **HTML statico**. La nota di condizione è la catena di cinque testi in `carta.jsx`: spostarla in `src/config/condizioni.ts` come mappa `Record<Condition, string>`, così il cliente la modifica senza toccare il markup.

- [ ] **Step 3: `CardViewer` — l'isola del tilt**

Avvolge la sola `CardArt` grande. Coefficiente **16** con il mouse, **14** al tocco (`design-reference/carta.jsx`), `scale(1.03)` in hover, `box-shadow: var(--sh-glow-cyan)`, `perspective: 900`. Supporta `onTouchStart`/`onTouchMove`/`onTouchEnd` come il prototipo.

- [ ] **Step 4: `CardActions` — i tre bottoni**

«Chiedila in negozio» → `chiedi.set(card)`. «Come arrivare» → link statico a `/negozio`, quindi **fuori** dall'isola. «Condividi» copia `location.href` e chiama `avviso('Link copiato', nome + ' · ' + codice)`.

- [ ] **Step 5: Verificare**

- Il tilt segue il mouse e mostra il riflesso foil;
- su touch, tenendo il dito, la carta ruota;
- il testo sotto la carta cambia fra desktop e mobile: «Muovi il mouse sulla carta per vedere il riflesso» contro «Tieni il dito sulla carta per vedere il riflesso»;
- «Condividi» copia e fa comparire il toast;
- confronto affiancato con `#/carta/1`.

- [ ] **Step 6: Verificare il numero di pagine generate**

```bash
pnpm build && ls dist/carta | wc -l   # atteso: 100
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: scheda carta

Testo, specifiche e correlate sono HTML statico; sono isole solo il visore
col tilt 3D e i due bottoni che pilotano la shell."
```

---

### Task 22: `/404`

**Files:**
- Create: `src/pages/404.astro`

- [ ] **Step 1: Scrivere la pagina**

Usa `EmptyState` del design system, con titolo «Questa carta non è in vetrina», descrizione «La pagina che cerchi non esiste, o l'abbiamo spostata.» e due bottoni: «Torna alla vetrina» (`/`) e «Sfoglia il catalogo» (`/catalogo`). Nessuna isola.

- [ ] **Step 2: Verificare**

`pnpm build && pnpm preview`, poi visitare `/rotta-inesistente`. Atteso: la 404 con NavBar e Footer.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: pagina 404"
```

---
# FASE 4 — Immagini, rifinitura, deploy

### Task 23: Immagini delle carte su Cloudflare R2

Il prototipo non ha nessuna immagine: `CardArt` senza `src` mostra il placeholder foil. Le foto vere **non entrano mai nel repository**: una collezione di migliaia di foto in git resta nella storia per sempre e se la porta dietro ogni clone, e ripulirla dopo significa riscrivere la storia.

**Prerequisiti da procurarsi prima di iniziare** (spec §13): una zona Cloudflare per il dominio del sito, e un sottodominio da dedicare alle immagini (per esempio `img.<dominio>`).

**Files:**
- Create: `src/components/CardImage.astro`, `scripts/upload-immagini.ts`
- Modify: `src/config/site.ts`
- Create: `docs/CONTENUTI.md` (primo scrittore; il Task 27 lo completa)
- **Non** si crea `src/assets/cards/`: nel repository non finiscono binari

**Interfaces:**
- Produces: `CardImage.astro` con props `{ card, set, sizes?, priority? }`; `urlImmagine(key, width)` esportata da `~/lib/immagini.ts`
- Se la colonna `image` della carta e' vuota, ricade su `CardArt` senza `src`, identico al prototipo

#### Come stanno insieme i pezzi

```
cards.csv  colonna image = "fulmine-di-notte-alb-042.jpg"   ← solo la chiave R2
                              │
   bucket R2 ── dominio personalizzato ──►  https://img.<dominio>/fulmine-di-notte-alb-042.jpg
                              │
   trasformazione ──►  https://<dominio>/cdn-cgi/image/width=300,format=auto/https://img.<dominio>/…
```

Il formato `https://<ZONA>/cdn-cgi/image/<OPZIONI>/<SORGENTE>` e' quello documentato da Cloudflare, e **la sorgente puo' essere una URL assoluta su un altro host**: non deve stare sulla zona. Le opzioni utili qui sono `width`, `format=auto` (che serve AVIF o WebP secondo il browser) e `quality`.

- [ ] **Step 1: Creare il bucket e collegarlo a un dominio**

```bash
pnpm exec wrangler r2 bucket create cartafolia-carte
```

Poi, dalla dashboard: **R2 → Settings → Custom Domains → Add**, indicando `img.<dominio>`.

**Non usare il sottodominio `r2.dev`.** La documentazione Cloudflare lo dichiara rate-limited, senza cache ne' WAF, e «unsupported» per la produzione: va bene solo per provare in locale.

- [ ] **Step 2: Abilitare le trasformazioni sulla zona**

Dashboard → la zona del sito → **Images → Transformations → abilita**. Senza questo passaggio le URL `/cdn-cgi/image/...` restituiscono l'originale non trasformato, il che **funziona ma silenziosamente**: il sito sembra a posto e serve foto da telefono non ridimensionate. E' l'errore piu' facile da non accorgersi, quindi va verificato allo Step 6.

Il piano free include 5.000 trasformazioni uniche al mese; quelle gia' fatte restano in cache e non ricontano, quindi il consumo e' legato alle **foto nuove**, non alle visite.

- [ ] **Step 3: Configurare le immagini in `site.ts`**

```ts
immagini: {
  /** Dominio personalizzato del bucket R2. Vuoto = niente foto, si usa il placeholder. */
  origine: '',                       // es. 'https://img.cartafolia.it'
  /** Zona su cui girano le trasformazioni: di norma il dominio del sito. */
  zona: '',                          // es. 'https://cartafolia.it'
  larghezze: [150, 300, 450],
  qualita: 82,
},
```

Con `origine` o `zona` vuoti, `CardImage` ricade sul placeholder foil. Cosi' **lo sviluppo in locale funziona senza credenziali e senza rete**, e il sito non si rompe mai per una configurazione mancante.

- [ ] **Step 4: Scrivere `src/lib/immagini.ts`**

```ts
import { SITE } from '~/config/site'

export const immaginiAttive = () => Boolean(SITE.immagini.origine && SITE.immagini.zona)

/** https://<zona>/cdn-cgi/image/<opzioni>/<url sorgente assoluta> */
export function urlImmagine(key: string, width: number): string {
  const { origine, zona, qualita } = SITE.immagini
  const opzioni = `width=${width},format=auto,quality=${qualita},fit=scale-down`
  return `${zona}/cdn-cgi/image/${opzioni}/${origine}/${encodeURIComponent(key)}`
}

export const srcsetImmagine = (key: string) =>
  SITE.immagini.larghezze.map((w) => `${urlImmagine(key, w)} ${w}w`).join(', ')
```

- [ ] **Step 5: Scrivere `CardImage.astro`**

```astro
---
import CardArt from '~/components/ds/CardArt.svelte'
import { cardCode } from '~/lib/catalog'
import { immaginiAttive, srcsetImmagine, urlImmagine } from '~/lib/immagini'
import type { Card, CardSet } from '~/lib/catalog'

interface Props { card: Card; set: CardSet; sizes?: string; priority?: boolean }
const { card, set, sizes = '(max-width:760px) 45vw, 190px', priority = false } = Astro.props
const mostraFoto = Boolean(card.image) && immaginiAttive()
---
{mostraFoto ? (
  <div class="ds-cardart" style="border-radius:var(--r-cardart)">
    <img
      class="ds-cardart__img"
      src={urlImmagine(card.image!, 300)}
      srcset={srcsetImmagine(card.image!)}
      {sizes}
      alt={card.name}
      width="63" height="88"
      loading={priority ? 'eager' : 'lazy'}
      fetchpriority={priority ? 'high' : undefined}
      decoding="async"
    />
  </div>
) : (
  <CardArt rarity={card.rarity} code={cardCode(card, set)} />
)}
```

**Sul CLS**, che e' il rischio vero quando le immagini sono remote e il build non le conosce: `.ds-cardart` impone gia' `aspect-ratio: var(--card-aspect)` cioe' 63/88, e `width`/`height` sul tag ribadiscono la proporzione. Lo spazio e' quindi riservato prima che arrivi un solo byte — **niente salti di layout**, esattamente come con le immagini locali.

- [ ] **Step 6: Usare `priority` solo sui candidati LCP**

Le prime 4 carte dell'hero e la carta grande della scheda: `priority`. Tutte le altre restano `lazy`. Sulla scheda carta aggiungere anche il preload in `<head>`:

```astro
<link rel="preload" as="image" imagesrcset={srcsetImmagine(card.image)} {sizes} />
```

- [ ] **Step 7: Scrivere lo script di upload**

`scripts/upload-immagini.ts` carica una cartella locale (fuori dal repository, o ignorata da git) sul bucket, usando come chiave il nome del file:

```ts
import { execFileSync } from 'node:child_process'
import { readdirSync } from 'node:fs'
import { join } from 'node:path'

const cartella = process.argv[2]
const bucket = 'cartafolia-carte'
if (!cartella) throw new Error('uso: pnpm tsx scripts/upload-immagini.ts <cartella>')

const file = readdirSync(cartella).filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f))
for (const f of file) {
  execFileSync('pnpm', ['exec', 'wrangler', 'r2', 'object', 'put',
    `${bucket}/${f}`, '--file', join(cartella, f), '--remote'], { stdio: 'inherit' })
  console.log('caricato', f)
}
console.log(`${file.length} immagini caricate. Scrivi i nomi nella colonna image di cards.csv.`)
```

Aggiungere `"upload:img": "tsx scripts/upload-immagini.ts"` agli script.

Aggiungere a `.gitignore` una cartella di lavoro per le foto, cosi' un errore non le fa finire nel repository:

```
/foto-carte/
```

- [ ] **Step 8: Verificare con una foto vera**

```bash
pnpm upload:img ./foto-carte
```

Scrivere il nome del file nella colonna `image` di una riga, poi `pnpm build && pnpm preview`. Nel pannello Rete controllare che:

1. l'URL richiesta contenga `/cdn-cgi/image/width=`;
2. il `content-type` della risposta sia `image/avif` o `image/webp`, **non** `image/jpeg` — se e' jpeg, le trasformazioni non sono attive sulla zona (Step 2);
3. il peso trasferito sia una frazione dell'originale;
4. il riquadro della carta occupi il suo spazio **prima** che l'immagine arrivi: rallentare la rete a «Slow 3G» e verificare che nulla salti.

Il punto 2 e' quello che va controllato davvero, perche' senza trasformazioni tutto sembra funzionare lo stesso.

- [ ] **Step 9: Documentare per chi aggiorna**

In `docs/CONTENUTI.md`, sezione «Aggiungere la foto di una carta»:

1. metti i file in una cartella qualsiasi (per esempio `foto-carte/`, che git ignora);
2. `pnpm upload:img ./foto-carte`;
3. scrivi il nome del file nella colonna `image` della riga della carta in `cards.csv`;
4. commit e push.

Aggiungere la regola: **le foto non si mettono mai nel repository.** Se una foto finisce in un commit, va tolta prima che il commit venga pushato.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: immagini delle carte su R2 con trasformazioni Cloudflare

Le foto non entrano nel repository: migliaia di binari resterebbero nella
storia git per sempre e li scaricherebbe ogni clone. Stanno su R2 dietro un
dominio personalizzato, e /cdn-cgi/image serve AVIF o WebP ridimensionati.

Il rapporto 63/88 e' imposto dal contenitore, quindi niente CLS nonostante
le immagini siano remote e sconosciute al build. Con la configurazione vuota
si ricade sul placeholder foil, cosi' lo sviluppo locale funziona senza rete."
```

---

### Task 24: SEO, cache e transizioni

**Files:**
- Create: `public/_headers`, `public/robots.txt`
- Modify: `src/layouts/Base.astro`, `astro.config.mjs`

- [ ] **Step 1: Completare i metadati in `Base.astro`**

Aggiungere Open Graph (`og:title`, `og:description`, `og:type`, `og:url`, `og:locale` = `it_IT`), `twitter:card`, e i dati strutturati del negozio, che per un'attività locale valgono più di ogni altra cosa:

```astro
<script type="application/ld+json" set:html={JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: SITE.nome,
  address: { '@type': 'PostalAddress', streetAddress: SITE.via,
             addressLocality: SITE.citta, postalCode: SITE.cap.split(' ')[0],
             addressCountry: 'IT' },
  openingHours: SITE.orari.filter(([, h]) => h !== 'chiuso').map(([g, h]) => `${g} ${h}`),
  url: Astro.site?.href,
})} />
```

Questo serve il pilastro sulla SEO locale citato nella spec §3.1: è ciò che fa comparire orari e indirizzo nei risultati di ricerca.

- [ ] **Step 2: Attivare le View Transitions**

In `Base.astro`, `<ClientRouter />` da `astro:transitions`. Verificare che il tilt di `CardViewer` e `CatalogApp` sopravvivano alla navigazione: le isole vanno rimontate a ogni transizione. Se emergono problemi di stato, `transition:persist` sulla shell.

**Se le View Transitions rompono le isole in modo non banale, rimuoverle.** Sono un miglioramento percepito, non un requisito: il pilastro 2 vale più di un'animazione di pagina.

- [ ] **Step 3: Scrivere `public/_headers`**

```
/_astro/*
  Cache-Control: public, max-age=31536000, immutable

/api/*
  Cache-Control: public, max-age=300, stale-while-revalidate=86400

/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
```

I file sotto `/_astro/` hanno l'hash nel nome, quindi `immutable` è sicuro. `/api/*` ha una cache breve perché il catalogo cambia quando il cliente aggiorna i contenuti.

Attenzione al limite Cloudflare di **100 regole** in `_headers` (spec §11.1): queste sono 3.

- [ ] **Step 4: Scrivere `public/robots.txt`**

```
User-agent: *
Allow: /
Sitemap: https://cartafolia.example/sitemap-index.xml
```

Il dominio va sostituito insieme a `site` in `astro.config.mjs` al Task 26.

- [ ] **Step 5: Misurare**

```bash
pnpm build && pnpm preview
```

Con il pannello Rete, su `/chi-siamo`: contare i byte JS. Atteso: solo `SiteChrome`. Su `/catalogo`: il dataset **non** deve essere scaricato prima che l'utente tocchi un filtro.

Registrare i numeri in `docs/PERFORMANCE.md`, così le regressioni future si vedono.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: SEO locale, cache headers e transizioni

I dati strutturati Store con indirizzo e orari sono cio' che fa comparire il
negozio nei risultati locali: per un'attivita' fisica valgono piu' di ogni
altra ottimizzazione."
```

---

### Task 25: Smoke test end-to-end

**Files:**
- Create: `playwright.config.ts`, `e2e/rotte.spec.ts`, `e2e/catalogo.spec.ts`

- [ ] **Step 1: Configurare Playwright**

```ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  webServer: { command: 'pnpm build && pnpm preview', url: 'http://localhost:4321', reuseExistingServer: !process.env.CI },
  use: { baseURL: 'http://localhost:4321' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['iPhone 13'] } },
  ],
})
```

- [ ] **Step 2: Scrivere lo smoke sulle rotte**

```ts
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
    page.on('console', (m) => { if (m.type() === 'error') errori.push(m.text()) })

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

test('chi-siamo non spedisce JS oltre alla shell', async ({ page }) => {
  const js: string[] = []
  page.on('request', (r) => { if (r.resourceType() === 'script') js.push(r.url()) })
  await page.goto('/chi-siamo')
  await page.waitForLoadState('networkidle')
  expect(js.length, `script caricati: ${js.join(', ')}`).toBeLessThanOrEqual(2)
})
```

- [ ] **Step 3: Scrivere lo smoke sul catalogo**

```ts
import { expect, test } from '@playwright/test'

test('i filtri in querystring sono applicati all apertura', async ({ page }) => {
  await page.goto('/catalogo?rar=holo')
  await expect(page.getByRole('checkbox', { name: /Holo/ })).toBeChecked()
})

test('filtrare aggiorna URL e risultati, e Indietro ripristina', async ({ page }) => {
  await page.goto('/catalogo')
  const prima = await page.locator('[data-card]').count()
  await page.getByRole('checkbox', { name: /Ultra rara/ }).check()
  await expect(page).toHaveURL(/rar=ultra/)
  await expect(page.locator('[data-card]')).not.toHaveCount(prima)
  await page.goBack()
  await expect(page).not.toHaveURL(/rar=ultra/)
})

test('la ricerca trova per codice espansione', async ({ page }) => {
  await page.goto('/catalogo')
  await page.getByRole('searchbox').fill('ALB')
  await expect(page.locator('[data-card]').first()).toBeVisible()
})

test('il catalogo mostra carte anche senza JavaScript', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false })
  const page = await ctx.newPage()
  await page.goto('/catalogo')
  await expect(page.locator('[data-card]')).toHaveCount(24)
  await ctx.close()
})
```

L'ultimo test è quello che protegge davvero la scelta architetturale: se qualcuno in futuro spostasse la griglia dentro l'isola, fallirebbe.

Aggiungere `data-card` come attributo su ogni tessera in `CardTile`.

- [ ] **Step 4: Eseguire**

```bash
pnpm exec playwright install chromium
pnpm test:e2e
```
Atteso: tutti verdi su entrambi i profili.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "test: smoke end-to-end sulle rotte e sul catalogo

Il test che apre il catalogo con JavaScript disattivato e si aspetta 24 carte
e' quello che protegge la scelta architetturale: se la griglia finisse dentro
l'isola, fallirebbe subito."
```

---

### Task 26: Deploy su Cloudflare Workers

**Files:**
- Create: `wrangler.jsonc`, `.github/workflows/deploy.yml`, `.env.example`
- Modify: `astro.config.mjs`, `public/robots.txt`

**Serve dall'utente prima di questo task** (spec §13): nome del Worker, account ID, dominio definitivo ed eventuale remote GitHub.

- [ ] **Step 1: Scrivere `wrangler.jsonc`**

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "NOME-DEL-WORKER",          // ← dall'utente
  "compatibility_date": "2026-08-18",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "404-page"
  }
  // Nessun "main": il Worker serve solo asset statici.
  // Le richieste agli asset sono gratuite e non consumano la quota del piano free.
}
```

- [ ] **Step 2: Aggiornare il dominio**

In `astro.config.mjs` sostituire `site: 'https://cartafolia.example'` col dominio reale, e la stessa URL in `public/robots.txt`.

- [ ] **Step 3: Deploy manuale di prova**

```bash
pnpm build
pnpm exec wrangler deploy
```

Se non si è autenticati, wrangler apre il browser. **Questo comando lo esegue l'utente**, non l'agente: richiede il suo login.

- [ ] **Step 4: Scrivere il workflow**

`.github/workflows/deploy.yml`:

```yaml
name: deploy
on:
  push: { branches: [main] }
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 11 }
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm check
      - run: pnpm test
      - run: pnpm build
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

`pnpm check` e `pnpm test` girano **prima** del build: un errore di tipo o un test rotto non arrivano in produzione.

- [ ] **Step 5: Documentare i segreti**

`.env.example` (nel repository, senza valori) e una sezione in `README.md`:

> I segreti `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID` vanno inseriti in
> GitHub → Settings → Secrets and variables → Actions. Non devono mai comparire
> nel repository, nei log o in una sessione di chat.

- [ ] **Step 6: Verificare il deploy**

Dopo il push, controllare che il sito risponda sul dominio, che `/api/catalog.json` sia raggiungibile e che le intestazioni di cache su `/_astro/*` riportino `immutable`.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "ci: deploy su Cloudflare Workers static assets

Worker solo-asset, senza main: le richieste agli asset statici sono gratuite
e non consumano la quota del piano free. check e test girano prima del build,
cosi' un errore di tipo non arriva in produzione."
```

---

### Task 27: Verifica finale della fedelta e pulizia

È il task che chiude il pilastro 1. Non va saltato.

**Files:**
- Delete: `src/pages/ds-gallery.astro`
- Create: `README.md`, `docs/FEDELTA.md`
- Modify: `docs/CONTENUTI.md` (creato al Task 23, qui si completa)

- [ ] **Step 1: Confronto affiancato completo**

Due finestre: `http://localhost:4321` e `http://localhost:4322/index.html`. Per **ognuna** delle 6 pagine e a **ognuno** dei 3 viewport (390, 1024, 1440), confrontare e annotare in `docs/FEDELTA.md`:

| Pagina | 390 | 1024 | 1440 | Note |
|---|---|---|---|---|

Punti su cui si accumulano gli scostamenti, da controllare per primi:
- dimensione e tracking del titolo hero (`--fs-display-xl`, che cambia sotto 760px);
- numero di colonne di `.cards` ai vari viewport;
- spaziatura verticale delle sezioni (`--section-y`, 96px che diventano 56px);
- ombre sticker: offset pieno senza sfocatura, non ombre morbide;
- `.foot` che passa da 4 colonne a 2 a 1.

- [ ] **Step 2: Verificare l'aderenza ai token**

Il design system porta con sé `_adherence.oxlintrc.json`, che vieta i valori hardcoded.
**Non è utilizzabile qui**: i suoi selettori sono `JSXOpeningElement` e le sue regole
cercano literal JavaScript, quindi valida React e non vede né i `.svelte` né i `.css`.
I contratti di prop che conteneva sono stati estratti in
`design-reference/CONTRATTI-COMPONENTI.md`; le tre regole di aderenza che sopravvivono
al porting si verificano così:

```bash
# 1. Nessun colore esadecimale grezzo fuori dai file che definiscono i token
grep -rnE '#[0-9a-fA-F]{3,8}\b' src --include='*.svelte' --include='*.astro'   --include='*.css' --include='*.ts' | grep -v '^src/styles/tokens/' || echo "ok: nessun hex grezzo"

# 2. Nessun px grezzo in ds.css e layout.css (i token li definiscono altrove)
grep -nE '[^-a-zA-Z(]([0-9]+)px' src/styles/ds.css src/styles/layout.css || echo "ok: nessun px grezzo"

# 3. Solo le tre famiglie del design system
grep -rn 'font-family' src --include='*.svelte' --include='*.astro' --include='*.css'   | grep -v 'var(--font-' | grep -v '^src/styles/tokens/' || echo "ok: solo font del design system"
```

Il punto 2 produrrà dei riscontri legittimi: i valori che il prototipo stesso scrive come
numeri nudi (`gap: 12` e `padding: 12` in `CardTile`, `padding: "8px 16px"` in `Button`,
le altezze delle barre di `ConditionBadge`). La regola del progetto è **fedeltà letterale
alla sorgente**, non normalizzazione: ognuno di questi va confrontato con l'intervallo di
righe nel bundle e, se corrisponde, annotato in `docs/FEDELTA.md` come atteso. Ciò che non
corrisponde a nulla nella sorgente è invece un difetto da correggere.

- [ ] **Step 3: Rimuovere la galleria di sviluppo**

```bash
rm src/pages/ds-gallery.astro
rm -f src/components/islands/DsForms.svelte
```

- [ ] **Step 4: Scrivere `README.md`**

Sezioni: cos'è il progetto, comandi (`dev`, `dev:ref`, `build`, `test`, `test:e2e`, `seed`, `deploy`), dove si modificano i contenuti (`src/config/site.ts` e `src/content/`), come si aggiungono le foto, com'è organizzato il codice, come si deploya, e il rimando alla spec e a questo piano.

- [ ] **Step 5: Scrivere `docs/CONTENUTI.md`**

La guida per chi aggiorna il sito senza toccare il codice: cambiare nome e indirizzo del negozio, cambiare gli orari, aggiungere un'espansione, aggiungere una carta, aggiungere una foto, cosa succede se si sbaglia un campo (il build si ferma e dice quale).

- [ ] **Step 6: Verifica finale**

```bash
pnpm check && pnpm test && pnpm test:e2e && pnpm build
```
Tutti e quattro devono passare.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "docs: verifica di fedelta', README e guida ai contenuti

Il confronto affiancato col prototipo su 6 pagine e 3 viewport e' annotato in
docs/FEDELTA.md: e' la chiusura del pilastro 1, che chiedeva identita' al
design e non somiglianza a occhio."
```

---

## Riepilogo

| Fase | Task | Esito |
|---|---|---|
| 0 — Fondamenta | 1-4 | Progetto in piedi, token e icone locali, assunzione sullo store verificata |
| 1 — Dati | 5-8 | Logica del catalogo sotto test, `/api/catalog.json` emesso a build time |
| 2 — Design system | 9-14 | 26 componenti in Svelte, hover in CSS, un solo componente idratato |
| 3 — Pagine | 15-22 | Le 6 rotte più la 404 |
| 4 — Rifinitura | 23-27 | Immagini, SEO, E2E, deploy, verifica di fedeltà |

### Cosa resta in sospeso

Le domande aperte della spec §13 non bloccano nessun task fino al 26:

1. **Nome del Worker e account ID** — servono al Task 26
2. **Remote GitHub** — serve al Task 26
3. **Dati reali del cliente** — fino ad allora restano i dati demo, che sono validi e completi
4. **Zona Cloudflare e sottodominio immagini** — servono al Task 23
5. **Foto delle carte** — fino ad allora resta il placeholder foil, identico al prototipo
6. **Mappa vera al posto del segnaposto** — decisione da prendere con l'indirizzo reale, valutando il costo di un iframe di terze parti

### Task 28, previsto ma non pianificato: pipeline di ingestione

Per ora il catalogo lo committa lo sviluppatore: il cliente manda i dati, lui aggiorna `cards.csv` e pusha. Zero infrastruttura, niente che si rompa.

Quando quella cadenza diventera' fastidiosa — il prototipo dice che il catalogo si aggiorna «ogni martedi» — la strada gia' valutata e':

```
Google Sheet ──[voce di menu "Pubblica sul sito"]──► repository_dispatch
                                                            │
                                              Action: scarica CSV → valida
                                              → committa se cambiato → deploy
```

Un **trigger esplicito**, non un cron: il cron farebbe aspettare al cliente ore senza sapere se ha funzionato, e girerebbe a vuoto il resto del tempo. E su una voce di menu, non su `onEdit`, che farebbe partire un deploy a ogni tasto premuto.

E' proprio per tenere aperta questa strada a costo zero che il formato nel repo e' CSV: e' cio' che un foglio esporta, quindi la pipeline sarebbe solo l'Action, senza nessuna conversione da mantenere.

Due punti da risolvere quando si costruira', gia' identificati:
- **accesso al foglio** — pubblicato in sola lettura (basta: il catalogo e' pubblico comunque) oppure service account Google;
- **ritorno degli errori** — se il cliente rompe una colonna il build si ferma giustamente, ma lui vede il sito invariato e non sa perche'. Minimo indispensabile: la mail di fallimento dell'Action arriva allo sviluppatore, che fa da fallback. Mitigazione a monte: convalida dati sulle colonne del foglio, con rarita', condizione e lingua come elenchi chiusi.
