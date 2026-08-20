import { defineConfig, devices } from '@playwright/test'

// Smoke test end-to-end sul sito costruito (Task 25). webServer builda e
// serve la versione statica reale — le stesse pagine che finiscono in
// produzione, non il dev server — cosi' il test sulla griglia senza
// JavaScript verifica davvero l'HTML che Astro genera in output:static.
export default defineConfig({
  testDir: './e2e',
  webServer: {
    command: 'pnpm build && pnpm preview',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
  },
  use: { baseURL: 'http://localhost:4321' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    // iPhone 13 usa WebKit di default: qui resta su Chromium (l'unico
    // browser installato in questo ambiente), tenendo viewport/UA/touch
    // del device — il layout responsivo e' quello che serve testare, non
    // il motore.
    { name: 'mobile', use: { ...devices['iPhone 13'], browserName: 'chromium' } },
  ],
})
