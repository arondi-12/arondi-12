const puppeteer=require('puppeteer');
const fs=require('fs');
const PAGES=['/','/pricing','/about','/solutions/universities','/products/channels'];
(async()=>{
  const b=await puppeteer.launch({headless:'new',args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
  const out={};
  for(const p of PAGES){
    const page=await b.newPage(); await page.setViewport({width:1280,height:900});
    await page.goto('https://zedu.chat'+p,{waitUntil:'networkidle2',timeout:60000});
    out[p]=await page.evaluate(()=>{
      const t=e=>(e.textContent||'').trim().replace(/\s+/g,' ');
      const main=document.querySelector('main');
      const blocks=[...document.querySelectorAll('main section, main > div, main article')];
      const noHead=[];
      for(const b of blocks){
        if(b.querySelector('h1,h2,h3,h4,h5,h6')) continue;
        const txt=t(b); if(txt.length<80) continue;
        noHead.push(txt.slice(0,70));
      }
      return {mainCount:document.querySelectorAll('main').length, mainHasH1: main? !!main.querySelector('h1') : null, blocks:noHead.length, sample:noHead.slice(0,5)};
    });
    console.log(p, JSON.stringify(out[p]).slice(0,220));
    await page.close();
  }
  await b.close(); fs.writeFileSync('../struct_check.json',JSON.stringify(out,null,1));
})();
