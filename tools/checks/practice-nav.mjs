import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
// Practice: три кола переходів між розділами (1440 і 390 px), Lulu має реагувати, помилок бути не повинно.
// Запуск: сервер з кореня репо (npx --no-install http-server -p 8766 -s -c-1 .), потім node tools/checks/practice-nav.mjs
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const errs = [];
for (const [w,h] of [[1440,900],[390,844]]) {
const p = await b.newPage({ viewport: { width: w, height: h } });
p.on('pageerror', e => errs.push(e.message));
const st = () => p.evaluate(() => [...document.querySelectorAll('.lulu-live video')].map(v => `${v.currentSrc.split('/').pop()}:${v.paused ? 'p' : 'PLAY'}`).join(' '));
await p.goto('http://localhost:8766/landing/practice/index.html#/', { waitUntil: 'networkidle' });
for (let round = 0; round < 3; round++) {
  await p.locator('.subnav .pill', { hasText: 'Читаємо слова' }).click(); await p.waitForTimeout(1500);
  await p.locator('.wtile').first().click(); await p.waitForTimeout(500);
  console.log(w, 'word', round, await st());
  await p.locator('.subnav .pill', { hasText: 'Алфавіт' }).click(); await p.waitForTimeout(1500);
  await p.locator('.letter').first().click(); await p.waitForTimeout(500);
  console.log(w, 'alpha', round, await st());
  await p.locator('.subnav .pill', { hasText: 'Огляд' }).click(); await p.waitForTimeout(800);
}
}
console.log('errors', errs);
await b.close();
