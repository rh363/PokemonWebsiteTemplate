# Decisioni prese durante l'implementazione

Questo documento raccoglie le decisioni che l'implementazione ha dovuto prendere e che
non erano nel piano, insieme ai difetti noti e non chiusi. È il complemento di
`docs/superpowers/plans/2026-08-18-cartafolia-astro.md`, che dice cosa era previsto;
qui c'è cosa è cambiato e perché.

## Debiti aperti

Dopo un giro di correzioni il processo prevede una rilettura indipendente del solo diff
corretto. Su richiesta esplicita di contenere i costi, otto di queste riletture non sono
state eseguite: le correzioni sono state verificate da chi coordinava, non da un occhio
terzo. **La review finale di branch le ha coperte tutte e otto**, esaminandone i file uno
per uno, e non ha trovato residui in sette casi su otto — l'ottavo ha prodotto le due
finding Critical che sono state poi corrette.

- DEBITO: la re-review formale scoped del fix round 1 del Task 5 NON e' stata eseguita. Il fix e' verificato dal controller sugli 8 casi, ma nessun occhio indipendente ha letto il diff di csv-loader.ts e content.config.ts dopo il fix. Da recuperare alla ripresa, oppure lasciare che lo copra la review finale di branch.
- DEBITO Task 5 (re-review scoped mancante): lasciato alla review finale di branch, per contenere i costi.
- DEBITO #2: re-review scoped del fix round 1 del Task 9 non eseguita (come per il Task 5). Due debiti accumulati: la review finale di branch DEVE coprire esplicitamente csv-loader.ts/content.config.ts (Task 5) e ds.css/SpecList/CardArt (Task 9).
- DEBITO #3: re-review scoped dei fix round 1 e 2 del Task 11 non eseguita (vincolo di costo). Tre debiti accumulati — la review finale di branch DEVE coprire esplicitamente: csv-loader.ts/content.config.ts (T5), ds.css/SpecList/CardArt (T9), SearchField/FilterGroup/Button/package.json (T11).
- DEBITO #4: re-review scoped del fix round 1 dei Task 12+13 non eseguita (vincolo di costo).
- DEBITO #5: re-review scoped del fix round 1 del Task 15 non eseguita (vincolo di costo).
- DEBITO #6: re-review scoped del fix round 1 del Task 16 non eseguita (vincolo di costo).
- DEBITO #7: re-review scoped del fix round 1 del Task 19 non eseguita (vincolo di costo). Sette debiti: la review finale di branch deve coprire T5, T9, T11, T12, T15, T16, T19.
- DEBITO #8: re-review scoped dei fix del Task 20 non eseguita.

## Difetti noti, consapevolmente non chiusi

- Task 1: minor (deferred): .prettierignore ha una quinta riga (pnpm-lock.yaml) non nel brief — in realtà proveniva da un'istruzione del controller, quindi non è una deviazione. Nessuna azione.
- Task 1: minor (deferred): tsconfig.json "exclude" sostituisce i default TypeScript e quindi non esclude più node_modules. Plan-mandated (il brief lo detta così). Verificato innocuo in pratica: astro check processa 3 file. Da triage nella review finale.
- Task 1: minor (deferred): pnpm-workspace.yaml non è nella lista Files del brief — coperto dal ruling 4, nessuna azione.
- Task 2: minor (deferred): la causa del "2" a freddo (race con la compilazione on-demand di Vite) è un'inferenza plausibile ma non verificata indipendentemente.
- Task 2: minor (deferred): la riga nella spec è terse per come la prescrive il brief; la traccia completa vive nel commit e nel report. RISOLTO dal controller: spec §6.3 ampliata e §6.4 aggiunta.
- Task 3: minor (deferred): @fontsource-variable/plus-jakarta-sans registra solo font-style:normal; l'@import originale chiedeva anche il corsivo 400. Verificato che il prototipo non usa mai il corsivo, quindi non è una regressione visiva. Ma il progetto è un template per un cliente che potrebbe aggiungere testo in corsivo dopo: allora verrebbe sintetizzato dal browser invece che caricato. Da triage nella review finale — il fix è importare wght-italic.css.
- Task 5: minor (deferred): RISOLTA dal controller — rmSync inutilizzato era un difetto dello snippet del piano, rimosso.
- Task 6+7: minor (deferred): il test dell'ordinamento "espansione" non esercita mai il tie-breaker su num — entrambe le carte alb hanno num 001/198. Il comparatore e' verificato corretto leggendo il codice, ma un tie-breaker rotto passerebbe la suite. Fix: dare num diversi e asserire sull'id.
- Task 6+7: minor (deferred): stesso problema sull'ordinamento "rarita" — tutte le fixture hanno rarita' diverse, il tie-breaker su name non viene mai esercitato.
- Task 8: minor (deferred): i due endpoint leggono le collection due volte invece di una. Innocuo a 100 carte, da rivedere se il catalogo cresce.
- Task 8: minor (deferred) IMPORTANTE PER IL FINALE: `sets.find(...) ?? sets[0]!` attribuisce silenziosamente una carta con set id inesistente alla PRIMA espansione, invece di segnalare l'errore. E' la stessa categoria di fallimento silenzioso che abbiamo eliminato con due giri di fix sul loader CSV: un cliente che scrive "alba" invece di "alb" ottiene dati sbagliati senza avvisi. Pattern ereditato dal brief e presente anche in Task 6/7. Da valutare nella review finale: il posto giusto e' un controllo di integrita referenziale nel csv-loader.
- Task 10: minor (deferred): la span di rimozione del Chip non e' raggiungibile da tastiera. Stessa lacuna del prototipo, quindi non e' una regressione. Da valutare nella review finale se irrigidire l'accessibilita oltre la fedelta letterale.
- Task 12+13: minor (deferred): Pagination senza landmark <nav> — non richiesto ne dal sorgente ne dal brief, miglioramento a11y da valutare a parte.
- Task 12+13: minor (deferred): text-align:center ridondante su .ds-pagination__page.
- Task 14: minor (deferred): se l'utente attiva prefers-reduced-motion mentre il puntatore e' fermo su una carta gia' inclinata, rx/ry non tornano a 0. Caso stretto ma reale; la verifica dell'implementer ricaricava la pagina con matchMedia gia' forzato, quindi non ha esercitato la transizione.
- Task 14: minor (deferred) — precisazione utile: anche lo sheen foil di CardArt richiede idratazione, non solo il tilt. La mia formulazione "solo il tilt non e' esprimibile in CSS" era imprecisa.
- Task 15: minor (deferred): il menu <details> non restituisce il focus al <summary> alla chiusura. Costo inerente della scelta, gia' benedetta da §6.4.
- Task 15: minor (deferred): la finestra residua e' descritta con ottimismo — un click prima che lo script della NavBar attacchi il listener e' ancora perso. Molto piu' piccola dell'attesa client:idle che sostituisce, ma non zero.
- Task 19: minor (deferred): due idiomi per il CSS globale (is:global contro :global() per selettore) fra espansioni.astro e index.astro.
- Task 19: minor (deferred): CardTile aggiunge 14 istanze del <div onclick> non focalizzabile. Gia' deciso per i Task 20-21: al punto di integrazione va avvolto in <a href>.

## Decisioni prese

- Task 2 Step 6 cancella anche `src/stores/chrome.ts` e ripristina `src/pages/index.astro` al segnaposto del Task 1 — lo spike non deve sopravvivere in nessuna forma, e un `index.astro` che importa file cancellati romperebbe il build al Task 3 — se sbagliato costa un build rotto evidente entro un task.
- `src/config/nav.ts` lo crea il Task 13 e lo consuma il Task 15 — è il Task 13 che ne ha bisogno per primo, dentro NavBar.astro — se sbagliato costa una duplicazione banale da unire.
- `NavBar.astro` prende `{ active, catalogCount }`, e la voce catalogo riceve il conteggio dalla pagina — la spec vuole il numero reale di carte nella nav, e il produttore non può conoscerlo — se sbagliato costa il badge del conteggio mancante nella nav.
- `docs/CONTENUTI.md` lo crea il Task 23 (primo che ci scrive) e lo completa il Task 27 — se sbagliato costa un file sovrascritto e una sezione da riscrivere.
- `src/styles/ds.css` è append-only dal Task 9 al 14, un blocco per componente con commento che cita la sorgente — sei task che scrivono lo stesso file senza questa regola si sovrascrivono a vicenda — se sbagliato costa la perdita degli stili dei componenti portati prima.
- il Task 20 aggiunge `export * from './url'` alla facade — la spec §5.2 vuole che le pagine importino solo da `~/lib/catalog` — se sbagliato costa import diretti che aggirano la facade.
- design-reference/ la popola il controller, non l'implementer — il tool esiste solo qui — se sbagliato costa nulla, il contenuto è verificato percorso per percorso (tutti 200, 10 script, 9 token, root mount presente).
- _adherence.oxlintrc.json NON vendorizzato verbatim — è lint React con selettori JSXOpeningElement, non gira su Svelte e non girerà mai; i contratti di prop dei 26 componenti sono estratti in design-reference/CONTRATTI-COMPONENTI.md e il Task 27 Step 2 è riscritto con controlli grep che funzionano davvero — se sbagliato costa la riscrittura di un file di documentazione.
- oxlintrc.json resta configurazione di correttezza JS/TS generica, non di aderenza ai token — l'aderenza non è esprimibile in oxlint per Svelte (gli stili stanno in attributi e in .css, non in literal JS) e vive nel Task 27 — se sbagliato costa un file di config da riscrivere.
- package.json dichiara pnpm.onlyBuiltDependencies per esbuild, workerd e sharp — pnpm 10+ blocca i build script per default e workerd serve a wrangler al Task 26 — se sbagliato costa un deploy che fallisce al Task 26 con errore esplicito.
- il Task 2 verifica lo spike con Playwright (prova comportamentale) + analisi dei chunk di build (prova strutturale), invece di "aprire il browser e cliccare" — un subagent non può cliccare e una verifica non riproducibile non è una verifica; se le due prove discordano è BLOCKED, perché proseguire su un'assunzione sbagliata costerebbe l'intero Task 15 — se sbagliato costa l'installazione anticipata di chromium, che serve comunque al Task 25.
- il finding sull'idratazione entra nella spec come §6.4 con tre opzioni e una preferita (menu funzionante senza JS, arricchito dopo) — è informazione di design, non correzione di lavoro altrui, e il Task 15 la leggerà quando deciderà — se sbagliato costa una sezione di spec da riscrivere.
- la prop `color` di Icon NON si porta — verificato che nessuno la passa mai (4 chiamanti nei .jsx usano style={{color}}, nel bundle `color: color` compare 0 volte): è API morta già nel prototipo e `style` fa la stessa cosa — se sbagliato costa aggiungere una prop di tre righe quando un componente dei Task 9-14 ne avrà bisogno.
- gli avvisi di lint sul codice di test vanno risolti prima della review, non differiti — il vincolo del progetto dice che l'output dei test deve essere pulito, e il codice incriminato è dettato dal mio piano, quindi il difetto è mio: piano corretto da .sort() a .toSorted() — se sbagliato costa nulla, toSorted è disponibile su Node 22.
- si sostituisce il loader file() di Astro con un loader nostro che lancia, più numero di riga nel messaggio (Astro riportava cards.csv:0:0, inutile su cento righe). Se anche il loader che lancia non ferma il build, fallback su script di validazione indipendente con prebuild — se sbagliato costa un file di loader da riscrivere, ma non farlo lascerebbe il cliente a pubblicare cataloghi vuoti senza segnale.
- cardCode/cardSlug stanno in labels.ts, non in search.ts — il piano li definiva in due task, la collocazione giusta è quella delle derivazioni pure dai dati; piano corretto, search.ts ora importa — se sbagliato costa spostare due funzioni.
- la Minor sui numeri di riga (i+2 sbagliato se skip_empty_lines salta righe) si risolve dentro il fix 1 usando info:true di csv-parse, che dà i numeri reali — verificato: su un file con riga vuota restituisce lines 2 e 4, non 2 e 3 — se sbagliato costa nulla, è la stessa modifica.
- Task 6 e 7 accorpati in UN dispatch — sono logica pura, stessa directory, stessa forma, con il codice di test gia' scritto per intero nel piano; la metodologia stessa prescrive di accorpare lavoro piccolo e omogeneo. Una sola review sul diff combinato — se sbagliato costa una review che copre due task invece di uno, con un gate leggermente meno granulare.
- la fix del test NON apre un giro dedicato ma viene accorpata in testa al dispatch del Task 9 — e' una modifica di sola fixture, e un ciclo implementer+re-review per due righe di test non si giustifica coi vincoli di costo dichiarati dall'utente; la review del Task 9 coprira' entrambi i diff — se sbagliato costa una finding che resta aperta un task in piu'.
- __ds.astro era un difetto MIO — Astro esclude dal routing i segmenti che iniziano per underscore, quindi la galleria dava 404. Rinominata ds-gallery.astro in tutti gli 11 punti del piano, con nota per i Task 10-14 che ci scriveranno sopra — se sbagliato costa una rinomina.
- il trabocchetto degli shorthand entra nel PROTOCOLLO di porting, non resta nota di task — i Task 10-14 divideranno decine di regole allo stesso modo e il difetto e' invisibile a check/lint/test, si vede solo guardando — se sbagliato costa una sezione di documentazione in piu'.
- estratto porting-protocol.md nella cartella di lavoro e allegato ai dispatch — i brief per task citano "l'Esempio qui sopra" ma il ritaglio non include la sezione condivisa; l'implementer del Task 10 ha dovuto recuperarla da git show. Difetto del mio processo di dispatch, non del task — se sbagliato costa un file in piu' allegato.
- la lezione sugli stati persistenti contro :hover entra nel protocollo — riguarda Checkbox e Switch (11), Tabs e NavBar (13), CardTile liked (14); in React non si pone perche' lo stile e' un oggetto unico calcolato — se sbagliato costa una sezione di documentazione.
- Esempio B corretto nel piano (prop as, tipi union, regola di fallback) e il fix di Button.svelte accorpato in testa al dispatch del Task 11, come gia' fatto fra Task 8 e 9 — un ciclo invece di due — se sbagliato costa una finding aperta un task in piu'.
- svelte-check entra nei Global Constraints del piano e in pnpm check — sette task di componenti sono ancora davanti e avrebbero ereditato la stessa cecita — se sbagliato costa una dipendenza di sviluppo in piu'.
- gli avvisi su Chip NON si toccano in un giro di fix — sono lacune del prototipo e chiuderle cambia il markup del componente, decisione che spetta al proprietario del progetto. Registrata come questione aperta per la review finale.
- Task 12 e 13 accorpati in UN dispatch (overlay + navigazione) — stessa forma, stesso protocollo, e la metodologia prescrive di accorpare lavoro piccolo e omogeneo; due commit distinti, una review sul diff combinato — se sbagliato costa un gate meno granulare su due task.
- il fix e' STRUTTURALE, non una toppa — i quattro helper di pezzi.jsx (Occhiello, Titolo, Testo, TestaSezione) diventano componenti Svelte in src/components/, perche' nel prototipo SONO componenti e ricopiarli a mano su sei pagine ancora da fare sono sei occasioni dello stesso difetto. Svelte e non Astro cosi' servono da entrambi i lati del confine. Piano aggiornato per i Task 17-22 — se sbagliato costa quattro file in piu' e una riscrittura di pagina.
- Task 17 e 18 accorpati in UN dispatch — entrambi porting di pagina con gli stessi helper appena creati; due commit, una review.
- l'ordine di visualizzazione E' l'ordine di sets.json — nel prototipo SETS e' un array e il suo ordine e' una scelta editoriale che non deriva da nessun campo; ed e' anche la regola piu' comprensibile per chi edita i contenuti. Centralizzato in getAllSets(), non nella pagina, perche' il Task 19 elenca le espansioni sulla home e erediterebbe lo stesso difetto — se sbagliato costa un ordinamento da rifare in un punto solo.
- per i Task 19-21 la lista si rende in Astro e l'isola monta solo i controlli; i dati che le servono se li procura da /api/catalog.json, che esiste dal Task 8 ed e' il canale previsto. Tessere con data-carta="<slug>", SiteChrome scarica il catalogo alla prima richiesta di quick-view. /api/catalog.json pesa 24 KB per tutte e 100 le carte, in cache fra le navigazioni: meno di quanto costi incorporare props su ogni pagina. E' anche il motivo per cui il seam esiste — quel file domani nasce da Supabase e le pagine non cambiano — se sbagliato costa rifare il meccanismo del quick-view in un punto solo.
- la regola "degradare visibilmente" e' ASIMMETRICA. Vista di default: la griglia statica E' il contenuto giusto, quindi a fetch fallita l'isola non subentra e il toast basta. Vista filtrata o con querystring: la griglia statica sarebbe fuorviante, quindi si passa la mano sempre e si mostra l'errore con Riprova — se sbagliato costa invertire una condizione.
- Task 22 (404) e 24 (SEO/cache/transizioni) accorpati in un dispatch — entrambi piccoli e di rifinitura del sito.
- Task 23 (immagini) e 25 (test end-to-end) accorpati. Il 23 e' implementabile per intero senza credenziali Cloudflare: percorso di codice completo con configurazione vuota, che ricade sul placeholder foil. Nessun bucket, nessun dominio, nessuna azione verso l'esterno.
- si TENGONO, ma il costo va reso visibile in docs/PERFORMANCE.md e la scelta va portata esplicitamente all'utente invece di essere spesa in silenzio dal suo budget di prestazioni — se sbagliato costa rimuovere un import.
- Task 26 (deploy) e 27 (verifica finale e documentazione) accorpati. Il 26 si limita a CONFIGURARE: nessun deploy, nessun comando verso Cloudflare, nessuna credenziale.
