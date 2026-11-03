const L=require('./lib');
(async()=>{
 const {b,ctx,p}=await L.launch('desktop',null,'sk');
 await p.goto('https://www.expresta.sk/letaky',{waitUntil:'networkidle',timeout:60000});await L.sleep(2500);await L.killPopups(p);
 await p.evaluate(()=>document.querySelector('[data-bs-target="#paper-box"]').scrollIntoView({block:'start'}));
 await p.locator('[data-bs-target="#paper-box"]').first().click();await L.sleep(1200);
 await p.locator('#paper-box').getByText('Matný papier (0,299 mm / 300 g/m²)',{exact:true}).first().click();await L.sleep(2500);
 const mainPrice=await p.evaluate(()=>{const e=document.querySelector('#prodPriceTotal');return {txt:e.innerText,visible:e.offsetParent!==null,area:e.closest('.calc_param_item')?.innerText.replace(/\s+/g,' ').slice(0,120)}});console.log('main price',JSON.stringify(mainPrice));
 // open speed drawer
 await p.locator('[data-bs-target="#production-speed-selection-box"]').first().click();await L.sleep(1500);
 const sp=await p.evaluate(()=>{const b=document.querySelector('#production-speed-selection-box');return {vis:b.offsetParent!==null&&b.getBoundingClientRect().height>0,txt:b.innerText.replace(/\s+/g,' ').slice(0,300)}});console.log('speed drawer',JSON.stringify(sp));
 await p.evaluate(()=>document.querySelector('#production-speed-selection-box').scrollIntoView({block:'center'}));await L.sleep(400);
 await L.shot(p,'FLY_sk_1440_stale_speed_prices');
 // amount drawer
 await p.keyboard.press('Escape');await L.sleep(500);
 await p.evaluate(()=>document.querySelector('[data-bs-target="#paper-box"]').scrollIntoView({block:'start'}));
 await p.locator('[data-bs-target="#amount-box"]').first().click();await L.sleep(1500);
 const am=await p.evaluate(()=>{const b=document.querySelector('#amount-box');return {vis:b.getBoundingClientRect().height>0,txt:b.innerText.replace(/\s+/g,' ').slice(0,250)}});console.log('amount drawer',JSON.stringify(am));
 await L.shot(p,'FLY_sk_1440_stale_amount_table');
 // now calc for true price
 const c=p.locator('button.calculate_price:visible').first();if(await c.count()){await c.click();await p.waitForFunction(()=>document.querySelector('#prodPriceTotal')?.offsetParent!==null,null,{timeout:20000}).catch(()=>{});await L.sleep(1500);}
 console.log('true price after calc',await p.evaluate(()=>document.querySelector('#prodPriceTotal').innerText));
 await b.close();
})();
