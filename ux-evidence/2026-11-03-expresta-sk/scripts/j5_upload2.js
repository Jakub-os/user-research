const L=require('./lib');
const TF=L.OUT+'testfiles/';
(async()=>{
 const {b,ctx,p}=await L.launch('desktop',L.OUT+'scripts/state_vizitky.json');
 const reqs=[];p.on('response',r=>{if(/upload/i.test(r.url())&&r.request().method()==='POST')reqs.push(r.status()+' '+r.url().slice(0,120));});
 await p.goto('https://www.expresta.sk/order/product/vizitky-variation/upload?c=6ae98cca60058640517276',{waitUntil:'networkidle',timeout:60000});
 await L.sleep(2500);
 const area=async()=>p.evaluate(()=>{const h=[...document.querySelectorAll('*')].find(e=>e.innerText&&e.innerText.trim()==='Nahrať grafický návrh');let c=h;for(let i=0;i<2;i++)c=c.parentElement;
   const vis=e=>e.offsetParent!==null;
   const modals=[...document.querySelectorAll('.modal.show,.swal2-popup,.toast.show,.alert:not(.d-none)')].filter(vis).map(m=>m.innerText.replace(/\s+/g,' ').trim().slice(0,300));
   return {area:c.innerText.replace(/\s+/g,' ').slice(0,600),modals};});
 const files=[['fake_pdf_actually_text.pdf','fakepdf'],['test_note.txt','txt'],['lowres_60x33px_TEST.png','lowres'],['test_A4_wrong_size_TEST.pdf','a4'],['test_vizitka_96x56mm_TEST.pdf','okpdf']];
 for(const [f,tag] of files){
   const inp=p.locator('input[type=file][name=upload_file]').first();
   await inp.setInputFiles(TF+f);
   await L.sleep(8000);
   const s=await area();
   console.log('FILE',f,'\n',JSON.stringify(s,null,1));
   L.note({j:'J5-upload',file:f,...s});
   await p.evaluate(()=>{const h=[...document.querySelectorAll('*')].find(e=>e.innerText&&e.innerText.trim()==='Nahrať grafický návrh');h&&h.scrollIntoView({block:'start'});});
   await L.shot(p,'UX-020_sk_1440_vizitky_upload_'+tag);
   // close any modal
   const close=p.locator('.modal.show .btn-close, .modal.show [data-bs-dismiss=modal], .swal2-confirm').first();
   if(await close.count()&&await close.isVisible()){await close.click().catch(()=>{});await L.sleep(800);}
 }
 console.log('POSTS',reqs);
 console.log('ERRS',p._errs);
 await ctx.storageState({path:L.OUT+'scripts/state_vizitky.json'});
 await b.close();
})();
