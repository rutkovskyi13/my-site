import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 860 } });
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto('http://localhost:8766/landing/', { waitUntil: 'networkidle' }); await p.waitForTimeout(2000);
await p.mouse.wheel(0, 1200); await p.waitForTimeout(1500);
// fast scroll: big wheel jumps, sample guide position immediately
const pos = [];
for (let i = 0; i < 25; i++) { await p.mouse.wheel(0, i % 2 ? -700 : 900); pos.push(await p.evaluate(() => { const r = document.querySelector('.lulu-guide').getBoundingClientRect(); return Math.round(r.x) + ',' + Math.round(r.y) + ',' + Math.round(r.width); })); }
console.log('guide rects during fast scroll:', [...new Set(pos)].join(' | '));
await p.screenshot({ path: process.argv[2] + '/fast.png' });
await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(1500);
for (const [x, n] of [[60, 'left'], [1400, 'right'], [1110, 'center']]) { await p.mouse.move(x, 450, { steps: 4 }); await p.waitForTimeout(1200);
  const idx = await p.evaluate(() => [...document.querySelectorAll('#stage .lulu > img')].findIndex(i => +i.style.opacity === 1));
  await p.screenshot({ path: process.argv[2] + `/look-${n}.png`, clip: { x: 760, y: 150, width: 560, height: 650 } }); console.log(n, 'frame', idx); }
console.log('errors', errs.join('|') || 'none');
await b.close();
