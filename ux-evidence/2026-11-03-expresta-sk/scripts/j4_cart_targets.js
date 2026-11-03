const L=require('./lib');
(async()=>{
 const {b,p}=await L.launch('m390',L.OUT+'scripts/state_cart.json');
 await p.goto('https://www.expresta.sk/order/shopping-cart',{waitUntil:'networkidle',timeout:60000});await L.sleep(3000);
 const r=await p.evaluate(()=>{const q=document.querySelector('.item-quantity');q.scrollIntoView({block:'center'});const box=q.parentElement;return [...box.parentElement.querySelectorAll('*')].filter(e=>e.offsetParent).map(e=>{const r=e.getBoundingClientRect();return e.tagName+'.'+(e.className||'').toString().slice(0,30)+' "'+(e.innerText||'').trim().slice(0,5)+'" '+Math.round(r.width)+'x'+Math.round(r.height)+' @'+Math.round(r.x)+','+Math.round(r.y)});});
 console.log(r.join('\n'));
 const q=await p.evaluate(()=>{const r=document.querySelector('.item-quantity').getBoundingClientRect();return {x:r.x,y:r.y,h:r.height};});
 await L.shot(p,'UX-007_sk_390_cart_qty_controls');
 await b.close();
})();
