const L=require('./lib');
const vp=process.argv[2]||'m320';
(async()=>{
 const {b,p}=await L.launch(vp);
 const t0=Date.now();
 await p.goto('https://www.expresta.sk/vizitky',{waitUntil:'networkidle',timeout:60000});
 // wait for newsletter popup
 let popAt=null;
 for(let i=0;i<90;i++){const v=await p.evaluate(()=>{const e=[...document.querySelectorAll('*')].find(x=>x.children.length<3&&/Nezmeškajte tlačiarenské/.test(x.innerText||'')&&x.offsetParent);return !!e;});if(v){popAt=Date.now()-t0;break;}await L.sleep(1000);}
 console.log('newsletter popup visible after ms',popAt);
 await p.evaluate(()=>document.querySelector('#next-calculation').scrollIntoView({block:'center'}));
 await p.locator('#next-calculation').click({force:true});await L.sleep(2500);
 const r=await p.evaluate(()=>{const btn=document.querySelector('#next-design-order-submit');if(!btn)return 'no modal btn';btn.scrollIntoView({block:'center'});const rc=btn.getBoundingClientRect();const el=document.elementFromPoint(rc.x+rc.width/2,rc.y+rc.height/2);
   let n=el,chain=[];for(let i=0;i<6&&n;i++){chain.push(n.tagName+'#'+n.id+'.'+(n.className||'').toString().slice(0,30));n=n.parentElement;}
   return {btnRect:[Math.round(rc.x),Math.round(rc.y),Math.round(rc.width),Math.round(rc.height)],hitIsBtn:el===btn||btn.contains(el),chain};});
 console.log(JSON.stringify(r,null,1));
 await L.shot(p,`UX-005_sk_${vp==='m320'?320:390}_newsletter_over_modal`);
 await b.close();
})();
