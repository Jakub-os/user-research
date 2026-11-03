const L=require('./lib');
(async()=>{
 const {b,ctx,p}=await L.launch('desktop',L.OUT+'scripts/state_cart.json');
 await p.goto('https://www.expresta.sk/order/shopping-cart',{waitUntil:'networkidle',timeout:60000});
 await L.sleep(2500);
 const price=()=>p.evaluate(()=>({q:document.querySelector('.item-quantity').value,p:document.querySelector('.product_price')?.innerText,tot:document.querySelector('.total_price_row')?.innerText.replace(/\s+/g,' ')}));
 const qi=p.locator('.item-quantity').first();
 await qi.click({clickCount:3});await p.keyboard.type('299');await p.keyboard.press('Tab');
 await p.waitForFunction(()=>/€/.test(document.querySelector('.product_price')?.innerText||''),null,{timeout:20000}).catch(()=>{});await L.sleep(6000);
 console.log('qty299',JSON.stringify(await price()));
 const plus=p.locator('button,a,span').filter({hasText:/^\s*[＋+]\s*$/}).filter({visible:true}).first();
 await plus.click();
 for(const t of [500,2000,5000,10000]){await L.sleep(t===500?500:t-500);console.log('after + ',t,'ms',JSON.stringify(await price()));}
 await L.shot(p,'UX-043_sk_1440_cart_plus_to_300');
 const minus=p.locator('button,a,span').filter({hasText:/^\s*(—|-|−)\s*$/}).filter({visible:true}).first();
 await minus.click(); await L.sleep(8000);console.log('after - 8s',JSON.stringify(await price()));
 await p.reload({waitUntil:'networkidle'});await L.sleep(2500);console.log('reload',JSON.stringify(await price()));
 await ctx.storageState({path:L.OUT+'scripts/state_cart.json'});
 await b.close();
})();
