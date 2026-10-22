const puppeteer=require('puppeteer');
(async()=>{
  const b=await puppeteer.launch({headless:'new',args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
  const p=await b.newPage(); await p.setViewport({width:1280,height:900});
  await p.emulateMediaFeatures([{name:'prefers-reduced-motion', value:'reduce'}]);
  await p.goto('https://zedu.chat/',{waitUntil:'networkidle2',timeout:60000});
  await new Promise(r=>setTimeout(r,1500));
  const r=await p.evaluate(async()=>{
    const hs=[...document.querySelectorAll('h1,h2,h3')];
    let shown=0; const sample=[];
    for(const h of hs){
      h.scrollIntoView({block:'center'});
      await new Promise(r=>setTimeout(r,120));
      const rg=document.createRange(); rg.selectNodeContents(h);
      const rects=[...rg.getClientRects()].filter(r=>r.width>0&&r.height>0);
      if(rects.length) shown++; else if(sample.length<4) sample.push((h.textContent||'').trim().slice(0,40));
    }
    return {total:hs.length, shown, sample};
  });
  console.log(JSON.stringify(r,null,1));
  await b.close();
})();
