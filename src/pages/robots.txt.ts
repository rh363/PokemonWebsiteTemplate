import type { APIRoute } from 'astro'

/** robots.txt come endpoint, non file statico in public/: la Sitemap deve
 *  derivare da Astro.site, cosi' quando il Task 26 sostituisce il dominio
 *  placeholder in astro.config.mjs questo file si aggiorna da solo, invece
 *  di restare disallineato come sarebbe un public/robots.txt scritto a
 *  mano. Stesso principio del canonical in Base.astro. */
export const GET: APIRoute = ({ site }) => {
  const sitemapUrl = new URL('sitemap-index.xml', site)
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl.href}\n`
  return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8' } })
}
