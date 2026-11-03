const L=require('./lib');
(async()=>{
 const {b,ctx,p}=await L.launch('desktop',null,'sk');
 await ctx.grantPermissions(['clipboard-read','clipboard-write'],{origin:'https://www.expresta.sk'});
 await p.goto('https://www.expresta.sk/vizitky',{waitUntil:'networkidle',timeout:60000});await L.sleep(2000);await L.killPopups(p);
 const q=p.locator('#amount-value');const val=()=>p.evaluate(()=>document.querySelector('#amount-value').value);
 const T=async(name,fn)=>{await q.fill('');await q.focus();await fn();await L.sleep(300);const r=await val();console.log(name,'=>',JSON.stringify(r));L.note({j:'HYP-B2',test:name,val:r});};
 await p.evaluate(()=>navigator.clipboard.writeText('1000'));
 await T('empty + Ctrl+V "1000"',()=>p.keyboard.press('Control+V'));
 await T('empty + Shift+Insert "1000"',()=>p.keyboard.press('Shift+Insert'));
 await T('empty + Numpad 2,5,0',async()=>{for(const k of ['Numpad2','Numpad5','Numpad0'])await p.keyboard.press(k);});
 await T('empty + digits 2,5,0',async()=>{for(const k of ['2','5','0'])await p.keyboard.press(k);});
 await T('"250" then Ctrl+A, Backspace',async()=>{await p.keyboard.type('250');await p.keyboard.press('Control+A');await p.keyboard.press('Backspace');});
 await T('"250" then Home, 1',async()=>{await p.keyboard.type('250');await p.keyboard.press('Home');await p.keyboard.press('1');});
 await T('"250" then Ctrl+Backspace',async()=>{await p.keyboard.type('250');await p.keyboard.press('Control+Backspace');});
 await T('"250" then ArrowUp',async()=>{await p.keyboard.type('250');await p.keyboard.press('ArrowUp');});
 await b.close();
})();
