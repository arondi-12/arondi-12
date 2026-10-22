const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch({headless:'new', args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
  const p = await b.newPage();
  await p.setViewport({width:1280,height:900});
  await p.goto('https://zedu.chat/', {waitUntil:'networkidle2', timeout:60000});
  await new Promise(r=>setTimeout(r,1500));
  const r = await p.evaluate(() => {
    return [...document.querySelectorAll('h1,h2,h3')].slice(0,6).map(e => {
      const rect = e.getBoundingClientRect();
      const cs = getComputedStyle(e);
      let anc = e, hiddenBy = null;
      while (anc && anc !== document.documentElement) {
        const c = getComputedStyle(anc);
        if (c.display === 'none') { hiddenBy = 'display:none on ' + anc.tagName + '.' + (anc.className||'').toString().slice(0,30); break; }
        if (c.visibility === 'hidden') { hiddenBy = 'visibility:hidden on ' + anc.tagName; break; }
        if (c.opacity === '0') { hiddenBy = 'opacity:0 on ' + anc.tagName; break; }
        anc = anc.parentElement;
      }
      return {tag:e.tagName, text:(e.textContent||'').trim().slice(0,50), w:Math.round(rect.width), h:Math.round(rect.height), top:Math.round(rect.top), display:cs.display, vis:cs.visibility, hiddenBy};
    });
  });
  console.log(JSON.stringify(r,null,1));
  await b.close();
})();
