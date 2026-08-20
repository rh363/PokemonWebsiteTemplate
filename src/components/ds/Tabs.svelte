<script lang="ts">
  type Voce = { id: string; label: string; count?: number }
  type Variante = 'underline' | 'pill'

  let {
    items = [] as Voce[],
    value = undefined as string | undefined,
    onchange = undefined as ((id: string) => void) | undefined,
    variant = 'underline' as Variante,
    style = '',
  } = $props()
</script>

<div class="ds-tabs" data-variant={variant} role="tablist" {style}>
  {#each items as it (it.id)}
    <button
      type="button"
      class="ds-tabs__tab"
      class:is-selected={it.id === value}
      role="tab"
      aria-selected={it.id === value}
      onclick={() => onchange?.(it.id)}
    >
      {it.label}
      {#if it.count != null}<span class="ds-tabs__count">{it.count}</span>{/if}
    </button>
  {/each}
</div>
