const L=require('./lib');
(async()=>{
 const {b,ctx,p}=await L.launch('desktop',L.OUT+'scripts/state_ed.json','sk');
 const url=require('fs').readFileSync(L.OUT+'scripts/ed_last_url.txt','utf8').split('\n')[0];
 await p.goto(url,{waitUntil:'load',timeout:90000});await L.sleep(12000);
 for(const f of p.frames()) console.log('FRAME',f.name(),f.url().slice(0,150));
 const shadow=await p.evaluate(()=>[...document.querySelectorAll('*')].filter(e=>e.shadowRoot).map(e=>e.tagName));console.log('shadow hosts',shadow);
 const ifr=await p.evaluate(()=>[...document.querySelectorAll('iframe')].map(i=>{const r=i.getBoundingClientRect();return i.id+' '+i.src.slice(0,120)+' '+Math.round(r.width)+'x'+Math.round(r.height)}));console.log(ifr.join('\n'));
 await b.close();
})();
