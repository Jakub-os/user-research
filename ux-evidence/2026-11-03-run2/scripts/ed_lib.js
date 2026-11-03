const L=require('./lib');
async function frame(p){for(let i=0;i<30;i++){const f=p.frame({name:'app_iframe'});if(f){const n=await f.evaluate(()=>document.querySelectorAll('button').length).catch(()=>0);if(n>5)return f;}await L.sleep(1000);}return null;}
async function controls(p,f){
  const list=await f.evaluate(()=>{const out=[];for(const e of document.querySelectorAll('button,a,[role=button],[role=tab],input,[class*=tool]')){if(!e.getClientRects().length)continue;const r=e.getBoundingClientRect();if(r.width<5||r.height<5)continue;const t=(e.innerText||e.title||e.getAttribute('aria-label')||e.placeholder||'').replace(/\s+/g,' ').trim().slice(0,30);out.push({t,tag:e.tagName,x:r.x,y:r.y,w:r.width,h:r.height,dis:e.disabled||e.getAttribute('aria-disabled')==='true'||/disabled/.test(e.className)});}return out;});
  const res=[];const seen=new Set();
  for(const c of list){const k=c.t+c.x+c.y;if(seen.has(k))continue;seen.add(k);
    const top=await p.evaluate(([x,y])=>{const e=document.elementFromPoint(x,y);return e?(e.tagName==='IFRAME'?'':e.tagName+'.'+(e.className||'').toString().slice(0,30)+'#'+e.id):'none'},[c.x+c.w/2,c.y+c.h/2]);
    res.push({...c,x:Math.round(c.x),y:Math.round(c.y),w:Math.round(c.w),h:Math.round(c.h),coveredBy:top});}
  return res;
}
module.exports={frame,controls};
