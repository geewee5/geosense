import { useState, useMemo, useCallback, useRef, useEffect } from "react";

// ─── 193 Countries: D(name, continent, gdp_K, timeZones, pop_M, flags1, flags2, flags3, flags4) ───
// f1: left(1) un(2) locked(4) isle(8) monarchy(16) federal(32) pm(64) eu(128)
// f2: nato(1) g20(2) cwlth(4) brics(8) opec(16) asean(32) soviet(64) conscript(128)
// f3: fl_red(1) fl_blue(2) fl_green(4) fl_stars(8) fl_crescent(16) fl_animal(32) fl_cross(64) fl_text(128)
// f4: olympics(1) fifa(2) f1gp(4) eng(8) fr(16) es(32) ar(64) conflict(128) nuclear(256)
const D=(n,c,g,tz,p,f1,f2,f3,f4)=>({name:n,cont:c,gdp:g,tz,pop:p,
  left:!!(f1&1),un:!!(f1&2),locked:!!(f1&4),isle:!!(f1&8),monarchy:!!(f1&16),federal:!!(f1&32),pm:!!(f1&64),eu:!!(f1&128),
  nato:!!(f2&1),g20:!!(f2&2),cwlth:!!(f2&4),brics:!!(f2&8),opec:!!(f2&16),asean:!!(f2&32),soviet:!!(f2&64),conscript:!!(f2&128),
  fl_red:!!(f3&1),fl_blue:!!(f3&2),fl_green:!!(f3&4),fl_stars:!!(f3&8),fl_crescent:!!(f3&16),fl_animal:!!(f3&32),fl_cross:!!(f3&64),fl_text:!!(f3&128),
  olympics:!!(f4&1),fifa:!!(f4&2),f1gp:!!(f4&4),eng:!!(f4&8),fr:!!(f4&16),es:!!(f4&32),ar:!!(f4&64),conflict:!!(f4&128),nuclear:!!(f4&256)});

const DB=[
D("Afghanistan",1,0.5,1,40,4,0,132,128),D("Albania",0,6.8,1,2.8,64,1,33,0),D("Algeria",2,4.0,1,45,64,16,21,64),
D("Andorra",0,42.0,1,0.08,84,0,160,0),D("Angola",2,2.0,1,36,0,16,1,0),D("Antigua and Barbuda",3,18.0,1,0.1,65,4,1,8),
D("Argentina",4,13.0,1,46,34,2,3,34),D("Armenia",1,7.0,1,2.8,68,64,1,0),D("Australia",5,65.0,3,26,123,6,75,13),
D("Austria",0,56.0,1,9,228,128,1,5),D("Azerbaijan",1,6.8,1,10.2,4,192,29,4),D("Bahamas",3,35.0,1,0.4,89,4,2,8),
D("Bahrain",1,28.0,1,1.5,88,0,1,68),D("Bangladesh",1,2.5,1,170,65,4,5,0),D("Barbados",3,18.0,1,0.3,89,4,3,8),
D("Belarus",0,7.0,1,9.4,6,192,1,0),D("Belgium",0,52.0,1,11.5,242,1,1,21),D("Belize",3,6.0,1,0.4,80,4,131,8),
D("Benin",2,1.4,1,13,0,0,4,16),D("Bhutan",1,3.5,1,0.8,85,0,35,0),D("Bolivia",4,3.6,1,12,6,128,167,32),
D("Bosnia and Herzegovina",0,7.5,1,3.2,96,0,10,0),D("Botswana",2,7.5,1,2.5,5,4,2,8),D("Brazil",4,9.0,4,215,34,138,142,7),
D("Brunei",1,32.0,1,0.4,89,36,19,0),D("Bulgaria",0,13.8,1,6.5,192,1,0,0),D("Burkina Faso",2,0.8,1,22,4,0,13,16),
D("Burundi",2,0.2,1,13,4,0,13,16),D("Cambodia",1,1.7,1,17,80,32,3,0),D("Cameroon",2,1.6,1,28,0,4,15,24),
D("Canada",3,52.0,6,40,114,7,1,31),D("Cape Verde",2,3.6,1,0.6,72,0,9,0),D("Central African Republic",2,0.5,1,5.5,4,0,15,144),
D("Chad",2,0.7,1,17,4,0,3,80),D("Chile",4,17.0,2,19.5,2,0,11,34),D("China",1,13.0,1,1412,2,10,9,261),
D("Colombia",4,6.6,1,52,2,128,3,160),D("Comoros",2,1.4,1,0.9,40,0,31,80),D("Republic of the Congo",2,2.1,1,6,0,16,15,16),
D("Costa Rica",3,13.0,1,5.2,2,0,3,32),D("Croatia",0,18.0,1,3.9,192,1,3,0),D("Cuba",3,9.5,1,11,10,0,11,32),
D("Cyprus",0,31.0,1,1.2,137,132,0,0),D("Czech Republic",0,27.0,1,10.8,198,1,3,0),D("Denmark",0,68.0,4,5.9,210,129,65,0),
D("Djibouti",2,3.4,1,1,0,0,15,80),D("Dominica",3,8.5,1,0.07,64,4,108,8),D("Dominican Republic",3,10.0,1,11,10,0,195,32),
D("DR Congo",2,0.6,2,100,0,0,15,144),D("East Timor",1,1.7,1,1.3,73,0,13,0),D("Ecuador",4,6.0,2,18,2,0,163,32),
D("Egypt",2,4.0,1,104,2,136,41,64),D("El Salvador",3,5.0,1,6.5,2,0,130,32),D("Equatorial Guinea",2,7.0,1,1.6,0,16,15,48),
D("Eritrea",2,0.6,1,3.6,0,128,7,64),D("Estonia",0,28.0,1,1.3,192,65,2,0),D("Eswatini",2,4.0,1,1.2,85,4,35,8),
D("Ethiopia",2,1.0,1,126,102,8,15,128),D("Fiji",5,5.5,1,0.9,73,4,99,8),D("Finland",0,54.0,1,5.5,192,129,67,1),
D("France",0,44.0,12,68,130,3,3,279),D("Gabon",2,8.0,1,2.3,0,16,0,16),D("Gambia",2,0.8,1,2.7,0,4,7,8),
D("Georgia",1,6.0,1,3.7,64,64,67,0),D("Germany",0,52.0,1,84,224,3,33,7),D("Ghana",2,2.4,1,33,0,4,45,8),
D("Greece",0,22.0,1,10.4,194,129,67,1),D("Grenada",3,11.0,1,0.1,89,4,45,8),D("Guatemala",3,5.5,1,18,2,0,167,32),
D("Guinea",2,1.2,1,14,0,0,5,16),D("Guinea-Bissau",2,0.8,1,2,0,0,13,0),D("Guyana",4,16.0,1,0.8,1,4,4,8),
D("Haiti",3,1.8,1,11.5,10,0,131,16),D("Honduras",3,2.8,1,10,2,0,11,32),D("Hungary",0,18.0,1,9.7,196,1,5,4),
D("Iceland",0,75.0,1,0.4,72,1,67,0),D("India",1,2.4,1,1428,99,14,15,268),D("Indonesia",1,4.8,3,277,9,34,33,4),
D("Iran",1,4.0,1,87,2,152,133,0),D("Iraq",1,5.0,1,43,98,16,133,192),D("Ireland",0,100.0,1,5.1,201,0,7,8),
D("Israel",1,55.0,1,9.8,64,128,11,384),D("Italy",0,35.0,1,59,192,3,5,7),D("Ivory Coast",2,2.5,1,28,0,0,4,16),
D("Jamaica",3,6.0,1,2.8,89,4,103,8),D("Japan",1,34.0,1,124,89,2,1,7),D("Jordan",1,4.4,1,11,80,0,13,64),
D("Kazakhstan",1,12.0,2,19.5,4,64,0,0),D("Kenya",2,2.1,1,54,1,4,37,8),D("Kiribati",5,1.8,3,0.12,9,4,43,8),
D("Kuwait",1,33.0,1,4.3,80,16,5,64),D("Kyrgyzstan",1,1.4,1,6.7,68,64,5,0),D("Laos",1,2.6,1,7.4,68,32,3,0),
D("Latvia",0,22.0,1,1.8,192,65,1,0),D("Lebanon",1,4.2,1,5.5,66,0,1,64),D("Lesotho",2,1.1,1,2.3,85,4,39,8),
D("Liberia",2,0.7,1,5.2,2,0,11,8),D("Libya",2,7.0,1,7,64,16,29,192),D("Liechtenstein",0,170.0,1,0.04,84,0,3,0),
D("Lithuania",0,24.0,1,2.8,192,65,5,0),D("Luxembourg",0,126.0,1,0.65,214,1,3,16),D("Madagascar",2,0.5,1,29,8,0,5,16),
D("Malawi",2,0.6,1,20,5,4,5,8),D("Malaysia",1,13.0,1,33,113,36,27,12),D("Maldives",1,11.0,1,0.5,9,4,21,0),
D("Mali",2,0.9,1,22,4,0,5,144),D("Malta",0,35.0,1,0.5,201,4,65,8),D("Marshall Islands",5,4.0,1,0.04,8,0,11,8),
D("Mauritania",2,1.8,1,4.7,0,0,29,64),D("Mauritius",2,11.0,1,1.3,73,4,7,8),D("Mexico",3,11.0,4,129,34,130,37,167),
D("Micronesia",5,3.8,1,0.1,8,0,11,8),D("Moldova",0,5.5,1,2.5,68,64,35,0),D("Monaco",0,190.0,1,0.04,80,0,1,20),
D("Mongolia",1,5.0,2,3.3,68,0,35,0),D("Montenegro",0,10.0,1,0.6,64,1,33,0),D("Morocco",2,3.6,1,37,80,128,9,68),
D("Mozambique",2,0.5,1,33,1,132,45,128),D("Myanmar",1,1.2,1,55,0,32,47,128),D("Namibia",2,5.0,1,2.5,1,4,7,8),
D("Nauru",5,11.0,1,0.01,9,4,43,8),D("Nepal",1,1.3,1,30,101,0,3,0),D("Netherlands",0,58.0,2,17.5,210,1,3,5),
D("New Zealand",5,48.0,2,5.1,91,4,75,8),D("Nicaragua",3,2.2,1,7,2,0,11,32),D("Niger",2,0.6,1,26,4,0,13,16),
D("Nigeria",2,2.2,1,224,32,20,5,136),D("North Korea",1,1.8,1,26,0,128,15,256),D("North Macedonia",0,6.8,1,2,68,1,1,0),
D("Norway",0,87.0,1,5.5,82,129,67,1),D("Oman",1,20.0,1,4.5,80,0,5,64),D("Pakistan",1,1.6,1,230,97,4,29,392),
D("Palau",5,14.0,1,0.02,8,0,11,8),D("Panama",3,17.0,1,4.4,2,0,15,32),D("Papua New Guinea",5,3.0,2,10,89,4,45,8),
D("Paraguay",4,5.5,1,7,6,0,143,32),D("Peru",4,7.0,1,34,2,0,33,32),D("Philippines",1,3.5,1,115,10,32,11,8),
D("Poland",0,19.0,1,37,194,1,1,0),D("Portugal",0,25.0,2,10.3,192,1,69,4),D("Qatar",1,88.0,1,2.9,80,128,1,70),
D("Romania",0,15.0,1,19,192,1,3,0),D("Russia",0,12.0,11,144,34,202,3,391),D("Rwanda",2,1.0,1,14,4,4,7,24),
D("Saint Kitts and Nevis",3,20.0,1,0.05,89,4,36,8),D("Saint Lucia",3,11.0,1,0.18,89,4,2,8),D("Saint Vincent",3,8.5,1,0.1,89,4,36,8),
D("Samoa",5,4.5,1,0.2,73,4,11,8),D("San Marino",0,48.0,1,0.03,4,0,2,0),D("Sao Tome and Principe",2,2.4,1,0.2,8,0,13,0),
D("Saudi Arabia",1,28.0,1,36,82,26,132,68),D("Senegal",2,1.6,1,17,0,0,13,16),D("Serbia",0,9.5,1,6.6,68,0,97,0),
D("Seychelles",2,18.0,1,0.1,9,4,7,24),D("Sierra Leone",2,0.5,1,8.4,0,4,7,8),D("Singapore",1,65.0,1,5.5,73,164,25,12),
D("Slovakia",0,22.0,1,5.4,196,1,67,0),D("Slovenia",0,30.0,1,2.1,192,1,11,0),D("Solomon Islands",5,2.3,1,0.7,89,4,15,8),
D("Somalia",2,0.5,1,17,32,0,15,192),D("South Africa",2,6.2,1,62,3,14,7,14),D("South Korea",1,33.0,1,52,0,130,11,7),
D("South Sudan",2,0.3,1,11,36,128,15,136),D("Spain",0,31.0,2,47,208,1,33,39),D("Sri Lanka",1,3.8,1,22,9,4,37,8),
D("Sudan",2,0.7,1,46,32,0,5,200),D("Suriname",4,5.8,1,0.6,1,0,13,0),D("Sweden",0,56.0,1,10.5,208,129,67,7),
D("Switzerland",0,92.0,1,8.8,36,128,65,23),D("Syria",1,1.2,1,22,2,0,13,192),D("Tajikistan",1,0.9,1,10,4,64,13,0),
D("Tanzania",2,1.1,1,65,1,4,15,8),D("Thailand",1,7.2,1,72,81,160,3,0),D("Togo",2,1.0,1,8.8,0,0,15,16),
D("Tonga",5,5.0,1,0.1,89,4,67,8),D("Trinidad and Tobago",3,17.0,1,1.4,73,4,1,8),D("Tunisia",2,3.8,1,12,0,0,25,64),
D("Turkey",1,10.6,1,85,2,131,25,4),D("Turkmenistan",1,8.0,1,6.3,4,64,29,0),D("Tuvalu",5,5.0,1,0.01,89,4,75,8),
D("UAE",1,50.0,1,10,112,152,4,68),D("Uganda",2,0.9,1,47,5,4,37,8),D("UK",0,47.0,9,68,91,7,67,271),
D("Ukraine",0,4.0,1,37,2,64,0,128),D("Uruguay",4,22.0,1,3.5,2,0,3,34),D("USA",3,76.0,6,335,34,3,11,271),
D("Uzbekistan",1,2.0,1,35,4,64,31,0),D("Vanuatu",5,3.2,1,0.3,72,4,7,24),D("Venezuela",4,3.6,1,29,34,16,11,32),
D("Vietnam",1,4.3,1,100,64,32,9,4),D("Yemen",1,0.6,1,33,0,0,1,192),D("Zambia",2,1.1,1,20,5,4,37,8),
D("Zimbabwe",2,1.4,1,16,5,0,37,8)];

// ─── Categories (33 game-ready) ───
const CATS={
  europe:{l:"In Europe",i:"🌍",d:1,t:c=>c.cont===0},
  asia:{l:"In Asia",i:"🌏",d:1,t:c=>c.cont===1},
  africa:{l:"In Africa",i:"🌍",d:1,t:c=>c.cont===2},
  americas:{l:"In Americas",i:"🌎",d:1,t:c=>c.cont>=3&&c.cont<=4},
  locked:{l:"Landlocked",i:"⛰️",d:1,t:c=>c.locked},
  island:{l:"Island Nation",i:"🏝️",d:1,t:c=>c.isle},
  left:{l:"Drives Left",i:"🚗",d:2,t:c=>c.left},
  gdp40k:{l:"GDP/Cap > $40K",i:"💰",d:3,t:c=>c.gdp>40},
  gdp20k:{l:"GDP/Cap > $20K",i:"💸",d:2,t:c=>c.gdp>20},
  monarchy:{l:"Is a Monarchy",i:"👑",d:2,t:c=>c.monarchy},
  pmHead:{l:"PM Leads Govt",i:"🏛️",d:3,t:c=>c.pm},
  unFound:{l:"UN Founder '45",i:"🕊️",d:3,t:c=>c.un},
  inEU:{l:"In the EU",i:"🇪🇺",d:2,t:c=>c.eu},
  inNATO:{l:"In NATO",i:"🛡️",d:2,t:c=>c.nato},
  g20:{l:"In the G20",i:"🌐",d:3,t:c=>c.g20},
  cwlth:{l:"Commonwealth",i:"🤝",d:2,t:c=>c.cwlth},
  flStars:{l:"Flag Has Stars",i:"⭐",d:2,t:c=>c.fl_stars},
  flCrescent:{l:"Flag: Crescent",i:"☪️",d:3,t:c=>c.fl_crescent},
  flAnimal:{l:"Flag: Animal",i:"🦁",d:3,t:c=>c.fl_animal},
  flCross:{l:"Flag: Cross",i:"✝️",d:3,t:c=>c.fl_cross},
  olympics:{l:"Hosted Olympics",i:"🏅",d:3,t:c=>c.olympics},
  fifaWC:{l:"Hosted FIFA WC",i:"⚽",d:3,t:c=>c.fifa},
  f1gp:{l:"Hosted F1 GP",i:"🏎️",d:2,t:c=>c.f1gp},
  eng:{l:"English Official",i:"🗣️",d:1,t:c=>c.eng},
  fre:{l:"French Official",i:"🗣️",d:2,t:c=>c.fr},
  esp:{l:"Spanish Official",i:"🗣️",d:2,t:c=>c.es},
  pop50:{l:"Pop > 50M",i:"👥",d:2,t:c=>c.pop>50},
  conflict:{l:"Conflict Post-2000",i:"⚠️",d:3,t:c=>c.conflict},
  soviet:{l:"Was Soviet",i:"☭",d:3,t:c=>c.soviet},
  startS:{l:"Starts with S",i:"🔤",d:1,t:c=>c.name[0]==="S"},
  startC:{l:"Starts with C",i:"🔤",d:1,t:c=>c.name[0]==="C"},
  startB:{l:"Starts with B",i:"🔤",d:1,t:c=>c.name[0]==="B"},
  startM:{l:"Starts with M",i:"🔤",d:1,t:c=>c.name[0]==="M"},
};
const CAT_KEYS=Object.keys(CATS);

// ─── Puzzle Generator ───
function sRng(seed){let s=seed|0;return()=>{s=(Math.imul(s,1664525)+1013904223)|0;return(s>>>0)/4294967296;};}
function shuffle(a,rng){const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;}

// Precompute members per category for speed
const CAT_MEMBERS={};
CAT_KEYS.forEach(k=>{CAT_MEMBERS[k]=DB.filter(c=>CATS[k].t(c));});

function cellCount(rk,ck){return CAT_MEMBERS[rk].filter(c=>CATS[ck].t(c)).length;}
function cellAnswers(rk,ck){return CAT_MEMBERS[rk].filter(c=>CATS[ck].t(c)).map(c=>c.name);}

function genGrid(rng){
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

function dailySeed(){const d=new Date();return d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate();}
function makeDailyGrid(){return genGrid(sRng(dailySeed()));}
function makeRandomGrid(){return genGrid(()=>Math.random());}

// ─── Reverse Mode: Dynamic Category Selection ───
const REV_POOL=DB.filter(c=>c.pop>1).map(c=>c.name);

// For each country, pick 4 true (mix of obvious+surprising) + 4 plausible-false = 8 total
function pickRevCats(country){
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

// ─── Themes ───
const TH={
  light:{bg:"#EFECE3",sf:"#FFFFFF",sf2:"#E6E3DA",tx:"#2B2D42",txM:"#6B6D82",txD:"#9C9EB0",
    pri:"#D95448",sec:"#3D6B8E",ok:"#3E8A54",honey:"#C88B2E",
    okBg:"#E5F2E8",okBd:"#3E8A54",noBg:"#FCE8E8",noBd:"#D95448",selBg:"#DFF0FA",selBd:"#3D6B8E",
    bd:"#CCC8BC",bdD:"#B8B4A8",tagBg:"#2B2D42",tagTx:"#F5F3EC",shd:"0 1px 4px rgba(0,0,0,0.06)"},
  dark:{bg:"#151527",sf:"#1F1F3A",sf2:"#29294A",tx:"#E4E2D6",txM:"#9292AC",txD:"#5E5E78",
    pri:"#FF7B6E",sec:"#6AB4DC",ok:"#6ECF76",honey:"#FFD166",
    okBg:"#17302A",okBd:"#6ECF76",noBg:"#361A20",noBd:"#FF7B6E",selBg:"#192C3E",selBd:"#6AB4DC",
    bd:"#38385A",bdD:"#484870",tagBg:"#E4E2D6",tagTx:"#151527",shd:"0 1px 4px rgba(0,0,0,0.2)"},
};

// ─── Country Picker ───
function Picker({onPick,onClose,t}){
  const [q,setQ]=useState("");
  const all=useMemo(()=>[...DB].sort((a,b)=>a.name.localeCompare(b.name)),[]);
  const list=q?all.filter(c=>c.name.toLowerCase().includes(q.toLowerCase())):all;
  const grp={};list.forEach(c=>{const l=c.name[0];(grp[l]=grp[l]||[]).push(c);});
  const ltrs=Object.keys(grp).sort();
  const jump=l=>document.getElementById(`gl-${l}`)?.scrollIntoView({behavior:"smooth",block:"start"});
  return(
    <div style={{position:"fixed",inset:0,zIndex:100,display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
      <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(0,0,0,.45)",backdropFilter:"blur(2px)"}}/>
      <div style={{position:"relative",background:t.sf,borderRadius:"18px 18px 0 0",maxHeight:"70vh",display:"flex",flexDirection:"column",boxShadow:"0 -4px 24px rgba(0,0,0,.15)"}}>
        <div style={{display:"flex",justifyContent:"center",padding:"10px 0 2px"}}><div style={{width:32,height:4,borderRadius:2,background:t.bd}}/></div>
        <div style={{padding:"6px 18px 10px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontWeight:700,fontSize:16,color:t.tx}}>Pick a country</span>
          <button onClick={onClose} style={{background:t.sf2,border:"none",borderRadius:18,width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:t.txD,fontSize:14,fontWeight:800}}>✕</button>
        </div>
        <div style={{padding:"0 18px 8px"}}>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Filter countries..."
            style={{width:"100%",padding:"8px 12px",borderRadius:8,border:`1.5px solid ${t.bd}`,background:t.bg,color:t.tx,fontSize:14,outline:"none",boxSizing:"border-box"}}/>
        </div>
        <div style={{display:"flex",flex:1,overflow:"hidden",minHeight:0}}>
          <div style={{flex:1,overflowY:"auto",padding:"0 18px 20px",WebkitOverflowScrolling:"touch"}}>
            {ltrs.length===0&&<div style={{padding:24,textAlign:"center",color:t.txD,fontSize:14}}>No match</div>}
            {ltrs.map(l=>(<div key={l}>
              <div id={`gl-${l}`} style={{position:"sticky",top:0,background:t.sf,padding:"7px 0 3px",fontSize:11,fontWeight:800,color:t.pri,letterSpacing:2,fontFamily:"ui-monospace,monospace"}}>{l}</div>
              {grp[l].map(c=>(<button key={c.name} onClick={()=>onPick(c.name)} style={{display:"block",width:"100%",textAlign:"left",padding:"11px 6px",background:"none",border:"none",borderBottom:`1px solid ${t.bd}20`,color:t.tx,fontSize:15,cursor:"pointer"}}>{c.name}</button>))}
            </div>))}
          </div>
          <div style={{display:"flex",flexDirection:"column",justifyContent:"center",padding:"0 5px",gap:0}}>
            {ltrs.map(l=>(<button key={l} onClick={()=>jump(l)} style={{background:"none",border:"none",color:t.sec,fontSize:9,fontWeight:700,padding:"1.5px 3px",cursor:"pointer",fontFamily:"ui-monospace,monospace"}}>{l}</button>))}
          </div>
        </div>
      </div>
    </div>);
}

function CatTag({id,t,s}){const c=CATS[id];return(
  <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:s?"4px 3px":"6px 4px",gap:s?3:4}}>
    <span style={{fontSize:s?16:20,lineHeight:1,display:"block"}}>{c.i}</span>
    <span style={{fontSize:s?9:10,fontWeight:700,color:t.txM,textAlign:"center",lineHeight:1.2,textTransform:"uppercase",letterSpacing:.4,maxWidth:s?72:80}}>{c.l}</span>
  </div>);}

// ─── HOME ───
function Home({onNav,streak,t}){
  return(
    <div style={{padding:"32px 20px 20px",maxWidth:420,margin:"0 auto"}}>
      <div style={{marginBottom:28}}>
        <h1 style={{fontSize:30,fontWeight:800,color:t.tx,margin:0,letterSpacing:-.5}}>Geo<span style={{fontWeight:300,color:t.sec}}>Sense</span></h1>
        <p style={{color:t.txD,fontSize:13,margin:"3px 0 0"}}>How well do you know the world's countries?</p>
      </div>
      {streak>0&&(<div style={{display:"inline-flex",alignItems:"center",gap:5,padding:"5px 14px",background:t.sf,borderRadius:20,marginBottom:14,boxShadow:t.shd}}>
        <span style={{fontSize:15}}>🔥</span><span style={{fontFamily:"ui-monospace,monospace",fontWeight:800,fontSize:17,color:t.honey}}>{streak}</span><span style={{color:t.txD,fontSize:11}}>day streak</span>
      </div>)}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {[{id:"daily",em:"📅",ti:"Daily Grid",su:"One puzzle per day, same for everyone",co:t.pri},
          {id:"random",em:"🎲",ti:"Random Puzzle",su:"Unlimited generated grids",co:t.sec},
          {id:"practice",em:"🎯",ti:"Practice",su:"Quiz yourself with two game modes",co:t.honey},
          {id:"training",em:"🧠",ti:"Training",su:"Adaptive spaced repetition · Coming soon",co:t.txD,off:true}
        ].map(m=>(<button key={m.id} onClick={()=>!m.off&&onNav(m.id)}
          style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",background:t.sf,
            borderLeft:`4px solid ${m.off?t.bd:m.co}`,border:`1px solid ${t.bd}50`,borderLeftWidth:4,borderLeftColor:m.off?t.bd:m.co,
            borderRadius:"3px 12px 12px 3px",cursor:m.off?"not-allowed":"pointer",opacity:m.off?.4:1,textAlign:"left",boxShadow:m.off?"none":t.shd}}>
          <span style={{fontSize:24,width:42,height:42,display:"flex",alignItems:"center",justifyContent:"center",background:t.sf2,borderRadius:10}}>{m.em}</span>
          <div style={{flex:1}}><div style={{color:t.tx,fontSize:15,fontWeight:700}}>{m.ti}</div><div style={{color:t.txD,fontSize:12,marginTop:1}}>{m.su}</div></div>
          {!m.off&&<span style={{color:m.co,fontSize:18}}>→</span>}
        </button>))}
      </div>
      <button onClick={()=>onNav("stats")} style={{display:"block",margin:"20px auto 0",background:"none",border:"none",color:t.txD,fontSize:13,cursor:"pointer",textDecoration:"underline dotted",textUnderlineOffset:3}}>Your progress</button>
    </div>);
}

// ─── GRID GAME (shared by Daily + Random) ───
function GridGame({onBack,onDone,grid,mode,onNewPuzzle,t}){
  const [cells,setCells]=useState(Array(9).fill(null));
  const [sel,setSel]=useState(null);
  const [gl,setGl]=useState(12);
  const [log,setLog]=useState([]);
  const [flash,setFlash]=useState(null);
  const [toast,setToast]=useState(null);
  const sc=cells.filter(c=>c?.ok).length;
  const done=sc===9||gl===0;
  useEffect(()=>{if(done)setTimeout(()=>onDone(cells,gl,grid),900);},[done]);
  const showToast=(txt,good)=>{setToast({txt,good});setTimeout(()=>setToast(null),1200);};
  const guess=useCallback(name=>{
    if(sel===null||done)return;
    const r=Math.floor(sel/3),c=sel%3;
    const co=DB.find(x=>x.name===name);
    const ok=co&&CATS[grid.rows[r]].t(co)&&CATS[grid.cols[c]].t(co);
    setLog(p=>{const e=p.find(g=>g.name===name);return e?p.map(g=>g.name===name?{...g,ok:g.ok||ok}:g):[...p,{name,ok}];});
    if(ok){const nc=[...cells];nc[sel]={name,ok:true};setCells(nc);showToast(["Nice! 📍","Got it!","Correct! 🎯"][Math.floor(Math.random()*3)],true);}
    else{setFlash(sel);setTimeout(()=>setFlash(null),500);showToast(["Not quite","Nope","Try again"][Math.floor(Math.random()*3)],false);}
    setGl(g=>g-1);setSel(null);
  },[sel,done,cells,grid]);

  // Compute difficulty label
  const avgDiff=([...grid.rows,...grid.cols].reduce((s,k)=>s+CATS[k].d,0)/6);
  const diffLabel=avgDiff<1.5?"Easy":avgDiff<2.3?"Medium":"Hard";

  return(
    <div style={{padding:"14px 10px",maxWidth:420,margin:"0 auto",paddingBottom:sel!==null?300:14}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <button onClick={onBack} style={{background:t.sf2,border:"none",borderRadius:8,width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:t.txM,fontSize:17}}>←</button>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:13,fontWeight:700,color:t.tx}}>{mode==="daily"?"Daily Grid":"Random Puzzle"}</div>
          <div style={{fontSize:10,color:t.txD}}>{diffLabel}</div>
        </div>
        <div style={{textAlign:"center",padding:"3px 10px",borderRadius:8,background:gl<=3?t.noBg:t.sf2,border:gl<=3?`1.5px solid ${t.noBd}`:"1.5px solid transparent"}}>
          <div style={{fontFamily:"ui-monospace,monospace",fontSize:19,fontWeight:800,color:gl<=3?t.pri:t.tx,lineHeight:1}}>{gl}</div>
          <div style={{fontSize:7.5,color:t.txD,textTransform:"uppercase",letterSpacing:1}}>left</div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"72px repeat(3,1fr)",gridTemplateRows:"64px repeat(3,1fr)",gap:4}}>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
          <div style={{fontFamily:"ui-monospace,monospace",fontSize:22,fontWeight:800,color:t.pri,lineHeight:1}}>{sc}</div>
          <div style={{fontSize:7.5,color:t.txD,textTransform:"uppercase",letterSpacing:1}}>score</div>
        </div>
        {grid.cols.map((id,i)=><CatTag key={i} id={id} t={t} s/>)}
        {grid.rows.map((rc,r)=><>
          <CatTag key={`r${r}`} id={rc} t={t} s/>
          {grid.cols.map((_,c)=>{
            const idx=r*3+c,cell=cells[idx];
            const isF=flash===idx,isS=sel===idx,isOk=cell?.ok;
            let bg=t.sf,bd=t.bdD,bs="dashed",bw="1.5px",col=t.txD;
            if(isOk){bg=t.okBg;bd=t.okBd;bs="solid";bw="2px";col=t.ok;}
            else if(isF){bg=t.noBg;bd=t.noBd;bs="solid";bw="2px";col=t.pri;}
            else if(isS){bg=t.selBg;bd=t.selBd;bs="solid";bw="2px";col=t.sec;}
            return(<button key={idx} onClick={()=>{if(!isOk&&!done)setSel(sel===idx?null:idx);}}
              style={{background:bg,border:`${bw} ${bs} ${bd}`,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",
                padding:3,cursor:isOk||done?"default":"pointer",minHeight:64,transition:"all .12s",position:"relative",
                color:col,fontSize:11,fontWeight:isOk?700:400,textAlign:"center",lineHeight:1.15,wordBreak:"break-word",
                animation:isF?"shake .35s ease":"none"}}>
              {isOk?(<><span>{cell.name}</span><span style={{position:"absolute",top:2,right:3,fontSize:9}}>📍</span></>):(<span style={{fontSize:18,opacity:.3}}>+</span>)}
            </button>);})}
        </>)}
      </div>
      <div style={{height:36,display:"flex",alignItems:"center",justifyContent:"center"}}>
        {toast&&(<div style={{padding:"6px 18px",borderRadius:20,background:toast.good?t.ok:t.pri,color:"#fff",fontSize:13,fontWeight:700,animation:"toastIn .25s ease"}}>{toast.txt}</div>)}
      </div>
      {log.length>0&&(<div style={{display:"flex",flexWrap:"wrap",gap:3}}>
        {log.map(g=>(<span key={g.name} style={{fontSize:9.5,padding:"1.5px 7px",borderRadius:5,background:g.ok?t.okBg:t.noBg,color:g.ok?t.ok:t.pri,border:`1px solid ${g.ok?t.okBd:t.noBd}30`}}>{g.name}</span>))}
      </div>)}
      {sel!==null&&<Picker onPick={guess} onClose={()=>setSel(null)} t={t}/>}
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-5px)}40%{transform:translateX(5px)}60%{transform:translateX(-3px)}80%{transform:translateX(3px)}}@keyframes toastIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>);
}

// ─── POST GAME ───
function PostGame({cells,guesses,grid,mode,onBack,onRev,onNew,t}){
  const sc=cells.filter(c=>c?.ok).length;
  const [exp,setExp]=useState(null);
  const emo=cells.map(c=>c?.ok?"🟩":"⬛").reduce((a,e,i)=>a+e+((i+1)%3===0&&i<8?"\n":""),"");
  const face=sc===9?"🌟":sc>=6?"🗺️":"📚";
  return(
    <div style={{padding:"16px",maxWidth:420,margin:"0 auto"}}>
      <div style={{textAlign:"center",marginBottom:16}}>
        <div style={{fontSize:40,marginBottom:2}}>{face}</div>
        <h2 style={{fontSize:22,fontWeight:800,color:t.tx,margin:0}}>{sc===9?"Flawless!":sc>=6?"Well played!":"Keep exploring!"}</h2>
        <div style={{marginTop:6,display:"inline-flex",gap:14,fontSize:13,color:t.txM}}>
          <span><strong style={{color:t.ok,fontFamily:"ui-monospace,monospace"}}>{sc}</strong>/9</span>
          <span><strong style={{color:t.pri,fontFamily:"ui-monospace,monospace"}}>{12-guesses}</strong> guesses</span>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"72px repeat(3,1fr)",gridTemplateRows:"58px repeat(3,auto)",gap:3}}>
        <div/>
        {grid.cols.map((id,i)=><CatTag key={i} id={id} t={t} s/>)}
        {grid.rows.map((rc,r)=><>
          <CatTag key={`r${r}`} id={rc} t={t} s/>
          {grid.cols.map((cc,c)=>{
            const idx=r*3+c,cell=cells[idx],key=`${r}-${c}`,isE=exp===key;
            const ans=cellAnswers(rc,cc);
            return(<div key={idx}>
              <button onClick={()=>setExp(isE?null:key)}
                style={{width:"100%",minHeight:50,borderRadius:8,cursor:"pointer",textAlign:"center",
                  border:cell?.ok?`2px solid ${t.okBd}`:`1.5px dashed ${t.bd}`,
                  background:cell?.ok?t.okBg:t.sf,padding:4,fontSize:11,fontWeight:700,color:cell?.ok?t.ok:t.txD,lineHeight:1.2,position:"relative"}}>
                {cell?.ok?<>{cell.name}<span style={{position:"absolute",top:2,right:3,fontSize:8}}>📍</span></>:`${ans.length} answers`}
                <div style={{fontSize:7.5,color:t.txD,marginTop:1}}>{isE?"▲":"▼"}</div>
              </button>
              {isE&&(<div style={{marginTop:3,padding:7,background:t.sf2,borderRadius:6,fontSize:10.5,border:`1px solid ${t.bd}30`}}>
                <div style={{display:"flex",flexWrap:"wrap",gap:2}}>
                  {ans.map(a=><span key={a} style={{padding:"1.5px 6px",borderRadius:4,fontSize:9.5,
                    background:cell?.name===a?t.okBg:t.bg,color:cell?.name===a?t.ok:t.txD,border:`1px solid ${cell?.name===a?t.okBd:t.bd}30`}}>{a}</span>)}
                </div>
              </div>)}
            </div>);})}
        </>)}
      </div>
      <div style={{textAlign:"center",marginTop:14}}>
        <div style={{fontFamily:"ui-monospace,monospace",fontSize:15,lineHeight:1.7,color:t.tx,whiteSpace:"pre",marginBottom:8}}>{emo}</div>
        <button onClick={()=>navigator.clipboard?.writeText(`GeoSense ${mode==="daily"?"Daily":"Random"}\n${emo}\n${sc}/9`)}
          style={{padding:"9px 22px",borderRadius:8,background:t.tagBg,border:"none",color:t.tagTx,fontWeight:700,fontSize:13,cursor:"pointer"}}>📋 Copy</button>
      </div>
      <div style={{display:"flex",gap:8,marginTop:14}}>
        <button onClick={onBack} style={{flex:1,padding:"11px",borderRadius:8,background:t.sf,border:`1.5px solid ${t.bd}`,color:t.txM,fontSize:13,fontWeight:600,cursor:"pointer"}}>Home</button>
        {mode==="random"&&<button onClick={onNew} style={{flex:1,padding:"11px",borderRadius:8,background:t.sf,border:`1.5px solid ${t.sec}`,color:t.sec,fontSize:13,fontWeight:600,cursor:"pointer"}}>New Puzzle 🎲</button>}
        <button onClick={onRev} style={{flex:1,padding:"11px",borderRadius:8,background:t.selBg,border:`1.5px solid ${t.selBd}`,color:t.sec,fontSize:13,fontWeight:600,cursor:"pointer"}}>Practice →</button>
      </div>
    </div>);
}

// ─── PRACTICE LANDING ───
function PracticeLanding({onBack,onQuiz,onQuickFire,t}){
  return(
    <div style={{padding:"28px 20px",maxWidth:420,margin:"0 auto"}}>
      <div style={{display:"flex",alignItems:"center",marginBottom:24}}>
        <button onClick={onBack} style={{background:t.sf2,border:"none",borderRadius:8,width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:t.txM,fontSize:17}}>←</button>
        <h2 style={{fontSize:20,fontWeight:800,color:t.tx,margin:"0 0 0 12px"}}>Practice</h2>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        <button onClick={onQuiz} style={{textAlign:"left",padding:"18px",background:t.sf,borderRadius:12,border:`1px solid ${t.bd}50`,borderLeft:`4px solid ${t.honey}`,boxShadow:t.shd,cursor:"pointer"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
            <span style={{fontSize:24}}>🎯</span>
            <span style={{fontSize:17,fontWeight:700,color:t.tx}}>Country Quiz</span>
          </div>
          <p style={{fontSize:13,color:t.txM,margin:0,lineHeight:1.5}}>See a country, pick which traits apply from 8 curated options. 4 are true, 4 are decoys. A "Did you know?" reveal after each round teaches you the surprising facts.</p>
          <div style={{marginTop:10,display:"flex",gap:6}}>
            {["👑","⭐","🏅","🛡️"].map(e=><span key={e} style={{fontSize:12,padding:"2px 8px",background:t.sf2,borderRadius:6}}>{e}</span>)}
            <span style={{fontSize:11,color:t.txD,alignSelf:"center"}}>33 categories</span>
          </div>
        </button>
        <button onClick={onQuickFire} style={{textAlign:"left",padding:"18px",background:t.sf,borderRadius:12,border:`1px solid ${t.bd}50`,borderLeft:`4px solid ${t.sec}`,boxShadow:t.shd,cursor:"pointer"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
            <span style={{fontSize:24}}>⚡</span>
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

// ─── QUICK FIRE ───
// Flag emoji from ISO2 codes
const _i2={Afghanistan:"AF",Albania:"AL",Algeria:"DZ",Andorra:"AD",Angola:"AO","Antigua and Barbuda":"AG",Argentina:"AR",Armenia:"AM",Australia:"AU",Austria:"AT",Azerbaijan:"AZ",Bahamas:"BS",Bahrain:"BH",Bangladesh:"BD",Barbados:"BB",Belarus:"BY",Belgium:"BE",Belize:"BZ",Benin:"BJ",Bhutan:"BT",Bolivia:"BO","Bosnia and Herzegovina":"BA",Botswana:"BW",Brazil:"BR",Brunei:"BN",Bulgaria:"BG","Burkina Faso":"BF",Burundi:"BI",Cambodia:"KH",Cameroon:"CM",Canada:"CA","Cape Verde":"CV","Central African Republic":"CF",Chad:"TD",Chile:"CL",China:"CN",Colombia:"CO",Comoros:"KM","Republic of the Congo":"CG","Costa Rica":"CR",Croatia:"HR",Cuba:"CU",Cyprus:"CY","Czech Republic":"CZ",Denmark:"DK",Djibouti:"DJ",Dominica:"DM","Dominican Republic":"DO","DR Congo":"CD","East Timor":"TL",Ecuador:"EC",Egypt:"EG","El Salvador":"SV","Equatorial Guinea":"GQ",Eritrea:"ER",Estonia:"EE",Eswatini:"SZ",Ethiopia:"ET",Fiji:"FJ",Finland:"FI",France:"FR",Gabon:"GA",Gambia:"GM",Georgia:"GE",Germany:"DE",Ghana:"GH",Greece:"GR",Grenada:"GD",Guatemala:"GT",Guinea:"GN","Guinea-Bissau":"GW",Guyana:"GY",Haiti:"HT",Honduras:"HN",Hungary:"HU",Iceland:"IS",India:"IN",Indonesia:"ID",Iran:"IR",Iraq:"IQ",Ireland:"IE",Israel:"IL",Italy:"IT","Ivory Coast":"CI",Jamaica:"JM",Japan:"JP",Jordan:"JO",Kazakhstan:"KZ",Kenya:"KE",Kiribati:"KI",Kuwait:"KW",Kyrgyzstan:"KG",Laos:"LA",Latvia:"LV",Lebanon:"LB",Lesotho:"LS",Liberia:"LR",Libya:"LY",Liechtenstein:"LI",Lithuania:"LT",Luxembourg:"LU",Madagascar:"MG",Malawi:"MW",Malaysia:"MY",Maldives:"MV",Mali:"ML",Malta:"MT","Marshall Islands":"MH",Mauritania:"MR",Mauritius:"MU",Mexico:"MX",Micronesia:"FM",Moldova:"MD",Monaco:"MC",Mongolia:"MN",Montenegro:"ME",Morocco:"MA",Mozambique:"MZ",Myanmar:"MM",Namibia:"NA",Nauru:"NR",Nepal:"NP",Netherlands:"NL","New Zealand":"NZ",Nicaragua:"NI",Niger:"NE",Nigeria:"NG","North Korea":"KP","North Macedonia":"MK",Norway:"NO",Oman:"OM",Pakistan:"PK",Palau:"PW",Panama:"PA","Papua New Guinea":"PG",Paraguay:"PY",Peru:"PE",Philippines:"PH",Poland:"PL",Portugal:"PT",Qatar:"QA",Romania:"RO",Russia:"RU",Rwanda:"RW","Saint Kitts and Nevis":"KN","Saint Lucia":"LC","Saint Vincent":"VC",Samoa:"WS","San Marino":"SM","Sao Tome and Principe":"ST","Saudi Arabia":"SA",Senegal:"SN",Serbia:"RS",Seychelles:"SC","Sierra Leone":"SL",Singapore:"SG",Slovakia:"SK",Slovenia:"SI","Solomon Islands":"SB",Somalia:"SO","South Africa":"ZA","South Korea":"KR","South Sudan":"SS",Spain:"ES","Sri Lanka":"LK",Sudan:"SD",Suriname:"SR",Sweden:"SE",Switzerland:"CH",Syria:"SY",Tajikistan:"TJ",Tanzania:"TZ",Thailand:"TH",Togo:"TG",Tonga:"TO","Trinidad and Tobago":"TT",Tunisia:"TN",Turkey:"TR",Turkmenistan:"TM",Tuvalu:"TV",UAE:"AE",Uganda:"UG",UK:"GB",Ukraine:"UA",Uruguay:"UY",USA:"US",Uzbekistan:"UZ",Vanuatu:"VU",Venezuela:"VE",Vietnam:"VN",Yemen:"YE",Zambia:"ZM",Zimbabwe:"ZW"};
const getFlag=n=>{const c=_i2[n];return c?[...c].map(l=>String.fromCodePoint(0x1F1E6+l.charCodeAt(0)-65)).join(""):"🏳️";};

const FLAG_KEYS=["fl_red","fl_blue","fl_green","fl_stars","fl_crescent","fl_animal","fl_cross","fl_text"];
const FLAG_LABELS={fl_red:"red",fl_blue:"blue",fl_green:"green",fl_stars:"stars",fl_crescent:"crescent",fl_animal:"animal",fl_cross:"cross",fl_text:"text/script"};
const CONT_NAMES=["Europe","Asia","Africa","N. America","S. America","Oceania"];
// Categories usable in Quick Fire (no name-based trivial ones)
const QF_CATS=CAT_KEYS.filter(k=>!k.startsWith("start"));

function enrichAnswer(card){
  const{co,cat,answer}=card;
  const f=getFlag(co.name);
  if(cat==="gdp40k"||cat==="gdp20k")return`GDP per capita: ~$${co.gdp>=1?Math.round(co.gdp):co.gdp}K`;
  if(cat==="pop50")return`Population: ~${co.pop>=1?Math.round(co.pop):co.pop}M`;
  if(cat==="locked")return answer?"Landlocked, no coastline":`Has a coastline (in ${CONT_NAMES[co.cont]})`;
  if(cat==="island")return answer?"Entirely surrounded by water":"Has land borders";
  if(cat==="left")return answer?"Drives on the left side":"Drives on the right side";
  if(cat.startsWith("fl")){
    const traits=FLAG_KEYS.filter(k=>co[k]).map(k=>FLAG_LABELS[k]);
    return`${f} Flag features: ${traits.length?traits.join(", "):"simple design"}`;
  }
  if(cat==="monarchy")return answer?`${co.pm?"Constitutional":"Absolute"} monarchy`:"Republic";
  if(cat==="pmHead")return co.pm?"Parliamentary system (PM leads)":"Presidential system";
  if(cat==="europe"||cat==="asia"||cat==="africa"||cat==="americas")return`${f} Located in ${CONT_NAMES[co.cont]}`;
  return"";
}

function QuickFire({onBack,t}){
  const pool=useMemo(()=>DB.filter(c=>c.pop>1),[]);
  const goodCats=useMemo(()=>QF_CATS.filter(k=>CATS[k].d>=2),[]);

  const genCard=useCallback(()=>{
    const co=pool[Math.floor(Math.random()*pool.length)];
    const catPool=Math.random()<0.7?goodCats:QF_CATS;
    const cat=catPool[Math.floor(Math.random()*catPool.length)];
    return{co,cat,answer:CATS[cat].t(co)};
  },[pool,goodCats]);

  const [card,setCard]=useState(()=>genCard());
  const [fb,setFb]=useState(null);
  const [score,setScore]=useState({c:0,tot:0,streak:0,best:0});
  const [locked,setLocked]=useState(false);
  const [history,setHistory]=useState([]);
  const [viewIdx,setViewIdx]=useState(null); // null=live, number=reviewing

  const handleAnswer=(yes)=>{
    if(locked)return;
    setLocked(true);
    const correct=yes===card.answer;
    setFb(correct?"correct":"wrong");
    const entry={...card,playerSaidYes:yes,correct};
    setHistory(h=>[...h,entry]);
    setScore(s=>({c:s.c+(correct?1:0),tot:s.tot+1,streak:correct?s.streak+1:0,best:correct?Math.max(s.best,s.streak+1):s.best}));
    setTimeout(()=>{setFb(null);setCard(genCard());setLocked(false);},1000);
  };

  const viewing=viewIdx!==null;
  const viewCard=viewing?history[viewIdx]:null;
  const pct=score.tot>0?Math.round(score.c/score.tot*100):0;

  // Card to display (live or history)
  const displayCard=viewing?viewCard:card;
  const displayCat=CATS[displayCard.cat];
  const displayExtra=viewing||fb?enrichAnswer(displayCard):"";
  const bgFlash=!viewing&&fb==="correct"?t.okBg:!viewing&&fb==="wrong"?t.noBg:t.bg;

  return(
    <div style={{minHeight:"100vh",background:bgFlash,transition:"background .15s",padding:"16px",maxWidth:420,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <button onClick={onBack} style={{background:t.sf2,border:"none",borderRadius:8,width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:t.txM,fontSize:17}}>←</button>
        <span style={{fontSize:14,fontWeight:700,color:t.sec}}>⚡ Quick Fire</span>
        <div style={{textAlign:"right"}}>
          <div style={{fontFamily:"ui-monospace,monospace",fontSize:14,fontWeight:700,color:t.tx}}>{score.c}/{score.tot}</div>
          <div style={{fontSize:9,color:t.txD}}>{pct}% correct</div>
        </div>
      </div>

      {/* Streak */}
      {!viewing&&score.streak>1&&(
        <div style={{textAlign:"center",marginBottom:8}}>
          <span style={{padding:"4px 14px",borderRadius:16,background:t.sf,fontSize:13,color:t.honey,fontWeight:700,boxShadow:t.shd}}>
            🔥 {score.streak} streak {score.streak>=5?"— on fire!":score.streak>=3?"— nice!":""}
          </span>
        </div>
      )}

      {/* History navigation */}
      {history.length>0&&(
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:10}}>
          <button onClick={()=>setViewIdx(v=>v===null?(history.length-1):v>0?v-1:v)}
            disabled={viewIdx===0}
            style={{background:t.sf,border:`1px solid ${t.bd}`,borderRadius:8,width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:t.txM,fontSize:14,opacity:viewIdx===0?.3:1}}>◀</button>
          <span style={{fontSize:11,color:viewing?t.honey:t.txD,fontWeight:viewing?700:400,minWidth:80,textAlign:"center"}}>
            {viewing?`Card ${viewIdx+1} of ${history.length}`:`Card ${history.length+1} · Live`}
          </span>
          <button onClick={()=>setViewIdx(v=>v===null?null:v<history.length-1?v+1:null)}
            disabled={viewIdx===null}
            style={{background:t.sf,border:`1px solid ${t.bd}`,borderRadius:8,width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:t.txM,fontSize:14,opacity:viewIdx===null?.3:1}}>▶</button>
          {viewing&&<button onClick={()=>setViewIdx(null)}
            style={{background:t.honey,border:"none",borderRadius:8,padding:"4px 12px",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer"}}>Resume</button>}
        </div>
      )}

      {/* Card */}
      <div style={{background:t.sf,borderRadius:16,padding:"28px 20px",textAlign:"center",boxShadow:t.shd,marginBottom:16,
        border:viewing?(viewCard.correct?`2px solid ${t.ok}`:`2px solid ${t.pri}`):fb==="correct"?`2px solid ${t.ok}`:fb==="wrong"?`2px solid ${t.pri}`:`1px solid ${t.bd}50`,transition:"border .15s"}}>
        <div style={{fontSize:13,color:t.txD,marginBottom:6}}>{viewing?"Did this apply to":"Does this apply to"}</div>
        <div style={{fontSize:28,fontWeight:800,color:t.tx,letterSpacing:-.3,marginBottom:18}}>
          <span style={{marginRight:8}}>{getFlag(displayCard.co.name)}</span>{displayCard.co.name}
        </div>
        <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"10px 20px",background:t.sf2,borderRadius:12}}>
          <span style={{fontSize:22}}>{displayCat.i}</span>
          <span style={{fontSize:16,fontWeight:700,color:t.tx}}>{displayCat.l}</span>
        </div>
        {/* Show larger flag for flag-related questions */}
        {displayCard.cat.startsWith("fl")&&(fb||viewing)&&(
          <div style={{marginTop:12,fontSize:48,lineHeight:1}}>{getFlag(displayCard.co.name)}</div>
        )}

        {/* Answer reveal (live feedback or history review) */}
        {(fb||viewing)&&(
          <div style={{marginTop:16}}>
            <div style={{fontSize:15,fontWeight:700,color:(viewing?viewCard.correct:fb==="correct")?t.ok:t.pri}}>
              {viewing?(viewCard.correct?"✓ You got it right":"✗ You got it wrong"):(fb==="correct"?"✓ Correct!":"✗ Wrong!")}
            </div>
            <div style={{fontSize:13,color:t.txM,marginTop:4}}>
              {displayCat.l} is <strong style={{color:t.tx}}>{displayCard.answer?"TRUE":"FALSE"}</strong> for {displayCard.co.name}
            </div>
            {displayExtra&&(
              <div style={{marginTop:8,padding:"8px 14px",background:t.bg,borderRadius:8,fontSize:12,color:t.txM,lineHeight:1.4,display:"inline-block"}}>
                💡 {displayExtra}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Answer buttons (only for live card, not during feedback or history) */}
      {!viewing&&!fb&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <button onClick={()=>handleAnswer(true)}
            style={{padding:"20px",borderRadius:14,background:t.sf,border:`2px solid ${t.ok}40`,cursor:"pointer",
              display:"flex",flexDirection:"column",alignItems:"center",gap:4,transition:"transform .1s"}}
            onPointerDown={e=>e.currentTarget.style.transform="scale(0.96)"}
            onPointerUp={e=>e.currentTarget.style.transform="scale(1)"}
            onPointerLeave={e=>e.currentTarget.style.transform="scale(1)"}>
            <span style={{fontSize:32}}>✓</span>
            <span style={{fontSize:16,fontWeight:700,color:t.ok}}>Yes</span>
          </button>
          <button onClick={()=>handleAnswer(false)}
            style={{padding:"20px",borderRadius:14,background:t.sf,border:`2px solid ${t.pri}40`,cursor:"pointer",
              display:"flex",flexDirection:"column",alignItems:"center",gap:4,transition:"transform .1s"}}
            onPointerDown={e=>e.currentTarget.style.transform="scale(0.96)"}
            onPointerUp={e=>e.currentTarget.style.transform="scale(1)"}
            onPointerLeave={e=>e.currentTarget.style.transform="scale(1)"}>
            <span style={{fontSize:32}}>✗</span>
            <span style={{fontSize:16,fontWeight:700,color:t.pri}}>No</span>
          </button>
        </div>
      )}

      {/* Best streak */}
      {score.best>0&&(
        <div style={{textAlign:"center",marginTop:14,fontSize:12,color:t.txD}}>
          Best streak: <strong style={{color:t.honey,fontFamily:"ui-monospace,monospace"}}>{score.best}</strong>
        </div>
      )}
    </div>);
}

// ─── COUNTRY QUIZ (formerly Reverse Mode) ───
function Reverse({onBack,t}){
  const pool=useMemo(()=>shuffle([...REV_POOL],()=>Math.random()),[]);
  const [idx,setIdx]=useState(0);
  const [sel,setSel]=useState(new Set());
  const [rev,setRev]=useState(false);
  const [tot,setTot]=useState({c:0,t:0});

  const co=DB.find(c=>c.name===pool[idx%pool.length]);
  // Dynamic categories per country
  const revData=useMemo(()=>pickRevCats(co),[co]);
  const cats=revData.cats;
  const correctSet=new Set(CAT_KEYS.filter(k=>CATS[k].t(co)));

  const submit=()=>{if(rev)return;
    let p=0;cats.forEach(id=>{if(correctSet.has(id)&&sel.has(id))p++;});
    const totalTrue=cats.filter(id=>correctSet.has(id)).length;
    setTot(s=>({c:s.c+p,t:s.t+totalTrue}));setRev(true);};
  const next=()=>{setIdx(i=>i+1);setSel(new Set());setRev(false);};
  const tog=id=>{if(rev)return;const n=new Set(sel);n.has(id)?n.delete(id):n.add(id);setSel(n);};

  const cs=id=>{
    const isC=correctSet.has(id),isS=sel.has(id);
    if(rev){if(isC&&isS)return{bg:t.okBg,bd:t.okBd,col:t.ok};if(isC&&!isS)return{bg:`${t.honey}18`,bd:t.honey,col:t.honey};if(!isC&&isS)return{bg:t.noBg,bd:t.noBd,col:t.pri};return{bg:t.sf,bd:t.bd,col:t.txD};}
    if(isS)return{bg:t.selBg,bd:t.selBd,col:t.sec};return{bg:t.sf,bd:t.bd,col:t.txM};};

  const trueCount=cats.filter(id=>correctSet.has(id)).length;

  return(
    <div style={{padding:"16px",maxWidth:420,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
        <button onClick={onBack} style={{background:t.sf2,border:"none",borderRadius:8,width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:t.txM,fontSize:17}}>←</button>
        <span style={{fontSize:14,fontWeight:700,color:t.honey}}>🎯 Country Quiz</span>
        <span style={{fontSize:11,color:t.txD,fontFamily:"ui-monospace,monospace"}}>{idx+1}/{pool.length}</span>
      </div>
      <div style={{textAlign:"center",padding:"20px 14px",background:t.sf,borderRadius:12,borderLeft:`4px solid ${t.honey}`,marginBottom:6,boxShadow:t.shd}}>
        <div style={{fontSize:12,color:t.txD,marginBottom:2}}>Which traits apply to</div>
        <div style={{fontSize:26,fontWeight:800,color:t.tx,letterSpacing:-.3}}><span style={{marginRight:6}}>{getFlag(co.name)}</span>{co.name}</div>
        <div style={{fontSize:11,color:t.txM,marginTop:4}}>{rev?`${trueCount} of 8 are true`:`${trueCount} of these 8 are true`}</div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5,marginBottom:12}}>
        {cats.map(id=>{const c=CATS[id],s=cs(id);
          return(<button key={id} onClick={()=>tog(id)}
            style={{padding:"10px 8px",borderRadius:7,background:s.bg,border:`1.5px solid ${s.bd}`,cursor:rev?"default":"pointer",display:"flex",alignItems:"center",gap:6,transition:"all .1s"}}>
            <span style={{fontSize:15}}>{c.i}</span><span style={{fontSize:12,fontWeight:600,color:s.col}}>{c.l}</span>
          </button>);})}
      </div>

      {rev&&(<>
        <div style={{display:"flex",gap:10,justifyContent:"center",marginBottom:8,fontSize:10.5,color:t.txD}}>
          <span>🟢 Correct</span><span>🟡 Missed</span><span>🔴 Wrong</span>
        </div>
        {revData.funFact&&(
          <div style={{padding:"10px 14px",background:t.sf2,borderRadius:8,marginBottom:12,borderLeft:`3px solid ${t.honey}`}}>
            <div style={{fontSize:11,color:t.honey,fontWeight:700,marginBottom:2}}>Did you know?</div>
            <div style={{fontSize:12,color:t.txM,lineHeight:1.4}}>{revData.funFact}</div>
          </div>
        )}
      </>)}

      {!rev?(<button onClick={submit} disabled={sel.size===0}
        style={{width:"100%",padding:"13px",borderRadius:8,background:sel.size>0?t.honey:t.sf,border:`1.5px solid ${sel.size>0?t.honey:t.bd}`,color:sel.size>0?"#fff":t.txD,fontSize:15,fontWeight:700,cursor:sel.size>0?"pointer":"not-allowed"}}>Check</button>
      ):(<button onClick={next} style={{width:"100%",padding:"13px",borderRadius:8,background:t.sf,border:`1.5px solid ${t.honey}`,color:t.honey,fontSize:15,fontWeight:700,cursor:"pointer"}}>Next Country →</button>)}
      {tot.t>0&&<div style={{textAlign:"center",marginTop:8,fontSize:12,color:t.txD}}>Score: <strong style={{color:t.ok,fontFamily:"ui-monospace,monospace"}}>{tot.c}/{tot.t}</strong></div>}
    </div>);
}

// ─── STATS ───
function Stats({onBack,p,s,b,sc,t}){
  const lvl=[{n:"Explorer",m:0,c:t.txM},{n:"Geographer",m:20,c:t.sec},{n:"Diplomat",m:50,c:t.pri},{n:"Cartographer",m:100,c:t.honey}];
  const cur=[...lvl].reverse().find(l=>sc>=l.m)||lvl[0];
  const nxt=lvl[lvl.indexOf(cur)+1];
  const pct=nxt?(sc-cur.m)/(nxt.m-cur.m):1;
  return(
    <div style={{padding:"16px 20px",maxWidth:420,margin:"0 auto"}}>
      <div style={{display:"flex",alignItems:"center",marginBottom:20}}>
        <button onClick={onBack} style={{background:t.sf2,border:"none",borderRadius:8,width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:t.txM,fontSize:17}}>←</button>
        <h2 style={{fontSize:19,fontWeight:800,color:t.tx,margin:"0 0 0 12px"}}>Your Progress</h2>
      </div>
      <div style={{textAlign:"center",padding:"18px",background:t.sf,borderRadius:12,marginBottom:12,boxShadow:t.shd}}>
        <div style={{fontSize:10,color:t.txD,textTransform:"uppercase",letterSpacing:1.5}}>Level</div>
        <div style={{fontSize:22,fontWeight:800,color:cur.c,margin:"3px 0"}}>{cur.n}</div>
        {nxt&&<><div style={{width:"100%",height:5,background:t.bg,borderRadius:3,margin:"7px 0 3px",overflow:"hidden"}}>
          <div style={{width:`${Math.min(pct*100,100)}%`,height:"100%",background:cur.c,borderRadius:3,transition:"width .4s"}}/></div>
          <div style={{fontSize:10.5,color:t.txD}}>{sc-cur.m}/{nxt.m-cur.m} to <strong style={{color:nxt.c}}>{nxt.n}</strong></div></>}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {[{l:"Played",v:p,i:"🎮"},{l:"Streak",v:s,i:"🔥"},{l:"Best",v:b,i:"⭐"},{l:"Score",v:sc,i:"🏆"}].map(x=>(
          <div key={x.l} style={{padding:"12px",background:t.sf,borderRadius:8,textAlign:"center",boxShadow:t.shd}}>
            <div style={{fontSize:17}}>{x.i}</div>
            <div style={{fontFamily:"ui-monospace,monospace",fontSize:21,fontWeight:800,color:t.tx,margin:"1px 0"}}>{x.v}</div>
            <div style={{fontSize:10.5,color:t.txD}}>{x.l}</div>
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

// ─── APP ───
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
    <div style={{minHeight:"100vh",background:t.bg,color:t.tx,transition:"background .3s,color .3s",position:"relative",fontFamily:"system-ui,-apple-system,sans-serif"}}>
      <button onClick={()=>setDk(!dk)}
        style={{position:"fixed",top:14,right:16,zIndex:90,background:t.tagBg,border:"none",borderRadius:20,
          width:38,height:38,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",
          boxShadow:t.shd,fontSize:17,transition:"all .3s"}}>{dk?"☀️":"🌙"}</button>
      {scr==="home"&&<Home t={t} streak={st.s} onNav={id=>{
        if(id==="daily"){if(dd&&pg)setScr("post");else startDaily();}
        else if(id==="random")startRandom();
        else if(id==="practice")setScr("practice");
        else setScr(id);
      }}/>}
      {scr==="grid"&&curGrid&&<GridGame t={t} onBack={()=>setScr("home")} onDone={fin} grid={curGrid} mode={mode} onNewPuzzle={newRandom}/>}
      {scr==="post"&&pg&&<PostGame t={t} cells={pg.cells} guesses={pg.gl} grid={pg.grid} mode={mode} onBack={()=>setScr("home")} onRev={()=>setScr("practice")} onNew={newRandom}/>}
      {scr==="practice"&&<PracticeLanding t={t} onBack={()=>setScr("home")} onQuiz={()=>setScr("quiz")} onQuickFire={()=>setScr("quickfire")}/>}
      {scr==="quiz"&&<Reverse t={t} onBack={()=>setScr("practice")}/>}
      {scr==="quickfire"&&<QuickFire t={t} onBack={()=>setScr("practice")}/>}
      {scr==="stats"&&<Stats t={t} onBack={()=>setScr("home")} p={st.p} s={st.s} b={st.b} sc={st.sc}/>}
    </div>);
}
