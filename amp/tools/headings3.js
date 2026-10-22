const puppeteer = require('puppeteer');
const fs = require('fs');
const PAGES = ['/', '/pricing', '/about', '/solutions/universities', '/products/channels'];
async function axOrder(client){
  const {nodes}=await client.send('Accessibility.getFullAXTree');
  const byId=new Map(nodes.map(n=>[n.nodeId,n]));
  const root=nodes.find(n=>n.role&&n.role.value==='RootWebArea')||nodes[0];
  const out=[];
  (function walk(n){ if(!n) return; if(n.role&&n.role.value==='heading'&&!n.ignored) out.push({level:(n.properties||[]).find(p=>p.name==='level')?.value?.value??null,name:((n.name&&n.name.value)||'').trim()}); (n.childIds||[]).forEach(id=>walk(byId.get(id))); })(root);
  return out;
}
(async()=>{
  const b=await puppeteer.launch({headless:'new',args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
  const res={checked_on:new Date().toISOString().slice(0,10),tool:{chrome:await b.version(),axe:require('axe-core/package.json').version,viewport:'1280x900'},pages:[]};
  for(const p of PAGES){
    const page=await b.newPage();
    await page.setViewport({width:1280,height:900});
    await page.goto('https://zedu.chat'+p,{waitUntil:'networkidle2',timeout:60000});
    const client=await page.createCDPSession();
    const ax=await axOrder(client);
    const seen=await page.evaluate(async()=>{
      const hs=[...document.querySelectorAll('h1,h2,h3,h4,h5,h6')];
      const out=[];
      for(const h of hs){
        h.scrollIntoView({block:'center'});
        await new Promise(r=>setTimeout(r,220));
        const r=h.getBoundingClientRect();
        const cs=getComputedStyle(h);
        out.push({level:+h.tagName[1],text:(h.textContent||'').trim().replace(/\s+/g,' ').slice(0,90),w:Math.round(r.width),h:Math.round(r.height),opacity:cs.opacity,vis:cs.visibility,shown:r.width>0&&r.height>0&&cs.visibility!=='hidden'&&cs.display!=='none'&&Number(cs.opacity)>0});
      }
      window.scrollTo(0,0);
      return out;
    });
    res.pages.push({path:p,ax,seen});
    console.log(p,'ax',ax.length,'shown',seen.filter(s=>s.shown).length,'of',seen.length);
    await page.close();
  }
  await b.close();
  fs.writeFileSync('../headings_seen.json',JSON.stringify(res,null,1));
})();
