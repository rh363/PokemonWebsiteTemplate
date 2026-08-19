<script lang="ts">
  import type { Snippet } from 'svelte'

  const TONES = {
    neutral: { bg: 'var(--ink-50)', fg: 'var(--text-body)', bd: 'var(--border-subtle)' },
    brand: { bg: 'var(--surface-brand)', fg: 'var(--text-invert)', bd: 'transparent' },
    accent: { bg: 'var(--surface-accent-soft)', fg: 'var(--cyan-700)', bd: 'var(--cyan-300)' },
    success: { bg: 'var(--state-success-soft)', fg: 'var(--state-success)', bd: 'transparent' },
    warning: { bg: 'var(--state-warning-soft)', fg: '#8A5A00', bd: 'transparent' },
    danger: { bg: 'var(--state-danger-soft)', fg: 'var(--cherry-700)', bd: 'transparent' },
    foil: { bg: 'var(--foil)', fg: 'var(--ink-950)', bd: 'var(--ink-950)' },
    invert: { bg: 'var(--ink-950)', fg: 'var(--text-invert)', bd: 'transparent' },
  } as const

  let {
    tone = 'neutral' as keyof typeof TONES,
    uppercase = true,
    icon = undefined as Snippet | undefined,
    children = undefined as Snippet | undefined,
    style = '',
  } = $props()

  const t = $derived(TONES[tone] ?? TONES.neutral)
</script>

<span
  class="ds-badge"
  class:ds-badge--upper={uppercase}
  style="background:{t.bg};color:{t.fg};border-color:{t.bd};{style}"
>
  {@render icon?.()}{@render children?.()}
</span>
