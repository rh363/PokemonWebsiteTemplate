<script lang="ts">
  // Porting di design-reference/pezzi.jsx, funzione Titolo (righe 13-21):
  // quattro livelli di titolo, ciascuno con il proprio font, tracking e tag
  // HTML risultante. "as" permette di forzare il tag (es. un h1 di pagina
  // reso come h2 quando non e' il primo titolo della pagina); di default il
  // tag segue il livello, esattamente come in F/L/Tag del sorgente.
  import type { Snippet } from 'svelte'

  let {
    livello = 'sezione' as 'hero' | 'pagina' | 'sezione' | 'piccolo',
    tone = undefined as 'invert' | undefined,
    style = '',
    as = undefined as string | undefined,
    children,
  }: {
    livello?: 'hero' | 'pagina' | 'sezione' | 'piccolo'
    tone?: 'invert'
    style?: string
    as?: string
    children?: Snippet
  } = $props()

  const F = {
    hero: 'var(--fw-black) var(--fs-display-xl)/var(--lh-display-xl) var(--font-display)',
    pagina: 'var(--fw-bold) var(--fs-display-l)/var(--lh-display-l) var(--font-display)',
    sezione: 'var(--type-section)',
    piccolo: 'var(--fw-bold) var(--fs-title-m)/var(--lh-title-m) var(--font-display)',
  } as const

  const L = {
    hero: 'var(--ls-display-xl)',
    pagina: 'var(--ls-display-l)',
    sezione: 'var(--ls-display-m)',
    piccolo: 'var(--ls-title-m)',
  } as const

  const tag = $derived(
    as ?? (livello === 'hero' || livello === 'pagina' ? 'h1' : livello === 'sezione' ? 'h2' : 'h3'),
  )
</script>

<svelte:element
  this={tag}
  style="font:{F[livello]};letter-spacing:{L[livello]};color:{tone === 'invert'
    ? 'var(--text-invert)'
    : 'var(--text-strong)'};text-wrap:pretty;{style}"
>{@render children?.()}</svelte:element>
