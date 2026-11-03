const L=require('./lib');
(async()=>{
 const {b,p}=await L.launch('desktop',L.OUT+'scripts/state_vizitky.json');
 await p.goto('https://www.expresta.sk/order/product/vizitky-variation/upload?c=6ae98cca60058640517276',{waitUntil:'networkidle',timeout:60000});
 await L.sleep(2500);
 await p.locator('input[type=file][name=upload_file]').first().setInputFiles(L.OUT+'testfiles/fake_pdf_actually_text.pdf');
 await L.sleep(9000);
 const toast=await p.evaluate(()=>[...document.querySelectorAll('*')].filter(e=>e.children.length<3&&/DÁTA DODÁM NESKÔR/.test(e.innerText||'')&&e.offsetParent).map(e=>e.className+' :: '+e.innerText.slice(0,80)));
 console.log('TOAST',toast);
 // dismiss toast to reveal modal
 await p.locator('.toast .btn-close, .toast-close-button, [class*=toast] button').first().click().catch(e=>console.log('noToastClose'));
 await L.sleep(800);
 const m=p.locator('.modal.show .modal-content').first();
 console.log('modal text:',await m.innerText().catch(()=>'none'));
 await L.shot(p,'UX-004_sk_1440_vizitky_upload_corruptpdf_modal_en');
 // does DÁTA DODÁM NESKÔR exist on step2?
 await p.goto('https://www.expresta.sk/order/product/vizitky-variation/templates?c=6ae98cca60058640517276',{waitUntil:'networkidle'});
 await L.sleep(2000);
 console.log('step2 has DÁTA DODÁM NESKÔR:', await p.evaluate(()=>/DÁTA DODÁM NESKÔR/i.test(document.body.innerText)));
 await L.shot(p,'UX-004_sk_1440_vizitky_step2_no_data_later_option');
 await b.close();
})();
