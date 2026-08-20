<script lang="ts">
  // Porting di design-reference/pezzi.jsx, funzione Testo (righe 23-25): il
  // paragrafo di corpo, sempre con color (var(--text-muted), o
  // var(--text-invert-muted) su sfondo scuro), max-width:62ch e
  // text-wrap:pretty. E' proprio questo "sempre" che il porting a mano di
  // chi-siamo.astro aveva perso su tre gruppi di paragrafi (vedi
  // task-16-report.md): niente color esplicito, quei <p> ereditavano
  // --panel-fg da Panel invece di --text-muted.
  import type { Snippet } from 'svelte'

  let {
    grande = false,
    tone = undefined as 'invert' | undefined,
    style = '',
    children,
  }: {
    grande?: boolean
    tone?: 'invert'
    style?: string
    children?: Snippet
  } = $props()
</script>

<p
  style="font:var(--type-body);font-size:{grande ? 'var(--fs-body-l)' : 'var(--fs-body-m)'};line-height:{grande
    ? 'var(--lh-body-l)'
    : 'var(--lh-body-m)'};color:{tone === 'invert'
    ? 'var(--text-invert-muted)'
    : 'var(--text-muted)'};max-width:62ch;text-wrap:pretty;{style}"
>{@render children?.()}</p>
