const L=require('./lib');
(async()=>{
 const {b,p}=await L.launch('desktop');
 await p.goto('https://www.expresta.sk/vizitky',{waitUntil:'networkidle',timeout:60000});
 await L.sleep(2000);
 await p.evaluate(()=>document.querySelector('#amount-value').scrollIntoView({block:'center'}));
 const q=p.locator('#amount-value');
 const seq=[];
 await q.click({clickCount:3}); await p.keyboard.press('Delete');
 for(const ch of '12345678'){await p.keyboard.type(ch);await L.sleep(250);
   const r=await p.evaluate(()=>({v:document.querySelector('#amount-value').value,tip:[...document.querySelectorAll('.tooltip')].map(t=>t.innerText.trim()).join('|')}));
   seq.push(ch+'→'+r.v+(r.tip?' ['+r.tip+']':''));
   if(r.tip) await L.shot(p,'UX-003_sk_1440_vizitky_qty_overmax_tooltip');}
 console.log(seq.join('\n'));
 // handler source
 console.log(await p.evaluate(()=>{const e=document.querySelector('#amount-value');return 'max attr:'+e.max+' maxlength:'+e.maxLength;}));
 for(const v of ['1000000','1000001','9999999','10000000']){
   await q.click({clickCount:3}); await p.keyboard.press('Delete'); await q.pressSequentially(v,{delay:60});
   const r=await p.evaluate(()=>({v:document.querySelector('#amount-value').value,tip:[...document.querySelectorAll('.tooltip')].map(t=>t.innerText.trim()).join('|')}));
   console.log('typed',v,'=>',JSON.stringify(r));
 }
 await b.close();
})();
