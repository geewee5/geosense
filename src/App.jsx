import { useState, useEffect, useRef } from "react";
import { TH } from "./theme/themes";
import { makeDailyGrid, makeRandomGrid, dailySeed } from "./engine/puzzleGen";
import { usePersistentState } from "./engine/storage";
import ThemeToggle from "./components/ui/ThemeToggle";
import Home from "./components/screens/Home";
import GridGame from "./components/screens/GridGame";
import PostGame from "./components/screens/PostGame";
import PracticeLanding from "./components/screens/PracticeLanding";
import CountryQuiz from "./components/screens/CountryQuiz";
import QuickFire from "./components/screens/QuickFire";
import Stats from "./components/screens/Stats";

// ─── APP ───
// Thin shell. Navigation is driven by the URL hash (#/daily, #/random,
// #/practice, #/quiz, #/quickfire, #/stats) so each tab is its own shareable
// page and the browser Back/Forward buttons work — a tiny custom router, no
// routing library. All game state persists to localStorage (engine/storage.js)
// so every tab resumes exactly where it left off after a refresh.
export default function App(){
  const [dk,setDk]=usePersistentState("theme", true);
  const [st,setSt]=usePersistentState("stats", {p:0,s:0,b:0,sc:0});
  // Each grid mode keeps its own slot: { grid, progress:{cells,gl,log}|null, pg, dailyDate? }
  const [daily,setDaily]=usePersistentState("daily", null);
  const [random,setRandom]=usePersistentState("random", null);
  // Active route. Initialize straight from the URL hash so a refresh doesn't
  // flash the home screen before the router runs.
  const [scr,setScr]=useState(()=>{
    const r=(window.location.hash||"").replace(/^#\/?/,"").split("/")[0];
    return ["daily","random","practice","quiz","quickfire","stats"].includes(r)?r:"home";
  });
  const t=dk?TH.dark:TH.light;

  // If a saved daily belongs to a previous calendar day, drop it so today's
  // puzzle is generated fresh.
  useEffect(()=>{
    if(daily && daily.dailyDate!==dailySeed()) setDaily(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const startDaily=()=>setDaily({grid:makeDailyGrid(),progress:null,pg:null,dailyDate:dailySeed()});
  const startRandom=()=>setRandom({grid:makeRandomGrid(),progress:null,pg:null});
  const newRandom=()=>setRandom({grid:makeRandomGrid(),progress:null,pg:null});

  const finish=(kind,cells,gl,grid)=>{
    const sc=cells.filter(c=>c?.ok).length;
    const set=kind==="daily"?setDaily:setRandom;
    set(s=>s?{...s,pg:{cells,gl,grid},progress:null}:s);
    setSt(x=>({p:x.p+1,s:x.s+1,b:Math.max(x.b,x.s+1),sc:x.sc+sc}));
  };

  // ── Hash router ──────────────────────────────────────────────────────────
  // apply() reads current state, so keep it in a ref that's refreshed every
  // render; the listener (bound once) always calls the latest version.
  const applyRef=useRef();
  applyRef.current=(hash)=>{
    const r=(hash||"").replace(/^#\/?/,"").split("/")[0];
    if(r==="daily"){ if(!daily||daily.dailyDate!==dailySeed()) startDaily(); setScr("daily"); }
    else if(r==="random"){ if(!random) startRandom(); setScr("random"); }
    else if(r==="practice") setScr("practice");
    else if(r==="quiz") setScr("quiz");
    else if(r==="quickfire") setScr("quickfire");
    else if(r==="stats") setScr("stats");
    else setScr("home");
  };
  useEffect(()=>{
    const on=()=>applyRef.current(window.location.hash);
    window.addEventListener("hashchange",on);
    on(); // apply the initial URL (handles refreshes and shared deep links)
    return ()=>window.removeEventListener("hashchange",on);
  },[]);
  const go=r=>{ window.location.hash = "#/"+r; }; // "" -> home

  return(
    <div style={{height:"100dvh",display:"flex",flexDirection:"column",overflow:"hidden",background:t.bg,color:t.tx,transition:"background .3s,color .3s",fontFamily:"var(--font-body)","--focus-ring":t.sec}}>
      {/* Shared header: stays put because the content below it scrolls, not the
          header itself (avoids iOS position:fixed drift). */}
      <header style={{flexShrink:0,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 16px",paddingTop:"calc(env(safe-area-inset-top) + 10px)",background:t.bg,borderBottom:`1px solid ${t.bd}`,zIndex:10}}>
        <button onClick={()=>go("")} aria-label="GeoSense — home" style={{background:"none",border:"none",cursor:"pointer",padding:0,fontFamily:"var(--font-display)",fontSize:22,fontWeight:700,letterSpacing:-.5,color:t.tx,lineHeight:1}}>
          Geo<span style={{fontWeight:400,color:t.sec}}>Sense</span>
        </button>
        <ThemeToggle dk={dk} onToggle={()=>setDk(!dk)} t={t}/>
      </header>
      <main style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch",minHeight:0}}>

      {scr==="home"&&<Home t={t} streak={st.s} onNav={id=>go(id)}/>}

      {scr==="daily"&&daily&&(daily.pg
        ? <PostGame t={t} cells={daily.pg.cells} guesses={daily.pg.gl} grid={daily.pg.grid} mode="daily" onBack={()=>go("")} onRev={()=>go("practice")} onNew={newRandom}/>
        : daily.grid && <GridGame t={t} grid={daily.grid} mode="daily" initial={daily.progress} onProgress={p=>setDaily(d=>d?{...d,progress:p}:d)} onDone={(c,gl,g)=>finish("daily",c,gl,g)} onBack={()=>go("")} onNewPuzzle={newRandom}/>)}

      {scr==="random"&&random&&(random.pg
        ? <PostGame t={t} cells={random.pg.cells} guesses={random.pg.gl} grid={random.pg.grid} mode="random" onBack={()=>go("")} onRev={()=>go("practice")} onNew={newRandom}/>
        : random.grid && <GridGame t={t} grid={random.grid} mode="random" initial={random.progress} onProgress={p=>setRandom(r=>r?{...r,progress:p}:r)} onDone={(c,gl,g)=>finish("random",c,gl,g)} onBack={()=>go("")} onNewPuzzle={newRandom}/>)}

      {scr==="practice"&&<PracticeLanding t={t} onBack={()=>go("")} onQuiz={()=>go("quiz")} onQuickFire={()=>go("quickfire")}/>}
      {scr==="quiz"&&<CountryQuiz t={t} onBack={()=>go("practice")}/>}
      {scr==="quickfire"&&<QuickFire t={t} onBack={()=>go("practice")}/>}
      {scr==="stats"&&<Stats t={t} onBack={()=>go("")} p={st.p} s={st.s} b={st.b} sc={st.sc}/>}
      </main>
    </div>);
}
