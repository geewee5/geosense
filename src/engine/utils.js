import { CATS, CAT_MEMBERS } from "../data/categories";

// Seeded RNG (linear congruential). Deterministic for a given seed.
export function sRng(seed){let s=seed|0;return()=>{s=(Math.imul(s,1664525)+1013904223)|0;return(s>>>0)/4294967296;};}

// Fisher-Yates shuffle using the provided rng function.
export function shuffle(a,rng){const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;}

// Number of countries satisfying both a row and a column category.
export function cellCount(rk,ck){return CAT_MEMBERS[rk].filter(c=>CATS[ck].t(c)).length;}

// Names of all countries satisfying both a row and a column category.
export function cellAnswers(rk,ck){return CAT_MEMBERS[rk].filter(c=>CATS[ck].t(c)).map(c=>c.name);}
