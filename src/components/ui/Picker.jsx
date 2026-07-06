import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { DB } from "../../data/countries";
import { CATS } from "../../data/categories";

// ─── Country Picker (bottom sheet) ───
// Slides up from the bottom. Shows ALL 193 countries (no filtering of used
// countries), grouped by first letter with sticky headers, a text filter,
// and an alphabet rail on the right for jump navigation.
//
// Accessibility: implemented as an ARIA combobox + listbox. It is a modal
// dialog (role="dialog", aria-modal) that traps focus, closes on Escape, and
// restores focus to the previously focused element on close. The filter input
// keeps DOM focus while Arrow keys move a virtual "active" option
// (aria-activedescendant); Enter selects it.
// `hints` (optional) is the pair of category ids [rowCat, colCat] for the cell
// being answered, shown in the header so the player sees the two clues they must
// satisfy. Flags are intentionally NOT shown in the list — they would give away
// flag-based category clues.
export default function Picker({onPick,onClose,t,hints}){
  const [q,setQ]=useState("");
  const [active,setActive]=useState(0);
  const inputRef=useRef(null);
  const sheetRef=useRef(null);
  const restoreRef=useRef(null);

  const all=useMemo(()=>[...DB].sort((a,b)=>a.name.localeCompare(b.name)),[]);
  const list=useMemo(()=>q?all.filter(c=>c.name.toLowerCase().includes(q.toLowerCase())):all,[q,all]);

  // Grouped for display, but each item carries its flat index into `list`
  // so keyboard navigation and rendering share one indexing scheme.
  const groups=useMemo(()=>{
    const g=[];let cur=null;
    list.forEach((c,i)=>{const l=c.name[0];if(l!==cur){cur=l;g.push({letter:l,items:[]});}g[g.length-1].items.push({c,i});});
    return g;
  },[list]);
  const ltrs=groups.map(g=>g.letter);

  // Reset the active option whenever the filtered list changes.
  useEffect(()=>{setActive(list.length?0:-1);},[list.length]);

  // Focus the filter input on open; remember & restore focus on close.
  useEffect(()=>{
    restoreRef.current=document.activeElement;
    inputRef.current?.focus();
    return()=>{restoreRef.current?.focus?.();};
  },[]);

  // Keep the active option scrolled into view.
  useEffect(()=>{
    if(active<0)return;
    document.getElementById(`picker-opt-${active}`)?.scrollIntoView({block:"nearest"});
  },[active]);

  const jump=l=>{
    const g=groups.find(x=>x.letter===l);
    if(g)setActive(g.items[0].i);
    document.getElementById(`gl-${l}`)?.scrollIntoView({behavior:"smooth",block:"start"});
  };

  const onKeyDown=useCallback(e=>{
    if(e.key==="Escape"){e.preventDefault();onClose();return;}
    if(e.key==="ArrowDown"){e.preventDefault();setActive(a=>Math.min((a<0?-1:a)+1,list.length-1));return;}
    if(e.key==="ArrowUp"){e.preventDefault();setActive(a=>Math.max((a<0?list.length:a)-1,0));return;}
    if(e.key==="Home"){e.preventDefault();setActive(list.length?0:-1);return;}
    if(e.key==="End"){e.preventDefault();setActive(list.length-1);return;}
    if(e.key==="Enter"){e.preventDefault();if(active>=0&&list[active])onPick(list[active].name);return;}
    // Focus trap: keep Tab within the dialog.
    if(e.key==="Tab"){
      const f=sheetRef.current?.querySelectorAll('button, input, [href], [tabindex]:not([tabindex="-1"])');
      if(!f||!f.length)return;
      const first=f[0],last=f[f.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    }
  },[list,active,onPick,onClose]);

  return(
    <div style={{position:"fixed",inset:0,zIndex:100,display:"flex",flexDirection:"column",justifyContent:"flex-end"}} onKeyDown={onKeyDown}>
      <div onClick={onClose} aria-hidden="true" style={{position:"absolute",inset:0,background:"rgba(0,0,0,.45)",backdropFilter:"blur(2px)"}}/>
      <div ref={sheetRef} role="dialog" aria-modal="true"
        aria-label={hints?`Pick a country that is ${hints.map(id=>CATS[id].l).join(" and ")}`:"Pick a country"}
        style={{position:"relative",background:t.sf,borderRadius:"18px 18px 0 0",maxHeight:"70vh",display:"flex",flexDirection:"column",boxShadow:"0 -4px 24px rgba(0,0,0,.15)"}}>
        <div style={{display:"flex",justifyContent:"center",padding:"10px 0 2px"}}><div aria-hidden="true" style={{width:32,height:4,borderRadius:2,background:t.bd}}/></div>
        <div style={{padding:"6px 18px 8px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontWeight:700,fontSize:16,color:t.tx}}>Pick a country</span>
          <button onClick={onClose} aria-label="Close country picker" style={{background:t.sf2,border:"none",borderRadius:18,width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:t.txD,fontSize:14,fontWeight:800}}><span aria-hidden="true">✕</span></button>
        </div>
        {hints&&(
          <div style={{padding:"0 18px 10px",display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
            <span style={{fontSize:11,color:t.txM,fontWeight:600}}>Must be both</span>
            {hints.map((id,i)=>[
              i>0&&<span key={`sep${i}`} aria-hidden="true" style={{color:t.txD,fontWeight:800,fontSize:13}}>+</span>,
              <span key={id} style={{display:"inline-flex",alignItems:"center",gap:5,padding:"4px 10px",background:t.selBg,border:`1px solid ${t.selBd}55`,borderRadius:16,fontSize:12,fontWeight:700,color:t.tx}}>
                <span aria-hidden="true">{CATS[id].i}</span>{CATS[id].l}
              </span>
            ])}
          </div>
        )}
        <div style={{padding:"0 18px 8px"}}>
          <input ref={inputRef} value={q} onChange={e=>setQ(e.target.value)} placeholder="Filter countries..."
            role="combobox" aria-expanded="true" aria-controls="picker-listbox" aria-autocomplete="list"
            aria-activedescendant={active>=0?`picker-opt-${active}`:undefined}
            aria-label="Filter countries. Use the arrow keys to browse and Enter to select."
            style={{width:"100%",padding:"8px 12px",borderRadius:8,border:`1.5px solid ${t.bd}`,background:t.bg,color:t.tx,fontSize:14,outline:"none",boxSizing:"border-box"}}/>
        </div>
        <div style={{display:"flex",flex:1,overflow:"hidden",minHeight:0}}>
          <div id="picker-listbox" role="listbox" aria-label="Countries" style={{flex:1,overflowY:"auto",padding:"0 18px 20px",WebkitOverflowScrolling:"touch"}}>
            {groups.length===0&&<div style={{padding:24,textAlign:"center",color:t.txD,fontSize:14}}>No match</div>}
            {groups.map(g=>(<div key={g.letter} role="group" aria-label={g.letter}>
              <div id={`gl-${g.letter}`} aria-hidden="true" style={{position:"sticky",top:0,background:t.sf,padding:"7px 0 3px",fontSize:11,fontWeight:800,color:t.pri,letterSpacing:2,fontFamily:"var(--font-mono)"}}>{g.letter}</div>
              {g.items.map(({c,i})=>{
                const isActive=i===active;
                return(<div key={c.name} id={`picker-opt-${i}`} role="option" aria-selected={isActive}
                  onClick={()=>onPick(c.name)} onMouseMove={()=>setActive(i)}
                  style={{padding:"11px 6px",borderBottom:`1px solid ${t.bd}20`,color:t.tx,fontSize:15,cursor:"pointer",
                    background:isActive?t.selBg:"transparent",borderRadius:isActive?6:0}}>{c.name}</div>);
              })}
            </div>))}
          </div>
          <div role="navigation" aria-label="Jump to letter" style={{display:"flex",flexDirection:"column",justifyContent:"center",padding:"0 5px",gap:0}}>
            {ltrs.map(l=>(<button key={l} onClick={()=>jump(l)} aria-label={`Jump to ${l}`} tabIndex={-1} style={{background:"none",border:"none",color:t.sec,fontSize:9,fontWeight:700,padding:"1.5px 3px",cursor:"pointer",fontFamily:"var(--font-mono)"}}>{l}</button>))}
          </div>
        </div>
      </div>
    </div>);
}
