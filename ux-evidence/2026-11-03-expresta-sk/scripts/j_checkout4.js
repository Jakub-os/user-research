const L=require('./lib');
(async()=>{
 const {b,ctx,p}=await L.launch('desktop',L.OUT+'scripts/state_cart.json');
 try{
 await p.goto('https://www.expresta.sk/order/delivery-payment',{waitUntil:'networkidle',timeout:60000});
 await L.sleep(3000);
 const k=p.locator('label:visible, div:visible').filter({hasText:/^\s*Kuriér\s*$/}).last();
 console.log('kurier count',await k.count());
 await k.click({timeout:10000});await L.sleep(3500);
 const t=(await p.evaluate(()=>(document.querySelector('main')||document.body).innerText)).replace(/\n{2,}/g,'\n');
 const i=t.indexOf('Geis');console.log(t.slice(i,i+2500));
 await L.shot(p,'UX-062_sk_1440_shipping_kurier_selected',true);
 console.log('has total/summary on step:',/Celkom|Spolu|Suma/i.test(t));
 await ctx.storageState({path:L.OUT+'scripts/state_cart.json'});
 }catch(e){console.log('ERR',e.message.slice(0,300));}
 await b.close();
})();
