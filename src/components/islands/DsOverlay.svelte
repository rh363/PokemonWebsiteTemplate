<script lang="ts">
  // Isola di verifica per il Task 12: Dialog, Sheet e Toast hanno stato vero
  // (open) e vanno esercitati con mouse e tastiera per controllare focus trap,
  // Escape e ripristino del focus. I tre componenti restano senza client: in
  // src/components/ds/ — l'idratazione vive soltanto qui.
  import Dialog from '../ds/Dialog.svelte'
  import Sheet from '../ds/Sheet.svelte'
  import Toast from '../ds/Toast.svelte'
  import Button from '../ds/Button.svelte'

  let dialogOpen = $state(false)
  let sheetOpen = $state(false)
  let toastTono = $state<'neutral' | 'success' | 'brand' | 'danger' | null>(null)
  let toastTimer: ReturnType<typeof setTimeout> | undefined

  function mostraToast(tono: 'neutral' | 'success' | 'brand' | 'danger') {
    toastTono = tono
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => {
      toastTono = null
    }, 2800)
  }
</script>

<div style="display:flex;gap:var(--sp-3);flex-wrap:wrap;align-items:center">
  <Button id="dialog-trigger" onclick={() => (dialogOpen = true)}>Apri Dialog</Button>
  <Button id="sheet-trigger" variant="secondary" onclick={() => (sheetOpen = true)}>Apri Sheet</Button>
  <Button variant="ghost" onclick={() => mostraToast('neutral')}>Toast neutral</Button>
  <Button variant="ghost" onclick={() => mostraToast('success')}>Toast success</Button>
  <Button variant="ghost" onclick={() => mostraToast('brand')}>Toast brand</Button>
  <Button variant="ghost" onclick={() => mostraToast('danger')}>Toast danger</Button>
</div>

<Dialog
  open={dialogOpen}
  eyebrow="Alba Cromatica"
  title="Charizard ex 042/198"
  width={620}
  onclose={() => (dialogOpen = false)}
  style="max-width:360px"
>
  {#snippet children()}
    <p>Prova: Tab non deve uscire dal dialog; Escape lo chiude; alla chiusura il focus torna su "Apri Dialog".</p>
  {/snippet}
  {#snippet footer()}
    <Button variant="secondary" onclick={() => (dialogOpen = false)}>Chiedila in negozio</Button>
    <Button onclick={() => (dialogOpen = false)}>Vedi la scheda</Button>
  {/snippet}
</Dialog>

<Sheet open={sheetOpen} title="Charizard ex 042/198" onclose={() => (sheetOpen = false)} style="border-top-color:#1454FF">
  {#snippet children()}
    <p>Su viewport stretto sale dal basso con l'animazione sheetUp e mostra la maniglia in alto.</p>
  {/snippet}
  {#snippet footer()}
    <Button variant="secondary" onclick={() => (sheetOpen = false)}>Chiedila in negozio</Button>
    <Button onclick={() => (sheetOpen = false)}>Vedi la scheda</Button>
  {/snippet}
</Sheet>

<div style="position:fixed;right:var(--sp-6);bottom:var(--sp-6);z-index:95">
  {#if toastTono}
    <Toast
      tone={toastTono}
      title="Messaggio copiato"
      description="Incollalo su Instagram o WhatsApp."
      onclose={() => (toastTono = null)}
    />
  {/if}
</div>
