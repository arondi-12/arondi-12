const puppeteer=require('puppeteer');
(async()=>{
  const b=await puppeteer.launch({headless:'new',args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
  const p=await b.newPage(); await p.setViewport({width:1280,height:900});
  await p.goto('https://zedu.chat/',{waitUntil:'networkidle2',timeout:60000});
  const r=await p.evaluate(()=>{
    const h=[...document.querySelectorAll('h2')].find(x=>x.textContent.trim().startsWith('Organized Channels'));
    if(!h) return 'not found';
    const kids=[...h.querySelectorAll('*')].map(k=>{const r=k.getBoundingClientRect();const cs=getComputedStyle(k);return {tag:k.tagName,cls:String(k.className).slice(0,50),w:Math.round(r.width),h:Math.round(r.height),disp:cs.display,pos:cs.position,op:cs.opacity,tf:cs.transform.slice(0,40),vis:cs.visibility};});
    const rg=document.createRange(); rg.selectNodeContents(h);
    return {html:h.outerHTML.slice(0,400), rects:[...rg.getClientRects()].length, kids:kids.slice(0,6)};
  });
  console.log(JSON.stringify(r,null,1).slice(0,2500));
  await b.close();
})();
