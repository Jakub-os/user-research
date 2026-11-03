const L=require('./lib');
const [d,slug]=process.argv.slice(2);
(async()=>{
 const {b,ctx,p}=await L.launch('desktop',null,d);
 await p.goto(`https://www.expresta.${d}/${slug}`,{waitUntil:'networkidle',timeout:60000});await L.sleep(2500);
 console.log('URL',p.url());
 const s=await p.evaluate(()=>({amount:document.querySelector('#amount-value')?.value,sides:document.querySelector('#sides-value')&&[...document.querySelector('#sides-value').options].map(o=>(o.selected?'*':'')+o.value+'='+o.text),price:document.querySelector('#prodPriceTotal')?.innerText,next:document.querySelector('#next-calculation')?.innerText,
   selects:[...document.querySelectorAll('select')].map(s=>s.id+':'+[...s.options].map(o=>(o.selected?'*':'')+o.text.trim()).join('|').slice(0,200)),
   speeds:[...document.querySelectorAll('input[name=production_speed]')].map(i=>(i.checked?'*':'')+(i.closest('label')||i.parentElement).innerText.replace(/\s+/g,' ').trim().slice(0,80))}));
 console.log(JSON.stringify(s,null,1));
 await L.shot(p,`XD_${d}_1440_pdp_default`);
 await p.locator('#next-calculation').click();await L.sleep(2500);
 console.log('MODALS',await L.modals(p));
 console.log('modal btns',await p.evaluate(()=>[...document.querySelectorAll('.modal.show a,.modal.show button')].map(e=>e.id+':'+e.innerText.trim())));
 await b.close();
})();
