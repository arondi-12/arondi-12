const puppeteer = require('puppeteer');
const fs = require('fs');
const PATHS = ['/', '/pricing', '/about', '/download', '/solutions/schools', '/solutions/universities', '/solutions/bootcamps', '/products/channels', '/products/buzz', '/products/file-management', '/resources', '/policy', '/terms-of-service', '/auth/login', '/auth/sign-up'];

async function pageData(browser, path) {
  const url = 'https://zedu.chat' + path;
  const page = await browser.newPage();
  await page.setViewport({width: 1280, height: 900});
  await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36');
  let status = null, err = null;
  try { const r = await page.goto(url, {waitUntil: 'networkidle2', timeout: 60000}); status = r && r.status(); }
  catch (e) { err = String(e).slice(0,120); }
  await new Promise(r=>setTimeout(r,1000));
  const dom = await page.evaluate(() => {
    const t = e => (e.textContent||'').trim().replace(/\s+/g,' ');
    return {
      title: document.title, lang: document.documentElement.lang || null,
      headings: [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(e => ({level:+e.tagName[1], text:t(e).slice(0,100), visible:!!(e.offsetWidth||e.offsetHeight), ariaHidden:e.getAttribute('aria-hidden')})),
      landmarks: {main:document.querySelectorAll('main').length, nav:document.querySelectorAll('nav').length, header:document.querySelectorAll('header').length, footer:document.querySelectorAll('footer').length, roleMain:document.querySelectorAll('[role=main]').length, roleNav:document.querySelectorAll('[role=navigation]').length, ariaLabelMain:[...document.querySelectorAll('main,[role=main]')].map(m=>m.getAttribute('aria-label'))},
      skipCandidates: [...document.querySelectorAll('a[href^="#"]')].map(a=>({href:a.getAttribute('href'), text:(a.textContent||'').trim().slice(0,40)})),
      targetsOfSkip: [...document.querySelectorAll('a[href^="#"]')].map(a=>a.getAttribute('href')).filter(h=>h && h.length>1).map(h=>document.querySelector(h)?true:false),
      bodyText: document.body.innerText.length
    };
  });
  await page.addScriptTag({path: require.resolve('axe-core')});
  let axe = null;
  try {
    axe = await page.evaluate(async () => {
      const r = await axe.run(document, {runOnly:{type:'tag', values:['wcag2a','wcag2aa','wcag21a','wcag21aa','best-practice']}});
      const pick = ['heading-order','page-has-heading-one','landmark-one-main','region','skip-link','html-has-lang','document-title','bypass','landmark-unique','aria-allowed-attr'];
      return {violations: r.violations.filter(v=>pick.includes(v.id)).map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.length,targets:v.nodes.slice(0,3).map(n=>n.target.join(' '))})), totalViolations: r.violations.length};
    });
  } catch(e) { axe = {error:String(e).slice(0,100)}; }
  // accessibility tree
  let ax = null;
  try {
    const client = await page.createCDPSession();
    const {nodes} = await client.send('Accessibility.getFullAXTree');
    const heads = nodes.filter(n => n.role && n.role.value === 'heading').map(n => ({
      level: (n.properties||[]).find(p=>p.name==='level')?.value?.value ?? null,
      name: (n.name && n.name.value || '').trim().slice(0,100),
      ignored: !!n.ignored
    }));
    const landmarks = nodes.filter(n => n.role && ['main','navigation','banner','contentinfo','complementary','search'].includes(n.role.value)).map(n=>({role:n.role.value, name:(n.name&&n.name.value||'').slice(0,60), ignored:!!n.ignored}));
    ax = {headings: heads, landmarks};
  } catch(e) { ax = {error: String(e).slice(0,120)}; }
  await page.close();
  return {path, url, status, err, dom, axe, ax};
}

(async () => {
  const browser = await puppeteer.launch({headless:'new', args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
  const out = {checked_on: new Date().toISOString().slice(0,10), tool: 'Chrome for Testing ' + (await browser.version()) + ' (puppeteer), axe-core ' + require('axe-core/package.json').version + ', viewport 1280x900, CDP Accessibility.getFullAXTree', pages: []};
  for (const p of PATHS) {
    try { const d = await pageData(browser, p); out.pages.push(d); console.log('done', p, d.status, (d.ax.headings||[]).filter(h=>!h.ignored).length, 'ax headings'); }
    catch(e) { console.log('fail', p, String(e).slice(0,100)); out.pages.push({path:p, error:String(e).slice(0,200)}); }
  }
  await browser.close();
  fs.writeFileSync('../a11y_data.json', JSON.stringify(out, null, 1));
})();
