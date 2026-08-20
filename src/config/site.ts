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
  /** Foto delle carte su Cloudflare R2, dietro le trasformazioni di
   *  Cloudflare Images (spec §13, Task 23). Con `origine` o `zona` vuoti,
   *  CardImage ricade sempre sul placeholder foil: lo sviluppo locale
   *  funziona senza credenziali e senza rete, e il sito non si rompe mai
   *  per una configurazione mancante. Vedi docs/CONTENUTI.md per come
   *  aggiungere la foto di una carta una volta compilati questi campi. */
  immagini: {
    /** Dominio personalizzato del bucket R2. Vuoto = niente foto, si usa il placeholder. */
    origine: '', // es. 'https://img.cartafolia.it'
    /** Zona su cui girano le trasformazioni: di norma il dominio del sito. */
    zona: '', // es. 'https://cartafolia.it'
    larghezze: [150, 300, 450],
    qualita: 82,
  },
} as const
