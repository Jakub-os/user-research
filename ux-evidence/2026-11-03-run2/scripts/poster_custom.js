const L=require('./lib');
let cnt=0;(async()=>{
 const {b,ctx,p}=await L.launch('desktop',null,'sk');
 await p.goto('https://www.expresta.sk/plagaty',{waitUntil:'networkidle',timeout:60000});await L.sleep(2500);await L.killPopups(p);
 const st=async l=>{const s=await p.evaluate(()=>{const vis=e=>e&&e.offsetParent!==null;return {size:document.querySelector('[data-bs-target="#size-box"]').innerText.replace(/\s+/g,' ').trim(),mat:document.querySelector('[data-bs-target="#paper-box"]')?.innerText.replace(/\s+/g,' ').trim().slice(0,40),price:vis(document.querySelector('#prodPriceTotal'))?document.querySelector('#prodPriceTotal').innerText:'(hidden)',calc:!![...document.querySelectorAll('button.calculate_price')].find(vis),msgs:[...document.querySelectorAll('.toast.show,.modal.show,.invalid-feedback,.text-danger,.tooltip')].filter(vis).map(t=>t.innerText.replace(/\s+/g,' ').slice(0,220))}});console.log(l,JSON.stringify(s));L.note({j:'POS',step:l,...s});return s;};
 const calc=async()=>{const c=p.locator('button.calculate_price:visible').first();if(await c.count()){await c.click();for(let i=0;i<20;i++){await L.sleep(700);const m=await L.modals(p);if(m.length){console.log('  modal/toast',JSON.stringify(m));break;}if(await p.evaluate(()=>document.querySelector('#prodPriceTotal')?.offsetParent!==null))break;}await L.sleep(1000);}};
 await p.evaluate(()=>document.querySelector('[data-bs-target="#size-box"]').scrollIntoView({block:'start'}));
 await st('default A3');
 await p.locator('[data-bs-target="#size-box"]').first().click();await L.sleep(1200);
 await p.locator('#size-box').getByText('Iný',{exact:true}).first().click();await L.sleep(1000);await p.locator('#size-box').getByText('Iný rozmer alebo ohyb').first().click().catch(e=>console.log('iny2 fail'));await L.sleep(2000);console.log('modals',JSON.stringify(await L.modals(p)));console.log('vis custom inputs anywhere',await p.evaluate(()=>[...document.querySelectorAll('input')].filter(i=>i.offsetParent&&/width|height|sirk|vysk/i.test(i.id+i.name)).map(i=>i.id)));
 const inp=await p.evaluate(()=>[...document.querySelectorAll('#size-box input')].filter(i=>i.offsetParent).map(i=>i.id+' val='+i.value+' ph='+i.placeholder));console.log('visible inputs',inp);
 console.log('drawer text',(await p.locator('#size-box').innerText()).replace(/\s+/g,' ').slice(0,700));
 await L.shot(p,'POS_sk_1440_custom_size');
 const W=p.locator('input[id*=width]:visible').first(), H=p.locator('input[id*=height]:visible').first();
 for(const [w,h] of [['500','700'],['5000','5000'],['500','700'],['10','10'],['abc','-5']]){
   await W.fill(w);await H.fill(h);await H.press('Tab');await L.sleep(1200);
   const v=await p.evaluate(()=>[...document.querySelectorAll('#size-box input')].filter(i=>i.offsetParent).map(i=>i.id+'='+i.value));
   const t=(await p.locator('#size-box').innerText()).replace(/\s+/g,' ');const warn=(t.match(/(Min|Max|max|min|rozmer|povolen)[^.]{0,120}/g)||[]).slice(0,4);
   const ok=p.locator('button:visible').filter({hasText:/POTVRDI|ULOŽ|OK|POUŽI/i}).first();const hasOk=await ok.count();
   if(hasOk){await ok.click();await L.sleep(1200);}
   await st(`custom ${w}x${h} (fields ${v.join(',')}) warn=${JSON.stringify(warn)} okBtn=${hasOk}`);
   await calc();await st(`  -> after calc ${w}x${h}`);
   cnt=(cnt||0)+1;await p.evaluate(()=>document.querySelector('[data-bs-target="#size-box"]').scrollIntoView({block:'start'}));await L.sleep(300);await L.shot(p,`POS_sk_1440_seq${cnt}_${w}x${h}`.replace(/[^\w]/g,'_'));
   if(w==='5000')await L.shot(p,'POS_sk_1440_custom_5000');const toastT=[];for(let k=0;k<1;k++){}
   if(w==='10')await L.shot(p,'POS_sk_1440_custom_10');
   if(await p.locator('#price-error-modal.show').count()){const zm=p.locator('#price-error-modal').getByText(/ZMENIŤ PARAMETRE/i).first();await zm.click().catch(async()=>{await p.keyboard.press('Escape')});await L.sleep(1500);console.log('  modal closed?',!(await p.locator('#price-error-modal.show').count()), 'size btn',await p.evaluate(()=>document.querySelector('[data-bs-target="#size-box"]').innerText.trim()));}
   if(!(await W.isVisible())){await p.locator('[data-bs-target="#size-box"]').first().click();await L.sleep(1000);}
 }
 await b.close();
})();
