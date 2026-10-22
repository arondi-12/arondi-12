const puppeteer = require('puppeteer');
const fs = require('fs');
const PAGES = ['/', '/pricing', '/about', '/solutions/universities', '/products/channels'];
async function axHeadingOrder(client) {
  const {nodes} = await client.send('Accessibility.getFullAXTree');
  const byId = new Map(nodes.map(n => [n.nodeId, n]));
  const root = nodes.find(n => n.role && n.role.value === 'RootWebArea') || nodes[0];
  const out = [];
  const walk = (node) => {
    if (!node) return;
    if (node.role && node.role.value === 'heading' && !node.ignored) {
      out.push({level:(node.properties||[]).find(p=>p.name==='level')?.value?.value ?? null, name:((node.name&&node.name.value)||'').trim(), ignored:!!node.ignored});
    }
    (node.childIds||[]).forEach(id => walk(byId.get(id)));
  };
  walk(root);
  return out;
}
(async () => {
  const browser = await puppeteer.launch({headless:'new', args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
  const res = {checked_on:new Date().toISOString().slice(0,10), tool:{chrome:await browser.version(), puppeteer:require('puppeteer/package.json').version, axe:require('axe-core/package.json').version, viewport:'1280x900', mode:'headless, CDP Accessibility.getFullAXTree walked depth-first from RootWebArea'}, pages:[]};
  for (const p of PAGES) {
    const page = await browser.newPage();
    await page.setViewport({width:1280,height:900});
    await page.goto('https://zedu.chat'+p, {waitUntil:'networkidle2', timeout:60000});
    await page.evaluate(async () => {
      const step = 700;
      for (let y = 0; y < document.body.scrollHeight; y += step) { window.scrollTo(0,y); await new Promise(r=>setTimeout(r,90)); }
      window.scrollTo(0,0); await new Promise(r=>setTimeout(r,600));
    });
    await new Promise(r=>setTimeout(r,800));
    const dom = await page.evaluate(() => {
      const t = e => (e.textContent||'').trim().replace(/\s+/g,' ');
      const vis = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width>0 && r.height>0 && cs.visibility!=='hidden' && cs.display!=='none'; };
      const hs = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(e=>({level:+e.tagName[1], text:t(e).slice(0,90), visible:vis(e)}));
      const blocks = [...document.querySelectorAll('main *')].filter(e => ['SECTION','DIV','ARTICLE'].includes(e.tagName) && vis(e));
      const flagged = [];
      for (const b of blocks) {
        if (b.querySelector('h1,h2,h3,h4,h5,h6')) continue;
        const txt = t(b);
        if (txt.length < 80) continue;
        if (flagged.some(f => f.el.contains(b) || b.contains(f.el))) continue;
        flagged.push({el:b, chars:txt.length, text:txt.slice(0,80)});
      }
      return {order:hs, noHeadingBlocks: flagged.map(f=>({chars:f.chars, text:f.text})).slice(0,6)};
    });
    const client = await page.createCDPSession();
    const axOrder = await axHeadingOrder(client);
    await page.addScriptTag({path: require.resolve('axe-core')});
    const axe = await page.evaluate(async () => {
      const r = await axe.run(document, {runOnly:{type:'rule', values:['heading-order','page-has-heading-one','empty-heading','region']}});
      return r.violations.map(v=>({id:v.id, impact:v.impact, nodes:v.nodes.length, sample:v.nodes.slice(0,3).map(n=>n.target.join(' '))}));
    });
    res.pages.push({path:p, dom:dom.order, noHeadingBlocks:dom.noHeadingBlocks, ax:axOrder, axe});
    console.log('done',p,'dom',dom.order.length,'ax',axOrder.length,'unheaded',dom.noHeadingBlocks.length);
    await page.close();
  }
  await browser.close();
  fs.writeFileSync('../headings_final.json', JSON.stringify(res,null,1));
})();
