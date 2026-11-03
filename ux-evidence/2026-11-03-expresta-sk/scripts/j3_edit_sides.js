const L=require('./lib');
(async()=>{
 const {b,ctx,p}=await L.launch('desktop',L.OUT+'scripts/state_cart.json');
 await p.goto('https://www.expresta.sk/order/product/vizitky-variation/upload?c=6ae98cca60058640517276&ba=edit&refetch=1',{waitUntil:'networkidle',timeout:60000});
 await L.sleep(3000);
 const info=()=>p.evaluate(()=>({sides:document.querySelector('#sides-value').value,amount:document.querySelector('#amount-value').value,price:document.querySelector('#prodPriceTotal')?.innerText,priceVis:document.querySelector('#prodPriceTotal')?.offsetParent!==null,calc:document.querySelector('button.calculate_price')?.offsetParent!==null,
   sidesUpload:[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&/^(Predná|Zadná) strana$/.test((e.innerText||'').trim())&&e.offsetParent).map(e=>e.innerText.trim()),
   zmazat:[...document.querySelectorAll('*')].filter(e=>e.children.length<2&&/^\s*Zmazať\s*$/.test(e.innerText||'')&&e.offsetParent).length,
   modals:[...document.querySelectorAll('.modal.show,.toast.show')].map(m=>m.innerText.replace(/\s+/g,' ').slice(0,250))}));
 console.log('start',JSON.stringify(await info()));
 await p.getByText(/UPRAVIŤ PARAMETRE TLAČE/i).first().click();await L.sleep(1500);
 await L.shot(p,'UX-050_sk_1440_edit_params_expanded');
 // open the sides bootstrap-select
 const dd=p.locator('button.dropdown-toggle[data-id="sides-value"], [data-id="sides-value"]').first();
 console.log('dd count',await dd.count());
 if(await dd.count()){await dd.click();await L.sleep(700);await p.locator('.dropdown-menu.show').getByText('Obojstranná tlač').first().click();}
 else {await p.selectOption('#sides-value','2');await p.dispatchEvent('#sides-value','change');}
 await L.sleep(3000);
 console.log('after sides=2',JSON.stringify(await info()));
 await L.shot(p,'UX-050_sk_1440_edit_after_sides2');
 const c=p.locator('button.calculate_price:visible').first();
 if(await c.count()){await c.click();await p.waitForFunction(()=>document.querySelector('#prodPriceTotal')?.offsetParent!==null,null,{timeout:20000}).catch(()=>{});await L.sleep(2000);}
 console.log('after calc',JSON.stringify(await info()));
 await p.evaluate(()=>window.scrollTo(0,400));
 await L.shot(p,'UX-050_sk_1440_edit_after_sides2_calc');
 // try save without back side
 const save=p.locator('button:visible,a:visible').filter({hasText:/ULOŽIŤ ZMENY/i}).first();
 await save.click();await L.sleep(4000);
 const m=await info();
 console.log('after save',p.url(),JSON.stringify(m));
 await L.shot(p,'UX-050_sk_1440_edit_after_save');
 if(m.modals.length){const cont=p.locator('.modal.show').getByText(/POKRAČOVAŤ BEZ/i).first(); if(await cont.count()){await cont.click();await p.waitForLoadState('networkidle');await L.sleep(4000);console.log('after modal continue',p.url());await L.shot(p,'UX-050_sk_1440_after_save_modal_continue',true);}}
 const cart=await p.evaluate(()=>({qs:[...document.querySelectorAll('.item-quantity')].map(e=>e.value),prices:[...document.querySelectorAll('.product_price')].map(e=>e.innerText),tot:document.querySelector('.total_price_row')?.innerText.replace(/\s+/g,' ')}));
 console.log('cart',JSON.stringify(cart));
 await ctx.storageState({path:L.OUT+'scripts/state_cart.json'});
 await b.close();
})();
