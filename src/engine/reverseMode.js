import { DB } from "../data/countries";
import { CAT_KEYS, CATS, CAT_MEMBERS } from "../data/categories";
import { shuffle } from "./utils";

// ─── Reverse Mode: Dynamic Category Selection ───
export const REV_POOL=DB.filter(c=>c.pop>1).map(c=>c.name);

// For each country, pick 4 true (mix of obvious+surprising) + 4 plausible-false = 8 total
export function pickRevCats(country){
  // Exclude name-based categories - trivially obvious when you can see the country name
  const usableKeys=CAT_KEYS.filter(k=>!k.startsWith("start"));
  const trueKeys=usableKeys.filter(k=>CATS[k].t(country));
  const falseKeys=usableKeys.filter(k=>!CATS[k].t(country));

  // Score true categories by surprise: fewer countries match = more surprising
  const trueScored=trueKeys.map(k=>({k,surprise:1/(CAT_MEMBERS[k].length+1)}));
  trueScored.sort((a,b)=>b.surprise-a.surprise);
  // Pick 2 surprising + 2 random from the rest
  const surpriseTrue=trueScored.slice(0,2).map(x=>x.k);
  const restTrue=shuffle(trueScored.slice(2).map(x=>x.k),()=>Math.random()).slice(0,2);
  const selectedTrue=[...surpriseTrue,...restTrue];

  // Score false categories by plausibility: common in same continent = trickier
  const falseScored=falseKeys.map(k=>{
    let score=CATS[k].d; // harder categories = trickier
    const sameContMatches=CAT_MEMBERS[k].filter(c=>c.cont===country.cont).length;
    score+=sameContMatches>3?3:sameContMatches>0?1:0;
    return{k,score};
  });
  falseScored.sort((a,b)=>b.score-a.score);
  const selectedFalse=falseScored.slice(0,4).map(x=>x.k);

  const combined=shuffle([...selectedTrue,...selectedFalse],()=>Math.random());

  // Find most surprising true fact for "did you know"
  const mostSurprising=trueScored[0];
  const funFact=mostSurprising?`Only ${CAT_MEMBERS[mostSurprising.k].length} countries share the trait "${CATS[mostSurprising.k].l}"`:"";

  return{cats:combined,correct:selectedTrue,funFact};
}

const FLAG_KEYS=["fl_red","fl_blue","fl_green","fl_stars","fl_crescent","fl_animal","fl_cross","fl_text"];
const FLAG_LABELS={fl_red:"red",fl_blue:"blue",fl_green:"green",fl_stars:"stars",fl_crescent:"crescent",fl_animal:"animal",fl_cross:"cross",fl_text:"text/script"};
const CONT_NAMES=["Europe","Asia","Africa","N. America","S. America","Oceania"];

// Human-readable enrichment string for the Quick Fire answer reveal.
export function enrichAnswer(card){
  const{co,cat,answer}=card;
  if(cat==="gdp40k"||cat==="gdp20k")return`GDP per capita: ~$${co.gdp>=1?Math.round(co.gdp):co.gdp}K`;
  if(cat==="pop50")return`Population: ~${co.pop>=1?Math.round(co.pop):co.pop}M`;
  if(cat==="locked")return answer?"Landlocked, no coastline":`Has a coastline (in ${CONT_NAMES[co.cont]})`;
  if(cat==="island")return answer?"Entirely surrounded by water":"Has land borders";
  if(cat==="left")return answer?"Drives on the left side":"Drives on the right side";
  if(cat.startsWith("fl")){
    const traits=FLAG_KEYS.filter(k=>co[k]).map(k=>FLAG_LABELS[k]);
    return`Flag features: ${traits.length?traits.join(", "):"simple design"}`;
  }
  if(cat==="monarchy")return answer?`${co.pm?"Constitutional":"Absolute"} monarchy`:"Republic";
  if(cat==="pmHead")return co.pm?"Parliamentary system (PM leads)":"Presidential system";
  if(cat==="europe"||cat==="asia"||cat==="africa"||cat==="americas")return`Located in ${CONT_NAMES[co.cont]}`;
  return"";
}
