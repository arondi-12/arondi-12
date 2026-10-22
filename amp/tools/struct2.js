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
      const noHead=[];
      for(const b of document.querySelectorAll('section')){
        if(b.querySelector('h1,h2,h3,h4,h5,h6')) continue;
        const txt=t(b); if(txt.length<40) continue;
        noHead.push(txt.slice(0,80));
      }
      return {
        main:document.querySelectorAll('main').length, nav:document.querySelectorAll('nav').length,
        header:document.querySelectorAll('header').length, footer:document.querySelectorAll('footer').length,
        roleMain:document.querySelectorAll('[role=main]').length, roleNav:document.querySelectorAll('[role=navigation]').length,
        sections:document.querySelectorAll('section').length,
        sectionsNoHeading:noHead.length, sampleNoHeading:noHead.slice(0,4)
      };
    });
    console.log(p, JSON.stringify(out[p]).slice(0,260));
    await page.close();
  }
  await b.close(); fs.writeFileSync('../struct_check.json',JSON.stringify(out,null,1));
})();
