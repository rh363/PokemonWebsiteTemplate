<script lang="ts">
  import type { Snippet } from 'svelte'
  import IconButton from './IconButton.svelte'

  // Il prototipo (bundle:1030-1130) gestisce solo Escape via keydown, senza
  // focus trap ne' ripristino del focus, e usa aria-label invece di collegare
  // il titolo. L'elemento <dialog> nativo con showModal() da' focus trap,
  // Escape e scrim inerte gratis dal browser; qui restano da fare solo il
  // ripristino del focus sull'apritore e il collegamento aria-labelledby.
  let {
    open = false,
    title = '',
    eyebrow = '',
    width = 560,
    onclose = undefined as (() => void) | undefined,
    children = undefined as Snippet | undefined,
    footer = undefined as Snippet | undefined,
    style = '',
  } = $props()

  let el = $state<HTMLDialogElement | null>(null)
  let opener: HTMLElement | null = null
  const titleId = `dlg-${Math.random().toString(36).slice(2, 9)}`

  $effect(() => {
    if (!el) return
    if (open && !el.open) {
      opener = document.activeElement as HTMLElement | null
      el.showModal()
    } else if (!open && el.open) {
      el.close()
      opener?.focus()
    }
  })
</script>

<dialog
  bind:this={el}
  class="ds-dialog"
  style="max-width:{width}px;{style}"
  aria-labelledby={title ? titleId : undefined}
  oncancel={(e) => {
    e.preventDefault()
    onclose?.()
  }}
  onclick={(e) => {
    if (e.target === el) onclose?.()
  }}
>
  <div class="ds-dialog__head">
    <div class="ds-dialog__titles">
      {#if eyebrow}<span class="ds-dialog__eyebrow">{eyebrow}</span>{/if}
      {#if title}<h2 id={titleId} class="ds-dialog__title">{title}</h2>{/if}
    </div>
    {#if onclose}<IconButton icon="x" variant="ghost" label="Chiudi" onclick={onclose} />{/if}
  </div>
  <div class="ds-dialog__body">{@render children?.()}</div>
  {#if footer}<div class="ds-dialog__foot">{@render footer()}</div>{/if}
</dialog>
