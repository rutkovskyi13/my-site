import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
await p.goto('http://localhost:8766/landing/', { waitUntil: 'networkidle' }); await p.waitForTimeout(2000);
const st = () => p.evaluate(() => { const r = document.querySelector('#stage .lulu'); const ims=[...r.querySelectorAll('img')]; const vis = ims.filter(i => +i.style.opacity > 0).length; const idx = ims.findIndex(i => +i.style.opacity > 0); return { turning: r.classList.contains('turning'), framesVisible: vis, idx, videoPaused: r.querySelector('video').paused, t: +r.querySelector('video').currentTime.toFixed(2) }; });
console.log('idle', await st());
for (let x = 200; x <= 1400; x += 100) { await p.mouse.move(x, 450); await p.waitForTimeout(60); }
console.log('moving', await st());
await p.waitForTimeout(800); console.log('settled', await st());
await p.screenshot({ path: process.argv[2] + '/settled.png', clip: { x: 760, y: 200, width: 500, height: 650 } });
await p.waitForTimeout(3600); console.log('after idle', await st());
await p.waitForTimeout(1000); console.log('playing', await st());
console.log('errors', errs.join('|') || 'none');
await b.close();
