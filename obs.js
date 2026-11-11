const $ = id => document.getElementById(id);
const money = n => new Intl.NumberFormat("ru-RU",{maximumFractionDigits:0}).format(Number(n)||0)+" ₸";
const api = window.GAME_CONFIG?.GAME_API_URL;
const phoneUrl = window.GAME_CONFIG?.PHONE_SITE_URL;
$("bankPhone").src = phoneUrl || "about:blank";
let lastState = null;

function showTime(seconds){
  const s=Math.max(0,Math.floor(seconds||0));
  return String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0");
}
function render(s){
  lastState=s;
  $("bankTotal").textContent=money(s.bank_total);
  $("leaderName").textContent=s.leader_name||"Пока нет лидера";
  $("leaderAmount").textContent=s.leader_amount==null?"—":money(s.leader_amount);
  $("gameStatus").textContent=({idle:"Ожидание запуска",running:"Игра идёт",finished:"Игра завершена",stopped:"Игра остановлена"})[s.status]||s.status;
  const remaining=s.status==="running"?Math.max(0,Math.ceil((new Date(s.timer_ends_at).getTime()-Date.now())/1000)):Number(s.remaining_seconds||0);
  $("timer").textContent=showTime(remaining);
  const duration=Math.max(1,Number(s.timer_duration_seconds)||120);
  $("timerProgress").style.width=Math.max(0,Math.min(100,remaining/duration*100))+"%";
  $("lastUpdate").textContent="Обновлено "+new Date().toLocaleTimeString("ru-RU");
}
async function refresh(){
  if(!api || api.includes("YOUR-GAME-WORKER")){$("lastUpdate").textContent="Укажи GAME_API_URL в config.js";return;}
  try{
    const r=await fetch(api+"/state",{cache:"no-store"});
    if(!r.ok) throw new Error("HTTP "+r.status);
    render(await r.json());
  }catch(e){$("lastUpdate").textContent="Нет связи с сервером";}
}
refresh();setInterval(refresh,2000);
setInterval(()=>{if(lastState?.status==="running")render(lastState)},250);
