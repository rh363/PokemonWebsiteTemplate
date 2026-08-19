<script lang="ts">
  // Porting di design-reference/catalogo.jsx (funzioni Filtri e Catalogo).
  // Zero props da Astro: catalogo.astro renderizza gia' staticamente la
  // pagina 1 dell'ordinamento "novita" senza filtri (spec §6.1, 24 tessere
  // vere) dentro #cat-static — questa isola non duplica quel payload, lo
  // ripete leggendo /api/catalog.json una volta montata (vedi getCatalog(),
  // che condivide la fetch con SiteChrome: una sola richiesta di rete anche
  // se entrambe la chiamano).
  //
  // Importa SOLO da labels/types/query/url — mai dalla barrel ~/lib/catalog,
  // che ri-esporta source.static.astro.ts e trascinerebbe astro:content nel
  // bundle del browser (stesso motivo gia' documentato in SiteChrome.svelte
  // e HeroSearch.svelte).
  import SearchField from '../ds/SearchField.svelte'
  import FilterGroup from '../ds/FilterGroup.svelte'
  import Checkbox from '../ds/Checkbox.svelte'
  import Switch from '../ds/Switch.svelte'
  import Chip from '../ds/Chip.svelte'
  import Select from '../ds/Select.svelte'
  import Tabs from '../ds/Tabs.svelte'
  import Skeleton from '../ds/Skeleton.svelte'
  import EmptyState from '../ds/EmptyState.svelte'
  import Panel from '../ds/Panel.svelte'
  import Button from '../ds/Button.svelte'
  import Icon from '../ds/Icon.svelte'
  import Sheet from '../ds/Sheet.svelte'
  import CardTile from '../ds/CardTile.svelte'
  import CardArt from '../ds/CardArt.svelte'
  import RarityBadge from '../ds/RarityBadge.svelte'
  import ConditionBadge from '../ds/ConditionBadge.svelte'
  import Badge from '../ds/Badge.svelte'
  import Pagination from '../ds/Pagination.svelte'
  import {
    RARITY_LABELS,
    CONDITION_LABELS,
    LANGUAGES,
    SORT_LABELS,
    PER_PAGE,
    cardCode,
  } from '~/lib/catalog/labels'
  import type { Card, Condition, Rarity, SortKey, CardQuery } from '~/lib/catalog/types'
  import { queryCards, type IndexedCard } from '~/lib/catalog/query'
  import { parseQuery, toSearchParams } from '~/lib/catalog/url'
  import { getCatalog, type CatalogPayload } from '~/stores/catalog'
  import { apriQuick, avviso } from '~/stores/chrome'

  // Forma di /api/search-index.json (Task 8): ripetuta qui invece che
  // importata da ~/lib/catalog/source.static per lo stesso motivo per cui
  // ~/stores/catalog ripete Card/CardSet — un'isola non dipende da un file
  // che sta un passo dentro lo strato dati server.
  interface SearchPayload {
    version: 1
    haystacks: string[]
  }

  type Vista = 'griglia' | 'lista'

  // Stato iniziale letto dalla querystring UNA sola volta, in modo sincrono,
  // fuori da $effect: sia perche' deve essere pronto prima che il primo
  // effetto scatti, sia perche' cosi' l'unico punto che tocca `window` prima
  // del mount e' guardato esplicitamente (SSR di client:load non ha window).
  const parsedIniziale =
    typeof window !== 'undefined'
      ? parseQuery(new URLSearchParams(window.location.search))
      : parseQuery(new URLSearchParams())
  // Letta una sola volta, MAI dentro l'effetto sotto: serve solo a decidere
  // se il primo giro e' "il default puro" (vedi piu' sotto), leggerla in un
  // $effect la trasformerebbe in una dipendenza reattiva — e un cambio di
  // pagina rientrerebbe fra le dipendenze che riavviano lo skeleton, esatto
  // il difetto che l'esclusione di `page` vuole evitare.
  const paginaIniziale = parsedIniziale.page

  let q = $state(parsedIniziale.q)
  let setsSel = $state(parsedIniziale.sets)
  let raritySel = $state(parsedIniziale.rarity)
  let condSel = $state(parsedIniziale.cond)
  let langSel = $state(parsedIniziale.lang)
  let foil = $state(parsedIniziale.foil)
  let sort = $state(parsedIniziale.sort)
  let page = $state(parsedIniziale.page)

  let view = $state<Vista>('griglia')
  let sheetOpen = $state(false)
  let loading = $state(false)
  // Diventa true la prima volta che questa isola ha qualcosa da mostrare
  // (skeleton compreso) — a quel punto, e non prima, nasconde #cat-static.
  // Fedele al commento di catalogo.astro: "l'isola legge location.search
  // all'avvio e riallinea la griglia".
  let mostraApp = $state(false)
  let dati = $state<CatalogPayload | null>(null)
  let indice = $state<SearchPayload | null>(null)

  const datiCards = $derived(dati?.cards ?? [])
  const datiSets = $derived(dati?.sets ?? [])

  const indexedCards = $derived.by((): IndexedCard[] =>
    datiCards.map((c, i): IndexedCard => ({ ...c, haystack: indice?.haystacks[i] ?? '' })),
  )

  const risultato = $derived.by(() => {
    if (!dati) return null
    const cq: CardQuery = {
      q, sets: setsSel, rarity: raritySel, cond: condSel, lang: langSel,
      foil, sort, page, perPage: PER_PAGE,
    }
    return queryCards(indexedCards, datiSets, cq)
  })

  const attivi = $derived(raritySel.length + setsSel.length + condSel.length + langSel.length + (foil ? 1 : 0))

  const ordinamentoOpzioni = Object.entries(SORT_LABELS).map(([value, label]) => ({ value, label }))

  function contaRarita(r: Rarity): number {
    return datiCards.filter((c) => c.rarity === r).length
  }
  function contaSet(id: string): number {
    return datiCards.filter((c) => c.set === id).length
  }
  function contaCond(c: Condition): number {
    return datiCards.filter((x) => x.cond === c).length
  }
  function contaLingua(l: string): number {
    return datiCards.filter((c) => c.lang === l).length
  }

  function toggle<T>(arr: T[], v: T): T[] {
    return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]
  }

  // Ogni cambio filtro riparte da pagina 1 — fedele a catalogo.jsx
  // (l'useEffect fa sempre setPage(1)) — ma qui e' esplicito nel chiamante,
  // non dentro l'effetto: l'effetto sotto non deve MAI leggere `page`.
  function cambiaFiltro(mut: () => void): void {
    mut()
    page = 1
  }

  function azzera(): void {
    cambiaFiltro(() => {
      raritySel = []
      setsSel = []
      condSel = []
      langSel = []
      foil = false
    })
  }

  // EmptyState: azzera() PIU' la ricerca — fedele a catalogo.jsx
  // (()=>{azzera();setQuery("")}) — in un solo giro di cambiaFiltro, non
  // due, cosi' page si azzera una volta sola.
  function azzeraETestoRicerca(): void {
    cambiaFiltro(() => {
      raritySel = []
      setsSel = []
      condSel = []
      langSel = []
      foil = false
      q = ''
    })
  }

  type ChipVM = { key: string; label: string; onRemove: () => void }
  const chips = $derived.by((): ChipVM[] => {
    const out: ChipVM[] = []
    for (const r of raritySel) {
      out.push({ key: `r-${r}`, label: RARITY_LABELS[r], onRemove: () => cambiaFiltro(() => (raritySel = raritySel.filter((x) => x !== r))) })
    }
    for (const s of setsSel) {
      const nome = datiSets.find((x) => x.id === s)?.name ?? s
      out.push({ key: `s-${s}`, label: nome, onRemove: () => cambiaFiltro(() => (setsSel = setsSel.filter((x) => x !== s))) })
    }
    for (const c of condSel) {
      out.push({ key: `c-${c}`, label: CONDITION_LABELS[c], onRemove: () => cambiaFiltro(() => (condSel = condSel.filter((x) => x !== c))) })
    }
    for (const l of langSel) {
      out.push({ key: `l-${l}`, label: l, onRemove: () => cambiaFiltro(() => (langSel = langSel.filter((x) => x !== l))) })
    }
    if (foil) out.push({ key: 'foil', label: 'Solo foil', onRemove: () => cambiaFiltro(() => (foil = false)) })
    return out
  })

  // --- seam dati: mai il filesystem, mai la barrel, solo le due API ---

  let indiceCache: Promise<SearchPayload> | null = null
  function fetchIndice(): Promise<SearchPayload> {
    if (!indiceCache) {
      indiceCache = fetch('/api/search-index.json')
        .then((r) => {
          if (!r.ok) throw new Error(`/api/search-index.json ha risposto ${r.status}`)
          return r.json() as Promise<SearchPayload>
        })
        .catch((err) => {
          indiceCache = null
          throw err
        })
    }
    return indiceCache
  }

  // getCatalog() puo' rifiutare (rete assente, risposta non-ok) e non mette
  // in cache un rifiuto (vedi ~/stores/catalog): un tentativo successivo
  // riparte da zero. Un fallimento qui non deve essere silenzioso — e' la
  // classe di difetto che questo progetto continua a trovare (vedi
  // SiteChrome) — quindi avvisa con un toast E lascia `dati` null, cosi' il
  // template mostra uno stato di errore persistente con un modo di riprovare,
  // non solo un avviso che scompare in 2800ms.
  async function garantisciDati(): Promise<void> {
    if (dati) return
    try {
      dati = await getCatalog()
    } catch {
      avviso('Impossibile caricare il catalogo', 'Controlla la connessione e riprova.', 'info')
    }
  }

  async function garantisciIndice(): Promise<void> {
    if (indice) return
    try {
      indice = await fetchIndice()
    } catch {
      // Silenzioso: senza indice la ricerca testuale non trova nulla di piu'
      // (matches() tratta l'haystack mancante come stringa vuota, vedi
      // indexedCards sopra) finche' l'utente non riprova — un toast per ogni
      // carattere digitato mentre la rete e' lenta sarebbe piu' fastidioso
      // che utile. garantisciDati() ha gia' avvisato se la rete e' proprio
      // assente.
    }
  }

  async function riprova(): Promise<void> {
    loading = true
    await Promise.all([garantisciDati(), q.trim() ? garantisciIndice() : Promise.resolve()])
    loading = false
  }

  function pianificaIdle(cb: () => void): void {
    if (typeof requestIdleCallback === 'function') requestIdleCallback(() => cb())
    else setTimeout(cb, 200)
  }

  function statoQuery(paginaOverride?: number): CardQuery {
    return {
      q, sets: setsSel, rarity: raritySel, cond: condSel, lang: langSel,
      foil, sort, page: paginaOverride ?? page,
    }
  }

  function urlPer(paginaOverride?: number): string {
    const s = toSearchParams(statoQuery(paginaOverride)).toString()
    return s ? `/catalogo?${s}` : '/catalogo'
  }

  function syncUrl(modo: 'replace' | 'push'): void {
    const url = urlPer()
    if (modo === 'push') history.pushState(null, '', url)
    else history.replaceState(null, '', url)
  }

  function alDigitareRicerca(e: Event): void {
    cambiaFiltro(() => (q = (e.target as HTMLInputElement).value))
  }
  function alPulireRicerca(): void {
    cambiaFiltro(() => (q = ''))
  }

  function daUrl(): void {
    const p = parseQuery(new URLSearchParams(location.search))
    q = p.q
    setsSel = p.sets
    raritySel = p.rarity
    condSel = p.cond
    langSel = p.lang
    foil = p.foil
    sort = p.sort
    page = p.page
  }

  // Paginazione: Pagination (ds) genera solo <a href> veri (spec: funziona
  // senza JS). Qui li si intercetta per restare un'unica pagina — stesso
  // pattern "link vero + intercettazione" del punto di integrazione delle
  // tessere, vedi sotto — rispettando pero' tasti modificatori e click non
  // sinistro, che devono restare navigazione browser normale (nuova scheda).
  function suClicPaginazione(e: MouseEvent): void {
    const a = (e.target as HTMLElement).closest('a')
    if (!a) return
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    const n = Number(new URL(a.href).searchParams.get('p') ?? '1')
    if (!Number.isInteger(n) || n < 1 || n === page) return
    page = n
    syncUrl('push')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function statoEDefault(): boolean {
    return (
      q === '' && setsSel.length === 0 && raritySel.length === 0 &&
      condSel.length === 0 && langSel.length === 0 && !foil && sort === 'novita'
    )
  }

  let primoGiro = true
  let versione = 0

  // Fedele a catalogo.jsx: l'useEffect ha come dipendenze [rar,sets,cond,
  // lang,foil,query,sort] — MAI page — e scatta anche al mount (React
  // esegue gli effect dopo il primo render), quindi lo skeleton di 340ms e'
  // visibile anche alla primissima apertura, non solo sui cambi successivi:
  // e' una scelta estetica dichiarata del sorgente, non un incidente.
  //
  // Deviazione deliberata dal sorgente per il caso "/catalogo puro, nessuna
  // querystring": invece di caricare subito, si scalda la cache in idle —
  // il contenuto che risulterebbe e' identico a #cat-static, quindi non c'e'
  // nulla da mostrare in skeleton ne' da correggere. Con QUALSIASI
  // querystring (compreso un semplice ?p=2) si carica subito e si mostra lo
  // skeleton finche' non e' pronto: la pagina statica ha solo la pagina 1
  // di default, mostrarla anche solo per un istante sarebbe la lista
  // sbagliata.
  $effect(() => {
    // Leggerle qui (anche senza altro uso) e' cio' che rende l'effetto
    // dipendente da questi sette campi.
    const tracciate = { q, setsSel, raritySel, condSel, langSel, foil, sort }
    void tracciate

    syncUrl('replace')

    const eraPrimoGiro = primoGiro
    primoGiro = false

    if (eraPrimoGiro && paginaIniziale === 1 && statoEDefault()) {
      pianificaIdle(() => {
        void garantisciDati().then(() => {
          mostraApp = true
        })
      })
      return
    }

    mostraApp = true
    loading = true
    const richiesta = ++versione
    const attesaMinima = new Promise<void>((r) => setTimeout(r, 340))
    const caricamento = Promise.all([garantisciDati(), q.trim() ? garantisciIndice() : Promise.resolve()])
    void Promise.allSettled([attesaMinima, caricamento]).then(() => {
      if (richiesta === versione) loading = false
    })
  })

  $effect(() => {
    const onPop = () => daUrl()
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  })

  // Nasconde #cat-static una sola volta, quando questa isola ha finalmente
  // qualcosa da mostrare al suo posto (mai il contrario: non c'e' un motivo
  // per farla ricomparire dopo).
  $effect(() => {
    if (!mostraApp) return
    document.getElementById('cat-static')?.setAttribute('hidden', '')
  })

  // Punto di integrazione (non del componente ds/CardTile, che resta un
  // primitivo generico fedele al sorgente): qui la tessera diventa un <a
  // href> vero verso /carta/<slug> — tab order, Invio, apertura in nuova
  // scheda e semantica corretti gratis, senza toccare CardTile. Da idratata,
  // il click viene intercettato (preventDefault) per aprire la quick-view
  // al suo posto: la navigazione resta il fallback senza JS e per
  // ctrl/cmd-click e click centrale (che non generano un evento click
  // intercettabile).
  function apriQuickDaTessera(e: MouseEvent, slug: string): void {
    e.preventDefault()
    apriQuick(slug)
  }
</script>

{#snippet filtri()}
  <div style="display:grid;gap:var(--sp-2)">
    <div style="display:flex;align-items:center;justify-content:space-between;min-height:32px">
      <span style="font:var(--type-label);font-weight:var(--fw-bold);color:var(--text-strong)">
        Filtri {#if attivi > 0}<span style="color:var(--text-brand)">({attivi})</span>{/if}
      </span>
      {#if attivi > 0}
        <button
          type="button"
          onclick={azzera}
          style="all:unset;cursor:pointer;font:var(--type-label);font-size:var(--fs-caption);color:var(--text-muted);text-decoration:underline"
        >azzera</button>
      {/if}
    </div>
    <Switch checked={foil} label="Solo foil" onchange={() => cambiaFiltro(() => (foil = !foil))} style="margin:var(--sp-2) 0" />
    <FilterGroup title="Rarità" activeCount={raritySel.length}>
      {#each Object.entries(RARITY_LABELS) as [id, label] (id)}
        <Checkbox
          checked={raritySel.includes(id as Rarity)}
          label={label}
          count={contaRarita(id as Rarity)}
          onchange={() => cambiaFiltro(() => (raritySel = toggle(raritySel, id as Rarity)))}
        />
      {/each}
    </FilterGroup>
    <FilterGroup title="Espansione" activeCount={setsSel.length}>
      {#each datiSets as s (s.id)}
        <Checkbox
          checked={setsSel.includes(s.id)}
          label={s.name}
          description={`${s.code} · ${s.year}`}
          count={contaSet(s.id)}
          onchange={() => cambiaFiltro(() => (setsSel = toggle(setsSel, s.id)))}
        />
      {/each}
    </FilterGroup>
    <FilterGroup title="Condizione" activeCount={condSel.length} defaultOpen={false}>
      {#each Object.entries(CONDITION_LABELS) as [id, label] (id)}
        <Checkbox
          checked={condSel.includes(id as Condition)}
          label={label}
          count={contaCond(id as Condition)}
          onchange={() => cambiaFiltro(() => (condSel = toggle(condSel, id as Condition)))}
        />
      {/each}
    </FilterGroup>
    <FilterGroup title="Lingua" activeCount={langSel.length} defaultOpen={false}>
      {#each LANGUAGES as l (l)}
        <Checkbox
          checked={langSel.includes(l)}
          label={l}
          count={contaLingua(l)}
          onchange={() => cambiaFiltro(() => (langSel = toggle(langSel, l)))}
        />
      {/each}
    </FilterGroup>
  </div>
{/snippet}

{#if mostraApp}
  <!-- Sostituisce il campo statico dentro #cat-static (stesso ritmo
       verticale: sp-4 sopra, sp-8 sotto — vedi il commento in catalogo.astro). -->
  <div style="max-width:640px;margin-top:var(--sp-4);margin-bottom:var(--sp-8)">
    <SearchField
      size="md"
      value={q}
      oninput={alDigitareRicerca}
      onclear={alPulireRicerca}
      placeholder="Cerca per nome, codice, espansione, condizione…"
    />
  </div>

  <div class="cat">
    <aside class="side">
      {@render filtri()}
    </aside>

    <div style="display:grid;gap:var(--sp-5);min-width:0">
      <div style="display:flex;align-items:center;gap:var(--sp-3);flex-wrap:wrap">
        <span style="font:var(--type-code);font-size:var(--fs-body-s);color:var(--text-muted)">{risultato?.total ?? 0} carte</span>
        <div class="only-mob">
          <Button size="sm" variant="secondary" onclick={() => (sheetOpen = true)}>
            {#snippet icon()}<Icon name="filter" size={16} />{/snippet}
            Filtri{attivi > 0 ? ` (${attivi})` : ''}
          </Button>
        </div>
        <div class="hide-mob" style="display:flex;gap:var(--sp-2);flex-wrap:wrap">
          {#each chips as c (c.key)}<Chip onRemove={c.onRemove}>{c.label}</Chip>{/each}
        </div>
        <div style="margin-left:auto;display:flex;align-items:center;gap:var(--sp-3)">
          <Select
            size="sm"
            value={sort}
            options={ordinamentoOpzioni}
            onchange={(e: Event) => cambiaFiltro(() => (sort = (e.target as HTMLSelectElement).value as SortKey))}
          />
          <Tabs
            variant="pill"
            items={[{ id: 'griglia', label: 'Griglia' }, { id: 'lista', label: 'Lista' }]}
            value={view}
            onchange={(id) => (view = id as Vista)}
          />
        </div>
      </div>

      {#if chips.length > 0}
        <div class="only-mob" style="display:flex;gap:var(--sp-2);flex-wrap:wrap">
          {#each chips as c (c.key)}<Chip onRemove={c.onRemove}>{c.label}</Chip>{/each}
        </div>
      {/if}

      {#if loading}
        <div class="cards">
          {#each Array.from({ length: 8 }) as _, i (i)}
            <div style="display:grid;gap:10px;padding:12px;background:var(--surface-card);border:1px solid var(--border-hairline);border-radius:var(--r-card)">
              <Skeleton shape="card" />
              <Skeleton count={2} />
            </div>
          {/each}
        </div>
      {:else if !dati}
        <EmptyState icon="info" title="Impossibile caricare il catalogo" description="Controlla la connessione e riprova.">
          {#snippet action()}<Button variant="secondary" onclick={riprova}>Riprova</Button>{/snippet}
        </EmptyState>
      {:else if risultato && risultato.total === 0}
        <EmptyState
          title="Nessuna carta con questi filtri"
          description="Prova a togliere la rarità o ad allargare l'espansione."
        >
          {#snippet action()}<Button variant="secondary" onclick={azzeraETestoRicerca}>Azzera i filtri</Button>{/snippet}
        </EmptyState>
      {:else if view === 'griglia'}
        <div class="cards">
          {#each risultato!.items as c (c.id)}
            {@const set = datiSets.find((s) => s.id === c.set)}
            <a href={`/carta/${c.slug}`} style="text-decoration:none;color:inherit">
              <CardTile
                name={c.name}
                code={set ? cardCode(c, set) : c.num}
                set={set?.name}
                rarity={c.rarity}
                style="cursor:pointer"
                onclick={(e: MouseEvent) => apriQuickDaTessera(e, c.slug)}
              >
                {#snippet badge()}{#if c.nuovo}<Badge tone="foil">Nuovo</Badge>{/if}{/snippet}
              </CardTile>
            </a>
          {/each}
        </div>
      {:else}
        <Panel padding="0" style="overflow:hidden">
          {#each risultato!.items as c, i (c.id)}
            {@const set = datiSets.find((s) => s.id === c.set)}
            <a
              href={`/carta/${c.slug}`}
              style={`display:flex;align-items:center;gap:var(--sp-4);padding:var(--sp-3) var(--sp-4);min-height:64px;text-decoration:none;color:inherit;${i ? 'border-top:1px solid var(--border-hairline)' : ''}`}
            >
              <div style="width:40px;flex:none"><CardArt rarity={c.rarity} /></div>
              <div style="flex:1;min-width:0;display:grid;gap:2px">
                <span style="font:var(--type-card-title);color:var(--text-strong);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{c.name}</span>
                <span style="font:var(--type-code);color:var(--text-faint)">{set ? cardCode(c, set) : c.num} · {c.lang}</span>
              </div>
              <div class="hide-mob" style="display:flex;gap:var(--sp-2);align-items:center">
                <RarityBadge rarity={c.rarity} size="sm" />
                <ConditionBadge condition={c.cond} compact />
              </div>
              <!-- Decorativo: l'intera riga e' gia' il link (vedi sopra), un
                   <button> IconButton qui dentro anniderebbe interattivo
                   dentro interattivo — HTML non valido. -->
              <Icon name="chevron-right" size={18} style="color:var(--text-faint)" />
            </a>
          {/each}
        </Panel>
      {/if}

      {#if !loading && dati && risultato && risultato.total > 0}
        <div style="display:flex;justify-content:center;padding-top:var(--sp-6)" onclick={suClicPaginazione}>
          <Pagination page={risultato.page} pages={risultato.pages} hrefFor={(n: number) => urlPer(n)} />
        </div>
      {/if}
    </div>
  </div>

  <Sheet open={sheetOpen} onclose={() => (sheetOpen = false)} title="Filtri">
    {#snippet children()}{@render filtri()}{/snippet}
    {#snippet footer()}
      <Button variant="secondary" onclick={azzera} style="flex:1">Azzera</Button>
      <Button onclick={() => (sheetOpen = false)} style="flex:1">Vedi {risultato?.total ?? 0} carte</Button>
    {/snippet}
  </Sheet>
{/if}
