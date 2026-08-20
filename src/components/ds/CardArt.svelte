<script lang="ts">
  import type { Rarity } from '~/lib/catalog'

  let {
    src = undefined as string | undefined,
    alt = '',
    rarity = 'common' as Rarity,
    code = undefined as string | number | undefined,
    foil = false,
    sheen = 0,
    radius = 'var(--r-cardart)',
    style = '',
    // Task 23: usati solo quando `src` e' una foto reale (R2). Il ramo
    // placeholder qui sotto non li legge mai, quindi non cambiano nulla
    // finche' src/config/site.ts#immagini resta vuoto.
    loading = 'lazy' as 'lazy' | 'eager',
    fetchpriority = undefined as 'high' | 'low' | 'auto' | undefined,
  } = $props()

  // Fedele a bundle:24 — un code non-stringa e falsy (0, NaN) rende stringa vuota.
  const caption = $derived(
    typeof code === 'string' ? code.trim() : code ? String(code) : '',
  )
  const isFoil = $derived(
    foil || rarity === 'holo' || rarity === 'ultra' || rarity === 'secret',
  )
</script>

<div
  class="ds-cardart"
  class:is-foil={isFoil}
  style="border-radius:{radius};{style}"
>
  {#if src}
    <img {src} {alt} class="ds-cardart__img" {loading} {fetchpriority} decoding="async" />
  {:else}
    <div class="ds-cardart__ph">
      <span class="ds-cardart__code">{caption}</span>
    </div>
  {/if}
  <div
    aria-hidden="true"
    class="ds-cardart__sheen"
    style="opacity:{sheen};transform:translateX({-60 + sheen * 120}%)"
  ></div>
</div>
