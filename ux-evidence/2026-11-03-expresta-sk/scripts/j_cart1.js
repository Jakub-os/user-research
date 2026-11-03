const L=require('./lib');
(async()=>{
 const {b,ctx,p}=await L.launch('desktop',L.OUT+'scripts/state_cart.json');
 await p.goto('https://www.expresta.sk/order/shopping-cart',{waitUntil:'networkidle',timeout:60000});
 await L.sleep(2500);
 const st=async(lbl)=>{const s=await p.evaluate(()=>{const rows=[...document.querySelectorAll('input[type=number], input[name*=amount], input[name*=quantity]')].filter(e=>e.offsetParent).map(e=>e.value);
   const total=[...document.querySelectorAll('*')].find(e=>e.children.length<3&&/Celkom \(s DPH\)/.test(e.innerText||''));
   const prices=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&/^\d[\d\s]*,\d\d\s*€$/.test((e.innerText||'').trim())&&e.offsetParent).map(e=>e.innerText.trim());
   const modals=[...document.querySelectorAll('.modal.show,.toast.show')].map(m=>m.innerText.replace(/\s+/g,' ').slice(0,250));
   return {qtys:rows,prices,total:total?.parentElement?.innerText.replace(/\s+/g,' ').slice(0,80),modals,items:[...document.querySelectorAll('img')].filter(i=>i.offsetParent&&i.closest('main')).length};});
   console.log(lbl,JSON.stringify(s));L.note({j:'cart',step:lbl,...s});return s;};
 await st('initial');
 // icon semantics
 const icons=await p.evaluate(()=>[...document.querySelectorAll('main a, main button')].filter(e=>e.offsetParent&&!(e.innerText||'').trim()).map(e=>({tag:e.tagName,cls:e.className.slice(0,50),title:e.title,aria:e.getAttribute('aria-label'),tip:e.getAttribute('data-bs-original-title')||e.getAttribute('data-bs-title')||e.getAttribute('data-original-title'),href:e.href})));
 console.log('ICONS',JSON.stringify(icons,null,0));
 // + button
 const plus=p.locator('main button, main a, main span').filter({hasText:/^＋$|^\+$/}).first();
 const t0=Date.now(); await plus.click(); await L.sleep(400); await st('0.4s after +'); await L.sleep(3500); await st('4s after +');
 await L.shot(p,'UX-040_sk_1440_cart_after_plus');
 // type 0
 const qi=p.locator('main input[type=number], main input[name*=amount]').first();
 console.log('qty input count',await qi.count());
 if(await qi.count()){
  await qi.click({clickCount:3});await p.keyboard.type('0');await p.keyboard.press('Tab');await L.sleep(3500);await st('after qty 0');
  await L.shot(p,'UX-041_sk_1440_cart_qty0');
  await qi.click({clickCount:3});await p.keyboard.press('Delete');await p.keyboard.press('Tab');await L.sleep(3500);await st('after qty empty');
  await L.shot(p,'UX-041_sk_1440_cart_qty_empty');
  await qi.click({clickCount:3});await p.keyboard.type('1000');await p.keyboard.press('Tab');await L.sleep(4000);await st('after qty 1000');
 }
 // reload
 await p.reload({waitUntil:'networkidle'});await L.sleep(2500);await st('after reload');
 await ctx.storageState({path:L.OUT+'scripts/state_cart.json'});
 await b.close();
})();
