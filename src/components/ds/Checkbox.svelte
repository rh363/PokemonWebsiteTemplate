<script lang="ts">
  import Icon from './Icon.svelte'

  // Fedele a bundle:1323-1410 — l'<input type="checkbox"> reale e' nascosto
  // visivamente (posizione assoluta, opacita' 0) e il riquadro disegnato gli
  // sta accanto: Tab e Spazio funzionano da soli, senza JavaScript. hover
  // era uno useState: qui e' :hover, ma solo quando non checked — checked
  // vince sempre, anche sotto il mouse (vedi ds.css).
  let {
    checked = false,
    label = undefined as string | undefined,
    description = undefined as string | undefined,
    count = undefined as number | string | undefined,
    disabled = false,
    onchange = undefined as ((e: Event) => void) | undefined,
    style = '',
    ...rest
  } = $props()
</script>

<label
  class="ds-checkbox"
  class:is-checked={checked}
  class:is-disabled={disabled}
  class:has-description={!!description}
  style={style}
>
  <input type="checkbox" class="ds-checkbox__input" {checked} {disabled} {onchange} {...rest} />
  <span class="ds-checkbox__box" aria-hidden="true">
    {#if checked}<Icon name="check" size={14} />{/if}
  </span>
  <span class="ds-checkbox__text">
    <span class="ds-checkbox__label">{label}</span>
    {#if description}
      <span class="ds-checkbox__desc">{description}</span>
    {/if}
  </span>
  {#if count != null}
    <span class="ds-checkbox__count">{count}</span>
  {/if}
</label>
