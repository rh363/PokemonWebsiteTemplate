<script lang="ts">
  import type { Rarity } from '~/lib/catalog'

  const RARITY = {
    common: { label: 'Comune', color: 'var(--rarity-common)', dots: 1 },
    uncommon: { label: 'Non comune', color: 'var(--rarity-uncommon)', dots: 2 },
    rare: { label: 'Rara', color: 'var(--rarity-rare)', dots: 3 },
    holo: { label: 'Holo', color: 'var(--rarity-holo)', dots: 4 },
    ultra: { label: 'Ultra rara', color: 'var(--rarity-ultra)', dots: 5 },
    secret: { label: 'Segreta', color: 'var(--rarity-secret)', dots: 6 },
  } as const

  let {
    rarity = 'common' as Rarity,
    showLabel = true,
    size = 'md' as 'sm' | 'md',
    style = '',
  } = $props()

  const r = $derived(RARITY[rarity] ?? RARITY.common)
</script>

<span
  class="ds-raritybadge"
  data-size={size}
  title={r.label}
  style="border-color:{r.color};color:{r.color};{style}"
>
  <span aria-hidden="true" class="ds-raritybadge__dots">
    {#each Array.from({ length: r.dots }) as _, i (i)}
      <span class="ds-raritybadge__dot" style="background:{r.color}"></span>
    {/each}
  </span>
  {#if showLabel}{r.label}{/if}
</span>
