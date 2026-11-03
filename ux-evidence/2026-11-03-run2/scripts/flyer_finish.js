const L=require('./lib');
(async()=>{
 const {b,ctx,p}=await L.launch('desktop',null,'sk');
 await p.goto('https://www.expresta.sk/letaky',{waitUntil:'networkidle',timeout:60000});await L.sleep(2500);await L.killPopups(p);
 const st=async l=>{const s=await p.evaluate(()=>{const vis=e=>e&&e.offsetParent!==null;const it=[...document.querySelectorAll('.calc_param_item')].filter(vis).map(e=>e.innerText.replace(/\s+/g,' ').trim().slice(0,60));return {params:it.slice(0,5),price:vis(document.querySelector('#prodPriceTotal'))?document.querySelector('#prodPriceTotal').innerText:'(hidden)',calc:vis([...document.querySelectorAll('button.calculate_price')].find(vis))}});console.log(l,JSON.stringify(s));L.note({j:'FLY',step:l,...s});};
 await st('default');
 await p.locator('[data-bs-target="#additional-params-box"]').first().click();await L.sleep(1500);
 const box=p.locator('#additional-params-box');
 console.log('drawer visible text',(await box.innerText()).replace(/\s+/g,' ').slice(0,900));
 const nothing=await p.evaluate(()=>[...document.querySelectorAll('#additional-params-box .filter-option-inner-inner, #additional-params-box .bootstrap-select button')].filter(e=>e.offsetParent).map(e=>e.innerText.trim()));console.log('visible select labels',nothing);
 await L.shot(p,'FLY_sk_1440_extra_drawer');
 // pick first finishing option (Parciálny UV lak)
 const opt=box.getByText('Parciálny UV lak',{exact:false}).first();
 console.log('UV option count',await opt.count());
 if(await opt.count()){await opt.click().catch(e=>console.log('click err',e.message.slice(0,80)));await L.sleep(2000);
   console.log('after UV click drawer',(await box.innerText()).replace(/\s+/g,' ').slice(0,700));
   console.log('modals',await L.modals(p));await L.shot(p,'FLY_sk_1440_after_uv_click');}
 const filt=box.getByText(/Vyfiltrovať/).first();
 if(await filt.count()){console.log('filter link text',await filt.innerText());await filt.click();await L.sleep(2000);console.log('after filter click visible drawers',await p.evaluate(()=>[...document.querySelectorAll('.offcanvas.show,.modal.show,[id$=-box].show')].map(e=>e.id+': '+e.innerText.replace(/\s+/g,' ').slice(0,500))));await L.shot(p,'FLY_sk_1440_after_filter');}
 await st('after finishing attempts');
 await b.close();
})();
