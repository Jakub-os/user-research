const L=require('./lib');
const vp=process.argv[2]||'desktop';
(async()=>{
 const {b,ctx,p}=await L.launch(vp,L.OUT+'scripts/state_ed.json','sk');
 const url=require('fs').readFileSync(L.OUT+'scripts/ed_last_url.txt','utf8').split('\n')[0];
 p.on('dialog',async d=>{console.log('DIALOG',d.type(),d.message());await d.dismiss();});
 await p.goto(url,{waitUntil:'load',timeout:90000});await p.waitForLoadState('networkidle',{timeout:30000}).catch(()=>{});await L.sleep(8000);await L.killPopups(p);
 console.log('URL',p.url());
 const info=await p.evaluate(()=>{
   const out=[];
   for(const e of document.querySelectorAll('button,a,[role=button],[class*=tool],[class*=btn]')){
     if(!e.offsetParent)continue;const r=e.getBoundingClientRect();if(r.width<5)continue;
     const t=(e.innerText||e.title||e.getAttribute('aria-label')||'').replace(/\s+/g,' ').trim().slice(0,30);if(!t)continue;
     const top=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);
     const covered=top&&!e.contains(top)&&!top.contains(e);
     out.push(`${e.tagName}.${(e.className||'').toString().split(' ')[0]} "${t}" ${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)}${covered?' COVERED by '+top.tagName+'.'+(top.className||'').toString().slice(0,40)+' #'+top.id:''}`);
   }
   return [...new Set(out)];
 });
 console.log(info.join('\n'));
 console.log('inputs',await p.evaluate(()=>[...document.querySelectorAll('input')].map(i=>i.type+':'+i.name+':'+i.id+':'+i.accept).join(' | ')));
 console.log('hscroll',await p.evaluate(()=>[document.documentElement.scrollWidth,innerWidth]));
 await L.shot(p,`ED_sk_${vp}_explore`);
 await ctx.storageState({path:L.OUT+'scripts/state_ed.json'});
 await b.close();
})();
