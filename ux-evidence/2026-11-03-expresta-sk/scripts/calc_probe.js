const L=require('./lib');
(async()=>{
 const {b,p}=await L.launch('desktop');
 await p.goto('https://www.expresta.sk/vizitky',{waitUntil:'networkidle',timeout:60000});
 await L.sleep(2000);
 await p.evaluate(()=>window.scrollTo(0,250));
 await L.shot(p,'UX-000_sk_1440_vizitky_calc_default');
 // dump calculator container text
 const calc=await p.evaluate(()=>{const btn=document.querySelector('#next-calculation');let c=btn;for(let i=0;i<8&&c;i++)c=c.parentElement;return c?c.innerText.slice(0,3000):'';});
 console.log(calc);
 // all dropdown-like elements (custom)
 const labels=await p.$$eval('label, .calculator-label, h3, h4',els=>els.filter(e=>e.offsetParent).map(e=>e.innerText.trim()).filter(t=>t&&t.length<50).slice(0,80));
 console.log('LABELS',JSON.stringify(labels));
 await b.close();
})();
