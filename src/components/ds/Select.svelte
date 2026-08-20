<script lang="ts">
  import Icon from './Icon.svelte'

  type Opzione = string | { value: string; label: string }

  // Fedele a bundle:1597-1670 — resta un <select> nativo: accessibile di
  // serie, senza logica di posizionamento. focus era uno useState, qui e'
  // :focus sul <select>.
  let {
    label = undefined as string | undefined,
    value = undefined as string | undefined,
    options = [] as Opzione[],
    onchange = undefined as ((e: Event) => void) | undefined,
    size = 'md' as 'sm' | 'md',
    disabled = false,
    style = '',
    ...rest
  } = $props()
</script>

<label class="ds-select" data-size={size} {style}>
  {#if label}
    <span class="ds-select__label">{label}</span>
  {/if}
  <span class="ds-select__wrap">
    <select class="ds-select__control" {value} {disabled} {onchange} {...rest}>
      {#each options as o (typeof o === 'string' ? o : o.value)}
        <option value={typeof o === 'string' ? o : o.value}
          >{typeof o === 'string' ? o : o.label}</option
        >
      {/each}
    </select>
    <span class="ds-select__chev" aria-hidden="true"><Icon name="chevron-down" size={16} /></span>
  </span>
</label>
