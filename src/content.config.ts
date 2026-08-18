import { defineCollection, z } from 'astro:content'
import { file } from 'astro/loaders'
import { csvLoader } from '~/lib/catalog/csv-loader'

const rarity = z.enum(['common', 'uncommon', 'rare', 'holo', 'ultra', 'secret'])
const condition = z.enum(['mint', 'near-mint', 'excellent', 'good', 'played'])

// Intero obbligatorio da cella CSV: una cella vuota o solo spazi non deve
// coercere silenziosamente a 0 (Number('') === 0), deve fallire il build.
const interoObbligatorio = z.string().trim().min(1, 'cella vuota').transform((v, ctx) => {
  const n = Number(v)
  if (!Number.isInteger(n)) {
    ctx.addIssue({ code: 'custom', message: 'deve essere un numero intero' })
    return z.NEVER
  }
  return n
})

const sets = defineCollection({
  loader: file('src/content/sets.json'),
  schema: z.object({
    id: z.string(), name: z.string(), code: z.string(),
    year: z.number().int(), total: z.number().int().positive(), color: z.string(),
  }),
})

const cards = defineCollection({
  // Loader nostro invece di file(): file() intercetta gli errori del parser CSV
  // e li degrada a log, producendo una collection vuota e un build verde.
  // csvLoader rilancia, con il numero di riga, così un CSV malformato ferma il build.
  loader: csvLoader('src/content/cards.csv', 'slug'),
  // Da CSV ogni campo arriva come stringa: z.coerce converte, e un valore
  // non convertibile fa fallire il build indicando la riga.
  schema: z.object({
    id: z.string(), slug: z.string(), name: z.string(), set: z.string(),
    num: z.string(), rarity, cond: condition, lang: z.string(), artist: z.string(),
    nuovo: z.union([z.boolean(), z.enum(['true', 'false'])]).transform((v) => v === true || v === 'true'),
    vetrina: interoObbligatorio,
    entrata: z.string(),
    ordine: interoObbligatorio,
    image: z.string().optional().transform((v) => (v === '' ? undefined : v)),
  }),
})

export const collections = { sets, cards }
