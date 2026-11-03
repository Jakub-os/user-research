const L=require('./lib');
(async()=>{
 const {b,p}=await L.launch('desktop');
 await p.goto('https://www.expresta.sk/vizitky',{waitUntil:'networkidle',timeout:60000});
 await L.sleep(2000);
 const h=await p.evaluate(()=>{const e=[...document.querySelectorAll('*')].filter(e=>/31,21/.test(e.textContent)&&e.children.length===0);return e.map(x=>x.outerHTML.slice(0,200)+' | parent: '+x.parentElement.outerHTML.slice(0,600));});
 console.log(h.join('\n---\n'));
 await p.fill('#amount-value','300'); await p.locator('#amount-value').press('Tab'); await L.sleep(1000);
 const v=await p.evaluate(()=>[...document.querySelectorAll('*')].filter(e=>e.children.length<2&&/VYPOČÍTAŤ/.test(e.textContent)&&e.offsetParent).map(e=>e.outerHTML.slice(0,300)));
 console.log('CALC',v);
 // delivery and speed selects
 const sel=await p.evaluate(()=>[...document.querySelectorAll('select')].map(s=>({id:s.id,name:s.name,opts:[...s.options].map(o=>(o.selected?'*':'')+o.text.trim()+' ['+o.value+']')})));
 console.log(JSON.stringify(sel,null,1).slice(0,6000));
 await b.close();
})();
