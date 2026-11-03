const L=require('./lib');const E=require('./ed_lib');
const vp=process.argv[2]||'m390';
(async()=>{
 for(let t=0;t<6;t++){
 const {b,ctx,p}=await L.launch(vp,null,'sk');
 p.on('dialog',async d=>{console.log('DIALOG',d.type());await d.accept();});
 await p.goto('https://www.expresta.sk/vizitky',{waitUntil:'networkidle',timeout:60000});await L.sleep(1500);
 if(p.url().includes('variation')){await b.close();continue;}
 await L.killPopups(p);
 await p.locator('#next-calculation').click();await L.sleep(2500);
 if(await p.locator('#next-design-order-submit:visible').count())await p.locator('#next-design-order-submit:visible').click();
 await p.waitForURL(/templates/,{timeout:30000});await L.sleep(2500);await L.killPopups(p);
 const cta=p.getByText('VYTVORIŤ A OBJEDNAŤ').first();await cta.scrollIntoViewIfNeeded();
 const r=await cta.boundingBox();console.log('CTA box',r);
 await L.shot(p,`ED_sk_${vp}_step2_cta`);
 await cta.click();await p.waitForLoadState('load');const f=await E.frame(p);await L.sleep(8000);await L.killPopups(p);
 console.log('URL',p.url().slice(0,120));
 await L.shot(p,`ED_sk_${vp}_editor`);
 const c=await E.controls(p,f);
 for(const x of c)console.log(`${x.tag} "${x.t}" ${x.x},${x.y} ${x.w}x${x.h}${x.dis?' DIS':''}${x.coveredBy?' COVERED-BY '+x.coveredBy:''}`);
 console.log('hscroll',await p.evaluate(()=>[document.documentElement.scrollWidth,innerWidth]));
 const help=await p.evaluate(()=>{const e=document.querySelector('.editor-icon-container');if(!e)return null;const r=e.getBoundingClientRect();return [r.x,r.y,r.width,r.height,getComputedStyle(e).display]});console.log('help bubble',help);
 const chat=await p.evaluate(()=>[...document.querySelectorAll('iframe,div')].filter(e=>/ladesk|chat/i.test((e.id||'')+(e.className||'')+(e.src||''))&&e.getBoundingClientRect().width>30).map(e=>{const r=e.getBoundingClientRect();return e.tagName+'#'+e.id+' '+[r.x,r.y,r.width,r.height].map(Math.round)}));console.log('chat',chat);
 await b.close();break;}
})();
