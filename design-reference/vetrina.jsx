const{Button,Icon,Badge,Chip,Panel,SearchField,CardTile,Tabs}=window.CartafoliaDesignSystem_3cbf75;
const{Occhiello,Titolo,Testo,TestaSezione}=window;

function Hero({query,setQuery,onCerca,onQuick,mobile}){
  const sugg=query?window.CARDS.filter(c=>c.name.toLowerCase().includes(query.toLowerCase())).slice(0,5).map(c=>({label:c.name,meta:window.codeOf(c)})):[];
  return <section style={{position:"relative",overflow:"hidden",borderBottom:"1px solid var(--border-hairline)"}}>
    <div style={{position:"absolute",inset:0,background:"var(--pattern-dots) 0 0/var(--pattern-dots-size)",opacity:.7}}/>
    <div className="wrap g2 hero" style={{position:"relative",paddingTop:mobile?"var(--sp-10)":"var(--sp-20)",paddingBottom:mobile?"var(--sp-10)":"var(--sp-16)",gap:"var(--sp-12)"}}>
      <div style={{display:"grid",gap:"var(--sp-6)"}}>
        <Occhiello>Vetrina e catalogo · {window.NEGOZIO.citta}</Occhiello>
        <Titolo livello="hero">100 carte,<br/>schedate a mano.</Titolo>
        <Testo grande>Questo è il catalogo del negozio: cerca una carta, guarda com'è conservata, poi passa a vederla dal vero. Non vendiamo online.</Testo>
        <SearchField size={mobile?"md":"lg"} value={query} onChange={e=>setQuery(e.target.value)} onClear={()=>setQuery("")}
          suggestions={sugg} onPick={s=>onCerca(s.label)} style={{maxWidth:560}}/>
        <div style={{display:"flex",gap:"var(--sp-2)",flexWrap:"wrap",alignItems:"center"}}>
          <span style={{font:"var(--type-label)",fontSize:"var(--fs-caption)",color:"var(--text-faint)",marginRight:4}}>Cercati oggi</span>
          {["Holo","Fornace Antica","Giapponese","Mint"].map(t=><Chip key={t} onClick={()=>onCerca(t==="Holo"||t==="Mint"||t==="Giapponese"?t:t)}>{t}</Chip>)}
        </div>
      </div>
      <div className="cards" style={{gridTemplateColumns:"1fr 1fr",alignContent:"start"}}>
        {window.CARDS.slice(0,4).map((c,i)=><div key={c.id} style={{transform:`rotate(${i%2?1.5:-1.5}deg)`}}>
          <CardTile name={c.name} code={window.codeOf(c)} set={window.setOf(c.set).name} rarity={c.rarity}
            onClick={()=>onQuick(c)} badge={c.nuovo?<Badge tone="foil">Nuovo</Badge>:null}/>
        </div>)}
      </div>
    </div>
  </section>;
}

function NuoviArrivi({onQuick,go}){
  const[tab,setTab]=React.useState("tutte");
  const list=window.CARDS.filter(c=>tab==="tutte"?true:tab==="holo"?["holo","ultra","secret"].includes(c.rarity):window.setOf(c.set).year<2010).slice(0,10);
  return <section className="wrap sez">
    <TestaSezione occhiello="Nuovi arrivi" titolo="Appena entrate in vetrina" testo="Aggiornato ogni martedì, dopo l'apertura delle buste."
      azione={<Tabs items={[{id:"tutte",label:"Tutte"},{id:"holo",label:"Holo e oltre"},{id:"vintage",label:"Vintage"}]} value={tab} onChange={setTab}/>}/>
    <div className="cards">
      {list.map(c=><CardTile key={c.id} name={c.name} code={window.codeOf(c)} set={window.setOf(c.set).name} rarity={c.rarity}
        onClick={()=>onQuick(c)} badge={c.nuovo?<Badge tone="foil">Nuovo</Badge>:null}/>)}
    </div>
    <div style={{display:"flex",justifyContent:"center",marginTop:"var(--sp-10)"}}>
      <Button variant="secondary" iconRight={<Icon name="arrow-right" size={16}/>} onClick={()=>go("catalogo")}>Sfoglia il catalogo</Button>
    </div>
  </section>;
}

function FasciaEspansioni({go,onApriSet}){
  return <section style={{background:"var(--surface-invert)",color:"var(--text-invert)"}}>
    <div className="wrap sez" style={{display:"grid",gap:"var(--sp-10)"}}>
      <TestaSezione tone="invert" occhiello="Espansioni" titolo="Sei espansioni in negozio" style={{marginBottom:0}}
        azione={<Button variant="invert" iconRight={<Icon name="arrow-right" size={16}/>} onClick={()=>go("espansioni")}>Vedi tutte</Button>}/>
      <div className="g3">
        {window.SETS.map(s=><a key={s.id} href="#/catalogo" onClick={e=>{e.preventDefault();onApriSet(s.id)}}
          style={{textDecoration:"none",display:"grid",gap:"var(--sp-3)",padding:"var(--sp-5)",borderRadius:"var(--r-card)",
            background:"var(--surface-invert-soft)",border:"1px solid var(--border-invert)",transition:"var(--t-card)"}}
          onMouseEnter={e=>{e.currentTarget.style.transform="var(--lift-hover)";e.currentTarget.style.borderColor=s.color}}
          onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.borderColor="var(--border-invert)"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span style={{width:34,height:34,borderRadius:"var(--r-sm)",background:s.color}}/>
            <span style={{font:"var(--type-code)",color:"var(--ink-400)"}}>{s.code} · {s.year}</span>
          </div>
          <span style={{font:"var(--fw-bold) var(--fs-title-s)/var(--lh-title-s) var(--font-display)",color:"var(--text-invert)"}}>{s.name}</span>
          <span style={{font:"var(--type-label)",fontSize:"var(--fs-caption)",fontWeight:"var(--fw-medium)",color:"var(--text-invert-muted)"}}>{s.total} carte · {window.inVetrina(s)} in vetrina</span>
        </a>)}
      </div>
    </div>
  </section>;
}

function ComeFunziona({onChiedi}){
  const passi=[
    ["01","Cerca nel catalogo","Filtra per espansione, rarità, condizione. Ogni scheda dice com'è messa la carta."],
    ["02","Scrivici su Instagram o WhatsApp","Copia il codice della carta e mandacelo: ti diciamo se è ancora in vetrina."],
    ["03","Passa a vederla","Te la tiriamo fuori dalla bustina e la guardiamo insieme, sul tavolo grande."]
  ];
  return <section className="wrap sez">
    <TestaSezione occhiello="Come funziona" titolo="Tre passaggi, nessun carrello"
      azione={<Button icon={<Icon name="instagram" size={16}/>} onClick={()=>onChiedi(true)}>Chiedi una carta</Button>}/>
    <div className="g3" style={{gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))"}}>
      {passi.map(([n,t,d])=><Panel key={n} hoverLift padding="var(--sp-6)" style={{display:"grid",gap:"var(--sp-3)",alignContent:"start"}}>
        <span style={{font:"var(--fw-medium) var(--fs-title-m)/1 var(--font-mono)",color:"var(--cherry-500)"}}>{n}</span>
        <span style={{font:"var(--type-card-title)",color:"var(--text-strong)"}}>{t}</span>
        <Testo style={{fontSize:"var(--fs-body-s)"}}>{d}</Testo>
      </Panel>)}
    </div>
  </section>;
}

function StriscaNegozio({go}){
  const n=window.NEGOZIO;
  return <section className="wrap sez g2" style={{paddingTop:0}}>
    <div style={{display:"grid",gap:"var(--sp-5)"}}>
      <Titolo>Il tavolo grande è sempre libero</Titolo>
      <Testo grande>Siamo in {n.via}, a {n.citta}. Le carte del catalogo sono tutte in vetrina: chiedi e te le facciamo vedere dal vivo, senza fretta.</Testo>
      <div style={{display:"flex",gap:"var(--sp-3)",flexWrap:"wrap"}}>
        <Button icon={<Icon name="map-pin" size={16}/>} onClick={()=>go("negozio")}>Come arrivare</Button>
        <Button variant="secondary" icon={<Icon name="info" size={16}/>} onClick={()=>go("about")}>Chi siamo</Button>
      </div>
    </div>
    <Panel variant="sticker" padding="var(--sp-8)" style={{display:"grid",gap:"var(--sp-4)"}}>
      {n.orari.map(([g,h])=><div key={g} style={{display:"flex",justifyContent:"space-between",gap:"var(--sp-4)",paddingBottom:"var(--sp-3)",borderBottom:"1px solid var(--border-hairline)"}}>
        <span style={{font:"var(--type-label)",color:"var(--text-strong)"}}>{g}</span>
        <span style={{font:"var(--type-code)",fontSize:"var(--fs-body-s)",color:"var(--text-body)"}}>{h}</span>
      </div>)}
      <span style={{font:"var(--type-label)",fontSize:"var(--fs-caption)",fontWeight:"var(--fw-regular)",color:"var(--text-muted)"}}>Il martedì apriamo le buste nuove alle 17:00. Si può guardare.</span>
    </Panel>
  </section>;
}

function Vetrina(props){
  return <div><Hero {...props}/><NuoviArrivi {...props}/><FasciaEspansioni {...props}/><ComeFunziona {...props}/><StriscaNegozio {...props}/></div>;
}
Object.assign(window,{Vetrina,Hero,NuoviArrivi,FasciaEspansioni,ComeFunziona,StriscaNegozio});
