// Store condiviso tra le isole di SiteChrome e i trigger sparsi nelle pagine
// (bottoni "Chiedi una carta" in NavBar, quick-view dalle griglie di carte).
// Il meccanismo — un modulo Svelte a livello di applicazione, importato da
// più punti — e' quello verificato dal Task 2 (spike, vedi
// docs/superpowers/specs/2026-08-18-cartafolia-astro-design.md §6.3): due
// import dello stesso URL di modulo risolvono, per specifica ES, alla stessa
// istanza. Vale sia tra due isole Svelte, sia tra un'isola e un <script>
// Astro semplice (§6.4) — sono comunque due import dello stesso modulo.
//
// Solo stato, niente DOM: questo file non tocca mai window/document.
import { writable } from 'svelte/store'
import type { Card } from '~/lib/catalog/types'

export interface Toast {
  title: string
  description: string
  tone: 'success' | 'info'
}

// true = richiesta generica ("Chiedi una carta" senza contesto di una carta
// precisa), un oggetto Card = richiesta nata da una carta specifica, null =
// dialog chiuso. Rispecchia lo stato `chiedi` di design-reference/guscio.jsx.
export const chiedi = writable<Card | true | null>(null)

// La quick-view e' per slug, non per Card intera: dal Task 19 la tessera che
// la apre e' HTML statico con un attributo data-carta="<slug>" — stesso
// schema di data-chiedi-trigger — non un'isola che tiene gia' l'oggetto Card
// in memoria. SiteChrome risolve lo slug in Card interrogando
// /api/catalog.json tramite ~/stores/catalog, la prima volta che serve.
export const quick = writable<string | null>(null)
export const toast = writable<Toast | null>(null)

/** Apre il dialog "Chiedi una carta". Senza argomento (o `true`) e' la
 *  richiesta generica; passando una carta il messaggio precompilato la cita. */
export function apriChiedi(card: Card | true | null = true): void {
  chiedi.set(card)
}

export function chiudiChiedi(): void {
  chiedi.set(null)
}

/** Apre l'anteprima rapida della carta identificata da questo slug. */
export function apriQuick(slug: string): void {
  quick.set(slug)
}

export function chiudiQuick(): void {
  quick.set(null)
}

let timer: ReturnType<typeof setTimeout>

/** design-reference/guscio.jsx, funzione `avviso`: 2800 ms, non 3000. */
export function avviso(title: string, description: string, tone: Toast['tone'] = 'success'): void {
  toast.set({ title, description, tone })
  clearTimeout(timer)
  timer = setTimeout(() => toast.set(null), 2800)
}
