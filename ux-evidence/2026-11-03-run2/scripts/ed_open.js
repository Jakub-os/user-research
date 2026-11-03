const L=require('./lib');
const [vp,path,tag]=process.argv.slice(2);
(async()=>{
 const {b,ctx,p}=await L.launch(vp,L.OUT+'scripts/state_ed.json','sk');
 p.on('response',r=>{if(r.status()>=400&&/expresta/.test(r.url()))console.log('HTTP',r.status(),r.url().slice(0,120));});
 const t0=Date.now();
 await p.goto('https://www.expresta.sk'+path,{waitUntil:'load',timeout:90000});
 await p.waitForLoadState('networkidle',{timeout:30000}).catch(()=>{});await L.sleep(6000);await L.killPopups(p);
 console.log('URL',p.url(),'load ms',Date.now()-t0);
 console.log('frames',p.frames().map(f=>f.url().slice(0,100)));
 console.log(await L.text(p,2500));
 const ctl=await p.evaluate(()=>[...document.querySelectorAll('button,a,[role=button],input,select')].filter(e=>e.offsetParent).map(e=>{const r=e.getBoundingClientRect();return `${e.tagName}${e.id?'#'+e.id:''} "${(e.innerText||e.value||e.title||e.getAttribute('aria-label')||'').replace(/\s+/g,' ').trim().slice(0,40)}" ${Math.round(r.width)}x${Math.round(r.height)}`}));
 console.log('CONTROLS',ctl.length);console.log(ctl.slice(0,120).join('\n'));
 console.log('hscroll',await p.evaluate(()=>[document.documentElement.scrollWidth,innerWidth]));
 await L.shot(p,`ED_sk_${vp}_${tag}`);
 await b.close();
})();
