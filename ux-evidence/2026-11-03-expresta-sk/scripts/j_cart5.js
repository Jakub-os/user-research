const L=require('./lib');
(async()=>{
 const {b,ctx,p}=await L.launch('desktop',L.OUT+'scripts/state_cart.json');
 await p.goto('https://www.expresta.sk/order/shopping-cart',{waitUntil:'networkidle',timeout:60000});
 await L.sleep(2500);
 const info=()=>p.evaluate(()=>({url:location.href,qs:[...document.querySelectorAll('.item-quantity')].map(e=>e.value),names:[...document.querySelectorAll('main h2, main h3, main h4, .product_name, [class*=product-name]')].filter(e=>e.offsetParent).map(e=>e.innerText.trim()).slice(0,8),prices:[...document.querySelectorAll('.product_price')].map(e=>e.innerText),tot:document.querySelector('.total_price_row')?.innerText.replace(/\s+/g,' ')}));
 // duplicate
 await p.locator('a.duplicate_item').first().click();await p.waitForLoadState('networkidle');await L.sleep(3000);
 console.log('after duplicate',JSON.stringify(await info()));
 await L.shot(p,'UX-045_sk_1440_cart_after_duplicate',true);
 // edit first item
 await p.locator('a.edit_item').first().click();await p.waitForLoadState('networkidle');await L.sleep(3500);
 const e=await p.evaluate(()=>({url:location.href,amount:document.querySelector('#amount-value')?.value,sides:document.querySelector('#sides-value')?.value,speed:(document.querySelector('input[name=production_speed]:checked')||{}).value,price:document.querySelector('#prodPriceTotal')?.innerText,hasUploadPreview:/Zmazať/.test(document.body.innerText),btns:[...document.querySelectorAll('button,a')].filter(x=>x.offsetParent&&/košík|uložiť|objedn/i.test(x.innerText)).map(x=>x.innerText.trim()).slice(0,10)}));
 console.log('edit page',JSON.stringify(e));
 await L.shot(p,'UX-046_sk_1440_cart_edit_item_page');
 await ctx.storageState({path:L.OUT+'scripts/state_cart.json'});
 await b.close();
})();
