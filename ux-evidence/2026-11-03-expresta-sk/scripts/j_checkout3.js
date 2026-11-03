const L=require('./lib');
(async()=>{
 const {b,ctx,p}=await L.launch('desktop',L.OUT+'scripts/state_cart.json');
 await p.goto('https://www.expresta.sk/order/delivery-payment',{waitUntil:'networkidle',timeout:60000});
 await L.sleep(3000);
 // click continue without selection
 const cont=p.locator('button:visible,a:visible').filter({hasText:/^\s*POKRAČOVAŤ\s*$/i}).first();
 await cont.click();await L.sleep(2500);
 const v1=await p.evaluate(()=>({url:location.href,msgs:[...document.querySelectorAll('.modal.show,.toast.show,.invalid-feedback,.alert-danger,.text-danger,.error')].filter(e=>e.offsetParent!==null||e.classList.contains('show')).map(e=>e.innerText.replace(/\s+/g,' ').trim().slice(0,200)).filter(Boolean)}));
 console.log('continue w/o selection',JSON.stringify(v1));
 await L.shot(p,'UX-061_sk_1440_shipping_continue_without_selection');
 await p.goto('https://www.expresta.sk/order/delivery-payment',{waitUntil:'networkidle'});await L.sleep(2500);
 await p.getByText('Kuriér',{exact:true}).first().click();await L.sleep(3000);
 const t=(await p.evaluate(()=>(document.querySelector('main')||document.body).innerText)).replace(/\n{2,}/g,'\n');
 const i=t.indexOf('Geis');console.log(t.slice(i,i+2500));
 await L.shot(p,'UX-062_sk_1440_shipping_kurier_selected',true);
 await ctx.storageState({path:L.OUT+'scripts/state_cart.json'});
 await b.close();
})();
