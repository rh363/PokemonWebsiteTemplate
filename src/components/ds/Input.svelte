<script lang="ts">
  import type { Snippet } from 'svelte'

  type Dimensione = 'sm' | 'md' | 'lg'

  // Fedele a bundle:1411-1482 — focus era uno useState che ricalcolava
  // border-color e boxShadow: qui diventa :focus-within sul contenitore
  // (.ds-input__field), niente JavaScript necessario.
  let {
    label = undefined as string | undefined,
    hint = undefined as string | undefined,
    error = undefined as string | undefined,
    icon = undefined as Snippet | undefined,
    suffix = undefined as Snippet | undefined,
    size = 'md' as Dimensione,
    disabled = false,
    style = '',
    ...rest
  } = $props()
</script>

<label class="ds-input" data-size={size} style={style}>
  {#if label}
    <span class="ds-input__label">{label}</span>
  {/if}
  <span class="ds-input__field" class:is-error={!!error} class:is-disabled={disabled}>
    {@render icon?.()}
    <input class="ds-input__control" {disabled} {...rest} />
    {@render suffix?.()}
  </span>
  {#if hint || error}
    <span class="ds-input__msg" class:is-error={!!error}>{error || hint}</span>
  {/if}
</label>
