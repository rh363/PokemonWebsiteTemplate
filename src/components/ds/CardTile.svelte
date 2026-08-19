<script lang="ts">
  // Tessera del catalogo — bundle:755-901. E' l'unico componente del design
  // system che ha davvero bisogno di JavaScript: il tilt segue la posizione
  // del puntatore dentro l'elemento (rotateY/rotateX su x/w e y/h, bundle:775-783),
  // e questo non e' esprimibile in CSS. Tutto il resto dell'hover del sorgente —
  // bordo, ombra, sollevamento, comparsa del bottone "mi piace" — va in CSS
  // (:hover), cosi' la tessera resta corretta anche senza idratazione: senza
  // client:, onmousemove/onmouseenter/onmouseleave non si attaccano mai, rx/ry
  // restano 0 e hover resta false, ma :hover in CSS funziona comunque.
  //
  // sheen e scale del CardArt interno restano legati allo stato `hover` in
  // JS (non a :hover in CSS) perche' CardArt li riceve come valore numerico
  // dentro il proprio style inline (prop `sheen`, bundle:24) — un dato, non
  // uno stato CSS esprimibile dall'esterno. Fedele al bundle: senza JS quella
  // rifinitura foil semplicemente non compare (resta 0/1x, invariata), non e'
  // un difetto: il task la elenca insieme al tilt fra le verifiche "con tilt
  // attivo", non fra quelle "senza idratazione".
  import type { Snippet } from 'svelte'
  import type { Rarity } from '~/lib/catalog'
  import CardArt from './CardArt.svelte'
  import RarityBadge from './RarityBadge.svelte'
  import IconButton from './IconButton.svelte'

  let {
    name = undefined as string | undefined,
    code = undefined as string | number | undefined,
    set = undefined as string | undefined,
    rarity = 'common' as Rarity,
    src = undefined as string | undefined,
    liked = undefined as boolean | undefined,
    onLike = undefined as ((e: MouseEvent) => void) | undefined,
    onclick = undefined as ((e: MouseEvent) => void) | undefined,
    badge = undefined as Snippet | undefined,
    tilt = true,
    style = '',
    ...rest
  }: {
    name?: string
    code?: string | number
    set?: string
    rarity?: Rarity
    src?: string
    liked?: boolean
    onLike?: (e: MouseEvent) => void
    onclick?: (e: MouseEvent) => void
    badge?: Snippet
    tilt?: boolean
    style?: string
    [key: string]: unknown
  } = $props()

  let hover = $state(false)
  let rx = $state(0)
  let ry = $state(0)

  // Letto a runtime, non in build: bundle non lo prevede, e' il task che lo
  // richiede perche' il tilt segue il puntatore e va sospeso per chi chiede
  // meno movimento.
  let ridotto = $state(false)
  $effect(() => {
    if (typeof matchMedia !== 'function') return
    const mq = matchMedia('(prefers-reduced-motion: reduce)')
    const aggiorna = () => {
      ridotto = mq.matches
    }
    aggiorna()
    mq.addEventListener('change', aggiorna)
    return () => mq.removeEventListener('change', aggiorna)
  })

  // Fedele a bundle:775-783. Coefficiente 10: quello della scheda carta
  // (design-reference/carta.jsx) e' 16 col mouse / 14 al tocco — un numero
  // diverso, non va unificato con questo.
  function move(e: MouseEvent) {
    if (!tilt || ridotto) return
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
    ry = ((e.clientX - r.left) / r.width - 0.5) * 10
    rx = -((e.clientY - r.top) / r.height - 0.5) * 10
  }
  function enter() {
    hover = true
  }
  function leave() {
    hover = false
    rx = 0
    ry = 0
  }

  function clickLike(e: MouseEvent) {
    // bundle:834 — ferma la propagazione, altrimenti scatta anche onClick
    // della tessera che lo contiene.
    e.stopPropagation()
    onLike?.(e)
  }
</script>

<div
  class="ds-cardtile"
  class:is-clickable={!!onclick}
  data-card
  {onclick}
  onmousemove={move}
  onmouseenter={enter}
  onmouseleave={leave}
  {style}
  {...rest}
>
  <div class="ds-cardtile__stage">
    <CardArt
      {src}
      alt={name}
      {rarity}
      {code}
      sheen={hover ? 1 : 0}
      style={`transform:rotateX(${rx}deg) rotateY(${ry}deg) scale(${hover ? 1.02 : 1});transform-style:preserve-3d;transition:transform var(--dur-base) var(--ease-out)`}
    />
  </div>
  {#if badge}
    <div class="ds-cardtile__badge">
      {@render badge()}
    </div>
  {/if}
  {#if onLike}
    <div class="ds-cardtile__like" class:is-liked={liked}>
      <IconButton
        icon="heart"
        size="sm"
        variant={liked ? 'brand' : 'secondary'}
        label={liked ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
        onclick={clickLike}
      />
    </div>
  {/if}
  <div class="ds-cardtile__body">
    <div class="ds-cardtile__row">
      <span class="ds-cardtile__name">{name}</span>
      <span class="ds-cardtile__code">{code}</span>
    </div>
    <div class="ds-cardtile__meta">
      <RarityBadge {rarity} size="sm" />
      {#if set}
        <span class="ds-cardtile__set">{set}</span>
      {/if}
    </div>
  </div>
</div>
