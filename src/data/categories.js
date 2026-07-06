import { DB } from "./countries";

// ─── Categories (33 game-ready) ───
// Shape: { l: display label, i: emoji, d: difficulty 1|2|3, t: (country) => boolean }
export const CATS={
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

// Canonical ordered list of all category IDs.
export const CAT_KEYS=Object.keys(CATS);

// Precompute members per category for speed: for each category, the full
// list of matching countries. Used by cellCount()/cellAnswers() and the
// Practice-mode selection algorithms.
export const CAT_MEMBERS={};
CAT_KEYS.forEach(k=>{CAT_MEMBERS[k]=DB.filter(c=>CATS[k].t(c));});

// Categories usable in Practice modes: name-based ones are excluded because
// the answer is trivially visible when the country name is on screen.
export const QF_CATS=CAT_KEYS.filter(k=>!k.startsWith("start"));
