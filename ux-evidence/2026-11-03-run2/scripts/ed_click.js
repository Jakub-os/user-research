const L=require('./lib');
const [vp,which,tag]=process.argv.slice(2); // which: index of UPRAVIŤ, or 'create'
(async()=>{
 const {b,ctx,p}=await L.launch(vp,null,'sk');
 p.on('response',r=>{if(r.status()>=400&&/expresta\.sk/.test(r.url()))console.log('HTTP',r.status(),r.url().slice(0,140));});
 await p.goto('https://www.expresta.sk/vizitky',{waitUntil:'networkidle',timeout:60000});await L.sleep(2000);await L.killPopups(p);
 await p.locator('#next-calculation').click();await L.sleep(2500);
 if(await p.locator('#next-design-order-submit:visible').count())await p.locator('#next-design-order-submit:visible').click();
 await p.waitForURL(/templates/,{timeout:30000});await L.sleep(3000);await L.killPopups(p);
 const step2=p.url();
 const loc= which==='create'? p.getByText('VYTVORIŤ A OBJEDNAŤ').first() : p.locator('a:visible').filter({hasText:/^\s*UPRAVIŤ\s*$/}).nth(+which);
 const href=await loc.evaluate(e=>(e.closest('a')||e).getAttribute('href')+' tag='+e.tagName);console.log('clicking',href);
 await loc.scrollIntoViewIfNeeded();await loc.click();
 await p.waitForLoadState('load',{timeout:60000}).catch(()=>{});await p.waitForLoadState('networkidle',{timeout:30000}).catch(()=>{});await L.sleep(8000);await L.killPopups(p);
 console.log('URL',p.url(),'title',await p.title());
 const h1=await p.evaluate(()=>[...document.querySelectorAll('h1,h2')].map(e=>e.innerText.trim()).slice(0,5));console.log('H',h1);
 await L.shot(p,`ED_sk_${vp}_${tag}`);
 await ctx.storageState({path:L.OUT+'scripts/state_ed.json'});
 require('fs').writeFileSync(L.OUT+'scripts/ed_last_url.txt',p.url()+'\n'+step2);
 await b.close();
})();
