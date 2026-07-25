import puppeteer from 'puppeteer-core';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
await page.goto('http://127.0.0.1:4599/', { waitUntil: 'networkidle0' });
await page.evaluate(() => window.scrollTo(0, 0));
await new Promise(r => setTimeout(r, 3800));
await page.screenshot({ path: '/tmp/mbm-hero.png' });

// overflow horizontal? (clássico de export do Figma)
const overflow = await page.evaluate(() => ({
  docW: document.documentElement.scrollWidth,
  winW: window.innerWidth,
  offenders: [...document.querySelectorAll('*')]
    .filter(e => e.getBoundingClientRect().right > window.innerWidth + 2)
    .slice(0, 6)
    .map(e => `${e.tagName}.${(e.className || '').toString().slice(0, 60)} → ${Math.round(e.getBoundingClientRect().right)}px`),
}));

const tops = await page.evaluate(() => [...document.querySelectorAll('main > *')].map(e => e.getBoundingClientRect().top + window.scrollY));
const names = ['hero','about','cases','capabilities','footer'];
for (let i = 1; i < tops.length; i++) {
  await page.evaluate(y => window.scrollTo(0, y), tops[i]);
  await new Promise(r => setTimeout(r, 1800));
  await page.screenshot({ path: `/tmp/mbm-${names[i]}.png` });
}
console.log(JSON.stringify(overflow, null, 2));
await browser.close();
