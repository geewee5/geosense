// ─── Themes ───
// Each theme is a flat object of CSS color strings. Components never use
// Tailwind color classes — every color comes from the active theme object `t`
// passed as a prop, which is what enables instant dark/light switching.
//
// Palette intent: an editorial, printed-atlas feel. Warm paper in light mode,
// warm ink in dark mode, with a considered vermilion / slate-teal / brass
// accent trio instead of generic candy colors.
export const TH={
  light:{
    bg:"#F4F1E9",    // warm paper
    sf:"#FCFBF6",    // raised card
    sf2:"#EAE6DA",   // inset surface (inputs, chips)
    tx:"#211F1A",    // ink
    txM:"#63604F",   // muted ink
    txD:"#9A9583",   // dim ink
    pri:"#BE4A3A",   // vermilion (primary accent)
    sec:"#2F6079",   // slate teal (secondary accent)
    ok:"#4C7A4E",    // olive green
    honey:"#B0832E", // brass
    okBg:"#E7EEE1",okBd:"#4C7A4E",
    noBg:"#F6E4DF",noBd:"#BE4A3A",
    selBg:"#E1EBEE",selBd:"#2F6079",
    bd:"#D9D3C4",bdD:"#C6BFAC",
    tagBg:"#211F1A",tagTx:"#F4F1E9",
    shd:"0 1px 2px rgba(33,31,26,0.05), 0 4px 14px rgba(33,31,26,0.04)",
  },
  dark:{
    bg:"#16150F",    // warm near-black
    sf:"#211F17",    // raised card
    sf2:"#2B2920",   // inset surface
    tx:"#ECE7D7",    // parchment
    txM:"#A19B86",   // muted
    txD:"#6B6754",   // dim
    pri:"#E4705C",   // warm vermilion
    sec:"#72A9BC",   // muted teal
    ok:"#82B47F",    // sage
    honey:"#E0B25C", // brass
    okBg:"#1D2A1C",okBd:"#82B47F",
    noBg:"#33201B",noBd:"#E4705C",
    selBg:"#1B2A30",selBd:"#72A9BC",
    bd:"#343225",bdD:"#454231",
    tagBg:"#ECE7D7",tagTx:"#16150F",
    shd:"0 1px 2px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.25)",
  },
};
