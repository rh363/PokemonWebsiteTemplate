<script lang="ts">
  import type { Snippet } from 'svelte'
  import Icon from './Icon.svelte'

  let {
    selected = undefined as boolean | undefined,
    count = undefined as number | undefined,
    icon = undefined as Snippet | undefined,
    onclick = undefined as ((e: MouseEvent) => void) | undefined,
    onRemove = undefined as ((e: MouseEvent) => void) | undefined,
    disabled = undefined as boolean | undefined,
    children = undefined as Snippet | undefined,
    style = '',
    ...rest
  } = $props()

  // Fedele a bundle:614 — interactive determina hover, cursore e aria-pressed.
  const interactive = $derived(!!(onclick || onRemove))
</script>

<button
  type="button"
  class="ds-chip"
  class:ds-chip--interactive={interactive}
  class:ds-chip--selected={selected}
  {disabled}
  onclick={disabled ? undefined : onclick}
  aria-pressed={onclick ? !!selected : undefined}
  {style}
  {...rest}
>
  {@render icon?.()}{@render children?.()}
  {#if count != null}
    <span class="ds-chip__count">{count}</span>
  {/if}
  {#if onRemove}
    <!-- bundle:651 — onClick della x ferma la propagazione, altrimenti scatta
         anche il click del chip che la contiene. -->
    <span
      class="ds-chip__remove"
      onclick={(e: MouseEvent) => {
        e.stopPropagation()
        onRemove?.(e)
      }}
    >
      <Icon name="x" size={14} />
    </span>
  {/if}
</button>
