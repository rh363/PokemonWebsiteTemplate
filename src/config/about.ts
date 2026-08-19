/** Contenuti della pagina "Chi siamo". Isolati dal markup di
 *  src/pages/chi-siamo.astro cosi' il cliente li aggiorna senza toccare la
 *  pagina. Porting letterale (apostrofi e accenti compresi) delle costanti
 *  PERSONE, PASSI e NOTE_COND e delle quattro tappe della sezione "Storia"
 *  di design-reference/about.jsx. */
import type { Condition } from '~/lib/catalog/types'

export interface Persona {
  iniziali: string
  nome: string
  ruolo: string
}

/** design-reference/about.jsx, costante PERSONE. */
export const PERSONE: Persona[] = [
  {
    iniziali: 'MF',
    nome: 'Marta',
    ruolo: 'Sta al banco e scheda le carte nuove. Se cerchi qualcosa di vintage, chiedi a lei.',
  },
  {
    iniziali: 'DR',
    nome: 'Davide',
    ruolo: 'Apre le buste il martedì, tiene i tornei del giovedì e perde quasi sempre.',
  },
  {
    iniziali: 'GP',
    nome: 'Giulia',
    ruolo: 'Fotografa le carte per il catalogo e decide la condizione quando siamo in dubbio.',
  },
]

export interface Passo {
  numero: string
  titolo: string
  testo: string
}

/** design-reference/about.jsx, costante PASSI. */
export const PASSI: Passo[] = [
  {
    numero: '01',
    titolo: 'Arriva la carta',
    testo: 'Da una busta nuova, da uno scambio o da una collezione che qualcuno porta in negozio.',
  },
  {
    numero: '02',
    titolo: 'La guardiamo in due',
    testo: "Fronte, retro, bordi e centratura. Se non siamo d'accordo sulla condizione, scende di un gradino.",
  },
  {
    numero: '03',
    titolo: 'La fotografiamo',
    testo: 'Luce fredda, fondo carta, proporzione 63×88. La stessa per tutte, così il confronto è onesto.',
  },
  {
    numero: '04',
    titolo: 'Va in vetrina e in catalogo',
    testo: 'Con codice, espansione, lingua e la nota di condizione che leggi nella scheda.',
  },
]

export interface NotaCondizione {
  id: Condition
  testo: string
}

/** design-reference/about.jsx, costante NOTE_COND. */
export const NOTE_COND: NotaCondizione[] = [
  { id: 'mint', testo: 'Nessun segno. Bustina rigida dal primo giorno.' },
  { id: 'near-mint', testo: 'Un micro segno sul bordo, visibile solo in controluce.' },
  { id: 'excellent', testo: 'Angoli appena smussati, fronte pulito.' },
  { id: 'good', testo: 'Bordi sbiancati o un graffio leggero. Si vede, si dichiara.' },
  { id: 'played', testo: 'Ha giocato: pieghe e consumo. Sta in raccoglitore, non in vetrina.' },
]

export interface TappaStoria {
  anno: string
  testo: string
}

/** design-reference/about.jsx, sezione "Storia": array inline nel JSX,
 *  qui nominato per coerenza con le altre costanti della pagina. */
export const STORIA: TappaStoria[] = [
  { anno: '2019', testo: 'Apriamo con due vetrine e i doppioni di casa.' },
  { anno: '2021', testo: "Arriva il tavolo grande. Da lì partono i tornei del giovedì." },
  { anno: '2023', testo: 'Cominciamo a schedare tutto: codice, condizione, foto.' },
  {
    anno: '2026',
    testo: "Il catalogo va online. Il negozio resta l'unico posto dove si compra.",
  },
]
