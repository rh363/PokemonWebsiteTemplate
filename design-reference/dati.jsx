const SETS=[
  {id:"alb",name:"Alba Cromatica",code:"ALB",year:2024,total:198,color:"var(--cherry-500)"},
  {id:"eco",name:"Eco del Vulcano",code:"ECO",year:2024,total:165,color:"var(--lemon-500)"},
  {id:"mar",name:"Marea Silente",code:"MAR",year:2023,total:172,color:"var(--cyan-500)"},
  {id:"rad",name:"Radici Profonde",code:"RAD",year:2023,total:154,color:"var(--lime-500)"},
  {id:"cie",name:"Cieli Spezzati",code:"CIE",year:2022,total:189,color:"var(--grape-500)"},
  {id:"for",name:"Fornace Antica",code:"FOR",year:1999,total:102,color:"var(--ink-500)"}
];
const NOMI=["Fulmine","Guardiano","Ala","Serpe","Riccio","Scudo","Volpe","Coleottero","Lupo","Rana","Falco","Tartaruga","Cervo","Salamandra","Gufo","Tasso","Corvo","Lince","Granchio","Pipistrello","Ariete","Talpa","Cavalletta","Anguilla","Istrice"];
const QUAL=["di Notte","di Bosco","di Cenere","di Marea","di Quarzo","di Bruma","d'Ottone","di Vetro","di Pioggia","di Sale","di Ferro","d'Ambra","di Nebbia","di Brace","di Sabbia","d'Argento","di Pietra","Cremisi","Solare","di Lampo"];
const RAR=["common","common","common","common","uncommon","uncommon","uncommon","rare","rare","holo","holo","ultra","secret"];
const COND=["mint","near-mint","near-mint","excellent","excellent","good","good","played"];
const LANG=["Italiano","Italiano","Italiano","Italiano","Inglese","Inglese","Giapponese"];
const ART=["M. Ferretti","S. Adani","L. Bonetti","G. Prandi","R. Colella","ignoto"];
const MESI=["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio","settembre","ottobre","novembre"];

let _s=7;const rnd=()=>{_s=(_s*16807)%2147483647;return _s/2147483647};
const pick=a=>a[Math.floor(rnd()*a.length)];

const CARDS=[];
const visti=new Set();
while(CARDS.length<100){
  const nome=pick(NOMI)+" "+pick(QUAL);
  if(visti.has(nome))continue;
  visti.add(nome);
  const s=pick(SETS);
  const n=1+Math.floor(rnd()*s.total);
  const i=CARDS.length+1;
  CARDS.push({
    id:i,name:nome,set:s.id,
    num:String(n).padStart(3,"0")+"/"+s.total,
    rarity:pick(RAR),cond:pick(COND),lang:pick(LANG),artist:pick(ART),
    nuovo:i<=9,vetrina:1+Math.floor(rnd()*4),
    entrata:(1+Math.floor(rnd()*27))+" "+pick(MESI),
    ordine:Math.floor(rnd()*1000)
  });
}

const RARITA=[["common","Comune"],["uncommon","Non comune"],["rare","Rara"],["holo","Holo"],["ultra","Ultra rara"],["secret","Segreta"]];
const CONDIZIONI=[["mint","Mint"],["near-mint","Near Mint"],["excellent","Excellent"],["good","Good"],["played","Played"]];
const LINGUE=["Italiano","Inglese","Giapponese"];
const RANK={common:0,uncommon:1,rare:2,holo:3,ultra:4,secret:5};

const setOf=id=>SETS.find(s=>s.id===id)||SETS[0];
const codeOf=c=>setOf(c.set).code+" "+c.num;
const labelRarita=r=>(RARITA.find(x=>x[0]===r)||["","—"])[1];
const labelCond=c=>(CONDIZIONI.find(x=>x[0]===c)||["","—"])[1];
const inVetrina=s=>Math.round(s.total*0.42);
const NEGOZIO={
  citta:"Ceccano",via:"via Roma 12",cap:"03023 Ceccano (FR)",
  orari:[["Martedì – Sabato","10:00 – 19:30"],["Domenica","15:00 – 19:00"],["Lunedì","chiuso"]],
  instagram:"@cartafolia.ceccano",tiktok:"@cartafolia",whatsapp:"+39 000 000 0000"
};
Object.assign(window,{SETS,CARDS,RARITA,CONDIZIONI,LINGUE,RANK,setOf,codeOf,labelRarita,labelCond,inVetrina,NEGOZIO});
