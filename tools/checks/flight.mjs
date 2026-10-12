import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 860 } });
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto('http://localhost:8766/landing/', { waitUntil: 'networkidle' }); await p.waitForTimeout(2500);
const shots = [];
for (let i = 0; i < 6; i++) { await p.mouse.wheel(0, 90); await p.waitForTimeout(250);
  shots.push(await p.evaluate(() => { const l = document.querySelector('.lulu-guide'); const pt = l.classList.contains('on'); const vis = pt ? [...l.querySelectorAll('img')].some(i => i.style.opacity == 1 && i.complete) : true; return `${l.className} visible=${vis}`; }));
  await p.screenshot({ path: process.argv[2] + `/fl-${i}.png` }); }
console.log(shots.join('\n')); console.log('errors', errs.join('|') || 'none');
await b.close();
