import { defineConfig } from 'vitest/config'

// Senza questo file vitest raccoglie anche e2e/*.spec.ts (il suo pattern di
// default e' **/*.spec.ts) e prova a eseguirli come test unitari: falliscono
// perche' usano i fixture di Playwright (page, browser...), non i suoi. I
// due runner restano su cartelle separate — Playwright gia' punta solo a
// ./e2e (playwright.config.ts) — qui si esclude quella cartella da vitest.
export default defineConfig({
  test: {
    exclude: ['**/node_modules/**', '**/dist/**', '**/.astro/**', 'e2e/**'],
  },
})
