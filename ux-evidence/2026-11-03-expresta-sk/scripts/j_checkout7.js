const L=require('./lib');
(async()=>{
 const {b,ctx,p}=await L.launch('desktop',L.OUT+'scripts/state_cart.json');
 try{
 await p.goto('https://www.expresta.sk/order/delivery-payment',{waitUntil:'networkidle',timeout:60000});await L.sleep(2500);
 await p.locator('label[for="delivery-type-38326"]').first().click();await L.sleep(3500);
 await p.locator('label[for="payment-type-22"]').first().click().catch(async()=>p.locator('#payment-type-22').check({force:true}));await L.sleep(2000);
 await p.locator('button:visible,a:visible').filter({hasText:/^\s*POKRAČOVAŤ\s*$/i}).first().click();
 await p.waitForLoadState('networkidle');await L.sleep(2500);
 console.log('URL',p.url());
 const em=p.locator('input[type=email], input[name*=mail]').filter({visible:true}).first();
 console.log('email attrs',await em.evaluate(e=>({type:e.type,name:e.name,req:e.required,ac:e.autocomplete,ph:e.placeholder,label:document.querySelector(`label[for="${e.id}"]`)?.innerText})));
 const btn=p.locator('button:visible,a:visible').filter({hasText:/POKRAČOVAŤ V OBJEDNÁVKE/i}).first();
 for(const v of ['','test@','test@example','Test Tester']){
   await em.fill(v);await btn.click();await L.sleep(2500);
   const r=await p.evaluate(()=>{const e=[...document.querySelectorAll('input')].find(i=>i.offsetParent&&(i.type==='email'||/mail/.test(i.name)));
     return {url:location.href,valid:e?.validity?.valid,vmsg:e?.validationMessage,msgs:[...document.querySelectorAll('.invalid-feedback,.text-danger,.alert,.toast.show,.modal.show,.error,[class*=error]')].filter(x=>x.offsetParent!==null||x.classList.contains('show')).map(x=>x.innerText.replace(/\s+/g,' ').trim()).filter(Boolean).slice(0,4)};});
   console.log('email',JSON.stringify(v),JSON.stringify(r));L.note({j:'checkout-email',val:v,...r});
   await L.shot(p,'UX-065_sk_1440_udaje_email_'+(v||'empty').replace(/[^a-z0-9]/gi,'_'));
   if(!/customer-data/.test(r.url)){console.log('LEFT PAGE');break;}
 }
 // back navigation
 await p.goBack({waitUntil:'networkidle'});await L.sleep(3000);
 const back=await p.evaluate(()=>({url:location.href,del:document.querySelector('input[name=delivery_type]:checked')?.id,pay:document.querySelector('input[name=payment_type]:checked')?.id}));
 console.log('after back',JSON.stringify(back));
 await L.shot(p,'UX-066_sk_1440_back_to_delivery');
 await p.goto('https://www.expresta.sk/order/shopping-cart',{waitUntil:'networkidle'});await L.sleep(2000);
 await p.goto('https://www.expresta.sk/order/delivery-payment',{waitUntil:'networkidle'});await L.sleep(3000);
 console.log('re-enter delivery',JSON.stringify(await p.evaluate(()=>({del:document.querySelector('input[name=delivery_type]:checked')?.id,pay:document.querySelector('input[name=payment_type]:checked')?.id}))));
 await ctx.storageState({path:L.OUT+'scripts/state_cart.json'});
 }catch(e){console.log('ERR',e.message.slice(0,300));}
 await b.close();
})();
