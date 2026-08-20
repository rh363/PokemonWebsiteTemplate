// Carica una cartella locale di foto (fuori dal repository, o ignorata da
// git — vedi /foto-carte/ in .gitignore) sul bucket R2, usando come chiave
// R2 il nome del file. Task 23: le foto non entrano mai in git.
import { execFileSync } from 'node:child_process'
import { readdirSync } from 'node:fs'
import { join } from 'node:path'

const cartella = process.argv[2]
// Sovrascrivibile con R2_BUCKET: e' il nome del bucket sull'account
// Cloudflare di chi pubblica, non un dato del progetto.
const bucket = process.env.R2_BUCKET || 'cartafolia-carte'
if (!cartella) throw new Error('uso: pnpm upload:img <cartella>')

const file = readdirSync(cartella).filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f))
for (const f of file) {
  execFileSync(
    'pnpm',
    ['exec', 'wrangler', 'r2', 'object', 'put', `${bucket}/${f}`, '--file', join(cartella, f), '--remote'],
    { stdio: 'inherit' },
  )
  console.log('caricato', f)
}
console.log(`${file.length} immagini caricate. Scrivi i nomi nella colonna image di cards.csv.`)
