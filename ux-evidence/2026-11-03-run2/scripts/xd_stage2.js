// Cross-domain: UX-002 (cart edit -> two-sided drops file), UX-009 (delivery/payment Back), cleanup
const L=require('./lib');
const [d,slug]=process.argv.slice(2);
const upArea=p=>p.evaluate(()=>[...document.querySelectorAll('input[type=file][name=upload_file]')].map(i=>{let c=i;for(let k=0;k<4&&c.parentElement;k++)c=c.parentElement;return c.innerText.replace(/\s+/g,' ').trim().slice(0,160)}));
const thumbs=p=>p.evaluate(()=>[...document.querySelectorAll('img')].filter(i=>i.offsetParent&&i.closest('tr,.cart-item,[class*=item]')&&i.width>30).map(i=>i.src.slice(0,140)));
(async()=>{
 const {b,ctx,p}=await L.launch('desktop',null,d);
 const base=`https://www.expresta.${d}`;
 try{
 await p.goto(`${base}/${slug}`,{waitUntil:'networkidle',timeout:60000});await L.sleep(2500);await L.killPopups(p);
 await p.locator('#next-calculation').click();await L.sleep(2500);
 const m1=p.locator('#next-design-order-submit:visible'); if(await m1.count()) await m1.click();
 await p.waitForURL(/templates/,{timeout:30000}).catch(()=>{});await L.sleep(2000);
 await p.goto(p.url().replace('/templates','/upload'),{waitUntil:'load'});await L.sleep(3000);await L.killPopups(p);
 await p.locator('input[type=file][name=upload_file]').first().setInputFiles(L.OUT+'testfiles/test_vizitka_96x56mm_TEST.pdf');
 for(let i=0;i<60;i++){await L.sleep(1000);const a=await upArea(p);if(a[0]&&!/PDF, AI/.test(a[0])&&!/%/.test(a[0])&&i>3)break;}
 console.log(d,'UPLOAD AREA after ok pdf',JSON.stringify(await upArea(p)));
 await p.locator('textarea:visible').last().fill('TEST UX research - test item, do not order').catch(()=>{});
 await p.locator('#next-calculation-step-1').click();await L.sleep(3000);console.log(d,'after add modals',JSON.stringify(await L.modals(p)));
 if(await p.locator('#next-design-order-submit:visible').count()){await p.locator('#next-design-order-submit:visible').click();}
 await p.waitForURL(/shopping-cart/,{timeout:40000}).catch(()=>{});await p.waitForLoadState('networkidle').catch(()=>{});await L.sleep(3000);
 console.log(d,'CART URL',p.url());
 const t0=await thumbs(p);console.log(d,'CART THUMBS before edit',JSON.stringify(t0));
 await L.shot(p,`XD_${d}_1440_cart_before_edit`);
 if(!process.env.SKIP_EDIT){
 // edit
 await p.locator('a.edit_item:visible').first().click();await p.waitForLoadState('load');await L.sleep(4000);await L.killPopups(p);
 console.log(d,'EDIT URL',p.url());
 console.log(d,'EDIT upload area start',JSON.stringify(await upArea(p)));
 // expand params (the toggle above the upload area)
 const tog=await p.locator('.show-more-btn:visible').first().innerText().catch(()=>null); await p.locator('.show-more-btn:visible').first().click().catch(e=>console.log('tog err'));
 console.log(d,'toggle',tog);await L.sleep(1500);
 await p.locator('[data-id="sides-value"]').first().click();await L.sleep(700);
 await p.locator('.dropdown-menu.show li').nth(1).click();await L.sleep(3000);
 const c=p.locator('button.calculate_price:visible').first(); if(await c.count()){await c.click();await L.sleep(4000);}
 console.log(d,'EDIT upload area after two-sided',JSON.stringify(await upArea(p)));
 await p.evaluate(()=>window.scrollTo(0,300));await L.shot(p,`XD_${d}_1440_edit_after_twosided`);
 const saveTxt=await p.locator('#next-calculation-step-1').innerText().catch(()=>null);console.log(d,'save btn text',saveTxt);
 await p.locator('#next-calculation-step-1').click();await L.sleep(3000);
 const ms=await L.modals(p);console.log(d,'after save modals',JSON.stringify(ms));
 if(await p.locator('#next-design-order-submit:visible').count()){await p.locator('#next-design-order-submit:visible').click();}
 await p.waitForURL(/shopping-cart/,{timeout:40000}).catch(()=>{});await p.waitForLoadState('networkidle').catch(()=>{});await L.sleep(3000);
 console.log(d,'URL after save',p.url());
 const t1=await thumbs(p);console.log(d,'CART THUMBS after edit',JSON.stringify(t1));
 const rowTxt=await p.evaluate(()=>(document.querySelector('a.edit_item')?.closest('tr,.row,[class*=item]')?.innerText||'').replace(/\s+/g,' ').slice(0,400));console.log(d,'CART ROW',rowTxt);
 await L.shot(p,`XD_${d}_1440_cart_after_edit`);
 L.note({j:'XD-UX002',d,t0,t1,row:rowTxt});
 }
 // UX-009
 const chk=async l=>{const r=await p.evaluate(()=>({url:location.pathname,del:document.querySelector('input[name=delivery_type]:checked')?.id||null,pay:document.querySelector('input[name=payment_type]:checked')?.id||null,payCount:[...document.querySelectorAll('input[name=payment_type]')].filter(i=>(i.closest('label,div')||i).offsetParent).length,payTotal:document.querySelectorAll('input[name=payment_type]').length}));console.log(d,'UX009',l,JSON.stringify(r));L.note({j:'XD-UX009',d,step:l,...r});return r;};
 console.log(d,'CART BTNS',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('a.btn,button.btn,a[class*=btn],button')].filter(e=>e.offsetParent&&e.innerText.trim()).map(e=>e.innerText.trim().slice(0,40)+' | '+(e.id||'')+' | '+e.className.slice(0,40)))));
 const go=await p.evaluate(()=>{const re=/(POKRAČOVAŤ|POKRAČOVAT|WEITER|TOVÁBB|CONTINUE|PROCEED|CHECKOUT|ZUR KASSE|PÉNZTÁR)/i, no=/(HOZZÁ|HINZU|PRIDAŤ|PŘIDAT|ADD |ADD$|NÁKUP|EINKAUF|SHOPPING)/i;const e=[...document.querySelectorAll('a,button')].filter(e=>e.offsetParent&&(/(delivery-payment|special-offer)/.test(e.href||'')||(re.test(e.innerText||'')&&!no.test(e.innerText||''))));const x=e[e.length-1];if(x){x.click();return (x.innerText||'').trim()+' '+(x.href||'')}return null});
 console.log(d,'cart continue',go);await p.waitForURL(/delivery-payment|special-offer/,{timeout:30000}).catch(()=>{});await L.sleep(4000);await L.killPopups(p);
 if(/special-offer/.test(p.url())){
   console.log(d,'SPECIAL OFFER PAGE',(await L.text(p,2500)).replace(/\n/g,' | ').slice(0,1800));
   console.log(d,'SO controls',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('a,button')].filter(e=>e.offsetParent&&e.innerText.trim()).map(e=>e.innerText.trim().slice(0,50)+' -> '+(e.href||'').slice(-40)).slice(-25))));
   await L.shot(p,`XD_${d}_1440_special_offer`,true);
   const sk=await p.evaluate(()=>{const e=[...document.querySelectorAll('a,button')].filter(e=>e.offsetParent&&(/delivery-payment/.test(e.href||'')||/(POKRAČOVAT|POKRAČOVAŤ|WEITER|FORTFAHREN|FOLYTAT|CONTINUE|NE,|NEIN|NO,)/i.test(e.innerText||'')));const x=e[e.length-1];if(x){x.click();return x.innerText.trim()}return null});
   console.log(d,'SO continue',sk);await p.waitForURL(/delivery-payment/,{timeout:30000}).catch(()=>{});await L.sleep(4000);
 }
 await chk('fresh');
 const delOpts=await p.evaluate(()=>[...document.querySelectorAll('input[name=delivery_type]')].map(i=>{const l=document.querySelector(`label[for="${i.id}"]`)||i.closest('label')||i.parentElement;return i.id+': '+l.innerText.replace(/\s+/g,' ').trim().slice(0,90)}));
 console.log(d,'DELIVERY OPTIONS',JSON.stringify(delOpts,null,1));
 // choose a courier-like option (first)
 const firstDel=await p.evaluate(()=>{const a=[...document.querySelectorAll('input[name=delivery_type]')];const f=a.find(i=>{const l=document.querySelector(`label[for="${i.id}"]`);return l&&l.offsetParent&&/(Kur|Courier|Futár|GLS|DPD)/i.test(l.innerText)&&!/firm|business|Firmen|céges|company/i.test(l.innerText)})||a.find(i=>{const l=document.querySelector(`label[for="${i.id}"]`);return l&&/(Kur|Courier|Futár|GLS|DPD)/i.test(l.innerText)})||a.find(i=>{const l=document.querySelector(`label[for="${i.id}"]`);return l&&l.offsetParent&&!/(Výdaj|Výdaj|pick|Abhol|Packstation|átvevő|csomagpont|box)/i.test(l.innerText)});return f?.id});console.log(d,'chosen delivery',firstDel);
 await p.locator(`label[for="${firstDel}"]`).first().click();await L.sleep(4000);
 const payOpts=await p.evaluate(()=>[...document.querySelectorAll('input[name=payment_type]')].map(i=>{const l=document.querySelector(`label[for="${i.id}"]`)||i.closest('label')||i.parentElement;return i.id+': '+l.innerText.replace(/\s+/g,' ').trim().slice(0,90)}));
 console.log(d,'PAYMENT OPTIONS',JSON.stringify(payOpts,null,1));
 const firstPay=await p.evaluate(()=>{const a=[...document.querySelectorAll('input[name=payment_type]')].filter(i=>{const l=document.querySelector(`label[for="${i.id}"]`);return l&&l.offsetParent});return (a.find(i=>/(převod|prevod|Überweis|Vorkasse|átutal|transfer)/i.test(document.querySelector(`label[for="${i.id}"]`).innerText))||a[0])?.id});console.log(d,'chosen payment',firstPay);
 if(firstPay) await p.locator(`label[for="${firstPay}"]`).first().click();await L.sleep(2500);
 await chk('selected');
 await L.shot(p,`XD_${d}_1440_delivery_selected`,true);
 const cont=await p.evaluate(()=>{const bs=[...document.querySelectorAll('button,a')].filter(e=>e.offsetParent&&e.innerText.trim().length>3);const last=bs.filter(e=>/(POKRAČOVAŤ|POKRAČOVAT|WEITER|FOLYTATÁS|CONTINUE)/i.test(e.innerText));const e=last[last.length-1];if(e){e.click();return e.innerText.trim()}return null});
 console.log(d,'continue clicked',cont);
 if(!cont){const b2=p.locator('a.btn-loader.float-end:visible, button.btn-loader.float-end:visible').last();console.log(d,'fallback continue',await b2.innerText().catch(()=>null));await b2.click().catch(e=>console.log('fb err'));}
 await p.waitForLoadState('load');await L.sleep(4000);
 await chk('next step');
 await p.goBack({waitUntil:'load',timeout:45000}).catch(()=>{});await L.sleep(5000);
 await chk('browser back');
 await L.shot(p,`XD_${d}_1440_delivery_after_back`,true);
 await p.reload({waitUntil:'load'});await L.sleep(4000);await chk('reload');
 }catch(e){console.log(d,'ERROR',e.message.split('\n')[0]);}
 // cleanup
 await p.goto(`${base}/order/shopping-cart`,{waitUntil:'load'});await L.sleep(3000);
 for(let i=0;i<5;i++){const rm=p.locator('a.remove_item:visible').first();if(!(await rm.count()))break;await rm.click();await L.sleep(1500);
   const yes=p.locator('.modal.show button.btn-primary,.modal.show a.btn-primary, .modal.show .btn').filter({hasText:/^\s*(Áno|Ano|Ja|Igen|Yes)\s*$/i}).first();
   if(await yes.count())await yes.click();else console.log(d,'no confirm btn',await L.modals(p));
   await p.waitForLoadState('load');await L.sleep(3000);}
 console.log(d,'CART ITEMS LEFT',await p.locator('a.remove_item:visible').count());
 await b.close();
})();
