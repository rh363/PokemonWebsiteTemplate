const{Button,Icon,Panel,Badge,CardArt,Tabs,Chip}=window.CartafoliaDesignSystem_3cbf75;
const{Titolo,Testo,Occhiello,TestaSezione}=window;

function BarraSchedate({s}){
  const q=window.inVetrina(s),perc=Math.round(q/s.total*100);
  return <div style={{display:"grid",gap:6}}>
    <div style={{display:"flex",justifyContent:"space-between",font:"var(--type-code)",color:"var(--text-muted)"}}>
      <span>{q} in vetrina</span><span>{s.total} nell'espansione</span>
    </div>
    <div style={{height:8,borderRadius:"var(--r-pill)",background:"var(--surface-sunken)",overflow:"hidden",border:"1px solid var(--border-hairline)"}}>
      <div style={{width:perc+"%",height:"100%",background:s.color,transition:"width var(--dur-slow) var(--ease-out)"}}/>
    </div>
  </div>;
}

function Espansioni({onApriSet,onQuick,mobile}){
  const[tab,setTab]=React.useState("tutte");
  const list=window.SETS.filter(s=>tab==="tutte"?true:tab==="recenti"?s.year>=2023:s.year<2023);
  return <div className="wrap" style={{paddingTop:"var(--sp-10)",paddingBottom:"var(--section-y)"}}>
    <div style={{display:"grid",gap:"var(--sp-4)",marginBottom:"var(--sp-8)"}}>
      <Occhiello>{window.SETS.length} espansioni</Occhiello>
      <Titolo livello="pagina">Espansioni</Titolo>
      <Testo grande>Teniamo in vetrina una parte di ogni espansione. Qui vedi quante carte abbiamo schedato, e da lì entri nel catalogo già filtrato.</Testo>
      <Tabs items={[{id:"tutte",label:"Tutte"},{id:"recenti",label:"Recenti"},{id:"vintage",label:"Vintage"}]} value={tab} onChange={setTab} style={{marginTop:"var(--sp-2)"}}/>
    </div>
    <div style={{display:"grid",gap:"var(--sp-5)"}}>
      {list.map(s=>{
        const carte=window.CARDS.filter(c=>c.set===s.id);
        return <Panel key={s.id} hoverLift padding={mobile?"var(--sp-5)":"var(--sp-6)"} style={{display:"grid",gridTemplateColumns:mobile?"minmax(0,1fr)":"minmax(0,1fr) auto",gap:"var(--sp-6)",alignItems:"center"}}>
          <div style={{display:"grid",gap:"var(--sp-3)",minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:"var(--sp-3)",flexWrap:"wrap"}}>
              <span style={{width:38,height:38,borderRadius:"var(--r-sm)",background:s.color,flex:"none"}}/>
              <Titolo livello="piccolo" as="h2">{s.name}</Titolo>
              <span style={{font:"var(--type-code)",color:"var(--text-faint)"}}>{s.code} · {s.year} · {carte.length} schedate</span>
              {s.year<2010&&<Badge tone="neutral">Vintage</Badge>}
            </div>
            <BarraSchedate s={s}/>
            <div style={{display:"flex",gap:"var(--sp-2)",flexWrap:"wrap",marginTop:"var(--sp-1)"}}>
              {carte.slice(0,mobile?4:6).map(c=><button key={c.id} onClick={()=>onQuick(c)} title={c.name}
                style={{all:"unset",cursor:"pointer",width:52,borderRadius:"var(--r-cardart)"}}><CardArt rarity={c.rarity}/></button>)}
            </div>
          </div>
          <div style={{display:"grid",gap:"var(--sp-2)",justifyItems:mobile?"stretch":"end"}}>
            <Button variant="secondary" iconRight={<Icon name="arrow-right" size={16}/>} fullWidth={mobile} onClick={()=>onApriSet(s.id)}>Vedi le carte</Button>
          </div>
        </Panel>;
      })}
    </div>
  </div>;
}
Object.assign(window,{Espansioni,BarraSchedate});
