const L=require('./lib');
const TF=L.OUT+'testfiles/';
(async()=>{
 const {b,ctx,p}=await L.launch('desktop',L.OUT+'scripts/state_vizitky.json');
 await p.goto('https://www.expresta.sk/order/product/vizitky-variation/upload?c=6ae98cca60058640517276',{waitUntil:'networkidle',timeout:60000});
 await L.sleep(3000);
 console.log('URL',p.url());
 await L.shot(p,'UX-020_sk_1440_vizitky_upload_initial');
 const txt=await p.evaluate(()=>document.querySelector('main, #main-content, body').innerText.replace(/\n{2,}/g,'\n').slice(0,3000));
 console.log(txt);
 const inputs=await p.$$eval('input[type=file]',els=>els.map(e=>({name:e.name,id:e.id,accept:e.accept,multiple:e.multiple,vis:e.offsetParent!==null})));
 console.log('FILE INPUTS',JSON.stringify(inputs));
 await ctx.storageState({path:L.OUT+'scripts/state_vizitky.json'});
 await b.close();
})();
