import { CATS } from "../../data/categories";

// Category label used in grid headers (GridGame + PostGame).
// `s` toggles compact/small mode. Always renders emoji + label stacked.
export default function CatTag({id,t,s}){const c=CATS[id];return(
  <div className="cattag" style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:s?"4px 3px":"6px 4px",gap:s?3:4}}>
    <span className="ct-emoji" style={{fontSize:s?16:20,lineHeight:1,display:"block"}}>{c.i}</span>
    <span className="ct-label" style={{fontSize:s?9:10,fontWeight:700,color:t.txM,textAlign:"center",lineHeight:1.2,textTransform:"uppercase",letterSpacing:.4,maxWidth:s?72:80}}>{c.l}</span>
  </div>);}
