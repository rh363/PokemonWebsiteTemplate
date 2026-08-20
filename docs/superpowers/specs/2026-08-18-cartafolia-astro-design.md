# Cartafolia — sito Astro per negozio di carte da collezione

**Data:** 2026-08-18
**Stato:** approvato, pronto per il piano di implementazione
**Origine design:** Claude Design, progetto `2f20bb1a-1b71-4f87-a1c6-dc996440a770`

---

## 1. Obiettivo

Trasformare il prototipo React/SPA «Cartafolia» in un sito Astro statico, pronto per
essere customizzato come sito di un cliente reale che gestisce un negozio di carte
da collezione. Il prototipo è vetrina e catalogo: il negozio **non vende online**.

### Pilastri, in ordine di priorità

1. Fedeltà al design di esempio
2. Interattività
3. Performance e lazy loading degli asset
4. Reattività
5. Facilità di aggiornamento contenuti
6. Organizzazione e pulizia del codice
7. Scalabilità (oggi statico; in futuro possibile Supabase)

Dove due pilastri confliggono vince quello più in alto, salvo eccezioni motivate ed
esplicitate in questa spec (vedi §3).

---

## 2. Stack

| Ambito    | Scelta                                     | Motivo                                                             |
| --------- | ------------------------------------------ | ------------------------------------------------------------------ |
| Framework | Astro 7.2 (`output: 'static'`)             | MPA statica: SEO locale, LCP, lazy per rotta                       |
| Isole     | Svelte 5 (runes), `@astrojs/svelte` 9      | ~3 KB di runtime; è il linguaggio di chi manterrà il progetto      |
| Stile     | Token CSS del design system + stili inline | È il sistema del design originale. Nessun Tailwind                 |
| Deploy    | Cloudflare Workers static assets           | Progetto Worker già esistente; asset statici gratuiti e illimitati |
| Runtime   | Node 22, pnpm 11                           | Già installati                                                     |

### Perché Svelte e non React

I 26 componenti del design system sono funzioni presentazionali con stili inline che
leggono i token CSS: nessun context, nessun portal, solo `useState`/`useEffect` in una
manciata di casi. Il porting a Svelte 5 produce **DOM identico**, perché la fedeltà vive
nei token, non nel framework. Il costo del porting si paga una volta; il costo di React
si pagherebbe a ogni manutenzione (linguaggio non usato dal manutentore) e a ogni
caricamento (~45 KB gz contro ~3 KB).

### Niente Tailwind

Il design system non ha utility class: ogni componente scrive `style={{...}}` leggendo
`var(--token)`. Aggiungere Tailwind creerebbe due sistemi di stile concorrenti e
metterebbe a rischio il pilastro 1.

---

## 3. Scostamenti dichiarati dal prototipo

Il pilastro 1 chiede identità «in tutto». Questi sono gli unici scostamenti, tutti
**invisibili visivamente**, ciascuno con la sua motivazione.

### 3.1 Routing ad hash → URL reali

| Prototipo      | Sito            |
| -------------- | --------------- |
| `#/vetrina`    | `/`             |
| `#/catalogo`   | `/catalogo`     |
| `#/carta/12`   | `/carta/[slug]` |
| `#/espansioni` | `/espansioni`   |
| `#/negozio`    | `/negozio`      |
| `#/about`      | `/chi-siamo`    |
| —              | `/404`          |

Obbligatorio per SEO locale (il negozio vive di ricerche geografiche) e per il lazy
loading per rotta. Le Astro View Transitions mantengono la fluidità della SPA.

### 3.2 Stato dei filtri in querystring

`/catalogo?set=alb&rar=holo&cond=mint&lang=Italiano&foil=1&sort=rarita&p=2`

Nel prototipo lo stato dei filtri si perdeva a ogni navigazione. Portarlo in URL rende i
risultati condivisibili e fa funzionare back/forward. Migliora il pilastro 2 senza
toccare la resa visiva.

### 3.3 Font, icone e runtime spostati in locale

Vedi §7. Nessun impatto visivo, correzione di tre difetti di performance del prototipo.

---

## 4. Struttura del repository

```
PokemonWebsiteTemplate/
├── astro.config.mjs
├── wrangler.jsonc
├── package.json · tsconfig.json · .prettierrc · oxlintrc.json
├── design-reference/                 # prototipo originale, servito in locale per il diff visivo (§10)
├── docs/superpowers/specs/
├── public/
│   ├── fonts/                        # webfont self-hosted
│   └── _headers                      # Cache-Control immutable su /_astro/*
├── .github/workflows/deploy.yml
└── src/
    ├── styles/
    │   ├── tokens/                   # i 9 file token, copiati verbatim
    │   └── global.css                # entry: @import dei token
    ├── config/
    │   └── site.ts                   # ← branding: nome, indirizzo, orari, social, SEO
    ├── content/
    │   ├── config.ts                 # schemi Zod delle collection
    │   ├── sets.json
    │   └── cards/*.json              # ← catalogo
    ├── lib/
    │   ├── catalog/
    │   │   ├── types.ts              # Card, Set, CardQuery, Page<T>, CatalogSource
    │   │   ├── source.static.ts      # implementazione da content collections
    │   │   ├── query.ts              # filtri, ordinamento, paginazione (logica pura)
    │   │   ├── search.ts             # scan sull'haystack precalcolato
    │   │   └── index.ts              # facade
    │   ├── demo/prng.ts              # PRNG seeded del prototipo, portato identico
    │   └── icons/                    # SVG Lucide inline, solo quelli usati
    ├── integrations/
    │   └── catalog-index.ts          # emette catalog.json e search-index.json a build time
    ├── components/
    │   ├── ds/                       # i 26 componenti del design system, in Svelte
    │   └── islands/                  # componenti con stato
    ├── stores/
    │   └── chrome.ts                 # store condiviso: dialog, sheet, toast
    ├── layouts/
    │   └── Base.astro
    └── pages/
        ├── index.astro · catalogo.astro · espansioni.astro
        ├── negozio.astro · chi-siamo.astro · 404.astro
        └── carta/[slug].astro
```

---

## 5. Modello dati e seam per Supabase

### 5.1 Il contratto

```ts
// src/lib/catalog/types.ts
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

export interface CatalogSource {
  listSets(): Promise<Set[]>
  listCards(q: CardQuery): Promise<Page<Card>>
  getCard(slug: string): Promise<Card | null>
}
```

### 5.2 Il seam vero è HTTP, non l'interfaccia

L'isola del catalogo **non importa mai `source.static.ts`**: fa `fetch('/api/catalog.json')`.

- **Oggi** — `/api/catalog.json` e `/api/search-index.json` sono file emessi a build time
  dall'integration `catalog-index.ts`, che legge le content collections tramite
  `source.static.ts`.
- **Domani** — le stesse URL diventano route SSR che interrogano Supabase con filtri
  server-side. L'isola non cambia di una riga.

`source.supabase.ts` **non viene scritto ora**: sarebbe codice morto. Si definisce solo
il contratto e la forma della risposta.

### 5.3 Formato dell'indice

`search-index.json` associa a ogni carta un `haystack` pre-normalizzato:
`nome + codice + espansione + rarità + condizione + lingua + artista`, minuscolo.

È esplicitamente **non** un indice invertito: è un haystack precalcolato su cui gira uno
scan lineare. Riproduce la semantica di ricerca del prototipo alla lettera ed è
istantaneo fino a qualche migliaio di carte. Oltre quella soglia si sostituisce con un
indice invertito o si passa a ricerca server-side; il seam HTTP copre entrambi i casi.

### 5.4 La facade vale per il server, non per le isole

Scoperto al Task 15, e non ovvio: `src/lib/catalog/index.ts` ri-esporta anche
`source.static.astro.ts`, che importa `astro:content`. Un'isola idratata che importi dal
barrel si trascina quindi `astro:content` **nel bundle del browser**, dove non ha senso e
dove fa fallire il build.

La regola ha due metà:

| Chi importa                                | Da dove                                                               |
| ------------------------------------------ | --------------------------------------------------------------------- |
| Pagine `.astro`, endpoint, codice di build | `~/lib/catalog` — la facade                                           |
| Componenti Svelte montati con `client:`    | `~/lib/catalog/labels`, `/types`, `/query`, `/search` — i moduli puri |

Non è un'eccezione alla regola «le pagine importano solo dalla facade»: è la sua
precisazione. La facade è il confine del **server**. Le isole vivono dall'altra parte di
un confine diverso — quello del browser — e possono usare solo la parte pura dello strato
dati, che è esattamente la parte progettata per non toccare I/O.

### 5.5 Limite noto dell'output statico

Con `output: 'static'` ogni carta è una pagina HTML prerenderizzata. Il limite Cloudflare
sul piano free è 20.000 file per versione (25 MiB per file), quindi ~5.000 carte stanno
comodamente, ma il tempo di build cresce linearmente. Quando si passerà a Supabase,
`/carta/[slug]` diventa SSR on-demand e il vincolo decade.

---

## 6. Caricamento dati e isole

### 6.1 Strategia di caricamento del catalogo

1. Il build renderizza **le prime 24 carte in HTML statico** dentro `/catalogo` →
   LCP immediato, contenuto indicizzabile, funziona senza JS. «Prime 24» significa
   pagina 1 dell'ordinamento di default `Novità` senza alcun filtro attivo, cioè
   esattamente ciò che il prototipo mostra all'apertura del catalogo.
2. L'isola `CatalogApp` si idrata sopra quell'HTML (`client:load`).
3. Il dataset completo viene scaricato **solo** al primo filtro/ricerca, oppure in
   `requestIdleCallback` se l'utente resta fermo.

### 6.2 Mappa delle isole

| Pagina          | HTML statico             | Isole Svelte                                |
| --------------- | ------------------------ | ------------------------------------------- |
| `/chi-siamo`    | tutto                    | **nessuna — 0 KB JS**                       |
| `/negozio`      | tutto                    | trigger dialog «Chiedi una carta»           |
| `/espansioni`   | schede espansione        | Tabs, quick-view                            |
| `/`             | hero, sezioni, footer    | ricerca hero, quick-view, Tabs nuovi arrivi |
| `/carta/[slug]` | scheda, specs, correlate | tilt 3D + riflesso foil, condividi          |
| `/catalogo`     | header + prime 24 carte  | `CatalogApp`                                |

NavBar desktop e Footer sono **HTML statico**. Una sola isola `SiteChrome` nel layout
gestisce menu mobile, dialog «Chiedi una carta» e toast.

### 6.3 Comunicazione tra isole

Le pagine pilotano `SiteChrome` tramite uno store Svelte a livello di modulo
(`src/stores/chrome.ts`), condiviso tra le isole della stessa pagina perché Vite risolve
l'import allo stesso modulo.

**Assunzione da verificare per prima cosa**, prima di iniziare il porting dei componenti.
Fallback se non regge: `CustomEvent` su `window`. Nessun impatto sul design in entrambi
i casi.

**Esito della verifica (2026-08-18):** confermata — due prove indipendenti, comportamentale
(Playwright su dev server) e strutturale (grafo degli import nel build di produzione),
concordi. Non serve il fallback a `CustomEvent`.

### 6.4 Click persi prima dell'idratazione

Lo spike ha però mostrato un secondo fatto, non richiesto ma importante: nella prima
esecuzione a freddo il contatore ha letto **2 invece di 3**. Un click era arrivato prima
che l'isola fosse idratata, ed è andato perso.

Non intacca la conclusione sopra — un valore diverso da zero è possibile solo se lo store
è condiviso — ma descrive un comportamento reale del sito:

> Finché un'isola non è idratata, i click sui suoi controlli non fanno niente e non
> lasciano traccia. Non c'è coda, non c'è recupero.

Riguarda direttamente `SiteChrome`, che §6.2 monta con `client:idle`, cioè **più tardi**
di `client:load`. Un utente che tocca il menu mobile o «Chiedi una carta» appena la pagina
compare può non ottenere risposta.

Il Task 15 deve affrontarlo, scegliendo fra:

1. **`client:load` invece di `client:idle`** per `SiteChrome` — idrata prima, ma compete
   col first paint e quindi col pilastro 3;
2. **degradare senza JavaScript** — il menu mobile diventa un `<dialog>` o un `<details>`
   apribile dal browser da solo, e l'isola lo arricchisce quando arriva. È la strada
   coerente con le scelte già fatte per `FilterGroup` (§Task 11) e costa un controllo
   che funziona sempre;
3. **accettarlo e dirlo** — la finestra è di poche centinaia di millisecondi.

La scelta 2 è quella allineata al resto del progetto e va preferita salvo motivi contrari.

---

## 7. Performance

### 7.1 Tre difetti del prototipo da correggere

| Difetto nel prototipo                                                                                           | Correzione                                                                                                                                          |
| --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@import` da Google Fonts in `tokens/fonts.css` — render-blocking                                               | Self-hosted via `@fontsource-variable` (Bricolage Grotesque, Plus Jakarta Sans, JetBrains Mono), preload dei due pesi critici, `font-display: swap` |
| `Icon` carica ogni glifo da `unpkg.com/lucide-static` via CSS mask — una richiesta di rete per icona, a runtime | SVG Lucide **inline locali**, solo i ~18 effettivamente usati                                                                                       |
| React, ReactDOM e Babel standalone da CDN in build `development`                                                | Eliminati                                                                                                                                           |

Nota sulla fedeltà delle icone: nel prototipo il glifo è una CSS mask riempita con
`currentColor`. Le icone Lucide sono stroke-only, quindi la mask dipinge esattamente i
tratti; un `<svg stroke="currentColor">` inline produce gli stessi pixel.

### 7.2 Immagini — su R2, mai nel repository

Le foto delle carte **non entrano in git**. Una collezione di migliaia di immagini
resterebbe nella storia del repository per sempre e la scaricherebbe ogni clone;
ripulirla dopo significa riscrivere la storia. È una decisione che costa poco adesso
e cara più tardi, quindi si prende subito.

| Pezzo                | Scelta                                                                                        |
| -------------------- | --------------------------------------------------------------------------------------------- |
| Archiviazione        | Bucket **Cloudflare R2**, dietro un **dominio personalizzato**                                |
| Ottimizzazione       | **Cloudflare Image Transformations**, `https://<zona>/cdn-cgi/image/<opzioni>/<url sorgente>` |
| Formato servito      | `format=auto` → AVIF o WebP secondo il browser                                                |
| Dimensioni           | `srcset` a 150 / 300 / 450 px, `sizes` per la griglia                                         |
| Caricamento          | `loading="lazy"`, `eager` + `fetchpriority=high` solo sui candidati LCP                       |
| Riferimento nei dati | La colonna `image` di `cards.csv` contiene **solo la chiave R2**                              |

**Sul CLS**, che è il rischio proprio delle immagini remote: il contenitore
`.ds-cardart` impone già `aspect-ratio: var(--card-aspect)` cioè 63/88, e `width`/`height`
sul tag ribadiscono la proporzione. Lo spazio è riservato prima che arrivi un byte, quindi
**zero salti di layout** nonostante il build non conosca le immagini.

Quando la configurazione delle immagini è vuota si ricade sul placeholder foil del design
system, identico al prototipo: lo sviluppo in locale funziona senza credenziali e senza rete.

**Costi.** Il piano free R2 dà 10 GB di storage, **egress gratuito e illimitato**, 10 M di
letture al mese; le trasformazioni sono 5.000 uniche al mese e quelle già fatte restano in
cache senza ricontare, quindi il consumo segue le foto nuove e non le visite. Per un
catalogo da qualche migliaio di carte resta gratuito.

**Vincoli verificati sulla documentazione Cloudflare**, entrambi bloccanti:

- le trasformazioni vanno **abilitate sulla zona** dalla dashboard, altrimenti
  `/cdn-cgi/image/…` restituisce l'originale **senza segnalare errori** — il sito sembra
  a posto e serve foto non ridimensionate;
- il sottodominio `r2.dev` è rate-limited, senza cache né WAF, e dichiarato non supportato
  in produzione: serve un dominio personalizzato sul bucket.

### 7.3 Cache

`public/_headers` → `Cache-Control: public, max-age=31536000, immutable` su `/_astro/*`.

### 7.4 Navigazione

Astro View Transitions, per mantenere la fluidità percepita della SPA.

---

## 8. Contenuti — aggiornamento da parte del cliente

- **`src/config/site.ts`** — un solo file per tutto il branding: nome negozio, via, CAP,
  città, orari, Instagram/TikTok/WhatsApp, metadati SEO.
- **`src/content/cards.csv`** — una carta per riga — e **`src/content/sets.json`**,
  entrambi validati con Zod in `src/content.config.ts`. Un campo sbagliato fa fallire
  il build con un messaggio chiaro, invece di produrre una pagina rotta.

### Perche' CSV e non un file per carta

Una carta non e' un documento, e' una riga di tabella: quindici campi piatti, nessun
corpo, nessun ciclo di vita editoriale. L'idioma «un file per entita'» delle content
collection serve ai post di un blog, non ai record di un inventario, e a 5.000 carte
produrrebbe 5.000 file che nessuno aggiornerebbe a mano.

Il catalogo di un negozio vive gia' in un foglio di calcolo. CSV e' cio' che un foglio
esporta, cio' che Supabase importa nativamente, e cio' che permette di aggiungere in
futuro una pipeline di pubblicazione senza portarsi dietro una conversione di formato.

**Chi lo aggiorna, per ora:** lo sviluppatore. Il cliente manda i dati, lo sviluppatore
aggiorna il file e pusha. Nessuna infrastruttura di ingestione finche' la frequenza degli
aggiornamenti non la giustifica (vedi Task 28 nel piano).

### Dati demo

I dati del prototipo sono mantenuti come seed demo. Il **PRNG seeded viene portato
identico** (`src/lib/demo/prng.ts`, moltiplicatore 16807, seme 7): le 100 carte demo
risultano le stesse del prototipo, il che è la precondizione per il confronto visivo
1:1 di §10.

---

## 9. Qualità del codice

- TypeScript strict; `astro check` in CI
- Prettier + `prettier-plugin-svelte`
- **oxlint con `_adherence.oxlintrc.json`**, la configurazione che il design system porta
  con sé: vieta i valori hardcoded al posto dei token. È il guard-rail che protegge il
  pilastro 1 nel tempo, non solo al primo rilascio
- **Vitest** in TDD sulla logica pura di `lib/catalog`: filtri, ordinamento, ricerca,
  paginazione. Sono funzioni pure con input e output espliciti, il posto giusto per i test
- **Playwright**, uno smoke E2E sulle 6 rotte, a guardia del porting

---

## 10. Verifica della fedeltà

Il pilastro 1 merita un meccanismo, non buone intenzioni.

0. `design-reference/` viene popolata come **primo task del piano**, scaricando i file
   sorgente dal progetto Claude Design (`index.html`, i 9 file token, `_ds_bundle.js`,
   i 9 `.jsx`, gli asset). È committata nel repository: serve al confronto e come
   riferimento per chi manterrà il progetto in futuro.
1. Prototipo originale servito da `design-reference/` su `:4322`; sito Astro su `:4321`
2. Confronto pagina per pagina nel browser a **390 / 1024 / 1440 px**
3. Checklist per componente sui token consumati

Il punto 2 è possibile solo perché i dati demo sono identici (§8).

---

## 11. Deploy

### 11.1 Configurazione

`wrangler.jsonc` con `assets.directory: "./dist"`, `not_found_handling: "404-page"` e
**nessun `main`** → Worker solo-asset.

Verificato sulla documentazione Cloudflare: le richieste agli asset statici sono gratuite
e illimitate e non consumano la quota di richieste del piano free, che vale solo per le
invocazioni di codice Worker. Un progetto solo-asset non genera addebiti; nemmeno lo
storage costa.

Limiti piano free: 20.000 file per versione, 25 MiB per file, 100 regole `_headers`,
2.100 `_redirects`.

### 11.2 CI

`.github/workflows/deploy.yml`: install → `astro check` → test → build → `wrangler deploy`.
Segreti `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID` inseriti dal proprietario del
repository nei GitHub Secrets. **I token non transitano nella sessione.**

---

## 12. Fuori scope (YAGNI)

`source.supabase.ts`, indice di ricerca invertito, MDX/blog, e-commerce e carrello,
dark mode, autenticazione. Nessuno di questi è nel design di partenza.

---

## 13. Domande aperte

Non bloccano l'inizio dell'implementazione; servono prima del primo deploy.

1. **Nome del Worker** Cloudflare e **account ID**
2. Esiste già un remote GitHub per questo repository?
3. Dati reali del cliente (nome negozio, indirizzo, orari, social) — finché mancano
   restano i dati demo del prototipo
4. **Zona Cloudflare e sottodominio per le immagini** (per esempio `img.<dominio>`) —
   servono al Task 23 per creare il bucket R2 e abilitare le trasformazioni
5. Immagini reali delle carte — finché mancano resta il placeholder foil del design system
