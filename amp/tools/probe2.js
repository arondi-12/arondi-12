const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch({headless:'new', args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
  const p = await b.newPage();
  await p.setViewport({width:1280,height:900});
  const failed = [];
  p.on('requestfailed', r => failed.push(r.url().slice(0,90) + ' :: ' + (r.failure()||{}).errorText));
  p.on('response', r => { if (r.status() >= 400) failed.push(r.status() + ' ' + r.url().slice(0,90)); });
  await p.goto('https://zedu.chat/', {waitUntil:'networkidle2', timeout:60000});
  await new Promise(r=>setTimeout(r,2000));
  const info = await p.evaluate(() => ({
    sheets: document.styleSheets.length,
    bodyH: document.body.offsetHeight,
    bodyFont: getComputedStyle(document.body).fontSize,
    bodyBg: getComputedStyle(document.body).backgroundColor,
    firstH1Rect: (() => { const h=document.querySelector('h1'); const r=h.getBoundingClientRect(); return {w:r.width,h:r.height,font:getComputedStyle(h).fontSize,line:getComputedStyle(h).lineHeight, overflow:getComputedStyle(h).overflow}; })(),
    links: document.querySelectorAll('link[rel=stylesheet]').length
  }));
  console.log(JSON.stringify(info,null,1));
  console.log('failures:', failed.slice(0,12));
  await b.close();
})();
