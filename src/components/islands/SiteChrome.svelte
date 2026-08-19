<script lang="ts">
  // Isola unica dello chrome del sito. Porting di design-reference/guscio.jsx,
  // funzione App() (righe 96-162): anteprima rapida (quick-view), dialog
  // "Chiedi una carta" (DettagliChiedi) e contenitore dei toast. Il menu
  // mobile NON e' qui: e' un <details> nativo in NavBar.astro (vedi §6.4
  // della spec — un utente puo' aprirlo prima che quest'isola idrati, e cosi'
  // funziona sempre, JS o non JS). Stesso motivo per cui il bottone "Chiedi
  // una carta" e' cablato da un piccolo script inline in NavBar.astro: scrive
  // direttamente nello store condiviso, cosi' un click arrivato prima
  // dell'idratazione non va perso (resta nello stato del modulo, e questa
  // isola lo trova gia' pronto non appena monta), a differenza del contatore
  // dello spike del Task 2 che non aveva nulla in cui "atterrare" prima del
  // mount.
  import Dialog from '../ds/Dialog.svelte'
  import Sheet from '../ds/Sheet.svelte'
  import Toast from '../ds/Toast.svelte'
  import Button from '../ds/Button.svelte'
  import Icon from '../ds/Icon.svelte'
  import CardArt from '../ds/CardArt.svelte'
  import RarityBadge from '../ds/RarityBadge.svelte'
  import ConditionBadge from '../ds/ConditionBadge.svelte'
  import { chiedi, quick, toast as toastStore, chiudiChiedi, chiudiQuick, apriChiedi, avviso } from '~/stores/chrome'
  // Import diretto da labels/types, non dal barrel '~/lib/catalog': quel
  // barrel ri-esporta anche source.static.astro.ts, che importa astro:content
  // — un modulo server-only che rompe la build se finisce nel bundle client
  // di questa isola.
  import { cardCode } from '~/lib/catalog/labels'
  import type { CardSet } from '~/lib/catalog/types'
  import { SITE } from '~/config/site'

  // Il set di una carta serve per il codice (es. "ALB 042/198") e per il nome
  // dell'espansione nella quick-view: la pagina che monta il layout li
  // conosce gia' (content collection), l'isola no — glieli passa Base.astro.
  let { sets = [] as CardSet[] } = $props()

  // guscio.jsx riga 97: const mobile = useMedia("(max-width:1080px)").
  let mobile = $state(false)
  $effect(() => {
    const mq = matchMedia('(max-width:1080px)')
    const sync = () => (mobile = mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  })

  const setOf = (id: string): CardSet | null => sets.find((s) => s.id === id) ?? null

  // guscio.jsx riga 152-155: chiedi&&chiedi.name distingue "richiesta con
  // carta" da "richiesta generica" (chiedi===true). Qui chiedi e' un oggetto
  // Card solo quando non e' ne' null ne' il booleano true.
  const chiediCarta = $derived($chiedi && typeof $chiedi === 'object' ? $chiedi : null)
  const chiediAperto = $derived($chiedi !== null)
  const chiediTitolo = $derived(chiediCarta ? chiediCarta.name : 'Chiedi una carta')
  const chiediSet = $derived(chiediCarta ? setOf(chiediCarta.set) : null)

  // guscio.jsx riga 80, testo esatto (apostrofi e accenti compresi).
  const messaggio = $derived(
    chiediCarta && chiediSet
      ? `Ciao, ho visto ${chiediCarta.name} (${cardCode(chiediCarta, chiediSet)}) sul sito. È ancora in vetrina?`
      : 'Ciao, sto cercando una carta. La avete in vetrina?',
  )

  // guscio.jsx riga 112.
  function copia(testo: string) {
    navigator.clipboard?.writeText(testo)
    avviso('Messaggio copiato', 'Incollalo su Instagram o WhatsApp.')
  }

  const quickSet = $derived($quick ? setOf($quick.set) : null)
  const quickCodice = $derived($quick && quickSet ? cardCode($quick, quickSet) : '')

  // guscio.jsx riga 127: chiude la quick-view e apre "Chiedi" sulla stessa carta.
  function chiediDaQuick() {
    if ($quick) apriChiedi($quick)
    chiudiQuick()
  }

  // Il brief dello store definisce Toast.tone come 'success' | 'info' (il
  // prototipo non usa mai 'info' — entrambe le chiamate ad avviso() nel
  // sorgente omettono il tono e ricadono su 'success'); Toast.svelte parla
  // invece 'neutral' | 'success' | 'brand' | 'danger'. 'neutral' e' il tono
  // piu' vicino a 'info': stessa icona (info), sfondo scuro neutro.
  const TONE_MAP = { success: 'success', info: 'neutral' } as const
</script>

{#snippet contenutoChiedi()}
  <div style="display:grid;gap:var(--sp-5)">
    <p
      style="font:var(--type-body);font-size:var(--fs-body-m);line-height:var(--lh-body-m);color:var(--text-muted);max-width:62ch;text-wrap:pretty"
    >
      Scrivici e ti diciamo se è ancora in vetrina. Rispondiamo negli orari di apertura, di solito in giornata.
    </p>
    <div
      style="display:grid;gap:var(--sp-2);padding:var(--sp-4);background:var(--surface-sunken);border-radius:var(--r-md);border:1px solid var(--border-hairline)"
    >
      <span
        style="font:var(--type-eyebrow);letter-spacing:var(--ls-eyebrow);text-transform:uppercase;color:var(--text-muted)"
        >Messaggio pronto</span
      >
      <span style="font:var(--type-code);font-size:var(--fs-body-s);color:var(--text-body);line-height:1.6"
        >{messaggio}</span
      >
      <div>
        <Button size="sm" variant="secondary" onclick={() => copia(messaggio)}>
          {#snippet icon()}<Icon name="share-2" size={16} />{/snippet}
          Copia il messaggio
        </Button>
      </div>
    </div>
    <div style="display:grid;gap:var(--sp-2)">
      {#each SITE.social as s (s.id)}
        <Button as="a" href={s.href} fullWidth variant={s.id === SITE.social[0]?.id ? 'primary' : 'secondary'} style="justify-content:flex-start">
          {#snippet icon()}<Icon name={s.icon} size={16} />{/snippet}
          {s.label} · {s.valore}
          {#snippet iconRight()}<Icon name="arrow-right" size={16} style="margin-left:auto" />{/snippet}
        </Button>
      {/each}
    </div>
  </div>
{/snippet}

{#snippet anteprimaQuick()}
  {#if $quick}
    <div style="display:flex;gap:var(--sp-5);flex-wrap:{mobile ? 'wrap' : 'nowrap'}">
      <div style="width:{mobile ? 120 : 150}px;flex:none">
        <CardArt rarity={$quick.rarity} code={quickCodice} />
      </div>
      <dl class="ds-speclist" style="flex:1;min-width:180px">
        <div class="ds-speclist__row">
          <dt class="ds-speclist__dt">Codice</dt>
          <dd class="ds-speclist__dd ds-speclist__dd--mono">{quickCodice}</dd>
        </div>
        <div class="ds-speclist__row ds-speclist__row--rule">
          <dt class="ds-speclist__dt">Espansione</dt>
          <dd class="ds-speclist__dd">{quickSet?.name ?? ''}</dd>
        </div>
        <div class="ds-speclist__row ds-speclist__row--rule">
          <dt class="ds-speclist__dt">Rarità</dt>
          <dd class="ds-speclist__dd"><RarityBadge rarity={$quick.rarity} size="sm" /></dd>
        </div>
        <div class="ds-speclist__row ds-speclist__row--rule">
          <dt class="ds-speclist__dt">Condizione</dt>
          <dd class="ds-speclist__dd"><ConditionBadge condition={$quick.cond} compact /></dd>
        </div>
        <div class="ds-speclist__row ds-speclist__row--rule">
          <dt class="ds-speclist__dt">Lingua</dt>
          <dd class="ds-speclist__dd">{$quick.lang}</dd>
        </div>
        <div class="ds-speclist__row ds-speclist__row--rule">
          <dt class="ds-speclist__dt">In vetrina</dt>
          <dd class="ds-speclist__dd">vetrina {$quick.vetrina}</dd>
        </div>
      </dl>
    </div>
  {/if}
{/snippet}

{#snippet azioniQuick()}
  <Button variant="secondary" onclick={chiediDaQuick}>Chiedila in negozio</Button>
  <Button as="a" href={$quick ? `/carta/${$quick.slug}` : '#'}>Vedi la scheda</Button>
{/snippet}

{#if mobile}
  <Sheet open={chiediAperto} title={chiediTitolo} onclose={chiudiChiedi}>
    {#snippet children()}{@render contenutoChiedi()}{/snippet}
  </Sheet>
{:else}
  <Dialog open={chiediAperto} eyebrow="Chiedi in negozio" title={chiediTitolo} onclose={chiudiChiedi} width={520}>
    {#snippet children()}{@render contenutoChiedi()}{/snippet}
  </Dialog>
{/if}

{#if mobile}
  <Sheet open={$quick !== null} title={$quick?.name ?? ''} onclose={chiudiQuick}>
    {#snippet children()}{@render anteprimaQuick()}{/snippet}
    {#snippet footer()}{@render azioniQuick()}{/snippet}
  </Sheet>
{:else}
  <Dialog
    open={$quick !== null}
    title={$quick?.name ?? ''}
    eyebrow={quickSet?.name ?? ''}
    onclose={chiudiQuick}
    width={620}
  >
    {#snippet children()}{@render anteprimaQuick()}{/snippet}
    {#snippet footer()}{@render azioniQuick()}{/snippet}
  </Dialog>
{/if}

<div
  style="position:fixed;right:{mobile ? 'var(--sp-4)' : 'var(--sp-6)'};left:{mobile
    ? 'var(--sp-4)'
    : 'auto'};bottom:var(--sp-6);z-index:95;display:grid;gap:10px;opacity:{$toastStore
    ? 1
    : 0};transform:{$toastStore
    ? 'translateY(0)'
    : 'translateY(12px)'};transition:opacity var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-spring);pointer-events:{$toastStore
    ? 'auto'
    : 'none'}"
>
  {#if $toastStore}
    <Toast
      tone={TONE_MAP[$toastStore.tone]}
      title={$toastStore.title}
      description={$toastStore.description}
      onclose={() => toastStore.set(null)}
    />
  {/if}
</div>
