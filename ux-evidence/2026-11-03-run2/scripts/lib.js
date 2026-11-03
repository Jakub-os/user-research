const { chromium, devices } = require('playwright');
const fs=require('fs');
const OUT='/home/user/user-research/ux-evidence/2026-11-03-run2/';
const LOG=OUT+'notes_log.jsonl';
function note(o){o.ts=new Date().toISOString();fs.appendFileSync(LOG,JSON.stringify(o)+'\n');}
const LOC={sk:['sk-SK','Europe/Bratislava'],cz:['cs-CZ','Europe/Prague'],de:['de-DE','Europe/Berlin'],at:['de-AT','Europe/Vienna'],hu:['hu-HU','Europe/Budapest'],eu:['en-GB','Europe/Brussels']};
async function launch(vp='desktop', storage, dom='sk'){
  const b=await chromium.launch();
  const [locale,timezoneId]=LOC[dom]||LOC.sk;
  let opts={locale,timezoneId};
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
async function killPopups(p){await p.evaluate(()=>{document.querySelectorAll('[class*=weblayer]').forEach(e=>e.remove())}).catch(()=>{});}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const vis=`e=>e&&e.offsetParent!==null`;
async function text(p,n=3000){return (await p.evaluate(()=>document.body.innerText)).replace(/\n{2,}/g,'\n').slice(0,n);}
async function modals(p){return p.evaluate(()=>[...document.querySelectorAll('.modal.show,.toast.show')].map(m=>m.innerText.replace(/\s+/g,' ').trim().slice(0,400)));}
module.exports={launch,shot,note,sleep,OUT,killPopups,text,modals};
