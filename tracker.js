const TRACKING_URL="PASTE_YOUR_TRACKING_APPS_SCRIPT_URL_HERE";

let sessionId=sessionStorage.getItem("new_site_session_id");
if(!sessionId){
  sessionId=Date.now().toString(36)+Math.random().toString(36).slice(2);
  sessionStorage.setItem("new_site_session_id",sessionId);
}

function track(event,field="",value=""){
  if(!TRACKING_URL||TRACKING_URL.includes("PASTE_YOUR"))return;

  const params=new URLSearchParams();
  params.set("session_id",sessionId);
  params.set("event",event);
  params.set("field",field);
  params.set("value",String(value??""));

  try{
    const blob=new Blob([params.toString()],{
      type:"application/x-www-form-urlencoded;charset=UTF-8"
    });
    if(navigator.sendBeacon&&navigator.sendBeacon(TRACKING_URL,blob))return;
  }catch(_){}

  try{
    fetch(TRACKING_URL,{
      method:"POST",
      mode:"no-cors",
      body:params,
      keepalive:true
    }).catch(()=>{});
  }catch(_){}
}

/* Backup: every clickable element is tracked automatically. */
document.addEventListener("click",(event)=>{
  const el=event.target.closest("button,input[type='button'],input[type='submit'],a");
  if(!el)return;

  const label=(el.innerText||el.value||el.getAttribute("aria-label")||"Unnamed clickable element").trim();

  track(
    "Button Clicked",
    "automatic",
    label
  );
},true);

window.addEventListener("load",()=>{
  track(
    "Website Opened",
    "page",
    location.pathname||"index.html"
  );
});
