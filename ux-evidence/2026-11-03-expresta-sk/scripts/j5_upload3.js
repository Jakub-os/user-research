const L=require('./lib');
const TF=L.OUT+'testfiles/';
const [f,tag]=[process.argv[2],process.argv[3]];
(async()=>{
 const {b,ctx,p}=await L.launch('desktop',L.OUT+'scripts/state_vizitky.json');
 p.on('response',r=>{if(r.status()>=400)console.log('HTTP',r.status(),r.url().slice(0,140));});
 await p.goto('https://www.expresta.sk/order/product/vizitky-variation/upload?c=6ae98cca60058640517276',{waitUntil:'networkidle',timeout:60000});
 await L.sleep(2500);
 const pre=await p.evaluate(()=>[...document.querySelectorAll('.modal.show')].length);
 console.log('modals before',pre);
 const t0=Date.now();
 await p.locator('input[type=file][name=upload_file]').first().setInputFiles(TF+f);
 let s;
 for(let i=0;i<40;i++){await L.sleep(1000);
   s=await p.evaluate(()=>{const vis=e=>e.offsetParent!==null;const up=document.querySelector('input[type=file][name=upload_file]').closest('div[class*=upload], .row, section')||document.body;
    return {modals:[...document.querySelectorAll('.modal.show')].map(m=>m.innerText.replace(/\s+/g,' ').trim().slice(0,400)),
     uploadArea:(()=>{const h=[...document.querySelectorAll('*')].find(e=>e.children.length<3&&e.innerText&&e.innerText.trim()==='Predná strana');let c=h;for(let k=0;k<3&&c;k++)c=c.parentElement;return c?c.innerText.replace(/\s+/g,' ').slice(0,500):'';})(),
     warnings:[...document.querySelectorAll('.text-danger,.warning,.alert,[class*=warn],[class*=error]')].filter(vis).map(e=>e.innerText.replace(/\s+/g,' ').trim().slice(0,200)).filter(Boolean)};});
   if(s.modals.length|| /Zmazať/.test(s.uploadArea)) {if(i>2)break;}
 }
 console.log('t',Date.now()-t0,JSON.stringify(s,null,1));
 L.note({j:'J5-upload-fresh',file:f,...s});
 await p.evaluate(()=>{const h=[...document.querySelectorAll('*')].find(e=>e.innerText&&e.innerText.trim()==='Nahrať grafický návrh');h&&h.scrollIntoView({block:'start'});});
 await L.sleep(500);
 await L.shot(p,'UX-020_sk_1440_vizitky_upload_fresh_'+tag);
 await b.close();
})();
