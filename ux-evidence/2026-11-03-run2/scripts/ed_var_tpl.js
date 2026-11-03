const L=require('./lib');
(async()=>{
 for(let i=0;i<12;i++){
  const {b,ctx,p}=await L.launch('desktop',null,'sk');
  await p.goto('https://www.expresta.sk/vizitky',{waitUntil:'networkidle',timeout:60000});await L.sleep(1000);
  if(!p.url().includes('variation')){await b.close();continue;}
  console.log('variation found at try',i);await L.killPopups(p);
  await p.locator('#next-calculation').click();await L.sleep(2500);
  if(await p.locator('#next-design-order-submit:visible').count())await p.locator('#next-design-order-submit:visible').click();
  await p.waitForURL(/templates/,{timeout:30000});await L.sleep(2500);await L.killPopups(p);
  const step2=p.url();
  for(const k of [0,4]){
   await p.goto(step2,{waitUntil:'load'});await L.sleep(2500);await L.killPopups(p);
   const href=await p.evaluate(k=>{const a=[...document.querySelectorAll('a')].filter(a=>/\/studio\//.test(a.href)&&/UPRAVI/.test(a.innerText));a[k].scrollIntoView();return a[k].getAttribute('href')},k);
   await L.sleep(800);
   const [resp]=await Promise.all([p.waitForResponse(r=>r.url().includes('/studio/')&&r.request().resourceType()==='document',{timeout:30000}).catch(()=>null),p.evaluate(k=>{[...document.querySelectorAll('a')].filter(a=>/\/studio\//.test(a.href)&&/UPRAVI/.test(a.innerText))[k].click()},k)]);
   await p.waitForLoadState('load').catch(()=>{});await L.sleep(8000);
   const fr=p.frame({name:'app_iframe'});const ft=fr?await fr.evaluate(()=>document.body.innerText.replace(/\s+/g,' ').slice(0,160)).catch(()=>''):'';
   console.log('tpl',k,href.split('/studio/')[1].slice(0,50),'status',resp&&resp.status(),'title',(await p.title()).slice(0,40),'| editor:',ft);
   await L.shot(p,`ED_sk_desktop_variation_tpl${k}`);
  }
  await b.close();break;
 }
})();
