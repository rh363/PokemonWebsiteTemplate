<script lang="ts">
  // Fedele a bundle:1671-1736 — stessa costruzione di Checkbox: un vero
  // <input type="checkbox" role="switch"> nascosto, con track e pomello
  // disegnati accanto. Il sorgente non ha alcuno stato hover per il track:
  // la porta non ne aggiunge uno, quindi non c'e' conflitto checked/hover
  // da risolvere qui (a differenza di Checkbox).
  let {
    checked = false,
    label = undefined as string | undefined,
    onchange = undefined as ((e: Event) => void) | undefined,
    disabled = false,
    style = '',
    ...rest
  } = $props()
</script>

<label class="ds-switch" class:is-disabled={disabled} style={style}>
  <input
    type="checkbox"
    role="switch"
    class="ds-switch__input"
    {checked}
    {disabled}
    {onchange}
    {...rest}
  />
  <span class="ds-switch__track" class:is-checked={checked} aria-hidden="true">
    <span class="ds-switch__thumb"></span>
  </span>
  {#if label}
    <span class="ds-switch__label">{label}</span>
  {/if}
</label>
