/** Configurazione del sito. Per adattare il template a un negozio reale
 *  si modifica questo file e nient'altro. */
export const SITE = {
  brand: 'cartafolia',
  nome: 'Cartafolia',
  citta: 'Ceccano',
  via: 'via Roma 12',
  cap: '03023 Ceccano (FR)',
  orari: [
    ['Martedì – Sabato', '10:00 – 19:30'],
    ['Domenica', '15:00 – 19:00'],
    ['Lunedì', 'chiuso'],
  ] as const,
  social: [
    { id: 'instagram', icon: 'instagram', label: 'Instagram', valore: '@cartafolia.ceccano', href: '#' },
    { id: 'tiktok', icon: 'sparkles', label: 'TikTok', valore: '@cartafolia', href: '#' },
    { id: 'whatsapp', icon: 'message-circle', label: 'WhatsApp', valore: '+39 000 000 0000', href: '#' },
  ],
  seo: {
    titolo: 'Cartafolia — vetrina e catalogo, Ceccano',
    descrizione:
      'Vetrina e catalogo di carte da collezione a Ceccano. Cerca una carta, guarda com’è conservata, poi passa a vederla dal vero. Non vendiamo online.',
    locale: 'it_IT',
  },
  anno: 2026,
} as const
