const L=require('./lib');const E=require('./ed_lib');
const vp=process.argv[2]||'desktop';
(async()=>{
 const {b,ctx,p}=await L.launch(vp,L.OUT+'scripts/state_ed.json','sk');
 const url=require('fs').readFileSync(L.OUT+'scripts/ed_last_url.txt','utf8').split('\n')[0];
 p.on('dialog',async d=>{console.log('DIALOG',d.type(),d.message());await d.dismiss();});
 await p.goto(url,{waitUntil:'load',timeout:90000});const f=await E.frame(p);await L.sleep(4000);await L.killPopups(p);
 console.log('URL',p.url());
 const c=await E.controls(p,f);
 for(const x of c)console.log(`${x.tag} "${x.t}" ${x.x},${x.y} ${x.w}x${x.h}${x.dis?' DISABLED':''}${x.coveredBy?' COVERED-BY '+x.coveredBy:''}`);
 await b.close();
})();
