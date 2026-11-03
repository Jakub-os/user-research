const L=require('./lib');const E=require('./ed_lib');
(async()=>{
 const {b,ctx,p}=await L.launch('desktop',L.OUT+'scripts/state_ed.json','sk');
 const url=require('fs').readFileSync(L.OUT+'scripts/ed_last_url.txt','utf8').split('\n')[0];
 p.on('dialog',async d=>{console.log('DIALOG',d.type(),d.message());await d.dismiss();});
 await p.goto(url,{waitUntil:'load',timeout:90000});let f=await E.frame(p);await L.sleep(5000);await L.killPopups(p);
 for(const [x,y] of [[1385,150],[1392,165],[1403,160],[1420,160],[1403,210]]) console.log('point',x,y,await p.evaluate(([x,y])=>{const e=document.elementFromPoint(x,y);return e.tagName+'.'+(e.className||'').toString().slice(0,30)},[x,y]));
 const helpHtml=await p.evaluate(()=>{const e=document.querySelector('.editor-icon-container');return e?e.outerHTML.slice(0,300)+' title='+(e.title||e.getAttribute('aria-label')):null});console.log('HELP',helpHtml);
 // click help bubble
 await p.mouse.click(1362,160);await L.sleep(2500);
 console.log('after help click modals',await L.modals(p), (await p.evaluate(()=>[...document.querySelectorAll('.modal.show,[class*=popup],[class*=dialog]')].filter(e=>e.offsetParent).map(e=>e.innerText.replace(/\s+/g,' ').slice(0,300)))));
 await L.shot(p,'ED_sk_desktop_help_click');
 await p.keyboard.press('Escape');await p.evaluate(()=>document.querySelectorAll('.modal.show .btn-close, .modal.show [data-bs-dismiss]').forEach(b=>b.click()));await L.sleep(1000);
 // click visible part of Text tool
 await p.mouse.click(1418,160);await L.sleep(2500);
 await p.keyboard.type('TEST UX vizitka');await L.sleep(1500);
 await p.mouse.click(900,600);await L.sleep(1500);
 const saved=await f.evaluate(()=>document.body.innerText.match(/Naposledy uložené:?\s*\S+/)?.[0]);console.log('save status',saved);
 await L.shot(p,'ED_sk_desktop_text_added');
 // click Uložiť
 await f.getByText('Uložiť',{exact:true}).first().click();await L.sleep(4000);
 const afterSave=await f.evaluate(()=>[...document.querySelectorAll('[role=dialog],[class*=modal],[class*=Modal],[class*=popup]')].filter(e=>e.getClientRects().length).map(e=>e.innerText.replace(/\s+/g,' ').slice(0,400)));
 console.log('after save dialogs (iframe)',JSON.stringify(afterSave));
 console.log('after save dialogs (page)',JSON.stringify(await L.modals(p)));
 console.log('save status2',await f.evaluate(()=>document.body.innerText.match(/Naposledy uložené:?\s*\S+/)?.[0]));
 await L.shot(p,'ED_sk_desktop_after_save_click');
 const u1=p.url();
 await p.keyboard.press('Escape');await L.sleep(500);
 await p.reload({waitUntil:'load'});f=await E.frame(p);await L.sleep(6000);await L.killPopups(p);
 console.log('RELOAD url before',u1.split('projectId=')[1],'after',p.url().split('projectId=')[1]);
 const hasText=await f.evaluate(()=>document.body.innerText.includes('TEST UX'));
 console.log('text present after reload (DOM)',hasText);
 await L.shot(p,'ED_sk_desktop_after_reload');
 await ctx.storageState({path:L.OUT+'scripts/state_ed.json'});
 await b.close();
})();
