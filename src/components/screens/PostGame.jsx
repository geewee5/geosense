import { useState } from "react";
import { cellAnswers } from "../../engine/utils";
import { CATS } from "../../data/categories";
import CatTag from "../ui/CatTag";
import Flag from "../ui/Flag";

// ─── POST GAME ───
export default function PostGame({cells,guesses,grid,mode,onBack,onRev,onNew,t}){
  const sc=cells.filter(c=>c?.ok).length;
  const [exp,setExp]=useState(null);
  const emo=cells.map(c=>c?.ok?"🟩":"⬛").reduce((a,e,i)=>a+e+((i+1)%3===0&&i<8?"\n":""),"");
  const face=sc===9?"🌟":sc>=6?"🗺️":"📚";
  return(
    <div className="pg-wrap" style={{padding:"16px",maxWidth:420,margin:"0 auto"}}>
      <div style={{textAlign:"center",marginBottom:16}}>
        <div aria-hidden="true" style={{fontSize:40,marginBottom:2}}>{face}</div>
        <h2 style={{fontSize:24,fontWeight:600,color:t.tx,margin:0}}>{sc===9?"Flawless!":sc>=6?"Well played!":"Keep exploring!"}</h2>
        <div style={{marginTop:6,display:"inline-flex",gap:14,fontSize:13,color:t.txM}}>
          <span><strong style={{color:t.ok,fontFamily:"ui-monospace,monospace"}}>{sc}</strong>/9</span>
          <span><strong style={{color:t.pri,fontFamily:"ui-monospace,monospace"}}>{12-guesses}</strong> guesses</span>
        </div>
      </div>
      <div className="pg-grid" style={{display:"grid",gridTemplateColumns:"72px repeat(3,1fr)",gridTemplateRows:"58px repeat(3,auto)",gap:3}}>
        <div/>
        {grid.cols.map((id,i)=><CatTag key={i} id={id} t={t} s/>)}
        {grid.rows.map((rc,r)=><div key={`row${r}`} style={{display:"contents"}}>
          <CatTag key={`r${r}`} id={rc} t={t} s/>
          {grid.cols.map((cc,c)=>{
            const idx=r*3+c,cell=cells[idx],key=`${r}-${c}`,isE=exp===key;
            const ans=cellAnswers(rc,cc);
            const cellDesc=`${CATS[rc].l} and ${CATS[cc].l}`;
            const cellLabel=(cell?.ok?`${cell.name}, correct. ${cellDesc}.`:`${ans.length} possible answers. ${cellDesc}.`)+(isE?" Showing answers.":" Activate to show all answers.");
            return(<div key={idx}>
              <button onClick={()=>setExp(isE?null:key)} aria-expanded={isE} aria-label={cellLabel} className="pg-cell"
                style={{width:"100%",minHeight:50,borderRadius:8,cursor:"pointer",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,
                  border:cell?.ok?`2px solid ${t.okBd}`:`1.5px dashed ${t.bd}`,
                  background:cell?.ok?t.okBg:t.sf,padding:4,fontSize:11,fontWeight:700,color:cell?.ok?t.ok:t.txD,lineHeight:1.2,position:"relative"}}>
                {cell?.ok?<span style={{display:"flex",alignItems:"center",gap:3}}><Flag name={cell.name} size={11}/><span>{cell.name}</span></span>:<span>{`${ans.length} answers`}</span>}
                <span aria-hidden="true" style={{fontSize:7.5,color:t.txD,marginTop:1}}>{isE?"▲":"▼"}</span>
              </button>
              {isE&&(<div style={{marginTop:3,padding:7,background:t.sf2,borderRadius:6,fontSize:10.5,border:`1px solid ${t.bd}30`}}>
                <div style={{display:"flex",flexWrap:"wrap",gap:2}}>
                  {ans.map(a=><span key={a} style={{padding:"1.5px 6px",borderRadius:4,fontSize:9.5,
                    background:cell?.name===a?t.okBg:t.bg,color:cell?.name===a?t.ok:t.txD,border:`1px solid ${cell?.name===a?t.okBd:t.bd}30`}}>{a}</span>)}
                </div>
              </div>)}
            </div>);})}
        </div>)}
      </div>
      <div style={{textAlign:"center",marginTop:14}}>
        <div aria-label={`Result grid, ${sc} of 9 solved`} style={{fontFamily:"var(--font-mono)",fontSize:15,lineHeight:1.7,color:t.tx,whiteSpace:"pre",marginBottom:8}}><span aria-hidden="true">{emo}</span></div>
        <button onClick={()=>navigator.clipboard?.writeText(`GeoSense ${mode==="daily"?"Daily":"Random"}\n${emo}\n${sc}/9`)}
          style={{padding:"9px 22px",borderRadius:8,background:t.tagBg,border:"none",color:t.tagTx,fontWeight:700,fontSize:13,cursor:"pointer"}}>Copy result</button>
      </div>
      <div style={{display:"flex",gap:8,marginTop:14}}>
        <button onClick={onBack} style={{flex:1,padding:"11px",borderRadius:8,background:t.sf,border:`1.5px solid ${t.bd}`,color:t.txM,fontSize:13,fontWeight:600,cursor:"pointer"}}>Home</button>
        {mode==="random"&&<button onClick={onNew} style={{flex:1,padding:"11px",borderRadius:8,background:t.sf,border:`1.5px solid ${t.sec}`,color:t.sec,fontSize:13,fontWeight:600,cursor:"pointer"}}>New Puzzle 🎲</button>}
        <button onClick={onRev} style={{flex:1,padding:"11px",borderRadius:8,background:t.selBg,border:`1.5px solid ${t.selBd}`,color:t.sec,fontSize:13,fontWeight:600,cursor:"pointer"}}>Practice →</button>
      </div>
    </div>);
}
