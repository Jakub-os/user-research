const L=require('./lib');const E=require('./ed_lib');
(async()=>{
 const {b,ctx,p}=await L.launch('desktop',L.OUT+'scripts/state_ed.json','sk');
 p.on('dialog',async d=>{console.log('DIALOG',d.type(),JSON.stringify(d.message()));await d.accept();});
 await p.goto('https://www.expresta.sk/order/shopping-cart',{waitUntil:'load'});await L.sleep(3000);await L.killPopups(p);
 const row=await p.evaluate(()=>[...document.querySelectorAll('a.edit_item')].map(a=>{let c=a;for(let i=0;i<6&&c.parentElement;i++)c=c.parentElement;return a.href+' || '+c.innerText.replace(/\s+/g,' ').slice(0,300)}));console.log('ROWS',row);
 console.log('thumbs',await p.evaluate(()=>[...document.querySelectorAll('img')].filter(i=>i.offsetParent&&i.width>40).map(i=>i.src.slice(0,100)).slice(0,3)));
 await L.shot(p,'ED_sk_desktop_cart_editor_item');
 if(row.length){await p.locator('a.edit_item:visible').first().click();await p.waitForLoadState('load');const f=await E.frame(p);await L.sleep(6000);await L.killPopups(p);
  console.log('EDIT URL',p.url());console.log('frame?',!!f, f?(await f.evaluate(()=>document.body.innerText.replace(/\s+/g,' ').slice(0,200))):'' );
  await L.shot(p,'ED_sk_desktop_cart_edit_opened');
  // back to cart via browser back
  await p.goBack({waitUntil:'load'}).catch(()=>{});await L.sleep(3000);console.log('after back',p.url());
 }
 // cleanup
 await p.goto('https://www.expresta.sk/order/shopping-cart',{waitUntil:'load'});await L.sleep(3000);
 for(let i=0;i<5;i++){const rm=p.locator('a.remove_item:visible').first();if(!(await rm.count()))break;await rm.click();await L.sleep(1500);
   const yes=p.locator('.modal.show .btn').filter({hasText:/^\s*Áno\s*$/i}).first();if(await yes.count())await yes.click();await p.waitForLoadState('load');await L.sleep(3000);}
 console.log('CART LEFT',await p.locator('a.remove_item:visible').count());
 await b.close();
})();
