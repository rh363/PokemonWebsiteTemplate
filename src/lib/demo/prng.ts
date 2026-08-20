/** PRNG del prototipo (design-reference/dati.jsx), portato identico:
 *  generatore di Lehmer, moltiplicatore 16807, modulo 2147483647.
 *  Serve a rigenerare gli stessi identici 100 record demo, il che rende
 *  possibile il confronto visivo affiancato col prototipo. */
export function createRng(seed = 7) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return s / 2147483647
  }
}

export const createPick =
  (rng: () => number) =>
  <T>(arr: readonly T[]): T =>
    arr[Math.floor(rng() * arr.length)]!
