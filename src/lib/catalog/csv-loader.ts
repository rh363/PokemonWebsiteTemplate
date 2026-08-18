import { readFile } from 'node:fs/promises'
import { parse } from 'csv-parse/sync'
import type { Loader } from 'astro/loaders'

/** Loader CSV che fallisce il build invece di degradare a log.
 *  Il loader file() di Astro cattura gli errori del parser: un CSV malformato
 *  produrrebbe una collection vuota e un build verde. */
export function csvLoader(percorso: string, chiave: string): Loader {
  return {
    name: 'cartafolia:csv',
    load: async ({ store, parseData, logger }) => {
      const testo = await readFile(percorso, 'utf8')
      let righe: Record<string, string>[]
      try {
        righe = parse(testo, { columns: true, skip_empty_lines: true, bom: true })
      } catch (e) {
        throw new Error(
          `${percorso} non è leggibile: ${(e as Error).message}\n` +
          `Controlla che ogni riga abbia lo stesso numero di colonne dell'intestazione.`,
          { cause: e },
        )
      }
      store.clear()
      for (const [i, riga] of righe.entries()) {
        const numeroRiga = i + 2 // +1 per l'intestazione, +1 perché si conta da 1
        try {
          const id = riga[chiave]
          if (!id) throw new Error(`colonna "${chiave}" vuota o assente`)
          store.set({ id, data: await parseData({ id, data: riga }) })
        } catch (e) {
          throw new Error(`${percorso}, riga ${numeroRiga}: ${(e as Error).message}`, { cause: e })
        }
      }
      logger.info(`${righe.length} righe caricate da ${percorso}`)
    },
  }
}
