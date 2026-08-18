import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { createPick, createRng } from '../src/lib/demo/prng'
import type { Card, CardSet, Condition, Rarity } from '../src/lib/catalog/types'

const SETS: CardSet[] = [
  { id: 'alb', name: 'Alba Cromatica', code: 'ALB', year: 2024, total: 198, color: 'var(--cherry-500)' },
  { id: 'eco', name: 'Eco del Vulcano', code: 'ECO', year: 2024, total: 165, color: 'var(--lemon-500)' },
  { id: 'mar', name: 'Marea Silente', code: 'MAR', year: 2023, total: 172, color: 'var(--cyan-500)' },
  { id: 'rad', name: 'Radici Profonde', code: 'RAD', year: 2023, total: 154, color: 'var(--lime-500)' },
  { id: 'cie', name: 'Cieli Spezzati', code: 'CIE', year: 2022, total: 189, color: 'var(--grape-500)' },
  { id: 'for', name: 'Fornace Antica', code: 'FOR', year: 1999, total: 102, color: 'var(--ink-500)' },
]

const NOMI = ['Fulmine','Guardiano','Ala','Serpe','Riccio','Scudo','Volpe','Coleottero','Lupo','Rana','Falco','Tartaruga','Cervo','Salamandra','Gufo','Tasso','Corvo','Lince','Granchio','Pipistrello','Ariete','Talpa','Cavalletta','Anguilla','Istrice']
const QUAL = ['di Notte',"di Bosco",'di Cenere','di Marea','di Quarzo','di Bruma',"d'Ottone",'di Vetro','di Pioggia','di Sale','di Ferro',"d'Ambra",'di Nebbia','di Brace','di Sabbia',"d'Argento",'di Pietra','Cremisi','Solare','di Lampo']
const RAR: Rarity[] = ['common','common','common','common','uncommon','uncommon','uncommon','rare','rare','holo','holo','ultra','secret']
const COND: Condition[] = ['mint','near-mint','near-mint','excellent','excellent','good','good','played']
const LANG = ['Italiano','Italiano','Italiano','Italiano','Inglese','Inglese','Giapponese']
const ART = ['M. Ferretti','S. Adani','L. Bonetti','G. Prandi','R. Colella','ignoto']
const MESI = ['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','settembre','ottobre','novembre']

const slugify = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '')
   .toLowerCase().replace(/['’]/g, '-').replace(/[^a-z0-9]+/g, '-')
   .replace(/^-+|-+$/g, '')

const rnd = createRng(7)
const pick = createPick(rnd)

const cards: Card[] = []
const visti = new Set<string>()
while (cards.length < 100) {
  const name = `${pick(NOMI)} ${pick(QUAL)}`
  if (visti.has(name)) continue
  visti.add(name)
  const s = pick(SETS)
  const n = 1 + Math.floor(rnd() * s.total)
  const i = cards.length + 1
  const num = `${String(n).padStart(3, '0')}/${s.total}`
  cards.push({
    id: String(i),
    slug: `${slugify(name)}-${s.code.toLowerCase()}-${String(n).padStart(3, '0')}`,
    name, set: s.id, num,
    rarity: pick(RAR), cond: pick(COND), lang: pick(LANG), artist: pick(ART),
    nuovo: i <= 9,
    vetrina: 1 + Math.floor(rnd() * 4),
    entrata: `${1 + Math.floor(rnd() * 27)} ${pick(MESI)}`,
    ordine: Math.floor(rnd() * 1000),
  })
}

const slugs = new Set(cards.map((c) => c.slug))
if (slugs.size !== cards.length) throw new Error('slug duplicati fra le carte demo')

const COLONNE = [
  'id','slug','name','set','num','rarity','cond','lang','artist',
  'nuovo','vetrina','entrata','ordine','image',
] as const

/** Virgolette solo dove servono: virgola, virgoletta o a capo nel valore. */
const cella = (v: unknown) => {
  const t = v == null ? '' : String(v)
  return /[",\n]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t
}

mkdirSync('src/content', { recursive: true })
writeFileSync('src/content/sets.json', JSON.stringify(SETS, null, 2) + '\n')
writeFileSync(
  'src/content/cards.csv',
  [COLONNE.join(','), ...cards.map((c) => COLONNE.map((k) => cella((c as any)[k])).join(','))]
    .join('\n') + '\n',
)
console.log(`generate ${cards.length} carte e ${SETS.length} espansioni`)
