const L=require('./lib');
(async()=>{
 const {b,ctx,p}=await L.launch('desktop',L.OUT+'scripts/state_cart.json');
 await p.goto('https://www.expresta.sk/order/shopping-cart',{waitUntil:'networkidle',timeout:60000});
 await L.sleep(2000);
 console.log('discount field in cart:',await p.evaluate(()=>/zľav|kupón|kód/i.test(document.querySelector('main')?.innerText||'')));
 await p.locator('a:visible,button:visible').filter({hasText:/POKRAČOVAŤ K OBJEDNÁVKE/i}).first().click();
 await p.waitForLoadState('networkidle');await L.sleep(3500);
 console.log('URL',p.url());
 await L.shot(p,'UX-060_sk_1440_shipping_payment_initial',true);
 console.log((await p.evaluate(()=>(document.querySelector('main')||document.body).innerText)).replace(/\n{2,}/g,'\n').slice(0,4000));
 const radios=await p.$$eval('input[type=radio]',els=>els.map(e=>({name:e.name,val:e.value,checked:e.checked,dis:e.disabled,vis:e.offsetParent!==null,label:(e.closest('label')||e.parentElement).innerText.replace(/\s+/g,' ').trim().slice(0,140)})));
 console.log(JSON.stringify(radios,null,0));
 await ctx.storageState({path:L.OUT+'scripts/state_cart.json'});
 await b.close();
})();
