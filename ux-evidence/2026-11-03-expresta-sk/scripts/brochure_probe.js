const L=require('./lib');
(async()=>{
 const {b,p}=await L.launch('desktop');
 await p.goto('https://www.expresta.sk/tlac-brozur',{waitUntil:'networkidle',timeout:60000});await L.sleep(2500);
 console.log(p.url(),await p.title());
 const calc=await p.evaluate(()=>{const btn=document.querySelector('#next-calculation');if(!btn)return 'NO CALC';let c=btn;for(let i=0;i<7&&c;i++)c=c.parentElement;return c.innerText.replace(/\n{2,}/g,'\n').slice(0,1500);});
 console.log(calc);
 const sel=await p.$$eval('select',els=>els.filter(s=>s.closest('form, .calculator, [class*=calc]')).map(s=>({id:s.id,name:s.name,vis:!!(s.offsetParent||s.nextElementSibling?.offsetParent),opts:[...s.options].map(o=>(o.selected?'*':'')+o.text.trim()).slice(0,25)})).filter(s=>s.opts.length));
 console.log(JSON.stringify(sel,null,0).slice(0,5000));
 await p.evaluate(()=>document.querySelector('#next-calculation')?.scrollIntoView({block:'center'}));
 await L.shot(p,'UX-080_sk_1440_brozury_calc_default');
 await b.close();
})();
