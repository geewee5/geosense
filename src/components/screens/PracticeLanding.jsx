import { CAT_KEYS } from "../../data/categories";

// ─── PRACTICE LANDING ───
export default function PracticeLanding({onBack,onQuiz,onQuickFire,t}){
  return(
    <div className="screen" style={{padding:"28px 20px",maxWidth:420,margin:"0 auto"}}>
      <div style={{display:"flex",alignItems:"center",marginBottom:24}}>
        <button onClick={onBack} aria-label="Back to home" style={{background:t.sf2,border:"none",borderRadius:8,width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:t.txM,fontSize:17}}><span aria-hidden="true">←</span></button>
        <h2 style={{fontSize:22,fontWeight:600,color:t.tx,margin:"0 0 0 12px"}}>Practice</h2>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        <button onClick={onQuiz} style={{textAlign:"left",padding:"18px",background:t.sf,borderRadius:12,border:`1px solid ${t.bd}50`,borderLeft:`4px solid ${t.honey}`,boxShadow:t.shd,cursor:"pointer"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
            <span aria-hidden="true" style={{fontSize:24}}>🎯</span>
            <span style={{fontSize:17,fontWeight:700,color:t.tx}}>Country Quiz</span>
          </div>
          <p style={{fontSize:13,color:t.txM,margin:0,lineHeight:1.5}}>See a country, pick which traits apply from 8 curated options. 4 are true, 4 are decoys. A "Did you know?" reveal after each round teaches you the surprising facts.</p>
          <div aria-hidden="true" style={{marginTop:10,display:"flex",gap:6}}>
            {["👑","⭐","🏅","🛡️"].map(e=><span key={e} style={{fontSize:12,padding:"2px 8px",background:t.sf2,borderRadius:6}}>{e}</span>)}
            <span style={{fontSize:11,color:t.txD,alignSelf:"center"}}>{CAT_KEYS.length} categories</span>
          </div>
        </button>
        <button onClick={onQuickFire} style={{textAlign:"left",padding:"18px",background:t.sf,borderRadius:12,border:`1px solid ${t.bd}50`,borderLeft:`4px solid ${t.sec}`,boxShadow:t.shd,cursor:"pointer"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
            <span aria-hidden="true" style={{fontSize:24}}>⚡</span>
            <span style={{fontSize:17,fontWeight:700,color:t.tx}}>Quick Fire</span>
          </div>
          <p style={{fontSize:13,color:t.txM,margin:0,lineHeight:1.5}}>One country, one trait. Is it true or false? Tap fast, build your streak. Tests instinct-level geography recall with rapid yes/no cards.</p>
          <div style={{marginTop:10,display:"flex",gap:6}}>
            <span style={{fontSize:11,padding:"2px 8px",background:t.sf2,borderRadius:6,color:t.txM}}>⚡ Speed mode</span>
            <span style={{fontSize:11,padding:"2px 8px",background:t.sf2,borderRadius:6,color:t.txM}}>🔥 Streak tracking</span>
          </div>
        </button>
      </div>
    </div>);
}
