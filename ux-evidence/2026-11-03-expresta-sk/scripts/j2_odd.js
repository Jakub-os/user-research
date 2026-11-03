const L=require('./lib');
(async()=>{
 const {b,p}=await L.launch('desktop');
 await p.goto('https://www.expresta.sk/tlac-brozur',{waitUntil:'networkidle',timeout:60000});await L.sleep(2500);
 await p.evaluate(()=>document.querySelector('#pages-value').scrollIntoView({block:'center'}));
 await p.locator('#pages-value').click({clickCount:3});await p.keyboard.press('Delete');await p.keyboard.type('37');await p.keyboard.press('Tab');await L.sleep(1500);
 const reqs=[];p.on('request',r=>{if(/expresta/.test(r.url())&&!/\.(png|jpg|svg|css|js|woff)/.test(r.url()))reqs.push(r.method()+' '+r.url().slice(0,100));});
 await p.locator('button.calculate_price:visible').first().click();
 const seen=new Set();
 for(let i=0;i<25;i++){await L.sleep(200);const t=await p.evaluate(()=>[...document.querySelectorAll('.tooltip,.popover,.toast,.alert,.modal.show,[role=alert]')].filter(e=>e.offsetParent!==null||e.classList.contains('show')).map(e=>e.innerText.replace(/\s+/g,' ').trim()).filter(Boolean).join(' || '));if(t)seen.add(t);
   if(i===3)await L.shot(p,'UX-006_sk_1440_brozury_37pages_after_calc_click');}
 console.log('messages seen within 5s:',[...seen]);
 console.log('requests',reqs.slice(0,10));
 console.log('pageerrors',p._errs.filter(e=>!/google|facebook|403|StorageAccess/.test(e)));
 // try NÁVRH A OBJEDNÁVKA
 await p.locator('#next-calculation').click();await L.sleep(4000);
 console.log('after NAVRH url',p.url(),await p.evaluate(()=>[...document.querySelectorAll('.modal.show,.tooltip')].map(m=>m.innerText.replace(/\s+/g,' ').slice(0,200))));
 await L.shot(p,'UX-006_sk_1440_brozury_37pages_after_navrh_click');
 await b.close();
})();
