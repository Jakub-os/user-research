const L=require('./lib');
(async()=>{
 const {b,p}=await L.launch('desktop');
 await p.goto('https://www.expresta.sk/vizitky',{waitUntil:'networkidle',timeout:60000});await L.sleep(2500);
 await p.evaluate(()=>document.querySelector('#next-calculation').scrollIntoView({block:'center'}));
 const btn=p.locator('.calc_select_button').filter({hasText:/Slovensko/}).first();
 console.log('cnt',await btn.count());
 await btn.click();await L.sleep(2000);
 const t=await p.evaluate(()=>{const o=[...document.querySelectorAll('.nl-slide.show, .nl_slide.show, [class*=slide][class*=show], .offcanvas.show')].map(e=>e.innerText.replace(/\n{2,}/g,'\n').slice(0,1500));return o;});
 console.log(t);
 await L.shot(p,'UX-140_sk_1440_vizitky_delivery_drawer');
 // speed dropdown
 await p.keyboard.press('Escape');await L.sleep(800);
 await b.close();
})();
