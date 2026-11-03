const L=require('./lib');
const path=process.argv[2];
(async()=>{
 const {b,ctx,p}=await L.launch('desktop',null,'sk');
 await p.goto('https://www.expresta.sk'+path,{waitUntil:'networkidle',timeout:60000});await L.sleep(2500);await L.killPopups(p);
 console.log('URL',p.url());
 const m=await p.evaluate(()=>{const vis=e=>e&&e.offsetParent!==null;
  const items=[...document.querySelectorAll('.calc_param_item')].filter(vis).map(it=>{const lab=(it.querySelector('label,.calc_param_title,h3,h4,span')?.innerText||'').trim().slice(0,30);
    const btn=it.querySelector('[data-bs-target]');const sel=it.querySelector('select');
    return {lab,txt:it.innerText.replace(/\s+/g,' ').trim().slice(0,90),drawer:btn?btn.getAttribute('data-bs-target'):null,select:sel?sel.id+':'+[...sel.options].map(o=>(o.selected?'*':'')+o.text.trim()).join('|').slice(0,200):null};});
  return {items,price:document.querySelector('#prodPriceTotal')?.innerText,amount:document.querySelector('#amount-value')?.value,speeds:[...document.querySelectorAll('input[name=production_speed]')].map(i=>(i.checked?'*':'')+(i.closest('label')||i.parentElement).innerText.replace(/\s+/g,' ').trim().slice(0,70)),
   deliv:(()=>{const el=[...document.querySelectorAll('*')].find(e=>e.children.length<2&&/ČAS A CENA DORUČENIA/.test(e.innerText||''));let c=el;for(let i=0;i<3&&c;i++)c=c.parentElement;return c?c.innerText.replace(/\s+/g,' ').slice(0,300):null})()};});
 console.log(JSON.stringify(m,null,1));
 for(const it of m.items){if(!it.drawer)continue;
   const d=await p.evaluate(sel=>{const e=document.querySelector(sel);return e?e.innerText.replace(/\n{2,}/g,'\n').replace(/\n/g,' | ').slice(0,700):null},it.drawer);
   console.log('DRAWER',it.drawer,'=>',d);}
 await L.shot(p,'PDP_sk_1440_'+path.replace(/\W/g,''),true);
 await b.close();
})();
