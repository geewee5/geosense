// ─── HOME ───
export default function Home({onNav,streak,t}){
  return(
    <div style={{padding:"32px 20px 20px",maxWidth:420,margin:"0 auto"}}>
      <div style={{marginBottom:28}}>
        <h1 style={{fontSize:28,fontWeight:700,color:t.tx,margin:0,letterSpacing:-.3}}>Know the world</h1>
        <p style={{color:t.txD,fontSize:13,margin:"5px 0 0"}}>How well do you know the world's countries?</p>
      </div>
      {streak>0&&(<div aria-label={`Current streak: ${streak} days`} style={{display:"inline-flex",alignItems:"center",gap:5,padding:"5px 14px",background:t.sf,borderRadius:20,marginBottom:14,boxShadow:t.shd}}>
        <span aria-hidden="true" style={{fontSize:15}}>🔥</span><span aria-hidden="true" style={{fontFamily:"var(--font-mono)",fontWeight:800,fontSize:17,color:t.honey}}>{streak}</span><span aria-hidden="true" style={{color:t.txD,fontSize:11}}>day streak</span>
      </div>)}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {[{id:"daily",em:"📅",ti:"Daily Grid",su:"One puzzle per day, same for everyone",co:t.pri},
          {id:"random",em:"🎲",ti:"Random Puzzle",su:"Unlimited generated grids",co:t.sec},
          {id:"practice",em:"🎯",ti:"Practice",su:"Quiz yourself with two game modes",co:t.honey}
        ].map(m=>(<button key={m.id} onClick={()=>!m.off&&onNav(m.id)} disabled={m.off}
          aria-label={m.off?`${m.ti}: ${m.su}`:`${m.ti}. ${m.su}`}
          style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",background:t.sf,
            borderLeft:`4px solid ${m.off?t.bd:m.co}`,border:`1px solid ${t.bd}50`,borderLeftWidth:4,borderLeftColor:m.off?t.bd:m.co,
            borderRadius:"3px 12px 12px 3px",cursor:m.off?"not-allowed":"pointer",opacity:m.off?.4:1,textAlign:"left",boxShadow:m.off?"none":t.shd}}>
          <span aria-hidden="true" style={{fontSize:24,width:42,height:42,display:"flex",alignItems:"center",justifyContent:"center",background:t.sf2,borderRadius:10}}>{m.em}</span>
          <div style={{flex:1}}><div style={{color:t.tx,fontSize:15,fontWeight:700}}>{m.ti}</div><div style={{color:t.txD,fontSize:12,marginTop:1}}>{m.su}</div></div>
          {!m.off&&<span aria-hidden="true" style={{color:m.co,fontSize:18}}>→</span>}
        </button>))}
      </div>
      <button onClick={()=>onNav("stats")} style={{display:"block",margin:"20px auto 0",background:"none",border:"none",color:t.txD,fontSize:13,cursor:"pointer",textDecoration:"underline dotted",textUnderlineOffset:3}}>Your progress</button>
    </div>);
}
