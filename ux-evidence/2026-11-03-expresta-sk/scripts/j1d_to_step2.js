const L=require('./lib');
(async()=>{
 const {b,ctx,p}=await L.launch('desktop');
 await p.goto('https://www.expresta.sk/vizitky',{waitUntil:'networkidle',timeout:60000});
 await L.sleep(2000);
 await p.locator('#next-calculation').click();
 await L.sleep(2500);
 const modal=await p.evaluate(()=>[...document.querySelectorAll('.modal.show')].map(m=>m.innerText.replace(/\s+/g,' ').slice(0,400)));
 console.log('MODAL',modal);
 await L.shot(p,'UX-010_sk_1440_vizitky_after_navrh_click');
 const cont=p.locator('.modal.show').getByText(/POKRAČOVAŤ BEZ/i).first();
 if(await cont.count()){await cont.click();}
 await p.waitForLoadState('networkidle').catch(()=>{});await L.sleep(3000);
 console.log('URL step2',p.url());
 await L.shot(p,'UX-010_sk_1440_vizitky_step2_top');
 const txt=await p.evaluate(()=>document.body.innerText.replace(/\n{2,}/g,'\n').slice(0,2500));
 console.log(txt);
 const btns=await p.$$eval('a,button',els=>els.filter(e=>e.offsetParent).map(e=>(e.innerText||'').trim()+' -> '+(e.href||e.getAttribute('formaction')||'')).filter(t=>t.length>5&&t.length<160));
 console.log(btns.join('\n'));
 await ctx.storageState({path:L.OUT+'scripts/state_vizitky.json'});
 await b.close();
})();
