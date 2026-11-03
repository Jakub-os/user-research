const L=require('./lib');
(async()=>{
 const {b,p}=await L.launch('desktop');
 const st=async(lbl)=>{const s=await p.evaluate(()=>{const pr=document.querySelector('#prodPriceTotal');const per=document.querySelector('.prodPriceTotal')?.parentElement?.innerText.replace(/\s+/g,' ');
   const msgs=[...document.querySelectorAll('.reset_price_container,.modal.show .modal-body,.popover,.tooltip,.alert,.invalid-feedback,.text-danger,.modal.show')].filter(e=>e.offsetParent!==null&&getComputedStyle(e).visibility!=='hidden'&&getComputedStyle(e).opacity!=='0').map(e=>e.innerText.trim().slice(0,200)).filter(Boolean);
   return {amount:document.querySelector('#amount-value').value,price:pr?.innerText,priceVisible:pr?.offsetParent!==null,per,msgs};});
   console.log(lbl,JSON.stringify(s));L.note({j:'J5-qty',step:lbl,...s});return s;};
 await p.goto('https://www.expresta.sk/vizitky',{waitUntil:'networkidle',timeout:60000});
 await L.sleep(2000);
 const q=p.locator('#amount-value');
 const calc=()=>p.locator('button.calculate_price:visible').first();
 for(const v of ['','0','1','10','99999','5000000']){
   await q.fill(v);
   await st('typed '+JSON.stringify(v)+' (no blur)');
   const c=calc(); 
   if(await c.count()){await c.click();await L.sleep(3000);} else console.log('no calc btn');
   const s=await st('after VYPOČÍTAŤ for '+JSON.stringify(v));
   await p.evaluate(()=>document.querySelector('#amount-value').scrollIntoView({block:'center'}));
   await L.shot(p,'UX-002_sk_1440_vizitky_qty_'+(v||'empty')+'_after_calc');
 }
 await b.close();
})();
