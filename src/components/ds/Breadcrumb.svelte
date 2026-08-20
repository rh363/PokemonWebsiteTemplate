<script lang="ts">
  import Icon from './Icon.svelte'

  type Voce = { id?: string; label: string; href?: string }

  // bundle:1737-1792. Il sorgente gia' aveva aria-label="Percorso" e
  // aria-current="page" sull'ultima voce: nessuna lacuna di accessibilita'
  // qui, a differenza di Dialog. L'unico cambio e' che onNavigate/
  // preventDefault sparisce: le voci non-ultime sono <a href> reali.
  let {
    items = [] as Voce[],
    style = '',
  } = $props()
</script>

<nav aria-label="Percorso" class="ds-breadcrumb" {style}>
  {#each items as it, i (it.id ?? it.label)}
    {@const last = i === items.length - 1}
    {#if last}
      <span aria-current="page" class="ds-breadcrumb__current">{it.label}</span>
    {:else}
      <a class="ds-breadcrumb__link" href={it.href || '#'}>{it.label}</a>
    {/if}
    {#if !last}<Icon name="chevron-right" size={14} style="color:var(--text-faint)" />{/if}
  {/each}
</nav>
