const{Button,Icon,Panel,Badge}=window.CartafoliaDesignSystem_3cbf75;
const{Titolo,Testo,Occhiello,TestaSezione,SOCIAL}=window;

function Mappa(){
  return <Panel padding="0" style={{overflow:"hidden",position:"relative",minHeight:320}}>
    <div style={{position:"absolute",inset:0,background:"var(--pattern-grid) 0 0/var(--pattern-grid-size)",backgroundColor:"var(--surface-sunken)"}}/>
    <div style={{position:"absolute",left:"46%",top:"44%",display:"grid",placeItems:"center",gap:6,transform:"translate(-50%,-50%)"}}>
      <span style={{display:"grid",placeItems:"center",width:44,height:44,borderRadius:"var(--r-pill)",background:"var(--surface-brand)",border:"var(--bw-strong) solid var(--ink-950)",boxShadow:"var(--sh-sticker)",color:"var(--text-invert)"}}>
        <Icon name="map-pin" size={20}/>
      </span>
      <span style={{font:"var(--type-code)",color:"var(--text-muted)",background:"var(--surface-card)",padding:"3px 8px",borderRadius:"var(--r-pill)",border:"1px solid var(--border-hairline)"}}>{window.NEGOZIO.via}</span>
    </div>
    <span style={{position:"absolute",left:"var(--sp-4)",bottom:"var(--sp-4)",font:"var(--type-label)",fontSize:"var(--fs-caption)",color:"var(--text-faint)"}}>Mappa segnaposto — da sostituire con la mappa vera</span>
  </Panel>;
}

function Negozio({onChiedi,go}){
  const n=window.NEGOZIO;
  return <div className="wrap" style={{paddingTop:"var(--sp-10)",paddingBottom:"var(--section-y)"}}>
    <div style={{display:"grid",gap:"var(--sp-4)",marginBottom:"var(--sp-10)"}}>
      <Occhiello>{n.cap}</Occhiello>
      <Titolo livello="pagina">Il negozio</Titolo>
      <Testo grande>Due vetrine, un tavolo grande e una scatola di bustine nuove ogni martedì. Le carte del catalogo sono tutte qui: chiedile e le tiriamo fuori.</Testo>
    </div>
    <div className="g2" style={{alignItems:"start",gap:"var(--sp-8)"}}>
      <div style={{display:"grid",gap:"var(--sp-5)"}}>
        <Panel padding="var(--sp-6)" style={{display:"grid",gap:"var(--sp-4)"}}>
          <div style={{display:"flex",gap:"var(--sp-3)",alignItems:"flex-start"}}>
            <Icon name="map-pin" size={20} style={{color:"var(--cherry-500)",marginTop:2}}/>
            <div style={{display:"grid",gap:2}}>
              <span style={{font:"var(--type-card-title)",color:"var(--text-strong)"}}>{n.via}</span>
              <span style={{font:"var(--type-code)",color:"var(--text-muted)"}}>{n.cap}</span>
            </div>
          </div>
          <Testo style={{fontSize:"var(--fs-body-s)"}}>Dalla piazza sono due minuti a piedi. Si parcheggia nella via dietro; il sabato pomeriggio conviene arrivare a piedi.</Testo>
          <div style={{display:"flex",gap:"var(--sp-3)",flexWrap:"wrap"}}>
            <Button icon={<Icon name="instagram" size={16}/>} onClick={()=>onChiedi(true)}>Chiedi una carta</Button>
            <Button variant="secondary" icon={<Icon name="layers" size={16}/>} onClick={()=>go("catalogo")}>Sfoglia il catalogo</Button>
          </div>
        </Panel>
        <Panel variant="sticker" padding="var(--sp-6)" style={{display:"grid",gap:"var(--sp-4)"}}>
          <div style={{display:"flex",alignItems:"center",gap:"var(--sp-2)"}}>
            <Icon name="clock" size={18}/><span style={{font:"var(--type-card-title)",color:"var(--text-strong)"}}>Orari</span>
          </div>
          {n.orari.map(([g,h])=><div key={g} style={{display:"flex",justifyContent:"space-between",gap:"var(--sp-4)",paddingBottom:"var(--sp-3)",borderBottom:"1px solid var(--border-hairline)"}}>
            <span style={{font:"var(--type-label)",color:"var(--text-strong)"}}>{g}</span>
            <span style={{font:"var(--type-code)",fontSize:"var(--fs-body-s)",color:"var(--text-body)"}}>{h}</span>
          </div>)}
          <span style={{font:"var(--type-label)",fontSize:"var(--fs-caption)",fontWeight:"var(--fw-regular)",color:"var(--text-muted)"}}>Il martedì apriamo le buste nuove alle 17:00. Si può guardare.</span>
        </Panel>
      </div>
      <Mappa/>
    </div>
    <section style={{marginTop:"var(--section-y)"}}>
      <TestaSezione occhiello="Scrivici" titolo="Rispondiamo negli orari di apertura" testo="Niente mail, niente moduli: ci trovi dove ci trovano tutti."/>
      <div className="g3" style={{gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))"}}>
        {SOCIAL.map(s=><Panel key={s.id} hoverLift as="a" href="#" onClick={e=>{e.preventDefault();onChiedi(true)}}
          padding="var(--sp-6)" style={{display:"grid",gap:"var(--sp-2)",textDecoration:"none"}}>
          <Icon name={s.icon} size={20} style={{color:"var(--cherry-500)"}}/>
          <span style={{font:"var(--type-card-title)",color:"var(--text-strong)"}}>{s.label}</span>
          <span style={{font:"var(--type-code)",color:"var(--text-muted)"}}>{s.valore()}</span>
        </Panel>)}
      </div>
    </section>
    <section style={{marginTop:"var(--section-y)"}}>
      <TestaSezione occhiello="In negozio" titolo="Cosa c'è, oltre alle vetrine"/>
      <div className="g3" style={{gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))"}}>
        {[["Il tavolo grande","Sei posti, sempre liberi. Si gioca, si scambia, si guardano le carte con calma."],
          ["Le due vetrine","Le carte del catalogo stanno qui, sotto vetro, in ordine di espansione."],
          ["Bustine nuove","Arrivano il martedì. Le apriamo alle 17:00 e finiscono in catalogo la sera stessa."],
          ["Valutazioni","Porti la tua collezione, la guardiamo insieme e ti diciamo com'è messa. Gratis."]].map(([t,d])=>
          <Panel key={t} padding="var(--sp-5)" style={{display:"grid",gap:"var(--sp-2)",alignContent:"start"}}>
            <span style={{font:"var(--type-card-title)",color:"var(--text-strong)"}}>{t}</span>
            <Testo style={{fontSize:"var(--fs-body-s)"}}>{d}</Testo>
          </Panel>)}
      </div>
    </section>
  </div>;
}
Object.assign(window,{Negozio,Mappa});
