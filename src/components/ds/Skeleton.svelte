<script lang="ts">
  let {
    shape = 'line' as 'line' | 'title' | 'circle' | 'card',
    width = '100%' as string | number,
    height = undefined as string | number | undefined,
    count = 1,
    style = '',
  } = $props()

  const h = $derived(height || (shape === 'line' ? 14 : shape === 'title' ? 26 : undefined))
  const items = $derived(Array.from({ length: count }))

  const radius = $derived(
    shape === 'card' ? 'var(--r-cardart)' : shape === 'circle' ? 'var(--r-pill)' : 'var(--r-xs)',
  )

  const boxStyle = (i: number) => {
    const w = shape === 'line' && count > 1 && i === count - 1 ? '70%' : width
    const parts = [`width:${typeof w === 'number' ? `${w}px` : w}`, `border-radius:${radius}`]
    if (shape === 'card') {
      parts.push('aspect-ratio:var(--card-aspect)')
    } else if (h != null) {
      parts.push(`height:${typeof h === 'number' ? `${h}px` : h}`)
    }
    return parts.join(';')
  }
</script>

<div class="ds-skeleton" style={style}>
  {#each items as _, i (i)}
    <div class="ds-skeleton__box" style={boxStyle(i)}></div>
  {/each}
</div>
