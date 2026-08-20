<script lang="ts">
  import type { Snippet } from 'svelte'
  import Icon from './Icon.svelte'
  import type { IconName } from '~/lib/icons'

  type Tono = 'neutral' | 'success' | 'brand' | 'danger'

  // Mappa TONES — bundle:1233-1249, copiata intera.
  const TONES: Record<Tono, { bg: string; fg: string; icon: IconName }> = {
    neutral: { bg: 'var(--ink-950)', fg: 'var(--text-invert)', icon: 'info' },
    success: { bg: 'var(--state-success)', fg: '#FFFFFF', icon: 'check' },
    brand: { bg: 'var(--surface-brand)', fg: 'var(--text-invert)', icon: 'sparkles' },
    danger: { bg: 'var(--cherry-700)', fg: 'var(--text-invert)', icon: 'info' },
  }

  let {
    tone = 'neutral' as Tono,
    title = undefined as string | undefined,
    description = undefined as string | undefined,
    action = undefined as Snippet | undefined,
    onclose = undefined as (() => void) | undefined,
    style = '',
  } = $props()

  const t = $derived(TONES[tone] ?? TONES.neutral)
</script>

<div role="status" class="ds-toast" style="--toast-bg:{t.bg};--toast-fg:{t.fg};{style}">
  <Icon name={t.icon} size={18} style="margin-top:2px;opacity:.9" />
  <div class="ds-toast__text">
    <span class="ds-toast__title">{title}</span>
    {#if description}<span class="ds-toast__desc">{description}</span>{/if}
  </div>
  {@render action?.()}
  {#if onclose}
    <button type="button" onclick={onclose} aria-label="Chiudi" class="ds-toast__close">
      <Icon name="x" size={16} />
    </button>
  {/if}
</div>
