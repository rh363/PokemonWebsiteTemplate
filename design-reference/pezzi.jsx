const{Icon,IconButton,Button}=window.CartafoliaDesignSystem_3cbf75;

function useMedia(q){
  const[m,setM]=React.useState(()=>window.matchMedia(q).matches);
  React.useEffect(()=>{const mm=window.matchMedia(q),h=e=>setM(e.matches);mm.addEventListener("change",h);setM(mm.matches);return()=>mm.removeEventListener("change",h)},[q]);
  return m;
}

function Occhiello({children,tone,style}){
  return <span style={{font:"var(--type-eyebrow)",letterSpacing:"var(--ls-eyebrow)",textTransform:"uppercase",color:tone==="invert"?"var(--cyan-400)":"var(--text-brand)",...style}}>{children}</span>;
}

function Titolo({children,livello="sezione",tone,style,as}){
  const F={hero:"var(--fw-black) var(--fs-display-xl)/var(--lh-display-xl) var(--font-display)",
    pagina:"var(--fw-bold) var(--fs-display-l)/var(--lh-display-l) var(--font-display)",
    sezione:"var(--type-section)",
    piccolo:"var(--fw-bold) var(--fs-title-m)/var(--lh-title-m) var(--font-display)"};
  const L={hero:"var(--ls-display-xl)",pagina:"var(--ls-display-l)",sezione:"var(--ls-display-m)",piccolo:"var(--ls-title-m)"};
  const Tag=as||(livello==="hero"||livello==="pagina"?"h1":livello==="sezione"?"h2":"h3");
  return <Tag style={{font:F[livello],letterSpacing:L[livello],color:tone==="invert"?"var(--text-invert)":"var(--text-strong)",textWrap:"pretty",...style}}>{children}</Tag>;
}

function Testo({children,grande,tone,style}){
  return <p style={{font:"var(--type-body)",fontSize:grande?"var(--fs-body-l)":"var(--fs-body-m)",lineHeight:grande?"var(--lh-body-l)":"var(--lh-body-m)",color:tone==="invert"?"var(--text-invert-muted)":"var(--text-muted)",maxWidth:"62ch",textWrap:"pretty",...style}}>{children}</p>;
}

function TestaSezione({occhiello,titolo,testo,azione,tone,style}){
  return <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",gap:"var(--sp-6)",flexWrap:"wrap",marginBottom:"var(--sp-8)",...style}}>
    <div style={{display:"grid",gap:"var(--sp-2)"}}>
      {occhiello&&<Occhiello tone={tone}>{occhiello}</Occhiello>}
      <Titolo tone={tone}>{titolo}</Titolo>
      {testo&&<Testo tone={tone}>{testo}</Testo>}
    </div>
    {azione}
  </div>;
}

/** Pannello che sale dal basso: navigazione e filtri su mobile. */
function Sheet({open,onClose,title,children,footer}){
  React.useEffect(()=>{
    if(!open)return;
    const h=e=>{if(e.key==="Escape")onClose&&onClose()};
    window.addEventListener("keydown",h);
    const prev=document.body.style.overflow;document.body.style.overflow="hidden";
    return()=>{window.removeEventListener("keydown",h);document.body.style.overflow=prev};
  },[open,onClose]);
  if(!open)return null;
  return <div className="fade-in" onClick={onClose} style={{position:"fixed",inset:0,zIndex:90,background:"var(--scrim-modal)",backdropFilter:"blur(3px)",display:"flex",alignItems:"flex-end"}}>
    <div className="sheet-in" onClick={e=>e.stopPropagation()} role="dialog" aria-modal="true" aria-label={title}
      style={{width:"100%",maxHeight:"86vh",display:"flex",flexDirection:"column",background:"var(--surface-card)",
        borderTop:"var(--bw-strong) solid var(--ink-950)",borderTopLeftRadius:"var(--r-xl)",borderTopRightRadius:"var(--r-xl)",boxShadow:"var(--sh-3)"}}>
      <div style={{position:"relative",display:"flex",alignItems:"center",gap:"var(--sp-4)",padding:"var(--sp-5) var(--sp-5) var(--sp-3)"}}>
        <span style={{position:"absolute",top:8,left:"50%",transform:"translateX(-50%)",width:44,height:5,borderRadius:"var(--r-pill)",background:"var(--ink-100)"}}/>
        <span style={{flex:1,font:"var(--fw-bold) var(--fs-title-s)/var(--lh-title-s) var(--font-display)",color:"var(--text-strong)"}}>{title}</span>
        <IconButton icon="x" variant="ghost" label="Chiudi" onClick={onClose}/>
      </div>
      <div style={{flex:1,overflow:"auto",padding:"var(--sp-2) var(--sp-5) var(--sp-6)"}}>{children}</div>
      {footer&&<div style={{padding:"var(--sp-4) var(--sp-5)",borderTop:"1px solid var(--border-hairline)",display:"flex",gap:"var(--sp-3)",background:"var(--surface-card)"}}>{footer}</div>}
    </div>
  </div>;
}

const SOCIAL=[
  {id:"instagram",icon:"instagram",label:"Instagram",valore:()=>window.NEGOZIO.instagram},
  {id:"tiktok",icon:"sparkles",label:"TikTok",valore:()=>window.NEGOZIO.tiktok},
  {id:"whatsapp",icon:"message-circle",label:"WhatsApp",valore:()=>window.NEGOZIO.whatsapp}
];

Object.assign(window,{useMedia,Occhiello,Titolo,Testo,TestaSezione,Sheet,SOCIAL});
