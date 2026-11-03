const L=require('./lib');
(async()=>{
 const {b,ctx,p}=await L.launch('desktop',L.OUT+'scripts/state_cart.json');
 await p.goto('https://www.expresta.sk/order/shopping-cart',{waitUntil:'networkidle',timeout:60000});
 await L.sleep(2500);
 const info=()=>p.evaluate(()=>({qs:[...document.querySelectorAll('.item-quantity')].map(e=>e.value),prices:[...document.querySelectorAll('.product_price')].map(e=>e.innerText),tot:document.querySelector('.total_price_row')?.innerText.replace(/\s+/g,' '),modals:[...document.querySelectorAll('.modal.show')].map(m=>m.innerText.replace(/\s+/g,' ').slice(0,200)),badge:document.querySelector('[class*=cart] [class*=badge], .cart-count, [class*=basket-count]')?.innerText}));
 // qty 0 then "Nie"
 const qi=p.locator('.item-quantity').first();
 await qi.click({clickCount:3});await p.keyboard.type('0');await p.keyboard.press('Tab');await L.sleep(1500);
 console.log('qty0',JSON.stringify(await info()));
 await L.shot(p,'UX-044_sk_1440_cart_qty0_confirm');
 await p.locator('.modal.show button, .modal.show a').filter({hasText:/^\s*Nie\s*$/}).first().click();await L.sleep(6000);
 console.log('after Nie',JSON.stringify(await info()));
 await L.shot(p,'UX-044_sk_1440_cart_qty0_after_nie');
 await p.reload({waitUntil:'networkidle'});await L.sleep(2500);
 console.log('after reload',JSON.stringify(await info()));
 await L.shot(p,'UX-044_sk_1440_cart_qty0_after_nie_reload');
 await ctx.storageState({path:L.OUT+'scripts/state_cart.json'});
 await b.close();
})();
