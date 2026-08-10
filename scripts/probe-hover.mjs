import puppeteer from 'puppeteer-core';
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--no-sandbox'] });
const p = await b.newPage();
await p.setViewport({ width: 1600, height: 1000 });
await p.goto('http://127.0.0.1:4599/v3', { waitUntil: 'networkidle2' });
await p.evaluate(() => document.fonts.ready);

// 1. nav: ■ vazio → preenchido
const navSel = 'header a.v3-qh';
const antes = await p.$eval(navSel, (el) => getComputedStyle(el, '::before').backgroundColor);
await p.hover(navSel);
await new Promise((r) => setTimeout(r, 300));
const depois = await p.$eval(navSel, (el) => getComputedStyle(el, '::before').backgroundColor);
console.log('nav ::before —', antes, '→', depois);

// 2. card do carrossel: foco 0 → 1 (rola até a seção antes)
await p.evaluate(() => window.scrollTo(0, 1800));
await new Promise((r) => setTimeout(r, 600));
const card = await p.$('.v3-trilho a .v3-foco');
if (card) {
  const fAntes = await card.evaluate((el) => getComputedStyle(el).opacity);
  await p.hover('.v3-trilho a');
  await new Promise((r) => setTimeout(r, 350));
  const fDepois = await card.evaluate((el) => getComputedStyle(el).opacity);
  console.log('foco do card —', fAntes, '→', fDepois);
} else console.log('foco do card — NÃO ACHOU');
await b.close();
