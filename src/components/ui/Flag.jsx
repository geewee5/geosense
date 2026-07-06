import { _i2 } from "../../data/iso2";

// Renders a real flag as a local SVG (via the flag-icons package) rather than a
// regional-indicator emoji. Windows fonts don't include flag emoji glyphs, so
// emoji flags render as bare ISO letter pairs ("US"); SVGs render everywhere.
//
// `size` is the flag height in px; width is the standard 4:3 ratio. We set both
// dimensions explicitly (instead of relying on flag-icons' em/line-height box)
// so the flag renders identically in every context — list rows, cells, cards.
// Always decorative — the country name text is the accessible label.
export default function Flag({name,size=16,style}){
  const code=_i2[name];
  const box={display:"inline-block",width:Math.round(size*4/3),height:size,borderRadius:2,flexShrink:0,backgroundSize:"cover",backgroundPosition:"center",...style};
  if(!code)return <span aria-hidden="true" style={{...box,fontSize:size,lineHeight:1,textAlign:"center"}}>🏳️</span>;
  return <span aria-hidden="true" className={`fi fi-${code.toLowerCase()}`} style={box}/>;
}
