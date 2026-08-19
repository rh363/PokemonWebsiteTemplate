# Contenuti — come si aggiornano

(Il Task 27 completa questo file con le altre sezioni: dati del negozio,
carte, espansioni. Qui c'e' solo la parte sulle foto, scritta dal Task 23.)

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
