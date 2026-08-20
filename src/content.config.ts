import { defineCollection, z } from 'astro:content'
import { file } from 'astro/loaders'
import { csvLoader } from '~/lib/catalog/csv-loader'
import setsRaw from './content/sets.json'

const rarity = z.enum(['common', 'uncommon', 'rare', 'holo', 'ultra', 'secret'])
const condition = z.enum(['mint', 'near-mint', 'excellent', 'good', 'played'])

// Intero obbligatorio da cella CSV: una cella vuota o solo spazi non deve
// coercere silenziosamente a 0 (Number('') === 0), deve fallire il build.
const interoObbligatorio = z
  .string()
  .trim()
  .min(1, 'cella vuota')
  .transform((v, ctx) => {
    const n = Number(v)
    if (!Number.isInteger(n)) {
      ctx.addIssue({ code: 'custom', message: 'deve essere un numero intero' })
      return z.NEVER
    }
    return n
  })

// I2 del giro di fix finale: source.static.astro.ts ordina le carte con
// Number(c.id) — l'invariante "prime carte in cima = arrivi piu' recenti"
// dipende per intero da "id" numerico. Prima di questo fix lo schema
// accettava "id" come z.string() senza controlli: un id non numerico o
// vuoto rendeva il comparatore Number(a)-Number(b) sempre NaN, il sort un
// no-op silenzioso, e l'ordine ricadeva sull'alfabetico dello slug — lo
// stesso guasto che questo helper esiste per evitare. A differenza di
// vetrina/ordine (interoObbligatorio) qui il tipo di output resta stringa
// (Card.id e' string in ~/lib/catalog/types.ts, e Number(c.id) lo riconverte
// dove serve): si valida che il contenuto sia un intero, non si trasforma.
const idNumerico = z
  .string()
  .trim()
  .min(1, 'cella vuota')
  .refine((v) => Number.isInteger(Number(v)), {
    message: 'deve essere un numero intero (l\'ordine dei "nuovi arrivi" dipende da questo)',
  })

// I1 del giro di fix finale: prima di questo fix una carta con "set" che non
// corrispondeva a nessuna espansione di sets.json passava lo schema (era
// solo z.string()), e la riga veniva silenziosamente attribuita alla prima
// espansione da `sets.find(...) ?? sets[0]!` in source.static.astro.ts,
// source.static.ts e carta/[slug].astro — con codice ed etichetta
// dell'espansione sbagliati e nessun errore. Un controllo referenziale qui,
// dove il loader gia' valida ogni riga, rende quel `?? sets[0]!` morto
// invece che portante.
const idEspansioniValide = new Set(setsRaw.map((s) => s.id))
const setValido = z.string().transform((v, ctx) => {
  if (!idEspansioniValide.has(v)) {
    ctx.addIssue({
      code: 'custom',
      message: `colonna "set": "${v}" non è un'espansione in sets.json (id validi: ${[...idEspansioniValide].join(', ')})`,
    })
    return z.NEVER
  }
  return v
})

const sets = defineCollection({
  loader: file('src/content/sets.json'),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    code: z.string(),
    year: z.number().int(),
    total: z.number().int().positive(),
    color: z.string(),
  }),
})

const cards = defineCollection({
  // Loader nostro invece di file(): file() intercetta gli errori del parser CSV
  // e li degrada a log, producendo una collection vuota e un build verde.
  // csvLoader rilancia, con il numero di riga, così un CSV malformato ferma il build.
  // colonneUniche: ['id'] — I2: oltre allo slug (chiave della collection),
  // anche "id" deve essere unico nel file (vedi commento su idNumerico).
  loader: csvLoader('src/content/cards.csv', 'slug', ['id']),
  // Da CSV ogni campo arriva come stringa: z.coerce converte, e un valore
  // non convertibile fa fallire il build indicando la riga.
  schema: z.object({
    id: idNumerico,
    slug: z.string(),
    name: z.string(),
    set: setValido,
    num: z.string(),
    rarity,
    cond: condition,
    lang: z.string(),
    artist: z.string(),
    nuovo: z
      .union([z.boolean(), z.enum(['true', 'false'])])
      .transform((v) => v === true || v === 'true'),
    vetrina: interoObbligatorio,
    entrata: z.string(),
    ordine: interoObbligatorio,
    image: z
      .string()
      .optional()
      .transform((v) => (v === '' ? undefined : v)),
  }),
})

export const collections = { sets, cards }
