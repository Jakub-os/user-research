const L=require('./lib');
const want=process.argv[2]||'85x55/landscape/duplex';
(async()=>{
 for(let i=0;i<15;i++){
  const {b,ctx,p}=await L.launch('desktop',null,'sk');
  p.on('dialog',async d=>{await d.accept();});
  await p.goto('https://www.expresta.sk/vizitky',{waitUntil:'networkidle',timeout:60000});await L.sleep(1500);await L.killPopups(p);
  const pdpPrice=await p.evaluate(()=>document.querySelector('#prodPriceTotal')?.innerText);
  await p.locator('#next-calculation').click();await L.sleep(2500);
  if(await p.locator('#next-design-order-submit:visible').count())await p.locator('#next-design-order-submit:visible').click();
  await p.waitForURL(/templates/,{timeout:30000});await L.sleep(2500);await L.killPopups(p);
  const tpls=await p.evaluate(()=>[...document.querySelectorAll('a')].filter(a=>/\/studio\//.test(a.href)&&/UPRAVI/.test(a.innerText)).map((a,k)=>{let c=a;for(let j=0;j<4&&c.parentElement;j++)c=c.parentElement;const lab=(c.innerText.match(/Parametre:[^\n]*/)||[''])[0];return k+' '+a.getAttribute('href').split('/studio/')[1].split('/').slice(0,4).join('/')+' | '+lab}));
  const idx=tpls.findIndex(t=>t.includes(want));
  console.log('try',i,p.url().split('/product/')[1].split('/')[0],'pdp price',pdpPrice,'templates',tpls.length,'match',idx);
  if(idx<0){if(i===0)console.log(tpls.join('\n'));await b.close();continue;}
  console.log(tpls.join('\n'));
  await p.evaluate(k=>{const a=[...document.querySelectorAll('a')].filter(a=>/\/studio\//.test(a.href)&&/UPRAVI/.test(a.innerText))[k];a.scrollIntoView({block:'center'})},idx);await L.sleep(800);
  await L.shot(p,'HYPC_sk_1440_step2_template_card');
  await p.evaluate(k=>{[...document.querySelectorAll('a')].filter(a=>/\/studio\//.test(a.href)&&/UPRAVI/.test(a.innerText))[k].click()},idx);
  await p.waitForLoadState('load');let f=null;for(let j=0;j<30&&!f;j++){await L.sleep(1000);f=p.frame({name:'app_iframe'});}
  await L.sleep(10000);await L.killPopups(p);
  console.log('EDITOR',p.url().slice(0,140));
  console.log('editor text',await f.evaluate(()=>document.body.innerText.replace(/\s+/g,' ').slice(0,300)));
  await L.shot(p,'HYPC_sk_1440_editor_template');
  await f.getByText('Vložiť do košíka').first().click();
  for(let j=0;j<60;j++){await L.sleep(1000);if(!/studio/.test(p.url()))break;}
  await L.sleep(3000);
  if(/remarks/.test(p.url())){
    console.log('REMARKS frame',await f.evaluate(()=>document.body.innerText.replace(/\s+/g,' ').slice(0,900)).catch(e=>e.message));
    console.log('REMARKS page modals',await L.modals(p));
    await L.shot(p,'HYPC_sk_1440_remarks');
    const btn=await f.evaluate(()=>[...document.querySelectorAll('button,a,div[role=button]')].filter(e=>e.getClientRects().length&&e.innerText.trim()).map(e=>e.innerText.trim().slice(0,40)));console.log('remarks buttons',btn);
    const tail=await f.evaluate(()=>{const t=document.body.innerText.replace(/\s+/g,' ');const i=t.indexOf('Ups!');return t.slice(i,i+700)});console.log('TAIL',tail);
    const cbs=await f.evaluate(()=>[...document.querySelectorAll('input[type=checkbox],[role=checkbox],label')].filter(e=>e.getClientRects().length).map(e=>e.tagName+' '+(e.innerText||e.getAttribute('aria-label')||'').slice(0,80)));console.log('checkboxes',cbs);
    const cb=f.locator('input[type=checkbox]:visible,[role=checkbox]:visible,label:visible').last();if(await cb.count()){await cb.click().catch(e=>console.log('cb err'));await L.sleep(800);}
    const nx=f.locator('button:visible').filter({hasText:/Pokračovať|Vložiť do košíka|Pokračova|Ďalej|Potvrdiť/i}).last();
    if(await nx.count()){console.log('clicking',await nx.innerText());await nx.click();}
    for(let j=0;j<60;j++){await L.sleep(1000);if(!/studio/.test(p.url()))break;}
  }
  await p.waitForLoadState('load');await L.sleep(4000);await L.killPopups(p);
  console.log('CART URL',p.url());
  const row=await p.evaluate(()=>{const a=document.querySelector('a.edit_item');let c=a;for(let i=0;i<6&&c&&c.parentElement;i++)c=c.parentElement;return c?c.innerText.replace(/\s+/g,' ').slice(0,400):null});
  console.log('CART ROW',row);
  const det=await p.evaluate(()=>(document.body.innerText.match(/[^\n]*(85 ?x ?55|90 ?x ?50|90 ?x ?55|Obojstrann|Jednostrann)[^\n]*/g)||[]).slice(0,8));console.log('param lines',det);
  await L.shot(p,'HYPC_sk_1440_cart',true);
  // open params detail if there is a toggle
  const tog=p.locator('a:visible,button:visible').filter({hasText:/parametr|Detail|detail/i}).first();if(await tog.count()){await tog.click().catch(()=>{});await L.sleep(1500);console.log('after toggle',await p.evaluate(()=>(document.body.innerText.match(/[^\n]*(85 ?x ?55|90 ?x ?50|90 ?x ?55|Obojstrann|Jednostrann|mm)[^\n]*/g)||[]).slice(0,10)));await L.shot(p,'HYPC_sk_1440_cart_params',true);}
  // edit item -> see config
  await p.locator('a.edit_item:visible').first().click();await p.waitForLoadState('load');await L.sleep(8000);console.log('EDIT URL',p.url().slice(0,150));
  await p.goto('https://www.expresta.sk/order/shopping-cart',{waitUntil:'load'});await L.sleep(3000);
  for(let k=0;k<5;k++){const rm=p.locator('a.remove_item:visible').first();if(!(await rm.count()))break;await rm.click();await L.sleep(1500);const yes=p.locator('.modal.show .btn').filter({hasText:/^\s*Áno\s*$/i}).first();if(await yes.count())await yes.click();await p.waitForLoadState('load');await L.sleep(3000);}
  console.log('CART LEFT',await p.locator('a.remove_item:visible').count());
  await b.close();break;
 }
})();
