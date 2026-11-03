const L=require('./lib');
const vp=process.argv[2]||'m390';
(async()=>{
 const {b,ctx,p}=await L.launch(vp);
 const W=vp==='m390'?390:320;
 const ov=async(l)=>{const r=await p.evaluate(()=>{const de=document.documentElement;const wide=[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return e.offsetParent&&r.right>innerWidth+1&&r.width>0&&getComputedStyle(e).position!=='fixed'}).slice(0,6).map(e=>e.tagName+'.'+(e.className||'').toString().slice(0,40)+' r='+Math.round(e.getBoundingClientRect().right));return {sw:de.scrollWidth,iw:innerWidth,overflow:de.scrollWidth>innerWidth,wide};});console.log(l,JSON.stringify(r));L.note({j:'J4-'+vp,step:l,...r});return r;};
 await p.goto('https://www.expresta.sk/',{waitUntil:'networkidle',timeout:60000});await L.sleep(2500);
 await ov('home');await L.shot(p,`UX-070_sk_${W}_home`);
 // hamburger
 const burger=p.locator('button:visible, a:visible').filter({hasText:/^\s*MENU\s*$/i}).first();
 console.log('burger',await burger.count());
 if(await burger.count()){await burger.click();await L.sleep(1500);await L.shot(p,`UX-071_sk_${W}_menu_open`);
   const items=await p.evaluate(()=>[...document.querySelectorAll('a,button')].filter(e=>e.offsetParent&&e.getBoundingClientRect().top<900&&e.innerText.trim()).map(e=>{const r=e.getBoundingClientRect();return e.innerText.trim().slice(0,30)+' h='+Math.round(r.height)}).slice(0,30));
   console.log('menu items',items.join(' | '));
   await burger.click().catch(()=>{});await L.sleep(800);}
 await p.goto('https://www.expresta.sk/vizitky',{waitUntil:'networkidle'});await L.sleep(2500);
 await ov('pdp');
 await p.evaluate(()=>document.querySelector('#amount-value').scrollIntoView({block:'center'}));await L.sleep(500);
 await L.shot(p,`UX-072_sk_${W}_vizitky_calc`);
 const tt=await p.evaluate(()=>[...document.querySelectorAll('#amount-value, #next-calculation, button.dropdown-toggle, .calculate_price')].filter(e=>e.offsetParent).map(e=>{const r=e.getBoundingClientRect();return (e.id||e.className.slice(0,25))+' '+Math.round(r.width)+'x'+Math.round(r.height)}));
 console.log('targets',tt);
 // sticky CTA? price visible when scrolled to options top?
 const calcTop=await p.evaluate(()=>{const h=[...document.querySelectorAll('h2,h1')].find(e=>/Kalkulačka/.test(e.innerText));h.scrollIntoView({block:'start'});const pr=document.querySelector('#prodPriceTotal').getBoundingClientRect();const cta=document.querySelector('#next-calculation').getBoundingClientRect();return {priceTop:Math.round(pr.top),ctaTop:Math.round(cta.top),vh:innerHeight};});
 console.log('calc at top: price/cta position',JSON.stringify(calcTop));
 await L.shot(p,`UX-072_sk_${W}_vizitky_calc_top`);
 // change quantity on mobile
 await p.locator('#amount-value').click({clickCount:3});await p.keyboard.type('500');await p.keyboard.press('Tab');await L.sleep(800);
 await L.shot(p,`UX-073_sk_${W}_vizitky_qty_changed`);
 const c=p.locator('button.calculate_price:visible').first();if(await c.count()){await c.click();await p.waitForFunction(()=>document.querySelector('#prodPriceTotal')?.offsetParent!==null,null,{timeout:20000}).catch(()=>{});await L.sleep(1500);}
 await L.shot(p,`UX-073_sk_${W}_vizitky_after_calc`);
 await p.locator('#next-calculation').click();await L.sleep(2500);
 await L.shot(p,`UX-074_sk_${W}_modal_after_navrh`);
 const cont=p.locator('.modal.show').getByText(/POKRAČOVAŤ BEZ/i).first();if(await cont.count())await cont.click();
 await p.waitForLoadState('networkidle');await L.sleep(3000);
 await ov('step2');await L.shot(p,`UX-075_sk_${W}_step2`,true);
 console.log('step2 url',p.url());
 await ctx.storageState({path:L.OUT+`scripts/state_${vp}.json`});
 await b.close();
})();
