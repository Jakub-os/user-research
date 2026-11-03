const L=require('./lib');
(async()=>{
 const {b,p}=await L.launch('desktop');
 const st=async(l)=>{const s=await p.evaluate(()=>{const vis=e=>e&&e.offsetParent!==null&&getComputedStyle(e).visibility!=='hidden';
   const pg=document.querySelector('#pages-value');const sheets=pg.closest('.calc_param_item')?.innerText.replace(/\s+/g,' ');
   return {pages:pg.value,sheets,binding:document.querySelector('#binding-value').value+' '+document.querySelector('.calc_select_button .nl_button_text')?.innerText,price:vis(document.querySelector('#prodPriceTotal'))?document.querySelector('#prodPriceTotal').innerText:'(hidden)',calcBtn:vis(document.querySelector('button.calculate_price')),
    tips:[...document.querySelectorAll('.tooltip,.popover,.alert,.invalid-feedback,.text-danger,.modal.show,.toast.show,.reset_price_container')].filter(vis).map(e=>e.innerText.replace(/\s+/g,' ').trim().slice(0,200)).filter(Boolean)};});
   console.log(l,JSON.stringify(s));L.note({j:'J2-brochure',step:l,...s});return s;};
 await p.goto('https://www.expresta.sk/tlac-brozur',{waitUntil:'networkidle',timeout:60000});await L.sleep(2500);
 await st('default');
 const pg=p.locator('#pages-value');
 for(const v of ['37','2','0','abc','200','600']){
   await p.evaluate(()=>document.querySelector('#pages-value').scrollIntoView({block:'center'}));
   await pg.click({clickCount:3});await p.keyboard.press('Delete');await p.keyboard.type(v);await L.sleep(600);
   await st('typed '+v);
   await p.keyboard.press('Tab');await L.sleep(1500);await st('blur '+v);
   const c=p.locator('button.calculate_price:visible').first();
   if(await c.count()){await c.click();await p.waitForFunction(()=>document.querySelector('#prodPriceTotal')?.offsetParent!==null||document.querySelector('.reset_price_container')?.offsetParent!==null,null,{timeout:25000}).catch(()=>console.log('timeout'));await L.sleep(1500);}
   await st('afterCalc '+v);
   await L.shot(p,'UX-081_sk_1440_brozury_pages_'+v);
 }
 await b.close();
})();
