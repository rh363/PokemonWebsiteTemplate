<script lang="ts">
  import type { Snippet } from 'svelte'
  import IconButton from './IconButton.svelte'

  // Sorgente: design-reference/pezzi.jsx, funzione Sheet (non sta nel bundle).
  // La firma li' e' {open,onClose,title,children,footer} — niente eyebrow ne'
  // width, a differenza di Dialog: qui si resta fedeli al sorgente reale
  // invece che al riassunto del brief.
  // Il prototipo gestisce Escape a mano e blocca lo scroll del body
  // (document.body.style.overflow) finche' e' aperto, ripristinandolo alla
  // chiusura. <dialog> nativo da' focus trap ed Escape gratis; il blocco
  // scroll del body resta esplicito perche' showModal() non lo garantisce
  // in ogni browser.
  let {
    open = false,
    title = '',
    onclose = undefined as (() => void) | undefined,
    children = undefined as Snippet | undefined,
    footer = undefined as Snippet | undefined,
  } = $props()

  let el = $state<HTMLDialogElement | null>(null)
  let opener: HTMLElement | null = null
  let prevOverflow = ''
  // Stessa correzione di Dialog: aria-labelledby collegato al titolo visibile
  // invece di aria-label, che lo duplicherebbe per lo screen reader.
  const titleId = `sheet-${Math.random().toString(36).slice(2, 9)}`

  $effect(() => {
    if (!el) return
    if (open && !el.open) {
      opener = document.activeElement as HTMLElement | null
      prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      el.showModal()
    } else if (!open && el.open) {
      el.close()
      document.body.style.overflow = prevOverflow
      opener?.focus()
    }
  })
</script>

<dialog
  bind:this={el}
  class="ds-sheet sheet-in"
  aria-labelledby={title ? titleId : undefined}
  oncancel={(e) => {
    e.preventDefault()
    onclose?.()
  }}
  onclick={(e) => {
    if (e.target === el) onclose?.()
  }}
>
  <div class="ds-sheet__head">
    <span aria-hidden="true" class="ds-sheet__handle"></span>
    <span id={titleId} class="ds-sheet__title">{title}</span>
    {#if onclose}<IconButton icon="x" variant="ghost" label="Chiudi" onclick={onclose} />{/if}
  </div>
  <div class="ds-sheet__body">{@render children?.()}</div>
  {#if footer}<div class="ds-sheet__foot">{@render footer()}</div>{/if}
</dialog>
