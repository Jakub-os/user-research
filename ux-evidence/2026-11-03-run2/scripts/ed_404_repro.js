const L=require('./lib');
const N=+process.argv[2]||6; const vp=process.argv[3]||'desktop';
(async()=>{
 const res=[];
 for(let i=0;i<N;i++){
  const {b,ctx,p}=await L.launch(vp,null,'sk');
  try{
   await p.goto('https://www.expresta.sk/vizitky',{waitUntil:'networkidle',timeout:60000});await L.sleep(1500);await L.killPopups(p);
   const variant=new URL(p.url()).pathname;
   await p.locator('#next-calculation').click();await L.sleep(2500);
   if(await p.locator('#next-design-order-submit:visible').count())await p.locator('#next-design-order-submit:visible').click();
   await p.waitForURL(/templates/,{timeout:30000});await L.sleep(2500);await L.killPopups(p);
   const step2=p.url();
   const cta=p.getByText('VYTVORIŤ A OBJEDNAŤ').first();const href=await cta.evaluate(e=>(e.closest('a')||e).getAttribute('href'));
   let status=null;p.on('response',r=>{if(r.url().includes('/studio/')&&r.request().resourceType()==='document')status=r.status();});
   await cta.scrollIntoViewIfNeeded();await cta.click();await p.waitForLoadState('load',{timeout:60000}).catch(()=>{});await L.sleep(4000);
   const title=await p.title();
   const r={i,variant,href,status,title:title.slice(0,40),url:p.url().slice(0,110)};
   if(status===404&&!res.some(x=>x.status===404)){await L.shot(p,`ED_sk_${vp}_create_404`);}
   // also try a template UPRAVIŤ link on same step2
   await p.goto(step2,{waitUntil:'load'});await L.sleep(2500);await L.killPopups(p);
   let st2=null;p.on('response',rr=>{if(rr.url().includes('/studio/')&&rr.request().resourceType()==='document')st2=rr.status();});
   const tpl=p.locator('a:visible').filter({hasText:/^\s*UPRAVIŤ\s*$/}).first();
   if(await tpl.count()){r.tplHref=(await tpl.getAttribute('href')).split('/studio/')[1].slice(0,40);await tpl.click();await p.waitForLoadState('load',{timeout:60000}).catch(()=>{});await L.sleep(3000);r.tplStatus=st2;}
   console.log(JSON.stringify(r));res.push(r);L.note({j:'ED-404',vp,...r});
  }catch(e){console.log(i,'ERR',e.message.split('\n')[0]);}
  await b.close();
 }
 const v=res.filter(r=>r.variant.includes('variation'));
 console.log('SUMMARY variation runs',v.length,'404s',v.filter(r=>r.status===404).length,'| control runs',res.length-v.length,'404s',res.filter(r=>!r.variant.includes('variation')&&r.status===404).length);
})();
