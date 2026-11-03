const L=require('./lib');
(async()=>{
 const {b,ctx,p}=await L.launch('desktop',L.OUT+'scripts/state_vizitky.json');
 await p.goto('https://www.expresta.sk/order/product/vizitky-variation/upload?c=6ae98cca60058640517276',{waitUntil:'networkidle',timeout:60000});
 await L.sleep(2500);
 const inp=()=>p.locator('input[type=file][name=upload_file]').first();
 await inp().setInputFiles(L.OUT+'testfiles/lowres_60x33px_TEST.png');
 await p.waitForSelector('text=Zmazať',{timeout:30000});await L.sleep(1500);
 // replace: Zmazať then upload ok pdf
 await p.getByText('Zmazať').first().click(); await L.sleep(2000);
 const confirmM=await p.evaluate(()=>[...document.querySelectorAll('.modal.show')].map(m=>m.innerText.replace(/\s+/g,' ').slice(0,200)));
 console.log('after Zmazať modals',confirmM);
 const yes=p.locator('.modal.show button').filter({hasText:/ÁNO|Áno|Zmazať|OK/}).first();
 if(await yes.count()){await yes.click();await L.sleep(1500);}
 console.log('upload box after delete:',await p.evaluate(()=>/Nahrať súbor/.test(document.body.innerText)));
 await inp().setInputFiles(L.OUT+'testfiles/test_vizitka_96x56mm_TEST.pdf');
 await p.waitForSelector('text=Zmazať',{timeout:30000});await L.sleep(1500);
 await p.locator('textarea:visible').nth(1).fill('TEST UX prieskum – testovacia položka, neobjednávať').catch(e=>console.log('ta',e.message.slice(0,80)));
 await L.shot(p,'UX-030_sk_1440_vizitky_upload_ok_before_cart');
 await p.locator('button:visible, a:visible').filter({hasText:/pridať do košíka/i}).first().click();
 await L.sleep(3000);
 const mod=await p.evaluate(()=>[...document.querySelectorAll('.modal.show')].map(m=>m.innerText.replace(/\s+/g,' ').slice(0,300)));
 console.log('modals after add',mod);
 if(mod.length){await L.shot(p,'UX-030_sk_1440_vizitky_modal_after_add');const c=p.locator('.modal.show').getByText(/POKRAČOVAŤ BEZ/i).first(); if(await c.count()) await c.click();}
 await p.waitForLoadState('networkidle').catch(()=>{});await L.sleep(4000);
 console.log('URL',p.url());
 await L.shot(p,'UX-030_sk_1440_cart_after_add',true);
 console.log((await p.evaluate(()=>document.querySelector('main,#main-content')?.innerText||document.body.innerText)).replace(/\n{2,}/g,'\n').slice(0,3000));
 await ctx.storageState({path:L.OUT+'scripts/state_cart.json'});
 console.log('ERRS',p._errs.filter(e=>!/google|facebook|403|StorageAccess/.test(e)));
 await b.close();
})();
