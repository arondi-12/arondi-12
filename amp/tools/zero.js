const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch({headless:'new', args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
  const p = await b.newPage();
  await p.setViewport({width:1280,height:900});
  await p.goto('https://zedu.chat/',{waitUntil:'networkidle2',timeout:60000});
  await new Promise(r=>setTimeout(r,1200));
  const r = await p.evaluate(() => {
    const t = e => (e.textContent||'').trim().replace(/\s+/g,' ');
    const out = [];
    for (const h of document.querySelectorAll('h1,h2,h3')) {
      const rect = h.getBoundingClientRect();
      if (rect.width>0 && rect.height>0) continue;
      let anc = h, path = [];
      for (let i=0;i<6 && anc;i++){ path.push(anc.tagName + (anc.className ? '.' + String(anc.className).split(' ').slice(0,2).join('.') : '')); anc = anc.parentElement; }
      out.push({tag:h.tagName, text:t(h).slice(0,40), ariaHidden:h.closest('[aria-hidden="true"]')?true:false, path:path.join(' < ').slice(0,150)});
    }
    return {scrollH: document.body.scrollHeight, zero: out.slice(0,6), zeroCount: out.length};
  });
  console.log(JSON.stringify(r,null,1));
  await b.close();
})();
