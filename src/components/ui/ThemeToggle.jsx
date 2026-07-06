// Fixed sun/moon button, top-right. Toggles dark/light instantly.
export default function ThemeToggle({dk,onToggle,t}){
  return(
    <button onClick={onToggle} aria-label={dk?"Switch to light mode":"Switch to dark mode"}
      style={{position:"fixed",top:14,right:16,zIndex:90,background:t.tagBg,border:"none",borderRadius:20,
        width:38,height:38,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",
        boxShadow:t.shd,fontSize:17,transition:"all .3s"}}><span aria-hidden="true">{dk?"☀️":"🌙"}</span></button>
  );
}
