const{Button,Icon,Panel,Badge,ConditionBadge}=window.CartafoliaDesignSystem_3cbf75;
const{Titolo,Testo,Occhiello,TestaSezione}=window;

const PERSONE=[
  ["MF","Marta","Sta al banco e scheda le carte nuove. Se cerchi qualcosa di vintage, chiedi a lei."],
  ["DR","Davide","Apre le buste il martedì, tiene i tornei del giovedì e perde quasi sempre."],
  ["GP","Giulia","Fotografa le carte per il catalogo e decide la condizione quando siamo in dubbio."]
];
const PASSI=[
  ["01","Arriva la carta","Da una busta nuova, da uno scambio o da una collezione che qualcuno porta in negozio."],
  ["02","La guardiamo in due","Fronte, retro, bordi e centratura. Se non siamo d'accordo sulla condizione, scende di un gradino."],
  ["03","La fotografiamo","Luce fredda, fondo carta, proporzione 63×88. La stessa per tutte, così il confronto è onesto."],
  ["04","Va in vetrina e in catalogo","Con codice, espansione, lingua e la nota di condizione che leggi nella scheda."]
];
const NOTE_COND=[
  ["mint","Nessun segno. Bustina rigida dal primo giorno."],
  ["near-mint","Un micro segno sul bordo, visibile solo in controluce."],
  ["excellent","Angoli appena smussati, fronte pulito."],
  ["good","Bordi sbiancati o un graffio leggero. Si vede, si dichiara."],
  ["played","Ha giocato: pieghe e consumo. Sta in raccoglitore, non in vetrina."]
];

function About({go,onChiedi}){
  return <div>
    <section style={{position:"relative",overflow:"hidden",borderBottom:"1px solid var(--border-hairline)"}}>
      <div style={{position:"absolute",inset:0,background:"var(--pattern-dots) 0 0/var(--pattern-dots-size)",opacity:.7}}/>
      <div className="wrap" style={{position:"relative",paddingTop:"var(--sp-16)",paddingBottom:"var(--sp-12)",display:"grid",gap:"var(--sp-5)",maxWidth:"var(--page-narrow)",marginLeft:"auto",marginRight:"auto"}}>
        <Occhiello>Chi siamo</Occhiello>
        <Titolo livello="pagina">Un negozio piccolo, un catalogo lungo.</Titolo>
        <Testo grande>Cartafolia ha aperto a {window.NEGOZIO.citta} nel 2019, in un fondo che prima era una merceria. Abbiamo cominciato con due vetrine e una scatola di doppioni; oggi in catalogo ci sono {window.CARDS.length} carte, tutte schedate a mano.</Testo>
        <Testo grande>Non vendiamo online e non abbiamo intenzione di farlo. Il sito serve a farti sapere cosa c'è prima di venire, così quando arrivi sappiamo già cosa tirare fuori.</Testo>
      </div>
    </section>

    <section className="wrap sez">
      <TestaSezione occhiello="Storia" titolo="Sette anni, tre traslochi di vetrina"/>
      <div className="g3" style={{gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))"}}>
        {[["2019","Apriamo con due vetrine e i doppioni di casa."],
          ["2021","Arriva il tavolo grande. Da lì partono i tornei del giovedì."],
          ["2023","Cominciamo a schedare tutto: codice, condizione, foto."],
          ["2026","Il catalogo va online. Il negozio resta l'unico posto dove si compra."]].map(([a,t])=>
          <Panel key={a} padding="var(--sp-5)" style={{display:"grid",gap:"var(--sp-2)",alignContent:"start"}}>
            <span style={{font:"var(--fw-medium) var(--fs-title-m)/1 var(--font-mono)",color:"var(--cherry-500)"}}>{a}</span>
            <Testo style={{fontSize:"var(--fs-body-s)"}}>{t}</Testo>
          </Panel>)}
      </div>
    </section>

    <section style={{background:"var(--surface-invert)"}}>
      <div className="wrap sez">
        <TestaSezione tone="invert" occhiello="Chi ci lavora" titolo="Siamo in tre dietro al banco"/>
        <div className="g3" style={{gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))"}}>
          {PERSONE.map(([i,nome,ruolo])=><div key={nome} style={{display:"grid",gap:"var(--sp-3)",padding:"var(--sp-6)",borderRadius:"var(--r-card)",background:"var(--surface-invert-soft)",border:"1px solid var(--border-invert)"}}>
            <span style={{display:"grid",placeItems:"center",width:52,height:52,borderRadius:"var(--r-pill)",background:"var(--foil)",color:"var(--ink-950)",font:"var(--fw-black) var(--fs-body-m)/1 var(--font-display)"}}>{i}</span>
            <span style={{font:"var(--fw-bold) var(--fs-title-s)/var(--lh-title-s) var(--font-display)",color:"var(--text-invert)"}}>{nome}</span>
            <Testo tone="invert" style={{fontSize:"var(--fs-body-s)"}}>{ruolo}</Testo>
          </div>)}
        </div>
      </div>
    </section>

    <section className="wrap sez">
      <TestaSezione occhiello="Come schediamo" titolo="Ogni carta passa da quattro mani" testo="Dalla busta alla vetrina ci vogliono venti minuti. Sono sempre gli stessi quattro passaggi."/>
      <div className="g3" style={{gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))"}}>
        {PASSI.map(([n,t,d])=><Panel key={n} hoverLift padding="var(--sp-6)" style={{display:"grid",gap:"var(--sp-3)",alignContent:"start"}}>
          <span style={{font:"var(--fw-medium) var(--fs-title-m)/1 var(--font-mono)",color:"var(--cherry-500)"}}>{n}</span>
          <span style={{font:"var(--type-card-title)",color:"var(--text-strong)"}}>{t}</span>
          <Testo style={{fontSize:"var(--fs-body-s)"}}>{d}</Testo>
        </Panel>)}
      </div>
    </section>

    <section className="wrap sez" style={{paddingTop:0}}>
      <TestaSezione occhiello="Condizione" titolo="Cinque gradi, dichiarati sempre" testo="Usiamo la scala standard in inglese. Se una carta sta fra due gradi, la mettiamo nel più basso."/>
      <Panel padding="0" style={{overflow:"hidden"}}>
        {NOTE_COND.map(([id,d],i)=><div key={id} style={{display:"flex",alignItems:"center",gap:"var(--sp-5)",padding:"var(--sp-4) var(--sp-5)",borderTop:i?"1px solid var(--border-hairline)":"none",flexWrap:"wrap"}}>
          <div style={{width:132,flex:"none"}}><ConditionBadge condition={id}/></div>
          <Testo style={{fontSize:"var(--fs-body-s)",flex:1,minWidth:200}}>{d}</Testo>
        </div>)}
      </Panel>
      <div style={{display:"flex",gap:"var(--sp-3)",flexWrap:"wrap",marginTop:"var(--sp-8)"}}>
        <Button icon={<Icon name="layers" size={16}/>} onClick={()=>go("catalogo")}>Sfoglia il catalogo</Button>
        <Button variant="secondary" icon={<Icon name="instagram" size={16}/>} onClick={()=>onChiedi(true)}>Chiedi una carta</Button>
      </div>
    </section>
  </div>;
}
Object.assign(window,{About});
