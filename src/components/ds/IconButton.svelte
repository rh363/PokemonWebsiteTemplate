<script lang="ts">
  import Icon from './Icon.svelte'
  import type { IconName } from '~/lib/icons'

  // label e' obbligatoria: e' l'unico testo che un lettore di schermo trova
  // (bundle:717, aria-label: label).
  let {
    icon = 'x' as IconName,
    variant = 'secondary',
    size = 'md',
    label,
    active = undefined as boolean | undefined,
    disabled = undefined as boolean | undefined,
    onclick = undefined as ((e: MouseEvent) => void) | undefined,
    style = '',
    ...rest
  }: {
    icon?: IconName
    variant?: 'secondary' | 'ghost' | 'brand' | 'invert'
    size?: 'sm' | 'md' | 'lg'
    label: string
    active?: boolean
    disabled?: boolean
    onclick?: (e: MouseEvent) => void
    style?: string
    [key: string]: unknown
  } = $props()

  // Fedele a bundle:735 — sm 16, lg 22, md (default) 18.
  const iconSize = $derived(size === 'sm' ? 16 : size === 'lg' ? 22 : 18)
</script>

<button
  class="ds-iconbtn"
  data-variant={variant}
  data-size={size}
  aria-label={label}
  aria-pressed={active}
  {disabled}
  onclick={disabled ? undefined : onclick}
  {style}
  {...rest}
>
  <Icon name={icon} size={iconSize} />
</button>
