<script lang="ts">
  import type { Condition } from '~/lib/catalog'

  const COND = {
    mint: { label: 'Mint', short: 'M', level: 5, color: 'var(--cond-mint)' },
    'near-mint': { label: 'Near Mint', short: 'NM', level: 4, color: 'var(--cond-near-mint)' },
    excellent: { label: 'Excellent', short: 'EX', level: 3, color: 'var(--cond-excellent)' },
    good: { label: 'Good', short: 'GD', level: 2, color: 'var(--cond-good)' },
    played: { label: 'Played', short: 'PL', level: 1, color: 'var(--cond-played)' },
  } as const

  let {
    condition = 'near-mint' as Condition,
    compact = false,
    style = '',
  } = $props()

  const c = $derived(COND[condition] ?? COND['near-mint'])
</script>

<span
  class="ds-condbadge"
  title="Condizione: {c.label}"
  style={style}
>
  <span aria-hidden="true" class="ds-condbadge__bars">
    {#each [1, 2, 3, 4, 5] as i (i)}
      <span
        class="ds-condbadge__bar"
        style="height:{4 + i * 1.6}px;background:{i <= c.level ? c.color : 'var(--ink-200)'}"
      ></span>
    {/each}
  </span>
  {compact ? c.short : c.label}
</span>
