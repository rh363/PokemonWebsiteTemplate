<script lang="ts">
  // Isola di verifica per il Task 14: l'unica ragione per idratare CardTile
  // e' provare che il tilt (posizione del puntatore) e il toggle di `liked`
  // funzionano davvero da client. Tutto il resto della tessera e' gia'
  // dimostrato senza idratazione qui accanto, direttamente in ds-gallery.astro.
  import CardTile from '../ds/CardTile.svelte'
  import Badge from '../ds/Badge.svelte'

  let preferite = $state<Record<string, boolean>>({ 'cardtile-hyd-2': true })
  let ultimoClick = $state('nessuno ancora')

  function toggleLike(id: string) {
    return () => {
      preferite[id] = !preferite[id]
    }
  }
</script>

<div class="cards">
  <CardTile
    id="cardtile-hyd-1"
    name="Charizard ex"
    code="ALB 042/198"
    set="Alba Cromatica"
    rarity="ultra"
    liked={preferite['cardtile-hyd-1'] ?? false}
    onLike={toggleLike('cardtile-hyd-1')}
    onclick={() => (ultimoClick = 'Charizard ex')}
  />
  <CardTile
    id="cardtile-hyd-2"
    name="Pikachu VMAX"
    code="SWSH 044/073"
    set="Vivid Voltage"
    rarity="holo"
    liked={preferite['cardtile-hyd-2'] ?? false}
    onLike={toggleLike('cardtile-hyd-2')}
    onclick={() => (ultimoClick = 'Pikachu VMAX')}
  >
    {#snippet badge()}
      <Badge tone="foil">Nuovo</Badge>
    {/snippet}
  </CardTile>
  <CardTile
    id="cardtile-hyd-3"
    name="Eevee"
    code="ALB 130/198"
    set="Alba Cromatica"
    rarity="common"
    onclick={() => (ultimoClick = 'Eevee')}
  />
</div>

<p id="cardtile-hyd-status" style="font:var(--type-code);color:var(--text-faint)">
  Ultimo click: {ultimoClick}
</p>
