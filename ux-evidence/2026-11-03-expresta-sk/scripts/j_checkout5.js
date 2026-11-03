const L=require('./lib');
(async()=>{
 const {b,ctx,p}=await L.launch('desktop',L.OUT+'scripts/state_cart.json');
 try{
 await p.goto('https://www.expresta.sk/order/delivery-payment',{waitUntil:'networkidle',timeout:60000});
 await L.sleep(3000);
 const rad=await p.evaluate(()=>[...document.querySelectorAll('input')].filter(e=>/radio/.test(e.type)).map(e=>({name:e.name,id:e.id,val:e.value,vis:e.offsetParent!==null,lab:(document.querySelector(`label[for="${e.id}"]`)||e.closest('label')||e.parentElement).innerText.replace(/\s+/g,' ').trim().slice(0,60)})));
 console.log(JSON.stringify(rad));
 const kid=rad.find(r=>/^Kuriér/.test(r.lab));
 console.log('kurier',kid);
 if(kid){await p.locator(`label[for="${kid.id}"]`).first().click().catch(async()=>{await p.locator('#'+kid.id).check({force:true});});}
 await L.sleep(4000);
 const t=(await p.evaluate(()=>(document.querySelector('main')||document.body).innerText)).replace(/\n{2,}/g,'\n');
 const i=t.indexOf('Geis');console.log(t.slice(i,i+2500));
 await L.shot(p,'UX-062_sk_1440_shipping_kurier_selected',true);
 await ctx.storageState({path:L.OUT+'scripts/state_cart.json'});
 }catch(e){console.log('ERR',e.message.slice(0,300));}
 await b.close();
})();
