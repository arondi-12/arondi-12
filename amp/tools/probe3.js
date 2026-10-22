const puppeteer=require('puppeteer');
(async()=>{
  const b=await puppeteer.launch({headless:'new',args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
  const p=await b.newPage(); await p.setViewport({width:1280,height:900});
  await p.goto('https://zedu.chat/',{waitUntil:'networkidle2',timeout:60000});
  const r=await p.evaluate(()=>{
    const hs=[...document.querySelectorAll('h1,h2,h3')];
    const out=[];
    for(const h of hs){
      const rect=h.getBoundingClientRect();
      if(rect.width>0&&rect.height>0) continue;
      const chain=[]; let a=h;
      for(let i=0;i<7&&a;i++){ const cs=getComputedStyle(a); const r=a.getBoundingClientRect(); chain.push(a.tagName+'.'+String(a.className||'').split(' ').slice(0,2).join('.')+' ['+Math.round(r.width)+'x'+Math.round(r.height)+' h:'+cs.height+' ov:'+cs.overflow+' disp:'+cs.display+' pos:'+cs.position+']'); a=a.parentElement; }
      out.push({text:(h.textContent||'').trim().slice(0,30), chain});
      if(out.length>=4) break;
    }
    return out;
  });
  console.log(JSON.stringify(r,null,1).slice(0,3000));
  await b.close();
})();
