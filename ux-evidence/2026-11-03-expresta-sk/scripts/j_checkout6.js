const L=require('./lib');
(async()=>{
 const {b,ctx,p}=await L.launch('desktop',L.OUT+'scripts/state_cart.json');
 try{
 await p.goto('https://www.expresta.sk/order/delivery-payment',{waitUntil:'networkidle',timeout:60000});
 await L.sleep(3000);
 await p.locator('label[for="delivery-type-38326"]').first().click().catch(async()=>p.locator('#delivery-type-38326').check({force:true}));await L.sleep(4000);
 const pay=await p.evaluate(()=>[...document.querySelectorAll('input[type=radio]')].filter(e=>e.name!=='delivery_type').map(e=>({name:e.name,id:e.id,val:e.value,checked:e.checked,lab:(document.querySelector(`label[for="${e.id}"]`)||e.closest('label')||e.parentElement).innerText.replace(/\s+/g,' ').trim().slice(0,60),alt:[...((document.querySelector(`label[for="${e.id}"]`)||e.parentElement).querySelectorAll('img'))].map(i=>i.alt).join(',')})));
 console.log('PAY',JSON.stringify(pay));
 console.log('delivery checked',await p.evaluate(()=>document.querySelector('input[name=delivery_type]:checked')?.id));
 // expand all payments
 await p.getByText('Zobraziť všetky spôsoby platby').click().catch(()=>{});await L.sleep(1500);
 const pay2=await p.evaluate(()=>[...document.querySelectorAll('input[type=radio]')].filter(e=>e.name!=='delivery_type').map(e=>((document.querySelector(`label[for="${e.id}"]`)||e.parentElement).innerText.replace(/\s+/g,' ').trim().slice(0,70)||'[img]')+' | '+[...((document.querySelector(`label[for="${e.id}"]`)||e.parentElement).querySelectorAll('img'))].map(i=>i.alt).join(',')));
 console.log('ALL PAY',pay2);
 await L.shot(p,'UX-063_sk_1440_payment_all',true);
 const first=pay[0]; await p.locator(`label[for="${first.id}"]`).first().click().catch(async()=>p.locator('#'+first.id).check({force:true}));
 await L.sleep(2500);
 await p.locator('button:visible,a:visible').filter({hasText:/^\s*POKRAČOVAŤ\s*$/i}).first().click();
 await p.waitForLoadState('networkidle');await L.sleep(3000);
 console.log('URL',p.url());
 await L.shot(p,'UX-064_sk_1440_udaje_initial',true);
 console.log((await p.evaluate(()=>(document.querySelector('main')||document.body).innerText)).replace(/\n{2,}/g,'\n').slice(0,1500));
 await ctx.storageState({path:L.OUT+'scripts/state_cart.json'});
 }catch(e){console.log('ERR',e.message.slice(0,300));}
 await b.close();
})();
