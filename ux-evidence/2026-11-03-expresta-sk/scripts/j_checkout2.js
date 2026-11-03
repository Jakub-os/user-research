const L=require('./lib');
(async()=>{
 const {b,ctx,p}=await L.launch('desktop',L.OUT+'scripts/state_cart.json');
 await p.goto('https://www.expresta.sk/order/delivery-payment',{waitUntil:'networkidle',timeout:60000});
 await L.sleep(3000);
 const sel=await p.$$eval('select',els=>els.map(s=>({name:s.name,id:s.id,selected:s.options[s.selectedIndex]?.text,n:s.options.length,first:[...s.options].slice(0,3).map(o=>o.text)})));
 console.log('SELECTS',JSON.stringify(sel));
 const t=(await p.evaluate(()=>(document.querySelector('main')||document.body).innerText)).replace(/\n{2,}/g,'\n');
 const i=t.indexOf('Zimbabwe');console.log(t.slice(i, i+4000));
 const radios=await p.$$eval('input[type=radio],input[type=checkbox]',els=>els.map(e=>({type:e.type,name:e.name,val:e.value,checked:e.checked,dis:e.disabled,vis:e.offsetParent!==null,label:(e.closest('label')||e.parentElement).innerText.replace(/\s+/g,' ').trim().slice(0,160)})).filter(r=>r.vis||r.checked));
 console.log(JSON.stringify(radios,null,0));
 await L.shot(p,'UX-060_sk_1440_shipping_payment_viewport');
 await b.close();
})();
