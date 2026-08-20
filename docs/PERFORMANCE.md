# Performance — isole, idratazione, cache

Numeri misurati (non stimati) sulla build statica (`pnpm build && pnpm preview`),
cosi' una regressione futura (un'isola che torna a prendere dati da prop invece
che dal seam, uno script che si moltiplica) si vede confrontando questo file
col comportamento reale.

## Regola del progetto (dal Task 18)

Un'isola prende i dati dal seam `/api/catalog.json` (via `~/stores/catalog`,
`getCatalog()` — una sola fetch condivisa per pagina, cache di modulo), mai da
prop di idratazione. Le prop passate a un'isola contengono solo scalari (id,
slug, stringhe brevi) che la pagina Astro conosce gia' lato server — mai un
oggetto o un array del catalogo.

`SiteChrome` era rimasta l'unica isola a violare la regola (riceveva i sei
`CardSet` come prop, 1441 byte su ogni pagina). Corretta in questo giro di
lavoro: ora risolve `sets` da `getCatalog()`, pigramente, solo quando lo store
condiviso `chiedi`/`quick` sta per aprire un dialog che ne ha bisogno — le due
vie che valorizzano `chiedi` con una `Card` vera fanno gia' `await
getCatalog()` prima di scrivere nello store, quindi la promise e' gia' risolta
quando l'effetto di `SiteChrome` la richiama: nessun fetch percepibile in
piu'.

**Prop di `SiteChrome`, misurate sull'HTML costruito di `/chi-siamo`:**

| | byte (attributo `props` dell'`astro-island`) |
|---|---|
| Prima (sei `CardSet` come prop) | 1441 |
| Dopo (solo il marchio di scoping CSS di Svelte) | 46 |

## Prop di idratazione per isola (misurate sull'HTML costruito)

| Pagina | Isola | `client:` | Prop | Byte |
|---|---|---|---|---|
| `/chi-siamo`, `/negozio`, `/404`, ogni pagina | SiteChrome | `idle` | nessuna (solo il marker di scoping) | 46 |
| `/catalogo` | CatalogApp | `load` | nessuna | 2 (`{}`) |
| `/carta/[slug]` | CardViewer | `load` | `rarity`, `code` (due stringhe) | 131 |
| `/carta/[slug]` | CardActions | `idle` | `slug`, `name`, `code` (tre stringhe) | 205 |
| `/` (vetrina) | HeroSearch | `load` | nessuna | 46 |
| `/` (vetrina) | NuoviArrivi | `visible` | `slot` (attributo di posizionamento, non dati) | 86 |
| `/espansioni` | SetFilter | `visible` | nessuna | 2 (`{}`) |

Ogni valore e' uno scalare che la pagina Astro conosce gia' server-side
(content collection); nessuna isola porta con se' `Card`, `CardSet` o un
array — quelli si chiedono al seam al momento in cui servono.

## A cosa serve ciascuna isola

- **SiteChrome** — dialog "Chiedi una carta", quick-view, toast. Un'unica
  isola per tutto il sito (montata da `Base.astro`), `client:idle`.
- **CatalogApp** — griglia/lista filtrabile del catalogo, sostituisce il
  markup statico `#cat-static` una volta idratata. `client:load` perche' e'
  l'intera ragion d'essere della pagina.
- **CardViewer** — il tilt 3D al mouse/tocco sulla carta grande nella scheda
  prodotto. `client:load`.
- **CardActions** — i due bottoni "Chiedila in negozio" / "Condividi" nella
  scheda carta. `client:idle` (non blocca il paint iniziale).
- **HeroSearch** — il campo di ricerca con suggerimenti nella hero della
  vetrina. `client:load`.
- **NuoviArrivi** — striscia di carte nuove in vetrina. `client:visible`
  (fuori dal viewport iniziale).
- **SetFilter** — tab "Tutte / Recenti / Vintage" nella pagina espansioni.
  `client:visible`.

## Script per pagina (build statica)

Conteggio dei tag `<script>` presenti nell'HTML servito (esclude
`application/ld+json`, che non e' JS eseguibile):

| Pagina | `<script>` tag |
|---|---|
| `/` | 6 |
| `/catalogo` | 8 |
| `/espansioni` | 5 |
| `/carta/[slug]` | 5 |
| `/negozio` | 4 |
| `/chi-siamo` | 4 |
| `/404` | 4 |

Il minimo di 4 (pagine senza isole proprie) e' sempre: `ClientRouter`
(`astro:transitions`), lo script inline di `NavBar.astro` (trigger "Chiedi",
quick-view, menu mobile), e i due script che Astro inietta per idratare
`SiteChrome` (`client:idle` loader + runtime `astro-island`). Ogni isola in
piu' sulla pagina aggiunge un modulo che viene importato dinamicamente dal
browser (visibile nel pannello Rete, non come tag aggiuntivo nell'HTML: gli
`astro-island` risolvono `component-url`/`renderer-url` via `import()`).

**`/chi-siamo` (misura richiesta esplicitamente dal task, solo `SiteChrome`
idratata):** 18 richieste JS, 89 240 byte non compressi / 37 252 byte gzip.
Di questi, `ClientRouter` (`astro:transitions`) pesa 16 286 byte non
compressi / 5611 gzip — il resto (~72 954 / ~31 641 gzip) e' `SiteChrome` e
il runtime `svelte`/`astro-island` condiviso da ogni pagina del sito.

## `/catalogo`: quando parte la fetch del dataset

`CatalogApp` non riceve il catalogo come prop: lo chiede a `/api/catalog.json`
tramite `getCatalog()` (`~/stores/catalog`, cache di modulo condivisa con
`SiteChrome`). La vista iniziale (pagina 1, nessun filtro) e' pero' gia'
presente nell'HTML statico (`#cat-static`, 24 tessere vere, generate a build
time) — non serve dato di rete per mostrarla.

Misurato col pannello Rete su una `/catalogo` appena caricata, senza alcuna
interazione: la richiesta a `/api/catalog.json` parte comunque, ma **non
bloccando** il render iniziale — il codice la pianifica con
`requestIdleCallback` (funzione `pianificaIdle`, gia' presente prima di
questo giro di lavoro) proprio per il caso "pagina 1, stato di default": la
usa per essere pronta al primo filtro, e non per disegnare la pagina, che
usa gia' `#cat-static`. Su qualunque altro stato iniziale (querystring con
filtri o pagina diversa dalla prima) la fetch parte invece subito, perche' li'
la griglia statica sarebbe quella sbagliata.

**Nota per chi legge questo file dopo un cambio a `CatalogApp`:** il task
24 chiedeva di verificare che il dataset "non venga scaricato prima che
l'utente tocchi un filtro" — la rete mostra una richiesta comunque, schedulata
in idle, non bloccante. E' comportamento preesistente (non introdotto da
questo giro di lavoro su 404/SEO/transizioni) e intenzionale per messaggio nei
commenti di `CatalogApp.svelte`: rendere il primo filtro istantaneo. Se in
futuro si vuole zero rete fino al primo filtro, e' un cambio dentro
`CatalogApp`, non nella parte toccata qui.

## Cache (`public/_headers`)

```
/_astro/*   Cache-Control: public, max-age=31536000, immutable   (asset con hash nel nome)
/api/*      Cache-Control: public, max-age=300, stale-while-revalidate=86400
/*          X-Content-Type-Options: nosniff; Referrer-Policy: strict-origin-when-cross-origin
```

3 regole, ben sotto il limite di 100 di Cloudflare Pages (spec §11.1).

## View Transitions

### Costo, non solo comportamento

`<ClientRouter />` costa **16 286 byte (5611 gzip) su ogni pagina**,
incluse quelle il cui pregio dichiarato era spedire zero JavaScript.
`/chi-siamo` — zero isole proprie, solo `SiteChrome` condivisa — scarica ora
circa 17 KB di script esterni contro un ideale di quasi nulla. Misurato sul
`<script type="module" src="...">` che Astro inietta per `astro:transitions`
nell'HTML costruito, non stimato dal peso del pacchetto npm.

Il costo non e' solo quel peso in byte. Con le transizioni soft attive, un
browser non rivaluta mai un URL di modulo che ha gia' eseguito: un
`<script>` di pagina reinserito dopo lo swap non riparte da solo. Questo
significa che **ogni script non-isola deve essere scritto per sopravvivere
a uno swap** — non con l'ipotesi implicita "viene rieseguito", ma
esplicitamente, ascoltando `astro:page-load` per il codice che deve
rieseguirsi a ogni navigazione, e tenendo fuori da quel listener (attaccati
una volta sola, con ri-query dell'elemento al momento dell'evento) i
listener globali sul `document` che altrimenti si accumulerebbero a ogni
swap. Il bug corretto in `NavBar.astro` (sotto) e' esattamente questa
classe di errore.

**Decisione: si tengono.** Il criterio "se rompono le isole, toglile" non
scatta (verificato sotto: nessuna rottura), ma quel criterio da solo non
pesava il costo — la scelta va quindi resa esplicita qui invece che spesa in
silenzio sul budget di prestazioni del sito. Sono cache dal browser dopo la
prima pagina vista (stesso URL su ogni pagina, hash nel nome) e reversibili
con una riga: basta togliere l'`import { ClientRouter } from
'astro:transitions'` e il tag da `Base.astro`.

`<ClientRouter />` (`astro:transitions`) e' attivo in `Base.astro`.
Verificato con un browser reale (non a occhio): dopo una navigazione soft
(link NavBar → NavBar), confermata dalla persistenza di un marker JS
impostato prima del click:

- **Smentito due volte in un browser reale, poi corretto:** una prima stesura
  di questa nota affermava che "il trigger 'Chiedi una carta' del `<script>`
  inline di `NavBar.astro` continua a funzionare dopo la transizione (Astro
  re-inserisce/riesegue lo script sul nuovo documento)". Falso: un browser
  non rivaluta mai un URL di modulo gia' valutato, quindi lo script non
  ripartiva da solo dopo il primo swap, e con esso morivano anche il
  trattamento vetro/blur/bordo della navbar allo scroll (`data-scrolled`
  restava bloccato su `false`) e Escape/click-fuori sul menu mobile. Corretto
  ascoltando `astro:page-load` per la parte che deve rieseguirsi a ogni
  navigazione, e tenendo i due listener sul `document` (Escape, click-fuori)
  fuori da quel callback, attaccati una volta sola con ri-query
  dell'elemento al momento dell'evento. Riverificato dopo il fix: il trigger
  della NavBar apre il dialog, i tre pannelli "Scrivici" di `/negozio` aprono
  il dialog invece di saltare a `#`, una tessera `[data-carta]` apre la
  quick-view, e `data-scrolled` torna `"true"` allo scroll — tutto dopo una
  navigazione soft, senza reload.
- `CatalogApp` si rimonta e filtra correttamente su `/catalogo` raggiunta via
  transizione (`rar=rare` → 9 carte, invariato rispetto a un caricamento
  pieno).
- `CardViewer` (tilt 3D) risponde a un `mousemove` sintetico con
  `rotateX/rotateY` non nulli su una scheda carta raggiunta via transizione.
- `CardActions` → "Chiedila in negozio" apre il dialog con il messaggio
  precompilato corretto (nome carta + codice, quindi con `sets` risolto
  correttamente dal seam) dopo la transizione — verifica end-to-end della
  combinazione isole + transizioni + il fix di `SiteChrome` sopra.
- Nessun errore in console durante l'intera sequenza di navigazioni.

Nessun `transition:persist` necessario: ogni isola si rimonta ad ogni
navigazione, che e' il comportamento voluto.

**Attenzione pero': "si rimonta" non vuol dire "riparte da zero".** Una
stesura precedente di questa nota chiudeva con «stato non condiviso fra
pagine diverse»: falso, ed e' lo stesso equivoco che sopra costava il
trigger della NavBar, visto dall'altro lato. A non essere rivalutati dopo
uno swap non sono solo gli `<script>` di pagina: sono i **moduli**, con
tutto il loro stato. `~/stores/chrome` e' un modulo, quindi i suoi store
attraversano la navigazione intatti — e' proprio cio' che fa atterrare da
qualche parte un tap arrivato prima dell'idratazione, ma significa anche che
un'isola che monta sulla pagina nuova legge lo stato lasciato dalla pagina
vecchia.

Difetto reale che ne e' nato (segnalato dall'utente, corretto): "Vedi la
scheda" dentro l'anteprima rapida portava a `/carta/<slug>` con l'anteprima
**ancora aperta sopra**, perche' `SiteChrome` rimontava e ritrovava lo slug
nello store. La correzione sta in `NavBar.astro`: `astro:before-swap`
azzera gli store del guscio, facendo a mano cio' che una navigazione dura
otterrebbe ricaricando i moduli. Presidiato da `e2e/quick-view.spec.ts`,
che verifica *dopo* l'idratazione dell'isola e la fetch del catalogo —
controllare subito dopo lo swap passerebbe anche col difetto in piedi.

La regola generale, quindi: con le transizioni soft attive, **ogni stato che
vive in un modulo va trattato come stato di sessione, non di pagina**. Se
deve morire con la pagina, qualcuno deve ucciderlo esplicitamente allo swap.
