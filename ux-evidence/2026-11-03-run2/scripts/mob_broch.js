const L=require('./lib');
const vp=process.argv[2]||'m390';
(async()=>{
 const {b,ctx,p}=await L.launch(vp,null,'sk');
 await p.goto('https://www.expresta.sk/tlac-brozur',{waitUntil:'networkidle',timeout:60000});await L.sleep(2500);await L.killPopups(p);
 const hs=()=>p.evaluate(()=>[document.documentElement.scrollWidth,innerWidth]);
 console.log('hscroll',await hs());
 const small=await p.evaluate(()=>[...document.querySelectorAll('.calc_param_item button, .calc_param_item input, .calc_param_item a, button.calculate_price, #next-calculation, input[name=production_speed]+label, label[for^=speed]')].filter(e=>e.offsetParent).map(e=>{const r=e.getBoundingClientRect();return {t:(e.innerText||e.id||e.name||'').replace(/\s+/g,' ').trim().slice(0,30),w:Math.round(r.width),h:Math.round(r.height),x:Math.round(r.x),right:Math.round(r.right)}}));
 console.log('controls',JSON.stringify(small));
 console.log('overflowing',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.calc_param_item *')].filter(e=>e.offsetParent&&e.getBoundingClientRect().right>innerWidth+1).map(e=>e.tagName+'.'+(e.className||'').toString().slice(0,30)+' r='+Math.round(e.getBoundingClientRect().right)).slice(0,10))));
 await L.shot(p,`MB_sk_${vp}_brochure_top`);
 await p.evaluate(()=>document.querySelector('#pages-value').scrollIntoView({block:'center'}));await L.sleep(500);
 await L.shot(p,`MB_sk_${vp}_brochure_pages`);
 // change pages to 40 with mobile typing
 const pg=p.locator('#pages-value');await pg.tap().catch(()=>pg.click());await pg.fill('40');await p.keyboard.press('Tab').catch(()=>{});await L.sleep(1500);
 const calcBox=await p.evaluate(()=>{const c=[...document.querySelectorAll('button.calculate_price')].find(e=>e.offsetParent);if(!c)return null;const r=c.getBoundingClientRect();return {y:Math.round(r.y),h:Math.round(r.height),inView:r.y>=0&&r.bottom<=innerHeight,pos:getComputedStyle(c).position}});
 console.log('calc button after change',JSON.stringify(calcBox));
 const priceBox=await p.evaluate(()=>{const e=document.querySelector('#prodPriceTotal');const r=e.closest('div').getBoundingClientRect();return {y:Math.round(r.y),inView:r.y>=0&&r.bottom<=innerHeight}});console.log('price box',JSON.stringify(priceBox));
 await L.shot(p,`MB_sk_${vp}_brochure_after_pages40`);
 const c=p.locator('button.calculate_price:visible').first();if(await c.count()){await c.tap().catch(()=>c.click());}
 await p.waitForFunction(()=>document.querySelector('#prodPriceTotal')?.offsetParent!==null,null,{timeout:20000}).catch(()=>{});await L.sleep(1500);
 const after=await p.evaluate(()=>{const e=document.querySelector('#prodPriceTotal');const r=e.getBoundingClientRect();return {price:e.innerText,y:Math.round(r.y),inView:r.y>=0&&r.bottom<=innerHeight,scrollY:Math.round(scrollY)}});console.log('after calc',JSON.stringify(after));
 await L.shot(p,`MB_sk_${vp}_brochure_after_calc`);
 // binding drawer
 await p.locator('[data-bs-target="#binding-box"]').first().tap().catch(()=>p.locator('[data-bs-target="#binding-box"]').first().click());await L.sleep(1500);
 const dr=await p.evaluate(()=>{const e=document.querySelector('#binding-box');const r=e.getBoundingClientRect();return {x:Math.round(r.x),w:Math.round(r.width),h:Math.round(r.height),txt:e.innerText.replace(/\s+/g,' ').slice(0,200),close:[...e.querySelectorAll('button,.btn-close')].map(b=>{const q=b.getBoundingClientRect();return Math.round(q.width)+'x'+Math.round(q.height)})}});console.log('drawer',JSON.stringify(dr));
 await L.shot(p,`MB_sk_${vp}_brochure_binding_drawer`);
 await p.keyboard.press('Escape');await L.sleep(800);
 console.log('hscroll end',await hs());
 // to step 2 & upload
 await p.evaluate(()=>document.querySelector('#next-calculation').scrollIntoView({block:'center'}));
 await p.locator('#next-calculation').tap().catch(()=>p.locator('#next-calculation').click());await L.sleep(3000);
 console.log('modals',await L.modals(p));
 if(await p.locator('#next-design-order-submit:visible').count())await p.locator('#next-design-order-submit:visible').tap();
 await p.waitForURL(/templates|upload/,{timeout:30000}).catch(()=>{});await L.sleep(2500);
 console.log('STEP2',p.url());
 await p.goto(p.url().replace('/templates','/upload'),{waitUntil:'load'});await L.sleep(3000);await L.killPopups(p);
 console.log('upload hscroll',await hs());
 await L.shot(p,`MB_sk_${vp}_brochure_upload_top`);
 const upInfo=await p.evaluate(()=>{const i=[...document.querySelectorAll('input[type=file][name=upload_file]')];return i.map(x=>{let c=x;for(let k=0;k<4&&c.parentElement;k++)c=c.parentElement;const r=c.getBoundingClientRect();return {txt:c.innerText.replace(/\s+/g,' ').slice(0,120),w:Math.round(r.width),h:Math.round(r.height),vis:!!c.offsetParent}})});console.log('upload boxes',JSON.stringify(upInfo));
 const fi=p.locator('input[type=file][name=upload_file]').first();await fi.setInputFiles(L.OUT+'testfiles/test_A4_wrong_size_TEST.pdf');
 const seen=new Set();let last='';
 for(let i=0;i<90;i++){await L.sleep(1000);const st=await p.evaluate(()=>{const x=document.querySelector('input[type=file][name=upload_file]');let c=x;for(let k=0;k<5&&c.parentElement;k++)c=c.parentElement;return c.innerText.replace(/\s+/g,' ').slice(0,300)});(await L.modals(p)).forEach(m=>seen.add(m));if(st!==last){console.log(i+'s area:',st);last=st;}if(i>15&&!/%|Spracov|Nahráva/.test(st)&&!/Nahrať súbor/.test(st))break;}
 console.log('messages',JSON.stringify([...seen]));
 const warn=await p.evaluate(()=>[...document.querySelectorAll('.text-danger,.alert,[class*=warn],[class*=error],.invalid-feedback')].filter(e=>e.offsetParent&&e.innerText.trim()).map(e=>e.innerText.replace(/\s+/g,' ').slice(0,200)));console.log('warnings',warn);
 await p.evaluate(()=>{const x=document.querySelector('input[type=file][name=upload_file]');let c=x;for(let k=0;k<5&&c.parentElement;k++)c=c.parentElement;c.scrollIntoView({block:'start'})});await L.sleep(500);
 await L.shot(p,`MB_sk_${vp}_brochure_upload_done`);
 const btn=await p.evaluate(()=>[...document.querySelectorAll('button,a')].filter(e=>e.offsetParent&&/KOŠÍK|POKRAČ/i.test(e.innerText)).map(e=>{const r=e.getBoundingClientRect();return e.id+' '+e.innerText.trim()+' '+Math.round(r.width)+'x'+Math.round(r.height)+' disabled='+(e.disabled||/disabled/.test(e.className))}));console.log('cta',btn);
 console.log('page text',(await L.text(p,4000)).replace(/\n/g,' | ').slice(600,2600));
 await p.locator('#continue-order').tap().catch(()=>p.locator('#continue-order').click());
 await L.sleep(4000);console.log('after continue modals',JSON.stringify(await L.modals(p)));
 if(await p.locator('#next-design-order-submit:visible').count()){console.log('scratch modal');await p.locator('#next-design-order-submit:visible').tap();}
 for(let i=0;i<30;i++){await L.sleep(1000);if(/shopping-cart|cover|obalka|special/.test(p.url()))break;}
 await L.sleep(3000);console.log('URL after continue',p.url());
 await L.shot(p,`MB_sk_${vp}_brochure_after_continue`);
 console.log('text',(await L.text(p,2500)).replace(/\n/g,' | ').slice(200,1400));
 await ctx.storageState({path:L.OUT+'scripts/state_broch.json'});
 // cleanup
 await p.goto('https://www.expresta.sk/order/shopping-cart',{waitUntil:'load'});await L.sleep(3000);
 for(let k=0;k<5;k++){const rm=p.locator('a.remove_item:visible').first();if(!(await rm.count()))break;await rm.tap().catch(()=>rm.click());await L.sleep(1500);const yes=p.locator('.modal.show .btn').filter({hasText:/^\s*Áno\s*$/i}).first();if(await yes.count())await yes.tap().catch(()=>yes.click());await p.waitForLoadState('load');await L.sleep(3000);}
 console.log('CART LEFT',await p.locator('a.remove_item:visible').count());
 await b.close();
})();
