import { useState, useMemo, useEffect } from "react";
import { DB } from "../../data/countries";
import { CAT_KEYS, CATS } from "../../data/categories";
import { shuffle } from "../../engine/utils";
import Flag from "../ui/Flag";
import { REV_POOL, pickRevCats } from "../../engine/reverseMode";
import { usePersistentState, loadKey, saveKey } from "../../engine/storage";

// ─── COUNTRY QUIZ (formerly Reverse Mode) ───
export default function CountryQuiz({onBack,t}){
  // Persist the shuffled order + position + score so the tab resumes on refresh.
  const [pool]=useState(()=>loadKey("cq_pool", null)||shuffle([...REV_POOL],()=>Math.random()));
  useEffect(()=>{saveKey("cq_pool",pool);},[pool]);
  const [idx,setIdx]=usePersistentState("cq_idx",0);
  const [sel,setSel]=useState(new Set());
  const [rev,setRev]=useState(false);
  const [tot,setTot]=usePersistentState("cq_tot",{c:0,t:0});

  const co=DB.find(c=>c.name===pool[idx%pool.length]);
  // Dynamic categories per country
  const revData=useMemo(()=>pickRevCats(co),[co]);
  const cats=revData.cats;
  const correctSet=new Set(CAT_KEYS.filter(k=>CATS[k].t(co)));

  const submit=()=>{if(rev)return;
    let p=0;cats.forEach(id=>{if(correctSet.has(id)&&sel.has(id))p++;});
    const totalTrue=cats.filter(id=>correctSet.has(id)).length;
    setTot(s=>({c:s.c+p,t:s.t+totalTrue}));setRev(true);};
  const next=()=>{setIdx(i=>i+1);setSel(new Set());setRev(false);};
  const tog=id=>{if(rev)return;const n=new Set(sel);n.has(id)?n.delete(id):n.add(id);setSel(n);};

  const cs=id=>{
    const isC=correctSet.has(id),isS=sel.has(id);
    if(rev){if(isC&&isS)return{bg:t.okBg,bd:t.okBd,col:t.ok};if(isC&&!isS)return{bg:`${t.honey}18`,bd:t.honey,col:t.honey};if(!isC&&isS)return{bg:t.noBg,bd:t.noBd,col:t.pri};return{bg:t.sf,bd:t.bd,col:t.txD};}
    if(isS)return{bg:t.selBg,bd:t.selBd,col:t.sec};return{bg:t.sf,bd:t.bd,col:t.txM};};

  const trueCount=cats.filter(id=>correctSet.has(id)).length;

  return(
    <div style={{padding:"16px",maxWidth:420,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
        <button onClick={onBack} aria-label="Back to practice menu" style={{background:t.sf2,border:"none",borderRadius:8,width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:t.txM,fontSize:17}}><span aria-hidden="true">←</span></button>
        <span style={{fontSize:14,fontWeight:700,color:t.honey}}><span aria-hidden="true">🎯 </span>Country Quiz</span>
        <span aria-label={`Question ${idx+1} of ${pool.length}`} style={{fontSize:11,color:t.txD,fontFamily:"var(--font-mono)"}}>{idx+1}/{pool.length}</span>
      </div>
      <div style={{textAlign:"center",padding:"20px 14px",background:t.sf,borderRadius:12,borderLeft:`4px solid ${t.honey}`,marginBottom:6,boxShadow:t.shd}}>
        <div style={{fontSize:12,color:t.txD,marginBottom:2}}>Which traits apply to</div>
        <div style={{fontSize:26,fontWeight:800,color:t.tx,letterSpacing:-.3}}><Flag name={co.name} size={24} style={{marginRight:8,verticalAlign:"-3px"}}/>{co.name}</div>
        <div style={{fontSize:11,color:t.txM,marginTop:4}}>{rev?`${trueCount} of 8 are true`:`${trueCount} of these 8 are true`}</div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5,marginBottom:12}}>
        {cats.map(id=>{const c=CATS[id],s=cs(id);
          return(<button key={id} onClick={()=>tog(id)} aria-pressed={sel.has(id)} disabled={rev} aria-label={c.l}
            style={{padding:"10px 8px",borderRadius:7,background:s.bg,border:`1.5px solid ${s.bd}`,cursor:rev?"default":"pointer",display:"flex",alignItems:"center",gap:6,transition:"all .1s"}}>
            <span aria-hidden="true" style={{fontSize:15}}>{c.i}</span><span style={{fontSize:12,fontWeight:600,color:s.col}}>{c.l}</span>
          </button>);})}
      </div>

      {rev&&(<>
        <div style={{display:"flex",gap:10,justifyContent:"center",marginBottom:8,fontSize:10.5,color:t.txD}}>
          <span><span aria-hidden="true">🟢 </span>Correct</span><span><span aria-hidden="true">🟡 </span>Missed</span><span><span aria-hidden="true">🔴 </span>Wrong</span>
        </div>
        {revData.funFact&&(
          <div role="status" style={{padding:"10px 14px",background:t.sf2,borderRadius:8,marginBottom:12,borderLeft:`3px solid ${t.honey}`}}>
            <div style={{fontSize:11,color:t.honey,fontWeight:700,marginBottom:2}}>Did you know?</div>
            <div style={{fontSize:12,color:t.txM,lineHeight:1.4}}>{revData.funFact}</div>
          </div>
        )}
      </>)}

      {!rev?(<button onClick={submit} disabled={sel.size===0}
        style={{width:"100%",padding:"13px",borderRadius:8,background:sel.size>0?t.honey:t.sf,border:`1.5px solid ${sel.size>0?t.honey:t.bd}`,color:sel.size>0?"#fff":t.txD,fontSize:15,fontWeight:700,cursor:sel.size>0?"pointer":"not-allowed"}}>Check</button>
      ):(<button onClick={next} style={{width:"100%",padding:"13px",borderRadius:8,background:t.sf,border:`1.5px solid ${t.honey}`,color:t.honey,fontSize:15,fontWeight:700,cursor:"pointer"}}>Next Country →</button>)}
      {tot.t>0&&<div style={{textAlign:"center",marginTop:8,fontSize:12,color:t.txD}}>Score: <strong style={{color:t.ok,fontFamily:"ui-monospace,monospace"}}>{tot.c}/{tot.t}</strong></div>}
    </div>);
}
