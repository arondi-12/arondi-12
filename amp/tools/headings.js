const puppeteer = require('puppeteer');
const fs = require('fs');
const PAGES = ['/', '/pricing', '/about', '/solutions/universities', '/products/channels'];
(async () => {
  const browser = await puppeteer.launch({headless:'new', args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
  const out = {checked_on: new Date().toISOString().slice(0,10), tool: 'Chrome for Testing ' + (await browser.version()) + ' via puppeteer ' + require('puppeteer/package.json').version + '; accessibility tree from CDP Accessibility.getFullAXTree; axe-core ' + require('axe-core/package.json').version + '; viewport 1280x900', pages: []};
  for (const p of PAGES) {
    const page = await browser.newPage();
    await page.setViewport({width:1280, height:900});
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36');
    const resp = await page.goto('https://zedu.chat'+p, {waitUntil:'networkidle2', timeout:60000});
    await new Promise(r=>setTimeout(r,1200));
    const dom = await page.evaluate(() => {
      const txt = e => (e.textContent||'').trim().replace(/\s+/g,' ');
      const hs = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')];
      const visible = e => !!(e.offsetWidth||e.offsetHeight);
      const sections = [...document.querySelectorAll('main section, main > div, main > div > section, section')].filter(e=>visible(e));
      const noHeading = [];
      const seen = new Set();
      for (const s of sections) {
        if (s.querySelector('h1,h2,h3,h4,h5,h6')) continue;
        const t = txt(s);
        if (t.length < 60) continue;
        if ([...seen].some(x => x.contains(s))) continue;
        seen.add(s);
        noHeading.push({chars: t.length, text: t.slice(0,70)});
      }
      return {
        title: document.title, lang: document.documentElement.lang || null,
        headings: hs.map(e=>({level:+e.tagName[1], text:txt(e).slice(0,90), visible:visible(e)})),
        noHeadingSections: noHeading.slice(0,8),
        mainCount: document.querySelectorAll('main').length
      };
    });
    const client = await page.createCDPSession();
    const {nodes} = await client.send('Accessibility.getFullAXTree');
    const axHeads = nodes.filter(n => n.role && n.role.value==='heading' && !n.ignored).map(n=>({
      level: (n.properties||[]).find(p=>p.name==='level')?.value?.value ?? null,
      name: ((n.name&&n.name.value)||'').trim().slice(0,90)}));
    await page.addScriptTag({path: require.resolve('axe-core')});
    const axe = await page.evaluate(async () => {
      const r = await axe.run(document, {runOnly:{type:'rule', values:['heading-order','page-has-heading-one','empty-heading','region']}});
      return r.violations.map(v=>({id:v.id, impact:v.impact, nodes:v.nodes.length, sample:v.nodes.slice(0,3).map(n=>n.target.join(' '))}));
    });
    out.pages.push({path:p, status: resp && resp.status(), ...dom, axHeads, axe});
    console.log('done', p, dom.headings.length, 'dom /', axHeads.length, 'ax');
    await page.close();
  }
  await browser.close();
  fs.writeFileSync('../headings_report_data.json', JSON.stringify(out,null,1));
})();
