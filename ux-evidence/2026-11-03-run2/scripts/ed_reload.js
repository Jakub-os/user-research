const L=require('./lib');const E=require('./ed_lib');
(async()=>{
 const {b,ctx,p}=await L.launch('desktop',L.OUT+'scripts/state_ed.json','sk');
 const url=require('fs').readFileSync(L.OUT+'scripts/ed_last_url.txt','utf8').split('\n')[0];
 let dialogs=[];p.on('dialog',async d=>{dialogs.push(d.type());console.log('DIALOG',d.type(),JSON.stringify(d.message()));await d.accept();});
 await p.goto(url,{waitUntil:'load',timeout:90000});let f=await E.frame(p);await L.sleep(5000);await L.killPopups(p);
 const pid0=p.url().split('projectId=')[1];
 await p.mouse.click(1418,160);await L.sleep(2500);
 await p.mouse.dblclick(913,376);await L.sleep(1000);
 await p.keyboard.press('Control+A');await p.keyboard.type('TEST UX vizitka');await L.sleep(1000);
 await p.mouse.click(1000,700);await L.sleep(2000);
 const has=async()=>f.evaluate(()=>{const t=document.body.innerText.includes('TEST UX');const svg=[...document.querySelectorAll('svg text, text, tspan, textarea, [contenteditable]')].some(e=>(e.textContent||e.value||'').includes('TEST UX'));return {t,svg}}).catch(e=>'ERR '+e.message.slice(0,50));
 console.log('has text before reload',JSON.stringify(await has()));
 await L.shot(p,'ED_sk_desktop_text_typed');
 // in-editor undo state
 // Reload (accept beforeunload)
 await p.reload({waitUntil:'load',timeout:60000}).catch(e=>console.log('reload',e.message.slice(0,60)));
 f=await E.frame(p);await L.sleep(6000);await L.killPopups(p);
 console.log('projectId before',pid0,'after',p.url().split('projectId=')[1]);
 console.log('has text after reload',JSON.stringify(await has()));
 const restore=await L.modals(p);console.log('modals after reload',restore);
 const fr=await f.evaluate(()=>document.body.innerText.replace(/\s+/g,' ').slice(0,400));console.log('frame text',fr);
 await L.shot(p,'ED_sk_desktop_after_reload');
 // browser back from editor
 await p.goBack({waitUntil:'load',timeout:45000}).catch(e=>console.log('back',e.message.slice(0,60)));await L.sleep(4000);
 console.log('after back URL',p.url(),'dialogs',dialogs);
 await b.close();
})();
