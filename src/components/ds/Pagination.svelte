<script lang="ts">
  import Icon from './Icon.svelte'

  // bundle:1908-1992 usava <button onClick> per ogni pagina e per le
  // frecce: nel catalogo diventa navigazione vera, ogni pagina un <a href>,
  // cosi' funziona senza JS ed e' indicizzabile. hrefFor costruisce l'URL
  // per un dato numero di pagina; il default riproduce l'esempio del brief
  // (?p=N), il chiamante lo sovrascrive per altri schemi di query.
  let {
    page = 1,
    pages = 1,
    hrefFor = ((n: number) => `?p=${n}`) as (n: number) => string,
    style = '',
  } = $props()

  const from = $derived(Math.max(1, Math.min(page - 1, pages - 2)))
  const to = $derived(Math.min(pages, from + 2))
  const nums = $derived.by(() => {
    const out: number[] = []
    for (let i = from; i <= to; i++) out.push(i)
    return out
  })
</script>

<div class="ds-pagination" {style}>
  {#if page > 1}
    <a class="ds-pagination__arrow" href={hrefFor(page - 1)} aria-label="Pagina precedente">
      <Icon name="arrow-left" size={16} />
    </a>
  {:else}
    <span class="ds-pagination__arrow is-disabled" aria-disabled="true" aria-label="Pagina precedente">
      <Icon name="arrow-left" size={16} />
    </span>
  {/if}

  {#if from > 1}<span class="ds-pagination__ellipsis">…</span>{/if}

  {#each nums as n (n)}
    <a
      class="ds-pagination__page"
      class:is-current={n === page}
      href={hrefFor(n)}
      aria-current={n === page ? 'page' : undefined}
    >{n}</a>
  {/each}

  {#if to < pages}<span class="ds-pagination__ellipsis">…</span>{/if}
  {#if to < pages}<a class="ds-pagination__page" href={hrefFor(pages)}>{pages}</a>{/if}

  {#if page < pages}
    <a class="ds-pagination__arrow" href={hrefFor(page + 1)} aria-label="Pagina successiva">
      <Icon name="arrow-right" size={16} />
    </a>
  {:else}
    <span class="ds-pagination__arrow is-disabled" aria-disabled="true" aria-label="Pagina successiva">
      <Icon name="arrow-right" size={16} />
    </span>
  {/if}
</div>
