import { useState } from "react";
import { TH } from "./theme/themes";
import { makeDailyGrid, makeRandomGrid } from "./engine/puzzleGen";
import ThemeToggle from "./components/ui/ThemeToggle";
import Home from "./components/screens/Home";
import GridGame from "./components/screens/GridGame";
import PostGame from "./components/screens/PostGame";
import PracticeLanding from "./components/screens/PracticeLanding";
import CountryQuiz from "./components/screens/CountryQuiz";
import QuickFire from "./components/screens/QuickFire";
import Stats from "./components/screens/Stats";

// ─── APP ───
// Thin shell: holds the dark/light theme toggle, top-level navigation (`scr`),
// game stats (`st`), and the current grid (`curGrid`). Navigation is a single
// string state — there is intentionally no router.
export default function App(){
  const [dk,setDk]=useState(true);
  const [scr,setScr]=useState("home");
  const [pg,setPg]=useState(null);
  const [st,setSt]=useState({p:0,s:0,b:0,sc:0});
  const [dd,setDd]=useState(false);
  const [mode,setMode]=useState("daily");
  const [curGrid,setCurGrid]=useState(null);
  const t=dk?TH.dark:TH.light;

  const startDaily=()=>{setCurGrid(makeDailyGrid());setMode("daily");setScr("grid");};
  const startRandom=()=>{setCurGrid(makeRandomGrid());setMode("random");setScr("grid");};
  const newRandom=()=>{setCurGrid(makeRandomGrid());setMode("random");setPg(null);setScr("grid");};

  const fin=(cells,gl,grid)=>{
    const sc=cells.filter(c=>c?.ok).length;
    setPg({cells,gl,grid});
    setSt(s=>({p:s.p+1,s:s.s+1,b:Math.max(s.b,s.s+1),sc:s.sc+sc}));
    if(mode==="daily")setDd(true);
    setScr("post");
  };

  return(
    <div style={{minHeight:"100vh",background:t.bg,color:t.tx,transition:"background .3s,color .3s",position:"relative",fontFamily:"var(--font-body)","--focus-ring":t.sec}}>
      <ThemeToggle dk={dk} onToggle={()=>setDk(!dk)} t={t}/>
      {scr==="home"&&<Home t={t} streak={st.s} onNav={id=>{
        if(id==="daily"){if(dd&&pg)setScr("post");else startDaily();}
        else if(id==="random")startRandom();
        else if(id==="practice")setScr("practice");
        else setScr(id);
      }}/>}
      {scr==="grid"&&curGrid&&<GridGame t={t} onBack={()=>setScr("home")} onDone={fin} grid={curGrid} mode={mode} onNewPuzzle={newRandom}/>}
      {scr==="post"&&pg&&<PostGame t={t} cells={pg.cells} guesses={pg.gl} grid={pg.grid} mode={mode} onBack={()=>setScr("home")} onRev={()=>setScr("practice")} onNew={newRandom}/>}
      {scr==="practice"&&<PracticeLanding t={t} onBack={()=>setScr("home")} onQuiz={()=>setScr("quiz")} onQuickFire={()=>setScr("quickfire")}/>}
      {scr==="quiz"&&<CountryQuiz t={t} onBack={()=>setScr("practice")}/>}
      {scr==="quickfire"&&<QuickFire t={t} onBack={()=>setScr("practice")}/>}
      {scr==="stats"&&<Stats t={t} onBack={()=>setScr("home")} p={st.p} s={st.s} b={st.b} sc={st.sc}/>}
    </div>);
}
