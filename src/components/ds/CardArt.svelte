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
  } = $props()

  const caption = $derived(code == null ? '' : String(code).trim())
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
    <img {src} {alt} class="ds-cardart__img" />
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
