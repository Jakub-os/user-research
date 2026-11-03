const { chromium, devices } = require('playwright');
const fs=require('fs');
const OUT='/home/user/user-research/ux-evidence/2026-11-03-expresta-sk/';
const LOG=OUT+'notes_log.jsonl';
function note(o){o.ts=new Date().toISOString();fs.appendFileSync(LOG,JSON.stringify(o)+'\n');}
async function launch(vp='desktop', storage){
  const b=await chromium.launch();
  let opts={locale:'sk-SK',timezoneId:'Europe/Bratislava'};
  if(vp==='desktop') opts.viewport={width:1440,height:900};
  else if(vp==='m390') opts={...devices['iPhone 13'],viewport:{width:390,height:844},...opts};
  else if(vp==='m320') opts={...devices['iPhone SE'],viewport:{width:320,height:640},...opts};
  if(storage && fs.existsSync(storage)) opts.storageState=storage;
  const ctx=await b.newContext(opts);
  const p=await ctx.newPage();
  p._errs=[];
  p.on('console',m=>{if(m.type()==='error')p._errs.push(m.text().slice(0,200))});
  p.on('pageerror',e=>p._errs.push('PAGEERR '+e.message.slice(0,200)));
  return {b,ctx,p};
}
async function shot(p,name,full=false){const path=OUT+'screenshots/'+name+'.png';await p.screenshot({path,fullPage:full});note({shot:name,url:p.url()});return path;}
async function consent(p){
  for(const t of ['Prijať všetky','Súhlasím','Povoliť všetko','Prijať','Akceptovať']){
    const l=p.getByRole('button',{name:t,exact:false}).first();
    if(await l.isVisible().catch(()=>false)){await l.click();note({consent:t,url:p.url()});return t;}
  }
  return null;
}
async function controls(p){
  return p.$$eval('select, input, button, [role=radio], textarea',els=>els.filter(e=>e.offsetParent!==null||e.type==='radio').map(e=>{
    const r={tag:e.tagName,type:e.type,name:e.name,id:e.id,cls:(e.className||'').toString().slice(0,60),txt:(e.innerText||e.value||'').trim().slice(0,60)};
    if(e.tagName==='SELECT'){r.opts=[...e.options].map(o=>(o.selected?'*':'')+o.text.trim()).slice(0,40);}
    if(e.type==='radio'||e.type==='checkbox'){r.checked=e.checked;const l=e.closest('label')||document.querySelector(`label[for="${e.id}"]`);r.label=l?l.innerText.trim().slice(0,60):'';}
    return r;}));
}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
module.exports={launch,shot,consent,controls,note,sleep,OUT};
