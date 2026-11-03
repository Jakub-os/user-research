const L=require('./lib');
(async()=>{
 const {b,p}=await L.launch('desktop');
 await p.goto('https://www.expresta.sk/vizitky',{waitUntil:'networkidle',timeout:60000});
 await L.sleep(2000);
 const state=async()=>p.evaluate(()=>{
   const q=s=>document.querySelector(s);
   const priceBox=[...document.querySelectorAll('*')].find(e=>e.children.length<4 && /CENA S DPH/.test(e.innerText||'') && e.innerText.length<200);
   const vis=[...document.querySelectorAll('button, a.btn, .btn')].filter(e=>e.offsetParent && /VYPOČÍTAŤ|NÁVRH A OBJ/i.test(e.innerText)).map(e=>e.innerText.trim());
   const errs=[...document.querySelectorAll('.error, .invalid-feedback, .alert, .text-danger, [class*=error]')].filter(e=>e.offsetParent&&e.innerText.trim()).map(e=>e.innerText.trim().slice(0,150));
   return {amount:q('#amount-value').value, min:q('#amount-value').min, max:q('#amount-value').max, step:q('#amount-value').step, price:priceBox?priceBox.innerText.replace(/\s+/g,' ').slice(0,120):null, ctas:vis, errs};
 });
 console.log('INIT',JSON.stringify(await state()));
 const cases=['0','-5','1','7','251','abc','1.5','99999','1000000',''];
 for(const v of cases){
   await p.fill('#amount-value',v);
   await p.locator('#amount-value').press('Tab');
   await L.sleep(1500);
   const s1=await state();
   // click VYPOČÍTAŤ if visible
   const calcBtn=p.locator('button:visible, a:visible').filter({hasText:/VYPOČÍTAŤ/}).first();
   let after=null;
   if(await calcBtn.count()){await calcBtn.click().catch(e=>{});await L.sleep(2500);after=await state();}
   console.log('CASE',JSON.stringify(v),'\n  before',JSON.stringify(s1),'\n  after',JSON.stringify(after));
   const tag=('qty_'+(v||'empty')).replace(/[^a-z0-9_]/gi,'x');
   await p.locator('#amount-value').scrollIntoViewIfNeeded();
   await L.shot(p,'UX-qty_sk_1440_vizitky_'+tag);
 }
 console.log('ERRS',p._errs);
 await b.close();
})();
