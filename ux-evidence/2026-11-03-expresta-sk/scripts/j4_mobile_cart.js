const L=require('./lib');
const vp=process.argv[2];const W=vp==='m390'?390:320;
(async()=>{
 const {b,p}=await L.launch(vp,L.OUT+'scripts/state_cart.json');
 const ov=async(l)=>{const r=await p.evaluate(()=>{const de=document.documentElement;const small=[...document.querySelectorAll('main a, main button, main input, main select, main [role=button], main label')].filter(e=>e.offsetParent).map(e=>{const r=e.getBoundingClientRect();return {t:(e.innerText||e.getAttribute('aria-label')||e.className||'').toString().trim().slice(0,25),w:Math.round(r.width),h:Math.round(r.height)}}).filter(x=>x.h>0&&(x.h<32||x.w<32)).slice(0,10);return {sw:de.scrollWidth,iw:innerWidth,overflow:de.scrollWidth>innerWidth,small};});console.log(l,JSON.stringify(r));L.note({j:'J4-cart-'+vp,step:l,...r});};
 await p.goto('https://www.expresta.sk/order/shopping-cart',{waitUntil:'networkidle',timeout:60000});await L.sleep(3000);
 await ov('cart');await L.shot(p,`UX-120_sk_${W}_cart`,true);
 await p.locator('a:visible,button:visible').filter({hasText:/POKRAČOVAŤ K OBJEDNÁVKE/i}).first().click();await p.waitForLoadState('networkidle');await L.sleep(3000);
 await ov('delivery');await L.shot(p,`UX-121_sk_${W}_delivery`,true);
 await b.close();
})();
