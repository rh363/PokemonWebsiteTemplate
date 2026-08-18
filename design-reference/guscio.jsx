const{NavBar,Button,IconButton,Icon,Toast,Dialog,Badge,CardArt,SpecList,RarityBadge,ConditionBadge}=window.CartafoliaDesignSystem_3cbf75;
const{useMedia,Sheet,Titolo,Testo,Occhiello,SOCIAL}=window;

const NAV=[{id:"vetrina",label:"Vetrina"},{id:"catalogo",label:"Catalogo",count:window.CARDS.length},{id:"espansioni",label:"Espansioni"},{id:"negozio",label:"Il negozio"},{id:"about",label:"Chi siamo"}];

function leggiHash(){
  const h=(location.hash||"").replace(/^#\/?/,"").split("/");
  const r=h[0]||"vetrina";
  if(r==="carta"&&h[1])return{nome:"carta",id:Number(h[1])};
  return{nome:NAV.some(n=>n.id===r)?r:"vetrina"};
}

function HeaderMobile({route,onMenu,onCerca}){
  const[scroll,setScroll]=React.useState(false);
  React.useEffect(()=>{const el=document.scrollingElement||document.documentElement,h=()=>setScroll(el.scrollTop>8);window.addEventListener("scroll",h,{passive:true});h();return()=>window.removeEventListener("scroll",h)},[]);
  return <header style={{position:"sticky",top:0,zIndex:50,background:scroll?"var(--glass-bg)":"var(--surface-page)",backdropFilter:scroll?"var(--glass-blur)":"none",borderBottom:`1px solid ${scroll?"var(--border-subtle)":"transparent"}`,transition:"var(--t-control)"}}>
    <div style={{display:"flex",alignItems:"center",gap:"var(--sp-3)",padding:"10px var(--gutter-lg)"}}>
      <a href="#/vetrina" style={{display:"flex",alignItems:"center",gap:8,textDecoration:"none",flex:1,minWidth:0}}>
        <img src="assets/logo-mark.svg" alt="" width="30" height="30"/>
        <span style={{font:"var(--fw-black) var(--fs-title-s)/1 var(--font-display)",letterSpacing:"-0.04em",color:"var(--text-strong)"}}>cartafolia</span>
      </a>
      <IconButton icon="search" variant="ghost" label="Cerca una carta" onClick={onCerca}/>
      <IconButton icon="list" variant="secondary" label="Menu" onClick={onMenu}/>
    </div>
  </header>;
}

function MenuMobile({open,onClose,route,go,onChiedi}){
  return <Sheet open={open} onClose={onClose} title="Menu">
    <div style={{display:"grid",gap:"var(--sp-1)",paddingBottom:"var(--sp-4)"}}>
      {NAV.map(n=><a key={n.id} href={"#/"+n.id} onClick={()=>{onClose();go(n.id)}}
        style={{display:"flex",alignItems:"center",gap:"var(--sp-3)",minHeight:56,padding:"0 var(--sp-4)",borderRadius:"var(--r-pill)",textDecoration:"none",
          background:route===n.id?"var(--surface-brand-soft)":"transparent",
          font:"var(--fw-bold) var(--fs-title-s)/1.2 var(--font-display)",color:"var(--text-strong)"}}>
        <span style={{flex:1}}>{n.label}</span>
        {n.count!=null&&<span style={{font:"var(--type-code)",color:"var(--text-faint)"}}>{n.count}</span>}
        <Icon name="chevron-right" size={18} style={{color:"var(--text-faint)"}}/>
      </a>)}
    </div>
    <Button fullWidth icon={<Icon name="instagram" size={16}/>} onClick={()=>{onClose();onChiedi(true)}}>Chiedi una carta</Button>
  </Sheet>;
}

function Footer({go}){
  const n=window.NEGOZIO;
  return <footer style={{background:"var(--surface-invert)",color:"var(--text-invert-muted)",marginTop:"var(--sp-16)"}}>
    <div className="wrap foot" style={{paddingTop:"var(--sp-12)",paddingBottom:"var(--sp-12)"}}>
      <div style={{display:"grid",gap:"var(--sp-3)",alignContent:"start"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <img src="assets/logo-mark.svg" width="28" height="28" alt=""/>
          <span style={{font:"var(--fw-black) var(--fs-title-s)/1 var(--font-display)",letterSpacing:"-0.04em",color:"var(--text-invert)"}}>cartafolia</span>
        </div>
        <p style={{font:"var(--type-body)",fontSize:"var(--fs-body-s)",maxWidth:320}}>Vetrina e catalogo di carte da collezione. {n.via}, {n.citta}. Non vendiamo online: passa in negozio.</p>
      </div>
      <div style={{display:"grid",gap:"var(--sp-3)",alignContent:"start"}}>
        <span style={{font:"var(--type-eyebrow)",letterSpacing:"var(--ls-eyebrow)",textTransform:"uppercase",color:"var(--ink-400)"}}>Sito</span>
        {NAV.map(i=><a key={i.id} href={"#/"+i.id} onClick={()=>go(i.id)} style={{font:"var(--type-body)",fontSize:"var(--fs-body-s)",color:"var(--text-invert-muted)",textDecoration:"none"}}>{i.label}</a>)}
      </div>
      <div style={{display:"grid",gap:"var(--sp-3)",alignContent:"start"}}>
        <span style={{font:"var(--type-eyebrow)",letterSpacing:"var(--ls-eyebrow)",textTransform:"uppercase",color:"var(--ink-400)"}}>Orari</span>
        {n.orari.map(([g,h])=><span key={g} style={{font:"var(--type-body)",fontSize:"var(--fs-body-s)"}}>{g}<br/><span style={{font:"var(--type-code)",color:"var(--ink-400)"}}>{h}</span></span>)}
      </div>
      <div style={{display:"grid",gap:"var(--sp-3)",alignContent:"start"}}>
        <span style={{font:"var(--type-eyebrow)",letterSpacing:"var(--ls-eyebrow)",textTransform:"uppercase",color:"var(--ink-400)"}}>Scrivici</span>
        {SOCIAL.map(s=><a key={s.id} href="#" onClick={e=>e.preventDefault()} style={{display:"flex",alignItems:"center",gap:8,font:"var(--type-body)",fontSize:"var(--fs-body-s)",color:"var(--text-invert-muted)",textDecoration:"none"}}>
          <Icon name={s.icon} size={14}/>{s.valore()}</a>)}
      </div>
    </div>
    <div style={{borderTop:"1px solid var(--border-invert)"}}>
      <div className="wrap" style={{paddingTop:"var(--sp-4)",paddingBottom:"var(--sp-4)",display:"flex",justifyContent:"space-between",gap:"var(--sp-4)",flexWrap:"wrap"}}>
        <span style={{font:"var(--type-code)",color:"var(--ink-500)"}}>© 2026 Cartafolia · {n.cap}</span>
        <span style={{font:"var(--type-code)",color:"var(--ink-500)"}}>Le carte mostrate sono proprietà dei rispettivi titolari.</span>
      </div>
    </div>
  </footer>;
}

function DettagliChiedi({carta,onCopia}){
  const n=window.NEGOZIO;
  const testo=carta?`Ciao, ho visto ${carta.name} (${window.codeOf(carta)}) sul sito. È ancora in vetrina?`:"Ciao, sto cercando una carta. La avete in vetrina?";
  return <div style={{display:"grid",gap:"var(--sp-5)"}}>
    <Testo>Scrivici e ti diciamo se è ancora in vetrina. Rispondiamo negli orari di apertura, di solito in giornata.</Testo>
    <div style={{display:"grid",gap:"var(--sp-2)",padding:"var(--sp-4)",background:"var(--surface-sunken)",borderRadius:"var(--r-md)",border:"1px solid var(--border-hairline)"}}>
      <span style={{font:"var(--type-eyebrow)",letterSpacing:"var(--ls-eyebrow)",textTransform:"uppercase",color:"var(--text-muted)"}}>Messaggio pronto</span>
      <span style={{font:"var(--type-code)",fontSize:"var(--fs-body-s)",color:"var(--text-body)",lineHeight:1.6}}>{testo}</span>
      <div><Button size="sm" variant="secondary" icon={<Icon name="share-2" size={16}/>} onClick={()=>onCopia(testo)}>Copia il messaggio</Button></div>
    </div>
    <div style={{display:"grid",gap:"var(--sp-2)"}}>
      {SOCIAL.map((s,i)=><Button key={s.id} as="a" href="#" onClick={e=>e.preventDefault()} fullWidth variant={i===0?"primary":"secondary"}
        icon={<Icon name={s.icon} size={16}/>} iconRight={<Icon name="arrow-right" size={16} style={{marginLeft:"auto"}}/>}
        style={{justifyContent:"flex-start"}}>{s.label} · {s.valore()}</Button>)}
    </div>
  </div>;
}

function App(){
  const mobile=useMedia("(max-width:1080px)");
  const[route,setRoute]=React.useState(leggiHash);
  const[query,setQuery]=React.useState("");
  const[preset,setPreset]=React.useState(null);
  const[menu,setMenu]=React.useState(false);
  const[quick,setQuick]=React.useState(null);
  const[chiedi,setChiedi]=React.useState(null);
  const[toast,setToast]=React.useState(null);
  React.useEffect(()=>{const h=()=>setRoute(leggiHash());window.addEventListener("hashchange",h);return()=>window.removeEventListener("hashchange",h)},[]);
  const avviso=(title,description,tone)=>{setToast({title,description,tone:tone||"success"});clearTimeout(window.__cft);window.__cft=setTimeout(()=>setToast(null),2800)};
  const go=(nome,id)=>{const r=id?{nome,id}:{nome};setRoute(r);location.hash="/"+nome+(id?"/"+id:"");window.scrollTo(0,0)};
  const apriCarta=c=>{setQuick(null);go("carta",c.id)};
  const cerca=q=>{setQuery(q);setPreset(null);go("catalogo")};
  const apriSet=s=>{setQuery("");setPreset({sets:[s]});go("catalogo")};
  const apriRarita=r=>{setQuery("");setPreset({rar:[r]});go("catalogo")};
  const copia=t=>{navigator.clipboard&&navigator.clipboard.writeText(t);avviso("Messaggio copiato","Incollalo su Instagram o WhatsApp.")};
  const props={query,setQuery,preset,go,onApri:apriCarta,onQuick:setQuick,onChiedi:setChiedi,onCerca:cerca,onApriSet:apriSet,onApriRarita:apriRarita,mobile,avviso};
  const attivo=route.nome==="carta"?"catalogo":route.nome;
  const carta=route.nome==="carta"?window.CARDS.find(c=>c.id===route.id):null;
  const anteprima=quick&&<div style={{display:"flex",gap:"var(--sp-5)",flexWrap:mobile?"wrap":"nowrap"}}>
    <div style={{width:mobile?120:150,flex:"none"}}><CardArt rarity={quick.rarity} code={window.codeOf(quick)}/></div>
    <SpecList style={{flex:1,minWidth:180}} items={[
      {label:"Codice",value:window.codeOf(quick),mono:true},
      {label:"Espansione",value:window.setOf(quick.set).name},
      {label:"Rarità",value:<RarityBadge rarity={quick.rarity} size="sm"/>},
      {label:"Condizione",value:<ConditionBadge condition={quick.cond} compact/>},
      {label:"Lingua",value:quick.lang},
      {label:"In vetrina",value:"vetrina "+quick.vetrina}]}/>
  </div>;
  const azioniAnteprima=quick&&<>
    <Button variant="secondary" onClick={()=>{setChiedi(quick);setQuick(null)}}>Chiedila in negozio</Button>
    <Button onClick={()=>apriCarta(quick)}>Vedi la scheda</Button>
  </>;
  return <div style={{minHeight:"100vh",display:"flex",flexDirection:"column"}}>
    {mobile
      ? <HeaderMobile route={attivo} onMenu={()=>setMenu(true)} onCerca={()=>go("catalogo")}/>
      : <NavBar items={NAV} active={attivo} onNavigate={go} logoSrc="assets/logo-mark.svg"
          right={<>
            <IconButton icon="search" variant="ghost" label="Cerca" onClick={()=>go("catalogo")}/>
            <Button size="sm" icon={<Icon name="instagram" size={16}/>} onClick={()=>setChiedi(true)}>Chiedi una carta</Button>
          </>}/>}
    <main style={{flex:1}} key={route.nome+(route.id||"")} className="fade-in">
      {route.nome==="vetrina"&&<window.Vetrina {...props}/>}
      {route.nome==="catalogo"&&<window.Catalogo {...props}/>}
      {route.nome==="espansioni"&&<window.Espansioni {...props}/>}
      {route.nome==="negozio"&&<window.Negozio {...props}/>}
      {route.nome==="about"&&<window.About {...props}/>}
      {route.nome==="carta"&&(carta?<window.SchedaCarta carta={carta} {...props}/>:<div className="wrap sez"><Titolo>Carta non trovata</Titolo></div>)}
    </main>
    <Footer go={go}/>
    <MenuMobile open={menu} onClose={()=>setMenu(false)} route={attivo} go={go} onChiedi={setChiedi}/>
    {mobile
      ? <Sheet open={!!quick} onClose={()=>setQuick(null)} title={quick&&quick.name} footer={azioniAnteprima}>{anteprima}</Sheet>
      : <Dialog open={!!quick} title={quick&&quick.name} eyebrow={quick&&window.setOf(quick.set).name} onClose={()=>setQuick(null)} footer={azioniAnteprima} width={620}>{anteprima}</Dialog>}
    {mobile
      ? <Sheet open={!!chiedi} onClose={()=>setChiedi(null)} title={chiedi&&chiedi.name?chiedi.name:"Chiedi una carta"}>
          <DettagliChiedi carta={chiedi&&chiedi.name?chiedi:null} onCopia={copia}/></Sheet>
      : <Dialog open={!!chiedi} eyebrow="Chiedi in negozio" title={chiedi&&chiedi.name?chiedi.name:"Chiedi una carta"} onClose={()=>setChiedi(null)} width={520}>
          <DettagliChiedi carta={chiedi&&chiedi.name?chiedi:null} onCopia={copia}/></Dialog>}
    <div style={{position:"fixed",right:mobile?"var(--sp-4)":"var(--sp-6)",left:mobile?"var(--sp-4)":"auto",bottom:"var(--sp-6)",zIndex:95,display:"grid",gap:10,
      opacity:toast?1:0,transform:toast?"translateY(0)":"translateY(12px)",
      transition:"opacity var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-spring)",pointerEvents:toast?"auto":"none"}}>
      {toast&&<Toast tone={toast.tone} title={toast.title} description={toast.description} onClose={()=>setToast(null)}/>}
    </div>
  </div>;
}
Object.assign(window,{App,Footer,HeaderMobile,MenuMobile,DettagliChiedi});
