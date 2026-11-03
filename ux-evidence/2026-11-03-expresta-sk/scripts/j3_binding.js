const L=require('./lib');
(async()=>{
 const {b,p}=await L.launch('desktop');
 const st=async(l)=>{const s=await p.evaluate(()=>{const vis=e=>e&&e.offsetParent!==null;return {binding:document.querySelector('.calc_select_button .nl_button_text')?.innerText,size:[...document.querySelectorAll('.calc_select_button .nl_button_text')].map(e=>e.innerText).join(' / '),pages:document.querySelector('#pages-value').value,sheets:document.querySelector('#pages-value').closest('.calc_param_item')?.innerText.replace(/\s+/g,' '),material:document.querySelector('[data-bs-target*=material] .nl_button_text, [data-bs-target*=paper] .nl_button_text')?.innerText,price:vis(document.querySelector('#prodPriceTotal'))?document.querySelector('#prodPriceTotal').innerText:null,calc:vis(document.querySelector('button.calculate_price'))};});console.log(l,JSON.stringify(s));L.note({j:'J3-binding',step:l,...s});return s;};
 await p.goto('https://www.expresta.sk/tlac-brozur',{waitUntil:'networkidle',timeout:60000});await L.sleep(2500);
 await st('default');
 await p.evaluate(()=>document.querySelector('#pages-value').scrollIntoView({block:'center'}));
 await p.locator('[data-bs-target="#binding-box"]').first().click();await L.sleep(1500);
 await L.shot(p,'UX-090_sk_1440_brozury_binding_drawer');
 const opts=await p.evaluate(()=>{const box=document.querySelector('#binding-box');return box?box.innerText.replace(/\n{2,}/g,'\n').slice(0,1500):'none';});
 console.log('DRAWER',opts);
 const lep=p.locator('#binding-box').getByText(/lepen/i).first();
 if(await lep.count()){await lep.click();await L.sleep(2500);}
 await st('after choose lepená');
 await L.shot(p,'UX-090_sk_1440_brozury_after_lepena');
 const c=p.locator('button.calculate_price:visible').first();if(await c.count()){await c.click();await L.sleep(6000);}
 await st('after calc');
 await L.shot(p,'UX-090_sk_1440_brozury_after_lepena_calc');
 // set pages 8 with lepena
 await p.locator('#pages-value').click({clickCount:3});await p.keyboard.press('Delete');await p.keyboard.type('8');await p.keyboard.press('Tab');await L.sleep(1000);
 if(await c.count()){await c.click();await L.sleep(6000);}
 const m=await p.evaluate(()=>[...document.querySelectorAll('.modal.show,.toast.show')].map(e=>e.innerText.replace(/\s+/g,' ').slice(0,200)));
 await st('lepena 8 pages');console.log('msgs',m);
 await L.shot(p,'UX-090_sk_1440_brozury_lepena_8pages');
 await b.close();
})();
