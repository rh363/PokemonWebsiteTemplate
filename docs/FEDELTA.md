# Fedeltà al prototipo — verifica finale (Task 27)

Il pilastro 1 del progetto (`docs/superpowers/specs/2026-08-18-cartafolia-astro-design.md`)
chiede identità col design del prototipo React, non somiglianza a occhio.
Questo file è la chiusura di quel pilastro: un confronto **misurato**, non
solo guardato, fra `http://localhost:4321` (sito costruito, `pnpm dev`) e
`http://localhost:4322` (prototipo, `pnpm dev:ref`, che serve
`design-reference/` con `serve`).

Quattro difetti sono già scivolati oltre un confronto a schermate durante
questo branch, ognuno segnalato in buona fede come "pixel-identico":

- testo del corpo a `#241D2C` invece di `#6B6178` in tre sezioni di
  `/chi-siamo` (Task 16) — un grigio e un quasi-nero si somigliano a occhio;
- una hero che non passava mai al suo dimensionamento mobile a 1024px
  (Task 19) — padding e dimensione del campo di ricerca non erano mai
  stati misurati, solo guardati;
- un chevron a 18px dove la sorgente ne aveva 16 (Task 20/11);
- una vista lista mai confrontata affatto (questo task).

Tutti e quattro sono già stati corretti nei task in cui sono stati trovati
(committati prima di questo giro). Questo file non li riscopre: verifica che
non ne restino di simili, con lo stesso tipo di errore che li aveva
nascosti — un colore vicino, una media query mancante, una vista mai aperta.

## La lista di misure, decisa prima di misurare

Per ognuna delle 6 pagine, a ognuno dei 3 viewport (390 / 1024 / 1440),
letti con `getComputedStyle` nel browser reale (non stimati dal CSS
sorgente, che potrebbe non applicarsi per cascata/specificità):

1. **Colore del testo, calcolato** — `color` di `<h1>`, dei `<h2>` di
   sezione e di almeno un paragrafo di corpo per pagina. È la categoria che
   ha già causato un difetto reale (ink-800 vs ink-500): un raffronto a
   schermate non la vede, `getComputedStyle` sì, in `rgb()` esatto.
2. **Dimensione del font, calcolata** — `font-size` degli stessi elementi,
   più elementi noti per cambiare a un breakpoint (`--fs-display-xl` sotto
   760px, i chevron, i badge).
3. **Padding e gap dei contenitori principali** — `padding` e `gap`
   calcolati di `.wrap`, `.sez`, `.hero`, dei `Panel` di riga, delle righe
   di lista. È la categoria del secondo difetto (hero senza dimensionamento
   mobile): un valore fisso invece di una media query si vede solo
   misurando il padding vero, non guardandolo.
4. **Numero di colonne della griglia** — `gridTemplateColumns` calcolato di
   `.cards`, `.g2`, `.g3`, `.foot`, `.cat`, dei `Panel` a due colonne —
   contato, non dedotto dal CSS sorgente (`repeat(auto-fill,minmax(...))`
   richiede il rendering reale per sapere quante colonne entrano).

**Perché questa lista è sufficiente**: copre esattamente le quattro
categorie in cui i difetti precedenti si sono nascosti — colore vicino ma
diverso, breakpoint di dimensione mai raggiunto, padding non responsivo,
vista mai aperta — su tutte e 6 le pagine e tutti e 3 i viewport dichiarati
dal progetto, più la vista lista del catalogo (mai confrontata prima).

**Cosa non copre**, dichiarato esplicitamente:

- **Animazioni e transizioni** (durata, easing) — verificate a Task 12+13 e
  24 con altri metodi (lettura del codice, browser reale per le View
  Transitions), non rientrano nella misura statica di questo file.
- **Interazione** (hover, focus, press, tilt 3D) — fuori scope: questo file
  misura lo stato di riposo. Gli stati interattivi sono stati verificati
  componente per componente nei Task 9-14 con `getComputedStyle` dopo un
  hover reale via CDP, non qui.
- **Colori di sfondo e ombre non testuali** — non ricontrollati qui perché
  già oggetto di audit dedicato (Task 10, ombra piatta 6px senza sfocatura)
  e perché il canale primario di regressione silenziosa è il testo, non lo
  sfondo (uno sfondo sbagliato si vede sempre a occhio; un colore di testo
  vicino no).
- **La galleria `/ds-gallery`** — rimossa in questo stesso task (era solo
  di sviluppo, non ha equivalente nel prototipo).

## Risultato per pagina e viewport

| Pagina | 390 | 1024 | 1440 | Note |
|---|---|---|---|---|
| Vetrina (`/` ↔ `#/vetrina`) | ✅ identico | ✅ identico | ✅ identico | h1 76→42px, `.cards` 5→2 col, `.foot` 4→1 col, tutti misurati uguali |
| Catalogo, vista griglia (`/catalogo`) | ✅ identico | ✅ identico | ✅ identico | `.cat` 2→1 col sotto 1080px, `.cards` 4 col a 1440/1024 (`minmax(190px,1fr)`), 2 col a 390 |
| Catalogo, vista lista (`/catalogo`, tab "Lista") | ✅ identico | — | ✅ identico | riga: padding 12px 16px, min-height 64px, gap 16px, nome 20px/`#0E0B12`, codice 12px/`#8A8296` — su entrambi. **Mai confrontata prima di questo task.** Riga `<a>` nel sito costruito contro `<div onclick>` nel prototipo: differenza voluta (Task 14/19-21, navigazione da tastiera), non un difetto |
| Espansioni (`/espansioni`) | ✅ identico (dopo fix) | ⚠️→✅ **difetto trovato e corretto** | ✅ identico | vedi sotto |
| Il negozio (`/negozio`) | ✅ identico | ✅ identico | ✅ identico | `.g2` 2→1 col sotto 1080px, `.g3` 4→3→1 col |
| Chi siamo (`/chi-siamo`) | ✅ identico | ✅ identico | ✅ identico | tutti i paragrafi `rgb(107,97,120)` = `#6B6178` su entrambi — il fix del Task 16 tiene |
| Scheda carta (`/carta/fulmine-solare-eco-035` ↔ `#/carta/1`) | ✅ identico | ✅ identico | ✅ identico | `.det` 400px+736px a 1440, 1 col sotto 1080, `.det-fix` statico/max-width 340px a 390 |

Nota d'ambiente: nessuna instabilità del server del prototipo a 1024px è
stata osservata durante queste misure (il quirk descritto nel Task 16 non si
è ripresentato); nessuna misura è stata scartata per questo motivo.

### Il difetto trovato: padding del `Panel` di riga in Espansioni sotto 1080px

`design-reference/espansioni.jsx` (riga 27): ogni riga-espansione è un
`Panel` con `padding={mobile?"var(--sp-5)":"var(--sp-6)"}`, dove
`mobile = useMedia("(max-width:1080px)")` — 20px sotto 1080px, 24px sopra.

Il porting (`src/pages/espansioni.astro`) passava `padding="var(--sp-6)"`
fisso al componente `Panel`, senza media query: 24px a ogni viewport. A
1440px il valore coincide per caso (sopra la soglia); a 1024px no —
misurato **24px reale contro 20px atteso**, la stessa taglia di scostamento
del difetto hero del Task 19 (padding fisso dove la sorgente ne ha uno
responsivo), stavolta trovato prima del merge invece che dopo.

**Corretto in questo task**: `Panel` ora riceve
`padding="var(--panel-set-row-padding)"`, una custom property definita su
`#sets-list` (24px di default, 20px sotto 1080px via `@media`) — la stessa
tecnica già in uso nel file per `grid-template-columns` e `justify-items`.
Rimisurato dopo il fix: 20px a 390 e 1024px, 24px a 1440px, su entrambi i
lati. File: `src/pages/espansioni.astro`.

### Aggiunta dopo il merge: tre difetti segnalati dall'utente

Questa sezione è stata scritta dopo il Task 27, in risposta a bug reali visti
in un browser vero. Sono la prova che la campagna di misure qui sopra non
copriva tutto: nessuna delle misure decise in anticipo guardava lo stato dei
dialog dopo una navigazione, né la larghezza di un `<dialog>` modale, né se
la carta grande della scheda occupasse spazio.

**1. Larghezza del bottom sheet su mobile — regressione del porting.**
Misurato sul prototipo a 390px di viewport: pannello **390px, tutta la
larghezza**. Misurato sul porting: **352px**. La causa non è nel nostro CSS
ma nel foglio di stile del browser: un `<dialog>` modale riceve
`max-width:calc(100% - 2em - 6px)` — 38px in meno — e quel limite vince su
`width:100%`. Il prototipo non lo incontrava perché il suo sheet è un `div`
dentro un wrapper `position:fixed`, non un `<dialog>`: è un costo nascosto
della scelta (buona per il resto: focus trap ed Escape gratis) di sostituire
il div con l'elemento nativo. Corretto con `max-width:none` su `.ds-sheet`
(`src/styles/ds.css`). Rimisurato: 390px, come il prototipo.

**2. `justify-items:center` su `.det-fix` sotto 1080px — divergenza voluta
dal prototipo.** `design-reference/index.html` riga 37 lo dichiara; il
porting lo aveva copiato fedelmente, come vuole il protocollo. Copiarlo era
sbagliato: `.det-fix` è un grid, e `justify-items:center` dimensiona le sue
celle sul contenuto invece che sulla colonna. La carta grande è un
`.ds-cardart` — `width:100%`, `aspect-ratio`, e dentro solo figli in
`position:absolute` — quindi larghezza intrinseca **zero**. Misurato a
390px: **0×0 sul porting e 0×0 sul prototipo stesso**. La carta sparisce
dalla propria scheda in entrambi.

È il primo punto del progetto in cui il prototipo è **sbagliato**, non
semplicemente diverso: la regola di fedeltà si ferma qui, perché una scheda
carta senza la carta non è un risultato che qualcuno volesse. Corretto in
`src/styles/layout.css` togliendo `justify-items:center` e dichiarando
`width:100%` sulla stessa regola — senza, i due `margin:auto` (che in un
grid disattivano lo stretch della cella) lasciavano `.det-fix` a 255px, la
larghezza della riga di suggerimento, e il `max-width:340px` dichiarato non
veniva mai raggiunto da nulla. Rimisurato: carta **340×475 a 390px** di
viewport, centrata. Presidiato da `e2e/scheda-carta.spec.ts`.

**3. Anteprima rapida che resta aperta dopo la navigazione.** Non è un
problema di fedeltà visiva ma di stato: vedi `docs/PERFORMANCE.md`, sezione
View Transitions.

## Verifica dell'aderenza ai token

`_adherence.oxlintrc.json` del design system non è utilizzabile qui: i suoi
selettori sono `JSXOpeningElement`, valida React e non vede né `.svelte` né
`.css`. Le tre regole superstiti si verificano con `grep` (comandi in
`task-27-brief.md`, Step 2).

### 1. Colori esadecimali grezzi fuori da `src/styles/tokens/`

```
src/components/ds/Toast.svelte:11:    success: { bg: 'var(--state-success)', fg: '#FFFFFF', icon: 'check' },
src/components/ds/Badge.svelte:9:    warning: { bg: 'var(--state-warning-soft)', fg: '#8A5A00', bd: 'transparent' },
```

Entrambi **attesi**, verificati contro il bundle del design system
(`design-reference/_ds/.../\_ds_bundle.js`):

- `Toast`, tono `success`: il bundle scrive `fg: "#FFFFFF"` letteralmente
  (funzione `Toast`, mappa dei toni) — non un token, un hex nudo nella
  sorgente stessa.
- `Badge`, tono `warning`: il bundle contiene `8A5A00` — stesso hex nudo.

(Un terzo hit, `DsOverlay.svelte:51` — `border-top-color:#1454FF` — era
markup della sola galleria di sviluppo `/ds-gallery`, rimossa in questo
stesso task insieme al componente: non compare più dopo la rimozione.)

### 2. `px` grezzi in `ds.css` e `layout.css`

110 riscontri in `ds.css`, 10 in `layout.css`. Sono la categoria che il
brief anticipa esplicitamente: "i valori che il prototipo stesso scrive come
numeri nudi" — ogni componente del design system nel prototipo è un oggetto
di stile inline React (`style={{gap:12, padding:"8px 16px", ...}}`), e la
regola del progetto è fedeltà letterale alla sorgente, non normalizzazione
a token dove la sorgente stessa non ne usa.

Campione verificato riga per riga contro `_ds_bundle.js` (bundle
transpilato, non i `.jsx` — la formattazione con spazio dopo `:` e newline è
quella del bundle, non del sorgente babel):

| `ds.css` | Valore | Bundle (`_ds_bundle.js`) | Componente |
|---|---|---|---|
| `.ds-emptystate__icon` | `width:56px;height:56px` | `width: 56, height: 56` | EmptyState |
| `.ds-switch` | `gap:10px` | `gap: 10` | Switch |
| `.ds-switch__track` | `width:44px;height:26px;padding:3px` | `width: 44, height: 26, padding: 3` | Switch |
| `.ds-switch__thumb` | `width:16px;height:16px` | `width: 16, height: 16` | Switch |
| `.ds-pagination` | `gap:8px` | `gap: 8` | Pagination |
| `.ds-pagination__page` | `min-width:34px;height:34px` | `minWidth: 34, height: 34` | Pagination |
| `.ds-pagination__ellipsis` | `padding:0 2px` | `padding: "0 2px"` | Pagination |
| `.ds-checkbox__box` | `width:20px;height:20px` | `width: 20, height: 20` | Checkbox |
| `.ds-fg__count` | `min-width:18px;height:18px;padding:0 5px` | `minWidth: 18, height: 18, padding: "0 5px"` | FilterGroup |
| `.ds-cardtile` | `gap:12px;padding:12px` | `gap: 12, padding: 12` | CardTile (citato dal brief) |
| `.ds-cardtile__badge` | `top:20px;left:20px` | `top: 20, left: 20` | CardTile |
| `.ds-cardtile__like` | `top:18px;right:18px` | `top: 18, right: 18` | CardTile |
| `.ds-cardtile__stage` | `perspective:700px` | `perspective: 700` | CardTile |
| `.ds-nav__menu-link` | `min-height:56px` | `minHeight:56` (`guscio.jsx:32`) | NavBar (menu mobile) |

14 valori distinti su 8 componenti diversi, tutti esatti. Il resto dei 120
riscontri (per lo più `gap`/`padding` a 2–16px e bordi `1px solid
var(--...)`) non è stato riverificato singolarmente in questo task perché
già oggetto di un audit dedicato — "rifatto da zero", non solo riletto — in
ognuno dei Task 9-14 e 19-21 (vedi `progress.md`), ripetuto ad ogni review
di quei task senza mai trovare uno scostamento residuo. `ds.css` è
append-only da allora: nessuna riga di quell'epoca è stata toccata da un
task successivo, quindi quell'audit resta valido.

I 10 riscontri di `layout.css` sono le classi di pagina copiate
dall'unico `<style>` inline di `design-reference/index.html`: verificate
carattere per carattere contro il sorgente nella review del Task 3
("layout.css regola per regola... corrispondenza carattere per carattere,
inclusi `@media` e `@keyframes`") — non ririlette qui perché il file non è
stato modificato da allora.

### 3. `font-family` fuori dal design system

```
ok: solo font del design system
```

Nessun riscontro.

## Galleria di sviluppo rimossa

`src/pages/ds-gallery.astro` e le tre isole che esistevano solo per lei
(`DsForms.svelte`, `DsOverlay.svelte`, `DsCardTile.svelte` — verificato con
`grep -rl` che nessun altro file le importa) sono state cancellate. Non
hanno equivalente nel prototipo: non fanno parte del confronto di fedeltà.

## Verifica finale

```bash
pnpm check && pnpm test && pnpm test:e2e && pnpm build
```

Esito nel report di questo task (`task-26-27-report.md`).
