const L=require('./lib');
const vp=process.argv[2]||'desktop';
(async()=>{
 const {b,ctx,p}=await L.launch(vp,null,'sk');
 await p.goto('https://www.expresta.sk/vizitky',{waitUntil:'networkidle',timeout:60000});await L.sleep(2000);await L.killPopups(p);
 console.log('PDP',p.url());
 await p.locator('#next-calculation').click();await L.sleep(2500);
 if(await p.locator('#next-design-order-submit:visible').count())await p.locator('#next-design-order-submit:visible').click();
 await p.waitForURL(/templates/,{timeout:30000});await L.sleep(3000);await L.killPopups(p);
 console.log('STEP2',p.url());
 const opts=await p.evaluate(()=>[...document.querySelectorAll('a,button')].filter(e=>e.offsetParent&&e.innerText.trim()).map(e=>e.innerText.replace(/\s+/g,' ').trim().slice(0,60)+' -> '+(e.href||e.getAttribute('data-bs-target')||'')).slice(10,60));
 console.log(opts.join('\n'));
 await L.shot(p,`ED_sk_${vp}_step2`,true);
 await ctx.storageState({path:L.OUT+'scripts/state_ed.json'});
 await b.close();
})();
