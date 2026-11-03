const L=require('./lib');
(async()=>{
 const {b,ctx,p}=await L.launch('desktop');
 const st=async(l)=>{const s=await p.evaluate(()=>({url:location.pathname+location.search,amount:document.querySelector('#amount-value')?.value,sides:document.querySelector('#sides-value')?.value,sidesShown:document.querySelector('[data-id=sides-value]')?.innerText.trim(),speed:(document.querySelector('input[name=production_speed]:checked')||{}).value,price:document.querySelector('#prodPriceTotal')?.offsetParent?document.querySelector('#prodPriceTotal').innerText:null}));console.log(l,JSON.stringify(s));L.note({j:'J6',step:l,...s});};
 await p.goto('https://www.expresta.sk/vizitky',{waitUntil:'networkidle',timeout:60000});await L.sleep(2500);
 await p.evaluate(()=>document.querySelector('#amount-value').scrollIntoView({block:'center'}));
 await p.locator('[data-id="sides-value"]').click();await L.sleep(600);await p.locator('.dropdown-menu.show').getByText('Obojstranná tlač').first().click();await L.sleep(800);
 await p.locator('#amount-value').click({clickCount:3});await p.keyboard.type('500');await p.keyboard.press('Tab');await L.sleep(800);
 await p.locator('button.calculate_price:visible').first().click();await p.waitForFunction(()=>document.querySelector('#prodPriceTotal')?.offsetParent!==null,null,{timeout:20000});await L.sleep(1500);
 await st('configured');
 await p.reload({waitUntil:'networkidle'});await L.sleep(2500);await st('after reload');
 await L.shot(p,'UX-100_sk_1440_vizitky_after_reload');
 // configure again, navigate away and back
 await p.evaluate(()=>document.querySelector('#amount-value').scrollIntoView({block:'center'}));
 await p.locator('[data-id="sides-value"]').click();await L.sleep(600);await p.locator('.dropdown-menu.show').getByText('Obojstranná tlač').first().click();await L.sleep(800);
 await p.locator('#amount-value').click({clickCount:3});await p.keyboard.type('500');await p.keyboard.press('Tab');await L.sleep(800);
 await p.locator('button.calculate_price:visible').first().click();await p.waitForFunction(()=>document.querySelector('#prodPriceTotal')?.offsetParent!==null,null,{timeout:20000});await L.sleep(1500);
 await st('configured again');
 await p.goto('https://www.expresta.sk/letaky',{waitUntil:'networkidle'});await L.sleep(1500);
 await p.goBack({waitUntil:'networkidle'});await L.sleep(2500);await st('after leave + back');
 await L.shot(p,'UX-100_sk_1440_vizitky_after_back');
 await p.goto('https://www.expresta.sk/vizitky',{waitUntil:'networkidle'});await L.sleep(2500);await st('fresh open same session');
 // continue to step2 then back
 await p.evaluate(()=>document.querySelector('#amount-value').scrollIntoView({block:'center'}));
 await p.locator('[data-id="sides-value"]').click();await L.sleep(600);await p.locator('.dropdown-menu.show').getByText('Obojstranná tlač').first().click();await L.sleep(800);
 await p.locator('#amount-value').click({clickCount:3});await p.keyboard.type('500');await p.keyboard.press('Tab');await L.sleep(800);
 await p.locator('button.calculate_price:visible').first().click();await p.waitForFunction(()=>document.querySelector('#prodPriceTotal')?.offsetParent!==null,null,{timeout:20000});await L.sleep(1500);
 await p.locator('#next-calculation').click();await L.sleep(2500);
 const cont=p.locator('.modal.show').getByText(/POKRAČOVAŤ BEZ/i).first();if(await cont.count())await cont.click();
 await p.waitForLoadState('networkidle');await L.sleep(2500);await st('step2');
 await p.goBack({waitUntil:'networkidle'});await L.sleep(3000);await st('back from step2');
 await L.shot(p,'UX-100_sk_1440_vizitky_back_from_step2');
 // stepper link "Cena a parametre" from step2
 await p.goForward({waitUntil:'networkidle'});await L.sleep(2500);
 const stepLink=p.locator('a').filter({hasText:/Cena a parametre/}).first();
 console.log('stepper link exists',await stepLink.count(), await stepLink.getAttribute('href').catch(()=>null));
 if(await stepLink.count()){await stepLink.click();await p.waitForLoadState('networkidle');await L.sleep(2500);await st('via stepper link');}
 await b.close();
})();
