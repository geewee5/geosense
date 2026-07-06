import { useState, useCallback, useEffect } from "react";
import { DB } from "../../data/countries";
import { CATS } from "../../data/categories";
import CatTag from "../ui/CatTag";
import Flag from "../ui/Flag";
import Picker from "../ui/Picker";

// Playful, randomized feedback lines. Kept out of the component so they're not
// re-created each render. Emoji here are safe on Windows (no flag emoji).
const WRONG_MSGS=[
  "Not on this map",
  "Close, but no atlas",
  "Geography says no",
  "Swing and a geo-miss",
  "The globe disagrees",
  "Missed by a country mile",
  "Back to the atlas!",
  "Even the map's confused",
  "Not it, chief",
  "Wrong turn somewhere",
  "The compass points elsewhere",
  "Nice try, explorer",
  "Off the map on that one",
  "Not today, Magellan",
  "The borders say otherwise",
  "Oof, wrong coordinates",
  "Try another hemisphere",
  "That flag flies elsewhere",
  "Lost in location",
  "Bold choice. Still wrong",
  "Plates shifted, still no",
  "Very wrong-ish",
  "Geographically creative",
  "The map stays undefeated",
  "So close, yet so continent away",
  "Recalculating… nope",
  "Nope, globetrotter",
  "The atlas raised an eyebrow",
  "Plot twist: still wrong",
  "GPS says nope",
  "A hard no from the equator",
  "Not quite, cartographer",
  "Wandered off the border",
  "The world map begs to differ",
  "Nope. Spin the globe again",
];
const RIGHT_MSGS=["Nice! 📍","Got it!","Correct! 🎯","Bang on!","Spot on 🌍","Geo-genius!","Textbook."];
const pick=a=>a[Math.floor(Math.random()*a.length)];

// ─── GRID GAME (shared by Daily + Random) ───
export default function GridGame({onBack,onDone,grid,mode,onNewPuzzle,t,initial,onProgress}){
  // Seed from saved progress (if resuming after a refresh), else a fresh grid.
  const [cells,setCells]=useState(initial?.cells||Array(9).fill(null));
  const [sel,setSel]=useState(null);
  const [gl,setGl]=useState(initial?.gl??12);
  const [log,setLog]=useState(initial?.log||[]);
  const [flash,setFlash]=useState(null);
  const [toast,setToast]=useState(null);
  // On wide screens the picker becomes a right-side panel and the puzzle slides
  // left; on narrow screens it stays a bottom sheet.
  const [wide,setWide]=useState(()=>typeof window!=="undefined"&&window.innerWidth>=900);
  useEffect(()=>{const on=()=>setWide(window.innerWidth>=900);window.addEventListener("resize",on);return()=>window.removeEventListener("resize",on);},[]);
  const PANEL_W=420;
  const panelOpen=sel!==null&&wide;
  const sc=cells.filter(c=>c?.ok).length;
  const done=sc===9||gl===0;
  useEffect(()=>{if(done)setTimeout(()=>onDone(cells,gl,grid),900);},[done]);
  // Report progress up so App can persist it (survives refresh).
  useEffect(()=>{onProgress&&onProgress({cells,gl,log});},[cells,gl,log]);
  const showToast=(txt,good)=>{setToast({txt,good});setTimeout(()=>setToast(null),1200);};
  const guess=useCallback(name=>{
    if(sel===null||done)return;
    const idx=sel,r=Math.floor(sel/3),c=sel%3;
    const co=DB.find(x=>x.name===name);
    const ok=co&&CATS[grid.rows[r]].t(co)&&CATS[grid.cols[c]].t(co);
    if(ok){
      setLog(p=>{const e=p.find(g=>g.name===name);return e?p.map(g=>g.name===name?{...g,ok:true}:g):[...p,{name,ok:true}];});
      const nc=[...cells];nc[idx]={name,ok:true};setCells(nc);
      showToast(pick(RIGHT_MSGS),true);
    }else{
      // Show the wrong pick inside the cell first, then drop it to the list below.
      setFlash({idx,name});
      showToast(pick(WRONG_MSGS),false);
      setTimeout(()=>{
        setFlash(f=>f&&f.idx===idx?null:f);
        setLog(p=>p.some(g=>g.name===name)?p:[...p,{name,ok:false}]);
      },1100);
    }
    setGl(g=>g-1);setSel(null);
  },[sel,done,cells,grid]);

  // Compute difficulty label
  const avgDiff=([...grid.rows,...grid.cols].reduce((s,k)=>s+CATS[k].d,0)/6);
  const diffLabel=avgDiff<1.5?"Easy":avgDiff<2.3?"Medium":"Hard";

  return(
    <div style={{paddingRight:panelOpen?PANEL_W:0,transition:"padding-right .25s ease"}}>
    <div style={{padding:"14px 10px",maxWidth:420,margin:"0 auto",paddingBottom:(sel!==null&&!wide)?300:14}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <button onClick={onBack} aria-label="Back to home" style={{background:t.sf2,border:"none",borderRadius:8,width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:t.txM,fontSize:17}}><span aria-hidden="true">←</span></button>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:13,fontWeight:700,color:t.tx}}>{mode==="daily"?"Daily Grid":"Random Puzzle"}</div>
          <div style={{fontSize:10,color:t.txD}}>{diffLabel} difficulty</div>
        </div>
        <div role="status" aria-label={`${gl} guesses left`} style={{textAlign:"center",padding:"3px 10px",borderRadius:8,background:gl<=3?t.noBg:t.sf2,border:gl<=3?`1.5px solid ${t.noBd}`:"1.5px solid transparent"}}>
          <div aria-hidden="true" style={{fontFamily:"var(--font-mono)",fontSize:19,fontWeight:800,color:gl<=3?t.pri:t.tx,lineHeight:1}}>{gl}</div>
          <div aria-hidden="true" style={{fontSize:7.5,color:t.txD,textTransform:"uppercase",letterSpacing:1}}>left</div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"72px repeat(3,1fr)",gridTemplateRows:"64px repeat(3,1fr)",gap:4}}>
        <div role="status" aria-label={`Score ${sc} of 9`} style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
          <div aria-hidden="true" style={{fontFamily:"var(--font-mono)",fontSize:22,fontWeight:800,color:t.pri,lineHeight:1}}>{sc}</div>
          <div aria-hidden="true" style={{fontSize:7.5,color:t.txD,textTransform:"uppercase",letterSpacing:1}}>score</div>
        </div>
        {grid.cols.map((id,i)=><CatTag key={i} id={id} t={t} s/>)}
        {grid.rows.map((rc,r)=><div key={`row${r}`} style={{display:"contents"}}>
          <CatTag key={`r${r}`} id={rc} t={t} s/>
          {grid.cols.map((_,c)=>{
            const idx=r*3+c,cell=cells[idx];
            const isF=flash?.idx===idx,isS=sel===idx,isOk=cell?.ok;
            let bg=t.sf,bd=t.bdD,bs="dashed",bw="1.5px",col=t.txD;
            if(isOk){bg=t.okBg;bd=t.okBd;bs="solid";bw="2px";col=t.ok;}
            else if(isF){bg=t.noBg;bd=t.noBd;bs="solid";bw="2px";col=t.pri;}
            else if(isS){bg=t.selBg;bd=t.selBd;bs="solid";bw="2px";col=t.sec;}
            const cellDesc=`${CATS[rc].l} and ${CATS[grid.cols[c]].l}`;
            const cellLabel=isOk?`${cell.name}, correct — ${cellDesc}`:isF?`${flash.name}, wrong — ${cellDesc}`:`${cellDesc}. Empty. Activate to pick a country.`;
            return(<button key={idx} onClick={()=>{if(!isOk&&!done)setSel(sel===idx?null:idx);}}
              aria-label={cellLabel} aria-pressed={isS} disabled={isOk||done}
              style={{background:bg,border:`${bw} ${bs} ${bd}`,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",gap:4,
                padding:3,cursor:isOk||done?"default":"pointer",minHeight:64,transition:"all .12s",position:"relative",
                color:col,fontSize:11,fontWeight:isOk?700:400,textAlign:"center",lineHeight:1.15,wordBreak:"break-word",
                animation:isF?"shake .35s ease":"none"}}>
              {isOk?(<><Flag name={cell.name} size={12}/><span>{cell.name}</span></>):isF?(<span style={{fontSize:11,fontWeight:600,lineHeight:1.15}}>{flash.name}</span>):(<span aria-hidden="true" style={{fontSize:18,opacity:.3}}>+</span>)}
            </button>);})}
        </div>)}
      </div>
      <div role="status" aria-live="assertive" style={{height:36,display:"flex",alignItems:"center",justifyContent:"center"}}>
        {toast&&(<div style={{padding:"6px 18px",borderRadius:20,background:toast.good?t.ok:t.pri,color:"#fff",fontSize:13,fontWeight:700,animation:"toastIn .25s ease"}}>{toast.txt}</div>)}
      </div>
      {log.length>0&&(<div aria-label="Countries you have guessed" style={{display:"flex",flexWrap:"wrap",gap:3}}>
        {log.map(g=>(<span key={g.name} style={{fontSize:9.5,padding:"1.5px 7px",borderRadius:5,background:g.ok?t.okBg:t.noBg,color:g.ok?t.ok:t.pri,border:`1px solid ${g.ok?t.okBd:t.noBd}30`}}>{g.name}</span>))}
      </div>)}
      {sel!==null&&<Picker onPick={guess} onClose={()=>setSel(null)} t={t} side={wide} hints={[grid.rows[Math.floor(sel/3)],grid.cols[sel%3]]}/>}
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-5px)}40%{transform:translateX(5px)}60%{transform:translateX(-3px)}80%{transform:translateX(3px)}}@keyframes toastIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
    </div>);
}
