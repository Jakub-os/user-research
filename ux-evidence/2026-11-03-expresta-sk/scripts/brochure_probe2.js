const L=require('./lib');
(async()=>{
 const {b,p}=await L.launch('desktop');
 await p.goto('https://www.expresta.sk/tlac-brozur',{waitUntil:'networkidle',timeout:60000});await L.sleep(2500);
 const inp=await p.evaluate(()=>{const form=document.querySelector('#next-calculation').closest('form')||document.body;return [...form.querySelectorAll('input')].filter(e=>e.offsetParent&&e.type!=='hidden').map(e=>({type:e.type,name:e.name,id:e.id,val:e.value,min:e.min,max:e.max,step:e.step,onkd:(e.getAttribute('onkeydown')||'').slice(0,60),onblur:(e.getAttribute('onblur')||'').slice(0,80)}));});
 console.log(JSON.stringify(inp,null,0));
 const vaz=await p.evaluate(()=>{const h=[...document.querySelectorAll('*')].find(e=>e.children.length===0&&e.innerText?.trim()==='VÄZBA');let c=h.parentElement;return c.outerHTML.slice(0,1500);});
 console.log(vaz);
 await b.close();
})();
