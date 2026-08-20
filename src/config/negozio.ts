/** Contenuti della pagina "Il negozio". Isolati dal markup di
 *  src/pages/negozio.astro cosi' il cliente li aggiorna senza toccare la
 *  pagina. Porting letterale dell'array inline della sezione "In negozio" di
 *  design-reference/negozio.jsx (righe 68-71). Indirizzo, orari e social
 *  restano in ~/config/site.ts: sono dati anagrafici del negozio, non copy
 *  di questa sezione. */
export interface VoceInNegozio {
  titolo: string
  testo: string
}

/** design-reference/negozio.jsx, sezione "In negozio". */
export const IN_NEGOZIO: VoceInNegozio[] = [
  {
    titolo: 'Il tavolo grande',
    testo: 'Sei posti, sempre liberi. Si gioca, si scambia, si guardano le carte con calma.',
  },
  {
    titolo: 'Le due vetrine',
    testo: 'Le carte del catalogo stanno qui, sotto vetro, in ordine di espansione.',
  },
  {
    titolo: 'Bustine nuove',
    testo: 'Arrivano il martedì. Le apriamo alle 17:00 e finiscono in catalogo la sera stessa.',
  },
  {
    titolo: 'Valutazioni',
    testo: "Porti la tua collezione, la guardiamo insieme e ti diciamo com'è messa. Gratis.",
  },
]
