const L=require('./lib');
(async()=>{
 const {b,ctx,p}=await L.launch('desktop',L.OUT+'scripts/state_cart.json');
 await p.goto('https://www.expresta.sk/order/shopping-cart',{waitUntil:'networkidle',timeout:60000});await L.sleep(2500);
 for(let i=0;i<4;i++){
  const rm=p.locator('a.remove_item:visible').first();if(!(await rm.count()))break;
  await rm.click();await L.sleep(1500);
  const m=await p.evaluate(()=>[...document.querySelectorAll('.modal.show')].map(e=>e.innerText.replace(/\s+/g,' ').slice(0,150)));
  console.log('remove click',i,'modal',m);
  if(i===0)await L.shot(p,'UX-130_sk_1440_cart_remove_confirm');
  const yes=p.locator('.modal.show button,.modal.show a').filter({hasText:/^\s*Áno\s*$/}).first();if(await yes.count()){await yes.click();}
  await p.waitForLoadState('networkidle');await L.sleep(2500);
  console.log('items left',await p.locator('a.remove_item:visible').count(), 'toast',await p.evaluate(()=>[...document.querySelectorAll('.toast.show,.alert')].filter(e=>e.offsetParent).map(e=>e.innerText.trim().slice(0,100))));
 }
 const t=(await p.evaluate(()=>(document.querySelector('main')||document.body).innerText)).replace(/\n{2,}/g,'\n').slice(0,600);
 console.log('EMPTY CART TEXT',t);
 await L.shot(p,'UX-131_sk_1440_cart_empty',true);
 await p.goto('https://www.expresta.sk/order/delivery-payment',{waitUntil:'networkidle'});await L.sleep(2000);
 console.log('direct delivery url when empty ->',p.url());
 await ctx.storageState({path:L.OUT+'scripts/state_cart.json'});
 await b.close();
})();
