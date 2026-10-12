import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:8766/landing/', { waitUntil: 'networkidle' }); await p.waitForTimeout(1500);
for (let x = 200; x <= 1400; x += 100) { await p.mouse.move(x, 450); await p.waitForTimeout(60); }
await p.waitForTimeout(1500);
const clip = await p.evaluate(() => { const r = document.querySelector('#stage .lulu').getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; });
await p.screenshot({ path: process.argv[2] + '/swap-before.png', clip });
await p.evaluate(() => new Promise(res => { const v = document.querySelector('#stage video'); v.addEventListener('playing', () => { v.pause(); res(); }, { once: true }); }));
await p.waitForTimeout(200);
await p.screenshot({ path: process.argv[2] + '/swap-after.png', clip });
await b.close();
