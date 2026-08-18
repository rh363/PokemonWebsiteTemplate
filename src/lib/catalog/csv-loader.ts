import { readFile } from 'node:fs/promises'
import { parse } from 'csv-parse/sync'
import type { Loader } from 'astro/loaders'

/** Loader CSV che fallisce il build invece di degradare a log.
 *  Il loader file() di Astro cattura gli errori del parser: un CSV malformato
 *  produrrebbe una collection vuota e un build verde. Con { info: true }
 *  csv-parse restituisce anche il numero di riga reale di ogni record, che
 *  regge correttamente le righe vuote in mezzo al file (a differenza di un
 *  contatore basato sull'indice dell'array). */
export function csvLoader(percorso: string, chiave: string): Loader {
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
