const L=require('./lib');const E=require('./ed_lib');
const vp=process.argv[2]||'desktop';
(async()=>{
 const {b,ctx,p}=await L.launch(vp,L.OUT+'scripts/state_ed.json','sk');
 const url=require('fs').readFileSync(L.OUT+'scripts/ed_last_url.txt','utf8').split('\n')[0];
 await p.goto(url,{waitUntil:'load',timeout:90000});const f=await E.frame(p);await L.sleep(5000);await L.killPopups(p);
 const tools=await f.evaluate(()=>{const out=[];for(const e of document.querySelectorAll('*')){if(e.children.length>2)continue;const t=(e.innerText||'').trim();if(/^(Text|Fotografia|Obdĺžnik|Elipsa|Obrázky|Pozadia|Nálepky|Masky|Rámčeky)$/.test(t)){let c=e;for(let i=0;i<2&&c.parentElement;i++)c=c.parentElement;const r=c.getBoundingClientRect();out.push({t,x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)});}}return out;});
 for(const t of tools){
   const pts=[[t.x+t.w/2,t.y+t.h/2],[t.x+4,t.y+4],[t.x+t.w-4,t.y+t.h-4]];
   const tops=[];for(const [x,y] of pts){tops.push(await p.evaluate(([x,y])=>{const e=document.elementFromPoint(x,y);return e?(e.tagName==='IFRAME'?'iframe':e.tagName+'.'+(e.className||'').toString().slice(0,25)+'#'+e.id):'none'},[x,y]));}
   console.log(vp,JSON.stringify(t),tops.join(' | '));
 }
 const help=await p.evaluate(()=>{const cands=[...document.querySelectorAll('body *')].filter(e=>{const s=getComputedStyle(e);const r=e.getBoundingClientRect();return (s.position==='fixed'||s.position==='absolute')&&r.width>40&&r.width<120&&r.height>40&&r.height<120&&r.y<300&&r.x>innerWidth-200&&e.offsetParent!==undefined});return cands.map(e=>{const r=e.getBoundingClientRect();return e.tagName+'.'+(e.className||'').toString().slice(0,40)+'#'+e.id+' '+Math.round(r.x)+','+Math.round(r.y)+' '+Math.round(r.width)+'x'+Math.round(r.height)})});
 console.log('fixed elements top-right',help);
 await L.shot(p,`ED_sk_${vp}_overlap`);
 await b.close();
})();
