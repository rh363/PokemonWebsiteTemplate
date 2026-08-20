# Cartafolia

Sito vetrina e catalogo per un negozio di carte da collezione. Astro
(`output: 'static'`) con isole Svelte solo dove serve interattività —
niente framework lato server, niente database: il catalogo (100 carte demo,
sei espansioni) vive in `src/content/` come CSV e JSON, ed è pensato per
essere sostituito da un negozio reale senza cambiare una riga di codice del
sito, e in futuro da Supabase senza toccare le pagine (vedi "Come è
organizzato il codice" più sotto).

Porting letterale, componente per componente, di un prototipo React
(`design-reference/`): stessi token di design, stesso markup, stesso CSS —
non un redesign. Il documento che definisce l'obiettivo e i vincoli è
`docs/superpowers/specs/2026-08-18-cartafolia-astro-design.md`; il piano di
lavoro in 27 task è `docs/superpowers/plans/2026-08-18-cartafolia-astro.md`.

## Comandi

```bash
pnpm install          # Node 22, pnpm 11 — mai npm install
pnpm dev               # sito in sviluppo, http://localhost:4321
pnpm dev:ref            # prototipo React di riferimento, http://localhost:4322
pnpm build              # build statica in dist/
pnpm preview             # serve dist/ per un controllo pre-deploy
pnpm check                # astro check + svelte-check (TypeScript strict)
pnpm test                  # unit test (vitest)
pnpm test:e2e                # end-to-end (playwright, sul sito costruito)
pnpm lint                     # oxlint
pnpm seed                      # rigenera src/content/cards.csv coi dati demo
pnpm upload:img <cartella>      # carica foto carte su R2 (mai nel repository)
pnpm deploy                      # build + wrangler deploy (locale, vedi sotto)
```

`pnpm dev:ref` serve `design-reference/`, il prototipo React originale: è il
metro di paragone per ogni verifica visiva, non fa parte del sito.

## Dove si modificano i contenuti

Chi aggiorna il negozio, le carte o le espansioni **non tocca il codice**.
Tutto quello che serve è in:

- `src/config/site.ts` — nome, indirizzo, orari, social del negozio.
- `src/content/sets.json` — le espansioni.
- `src/content/cards.csv` — le carte, un foglio di calcolo.

La guida passo-passo, scritta per chi non conosce il build, è
`docs/CONTENUTI.md` — include anche come aggiungere la foto di una carta e
cosa succede (il build si ferma, dicendo dove) se un campo è sbagliato.

## Com'è organizzato il codice

- `src/components/ds/` — 26 componenti Svelte, il design system portato
  dal prototipo (Button, CardTile, Dialog, FilterGroup, …). Nessuno idrata
  JavaScript da solo: sono markup + CSS, con gli stati hover/focus/press
  gestiti in `src/styles/ds.css`, non in JS.
- `src/components/islands/` — le isole che *davvero* servono JavaScript
  (tilt 3D della carta, catalogo filtrabile, dialog "Chiedi una carta", …).
  Ognuna prende i dati dal seam `/api/catalog.json` (via `~/stores/catalog`),
  mai da prop di idratazione — così il payload di ogni pagina resta
  scalare (vedi `docs/PERFORMANCE.md`).
- `src/lib/catalog/` — la logica pura del catalogo (tipi, ricerca, filtri,
  ordinamento, paginazione) e il contratto `CatalogSource`. Oggi lo
  implementa `source.static.ts` leggendo `src/content/`; il giorno in cui il
  negozio avrà un backend vero, un adapter Supabase implementa lo stesso
  contratto e le pagine non cambiano.
- `src/pages/` — le sette rotte del sito (vetrina, catalogo, espansioni,
  negozio, chi siamo, scheda carta × 100, 404) più gli endpoint
  `/api/catalog.json` e `/robots.txt`.
- `src/styles/` — i token del design system (`tokens/`), copiati byte per
  byte da `design-reference/`, più `ds.css` (stili dei componenti) e
  `layout.css` (le classi di pagina: `.wrap`, `.cards`, `.hero`, …).
- `docs/FEDELTA.md` — il confronto misurato, pagina per pagina e viewport
  per viewport, fra questo sito e il prototipo.
- `docs/PERFORMANCE.md` — i numeri reali (non stimati) di isole,
  idratazione e script per pagina, con le regressioni da controllare.

## Deploy

Il sito è un Worker Cloudflare "solo asset statici" (`wrangler.jsonc`,
nessun `main`): serve `dist/` con `not_found_handling: "404-page"`.

**Prima del primo deploy**, chi possiede il progetto deve, in GitHub →
Settings → Secrets and variables → Actions:

1. Creare l'environment usato dal workflow (`environment:` in
   `.github/workflows/deploy.yml`) e metterci due **secret**:
   `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID`. Non vanno **mai**
   scritti nel repository, in un log o in una sessione di chat. I secret di
   un environment non sono visibili a un job che non lo dichiara: se il
   workflow fallisce con un token vuoto, il nome dell'environment è la
   prima cosa da controllare.
2. Verificare il nome del Worker in `wrangler.jsonc` (`name`): è anche il
   sottodominio `.workers.dev` finché non si collega un dominio proprio.

Restano poi tre valori che appartengono al deploy e non al progetto — il
dominio pubblico e il bucket delle foto. Hanno un default committato e
funzionante, e si sovrascrivono senza toccare il codice con le **Variables**
di GitHub (non i Secrets: sono indirizzi pubblici, finiscono nell'HTML):
`PUBLIC_SITE_URL`, `PUBLIC_IMG_ORIGINE`, `PUBLIC_IMG_ZONA`. In locale valgono
le stesse variabili in un file `.env`. Sono documentate una per una in
`.env.example`; `docs/CONTENUTI.md` spiega cosa cambia fra avere e non avere
`PUBLIC_IMG_ZONA`.

Il dominio è l'unico punto da cui derivano `robots.txt`, gli URL canonici e
la sitemap: cambiarlo lì li cambia tutti.

Da quel momento, ogni push su `main` esegue `.github/workflows/deploy.yml`:
installa le dipendenze, gira `pnpm check` e `pnpm test` (un errore di tipo
o un test rotto non arrivano mai in produzione), builda e pubblica con
`cloudflare/wrangler-action`.

Per un deploy manuale da locale (richiede login Cloudflare):

```bash
pnpm deploy
```

## Verifica prima di ogni merge

```bash
pnpm check && pnpm test && pnpm test:e2e && pnpm build
```

Tutti e quattro devono essere verdi. `docs/FEDELTA.md` copre la parte che
questi comandi non possono verificare da soli: che il sito sia visivamente
identico al prototipo.
