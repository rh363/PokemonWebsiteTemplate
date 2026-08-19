<script lang="ts">
  // Isola di verifica per il Task 11: monta i cinque componenti del design
  // system con stato vero (SearchField, Select, Checkbox, Switch,
  // FilterGroup) con valori locali, cosi' la galleria puo' esercitarli con
  // tastiera e mouse. Input resta fuori: la sua unica interazione (focus) e'
  // CSS puro (:focus-within), quindi vive direttamente in ds-gallery.astro
  // senza idratazione, come i tredici componenti dei Task 9-10.
  import SearchField from '../ds/SearchField.svelte'
  import Select from '../ds/Select.svelte'
  import Checkbox from '../ds/Checkbox.svelte'
  import Switch from '../ds/Switch.svelte'
  import FilterGroup from '../ds/FilterGroup.svelte'

  type Suggerimento = string | { label: string; meta?: string | number }

  let query = $state('')
  const suggerimentiTutti: Suggerimento[] = [
    { label: 'Alba Cromatica', meta: 'espansione' },
    { label: 'Charizard ex', meta: 'carta' },
    { label: 'Pikachu VMAX', meta: 'carta' },
    'Obsidian Flames',
  ]
  const suggerimenti = $derived(
    query ? suggerimentiTutti.filter((s) => (typeof s === 'string' ? s : s.label).toLowerCase().includes(query.toLowerCase())) : [],
  )

  function scegli(s: Suggerimento) {
    query = typeof s === 'string' ? s : s.label
  }

  let condizione = $state('near-mint')
  const opzioniCondizione = [
    { value: 'mint', label: 'Mint' },
    { value: 'near-mint', label: 'Quasi perfetta' },
    { value: 'excellent', label: 'Eccellente' },
    { value: 'good', label: 'Buona' },
    { value: 'played', label: 'Giocata' },
  ]

  let soloFoil = $state(false)
  let soloDisponibili = $state(true)
</script>

<div style="display:grid;gap:var(--sp-8);max-width:520px">
  <SearchField
    id="ds-forms-search"
    name="ricerca"
    value={query}
    oninput={(e: Event) => (query = (e.target as HTMLInputElement).value)}
    onclear={() => (query = '')}
    suggestions={suggerimenti}
    onpick={scegli}
  />

  <Select
    id="ds-forms-condizione"
    name="condizione"
    label="Condizione"
    value={condizione}
    options={opzioniCondizione}
    onchange={(e: Event) => (condizione = (e.target as HTMLSelectElement).value)}
  />

  <FilterGroup title="Rarità" activeCount={soloFoil ? 1 : 0}>
    <Checkbox
      label="Solo foil"
      description="Mostra soltanto le carte con finitura foil"
      checked={soloFoil}
      onchange={() => (soloFoil = !soloFoil)}
    />
  </FilterGroup>

  <Switch
    label="Solo disponibili"
    checked={soloDisponibili}
    onchange={() => (soloDisponibili = !soloDisponibili)}
  />
</div>
