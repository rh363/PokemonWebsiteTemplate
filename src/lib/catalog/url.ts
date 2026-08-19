import { CONDITION_LABELS, RARITY_LABELS, LANGUAGES, SORT_LABELS } from './labels'
import type { CardQuery, Condition, Rarity, SortKey } from './types'

// La querystring e' input esterno (link condivisi, digitati a mano, vecchi
// preferiti): ogni valore va controllato contro le costanti di labels.ts
// prima di raggiungere i filtri, non passato cosi' com'e' — vedi spec §5.4.
const RARITIES = new Set<string>(Object.keys(RARITY_LABELS))
const CONDITIONS = new Set<string>(Object.keys(CONDITION_LABELS))
const LANGS = new Set<string>(LANGUAGES)
const SORTS = new Set<string>(Object.keys(SORT_LABELS))

const DEFAULT_SORT: SortKey = 'novita'
const DEFAULT_PAGE = 1

/** Stato dei filtri sempre completo (mai `undefined`): ogni chiamante legge
 *  gli otto campi senza doverli difendere con `??`. */
export interface ParsedQuery {
  q: string
  sets: string[]
  rarity: Rarity[]
  cond: Condition[]
  lang: string[]
  foil: boolean
  sort: SortKey
  page: number
}

/** Legge la querystring di /catalogo e la trasforma in stato dei filtri,
 *  scartando ogni valore che non compare nelle costanti del catalogo invece
 *  di fidarsi ciecamente di quello che arriva dall'URL. `set` non ha un
 *  elenco valido qui (le espansioni sono dati, non una costante di
 *  labels.ts): un id inesistente produce semplicemente zero risultati piu'
 *  avanti nella pipeline, senza bisogno di validazione qui. */
export function parseQuery(params: URLSearchParams): ParsedQuery {
  const sort = params.get('sort')
  const page = Number(params.get('p'))
  return {
    q: params.get('q') ?? '',
    sets: params.getAll('set').filter((v) => v !== ''),
    rarity: params.getAll('rar').filter((v): v is Rarity => RARITIES.has(v)),
    cond: params.getAll('cond').filter((v): v is Condition => CONDITIONS.has(v)),
    lang: params.getAll('lang').filter((v) => LANGS.has(v)),
    foil: params.get('foil') === '1',
    sort: sort != null && SORTS.has(sort) ? (sort as SortKey) : DEFAULT_SORT,
    page: Number.isInteger(page) && page >= 1 ? page : DEFAULT_PAGE,
  }
}

/** Inverso di parseQuery: serializza lo stato dei filtri in una querystring,
 *  omettendo ogni campo che e' gia' al suo default per tenere l'URL pulito
 *  (uno /catalogo senza filtri resta /catalogo, non /catalogo?sort=novita&p=1). */
export function toSearchParams(q: Partial<CardQuery>): URLSearchParams {
  const params = new URLSearchParams()
  if (q.q) params.set('q', q.q)
  for (const s of q.sets ?? []) params.append('set', s)
  for (const r of q.rarity ?? []) params.append('rar', r)
  for (const c of q.cond ?? []) params.append('cond', c)
  for (const l of q.lang ?? []) params.append('lang', l)
  if (q.foil) params.set('foil', '1')
  if (q.sort && q.sort !== DEFAULT_SORT) params.set('sort', q.sort)
  if (q.page && q.page !== DEFAULT_PAGE) params.set('p', String(q.page))
  return params
}
