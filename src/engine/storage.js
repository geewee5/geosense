import { useState, useEffect } from "react";

// Lightweight localStorage persistence so game progress, answers, stats and the
// theme choice survive a page refresh. Everything is client-side.
const PREFIX = "geosense_v1_";

export function loadKey(key, fallback){
  try{
    const raw = localStorage.getItem(PREFIX + key);
    return raw != null ? JSON.parse(raw) : fallback;
  }catch{
    return fallback;
  }
}

export function saveKey(key, value){
  try{ localStorage.setItem(PREFIX + key, JSON.stringify(value)); }catch{ /* quota / private mode */ }
}

// A useState that transparently persists to localStorage under `key`.
// `initial` may be a value or a lazy function (like useState).
export function usePersistentState(key, initial){
  const [val, setVal] = useState(() => {
    const stored = loadKey(key, undefined);
    if(stored !== undefined) return stored;
    return typeof initial === "function" ? initial() : initial;
  });
  useEffect(() => { saveKey(key, val); }, [key, val]);
  return [val, setVal];
}
