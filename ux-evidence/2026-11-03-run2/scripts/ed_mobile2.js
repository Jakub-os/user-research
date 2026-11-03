const L=require('./lib');
(async()=>{
 for(let t=0;t<6;t++){
 const {b,ctx,p}=await L.launch('m390',null,'sk');
 p.on('dialog',async d=>{console.log('DIALOG',d.type());await d.accept();});
 await p.goto('https://www.expresta.sk/vizitky',{waitUntil:'networkidle',timeout:60000});await L.sleep(1500);
 if(p.url().includes('variation')){await b.close();continue;}
 await L.killPopups(p);
 await p.locator('#next-calculation').click();await L.sleep(2500);
 if(await p.locator('#next-design-order-submit:visible').count())await p.locator('#next-design-order-submit:visible').click();
 await p.waitForURL(/templates/,{timeout:30000});await L.sleep(2500);await L.killPopups(p);
 await p.getByText('VYTVORIŤ A OBJEDNAŤ').first().click();await p.waitForLoadState('load');await L.sleep(12000);await L.killPopups(p);
 let f=null;for(const fr of p.frames()){const n=await fr.evaluate(()=>document.querySelectorAll('button').length).catch(()=>0);if(n>1&&fr!==p.mainFrame()&&/Pridanie|Moje/.test(await fr.evaluate(()=>document.body.innerText).catch(()=>'')))f=fr;}
 console.log('frames',p.frames().map(x=>x.name()+'|'+x.url().slice(0,40)).join(' ; '));f=p.frame({name:'app_iframe'});console.log('app_iframe',!!f);
 const btns=async()=>!f?['noframe']:f.evaluate(()=>[...document.querySelectorAll('button,[role=button]')].filter(e=>e.getClientRects().length).map(e=>{const r=e.getBoundingClientRect();return `"${(e.innerText||e.getAttribute('aria-label')||e.title||'').replace(/\s+/g,' ').trim().slice(0,25)}" ${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)}`}));
 console.log('BUTTONS photo panel',(await btns()).join(' ; '));
 // close panel with back arrow
 await p.mouse.click(31,26);await L.sleep(2500);
 await L.shot(p,'ED_sk_m390_after_back_arrow');
 console.log('URL',p.url().slice(0,100));
 console.log('BUTTONS after',(await btns().catch(()=>['n/a'])).join(' ; '));
 const bottom=await f.evaluate(()=>[...document.querySelectorAll('*')].filter(e=>{if(!e.getClientRects().length||e.children.length>2)return false;const r=e.getBoundingClientRect();return r.y>740&&(e.innerText||'').trim().length>1&&(e.innerText||'').trim().length<20}).map(e=>{const r=e.getBoundingClientRect();return e.innerText.trim()+' @'+Math.round(r.x)+','+Math.round(r.y)+' '+Math.round(r.width)+'x'+Math.round(r.height)}));console.log('BOTTOM ITEMS',JSON.stringify(bottom));
 for(const [x,y] of [[340,800],[344,790],[300,800]]) console.log('top at',x,y,await p.evaluate(([x,y])=>{const e=document.elementFromPoint(x,y);return e.tagName+'#'+e.id+'.'+(e.className||'').toString().slice(0,30)},[x,y]));
 const hasText=await f.evaluate(()=>/\bText\b/.test(document.body.innerText));console.log('frame contains Text tool label',hasText);
 // swipe bottom nav left to reveal more
 await f.evaluate(()=>{const n=[...document.querySelectorAll('*')].find(e=>/Nálepky/.test(e.innerText||'')&&e.scrollWidth>e.clientWidth+5);if(n){n.scrollLeft=500;}});await L.sleep(800);
 await L.shot(p,'ED_sk_m390_bottom_scrolled');
 const bottom2=await f.evaluate(()=>[...document.querySelectorAll('*')].filter(e=>{if(!e.getClientRects().length||e.children.length>2)return false;const r=e.getBoundingClientRect();return r.y>740&&(e.innerText||'').trim().length>1&&(e.innerText||'').trim().length<20}).map(e=>{const r=e.getBoundingClientRect();return e.innerText.trim()+' @'+Math.round(r.x)+','+Math.round(r.y)}));console.log('BOTTOM ITEMS after scroll',JSON.stringify(bottom2));
 // open hamburger
 await p.mouse.click(333,28);await L.sleep(2000);await L.shot(p,'ED_sk_m390_menu');
 console.log('frame text menu',(await f.evaluate(()=>document.body.innerText.replace(/\s+/g,' ').slice(0,400)).catch(()=>'')));
 const help=await p.evaluate(()=>{const e=document.querySelector('.editor-icon-container');if(!e)return null;const r=e.getBoundingClientRect();return [r.x,r.y,r.width,r.height].map(Math.round)});console.log('help bubble',help);
 console.log('hscroll',await p.evaluate(()=>[document.documentElement.scrollWidth,innerWidth]));
 await b.close();break;}
})();
