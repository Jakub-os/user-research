const L=require('./lib');
const vp=process.argv[2]||'m390';
(async()=>{
 const {b,ctx,p}=await L.launch(vp,null,'sk');
 await p.goto('https://www.expresta.sk/',{waitUntil:'networkidle',timeout:60000});await L.sleep(2000);await L.killPopups(p);
 const menuBtn=p.locator('button.mobile-menu-trigger:visible').first();
 console.log('menu btn',await menuBtn.boundingBox());
 await menuBtn.tap();await L.sleep(1500);
 await L.shot(p,`NAV_sk_${vp}_menu_open`);
 const items=await p.evaluate(()=>[...document.querySelectorAll('a,button')].filter(e=>{const r=e.getBoundingClientRect();return e.offsetParent&&r.width>0&&r.y>=0&&r.y<innerHeight&&e.innerText.trim()}).map(e=>{const r=e.getBoundingClientRect();return e.innerText.replace(/\s+/g,' ').trim().slice(0,35)+' '+Math.round(r.width)+'x'+Math.round(r.height)+' '+(e.href?e.href.replace(location.origin,''):'(btn)')}));
 console.log('VISIBLE ITEMS',items.join('\n'));
 console.log('body scroll locked?',await p.evaluate(()=>getComputedStyle(document.body).overflow+' '+getComputedStyle(document.documentElement).overflow));
 const vis=()=>p.evaluate(()=>[...document.querySelectorAll('a,button')].filter(e=>{const r=e.getBoundingClientRect();return e.offsetParent&&r.x>=0&&r.width>0&&r.y>=0&&r.y<innerHeight&&e.innerText.trim()&&getComputedStyle(e).visibility!=='hidden'}).map(e=>e.innerText.replace(/\s+/g,' ').trim().slice(0,30)+(e.href?' '+e.href.replace(location.origin,''):' (btn)')));
 await p.touchscreen.tap(150,90);await L.sleep(1500);
 console.log('L2 after VŠETKY PRODUKTY',JSON.stringify(await vis()));await L.shot(p,`NAV_sk_${vp}_menu_l2`);
 const tl=p.locator('a.mega-mobile-menu-link').filter({hasText:/^Tlač$/}).first();
 await tl.tap();await L.sleep(2000);console.log('after Tlač tap URL',p.url());console.log('L3',JSON.stringify(await vis()));await L.shot(p,`NAV_sk_${vp}_menu_l3`);
 // search
 await p.goto('https://www.expresta.sk/',{waitUntil:'networkidle'});await L.sleep(1500);await L.killPopups(p);
 await p.locator('button.aa-DetachedSearchButton:visible').first().tap();await L.sleep(1200);
 const s2=p.locator('input.aa-Input:visible, input[type=search]:visible').first();console.log('search input',await s2.count(),await s2.boundingBox().catch(()=>null));
 for(const q of ['letak','plagat','banner','vizitka']){
   await s2.tap();await s2.fill('');await p.keyboard.type(q,{delay:120});await L.sleep(2500);
   const sug=await p.evaluate(()=>[...document.querySelectorAll('[id^=autocomplete] li, .aa-Item, [role=option]')].filter(e=>e.offsetParent).map(e=>{const r=e.getBoundingClientRect();return e.innerText.replace(/\s+/g,' ').trim().slice(0,40)+' h'+Math.round(r.height)+' bottom'+Math.round(r.bottom)}));
   console.log('SEARCH',q,JSON.stringify(sug.slice(0,10)),'count',sug.length,'vh',await p.evaluate(()=>[innerHeight,visualViewport.height]));
   if(q==='letak')await L.shot(p,`NAV_sk_${vp}_search_letak`);
 }
 await s2.fill('plagat');await p.keyboard.press('Enter');await p.waitForLoadState('load');await L.sleep(2500);console.log('Enter plagat ->',p.url());
 await L.shot(p,`NAV_sk_${vp}_search_enter_plagat`);
 await b.close();
})();
