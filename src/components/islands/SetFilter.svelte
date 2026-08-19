<script lang="ts">
  // Porting di design-reference/espansioni.jsx: Tabs (Tutte/Recenti/Vintage)
  // + l'elenco delle sei espansioni, comprese le miniature che aprono la
  // quick-view. Le sei espansioni vengono renderizzate TUTTE qui dentro (non
  // dalla pagina Astro): questa isola e' comunque pre-renderizzata a HTML
  // statico in fase di build (com'e' ogni isola client:*), quindi a JS
  // disattivato il markup e' identico — solo l'attributo data-tab non
  // cambia piu' e nessuna scheda resta nascosta, cosi' come le miniature
  // restano visibili anche se il loro click non fa nulla. Non ricostruiamo
  // la lista in JS: il tab cambia solo l'attributo data-tab sul contenitore
  // e il CSS nasconde ciò che non serve (vedi il blocco di stile qui sotto).
  //
  // Le miniature stanno qui (non in un data-quick-trigger globale come
  // "Chiedi una carta" in NavBar.astro) perche' quick.set() vuole l'intera
  // Card, non un id serializzabile in un attributo — piu' semplice passarla
  // gia' in memoria a un componente Svelte che tenerla in un dataset HTML.
  //
  // Import diretto da labels/types, non dal barrel '~/lib/catalog': quel
  // barrel ri-esporta anche source.static.astro.ts, che importa astro:content
  // — un modulo server-only che romperebbe la build se finisse nel bundle
  // client di questa isola (stesso motivo di SiteChrome.svelte).
  import Panel from '../ds/Panel.svelte'
  import Badge from '../ds/Badge.svelte'
  import Button from '../ds/Button.svelte'
  import Icon from '../ds/Icon.svelte'
  import CardArt from '../ds/CardArt.svelte'
  import Tabs from '../ds/Tabs.svelte'
  import Titolo from '../Titolo.svelte'
  import { inVetrina } from '~/lib/catalog/labels'
  import { apriQuick } from '~/stores/chrome'
  import type { Card } from '~/lib/catalog/types'

  interface SetVM {
    id: string
    name: string
    code: string
    year: number
    total: number
    color: string
    /** carte.length del sorgente: quante carte reali del catalogo appartengono
     *  a questa espansione (non la stima di inVetrina). */
    count: number
    /** Le prime sei carte dell'espansione, per le miniature. */
    cards: Card[]
  }

  let { sets = [] as SetVM[] } = $props()

  // espansioni.jsx riga 18: const[tab,setTab]=React.useState("tutte").
  let tab = $state<'tutte' | 'recenti' | 'vintage'>('tutte')
</script>

<Tabs
  items={[
    { id: 'tutte', label: 'Tutte' },
    { id: 'recenti', label: 'Recenti' },
    { id: 'vintage', label: 'Vintage' },
  ]}
  value={tab}
  onchange={(id) => (tab = id as typeof tab)}
  style="margin-top:var(--sp-2)"
/>

<div class="sets" data-tab={tab} style="display:grid;gap:var(--sp-5);margin-top:var(--sp-8)">
  {#each sets as s (s.id)}
    <Panel hoverLift padding="var(--sp-6)" data-recente={s.year >= 2023} data-panel="set-row">
      <div style="display:grid;gap:var(--sp-3);min-width:0">
        <div style="display:flex;align-items:center;gap:var(--sp-3);flex-wrap:wrap">
          <span style="width:38px;height:38px;border-radius:var(--r-sm);background:{s.color};flex:none"></span>
          <Titolo livello="piccolo" as="h2">{s.name}</Titolo>
          <span style="font:var(--type-code);color:var(--text-faint)">{s.code} · {s.year} · {s.count} schedate</span>
          {#if s.year < 2010}<Badge tone="neutral">Vintage</Badge>{/if}
        </div>

        <div style="display:grid;gap:6px">
          <div style="display:flex;justify-content:space-between;font:var(--type-code);color:var(--text-muted)">
            <span>{inVetrina(s)} in vetrina</span><span>{s.total} nell'espansione</span>
          </div>
          <div
            style="height:8px;border-radius:var(--r-pill);background:var(--surface-sunken);overflow:hidden;border:1px solid var(--border-hairline)"
          >
            <div
              style="width:{Math.round((inVetrina(s) / s.total) * 100)}%;height:100%;background:{s.color};transition:width var(--dur-slow) var(--ease-out)"
            ></div>
          </div>
        </div>

        <div style="display:flex;gap:var(--sp-2);flex-wrap:wrap;margin-top:var(--sp-1)">
          {#each s.cards as c (c.id)}
            <button
              type="button"
              onclick={() => apriQuick(c)}
              title={c.name}
              aria-label={c.name}
              style="all:unset;cursor:pointer;width:52px;border-radius:var(--r-cardart)"
            >
              <CardArt rarity={c.rarity} />
            </button>
          {/each}
        </div>
      </div>

      <div data-panel="set-actions">
        <Button variant="secondary" as="a" href={`/catalogo?set=${s.id}`}>
          Vedi le carte
          {#snippet iconRight()}<Icon name="arrow-right" size={16} />{/snippet}
        </Button>
      </div>
    </Panel>
  {/each}
</div>

<style>
  /* espansioni.jsx: tab==="recenti" tiene solo s.year>=2023, tab==="vintage"
     solo s.year<2023. Qui l'HTML e' sempre completo: il CSS nasconde. */
  .sets[data-tab='recenti'] :global([data-recente='false']) {
    display: none;
  }
  .sets[data-tab='vintage'] :global([data-recente='true']) {
    display: none;
  }

  /* Il Panel di ogni riga: due colonne (contenuto, azione) da 1080px in su,
     una sola sotto — stesso breakpoint di .g2 in layout.css. */
  :global(.sets [data-panel='set-row']) {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: var(--sp-6);
    align-items: center;
  }
  :global(.sets [data-panel='set-actions']) {
    display: grid;
    gap: var(--sp-2);
    justify-items: end;
  }
  @media (max-width: 1080px) {
    :global(.sets [data-panel='set-row']) {
      grid-template-columns: minmax(0, 1fr);
    }
    :global(.sets [data-panel='set-actions']) {
      justify-items: stretch;
    }
  }
</style>
