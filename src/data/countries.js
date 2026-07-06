import data from "./countries.json";

// Country data lives in countries.json — one readable record per country. Boolean
// attributes are stored as a compact `tags` list (only the true ones), so adding a
// country or an attribute is a simple, safe edit. Here we expand each record into a
// flat runtime object so category tests and answer enrichment can read fields
// directly (c.locked, c.fl_red, c.brics, …). A missing tag reads as falsy.
function expand(r){
  const c={
    name:r.name,
    iso2:r.iso2,
    continent:r.continent, // "Europe" | "Asia" | "Africa" | "North America" | "South America" | "Oceania"
    gdp:r.gdp,             // GDP per capita, thousands USD
    tz:r.timezones,        // number of time zones
    pop:r.population,      // millions
  };
  for(const tag of r.tags) c[tag]=true;
  return c;
}

export const DB=data.map(expand);
