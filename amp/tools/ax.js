const puppeteer = require('puppeteer');
(async () => {
  const url = process.argv[2] || 'https://zedu.chat/';
  const browser = await puppeteer.launch({headless: 'new', args: ['--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--font-render-hinting=none']});
  const page = await browser.newPage();
  await page.setViewport({width: 1280, height: 900});
  await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36');
  const resp = await page.goto(url, {waitUntil: 'networkidle2', timeout: 60000});
  await new Promise(r=>setTimeout(r,1200));
  const info = await page.evaluate(() => {
    const t = e => (e.textContent||'').trim().replace(/\s+/g,' ');
    const hs = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(e => ({
      level: +e.tagName[1], text: t(e).slice(0,80), visible: !!(e.offsetWidth||e.offsetHeight), ariaHidden: e.getAttribute('aria-hidden') }));
    return {
      title: document.title, lang: document.documentElement.lang || null,
      counts: hs.reduce((a,h)=>{a['h'+h.level]=(a['h'+h.level]||0)+1;return a;},{}),
      headings: hs,
      landmarks: {main:document.querySelectorAll('main').length, header:document.querySelectorAll('header').length,
        nav:document.querySelectorAll('nav').length, footer:document.querySelectorAll('footer').length,
        roleMain:document.querySelectorAll('[role=main]').length, roleNav:document.querySelectorAll('[role=navigation]').length},
      skipLinks: [...document.querySelectorAll('a[href^="#"]')].map(a=>a.getAttribute('href'))
    };
  });
  console.log(JSON.stringify({url, status: resp && resp.status(), ...info}, null, 1));
  await browser.close();
})();
