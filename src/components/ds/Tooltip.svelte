<script lang="ts">
  import type { Snippet } from 'svelte'

  let {
    label = undefined as string | undefined,
    side = 'top' as 'top' | 'bottom' | 'left' | 'right',
    children = undefined as Snippet | undefined,
    style = '',
  } = $props()
</script>

<!--
  bundle:990 — open era useState su mouse enter/leave *e* focus/blur: qui
  serve sia :hover sia :focus-within, altrimenti il Tooltip non si apre da
  tastiera (regola CSS in ds.css).
-->
<span class="ds-tooltip" {style}>
  {@render children?.()}
  <span role="tooltip" class="ds-tooltip__bubble" data-side={side}>{label}</span>
</span>
