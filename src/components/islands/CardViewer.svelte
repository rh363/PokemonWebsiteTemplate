<script lang="ts">
  // Isola del tilt 3D della scheda carta — porting di
  // design-reference/carta.jsx, funzione SchedaCarta (righe 8-9 e 15-19).
  // Avvolge SOLO il CardArt grande: il resto della pagina (testo, badge,
  // pannelli, correlate) e' HTML statico reso da src/pages/carta/[slug].astro.
  //
  // Riceve rarity e code come stringhe semplici, non la Card intera — sono i
  // soli due dati che CardArt consuma (bundle:24). Il tipo Rarity viene da
  // ~/lib/catalog/types, non dal barrel ~/lib/catalog: quel barrel
  // ri-esporta source.static.astro.ts, che importa astro:content — un
  // modulo server-only che romperebbe la build se finisse nel bundle
  // client di quest'isola (stesso motivo gia' documentato in
  // SiteChrome.svelte e ~/stores/catalog.ts).
  //
  // Coefficiente 16 col mouse (bundle carta.jsx riga 8), 14 al tocco (riga
  // 9) — diversi dal 10 di ds/CardTile.svelte (bundle:775-783, un altro
  // punto del sorgente): non vanno unificati.
  import CardArt from '../ds/CardArt.svelte'
  import type { Rarity } from '~/lib/catalog/types'

  let { rarity, code }: { rarity: Rarity; code: string } = $props()

  let hover = $state(false)
  let rot = $state({ x: 0, y: 0 })

  // carta.jsx riga 8: const move=e=>{...setRot({y:((e.clientX-r.left)/r.width-.5)*16,x:-((e.clientY-r.top)/r.height-.5)*16})}
  function move(e: MouseEvent) {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
    rot = {
      y: ((e.clientX - r.left) / r.width - 0.5) * 16,
      x: -((e.clientY - r.top) / r.height - 0.5) * 16,
    }
  }

  // carta.jsx riga 9: const tocco=e=>{const t=e.touches[0],...setHover(true);setRot({...*14})}
  function tocco(e: TouchEvent) {
    const t = e.touches[0]
    if (!t) return
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
    hover = true
    rot = {
      y: ((t.clientX - r.left) / r.width - 0.5) * 14,
      x: -((t.clientY - r.top) / r.height - 0.5) * 14,
    }
  }

  function fine() {
    hover = false
    rot = { x: 0, y: 0 }
  }
</script>

<div
  style="perspective:900px"
  onmousemove={move}
  onmouseenter={() => (hover = true)}
  onmouseleave={fine}
  ontouchstart={tocco}
  ontouchmove={tocco}
  ontouchend={fine}
>
  <CardArt
    {rarity}
    {code}
    sheen={hover ? 1 : 0}
    radius="var(--r-lg)"
    style={`transform:rotateX(${rot.x}deg) rotateY(${rot.y}deg) scale(${hover ? 1.03 : 1});transform-style:preserve-3d;transition:transform var(--dur-base) var(--ease-out);box-shadow:${hover ? 'var(--sh-glow-cyan)' : 'var(--sh-2)'}`}
  />
</div>
