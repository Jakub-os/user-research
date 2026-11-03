const L=require('./lib');
(async()=>{
 const {b,ctx,p}=await L.launch('desktop',null,'sk');
 await ctx.grantPermissions(['clipboard-read','clipboard-write'],{origin:'https://www.expresta.sk'});
 await p.goto('https://www.expresta.sk/vizitky',{waitUntil:'networkidle',timeout:60000});await L.sleep(2000);await L.killPopups(p);
 const q=p.locator('#amount-value');
 const v=async l=>{const r=await p.evaluate(()=>{const e=document.querySelector('#amount-value');return {val:e.value,ss:e.selectionStart,se:e.selectionEnd}});console.log(l,JSON.stringify(r));L.note({j:'HYP-B',step:l,...r});return r;};
 const kd=await p.evaluate(()=>{const e=document.querySelector('#amount-value');return (e.getAttribute('onkeydown')||'')+' | onpaste='+(e.getAttribute('onpaste')||'')+' | type='+e.type+' inputmode='+e.inputMode});console.log('attrs',kd);
 await v('default');
 // Ctrl+A then type
 await q.click();await p.keyboard.press('Control+A');await v('after Ctrl+A (selection should be 0..3)');
 await p.keyboard.type('500');await v('typed 500 over selection');
 // Home / End / arrows
 await p.keyboard.press('Home');await v('Home (ss should be 0)');
 await p.keyboard.press('End');await v('End (ss should be len)');
 await p.keyboard.press('ArrowLeft');await v('ArrowLeft');
 await p.keyboard.press('Delete');await v('Delete');
 await p.keyboard.press('Backspace');await v('Backspace');
 // paste via clipboard
 await p.evaluate(()=>navigator.clipboard.writeText('1000'));
 await q.click();await p.keyboard.press('Control+A');await p.keyboard.press('Control+V');await L.sleep(300);await v('Ctrl+A, Ctrl+V "1000"');
 await p.evaluate(()=>navigator.clipboard.writeText('1 000'));
 await q.click();await p.keyboard.press('Control+A');await p.keyboard.press('Control+V');await L.sleep(300);await v('Ctrl+V "1 000" (with space)');
 // Shift+Insert
 await p.evaluate(()=>navigator.clipboard.writeText('750'));
 await q.click();await p.keyboard.press('Control+A');await p.keyboard.press('Shift+Insert');await L.sleep(300);await v('Shift+Insert "750"');
 // Ctrl+C copy of field then paste
 await q.fill('300');await q.click();await p.keyboard.press('Control+A');await p.keyboard.press('Control+C');const clip=await p.evaluate(()=>navigator.clipboard.readText());console.log('clipboard after Ctrl+C',JSON.stringify(clip));
 // Ctrl+Z
 await p.keyboard.press('Control+Z');await v('Ctrl+Z');
 // Tab out
 await q.fill('');await q.click();await p.keyboard.type('400');await p.keyboard.press('Tab');await L.sleep(1500);await v('typed 400 + Tab');
 const calcVis=await p.evaluate(()=>document.querySelector('button.calculate_price')?.offsetParent!==null);console.log('calc visible',calcVis);
 // Numpad digits
 await q.click();await p.keyboard.press('Control+A');await p.keyboard.press('Numpad2');await p.keyboard.press('Numpad5');await p.keyboard.press('Numpad0');await v('Numpad 250');
 await q.scrollIntoViewIfNeeded();await L.shot(p,'HYPB_sk_1440_qty_after_tests');
 await b.close();
})();
