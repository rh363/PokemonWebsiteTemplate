<script lang="ts">
  // I due bottoni della scheda carta che parlano con lo chrome del sito —
  // porting di design-reference/carta.jsx, funzione SchedaCarta (riga 33).
  // "Come arrivare" (terzo bottone del sorgente) resta un <a href="/negozio">
  // statico FUORI da quest'isola in carta/[slug].astro: nessuno stato,
  // nessun evento, un link e basta.
  //
  // Riceve slug, name e code — tre stringhe, non la Card intera. name/code
  // bastano per il messaggio del toast di "Condividi" (identici a quelli
  // gia' calcolati server-side per il resto della pagina, non vale la pena
  // ri-chiederli al seam). "Chiedila in negozio" invece scrive nello store
  // condiviso `chiedi` (~/stores/chrome), che vuole un oggetto Card intero
  // per comporre il messaggio precompilato in SiteChrome — quello SI' va
  // chiesto al seam (getCatalog(), /api/catalog.json) al momento del click,
  // non portato come prop di isola: stesso schema di chiediDaQuick in
  // SiteChrome.svelte. Se la fetch fallisce, si ripiega sulla richiesta
  // generica (apriChiedi(true)) invece di lasciare il bottone morto.
  import Button from '../ds/Button.svelte'
  import IconButton from '../ds/IconButton.svelte'
  import Tooltip from '../ds/Tooltip.svelte'
  import Icon from '../ds/Icon.svelte'
  import { apriChiedi, avviso } from '~/stores/chrome'
  import { getCatalog } from '~/stores/catalog'

  let { slug, name, code }: { slug: string; name: string; code: string } = $props()

  async function chiedi() {
    try {
      const { cards } = await getCatalog()
      const carta = cards.find((c) => c.slug === slug)
      apriChiedi(carta ?? true)
    } catch {
      apriChiedi(true)
    }
  }

  // carta.jsx: navigator.clipboard&&navigator.clipboard.writeText(location.href);
  // avviso("Link copiato",carta.name+" · "+window.codeOf(carta))
  function condividi() {
    navigator.clipboard?.writeText(location.href)
    avviso('Link copiato', `${name} · ${code}`)
  }
</script>

<Button onclick={chiedi}>
  {#snippet icon()}<Icon name="instagram" size={16} />{/snippet}
  Chiedila in negozio
</Button>
<Tooltip label="Copia il link della scheda">
  <IconButton icon="share-2" label="Condividi" onclick={condividi} />
</Tooltip>
