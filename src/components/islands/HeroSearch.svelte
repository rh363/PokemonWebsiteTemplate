<script lang="ts">
  // Isola dell'hero della Vetrina (Task 19). Porting di
  // design-reference/vetrina.jsx, funzione Hero() — ma SOLO il campo di
  // ricerca: le 4 CardTile a destra restano HTML statico in index.astro,
  // col click delegato via data-carta esattamente come ogni altra tessera
  // del sito (stesso schema di data-chiedi-trigger, vedi NavBar.astro). Non
  // hanno bisogno di JavaScript, e imbarcarle qui vorrebbe dire tornare a
  // passare oggetti Card come props di isola — il difetto misurato su
  // SetFilter e corretto nel retrofit di /espansioni.
  //
  // client:load (non client:visible): la ricerca e' la prima cosa che
  // l'utente tocca, sopra la piega — vetrina.jsx la monta gia' aperta.
  //
  // I suggerimenti filtrano su name fra le 100 carte del catalogo: dati che
  // questa isola non ha (la pagina statica mostra solo le prime 4). Niente
  // Card[] incorporate come prop pero': /api/catalog.json — lo stesso seam
  // di SiteChrome, tramite ~/stores/catalog, che tiene una sola fetch per
  // pagina — si interroga alla prima lettera digitata, non al mount
  // dell'isola.
  import SearchField from '../ds/SearchField.svelte'
  import { cardCode } from '~/lib/catalog/labels'
  import { getCatalog, type CatalogPayload } from '~/stores/catalog'

  let query = $state('')
  let suggestions = $state<{ label: string; meta: string }[]>([])
  let catalog: CatalogPayload | null = null

  async function aggiornaSuggerimenti(q: string) {
    if (!q) {
      suggestions = []
      return
    }
    if (!catalog) {
      // getCatalog() puo' rifiutare (Finding 1): questa funzione e' invocata
      // come `void aggiornaSuggerimenti(v)`, quindi un rifiuto non gestito
      // qui diventerebbe una unhandled promise rejection. Niente toast per
      // un suggerimento mancato — non vale l'interruzione — ma non deve
      // esplodere: si rinuncia in silenzio e il prossimo carattere digitato
      // fa ripartire il tentativo (getCatalog() non mette in cache i rifiuti).
      try {
        catalog = await getCatalog()
      } catch {
        suggestions = []
        return
      }
    }
    // Guardia contro risposte in ordine sparso: se l'utente ha gia' digitato
    // altro mentre la fetch era in corso, questo risultato e' superato.
    if (query !== q) return
    const n = q.toLowerCase()
    // vetrina.jsx riga 5: filtra su name, primi 5, meta = codeOf(c).
    suggestions = catalog.cards
      .filter((c) => c.name.toLowerCase().includes(n))
      .slice(0, 5)
      .map((c) => ({
        label: c.name,
        meta: cardCode(c, catalog!.sets.find((s) => s.id === c.set)!),
      }))
  }

  function handleInput(e: Event) {
    const v = (e.target as HTMLInputElement).value
    query = v
    void aggiornaSuggerimenti(v)
  }

  function handleClear() {
    query = ''
    suggestions = []
  }

  // vetrina.jsx: onPick={s=>onCerca(s.label)} — nel sorgente (SPA) onCerca
  // cambia schermata via router interno; qui e' una pagina diversa, quindi
  // una navigazione vera.
  function cerca(termine: string) {
    window.location.href = `/catalogo?q=${encodeURIComponent(termine)}`
  }
</script>

<SearchField
  size="lg"
  value={query}
  oninput={handleInput}
  onclear={handleClear}
  {suggestions}
  onpick={(s) => cerca(typeof s === 'string' ? s : s.label)}
  style="max-width:560px"
/>
