const { chromium } = require('playwright-core');
(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' });
  const urls = process.argv.slice(2);
  for (const u of urls) {
    const page = await ctx.newPage();
    try {
      await page.goto(u, { waitUntil: 'networkidle', timeout: 45000 });
      const data = await page.evaluate(() => ({
        title: document.title,
        h1: [...document.querySelectorAll('h1')].map(h => ({ t: h.innerText.replace(/\s+/g, ' ').trim().slice(0, 70), h: Math.round(h.getBoundingClientRect().height) })),
        canonical: document.querySelector('link[rel=canonical]')?.href || null,
        desc: document.querySelector('meta[name=description]')?.content?.slice(0, 80) || null,
      }));
      console.log(JSON.stringify({ url: u, ...data }));
    } catch (e) {
      console.log(JSON.stringify({ url: u, error: String(e).slice(0, 120) }));
    }
    await page.close();
  }
  await browser.close();
})();
