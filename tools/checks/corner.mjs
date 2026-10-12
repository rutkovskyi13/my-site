import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const out = process.argv[2];
const b = await chromium.launch();
const errs = [];
for (const w of [1440, 1100]) {
  const p = await b.newPage({ viewport: { width: w, height: 860 } });
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  p.on('response', r => r.status() >= 400 && errs.push(r.status() + ' ' + r.url()));
  await p.goto('http://localhost:8766/landing/', { waitUntil: 'networkidle' }); await p.waitForTimeout(1200);
  await p.mouse.wheel(0, 300); await p.waitForTimeout(500); await p.screenshot({ path: `${out}/${w}-a-flight.png` });
  for (const sel of ['#traps', '#tiles', '.price-card']) {
    await p.evaluate(s => document.querySelector(s).scrollIntoView({ block: 'center' }), sel);
    await p.mouse.wheel(0, 10); await p.waitForTimeout(2000);
    await p.screenshot({ path: `${out}/${w}-${sel.replace(/[#.]/g, '')}.png` });
  }
  await p.click('#hide-lulu'); await p.waitForTimeout(800); await p.screenshot({ path: `${out}/${w}-docked.png` });
  await p.click('#dock'); await p.waitForTimeout(800);
  console.log(w, 'header full width:', await p.evaluate(() => Math.round(document.querySelector('.top').getBoundingClientRect().width)), 'scrollW', await p.evaluate(() => document.documentElement.scrollWidth));
  await p.close();
}
console.log('errors', errs.join('|') || 'none');
await b.close();
