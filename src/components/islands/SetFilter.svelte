<script lang="ts">
  // Controllo dei Tabs per /espansioni. Retrofit del Task 19: quest'isola
  // montava l'intera lista delle sei espansioni, coi 6 CardArt di ogni riga
  // ricevuti come props — 21 KB di JSON incorporati nell'HTML per sei
  // elementi, a duplicare dati gia' presenti come markup reso (vedi
  // docs/superpowers/plans/2026-08-18-cartafolia-astro.md, sezione "Le isole
  // non trasportano dati: li chiedono al seam"). La lista ora si rende in
  // Astro, staticamente (espansioni.astro): questa isola monta SOLO i Tabs
  // e non riceve alcun dato di catalogo — zero props.
  //
  // Il contenitore della lista vive fuori dall'albero di questo componente
  // (e' HTML statico, non un figlio Svelte), quindi l'attributo data-tab si
  // sincronizza via DOM, non via binding di template — stesso motivo per cui
  // data-chiedi-trigger in NavBar.astro scrive nello store invece di
  // chiamare una funzione passata come prop.
  import Tabs from '../ds/Tabs.svelte'

  type TabId = 'tutte' | 'recenti' | 'vintage'

  // espansioni.jsx riga 18: const[tab,setTab]=React.useState("tutte").
  let tab = $state<TabId>('tutte')

  // Il markup statico (espansioni.astro) parte gia' con data-tab="tutte" sul
  // contenitore #sets-list — lo stesso stato iniziale di questa isola, cosi'
  // non c'e' alcun flash fra l'HTML pre-idratazione e il primo render Svelte.
  $effect(() => {
    document.getElementById('sets-list')?.setAttribute('data-tab', tab)
  })
</script>

<Tabs
  items={[
    { id: 'tutte', label: 'Tutte' },
    { id: 'recenti', label: 'Recenti' },
    { id: 'vintage', label: 'Vintage' },
  ]}
  value={tab}
  onchange={(id) => (tab = id as TabId)}
  style="margin-top:var(--sp-2)"
/>
