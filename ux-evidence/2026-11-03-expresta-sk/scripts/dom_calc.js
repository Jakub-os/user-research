const L=require('./lib');
(async()=>{
 const {b,p}=await L.launch('desktop');
 await p.goto('https://www.expresta.sk/vizitky',{waitUntil:'networkidle',timeout:60000});
 await L.sleep(2000);
 await p.fill('#amount-value','300');
 const r=await p.evaluate(()=>{const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);const out=[];let n;while(n=w.nextNode()){if(/VYPO/i.test(n.textContent)){const e=n.parentElement;out.push({vis:e.offsetParent!==null,html:e.outerHTML.slice(0,250),par:e.parentElement.outerHTML.slice(0,400)});}}return out;});
 console.log(JSON.stringify(r,null,1));
 await b.close();
})();
