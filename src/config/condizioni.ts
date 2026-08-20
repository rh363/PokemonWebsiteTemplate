import type { Condition } from '~/lib/catalog/types'

/** Nota di condizione mostrata sotto ogni carta in vetrina — porting della
 *  catena a cinque rami di design-reference/carta.jsx (righe 57-61,
 *  `carta.cond==="mint"?...:carta.cond==="near-mint"?...:...`). In config,
 *  non nel markup di src/pages/carta/[slug].astro, così il cliente aggiorna
 *  questi testi senza toccare la pagina. */
export const NOTE_CONDIZIONE: Record<Condition, string> = {
  mint: 'Angoli pieni, superficie senza segni. Non è mai uscita dalla bustina rigida.',
  'near-mint': 'Un micro segno sul bordo, visibile solo in controluce. Centratura buona.',
  excellent: 'Angoli leggermente smussati, fronte pulito. Nessuna piega.',
  good: 'Bordi con qualche sbiancatura e un graffio leggero sul retro.',
  played: "Ha giocato: bordi consumati e una piega d'angolo. Sta in raccoglitore, non in vetrina rigida.",
}
