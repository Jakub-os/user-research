const L=require('./lib');
(async()=>{
 const {b,ctx,p}=await L.launch('desktop');
 const st=async(lbl)=>{const s=await p.evaluate(()=>{const pr=document.querySelector('#prodPriceTotal');const vis=e=>e&&e.offsetParent!==null;
   const calc=[...document.querySelectorAll('button,a,div,span')].filter(e=>vis(e)&&e.innerText&&e.innerText.trim()==='VYPOČÍTAŤ').length;
   return {amount:document.querySelector('#amount-value').value,price:pr?pr.innerText:null,priceVisible:vis(pr),calcBtn:calc,sides:document.querySelector('#sides-value').value,speed:(document.querySelector('input[name=production_speed]:checked')||{}).value};});
   console.log(lbl,JSON.stringify(s));L.note({j:'J1',step:lbl,...s});return s;};
 await p.goto('https://www.expresta.sk/vizitky',{waitUntil:'networkidle',timeout:60000});
 await L.sleep(2000);
 await st('default');
 // keyboard editing of quantity
 const q=p.locator('#amount-value');
 await q.click(); await p.keyboard.press('Control+A'); await p.keyboard.type('500');
 await st('after ctrl+A type 500');
 await q.fill('250');
 await q.click(); await p.keyboard.press('End'); await p.keyboard.press('Backspace');await p.keyboard.press('Backspace');await p.keyboard.press('Backspace'); await p.keyboard.type('500'); 
 await st('after backspace x3 type 500');
 await p.keyboard.press('Enter'); await L.sleep(2000);
 await st('after Enter');
 await q.scrollIntoViewIfNeeded(); await L.shot(p,'UX-001_sk_1440_vizitky_qty500_after_enter');
 // paste
 await ctx.grantPermissions(['clipboard-read','clipboard-write']).catch(()=>{});
 await p.evaluate(()=>navigator.clipboard.writeText('1000').catch(()=>{}));
 await q.click(); await p.keyboard.press('End');for(let i=0;i<4;i++)await p.keyboard.press('Backspace'); await p.keyboard.press('Control+V'); await L.sleep(500);
 await st('after ctrl+V 1000');
 // click VYPOČÍTAŤ
 const calc=p.getByText('VYPOČÍTAŤ',{exact:true}).filter({visible:true}).first();
 if(await calc.count()){await calc.click();await L.sleep(2500);}
 await st('after VYPOČÍTAŤ');
 await L.shot(p,'UX-001_sk_1440_vizitky_after_calc');
 // change sides
 await p.selectOption('#sides-value','2').catch(e=>console.log('selErr',e.message.slice(0,100)));
 await L.sleep(2500); await st('after sides=obojstranna (native select)');
 // bootstrap-select click path
 await p.locator('button.dropdown-toggle',{hasText:/tlač/}).first().click().catch(e=>console.log('dd',e.message.slice(0,80)));
 await L.sleep(800); await L.shot(p,'UX-001_sk_1440_vizitky_sides_dropdown_open');
 await p.locator('.dropdown-menu.show li a, .dropdown-menu.show .dropdown-item').filter({hasText:'Obojstranná'}).first().click().catch(e=>console.log('dd2',e.message.slice(0,80)));
 await L.sleep(2500); await st('after sides via UI');
 // speed
 const speedTxt=await p.evaluate(()=>[...document.querySelectorAll('input[name=production_speed]')].map(i=>{const l=i.closest('label')||i.parentElement;return i.value+': '+l.innerText.replace(/\s+/g,' ').trim()}));
 console.log('SPEEDS',speedTxt);
 // delivery dropdown content
 const deliv=await p.evaluate(()=>{const el=[...document.querySelectorAll('*')].find(e=>e.innerText&&e.innerText.trim()==='ČAS A CENA DORUČENIA');let c=el;for(let i=0;i<3;i++)c=c.parentElement;return c.innerText.replace(/\s+/g,' ').slice(0,1500)});
 console.log('DELIV',deliv);
 await b.close();
})();
