const puppeteer = require('puppeteer');
const fs = require('fs');
const PAGES = ['/', '/pricing', '/about', '/solutions/universities', '/products/channels'];
(async () => {
  const b = await puppeteer.launch({headless:'new', args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
  const out = {};
  for (const p of PAGES) {
    const page = await b.newPage();
    await page.setViewport({width:1280,height:900});
    await page.goto('https://zedu.chat'+p,{waitUntil:'networkidle2',timeout:60000});
    await page.addScriptTag({path: require.resolve('axe-core')});
    const r = await page.evaluate(async () => {
      const res = await axe.run(document, {runOnly:{type:'rule', values:['heading-order','empty-heading','page-has-heading-one']}});
      return res.violations.map(v=>({id:v.id, impact:v.impact, nodes:v.nodes.map(n=>({target:n.target.join(' '), html:(n.html||'').slice(0,120), summary:(n.failureSummary||'').replace(/\s+/g,' ').slice(0,220)}))}));
    });
    out[p]=r;
    console.log(p, JSON.stringify(r).slice(0,300));
    await page.close();
  }
  await b.close();
  fs.writeFileSync('../axe_headings_detail.json', JSON.stringify(out,null,1));
})();
