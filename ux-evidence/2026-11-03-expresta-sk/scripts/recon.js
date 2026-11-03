const { chromium } = require('playwright');
const fs=require('fs');
const OUT='/home/user/user-research/ux-evidence/2026-11-03-expresta-sk/';
(async()=>{
 const b=await chromium.launch();
 const ctx=await b.newContext({viewport:{width:1440,height:900},locale:'sk-SK'});
 const p=await ctx.newPage();
 const logs=[];
 p.on('console',m=>{if(m.type()==='error')logs.push(m.text())});
 await p.goto('https://www.expresta.sk/',{waitUntil:'networkidle',timeout:60000});
 await p.screenshot({path:OUT+'screenshots/recon_sk_1440_home_initial.png'});
 console.log('TITLE',await p.title(), p.url());
 // consent detection
 const btns=await p.$$eval('button, a',els=>els.filter(e=>e.offsetParent).map(e=>(e.innerText||'').trim()).filter(t=>t&&t.length<60));
 console.log('BUTTONS',JSON.stringify(btns.slice(0,150)));
 const links=await p.$$eval('a[href]',els=>[...new Set(els.map(e=>e.href))]);
 fs.writeFileSync(OUT+'notes_recon_links.txt',links.join('\n'));
 console.log('LINKS',links.length);
 console.log('ERRORS',logs.slice(0,10));
 await b.close();
})();
