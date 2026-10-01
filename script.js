const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const money = n => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(Number(n)||0);
const initials = n => n.split(" ").map(x=>x[0]).slice(0,2).join("").toUpperCase();

const defaultAgents = [
 {id:1,name:"Aarav Sharma",email:"aarav@demo.com",phone:"+91 98765 11111",tier:"Platinum",sales:1850000,commission:555000,status:"Active"},
 {id:2,name:"Diya Reddy",email:"diya@demo.com",phone:"+91 98765 22222",tier:"Gold",sales:1260000,commission:315000,status:"Active"},
 {id:3,name:"Kabir Mehta",email:"kabir@demo.com",phone:"+91 98765 33333",tier:"Gold",sales:1120000,commission:280000,status:"Active"},
 {id:4,name:"Ananya Rao",email:"ananya@demo.com",phone:"+91 98765 44444",tier:"Silver",sales:920000,commission:184000,status:"Active"},
 {id:5,name:"Vikram Singh",email:"vikram@demo.com",phone:"+91 98765 55555",tier:"Bronze",sales:680000,commission:102000,status:"Inactive"},
 {id:6,name:"Meera Patel",email:"meera@demo.com",phone:"+91 98765 66666",tier:"Starter",sales:350000,commission:35000,status:"Active"}
];
const payouts = [
 {ref:"PAY-10482",agent:"Aarav Sharma",amount:125000,method:"Bank Transfer",date:"02 Oct 2026",status:"Paid"},
 {ref:"PAY-10481",agent:"Diya Reddy",amount:84000,method:"UPI",date:"01 Oct 2026",status:"Pending"},
 {ref:"PAY-10480",agent:"Kabir Mehta",amount:72000,method:"Bank Transfer",date:"30 Sep 2026",status:"Processing"},
 {ref:"PAY-10479",agent:"Ananya Rao",amount:48600,method:"Bank Transfer",date:"29 Sep 2026",status:"Paid"},
 {ref:"PAY-10478",agent:"Vikram Singh",amount:22000,method:"UPI",date:"28 Sep 2026",status:"On Hold"}
];
const history = [
 {date:"02 Oct 2026",policy:"POL-2026-1042",agent:"Aarav Sharma",premium:100000,rate:30,commission:30000,status:"Approved"},
 {date:"01 Oct 2026",policy:"POL-2026-1039",agent:"Diya Reddy",premium:180000,rate:25,commission:45000,status:"Paid"},
 {date:"30 Sep 2026",policy:"POL-2026-1034",agent:"Kabir Mehta",premium:120000,rate:25,commission:30000,status:"Pending"},
 {date:"28 Sep 2026",policy:"POL-2026-1028",agent:"Ananya Rao",premium:95000,rate:20,commission:19000,status:"Paid"},
 {date:"27 Sep 2026",policy:"POL-2026-1024",agent:"Meera Patel",premium:65000,rate:10,commission:6500,status:"Approved"}
];
const tiers = [
 {name:"Platinum",rate:30,min:1500000,symbol:"🏆"},
 {name:"Gold",rate:25,min:1000000,symbol:"🥇"},
 {name:"Silver",rate:20,min:700000,symbol:"🥈"},
 {name:"Bronze",rate:15,min:400000,symbol:"🥉"},
 {name:"Starter",rate:10,min:0,symbol:"✈️"}
];
let agents = JSON.parse(localStorage.getItem("cp_agents")||"null") || defaultAgents;
let currentUser = JSON.parse(localStorage.getItem("cp_user")||"null");

function saveAgents(){localStorage.setItem("cp_agents",JSON.stringify(agents))}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2400)}
function showAuth(tab="login"){
  $("#authScreen").classList.remove("hidden"); $("#app").classList.add("hidden");
  $$(".auth-tab").forEach(x=>x.classList.toggle("active",x.dataset.authTab===tab));
  $("#loginForm").classList.toggle("hidden",tab!=="login"); $("#registerForm").classList.toggle("hidden",tab!=="register");
}
function showApp(){
  $("#authScreen").classList.add("hidden"); $("#app").classList.remove("hidden");
  if(!currentUser) return;
  $("#profileName").textContent=currentUser.name||currentUser.email.split("@")[0];
  $("#profileRole").textContent=currentUser.role;
  $("#avatar").textContent=initials(currentUser.name||currentUser.email);
  $("#settingName").value=currentUser.name||"";
  $("#settingEmail").value=currentUser.email||"";
  $("#settingRole").value=currentUser.role||"Agent";
  renderAll();
}
function navigate(id){
  $$(".page").forEach(p=>p.classList.toggle("active-page",p.id===id));
  $$(".nav-item[data-section]").forEach(n=>n.classList.toggle("active",n.dataset.section===id));
  window.scrollTo({top:0,behavior:"smooth"}); $("#sidebar").classList.remove("open");
}
function renderBars(){
 const vals=[188000,214000,201000,248000,230000,284000], months=["Apr","May","Jun","Jul","Aug","Sep"], max=Math.max(...vals);
 $("#commissionBars").innerHTML=vals.map((v,i)=>`<div class="bar-wrap"><div class="bar" style="height:${Math.max(6,v/max*88)}%"></div><span class="bar-label">${months[i]}</span></div>`).join("");
}
function renderTopAgents(){
 $("#topAgentsBody").innerHTML=agents.slice().sort((a,b)=>b.commission-a.commission).slice(0,5).map(a=>`<tr><td><div class="agent-cell"><span class="mini-avatar">${initials(a.name)}</span><div><strong>${a.name}</strong><small>${a.email}</small></div></div></td><td><span class="badge gold">${a.tier}</span></td><td>${Math.round(a.sales/50000)}</td><td><strong>${money(a.commission)}</strong></td><td><span class="badge ${a.status==="Active"?"green":"gray"}">${a.status}</span></td></tr>`).join("");
}
function renderRecentPayouts(){
 $("#recentPayouts").innerHTML=payouts.slice(0,4).map(p=>`<div class="activity"><span class="activity-icon">${p.status==="Paid"?"✓":"₹"}</span><div><strong>${p.agent}</strong><small>${p.ref} • ${p.date}</small></div><b>${money(p.amount)}</b></div>`).join("");
}
function renderAgents(){
 const q=($("#agentSearch")?.value||"").toLowerCase(), tier=$("#tierFilter")?.value||"", status=$("#statusFilter")?.value||"";
 const list=agents.filter(a=>(!q||`${a.name} ${a.email}`.toLowerCase().includes(q))&&(!tier||a.tier===tier)&&(!status||a.status===status));
 $("#agentsBody").innerHTML=list.map(a=>`<tr><td><div class="agent-cell"><span class="mini-avatar">${initials(a.name)}</span><div><strong>${a.name}</strong><small>ID: AG-${String(a.id).padStart(4,"0")}</small></div></div></td><td>${a.email}<br><small>${a.phone||""}</small></td><td><span class="badge gold">${a.tier}</span></td><td>${money(a.sales)}</td><td>${money(a.commission)}</td><td><span class="badge ${a.status==="Active"?"green":"gray"}">${a.status}</span></td><td><button class="text-btn edit-agent" data-id="${a.id}">Edit</button></td></tr>`).join("") || `<tr><td colspan="7">No agents found.</td></tr>`;
}
function renderTiers(){
 $("#tierCards").innerHTML=tiers.map(t=>`<article class="tier-card"><div class="tier-symbol">${t.symbol}</div><h3>${t.name}</h3><div class="rate">${t.rate}%</div><small>Commission rate</small><div class="meter"><i style="width:${t.rate/30*100}%"></i></div><small>Min. sales: ${money(t.min)}</small></article>`).join("");
 $("#rulesBody").innerHTML=tiers.map(t=>`<tr><td>${t.name} Commission</td><td><strong>${t.rate}%</strong></td><td>Tier members</td><td>${money(t.min)}</td><td>—</td><td class="rule-active">Active</td></tr>`).join("");
}
function renderCalcAgents(){
 $("#calcAgent").innerHTML=agents.filter(a=>a.status==="Active").map(a=>`<option value="${a.id}">${a.name} — ${a.tier}</option>`).join("");
}
function renderPayouts(){
 $("#payoutBody").innerHTML=payouts.map(p=>`<tr><td><strong>${p.ref}</strong></td><td>${p.agent}</td><td>${money(p.amount)}</td><td>${p.method}</td><td>${p.date}</td><td><span class="badge ${p.status==="Paid"?"green":p.status==="Pending"?"gold":p.status==="Processing"?"blue":"gray"}">${p.status}</span></td><td><button class="text-btn payout-action" data-ref="${p.ref}">${p.status==="Pending"?"Process":"View"}</button></td></tr>`).join("");
}
function renderPerformance(){
 const max=Math.max(...agents.map(a=>a.sales));
 $("#performanceCards").innerHTML=agents.slice().sort((a,b)=>b.sales-a.sales).map((a,i)=>`<article class="performance-card"><div class="rank">#${i+1}</div><div class="agent-cell"><span class="mini-avatar">${initials(a.name)}</span><div><h3>${a.name}</h3><small>${a.tier} Agent</small></div></div><div class="progress"><i style="width:${a.sales/max*100}%"></i></div><div class="perf-row"><span>Total Sales</span><strong>${money(a.sales)}</strong></div><div class="perf-row"><span>Commission</span><strong>${money(a.commission)}</strong></div><div class="perf-row"><span>Policies</span><strong>${Math.round(a.sales/50000)}</strong></div></article>`).join("");
}
function renderHistory(){
 const q=($("#historySearch")?.value||"").toLowerCase(), st=$("#historyStatus")?.value||"";
 const list=history.filter(h=>(!q||`${h.policy} ${h.agent}`.toLowerCase().includes(q))&&(!st||h.status===st));
 $("#historyBody").innerHTML=list.map(h=>`<tr><td>${h.date}</td><td><strong>${h.policy}</strong></td><td>${h.agent}</td><td>${money(h.premium)}</td><td>${h.rate}%</td><td><strong>${money(h.commission)}</strong></td><td><span class="badge ${h.status==="Paid"?"green":h.status==="Pending"?"gold":"blue"}">${h.status}</span></td></tr>`).join("");
}
function renderAll(){renderBars();renderTopAgents();renderRecentPayouts();renderAgents();renderTiers();renderCalcAgents();renderPayouts();renderPerformance();renderHistory();}

function generateReport(type){
 const lines = type==="Commission"
 ? ["COMMISSION REPORT","Period: October 2026","",...agents.map(a=>`${a.name},${a.tier},${a.sales},${a.commission}`)]
 : type==="Payout" ? ["PAYOUT REPORT","Reference,Agent,Amount,Method,Status",...payouts.map(p=>`${p.ref},${p.agent},${p.amount},${p.method},${p.status}`)]
 : type==="Performance" ? ["AGENT PERFORMANCE","Agent,Tier,Sales,Commission,Status",...agents.map(a=>`${a.name},${a.tier},${a.sales},${a.commission},${a.status}`)]
 : ["FORECAST REPORT","Month,Projected Commission","Oct,430000","Nov,510000","Dec,552600"];
 $("#reportPreviewText").textContent=lines.join("\n");$("#reportStatus").textContent=`${type} report generated on ${new Date().toLocaleString("en-IN")}`;toast(`${type} report generated`);
}
function exportCsv(){
 const text=$("#reportPreviewText").textContent;if(text==="No report generated yet.")return toast("Generate a report first");
 const blob=new Blob([text],{type:"text/csv"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="commission-report.csv";a.click();URL.revokeObjectURL(a.href);toast("CSV exported");
}

$$(".auth-tab").forEach(b=>b.addEventListener("click",()=>showAuth(b.dataset.authTab)));
$("#loginForm").addEventListener("submit",e=>{
  e.preventDefault();
  const email=$("#loginEmail").value.trim(),pass=$("#loginPassword").value,role=$("#loginRole").value;
  if(email==="admin@commissionpro.com"&&pass==="admin123"){
    currentUser={name:"Admin User",email,role:"Admin"};
    localStorage.setItem("cp_user",JSON.stringify(currentUser));
    showApp();
    toast("Welcome back, Admin!");
    return;
  }
  const users=JSON.parse(localStorage.getItem("cp_users")||"[]");
  const user=users.find(x=>x.email===email&&x.password===pass);
  if(!user)return toast("Invalid email or password");
  currentUser={name:user.name,email:user.email,role:user.role};
  localStorage.setItem("cp_user",JSON.stringify(currentUser));
  showApp();
  toast("Login successful");
});
$("#demoLogin").addEventListener("click",()=>{$("#loginEmail").value="admin@commissionpro.com";$("#loginPassword").value="admin123";$("#loginForm").requestSubmit()});
$("#registerForm").addEventListener("submit",e=>{e.preventDefault();const users=JSON.parse(localStorage.getItem("cp_users")||"[]"),u={name:$("#regName").value.trim(),email:$("#regEmail").value.trim(),password:$("#regPassword").value,role:$("#regRole").value};if(users.some(x=>x.email===u.email))return toast("An account with this email already exists");users.push(u);localStorage.setItem("cp_users",JSON.stringify(users));currentUser={name:u.name,email:u.email,role:u.role};localStorage.setItem("cp_user",JSON.stringify(currentUser));showApp();toast("Account created successfully")});
$("#logoutBtn").addEventListener("click",()=>{localStorage.removeItem("cp_user");currentUser=null;showAuth();toast("You have been logged out")});
$$(".nav-item[data-section]").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.section)));
$$("[data-section-jump]").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.sectionJump)));
$("#mobileMenu").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));
$("#notificationBtn").addEventListener("click",()=>toast("3 notifications: 2 payouts pending, 1 tier upgrade"));
$("#refreshDashboard").addEventListener("click",()=>{renderAll();toast("Dashboard refreshed")});
$("#agentSearch").addEventListener("input",renderAgents);$("#tierFilter").addEventListener("change",renderAgents);$("#statusFilter").addEventListener("change",renderAgents);
$("#historySearch").addEventListener("input",renderHistory);$("#historyStatus").addEventListener("change",renderHistory);$("#clearHistoryFilter").addEventListener("click",()=>{$("#historySearch").value="";$("#historyStatus").value="";renderHistory()});
$("#addAgentBtn").addEventListener("click",()=>$("#agentModal").classList.remove("hidden"));
$("#addTierBtn").addEventListener("click",()=>$("#tierModal").classList.remove("hidden"));
$$(".close-modal").forEach(b=>b.addEventListener("click",()=>$("#"+b.dataset.close).classList.add("hidden")));
$$(".modal-backdrop").forEach(m=>m.addEventListener("click",e=>{if(e.target===m)m.classList.add("hidden")}));
$("#agentForm").addEventListener("submit",e=>{e.preventDefault();const a={id:Date.now(),name:$("#newAgentName").value,email:$("#newAgentEmail").value,phone:$("#newAgentPhone").value,tier:$("#newAgentTier").value,sales:0,commission:0,status:"Active"};agents.push(a);saveAgents();$("#agentModal").classList.add("hidden");e.target.reset();renderAll();toast("Agent added successfully")});
$("#tierForm").addEventListener("submit",e=>{e.preventDefault();tiers.push({name:$("#newTierName").value,rate:Number($("#newTierRate").value),min:Number($("#newTierMin").value),symbol:"⭐"});$("#tierModal").classList.add("hidden");e.target.reset();renderTiers();toast("Commission tier created")});
$("#calcForm").addEventListener("submit",e=>{e.preventDefault();const premium=Number($("#premium").value),rate=Number($("#calcRate").value),commission=premium*rate/100,a=agents.find(x=>String(x.id)===$("#calcAgent").value);$("#calcResult").textContent=money(commission);$("#resultPremium").textContent=money(premium);$("#resultRate").textContent=rate+"%";$("#resultTier").textContent=a?.tier||"—";$("#resultType").textContent=$("#commissionType").value;toast("Commission calculated")});
$("#calcAgent").addEventListener("change",()=>{const a=agents.find(x=>String(x.id)===$("#calcAgent").value),t=tiers.find(x=>x.name===a?.tier);if(t)$("#calcRate").value=t.rate});
$("#processPayoutBtn").addEventListener("click",()=>{payouts.unshift({ref:"PAY-"+Math.floor(10000+Math.random()*89999),agent:agents[0].name,amount:25000,method:"Bank Transfer",date:new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}),status:"Processing"});renderPayouts();renderRecentPayouts();toast("Payout added to processing queue")});
document.addEventListener("click",e=>{if(e.target.classList.contains("payout-action")){const p=payouts.find(x=>x.ref===e.target.dataset.ref);if(p.status==="Pending"){p.status="Processing";renderPayouts();toast(`${p.ref} moved to processing`)}else toast(`${p.ref}: ${p.status}`)}if(e.target.classList.contains("edit-agent"))toast("Demo mode: agent editing can be connected to a backend")});
$$(".report-btn").forEach(b=>b.addEventListener("click",()=>generateReport(b.dataset.report)));
$("#exportCsv").addEventListener("click",exportCsv);
$("#runForecast").addEventListener("click",()=>{$("#forecastTotal").textContent=money(1492600+Math.floor(Math.random()*30000));toast("Forecast recalculated")});
$("#profileMenu").addEventListener("click",()=>navigate("profile"));
$("#profileForm").addEventListener("submit",e=>{
  e.preventDefault();
  const name=$("#settingName").value.trim(),email=$("#settingEmail").value.trim(),previousEmail=currentUser.email;
  const users=JSON.parse(localStorage.getItem("cp_users")||"[]");
  if(users.some(user=>user.email.toLowerCase()===email.toLowerCase()&&user.email.toLowerCase()!==previousEmail.toLowerCase()))return toast("An account with this email already exists");
  currentUser={...currentUser,name,email};
  const userIndex=users.findIndex(user=>user.email.toLowerCase()===previousEmail.toLowerCase());
  if(userIndex!==-1){users[userIndex]={...users[userIndex],name,email};localStorage.setItem("cp_users",JSON.stringify(users))}
  localStorage.setItem("cp_user",JSON.stringify(currentUser));
  showApp();
  toast("Profile saved");
});
$("#darkModeToggle").addEventListener("change",e=>document.documentElement.classList.toggle("dark",e.target.checked));

if(currentUser)showApp();else showAuth();
