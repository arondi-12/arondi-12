const puppeteer=require('puppeteer');
(async()=>{
  const b=await puppeteer.launch({headless:'new',args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
  const p=await b.newPage(); await p.setViewport({width:1280,height:900});
  await p.goto('https://zedu.chat/',{waitUntil:'networkidle2',timeout:60000});
  const r=await p.evaluate(()=>{
    const h=[...document.querySelectorAll('h2')].find(x=>x.textContent.trim().startsWith('Organized Channels'));
    const chain=[]; let a=h;
    while(a && a!==document.documentElement){
      const cs=getComputedStyle(a);
      chain.push({tag:a.tagName,cls:String(a.className||'').slice(0,40),cv:cs.contentVisibility,contain:cs.contain,fs:cs.fontSize,h:cs.height,ov:cs.overflow,tr:cs.transform.slice(0,30),op:cs.opacity});
      a=a.parentElement;
    }
    return chain;
  });
  console.log(JSON.stringify(r,null,1));
  await b.close();
})();
