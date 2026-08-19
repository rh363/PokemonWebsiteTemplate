<script lang="ts">
  import Icon from './Icon.svelte'

  type Suggerimento = string | { label: string; meta?: string | number }

  // Fedele a bundle:1483-1596, con due miglioramenti dichiarati dal task 11:
  // 1) navigazione da tastiera (frecce/Invio/Esc) fra i suggerimenti, assente
  //    nel prototipo; 2) la scelta avviene su pointerdown con preventDefault
  //    (il focus non lascia mai il campo), al posto del setTimeout su blur
  //    del sorgente — che era una corsa fra blur e click. Ogni valore di
  //    stile resta identico al sorgente.
  let {
    value = '',
    oninput = undefined as ((e: Event) => void) | undefined,
    onclear = undefined as ((e: MouseEvent) => void) | undefined,
    placeholder = "Cerca una carta, un'espansione, un artista…",
    size = 'lg' as 'md' | 'lg',
    suggestions = [] as Suggerimento[],
    onpick = undefined as ((s: Suggerimento) => void) | undefined,
    style = '',
    ...rest
  } = $props()

  // Id stabile per questa istanza, usato da aria-controls/aria-activedescendant.
  const uid = `sf-${Math.random().toString(36).slice(2, 9)}`

  let focused = $state(false)
  let activeIndex = $state(-1)
  let closedByEsc = $state(false)

  const open = $derived(focused && !closedByEsc && suggestions.length > 0)

  function handleInput(e: Event) {
    closedByEsc = false
    activeIndex = -1
    oninput?.(e)
  }

  function handleFocus() {
    focused = true
    closedByEsc = false
  }

  function handleBlur() {
    // Nessun setTimeout: la selezione via pointerdown (sotto) intercetta e
    // annulla l'evento prima che il blur possa correre contro il click.
    focused = false
  }

  function pick(s: Suggerimento) {
    onpick?.(s)
  }

  function handleKeydown(e: KeyboardEvent) {
    if (!suggestions.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      closedByEsc = false
      activeIndex = Math.min(activeIndex + 1, suggestions.length - 1)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      closedByEsc = false
      activeIndex = Math.max(activeIndex - 1, 0)
    } else if (e.key === 'Enter') {
      if (open && activeIndex >= 0) {
        e.preventDefault()
        pick(suggestions[activeIndex])
      }
    } else if (e.key === 'Escape') {
      if (open) {
        e.preventDefault()
        closedByEsc = true
      }
    }
  }
</script>

<div class="ds-search" data-size={size} style={style}>
  <div class="ds-search__bar" class:is-focus={focused}>
    <span class="ds-search__icon"><Icon name="search" size={size === 'lg' ? 20 : 18} /></span>
    <input
      class="ds-search__input"
      type="text"
      role="combobox"
      aria-expanded={open}
      aria-controls={`${uid}-list`}
      aria-activedescendant={activeIndex >= 0 ? `${uid}-opt-${activeIndex}` : undefined}
      {value}
      {placeholder}
      oninput={handleInput}
      onfocus={handleFocus}
      onblur={handleBlur}
      onkeydown={handleKeydown}
      {...rest}
    />
    {#if value}
      <button type="button" class="ds-search__clear" onclick={onclear} aria-label="Cancella ricerca">
        <Icon name="x" size={18} />
      </button>
    {/if}
  </div>
  {#if open}
    <div class="ds-search__panel" id={`${uid}-list`} role="listbox">
      {#each suggestions as s, i (i)}
        <button
          type="button"
          id={`${uid}-opt-${i}`}
          role="option"
          aria-selected={i === activeIndex}
          class="ds-search__opt"
          class:is-active={i === activeIndex}
          onpointerdown={(e) => {
            e.preventDefault()
            pick(s)
          }}
        >
          <Icon name="sparkles" size={14} style="color:var(--cyan-600)" />
          <span>{typeof s === 'string' ? s : s.label}</span>
          {#if typeof s !== 'string' && s.meta != null}
            <span class="ds-search__meta">{s.meta}</span>
          {/if}
        </button>
      {/each}
    </div>
  {/if}
</div>
