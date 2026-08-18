const{Button,IconButton,Badge,Panel,Icon,CardArt,CardTile,RarityBadge,ConditionBadge,SpecList,Breadcrumb,Tooltip}=window.CartafoliaDesignSystem_3cbf75;
const{Titolo,Testo,Occhiello}=window;

function SchedaCarta({carta,go,onApri,onQuick,onChiedi,mobile,avviso}){
  const[hover,setHover]=React.useState(false);
  const[rot,setRot]=React.useState({x:0,y:0});
  const s=window.setOf(carta.set);
  const move=e=>{const r=e.currentTarget.getBoundingClientRect();setRot({y:((e.clientX-r.left)/r.width-.5)*16,x:-((e.clientY-r.top)/r.height-.5)*16})};
  const tocco=e=>{const t=e.touches[0],r=e.currentTarget.getBoundingClientRect();setHover(true);setRot({y:((t.clientX-r.left)/r.width-.5)*14,x:-((t.clientY-r.top)/r.height-.5)*14})};
  const simili=window.CARDS.filter(c=>c.id!==carta.id&&(c.set===carta.set||c.rarity===carta.rarity)).slice(0,5);
  return <div className="wrap" style={{paddingTop:"var(--sp-8)",paddingBottom:"var(--section-y)"}}>
    <Breadcrumb style={{marginBottom:"var(--sp-8)"}} onNavigate={id=>go(id)}
      items={[{id:"vetrina",label:"Vetrina"},{id:"catalogo",label:"Catalogo"},{id:"espansioni",label:s.name},{label:carta.name}]}/>
    <div className="det">
      <div className="det-fix">
        <div style={{perspective:900}} onMouseMove={move} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>{setHover(false);setRot({x:0,y:0})}}
          onTouchStart={tocco} onTouchMove={tocco} onTouchEnd={()=>{setHover(false);setRot({x:0,y:0})}}>
          <CardArt rarity={carta.rarity} code={window.codeOf(carta)} sheen={hover?1:0} radius="var(--r-lg)"
            style={{transform:`rotateX(${rot.x}deg) rotateY(${rot.y}deg) scale(${hover?1.03:1})`,transformStyle:"preserve-3d",
              transition:"transform var(--dur-base) var(--ease-out)",boxShadow:hover?"var(--sh-glow-cyan)":"var(--sh-2)"}}/>
        </div>
        <div style={{display:"flex",gap:"var(--sp-2)",alignItems:"center",justifyContent:"center"}}>
          <Icon name="info" size={14} style={{color:"var(--text-faint)"}}/>
          <span style={{font:"var(--type-label)",fontSize:"var(--fs-caption)",fontWeight:"var(--fw-regular)",color:"var(--text-muted)"}}>
            {mobile?"Tieni il dito sulla carta per vedere il riflesso":"Muovi il mouse sulla carta per vedere il riflesso"}</span>
        </div>
      </div>
      <div style={{display:"grid",gap:"var(--sp-6)",minWidth:0}}>
        <div style={{display:"grid",gap:"var(--sp-3)"}}>
          <div style={{display:"flex",gap:"var(--sp-2)",alignItems:"center",flexWrap:"wrap"}}>
            <RarityBadge rarity={carta.rarity}/><ConditionBadge condition={carta.cond}/>
            {carta.nuovo&&<Badge tone="foil">Nuovo arrivo</Badge>}
          </div>
          <Titolo livello="pagina">{carta.name}</Titolo>
          <Testo grande>Esposta in vetrina {carta.vetrina}, sotto vetro. È una carta di {s.name} ({s.year}): chiedila in negozio e la guardiamo insieme, fuori dalla bustina.</Testo>
        </div>
        <div style={{display:"flex",gap:"var(--sp-3)",flexWrap:"wrap"}}>
          <Button icon={<Icon name="instagram" size={16}/>} onClick={()=>onChiedi(carta)}>Chiedila in negozio</Button>
          <Button variant="secondary" icon={<Icon name="map-pin" size={16}/>} onClick={()=>go("negozio")}>Come arrivare</Button>
          <Tooltip label="Copia il link della scheda">
            <IconButton icon="share-2" label="Condividi" onClick={()=>{navigator.clipboard&&navigator.clipboard.writeText(location.href);avviso("Link copiato",carta.name+" · "+window.codeOf(carta))}}/>
          </Tooltip>
        </div>
        <div className="g2" style={{gap:"var(--sp-5)",alignItems:"stretch"}}>
          <Panel padding="var(--sp-5)"><SpecList items={[
            {label:"Espansione",value:s.name},{label:"Codice",value:window.codeOf(carta),mono:true},
            {label:"Numero",value:carta.num,mono:true},{label:"Anno",value:String(s.year),mono:true}]}/></Panel>
          <Panel padding="var(--sp-5)"><SpecList items={[
            {label:"Illustrazione",value:carta.artist},{label:"Lingua",value:carta.lang},
            {label:"Condizione",value:window.labelCond(carta.cond)},{label:"In vetrina da",value:carta.entrata,mono:true}]}/></Panel>
        </div>
        <Panel variant="sunken" padding="var(--sp-5)" style={{display:"grid",gap:"var(--sp-2)"}}>
          <Occhiello>Nota di condizione</Occhiello>
          <Testo style={{fontSize:"var(--fs-body-s)",maxWidth:"none"}}>
            {carta.cond==="mint"?"Angoli pieni, superficie senza segni. Non è mai uscita dalla bustina rigida.":
             carta.cond==="near-mint"?"Un micro segno sul bordo, visibile solo in controluce. Centratura buona.":
             carta.cond==="excellent"?"Angoli leggermente smussati, fronte pulito. Nessuna piega.":
             carta.cond==="good"?"Bordi con qualche sbiancatura e un graffio leggero sul retro.":
             "Ha giocato: bordi consumati e una piega d'angolo. Sta in raccoglitore, non in vetrina rigida."}
          </Testo>
        </Panel>
        <div style={{display:"grid",gap:"var(--sp-4)"}}>
          <Titolo livello="piccolo">Nella stessa vetrina</Titolo>
          <div className="cards" style={{gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))"}}>
            {simili.map(c=><CardTile key={c.id} name={c.name} code={window.codeOf(c)} rarity={c.rarity} tilt={!mobile} onClick={()=>onApri(c)}/>)}
          </div>
        </div>
      </div>
    </div>
  </div>;
}
Object.assign(window,{SchedaCarta});
