import { readFile } from 'node:fs/promises'
import { parse } from 'csv-parse/sync'
import type { Loader } from 'astro/loaders'

/** Loader CSV che fallisce il build invece di degradare a log.
 *  Il loader file() di Astro cattura gli errori del parser: un CSV malformato
 *  produrrebbe una collection vuota e un build verde. Con { info: true }
 *  csv-parse restituisce anche il numero di riga reale di ogni record, che
 *  regge correttamente le righe vuote in mezzo al file (a differenza di un
 *  contatore basato sull'indice dell'array).
 *
 *  `chiave` e' la colonna usata come id della collection (deve essere unica
 *  per costruzione — Astro non accetterebbe due entry con lo stesso id).
 *  `colonneUniche` (I2 del giro di fix finale) elenca colonne aggiuntive che
 *  devono anch'esse essere uniche nel file ma che NON sono l'id della
 *  collection — es. "id" per cards.csv, dove l'invariante sull'ordine di
 *  source.static.astro.ts (Number(c.id)) dipende da valori distinti. Prima
 *  di questo fix solo `chiave` (slug) era controllata: due carte con lo
 *  stesso "id" passavano senza errore, contraddicendo docs/CONTENUTI.md. */
export function csvLoader(percorso: string, chiave: string, colonneUniche: string[] = []): Loader {
  return {
    name: 'cartafolia:csv',
    load: async ({ store, parseData, logger }) => {
      const testo = await readFile(percorso, 'utf8')
      let righe: { record: Record<string, string>; info: { lines: number } }[]
      try {
        righe = parse(testo, { columns: true, skip_empty_lines: true, bom: true, info: true })
      } catch (e) {
        throw new Error(
          `${percorso} non è leggibile: ${(e as Error).message}\n` +
          `Controlla che ogni riga abbia lo stesso numero di colonne dell'intestazione.`,
          { cause: e },
        )
      }

      if (righe.length === 0) {
        throw new Error(
          `${percorso} non contiene nessuna riga di dati.\n` +
          `Se il file è vuoto o ha solo l'intestazione, il sito non avrebbe nulla da mostrare.`,
        )
      }

      const visti = new Map<string, number>()
      const vistiPerColonna = new Map(colonneUniche.map((c) => [c, new Map<string, number>()]))
      store.clear()
      for (const { record: riga, info } of righe) {
        const id = riga[chiave]
        if (!id) throw new Error(`${percorso}, riga ${info.lines}: colonna "${chiave}" vuota`)
        const gia = visti.get(id)
        if (gia !== undefined) {
          throw new Error(
            `${percorso}, riga ${info.lines}: "${chiave}" duplicato — "${id}" compare già alla riga ${gia}.\n` +
            `Ogni carta deve avere uno slug diverso.`,
          )
        }
        visti.set(id, info.lines)

        for (const colonna of colonneUniche) {
          const valore = riga[colonna]
          const visti2 = vistiPerColonna.get(colonna)!
          const giaVisto = valore ? visti2.get(valore) : undefined
          if (giaVisto !== undefined) {
            throw new Error(
              `${percorso}, riga ${info.lines}: colonna "${colonna}" duplicata — "${valore}" compare già alla riga ${giaVisto}.\n` +
              `Due carte non possono avere lo stesso valore in questa colonna.`,
            )
          }
          if (valore) visti2.set(valore, info.lines)
        }

        try {
          store.set({ id, data: await parseData({ id, data: riga }) })
        } catch (e) {
          throw new Error(`${percorso}, riga ${info.lines}: ${(e as Error).message}`, { cause: e })
        }
      }
      logger.info(`${righe.length} righe caricate da ${percorso}`)
    },
  }
}
