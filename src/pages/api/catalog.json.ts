import type { APIRoute } from 'astro'
import { buildCatalogPayload, getAllCards, getAllSets } from '~/lib/catalog'

/** Seam verso Supabase: l'isola del catalogo fa fetch('/api/catalog.json'),
 *  mai un import diretto della sorgente. Oggi questo endpoint legge le
 *  content collections a build time; domani potra' interrogare un database
 *  senza che l'isola cambi. */
export const GET: APIRoute = async () => {
  const [cards, sets] = await Promise.all([getAllCards(), getAllSets()])
  return new Response(JSON.stringify(buildCatalogPayload(cards, sets)), {
    headers: { 'content-type': 'application/json' },
  })
}
