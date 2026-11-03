// Cross-domain: UX-001 (Back from step 2) + UX-003 (corrupt PDF upload)
const L=require('./lib');
const [d,slug]=process.argv.slice(2);
const st=p=>p.evaluate(()=>({amount:document.querySelector('#amount-value')?.value,sides:document.querySelector('#sides-value')?.value,price:document.querySelector('#prodPriceTotal')?.innerText,priceVis:document.querySelector('#prodPriceTotal')?.offsetParent!==null}));
(async()=>{
 const {b,ctx,p}=await L.launch('desktop',null,d);
 const base=`https://www.expresta.${d}`;
 await p.goto(`${base}/${slug}`,{waitUntil:'networkidle',timeout:60000});await L.sleep(2500);
 await L.killPopups(p);
 // two-sided via UI
 await p.locator('[data-id="sides-value"]').first().click();await L.sleep(700);
 await p.locator('.dropdown-menu.show li').nth(1).click();await L.sleep(1500);
 await p.locator('#amount-value').fill('500');await p.locator('#amount-value').blur();await L.sleep(800);
 const c=p.locator('button.calculate_price:visible').first(); if(await c.count()){await c.click();}
 await p.waitForFunction(()=>document.querySelector('#prodPriceTotal')?.offsetParent!==null,null,{timeout:20000}).catch(()=>{});await L.sleep(1500);
 const before=await st(p); console.log(d,'BEFORE',JSON.stringify(before));
 await p.locator('#next-calculation').click();await L.sleep(2500);
 const m1=p.locator('#next-design-order-submit:visible'); if(await m1.count()) await m1.click();
 await p.waitForLoadState('networkidle').catch(()=>{});await L.sleep(3000);
 const step2=p.url(); console.log(d,'STEP2',step2);
 const uploadHref=await p.evaluate(()=>{const a=[...document.querySelectorAll('a')].find(a=>/\/upload\?/.test(a.href));return a?a.href:null});
 const step2Txt=(await L.text(p,6000));const step2Ctl=await p.evaluate(()=>[...document.querySelectorAll('a,button,label,h2,h3')].filter(e=>e.offsetParent).map(e=>e.innerText.replace(/\s+/g,' ').trim()).filter(t=>t.length>3&&t.length<70&&t===t.toUpperCase()));console.log(d,'STEP2 UPPERCASE CTLS',JSON.stringify([...new Set(step2Ctl)]));
 console.log(d,'uploadHref',uploadHref);
 await L.shot(p,`XD_${d}_1440_step2`);
 await p.goBack({waitUntil:'load',timeout:45000}).catch(e=>console.log('goBack',e.message.slice(0,60)));await L.sleep(5000);
 const after=await st(p); console.log(d,'AFTER BACK',JSON.stringify(after), p.url());
 await L.shot(p,`XD_${d}_1440_after_back`);
 L.note({j:'XD-UX001',d,before,after,step2});
 // UX-003 corrupt PDF
 const up=uploadHref||step2.replace('/templates','/upload');
 await p.goto(up,{waitUntil:'load',timeout:60000});await L.sleep(2500);await L.killPopups(p);
 const pageTxt=await L.text(p,2500);
 await p.locator('input[type=file][name=upload_file]').first().setInputFiles(L.OUT+'testfiles/fake_pdf_actually_text.pdf');
 const seen=new Set();let shotDone=false;
 for(let i=0;i<150;i++){await L.sleep(200);
   const ms=await L.modals(p); ms.forEach(m=>seen.add(m));
   if(ms.length&&!shotDone){await L.sleep(400);await L.shot(p,`XD_${d}_1440_corrupt_pdf`);shotDone=true;}
 }
 for(const m of seen){const mm=m.match(/([A-ZÁÄČĎÉÍĹĽŇÓÔŔŠŤÚÝŽÖÜŐŰßĚŘŮ]{3,}(?: [A-ZÁÄČĎÉÍĹĽŇÓÔŔŠŤÚÝŽÖÜŐŰßĚŘŮ]{2,})+)/);if(mm)console.log(d,'TOAST NAMES OPTION',mm[1],'present on step2?',step2Txt.includes(mm[1]));}
 console.log(d,'CORRUPT PDF MESSAGES',JSON.stringify([...seen],null,1));
 // does the "data later" option mentioned exist?
 const btns=await p.evaluate(()=>[...document.querySelectorAll('a,button,label')].filter(e=>e.offsetParent).map(e=>(e.id?'#'+e.id+' ':'')+e.innerText.replace(/\s+/g,' ').trim()).filter(t=>t.length>2&&t.length<80));
 console.log(d,'UPLOAD PAGE CONTROLS',JSON.stringify(btns));
 L.note({j:'XD-UX003',d,url:p.url(),msgs:[...seen]});
 console.log(d,'UPLOAD PAGE TEXT',pageTxt.slice(0,1500));
 await b.close();
})();
