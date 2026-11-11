const el=id=>document.getElementById(id);
const api=window.GAME_CONFIG?.GAME_API_URL;
async function action(path,body={}){
  if(!api||api.includes("YOUR-GAME-WORKER"))throw Error("Сначала укажи GAME_API_URL в config.js");
  const r=await fetch(api+path,{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+el("token").value},body:JSON.stringify(body)});
  const data=await r.json().catch(()=>({}));
  if(!r.ok)throw Error(data.error||"Ошибка "+r.status);
  el("message").textContent="Готово";
  await load();return data;
}
async function load(){
  try{const r=await fetch(api+"/state",{cache:"no-store"});if(!r.ok)throw Error();const s=await r.json();el("currentState").textContent=`Статус: ${s.status} · Банк: ${Number(s.bank_total||0).toLocaleString("ru-RU")} ₸ · Лидер: ${s.leader_name||"нет"} (${s.leader_amount==null?"—":Number(s.leader_amount).toLocaleString("ru-RU")+" ₸"})`;}catch{el("currentState").textContent="Нет подключения к Worker";}
}
el("start").onclick=()=>action("/admin/start",{starting_bank:Number(el("startBank").value),duration_seconds:Number(el("duration").value)*60}).catch(e=>el("message").textContent=e.message);
el("stop").onclick=()=>action("/admin/stop").catch(e=>el("message").textContent=e.message);
el("reset").onclick=()=>{if(confirm("Сбросить состояние игры?"))action("/admin/reset").catch(e=>el("message").textContent=e.message)};
load();setInterval(load,3000);
