/** Configurazione del sito. Per adattare il template a un negozio reale
 *  si modifica questo file e nient'altro. */

/** I pochi valori che non appartengono al progetto ma al singolo deploy (il
 *  bucket delle foto, il dominio) si possono passare da variabili d'ambiente
 *  invece di committarli: comodo per tenere fuori dal repository l'indirizzo
 *  di un bucket, e per far convivere piu' ambienti sullo stesso codice. Il
 *  valore scritto qui sotto resta il default quando la variabile manca.
 *
 *  Il prefisso PUBLIC_ non e' decorativo: questo file finisce anche nei
 *  bundle del browser (SiteChrome, CardArt), e Vite sostituisce solo le
 *  variabili con quel prefisso. Una senza si vedrebbe durante il build ma
 *  non nell'isola idratata — stessa pagina, due configurazioni diverse, e
 *  nessun errore da nessuna parte.
 *
 *  `||` e non `??`: da GitHub Actions una variabile non impostata arriva
 *  come stringa vuota, non come `undefined`, e vuota deve valere "non
 *  impostata" — altrimenti sovrascriverebbe il default con il nulla. */
const env = import.meta.env as Record<string, string | undefined>

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
    {
      id: 'instagram',
      icon: 'instagram',
      label: 'Instagram',
      valore: '@cartafolia.ceccano',
      href: '#',
    },
    { id: 'tiktok', icon: 'sparkles', label: 'TikTok', valore: '@cartafolia', href: '#' },
    {
      id: 'whatsapp',
      icon: 'message-circle',
      label: 'WhatsApp',
      valore: '+39 000 000 0000',
      href: '#',
    },
  ],
  seo: {
    titolo: 'Cartafolia — vetrina e catalogo, Ceccano',
    descrizione:
      'Vetrina e catalogo di carte da collezione a Ceccano. Cerca una carta, guarda com’è conservata.',
    locale: 'it_IT',
  },
  anno: 2026,
  /** Foto delle carte su Cloudflare R2 (spec §13, Task 23). Con `origine`
   *  vuota, CardImage ricade sempre sul placeholder foil: lo sviluppo
   *  locale funziona senza credenziali e senza rete, e il sito non si rompe
   *  mai per una configurazione mancante. Vedi docs/CONTENUTI.md per come
   *  aggiungere la foto di una carta una volta compilati questi campi. */
  immagini: {
    /** Dominio del bucket R2 — dominio personalizzato, oppure l'URL pubblico
     *  `r2.dev` per fare prove. E' questo campo, da solo, ad accendere le
     *  foto: vuoto = placeholder ovunque. */
    origine: env.PUBLIC_IMG_ORIGINE || '', // es. 'https://img.cartafolia.it'
    /** Zona su cui girano le trasformazioni: di norma il dominio del sito.
     *  Facoltativo, e serve un dominio proprio su Cloudflare (non esiste su
     *  `.workers.dev`). Vuota = foto originali servite dal bucket, senza
     *  ridimensionamento ne' srcset: comodo per provare, ma carica foto gia'
     *  piccole finche' resti qui. */
    zona: env.PUBLIC_IMG_ZONA || '', // es. 'https://cartafolia.it'
    larghezze: [150, 300, 450],
    qualita: 82,
  },
} as const
