const{Button,IconButton,Badge,Chip,Panel,Icon,SearchField,Select,Checkbox,Switch,CardTile,CardArt,RarityBadge,ConditionBadge,FilterGroup,Tabs,Pagination,EmptyState,Skeleton}=window.CartafoliaDesignSystem_3cbf75;
const{Titolo,Testo,Occhiello,Sheet}=window;
const PER_PAGINA=24;

function Filtri({rar,setRar,sets,setSets,cond,setCond,lang,setLang,foil,setFoil,azzera,attivi}){
  const t=(arr,set,v)=>set(arr.includes(v)?arr.filter(x=>x!==v):[...arr,v]);
  const conta=(k,v)=>window.CARDS.filter(c=>c[k]===v).length;
  return <div style={{display:"grid",gap:"var(--sp-2)"}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",minHeight:32}}>
      <span style={{font:"var(--type-label)",fontWeight:"var(--fw-bold)",color:"var(--text-strong)"}}>Filtri {attivi>0&&<span style={{color:"var(--text-brand)"}}>({attivi})</span>}</span>
      {attivi>0&&<button onClick={azzera} style={{all:"unset",cursor:"pointer",font:"var(--type-label)",fontSize:"var(--fs-caption)",color:"var(--text-muted)",textDecoration:"underline"}}>azzera</button>}
    </div>
    <Switch checked={foil} label="Solo foil" onChange={()=>setFoil(!foil)} style={{margin:"var(--sp-2) 0"}}/>
    <FilterGroup title="Rarità" activeCount={rar.length}>
      {window.RARITA.map(([id,l])=><Checkbox key={id} checked={rar.includes(id)} label={l} count={conta("rarity",id)} onChange={()=>t(rar,setRar,id)}/>)}
    </FilterGroup>
    <FilterGroup title="Espansione" activeCount={sets.length}>
      {window.SETS.map(s=><Checkbox key={s.id} checked={sets.includes(s.id)} label={s.name} description={s.code+" · "+s.year} count={conta("set",s.id)} onChange={()=>t(sets,setSets,s.id)}/>)}
    </FilterGroup>
    <FilterGroup title="Condizione" activeCount={cond.length} defaultOpen={false}>
      {window.CONDIZIONI.map(([id,l])=><Checkbox key={id} checked={cond.includes(id)} label={l} count={conta("cond",id)} onChange={()=>t(cond,setCond,id)}/>)}
    </FilterGroup>
    <FilterGroup title="Lingua" activeCount={lang.length} defaultOpen={false}>
      {window.LINGUE.map(l=><Checkbox key={l} checked={lang.includes(l)} label={l} count={conta("lang",l)} onChange={()=>t(lang,setLang,l)}/>)}
    </FilterGroup>
  </div>;
}

function Catalogo({query,setQuery,preset,onQuick,onApri,mobile}){
  const[rar,setRar]=React.useState(preset&&preset.rar||[]);
  const[sets,setSets]=React.useState(preset&&preset.sets||[]);
  const[cond,setCond]=React.useState([]);
  const[lang,setLang]=React.useState([]);
  const[foil,setFoil]=React.useState(false);
  const[view,setView]=React.useState("griglia");
  const[sort,setSort]=React.useState("Novità");
  const[page,setPage]=React.useState(1);
  const[loading,setLoading]=React.useState(false);
  const[sheet,setSheet]=React.useState(false);
  const azzera=()=>{setRar([]);setSets([]);setCond([]);setLang([]);setFoil(false)};
  React.useEffect(()=>{setLoading(true);setPage(1);const t=setTimeout(()=>setLoading(false),340);return()=>clearTimeout(t)},[rar,sets,cond,lang,foil,query,sort]);
  const q=query.trim().toLowerCase();
  const cerca=c=>!q||[c.name,window.codeOf(c),window.setOf(c.set).name,window.labelRarita(c.rarity),window.labelCond(c.cond),c.lang,c.artist].join(" ").toLowerCase().includes(q);
  const lista=window.CARDS.filter(c=>
    (!rar.length||rar.includes(c.rarity))&&(!sets.length||sets.includes(c.set))&&
    (!cond.length||cond.includes(c.cond))&&(!lang.length||lang.includes(c.lang))&&
    (!foil||["holo","ultra","secret"].includes(c.rarity))&&cerca(c));
  const ordinata=[...lista].sort((a,b)=>
    sort==="A–Z"?a.name.localeCompare(b.name):
    sort==="Rarità"?window.RANK[b.rarity]-window.RANK[a.rarity]||a.name.localeCompare(b.name):
    sort==="Espansione"?window.setOf(a.set).name.localeCompare(window.setOf(b.set).name)||a.num.localeCompare(b.num):
    (b.nuovo?1:0)-(a.nuovo?1:0)||a.ordine-b.ordine);
  const pagine=Math.max(1,Math.ceil(ordinata.length/PER_PAGINA));
  const pag=ordinata.slice((page-1)*PER_PAGINA,page*PER_PAGINA);
  const attivi=rar.length+sets.length+cond.length+lang.length+(foil?1:0);
  const filtriProps={rar,setRar,sets,setSets,cond,setCond,lang,setLang,foil,setFoil,azzera,attivi};
  const chips=[...rar.map(r=>[r,window.labelRarita(r),()=>setRar(rar.filter(x=>x!==r))]),
    ...sets.map(s=>[s,window.setOf(s).name,()=>setSets(sets.filter(x=>x!==s))]),
    ...cond.map(c=>[c,window.labelCond(c),()=>setCond(cond.filter(x=>x!==c))]),
    ...lang.map(l=>[l,l,()=>setLang(lang.filter(x=>x!==l))]),
    ...(foil?[["foil","Solo foil",()=>setFoil(false)]]:[])];
  return <div className="wrap" style={{paddingTop:"var(--sp-10)",paddingBottom:"var(--section-y)"}}>
    <div style={{display:"grid",gap:"var(--sp-4)",marginBottom:"var(--sp-8)"}}>
      <Occhiello>{window.CARDS.length} carte schedate</Occhiello>
      <Titolo livello="pagina">Catalogo</Titolo>
      <SearchField size="md" value={query} onChange={e=>setQuery(e.target.value)} onClear={()=>setQuery("")}
        placeholder="Cerca per nome, codice, espansione, condizione…" style={{maxWidth:640}}/>
    </div>
    <div className="cat">
      <aside className="side"><Filtri {...filtriProps}/></aside>
      <div style={{display:"grid",gap:"var(--sp-5)",minWidth:0}}>
        <div style={{display:"flex",alignItems:"center",gap:"var(--sp-3)",flexWrap:"wrap"}}>
          <span style={{font:"var(--type-code)",fontSize:"var(--fs-body-s)",color:"var(--text-muted)"}}>{ordinata.length} carte</span>
          <div className="only-mob"><Button size="sm" variant="secondary" icon={<Icon name="filter" size={16}/>} onClick={()=>setSheet(true)}>Filtri{attivi>0?" ("+attivi+")":""}</Button></div>
          <div className="hide-mob" style={{display:"flex",gap:"var(--sp-2)",flexWrap:"wrap"}}>
            {chips.map(([k,l,rm])=><Chip key={k} onRemove={rm}>{l}</Chip>)}
          </div>
          <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:"var(--sp-3)"}}>
            <Select size="sm" value={sort} options={["Novità","Rarità","A–Z","Espansione"]} onChange={e=>setSort(e.target.value)}/>
            <Tabs variant="pill" items={[{id:"griglia",label:"Griglia"},{id:"lista",label:"Lista"}]} value={view} onChange={setView}/>
          </div>
        </div>
        {chips.length>0&&<div className="only-mob" style={{display:"flex",gap:"var(--sp-2)",flexWrap:"wrap"}}>
          {chips.map(([k,l,rm])=><Chip key={k} onRemove={rm}>{l}</Chip>)}
        </div>}
        {loading
          ? <div className="cards">{Array.from({length:8}).map((_,i)=>
              <div key={i} style={{display:"grid",gap:10,padding:12,background:"var(--surface-card)",border:"1px solid var(--border-hairline)",borderRadius:"var(--r-card)"}}><Skeleton shape="card"/><Skeleton count={2}/></div>)}</div>
          : ordinata.length===0
          ? <EmptyState title="Nessuna carta con questi filtri" description="Prova a togliere la rarità o ad allargare l'espansione."
              action={<Button variant="secondary" onClick={()=>{azzera();setQuery("")}}>Azzera i filtri</Button>}/>
          : view==="griglia"
          ? <div className="cards">
              {pag.map(c=><CardTile key={c.id} name={c.name} code={window.codeOf(c)} set={window.setOf(c.set).name} rarity={c.rarity}
                tilt={!mobile} onClick={()=>onQuick(c)} badge={c.nuovo?<Badge tone="foil">Nuovo</Badge>:null}/>)}
            </div>
          : <Panel padding="0" style={{overflow:"hidden"}}>
              {pag.map((c,i)=><div key={c.id} onClick={()=>onApri(c)} style={{display:"flex",alignItems:"center",gap:"var(--sp-4)",padding:"var(--sp-3) var(--sp-4)",minHeight:64,cursor:"pointer",borderTop:i?"1px solid var(--border-hairline)":"none"}}>
                <div style={{width:40,flex:"none"}}><CardArt rarity={c.rarity}/></div>
                <div style={{flex:1,minWidth:0,display:"grid",gap:2}}>
                  <span style={{font:"var(--type-card-title)",color:"var(--text-strong)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</span>
                  <span style={{font:"var(--type-code)",color:"var(--text-faint)"}}>{window.codeOf(c)} · {c.lang}</span>
                </div>
                <div className="hide-mob" style={{display:"flex",gap:"var(--sp-2)",alignItems:"center"}}>
                  <RarityBadge rarity={c.rarity} size="sm"/><ConditionBadge condition={c.cond} compact/>
                </div>
                <IconButton icon="chevron-right" size="sm" variant="ghost" label="Vedi la scheda"/>
              </div>)}
            </Panel>}
        {!loading&&ordinata.length>0&&<div style={{display:"flex",justifyContent:"center",paddingTop:"var(--sp-6)"}}>
          <Pagination page={page} pages={pagine} onChange={p=>{setPage(p);window.scrollTo({top:0,behavior:"smooth"})}}/>
        </div>}
      </div>
    </div>
    <Sheet open={sheet} onClose={()=>setSheet(false)} title="Filtri"
      footer={<><Button variant="secondary" onClick={azzera} style={{flex:1}}>Azzera</Button><Button onClick={()=>setSheet(false)} style={{flex:1}}>Vedi {ordinata.length} carte</Button></>}>
      <Filtri {...filtriProps}/>
    </Sheet>
  </div>;
}
Object.assign(window,{Catalogo,Filtri});
