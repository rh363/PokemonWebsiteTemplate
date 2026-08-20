<script lang="ts">
  import type { Snippet } from 'svelte'

  let {
    variant = 'card' as 'card' | 'sunken' | 'sticker' | 'invert' | 'foil',
    padding = 'var(--sp-6)',
    hoverLift = false,
    as = 'div' as 'div' | 'section' | 'article' | 'a' | 'li',
    children = undefined as Snippet | undefined,
    style = '',
    ...rest
  } = $props()
</script>

{#if as === 'section'}
  <section
    class="ds-panel"
    class:ds-panel--lift={hoverLift}
    data-variant={variant}
    style="padding:{padding};{style}"
    {...rest}
  >
    {@render children?.()}
  </section>
{:else if as === 'article'}
  <article
    class="ds-panel"
    class:ds-panel--lift={hoverLift}
    data-variant={variant}
    style="padding:{padding};{style}"
    {...rest}
  >
    {@render children?.()}
  </article>
{:else if as === 'a'}
  <a
    class="ds-panel"
    class:ds-panel--lift={hoverLift}
    data-variant={variant}
    style="padding:{padding};{style}"
    {...rest}>{@render children?.()}</a
  >
{:else if as === 'li'}
  <li
    class="ds-panel"
    class:ds-panel--lift={hoverLift}
    data-variant={variant}
    style="padding:{padding};{style}"
    {...rest}
  >
    {@render children?.()}
  </li>
{:else}
  <div
    class="ds-panel"
    class:ds-panel--lift={hoverLift}
    data-variant={variant}
    style="padding:{padding};{style}"
    {...rest}
  >
    {@render children?.()}
  </div>
{/if}
