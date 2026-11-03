const L=require('./lib');
(async()=>{
 const url=process.argv[2]; const tag=process.argv[3]||'pdp';
 const {b,p}=await L.launch('desktop');
 await p.goto(url,{waitUntil:'networkidle',timeout:60000});
 await L.sleep(2500);
 console.log('consent:',await L.consent(p));
 console.log('URL',p.url(),'TITLE',await p.title());
 console.log(JSON.stringify(await L.controls(p),null,0));
 await L.shot(p,tag+'_full',true);
 console.log('ERRS',p._errs);
 await b.close();
})();
