import { defineConfig } from 'astro/config'
import svelte from '@astrojs/svelte'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://cartafolia.example',   // Task 24: sostituire col dominio reale
  output: 'static',
  integrations: [svelte(), sitemap()],
  build: { inlineStylesheets: 'auto' },
  vite: { resolve: { alias: { '~': new URL('./src', import.meta.url).pathname } } },
})
