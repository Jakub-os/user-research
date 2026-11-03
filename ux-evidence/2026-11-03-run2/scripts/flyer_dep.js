const L=require('./lib');
const clickText=(p,scope,re)=>p.evaluate(([scope,re])=>{const r=new RegExp(re);const root=document.querySelector(scope)||document;const els=[...root.querySelectorAll('*')].filter(e=>e.children.length<=2&&r.test((e.innerText||'').trim())&&e.getClientRects().length);const e=els[els.length-1];if(!e)return null;e.scrollIntoView({block:'center'});e.click();return (e.innerText||'').trim().slice(0,60)+' <'+e.tagName+'.'+(e.className||'').toString().slice(0,30)},[scope,re]);
(async()=>{
 const {b,ctx,p}=await L.launch('desktop',null,'sk');
 await p.goto('https://www.expresta.sk/letaky',{waitUntil:'networkidle',timeout:60000});await L.sleep(2500);await L.killPopups(p);
 const st=async l=>{const s=await p.evaluate(()=>{const vis=e=>e&&e.offsetParent!==null;const it=[...document.querySelectorAll('.calc_param_item')].filter(vis).map(e=>e.innerText.replace(/\s+/g,' ').trim().slice(0,70));return {params:it.slice(0,4),price:vis(document.querySelector('#prodPriceTotal'))?document.querySelector('#prodPriceTotal').innerText:'(hidden)',calc:!![...document.querySelectorAll('button.calculate_price')].find(vis),toasts:[...document.querySelectorAll('.toast.show,.modal.show')].map(t=>t.innerText.replace(/\s+/g,' ').slice(0,200))}});console.log(l,JSON.stringify(s));L.note({j:'FLY-dep',step:l,...s});return s;};
 const calc=async()=>{const c=p.locator('button.calculate_price:visible').first();if(await c.count()){await c.click();await p.waitForFunction(()=>document.querySelector('#prodPriceTotal')?.offsetParent!==null,null,{timeout:20000}).catch(()=>{});await L.sleep(1500);}};
 await st('default');
 // open materials drawer and list compatible-with-finishing materials
 await p.locator('[data-bs-target="#paper-box"]').first().click();await L.sleep(1500);
 console.log('click Zušľachtenie filter',await clickText(p,'#paper-box','^Zušľachtenie$'));await L.sleep(1500);
 const mats=await p.evaluate(()=>[...document.querySelectorAll('#paper-box *')].filter(e=>e.children.length===0&&e.offsetParent&&/papier|kartón|g\/m/.test(e.innerText||'')).map(e=>e.innerText.trim()).slice(0,15));console.log('materials after filter',mats);
 await L.shot(p,'FLY_sk_1440_material_filter');
 const pick=mats.find(m=>/300 g|350 g|250 g/.test(m))||mats[0];console.log('pick',pick);
 console.log('click mat',await clickText(p,'#paper-box','^'+pick.replace(/[()\/.]/g,'.')+'$'));await L.sleep(2500);
 await st('after material pick');await calc();const s1=await st('after calc');
 // finishing now
 await p.locator('[data-bs-target="#additional-params-box"]').first().click();await L.sleep(1500);
 console.log('click UV',await clickText(p,'#additional-params-box','^Parciálny UV lak$'));await L.sleep(2000);
 const fin=await p.evaluate(()=>{const b=document.querySelector('#additional-params-box');return b.innerText.replace(/\s+/g,' ').slice(0,600)});console.log('finish drawer',fin);
 console.log('Nothing selected visible',await p.evaluate(()=>[...document.querySelectorAll('#additional-params-box *')].filter(e=>e.children.length===0&&e.offsetParent&&/Nothing selected/.test(e.innerText||'')).length));
 await L.shot(p,'FLY_sk_1440_uv_selected');
 // choose side select
 await st('after UV');
 await p.keyboard.press('Escape');await L.sleep(800);
 await calc();const s2=await st('after UV calc');
 // switch material back to 150g incompatible
 await p.locator('[data-bs-target="#paper-box"]').first().click();await L.sleep(1500);
 await clickText(p,'#paper-box','^Klasický$');await L.sleep(1000);
 console.log('click 150g',await clickText(p,'#paper-box','^Lesklý papier \\(0,11 mm \\/ 150 g\\/m²\\)$'));await L.sleep(2500);
 const s3=await st('after back to 150g');await calc();await st('after calc 150g');
 await L.shot(p,'FLY_sk_1440_back_to_150g');
 await b.close();
})();
