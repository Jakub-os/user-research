const L=require('./lib');
const v=process.argv[2];
(async()=>{
 const {b,p}=await L.launch('desktop');
 await p.goto('https://www.expresta.sk/tlac-brozur',{waitUntil:'networkidle',timeout:60000});await L.sleep(2500);
 await p.evaluate(()=>document.querySelector('#pages-value').scrollIntoView({block:'center'}));
 const pg=p.locator('#pages-value');
 await pg.click({clickCount:3});await p.keyboard.press('Delete');await p.keyboard.type(v);await p.keyboard.press('Tab');await L.sleep(1500);
 const t0=Date.now();
 const c=p.locator('button.calculate_price:visible').first();
 const had=await c.count();
 if(had)await c.click();
 let s;
 for(let i=0;i<30;i++){await L.sleep(1000);s=await p.evaluate(()=>{const vis=e=>e&&e.offsetParent!==null;return {pages:document.querySelector('#pages-value').value,sheets:document.querySelector('#pages-value').closest('.calc_param_item')?.innerText.replace(/\s+/g,' '),price:vis(document.querySelector('#prodPriceTotal'))?document.querySelector('#prodPriceTotal').innerText:null,calcBtn:vis(document.querySelector('button.calculate_price')),loading:/Kalkulujeme/.test(document.body.innerText)&&[...document.querySelectorAll('*')].some(e=>e.children.length===0&&/Kalkulujeme/.test(e.innerText||'')&&vis(e)),modal:[...document.querySelectorAll('.modal.show')].map(m=>m.querySelector('.modal-title,h2,h3,h5')?.innerText).join('|'),tips:[...document.querySelectorAll('.tooltip')].map(t=>t.innerText).join('|')};});
   if(s.price||s.modal)break;}
 console.log(v,'hadCalc',had,'ms',Date.now()-t0,JSON.stringify(s));
 L.note({j:'J2-pages',val:v,...s});
 await L.shot(p,'UX-082_sk_1440_brozury_pages_'+v+'_result');
 await b.close();
})();
