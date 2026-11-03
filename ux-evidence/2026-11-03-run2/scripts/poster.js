const L=require('./lib');
(async()=>{
 const {b,ctx,p}=await L.launch('desktop',null,'sk');
 await p.goto('https://www.expresta.sk/plagaty',{waitUntil:'networkidle',timeout:60000});await L.sleep(2500);await L.killPopups(p);
 console.log('URL',p.url());
 await p.evaluate(()=>document.querySelector('[data-bs-target="#size-box"]').scrollIntoView({block:'start'}));
 await p.locator('[data-bs-target="#size-box"]').first().click();await L.sleep(1500);
 const sz=await p.evaluate(()=>{const b=document.querySelector('#size-box');return {txt:b.innerText.replace(/\s+/g,' ').slice(0,900),inputs:[...b.querySelectorAll('input')].map(i=>i.type+':'+i.name+':'+i.id+' min='+i.min+' max='+i.max+' ph='+i.placeholder+' vis='+(i.offsetParent!==null))}});
 console.log(JSON.stringify(sz,null,1));
 await L.shot(p,'POS_sk_1440_size_drawer');
 await b.close();
})();
