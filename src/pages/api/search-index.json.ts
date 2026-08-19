import type { APIRoute } from 'astro'
import { buildSearchPayload, getAllCards, getAllSets } from '~/lib/catalog'

/** File separato da catalog.json: la griglia ha bisogno del catalogo subito,
 *  l'indice di ricerca serve solo quando l'utente scrive nel campo cerca. */
export const GET: APIRoute = async () => {
  const [cards, sets] = await Promise.all([getAllCards(), getAllSets()])
  return new Response(JSON.stringify(buildSearchPayload(cards, sets)), {
    headers: { 'content-type': 'application/json' },
  })
}
