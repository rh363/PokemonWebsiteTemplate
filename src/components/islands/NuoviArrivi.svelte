<script lang="ts">
  // Controllo dei Tabs per la sezione "Nuovi arrivi" della Vetrina (Task 19).
  // Stessa tecnica del retrofit di SetFilter.svelte per /espansioni: le dieci
  // carte si rendono in Astro, staticamente, con data-holo e data-vintage
  // gia' calcolati lato server (index.astro); questa isola monta SOLO i Tabs
  // e sincronizza l'attributo data-tab sul contenitore statico via DOM.
  // Zero dati di catalogo come prop.
  import Tabs from '../ds/Tabs.svelte'

  type TabId = 'tutte' | 'holo' | 'vintage'

  // vetrina.jsx riga 31: const[tab,setTab]=React.useState("tutte").
  let tab = $state<TabId>('tutte')

  // Il markup statico parte gia' con data-tab="tutte" su #arrivi-list —
  // stesso stato iniziale di questa isola, nessun flash pre-idratazione.
  $effect(() => {
    document.getElementById('arrivi-list')?.setAttribute('data-tab', tab)
  })
</script>

<Tabs
  items={[
    { id: 'tutte', label: 'Tutte' },
    { id: 'holo', label: 'Holo e oltre' },
    { id: 'vintage', label: 'Vintage' },
  ]}
  value={tab}
  onchange={(id) => (tab = id as TabId)}
/>
