const L=require('./lib');
const doms=process.argv.slice(2);
(async()=>{
 for(const d of doms){
  const {b,ctx,p}=await L.launch('desktop',null,d);
  try{
   const r=await p.goto('https://www.expresta.'+d,{waitUntil:'domcontentloaded',timeout:60000});
   await p.waitForLoadState('networkidle',{timeout:20000}).catch(()=>{});await L.sleep(2500);
   console.log('=== '+d,r.status(),p.url(), 'lang=',await p.evaluate(()=>document.documentElement.lang), 'title=',await p.title());
   const cons=await p.evaluate(()=>[...document.querySelectorAll('button,a')].filter(e=>e.offsetParent&&/cookie|accept|akzept|elfogad|souhlas|prijať|zustimm/i.test(e.innerText||'')).map(e=>e.innerText.trim().slice(0,50)));
   console.log('consent-ish',cons);
   const links=await p.$$eval('a',as=>[...new Set(as.filter(a=>a.href.includes(location.host)).map(a=>a.pathname))].slice(0,400));
   console.log('links',links.filter(l=>/vizit|card|karte|kartya|kártya|letak|flyer|banner|plakat|poster|brosch|brozur|broz|szorol|plak/i.test(l)).join(' '));
   await L.shot(p,`RECON_${d}_1440_home`);
  }catch(e){console.log(d,'ERR',e.message.slice(0,200));}
  await b.close();
 }
})();
