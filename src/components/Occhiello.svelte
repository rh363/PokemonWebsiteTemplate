<script lang="ts">
  // Porting di design-reference/pezzi.jsx, funzione Occhiello (righe 9-11):
  // l'etichetta piccola, maiuscoletta, sopra un titolo. tone="invert" e' per
  // gli sfondi scuri (es. sezione "Chi ci lavora" di chi-siamo.astro).
  import type { Snippet } from 'svelte'

  let {
    tone = undefined as 'invert' | undefined,
    style = '',
    children,
  }: {
    tone?: 'invert'
    style?: string
    children?: Snippet
  } = $props()
</script>

<span
  style="font:var(--type-eyebrow);letter-spacing:var(--ls-eyebrow);text-transform:uppercase;color:{tone ===
  'invert'
    ? 'var(--cyan-400)'
    : 'var(--text-brand)'};{style}"
>{@render children?.()}</span>
