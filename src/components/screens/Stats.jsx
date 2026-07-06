import { CAT_KEYS, CATS } from "../../data/categories";

// ─── STATS ───
export default function Stats({onBack,p,s,b,sc,t}){
  const lvl=[{n:"Explorer",m:0,c:t.txM},{n:"Geographer",m:20,c:t.sec},{n:"Diplomat",m:50,c:t.pri},{n:"Cartographer",m:100,c:t.honey}];
  const cur=[...lvl].reverse().find(l=>sc>=l.m)||lvl[0];
  const nxt=lvl[lvl.indexOf(cur)+1];
  const pct=nxt?(sc-cur.m)/(nxt.m-cur.m):1;
  return(
    <div style={{padding:"16px 20px",maxWidth:420,margin:"0 auto"}}>
      <div style={{display:"flex",alignItems:"center",marginBottom:20}}>
        <button onClick={onBack} aria-label="Back to home" style={{background:t.sf2,border:"none",borderRadius:8,width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:t.txM,fontSize:17}}><span aria-hidden="true">←</span></button>
        <h2 style={{fontSize:20,fontWeight:600,color:t.tx,margin:"0 0 0 12px"}}>Your Progress</h2>
      </div>
      <div style={{textAlign:"center",padding:"18px",background:t.sf,borderRadius:12,marginBottom:12,boxShadow:t.shd}}>
        <div style={{fontSize:10,color:t.txD,textTransform:"uppercase",letterSpacing:1.5}}>Level</div>
        <div style={{fontSize:22,fontWeight:800,color:cur.c,margin:"3px 0"}}>{cur.n}</div>
        {nxt&&<><div role="progressbar" aria-valuenow={sc-cur.m} aria-valuemin={0} aria-valuemax={nxt.m-cur.m} aria-label={`Progress to ${nxt.n}`} style={{width:"100%",height:5,background:t.bg,borderRadius:3,margin:"7px 0 3px",overflow:"hidden"}}>
          <div style={{width:`${Math.min(pct*100,100)}%`,height:"100%",background:cur.c,borderRadius:3,transition:"width .4s"}}/></div>
          <div style={{fontSize:10.5,color:t.txD}}>{sc-cur.m}/{nxt.m-cur.m} to <strong style={{color:nxt.c}}>{nxt.n}</strong></div></>}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {[{l:"Played",v:p,i:"🎮"},{l:"Streak",v:s,i:"🔥"},{l:"Best",v:b,i:"⭐"},{l:"Score",v:sc,i:"🏆"}].map(x=>(
          <div key={x.l} aria-label={`${x.l}: ${x.v}`} style={{padding:"12px",background:t.sf,borderRadius:8,textAlign:"center",boxShadow:t.shd}}>
            <div aria-hidden="true" style={{fontSize:17}}>{x.i}</div>
            <div aria-hidden="true" style={{fontFamily:"var(--font-mono)",fontSize:21,fontWeight:800,color:t.tx,margin:"1px 0"}}>{x.v}</div>
            <div aria-hidden="true" style={{fontSize:10.5,color:t.txD}}>{x.l}</div>
          </div>))}
      </div>
      <div style={{marginTop:14,padding:"14px",background:t.sf,borderRadius:10,boxShadow:t.shd}}>
        <div style={{fontSize:13,fontWeight:700,color:t.tx,marginBottom:4}}>Categories in Play</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
          {CAT_KEYS.map(k=><span key={k} style={{fontSize:9,padding:"2px 7px",borderRadius:4,background:t.sf2,color:t.txM}}>{CATS[k].i} {CATS[k].l}</span>)}
        </div>
      </div>
    </div>);
}
