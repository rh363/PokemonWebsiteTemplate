# Contenuti — come si aggiornano

Questa guida è per chi aggiorna il negozio, le espansioni o le carte **senza
toccare il codice**. Tre soli posti contano:

- `src/config/site.ts` — nome, indirizzo, orari, social del negozio.
- `src/content/sets.json` — l'elenco delle espansioni.
- `src/content/cards.csv` — l'elenco delle carte. Si apre e si modifica con
  Excel, Numbers o Google Sheets come un foglio di calcolo qualsiasi.

Dopo ogni modifica: salva il file, fai commit e push. Il sito si ricostruisce
da solo (vedi `README.md`, sezione Deploy) e il cambiamento va online in
pochi minuti. Non serve installare nulla né lanciare comandi, **a meno che**
tu non voglia vedere l'anteprima in locale prima di pubblicare — in quel
caso vedi `pnpm dev` nel `README.md`.

**"Fai commit e push" senza installare nulla, sul serio:** si può modificare
uno di questi tre file interamente dal browser, senza clonare il repository
né aprire un terminale. Su GitHub, apri il file (es. `src/content/cards.csv`),
clicca l'icona a forma di matita ("Edit this file") in alto a destra,
modifica il testo, poi scorri in fondo alla pagina — lì c'è un riquadro
"Commit changes" già pronto: scrivi una riga che dica cosa hai cambiato e
clicca "Commit changes" (con "Commit directly to the `main` branch"
selezionato). Quel click *è* il commit e push di cui sopra: il deploy parte
da solo, non serve altro.

## Cambiare nome e indirizzo del negozio

Apri `src/config/site.ts` e modifica questi campi:

```ts
nome: 'Cartafolia',
citta: 'Ceccano',
via: 'via Roma 12',
cap: '03023 Ceccano (FR)',
```

Questi valori compaiono ovunque sul sito: nell'intestazione, nel piè di
pagina, nella pagina "Il negozio" e nei dati strutturati che Google legge
per mostrare l'indirizzo nei risultati di ricerca — non vanno cambiati in
nessun altro file.

### Cambiare i social

Stesso file, campo `social`:

```ts
social: [
  { id: 'instagram', icon: 'instagram', label: 'Instagram', valore: '@cartafolia.ceccano', href: '#' },
  { id: 'tiktok', icon: 'sparkles', label: 'TikTok', valore: '@cartafolia', href: '#' },
  { id: 'whatsapp', icon: 'message-circle', label: 'WhatsApp', valore: '+39 000 000 0000', href: '#' },
],
```

Nel template `href` è ancora `'#'` per tutti e tre: va sostituito col link
vero (profilo Instagram/TikTok, `https://wa.me/<numero>` per WhatsApp) prima
di andare online. Questi tre link non sono un dettaglio a sé: sono quelli
che compongono il dialog "Chiedi una carta" (il bottone che appare su ogni
pagina), quindi finché restano `'#'` quel dialog rimanda a link che non
portano da nessuna parte.

## Cambiare gli orari

Stesso file, campo `orari`: un elenco di coppie `[giorno, orario]`, nello
stesso ordine in cui compaiono sul sito.

```ts
orari: [
  ['Martedì – Sabato', '10:00 – 19:30'],
  ['Domenica', '15:00 – 19:00'],
  ['Lunedì', 'chiuso'],
],
```

Scrivi `'chiuso'` (esattamente così, minuscolo) per i giorni di chiusura: è
il valore che il sito riconosce per non mostrare un orario a un giorno
chiuso.

## Aggiungere un'espansione

Apri `src/content/sets.json` e aggiungi un nuovo blocco all'elenco:

```json
{
  "id": "nvl",
  "name": "Nuova Alba",
  "code": "NVL",
  "year": 2026,
  "total": 180,
  "color": "var(--cyan-500)"
}
```

- `id`: una sigla breve, minuscola, unica — è quella che le carte useranno
  nella colonna `set` del CSV per appartenere a questa espansione.
- `code`: la sigla mostrata sul sito (es. "NVL 042/180"), di solito `id` in
  maiuscolo.
- `total`: il numero totale di carte dell'espansione (non quante ne hai
  schedate — quello lo conta il sito da solo contando le righe del CSV).
- `color`: uno dei colori del design system già usati dalle altre
  espansioni (es. `var(--cherry-500)`, `var(--lemon-500)`, `var(--cyan-500)`,
  `var(--lime-500)`, `var(--grape-500)`) — copia un valore esistente, non
  inventarne uno nuovo.

**L'ordine delle espansioni nel file è l'ordine in cui compaiono sul sito**
(pagina Espansioni, e sezione "Sei espansioni in negozio" della vetrina): per
spostarne una, sposta il suo blocco nel file.

## Aggiungere una carta

Apri `src/content/cards.csv` e aggiungi una riga. Le colonne, in ordine:

| Colonna | Cosa contiene | Esempio |
|---|---|---|
| `id` | Un numero progressivo, unico | `101` |
| `slug` | L'indirizzo della pagina della carta, unico | `fulmine-di-notte-alb-042` |
| `name` | Il nome della carta | `Fulmine di Notte` |
| `set` | L'`id` dell'espansione (colonna `id` di `sets.json`) | `alb` |
| `num` | Numero nell'espansione, come stampato sulla carta | `042/198` |
| `rarity` | Una di: `common`, `uncommon`, `rare`, `holo`, `ultra`, `secret` | `holo` |
| `cond` | Una di: `mint`, `near-mint`, `excellent`, `good`, `played` | `excellent` |
| `lang` | Lingua della carta (di norma `Italiano`, `Inglese` o `Giapponese`) | `Italiano` |
| `artist` | Nome dell'illustratore | `R. Colella` |
| `nuovo` | `true` se va segnalata come new entry, altrimenti `false` | `true` |
| `vetrina` | Un numero: quante copie sono esposte in vetrina | `4` |
| `entrata` | Data di entrata in catalogo, come testo libero | `15 luglio` |
| `ordine` | Un numero: più basso = mostrata prima fra le novità | `635` |
| `image` | Nome del file su R2, oppure vuota (placeholder) — vedi sotto | *(vuota)* |

Punti che contano:

- **`id` e `slug` devono essere unici** in tutto il file: due carte con lo
  stesso valore fermano il build (vedi l'ultima sezione).
- **`rarity` e `cond` accettano solo i valori della tabella**, scritti
  esattamente così (minuscolo, in inglese, coi trattini dove ci sono):
  qualsiasi altro valore ferma il build.
- **Non lasciare celle vuote** nelle colonne che richiedono un numero
  (`vetrina`, `ordine`): una cella vuota non vale `0`, fa fermare il build.
- La colonna `image` può restare vuota: la carta userà il disegno
  segnaposto invece della foto vera (vedi la sezione sotto).

### Cosa fa comparire una carta nei "Nuovi arrivi" della vetrina

**La sezione "Appena entrate in vetrina" della homepage mostra le prime
dieci righe del file `cards.csv`, nell'ordine in cui compaiono nel file —
non le carte più recenti per data, e non quelle con `nuovo: true`.**
`nuovo: true` fa comparire il badge "Nuovo" sulla tessera e fa ordinare la
carta per prima nel catalogo (colonna `ordine`), ma **da sola non basta** a
farla apparire in homepage.

Per far comparire una carta nuova in vetrina: **inserisci la riga in cima al
file** (subito dopo l'intestazione), non in fondo. Una riga aggiunta in
fondo al file, per quanto recente o marcata `nuovo: true`, non compare nella
homepage finché non finisce fra le prime dieci — cosa che, aggiunta in
fondo, non succede mai.

## Aggiungere la foto di una carta

Le foto vere **non entrano mai nel repository**: una collezione di migliaia
di foto in git resta nella storia per sempre e se la porta dietro ogni
clone, e ripulirla dopo significa riscrivere la storia. Stanno su Cloudflare
R2, dietro un dominio personalizzato, e il sito le richiede attraverso le
trasformazioni Cloudflare (`/cdn-cgi/image/...`), che servono AVIF o WebP
ridimensionati invece dell'originale.

1. Metti i file in una cartella qualsiasi (per esempio `foto-carte/`, che
   `.gitignore` esclude gia' dal repository).
2. Caricali sul bucket:

   ```bash
   pnpm upload:img ./foto-carte
   ```

3. Scrivi il nome del file caricato nella colonna `image` della riga della
   carta in `src/content/cards.csv` (per esempio
   `fulmine-di-notte-alb-042.jpg`).
4. Commit e push — del CSV, non della foto.

**Regola non negoziabile: le foto non si mettono mai nel repository.** Se
una foto finisce comunque in un commit, va tolta prima che il commit venga
pushato (con `git reset`/`git commit --amend` se il commit e' ancora
locale; se e' gia' su un branch condiviso, chiedi aiuto invece di forzare
la storia).

### Perche' senza foto il sito funziona lo stesso

`src/config/site.ts` ha un blocco `immagini` con `origine` e `zona` vuoti
finche' il negozio non ha un dominio Cloudflare configurato. Con uno dei due
vuoti, ogni carta ricade sul placeholder foil (`CardArt` senza `src`) — il
sito e lo sviluppo locale funzionano senza credenziali e senza rete. Il
giorno in cui `origine`/`zona` vengono compilati, le carte con una colonna
`image` non vuota mostrano la foto vera; le altre restano sul placeholder.

### Verificare che le trasformazioni siano davvero attive

Dopo aver caricato una foto e compilato la riga del CSV, `pnpm build && pnpm
preview` e controlla nel pannello Rete del browser che il `content-type`
della risposta sia `image/avif` o `image/webp`, **non** `image/jpeg` — se e'
jpeg, le trasformazioni Cloudflare non sono abilitate sulla zona (dashboard
→ la zona del sito → Images → Transformations): tutto sembra funzionare lo
stesso, solo piu' lentamente e con foto non ridimensionate.

## Cosa succede se si sbaglia un campo

**Il sito non pubblica mai un catalogo sbagliato in silenzio.** Se una riga
di `cards.csv` o un campo di `sets.json` non è valido, il build si ferma con
un errore che dice il file, la riga e il campo — invece di andare online con
dati mancanti o sbagliati. Qualche esempio di come si presenta l'errore:

```
src/content/cards.csv, riga 42: "slug" duplicato — "fulmine-di-notte-alb-042" compare già alla riga 17.
Ogni carta deve avere uno slug diverso.
```

```
src/content/cards.csv, riga 8: rarity: Invalid option: expected one of "common"|"uncommon"|"rare"|"holo"|"ultra"|"secret"
```

```
src/content/cards.csv, riga 15: cella vuota
```

Quando succede: apri il file alla riga indicata, correggi la cella, salva e
riprova. Se l'errore compare durante il deploy automatico (dopo un push), il
sito **in produzione resta quello di prima** — non viene mai sostituito da
una versione rotta — finché il file corretto non viene pushato di nuovo.
