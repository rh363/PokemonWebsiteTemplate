import { defineConfig } from 'astro/config'
import svelte from '@astrojs/svelte'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  // Da qui escono canonical, og:url, sitemap e i dati strutturati del
  // negozio: e' l'unico punto in cui il dominio compare. Oggi e' il
  // sottodominio workers.dev del deploy; sostituirlo quando il sito passa
  // su un dominio proprio (e ricordarsi che le foto su R2, se attivate,
  // hanno bisogno di quel dominio — vedi docs/CONTENUTI.md).
  site: 'https://pokemonwebsitetemplate.alex-massaroni2004.workers.dev',
  output: 'static',
  integrations: [svelte(), sitemap()],
  build: { inlineStylesheets: 'auto' },
  vite: { resolve: { alias: { '~': new URL('./src', import.meta.url).pathname } } },
})
