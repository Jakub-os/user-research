const L=require('./lib');const E=require('./ed_lib');
const mode=process.argv[2]; // 'empty' or 'lowres'
(async()=>{
 const {b,ctx,p}=await L.launch('desktop',L.OUT+'scripts/state_ed.json','sk');
 const url=require('fs').readFileSync(L.OUT+'scripts/ed_last_url.txt','utf8').split('\n')[0];
 p.on('dialog',async d=>{console.log('DIALOG',d.type(),JSON.stringify(d.message()));await d.accept();});
 await p.goto(url,{waitUntil:'load',timeout:90000});let f=await E.frame(p);await L.sleep(5000);await L.killPopups(p);
 const dlg=async()=>({frame:await f.evaluate(()=>[...document.querySelectorAll('[role=dialog],[class*=modal],[class*=Modal],[class*=popup],[class*=Popup],[class*=notification],[class*=toast],[class*=warning],[class*=Warning],[class*=alert]')].filter(e=>e.getClientRects().length&&e.innerText.trim()).map(e=>e.innerText.replace(/\s+/g,' ').slice(0,300))).catch(()=>[]),page:await L.modals(p)});
 if(mode==='lowres'){
   const inp=await f.$('input[type=file]');console.log('file inputs in frame',await f.evaluate(()=>[...document.querySelectorAll('input[type=file]')].map(i=>i.accept+' multiple='+i.multiple)));
   const [fc]=await Promise.all([p.waitForEvent('filechooser',{timeout:15000}).catch(()=>null),f.getByText('Počítač',{exact:true}).first().click()]);
   if(fc){await fc.setFiles(L.OUT+'testfiles/lowres_60x33px_TEST.png');}else if(inp){await inp.setInputFiles(L.OUT+'testfiles/lowres_60x33px_TEST.png');}
   await L.sleep(8000);console.log('after upload',JSON.stringify(await dlg()));
   await L.shot(p,'ED_sk_desktop_lowres_uploaded');
   // drag image onto canvas: try clicking the thumbnail in the left panel
   const th=await f.evaluate(()=>{const i=[...document.querySelectorAll('img')].filter(i=>i.getClientRects().length&&i.getBoundingClientRect().x<388&&i.getBoundingClientRect().y>100).map(i=>{const r=i.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2,i.src.slice(0,60)]});return th=i});
   console.log('left imgs',JSON.stringify(th));
   if(th.length){const [x,y]=th[th.length-1];await p.mouse.move(x,y);await p.mouse.down();await p.mouse.move(700,350,{steps:12});await p.mouse.move(900,400,{steps:12});await p.mouse.up();await L.sleep(4000);}
   console.log('after place',JSON.stringify(await dlg()));
   const warnTxt=await f.evaluate(()=>{const t=document.body.innerText;return (t.match(/[^\n]*(DPI|dpi|rozlíšen|kvalit|Kvalit|resolution)[^\n]*/g)||[]).slice(0,10)});console.log('quality words',warnTxt);
   await L.shot(p,'ED_sk_desktop_lowres_placed');
   const icons=await f.evaluate(()=>[...document.querySelectorAll('[class*=quality],[class*=Quality],[class*=dpi],[class*=Dpi],[class*=warn]')].filter(e=>e.getClientRects().length).map(e=>e.className.toString().slice(0,60)+' '+(e.title||e.innerText||'').slice(0,80)));console.log('quality icons',icons);
 }
 if(mode==='lowres'){await b.close();return;}
 // add to cart
 const tc=Date.now();await f.getByText('Vložiť do košíka').first().click();
 for(let i=0;i<60;i++){await L.sleep(1000);if(!/studio/.test(p.url()))break;const dd=await dlg();if((dd.frame.length||dd.page.length)&&i>2){console.log('dialog at',i,JSON.stringify(dd));break;}}
 console.log('elapsed ms',Date.now()-tc);await p.waitForLoadState('load').catch(()=>{});await L.sleep(3000);
 console.log('after add-to-cart',p.url(),JSON.stringify(await dlg()));
 await L.shot(p,`ED_sk_desktop_addcart_${mode}`);
 const btns=await f.evaluate(()=>[...document.querySelectorAll('button')].filter(e=>e.getClientRects().length&&e.innerText.trim()).map(e=>e.innerText.trim().slice(0,40)).slice(-12)).catch(()=>[]);console.log('frame buttons',btns);
 await ctx.storageState({path:L.OUT+'scripts/state_ed.json'});
 await b.close();
})();
