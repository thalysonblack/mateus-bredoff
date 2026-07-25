import puppeteer from 'puppeteer-core';
const URL = 'https://mateus-bredoff.vercel.app';
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--no-sandbox'] });
const p = await b.newPage();
const bad = [], bytes = {};
p.on('pageerror', e => bad.push('pageerror: ' + e.message));
p.on('console', m => { if (m.type() === 'error') bad.push('console: ' + m.text()); });
p.on('response', async r => {
  const s = r.status();
  if (s >= 400) bad.push(`${s} ${r.url()}`);
  const len = Number(r.headers()['content-length'] || 0);
  const t = r.request().resourceType();
  bytes[t] = (bytes[t] || 0) + len;
});
await p.setViewport({ width: 1600, height: 1000 });
const t0 = Date.now();
await p.goto(URL, { waitUntil: 'networkidle0', timeout: 60000 });
const loadMs = Date.now() - t0;
await new Promise(r => setTimeout(r, 3500));
const meta = await p.evaluate(async () => {
  await document.fonts.ready;
  const g = (sel, attr) => document.querySelector(sel)?.getAttribute(attr) ?? null;
  return {
    title: document.title,
    og: g('meta[property="og:image"]', 'content'),
    desc: g('meta[name="description"]', 'content')?.slice(0, 50) + '…',
    fontsLoaded: [...document.fonts].filter(f => f.status === 'loaded').length,
    heroSrc: document.querySelector('section img')?.currentSrc?.split('/').pop(),
    remoteHotlinks: [...document.images].map(i => i.currentSrc).filter(u => !u.startsWith(location.origin)),
  };
});
await p.screenshot({ path: '/tmp/prod-hero.png' });
console.log(JSON.stringify({ loadMs, meta, bad, kb: Object.fromEntries(Object.entries(bytes).map(([k,v]) => [k, Math.round(v/1024)+'KB'])) }, null, 2));
await b.close();
