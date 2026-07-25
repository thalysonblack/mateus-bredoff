import puppeteer from 'puppeteer-core';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const URL = 'http://127.0.0.1:4599/';

const browser = await puppeteer.launch({
  executablePath: CHROME, headless: 'new',
  args: ['--no-sandbox', '--force-device-scale-factor=1', '--font-render-hinting=none'],
});
const page = await browser.newPage();
const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push('[console] ' + m.text()); });
page.on('pageerror', e => errors.push('[pageerror] ' + e.message));
page.on('requestfailed', r => errors.push('[404/fail] ' + r.url() + ' — ' + r.failure()?.errorText));

await page.setViewport({ width: 1600, height: 1000, deviceScaleFactor: 1 });
await page.goto(URL, { waitUntil: 'networkidle0', timeout: 60000 });
await new Promise(r => setTimeout(r, 3500)); // deixa a intro do hero terminar

// fontes realmente carregadas?
const fonts = await page.evaluate(async () => {
  await document.fonts.ready;
  const loaded = [...document.fonts].filter(f => f.status === 'loaded').map(f => `${f.family} ${f.weight}`);
  const el = document.querySelector('section p');
  return { loaded: [...new Set(loaded)], sampleFont: el ? getComputedStyle(el).fontFamily : null };
});

const sections = ['Hero', 'About', 'Cases', 'Capabilities', 'Footer'];
const tops = await page.evaluate(() => [...document.querySelectorAll('main > *')].map(e => e.getBoundingClientRect().top + window.scrollY));
for (let i = 0; i < tops.length; i++) {
  await page.evaluate(y => window.scrollTo(0, y), tops[i]);
  await new Promise(r => setTimeout(r, 1600));
  await page.screenshot({ path: `/tmp/mb-${i}-${sections[i] ?? i}.png` });
}

// mobile
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
await page.reload({ waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 3500));
await page.screenshot({ path: '/tmp/mb-mobile-hero.png' });
await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.2));
await new Promise(r => setTimeout(r, 1500));
await page.screenshot({ path: '/tmp/mb-mobile-about.png' });

console.log(JSON.stringify({ fonts, errors, sectionCount: tops.length }, null, 2));
await browser.close();
