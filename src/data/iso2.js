import { DB } from "./countries";

// ISO2 code per country now lives in the country dataset (countries.json), so this
// map is derived rather than duplicated. `getFlag` builds a regional-indicator emoji;
// note the UI renders real SVG flags via components/ui/Flag.jsx, which reads `_i2`.
export const _i2=Object.fromEntries(DB.map(c=>[c.name,c.iso2]));

export const getFlag=n=>{const c=_i2[n];return c?[...c].map(l=>String.fromCodePoint(0x1F1E6+l.charCodeAt(0)-65)).join(""):"🏳️";};
