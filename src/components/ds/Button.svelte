<script lang="ts">
  import type { Snippet } from 'svelte'

  let {
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    disabled = false,
    href = undefined as string | undefined,
    onclick = undefined as ((e: MouseEvent) => void) | undefined,
    icon = undefined as Snippet | undefined,
    iconRight = undefined as Snippet | undefined,
    children = undefined as Snippet | undefined,
    style = '',
    ...rest
  } = $props()
</script>

{#snippet inner()}
  {@render icon?.()}{@render children?.()}{@render iconRight?.()}
{/snippet}

{#if href}
  <a
    class="ds-btn"
    class:ds-btn--full={fullWidth}
    data-variant={variant}
    data-size={size}
    {href}
    {onclick}
    {style}
    {...rest}>{@render inner()}</a>
{:else}
  <button
    class="ds-btn"
    class:ds-btn--full={fullWidth}
    data-variant={variant}
    data-size={size}
    {disabled}
    onclick={disabled ? undefined : onclick}
    {style}
    {...rest}>{@render inner()}</button>
{/if}
