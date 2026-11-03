const L=require('./lib');
(async()=>{
 const {b,p}=await L.launch('desktop');
 for(const q of ['brožúra','brozura','letak','katalóg','vizitka']){
  await p.goto('https://www.expresta.sk/',{waitUntil:'networkidle',timeout:60000});await L.sleep(1500);
  const s=p.locator('#autocomplete-0-input');await s.click();await s.pressSequentially(q,{delay:120});await L.sleep(2000);
  const sugg=await p.evaluate(()=>[...document.querySelectorAll('.aa-Item, [role=option]')].filter(e=>e.offsetParent).map(e=>e.innerText.replace(/\s+/g,' ').trim()).slice(0,8));
  await L.shot(p,'UX-110_sk_1440_search_'+q.normalize('NFD').replace(/[^\w]/g,''));
  await p.keyboard.press('Enter');await L.sleep(3000);
  console.log(JSON.stringify(q),'sugg:',JSON.stringify(sugg),'-> enter:',p.url(),await p.title());
  L.note({j:'search',q,sugg,enterUrl:p.url()});
 }
 await b.close();
})();
