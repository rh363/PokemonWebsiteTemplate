<script lang="ts">
  interface SpecItem {
    label: string
    value: unknown
    mono?: boolean
  }

  let { items = [] as SpecItem[], dense = false, style = '' } = $props()
</script>

<dl class="ds-speclist" {style}>
  {#each items as it, i (i)}
    <div
      class="ds-speclist__row"
      class:ds-speclist__row--dense={dense}
      class:ds-speclist__row--rule={i > 0}
    >
      <dt class="ds-speclist__dt">{it.label}</dt>
      <dd class="ds-speclist__dd" class:ds-speclist__dd--mono={it.mono}>{it.value}</dd>
    </div>
  {/each}
</dl>
