<script lang="ts">
  // Porting di design-reference/pezzi.jsx, funzione TestaSezione (righe
  // 27-36): l'intestazione ricorrente di sezione, occhiello + titolo + testo
  // opzionali con un'azione a destra (es. un bottone), incollati da un
  // flexbox space-between.
  import type { Snippet } from 'svelte'
  import Occhiello from './Occhiello.svelte'
  import Titolo from './Titolo.svelte'
  import Testo from './Testo.svelte'

  let {
    occhiello = undefined as string | undefined,
    titolo,
    testo = undefined as string | undefined,
    azione = undefined as Snippet | undefined,
    tone = undefined as 'invert' | undefined,
    style = '',
  }: {
    occhiello?: string
    titolo: string
    testo?: string
    azione?: Snippet
    tone?: 'invert'
    style?: string
  } = $props()
</script>

<div
  style="display:flex;align-items:flex-end;justify-content:space-between;gap:var(--sp-6);flex-wrap:wrap;margin-bottom:var(--sp-8);{style}"
>
  <div style="display:grid;gap:var(--sp-2)">
    {#if occhiello}<Occhiello {tone}>{occhiello}</Occhiello>{/if}
    <Titolo {tone}>{titolo}</Titolo>
    {#if testo}<Testo {tone}>{testo}</Testo>{/if}
  </div>
  {#if azione}{@render azione()}{/if}
</div>
