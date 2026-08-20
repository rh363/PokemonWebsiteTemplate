<script lang="ts">
  import type { Snippet } from 'svelte'
  import Icon from './Icon.svelte'

  // Fedele a bundle:534-609, con un cambio deliberato: l'apertura era uno
  // useState su <section>/<button>, qui e' <details defaultOpen>/<summary>.
  // Elimina JavaScript e regala la tastiera nativa (Invio/Spazio su
  // <summary> apre e chiude, di serie). defaultOpen inizializza lo stato
  // una volta sola, come faceva useState(defaultOpen) nel sorgente.
  let {
    title = undefined as string | undefined,
    activeCount = undefined as number | undefined,
    defaultOpen = true,
    children = undefined as Snippet | undefined,
    style = '',
    ...rest
  } = $props()
</script>

<details class="ds-fg" open={defaultOpen} {style} {...rest}>
  <summary class="ds-fg__summary">
    <span class="ds-fg__title">{title}</span>
    {#if activeCount && activeCount > 0}
      <span class="ds-fg__count">{activeCount}</span>
    {/if}
    <span class="ds-fg__chev" aria-hidden="true"><Icon name="chevron-down" size={16} /></span>
  </summary>
  <div class="ds-fg__body">
    {@render children?.()}
  </div>
</details>
