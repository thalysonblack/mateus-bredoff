import puppeteer from 'puppeteer-core';
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--no-sandbox'] });
const p = await b.newPage();
await p.setViewport({ width: 1600, height: 1000 });
await p.goto('http://127.0.0.1:4599/', { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 3000));
const top = await p.evaluate(() => document.querySelectorAll('main > *')[2].getBoundingClientRect().top + window.scrollY);
await p.evaluate(y => window.scrollTo(0, y), top);
await new Promise(r => setTimeout(r, 1500));
await p.screenshot({ path: '/tmp/cases-nav.png' });
// navegar até o card Ferraci (fundo claro) — o pior caso pro label branco
const clicked = await p.evaluate(() => {
  const el = [...document.querySelectorAll('[role="button"]')].find(e => e.textContent.trim() === 'Ferraci');
  if (el) { el.click(); return true; } return false;
});
await new Promise(r => setTimeout(r, 2500));
await p.screenshot({ path: '/tmp/cases-ferraci.png' });
console.log('clicou em Ferraci:', clicked);
await b.close();
