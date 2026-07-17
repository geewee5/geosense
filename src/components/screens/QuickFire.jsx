import { useState, useMemo, useCallback, useEffect } from "react";
import { DB } from "../../data/countries";
import { CATS, QF_CATS } from "../../data/categories";
import { enrichAnswer } from "../../engine/reverseMode";
import Flag from "../ui/Flag";
import { usePersistentState, loadKey, saveKey } from "../../engine/storage";

// ─── QUICK FIRE ───
export default function QuickFire({onBack,t}){
  const pool=useMemo(()=>DB.filter(c=>c.pop>1),[]);
  const goodCats=useMemo(()=>QF_CATS.filter(k=>CATS[k].d>=2),[]);

  const genCard=useCallback(()=>{
    const co=pool[Math.floor(Math.random()*pool.length)];
    const catPool=Math.random()<0.7?goodCats:QF_CATS;
    const cat=catPool[Math.floor(Math.random()*catPool.length)];
    return{co,cat,answer:CATS[cat].t(co)};
  },[pool,goodCats]);

  const [card,setCard]=useState(()=>loadKey("qf_card", null)||genCard());
  const [fb,setFb]=useState(null);
  const [score,setScore]=usePersistentState("qf_score",{c:0,tot:0,streak:0,best:0});
  const [locked,setLocked]=useState(false);
  const [history,setHistory]=usePersistentState("qf_history",[]);
  const [viewIdx,setViewIdx]=useState(null); // null=live, number=reviewing
  useEffect(()=>{saveKey("qf_card",card);},[card]);

  const handleAnswer=(yes)=>{
    if(locked)return;
    setLocked(true);
    const correct=yes===card.answer;
    setFb(correct?"correct":"wrong");
    const entry={...card,playerSaidYes:yes,correct};
    setHistory(h=>[...h,entry]);
    setScore(s=>({c:s.c+(correct?1:0),tot:s.tot+1,streak:correct?s.streak+1:0,best:correct?Math.max(s.best,s.streak+1):s.best}));
    setTimeout(()=>{setFb(null);setCard(genCard());setLocked(false);},1000);
  };

  const viewing=viewIdx!==null;
  const viewCard=viewing?history[viewIdx]:null;
  const pct=score.tot>0?Math.round(score.c/score.tot*100):0;

  // Card to display (live or history)
  const displayCard=viewing?viewCard:card;
  const displayCat=CATS[displayCard.cat];
  const displayExtra=viewing||fb?enrichAnswer(displayCard):"";
  const bgFlash=!viewing&&fb==="correct"?t.okBg:!viewing&&fb==="wrong"?t.noBg:t.bg;

  return(
    <div className="screen" style={{minHeight:"100%",background:bgFlash,transition:"background .15s",padding:"16px",maxWidth:420,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <button onClick={onBack} aria-label="Back to practice menu" style={{background:t.sf2,border:"none",borderRadius:8,width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:t.txM,fontSize:17}}><span aria-hidden="true">←</span></button>
        <span style={{fontSize:14,fontWeight:700,color:t.sec}}><span aria-hidden="true">⚡ </span>Quick Fire</span>
        <div role="status" aria-label={`Score ${score.c} of ${score.tot}, ${pct}% correct`} style={{textAlign:"right"}}>
          <div aria-hidden="true" style={{fontFamily:"var(--font-mono)",fontSize:14,fontWeight:700,color:t.tx}}>{score.c}/{score.tot}</div>
          <div aria-hidden="true" style={{fontSize:9,color:t.txD}}>{pct}% correct</div>
        </div>
      </div>

      {/* Streak */}
      {!viewing&&score.streak>1&&(
        <div style={{textAlign:"center",marginBottom:8}}>
          <span style={{padding:"4px 14px",borderRadius:16,background:t.sf,fontSize:13,color:t.honey,fontWeight:700,boxShadow:t.shd}}>
            <span aria-hidden="true">🔥 </span>{score.streak} streak {score.streak>=5?"— on fire!":score.streak>=3?"— nice!":""}
          </span>
        </div>
      )}

      {/* History navigation */}
      {history.length>0&&(
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:10}}>
          <button onClick={()=>setViewIdx(v=>v===null?(history.length-1):v>0?v-1:v)}
            disabled={viewIdx===0} aria-label="Review previous card"
            style={{background:t.sf,border:`1px solid ${t.bd}`,borderRadius:8,width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:t.txM,fontSize:14,opacity:viewIdx===0?.3:1}}><span aria-hidden="true">◀</span></button>
          <span style={{fontSize:11,color:viewing?t.honey:t.txD,fontWeight:viewing?700:400,minWidth:80,textAlign:"center"}}>
            {viewing?`Card ${viewIdx+1} of ${history.length}`:`Card ${history.length+1} · Live`}
          </span>
          <button onClick={()=>setViewIdx(v=>v===null?null:v<history.length-1?v+1:null)}
            disabled={viewIdx===null} aria-label="Review next card"
            style={{background:t.sf,border:`1px solid ${t.bd}`,borderRadius:8,width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:t.txM,fontSize:14,opacity:viewIdx===null?.3:1}}><span aria-hidden="true">▶</span></button>
          {viewing&&<button onClick={()=>setViewIdx(null)}
            style={{background:t.honey,border:"none",borderRadius:8,padding:"4px 12px",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer"}}>Resume</button>}
        </div>
      )}

      {/* Card */}
      <div style={{background:t.sf,borderRadius:16,padding:"28px 20px",textAlign:"center",boxShadow:t.shd,marginBottom:16,
        border:viewing?(viewCard.correct?`2px solid ${t.ok}`:`2px solid ${t.pri}`):fb==="correct"?`2px solid ${t.ok}`:fb==="wrong"?`2px solid ${t.pri}`:`1px solid ${t.bd}50`,transition:"border .15s"}}>
        <div style={{fontSize:13,color:t.txD,marginBottom:6}}>{viewing?"Did this apply to":"Does this apply to"}</div>
        <div style={{fontSize:28,fontWeight:800,color:t.tx,letterSpacing:-.3,marginBottom:18}}>
          {displayCard.co.name}
        </div>
        <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"10px 20px",background:t.sf2,borderRadius:12}}>
          <span style={{fontSize:22}}>{displayCat.i}</span>
          <span style={{fontSize:16,fontWeight:700,color:t.tx}}>{displayCat.l}</span>
        </div>
        {/* Show larger flag for flag-related questions */}
        {displayCard.cat.startsWith("fl")&&(fb||viewing)&&(
          <div style={{marginTop:12,display:"flex",justifyContent:"center"}}><Flag name={displayCard.co.name} size={48} style={{borderRadius:4}}/></div>
        )}

        {/* Answer reveal (live feedback or history review) */}
        {(fb||viewing)&&(
          <div role="status" aria-live="polite" style={{marginTop:16}}>
            <div style={{fontSize:15,fontWeight:700,color:(viewing?viewCard.correct:fb==="correct")?t.ok:t.pri}}>
              {viewing?(viewCard.correct?"✓ You got it right":"✗ You got it wrong"):(fb==="correct"?"✓ Correct!":"✗ Wrong!")}
            </div>
            <div style={{fontSize:13,color:t.txM,marginTop:4}}>
              {displayCat.l} is <strong style={{color:t.tx}}>{displayCard.answer?"TRUE":"FALSE"}</strong> for {displayCard.co.name}
            </div>
            {displayExtra&&(
              <div style={{marginTop:8,padding:"8px 14px",background:t.bg,borderRadius:8,fontSize:12,color:t.txM,lineHeight:1.4,display:"inline-block"}}>
                <span aria-hidden="true">💡 </span>{displayExtra}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Answer buttons (only for live card, not during feedback or history) */}
      {!viewing&&!fb&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <button onClick={()=>handleAnswer(true)}
            style={{padding:"20px",borderRadius:14,background:t.sf,border:`2px solid ${t.ok}40`,cursor:"pointer",
              display:"flex",flexDirection:"column",alignItems:"center",gap:4,transition:"transform .1s"}}
            onPointerDown={e=>e.currentTarget.style.transform="scale(0.96)"}
            onPointerUp={e=>e.currentTarget.style.transform="scale(1)"}
            onPointerLeave={e=>e.currentTarget.style.transform="scale(1)"}>
            <span aria-hidden="true" style={{fontSize:32}}>✓</span>
            <span style={{fontSize:16,fontWeight:700,color:t.ok}}>Yes</span>
          </button>
          <button onClick={()=>handleAnswer(false)}
            style={{padding:"20px",borderRadius:14,background:t.sf,border:`2px solid ${t.pri}40`,cursor:"pointer",
              display:"flex",flexDirection:"column",alignItems:"center",gap:4,transition:"transform .1s"}}
            onPointerDown={e=>e.currentTarget.style.transform="scale(0.96)"}
            onPointerUp={e=>e.currentTarget.style.transform="scale(1)"}
            onPointerLeave={e=>e.currentTarget.style.transform="scale(1)"}>
            <span aria-hidden="true" style={{fontSize:32}}>✗</span>
            <span style={{fontSize:16,fontWeight:700,color:t.pri}}>No</span>
          </button>
        </div>
      )}

      {/* Best streak */}
      {score.best>0&&(
        <div style={{textAlign:"center",marginTop:14,fontSize:12,color:t.txD}}>
          Best streak: <strong style={{color:t.honey,fontFamily:"ui-monospace,monospace"}}>{score.best}</strong>
        </div>
      )}
    </div>);
}
