import { CAT_KEYS } from "../data/categories";
import { sRng, shuffle, cellCount } from "./utils";

// ─── Puzzle Generator ───
// Tries up to 500 combinations of 3 row + 3 column categories. A valid grid
// requires: no category appears in both rows and columns, and every cell
// (intersection) has >= 3 valid country answers.
export function genGrid(rng){
  for(let a=0;a<500;a++){
    const sh=shuffle(CAT_KEYS,rng);
    const rows=sh.slice(0,3),cols=sh.slice(3,6);
    if(rows.some(r=>cols.includes(r)))continue;
    let ok=true;
    for(const r of rows){for(const c of cols){if(cellCount(r,c)<3){ok=false;break;}}if(!ok)break;}
    if(ok)return{rows,cols};
  }
  return{rows:["left","locked","island"],cols:["europe","asia","africa"]};
}

// Same puzzle for all users on the same calendar day. Do not change this formula.
export function dailySeed(){const d=new Date();return d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate();}

export function makeDailyGrid(){return genGrid(sRng(dailySeed()));}
export function makeRandomGrid(){return genGrid(()=>Math.random());}
