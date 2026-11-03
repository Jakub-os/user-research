const L=require('./lib');
(async()=>{
 const {b,p}=await L.launch('desktop');
 await p.goto('https://www.expresta.sk/tlac-brozur',{waitUntil:'networkidle',timeout:60000});await L.sleep(2500);
 await p.evaluate(()=>document.querySelector('#pages-value').scrollIntoView({block:'center'}));
 await p.locator('#pages-value').click({clickCount:3});await p.keyboard.press('Delete');await p.keyboard.type('37');await p.keyboard.press('Tab');await L.sleep(1500);
 await p.locator('button.calculate_price:visible').first().click();const t0=Date.now();let first=null,last=null;
 for(let i=0;i<100;i++){const v=await p.evaluate(()=>[...document.querySelectorAll('.toast')].some(t=>/párny počet/.test(t.innerText)&&t.classList.contains('show')&&getComputedStyle(t).opacity>0.05));if(v){if(first===null)first=Date.now()-t0;last=Date.now()-t0;}await L.sleep(100);}
 const inval=await p.evaluate(()=>({ariaInvalid:document.querySelector('#pages-value').getAttribute('aria-invalid'),cls:document.querySelector('#pages-value').className}));
 console.log('toast visible from',first,'to',last,'ms; field',JSON.stringify(inval));
 await b.close();
})();
