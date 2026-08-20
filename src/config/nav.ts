/** Voci della barra di navigazione. Nel prototipo stavano in guscio.jsx;
 *  qui sono centralizzate perche' NavBar e' un componente Astro, non piu'
 *  un pezzo di App con lo stato del router. Il count del catalogo lo
 *  riempie la pagina che monta la NavBar, con il numero reale di carte. */
export const NAV = [
  { id: 'vetrina', label: 'Vetrina', href: '/' },
  { id: 'catalogo', label: 'Catalogo', href: '/catalogo', count: undefined as number | undefined },
  { id: 'espansioni', label: 'Espansioni', href: '/espansioni' },
  { id: 'negozio', label: 'Il negozio', href: '/negozio' },
  { id: 'about', label: 'Chi siamo', href: '/chi-siamo' },
]
