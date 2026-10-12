# Збирає plus.html з index.html: перший екран-розмова, лисеня-супутник з лапою. Запуск: python3 tools/build_plus.py
src=open('index.html').read().split('\n')
idx=lambda pat: next(i for i,l in enumerate(src) if pat in l)
head_end=idx('</style>')            # css end
top_start=idx('<header class="top">')
hero_start=idx('<section class="hero" id="start">')
step1=idx('<!-- Крок 1 -->')
script_start=idx('<script>')
css='\n'.join(src[1:head_end])       # skip <title>, keep <link>s and <style>…
header_and_main_open='\n'.join(src[top_start:hero_start])
rest_html='\n'.join(src[step1:script_start])
index_js='\n'.join(src[script_start:])

EXTRA_CSS=r'''
/* ===== Plus: перший екран-розмова і лисеня-провідник ===== */
.sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
.talkhero { min-height: calc(100svh - var(--head-h, 150px)); display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); align-items: center; gap: 24px; padding-block: 32px; }
.talk { max-width: 36rem; }
.intro { margin: 0 0 20px; font-size: clamp(18px, 3vw, 23px); line-height: 1.3; filter: blur(3px); user-select: none; pointer-events: none; color: var(--plum-soft); }
.typed { margin: 0 0 26px; font: 800 clamp(26px, 4.2vw, 46px)/1.15 var(--font-head); min-height: 3.45em; }
.caret { display: inline-block; width: 3px; height: 0.95em; background: var(--orange); vertical-align: -0.1em; margin-left: 3px; animation: blink 1s step-end infinite; }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
.pills { display: flex; flex-wrap: wrap; gap: 8px; opacity: 0; transform: translateY(8px); transition: opacity .4s ease, transform .4s ease; }
.pills.show { opacity: 1; transform: none; }
.pill { display: inline-flex; align-items: center; gap: 10px; white-space: nowrap; min-height: 44px; padding: 8px 18px; border-radius: 999px; border: 1.5px solid rgba(53,30,40,.18); background: var(--paper); color: var(--plum); font: 600 15px/1.2 var(--font-body); text-decoration: none; cursor: pointer; transition: background-color .2s, color .2s, border-color .2s; }
.pill:hover { background: var(--plum); color: var(--milk); border-color: var(--plum); }
.pill.main { background: var(--orange); border-color: var(--orange); font-weight: 800; }
.pill.main:hover { background: var(--plum); color: var(--milk); border-color: var(--plum); }
.pill.line { background: transparent; border-color: var(--plum); }
.stage { --stage-h: min(70svh, 640px); position: relative; height: var(--stage-h); display: grid; place-items: end center; touch-action: pan-y; cursor: ew-resize; }
.stage::before { content: ""; position: absolute; left: 50%; bottom: 2%; width: 46%; height: 5%; transform: translateX(-50%); background: radial-gradient(closest-side, rgba(53,30,40,.16), transparent); border-radius: 50%; }
.stage .hint { position: absolute; left: 50%; bottom: -24px; transform: translateX(-50%); font-size: 13px; color: var(--plum-soft); white-space: nowrap; transition: opacity .3s; }

/* Лисеня: тулуб + векторна лапа + п'ять голів */
.fox { position: relative; aspect-ratio: 600 / 640; width: 100%; }
.stage .fox { width: min(100%, calc(var(--stage-h) * 0.9375)); }
.fox .arm { overflow: visible; }
.fox > img, .fox > svg { position: absolute; left: 0; top: 0; width: 100%; }
.fox .body, .fox .arm { height: 100%; }
.fox .head { height: 51.5625%; opacity: 0; will-change: opacity, transform; transform-origin: 50% 92%; }
.fox .head.flip { scale: -1 1; }
.fox .upper { transform-origin: 354px 296px; transition: transform .55s cubic-bezier(.3, 1.35, .5, 1); }
.fox .fore { transform-origin: 398px 402px; transition: transform .45s cubic-bezier(.3, 1.35, .5, 1) .08s; }

/* Супутник збоку (лише на широкому екрані) */
.buddy { position: fixed; z-index: 15; left: 16px; bottom: 16px; width: clamp(150px, calc((100vw - 1160px) / 2 + 30px), 230px); display: none; flex-direction: column; align-items: flex-start; gap: 8px; pointer-events: none; opacity: 0; transform: translateX(-40px); transition: opacity .35s ease, transform .45s cubic-bezier(.3, 1.2, .5, 1); }
.buddy.on { opacity: 1; transform: none; }
.buddy .fox { width: 100%; }
.buddy .bubble { pointer-events: auto; position: relative; background: var(--plum); color: var(--milk); font-weight: 800; font-size: .92rem; line-height: 1.3; padding: 10px 14px; border-radius: 14px; max-width: 220px; opacity: 0; transform: translateY(6px); transition: opacity .25s, transform .25s; }
.buddy .bubble.show { opacity: 1; transform: none; }
.buddy .bubble::after { content: ""; position: absolute; left: 34px; bottom: -8px; border: 8px solid transparent; border-bottom: 0; border-top-color: var(--plum); }
.buddy .bye { pointer-events: auto; position: absolute; top: -12px; right: -12px; width: 32px; height: 32px; border-radius: 50%; border: 1.5px solid var(--plum); background: var(--milk); color: var(--plum); cursor: pointer; font: 800 16px/1 var(--font-body); display: grid; place-items: center; opacity: 0; transition: opacity .2s; }
.buddy:hover .bye, .buddy .bye:focus-visible { opacity: 1; }
.buddy .foxwrap { position: relative; width: 100%; pointer-events: auto; background: var(--milk); border: 2px solid var(--plum); border-radius: 22px; padding: 10px 6px 0; box-shadow: 0 8px 24px rgba(53,30,40,.12); }
.buddy .foxwrap .fox { border-radius: 0 0 18px 18px; }
[data-point].pointed { outline: 3px dashed var(--orange); outline-offset: 8px; border-radius: 12px; transition: outline-color .3s; }
@media (min-width: 1280px) { .buddy { display: flex; } }
@media (max-width: 900px) {
  .talkhero { grid-template-columns: minmax(0, 1fr); align-items: end; }
  .stage { order: -1; --stage-h: 38svh; margin-bottom: 30px; }
  .typed { min-height: 4.6em; }
}
@media (prefers-reduced-motion: reduce) {
  .caret { display: none; }
  .pills, .buddy, .fox .upper, .fox .fore { transition: none; }
}
'''

FOX_MARKUP='''<div class="fox">
        <img class="body" src="assets/turn/body.webp" alt="">
        <svg class="arm" viewBox="0 0 600 640" aria-hidden="true">
          <polygon points="326,280 360,280 412,398 404,448 378,470 348,458 328,420" fill="#FFF9F2"/>
          <polygon points="349,288 365,296 399,476 381,476" fill="#FE6432"/>
        </svg>
        HEADS_HERE
        <svg class="arm" viewBox="0 0 600 640" aria-hidden="true">
          <g class="upper">
            <polygon points="341,290 366,288 412,396 388,412" fill="#FE6432"/>
            <g class="fore"><rect x="381" y="386" width="34" height="76" rx="17" fill="#4D202D" transform="rotate(30 398 402)"/></g>
          </g>
        </svg>
      </div>'''
FOX_MARKUP=FOX_MARKUP.replace('HEADS_HERE', '''<img class="head flip" src="assets/turn/head-profile.webp" alt="">
        <img class="head flip" src="assets/turn/head-three-quarter.webp" alt="">
        <img class="head" src="assets/turn/head-front.webp" alt="" style="opacity:1">
        <img class="head" src="assets/turn/head-three-quarter.webp" alt="">
        <img class="head" src="assets/turn/head-profile.webp" alt="">''')

HERO=f'''  <section class="talkhero wrap" id="start">
    <div class="talk">
      <p class="intro" aria-hidden="true">Привіт, я Лисеня з Phonetics4All.<br>Допомагаю вчителям навчити дітей читати англійською.</p>
      <p class="sr">Привіт, я Лисеня з Phonetics4All. Допомагаю вчителям навчити дітей читати англійською.</p>
      <h1 class="typed"><span class="sr" id="typed-full"></span><span aria-hidden="true" id="typed"></span><span class="caret" id="caret" aria-hidden="true"></span></h1>
      <div class="pills" id="pills">
        <a class="pill main" href="#buy">Купити курс</a>
        <a class="pill" href="#step-1">Чому дитина не читає?</a>
        <a class="pill" href="#step-3">Спробувати тренажер</a>
        <a class="pill" href="#step-5">Подивитися програму</a>
        <a class="pill line" href="#contact">Безкоштовний матеріал у Telegram</a>
      </div>
    </div>
    <div class="stage" id="stage" role="img" aria-label="Лисеня Phonetics4All повертає голову слідом за курсором">
      {FOX_MARKUP}
      <span class="hint" id="hint">Поводіть курсором, і лисеня поверне голову</span>
    </div>
  </section>

'''

BUDDY=f'''
<aside class="buddy" id="buddy" aria-label="Лисеня-провідник">
  <p class="bubble" id="fox-say" aria-live="polite"></p>
  <div class="foxwrap">
    {FOX_MARKUP}
    <button class="bye" id="bye" type="button" aria-label="Сховати лисеня">×</button>
  </div>
</aside>
'''

PLUS_JS=r'''
<script>
(() => {
  const $ = s => document.querySelector(s);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const top = $('.top');
  const setHead = () => document.documentElement.style.setProperty('--head-h', top.offsetHeight + 'px');
  setHead(); addEventListener('resize', setHead);

  /* Репліка, що друкується */
  const TEXT = 'Діти знають літери, але не читають слова? Знаю, як це виправити. З чого почнемо?';
  $('#typed-full').textContent = TEXT;
  const out = $('#typed'), caret = $('#caret');
  if (reduce) { out.textContent = TEXT; caret.remove(); }
  else setTimeout(() => { let i = 0; const t = setInterval(() => { out.textContent = TEXT.slice(0, ++i); if (i >= TEXT.length) { clearInterval(t); caret.remove(); } }, 38); }, 600);
  setTimeout(() => $('#pills').classList.add('show'), reduce ? 0 : 400);

  /* Модель лисеняти: голова (-1…1) і лапа */
  function makeFox(root) {
    const heads = [...root.querySelectorAll('.head')], upper = root.querySelector('.upper'), fore = root.querySelector('.fore');
    const f = { angle: 0, target: 0 };
    f.draw = () => {
      const a = f.angle, pos = (a + 1) * 2, i = Math.floor(clamp(pos, 0, 3.999)), s = clamp((pos - i - 0.3) / 0.4, 0, 1), k = s * s * (3 - 2 * s);
      heads.forEach((im, j) => { const o = j === i ? 1 - k : j === i + 1 ? k : 0; im.style.opacity = o; if (o) im.style.transform = `rotateY(${(j === i ? k : k - 1) * 14}deg) rotate(${a * 4}deg)`; });
    };
    f.point = deg => {   // deg: кут лапи на екрані (0 = праворуч, від'ємний = вгору); null = опустити
      if (deg === null) { upper.style.transform = ''; fore.style.transform = ''; return; }
      upper.style.transform = `rotate(${clamp(deg, -25, 15) - 66}deg)`;
      fore.style.transform = 'rotate(-54deg)';
    };
    f.draw();
    return f;
  }
  const hero = makeFox($('#stage .fox'));
  const buddyEl = $('#buddy'), buddy = makeFox(buddyEl.querySelector('.fox'));

  /* Курсор: обидва лисеняти дивляться на нього */
  let mouseX = innerWidth / 2, lastInput = 0, pointing = false;
  addEventListener('mousemove', e => { mouseX = e.clientX; lastInput = performance.now(); $('#hint').style.opacity = 0; }, { passive: true });
  const stage = $('#stage');
  let dragX = null, dragStart = 0;
  stage.addEventListener('pointerdown', e => { if (e.pointerType === 'mouse') return; dragX = e.clientX; dragStart = hero.target; stage.setPointerCapture(e.pointerId); });
  stage.addEventListener('pointermove', e => { if (dragX === null) return; hero.target = clamp(dragStart + (e.clientX - dragX) / (stage.clientWidth * 0.6), -1, 1); lastInput = performance.now(); $('#hint').style.opacity = 0; });
  ['pointerup', 'pointercancel'].forEach(t => stage.addEventListener(t, () => { dragX = null; }));
  if (matchMedia('(hover: none)').matches) $('#hint').textContent = 'Проведіть пальцем по лисеняті';

  /* Супутник: з'являється, коли перший екран прокручено */
  let heroVisible = true, buddyOn = false, dismissed = false;
  try { dismissed = sessionStorage.getItem('fox-bye') === '1'; } catch (e) {}
  new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; sync(); }, { threshold: 0.15 }).observe($('#start'));
  function sync() {
    buddyOn = !heroVisible && !dismissed && innerWidth >= 1280;
    buddyEl.classList.toggle('on', buddyOn);
    buddyEl.setAttribute('aria-hidden', !buddyOn);
  }
  addEventListener('resize', sync);
  $('#bye').onclick = () => { dismissed = true; try { sessionStorage.setItem('fox-bye', '1'); } catch (e) {} sync(); };

  /* Підказки: лисеня показує лапою, коли блок доходить до середини екрана */
  const TIPS = [
    ['#why-list', 'Оберіть ситуацію зі свого уроку'],
    ['#traps', 'Ці звуки діти підміняють найчастіше'],
    ['#tiles', 'Змінюйте звуки стрілками і зливайте їх'],
    ['.games', 'Ігри, які ви отримаєте в курсі'],
    ['.program', 'Шість модулів, як шість кроків читання'],
    ['.price-card', 'Тут можна купити курс'],
    ['#form', 'Маєте питання? Напишіть Альоні']
  ];
  const tips = TIPS.map(([sel, text]) => { const el = $(sel); if (el) el.dataset.point = ''; return el && { el, text, shown: false }; }).filter(Boolean);
  const bubble = $("#fox-say");
  let current = null, hideT = 0;
  function show(tip) {
    if (current) current.el.classList.remove('pointed');
    current = tip; tip.shown = true;
    bubble.textContent = tip.text; bubble.classList.add('show');
    tip.el.classList.add('pointed');
    pointing = true;
    clearTimeout(hideT);
    hideT = setTimeout(() => { pointing = false; buddy.point(null); bubble.classList.remove('show'); tip.el.classList.remove('pointed'); current = null; }, 3600);
  }
  let lastCheck = 0;
  function checkTips(now) {
    if (now - lastCheck < 150) return; lastCheck = now;
    for (const t of tips) {
      const r = t.el.getBoundingClientRect(), c = r.top + Math.min(r.height, innerHeight) / 2;
      if (r.top > innerHeight) t.shown = false;                       // повернулись вище: можна показати знову
      else if (!t.shown && !pointing && c > innerHeight * 0.3 && c < innerHeight * 0.7) { show(t); break; }
    }
  }

  /* Один цикл анімації на обидва лисеняти */
  function aimAt(fox, foxEl) {
    const r = foxEl.getBoundingClientRect();
    return clamp((mouseX - (r.left + r.width / 2)) / (innerWidth * 0.45), -1, 1);
  }
  function tick(now) {
    const idle = now - lastInput > 3500;
    if (heroVisible) {
      if (dragX === null) hero.target = idle ? Math.sin(now / 1600) * 0.35 : aimAt(hero, stage);
      hero.angle += (hero.target - hero.angle) * 0.12; hero.draw();
    }
    if (buddyOn) {
      checkTips(now);
      const foxEl = buddyEl.querySelector('.fox');
      if (pointing && current) {
        buddy.target = 0.5;
        const fr = foxEl.getBoundingClientRect(), tr = current.el.getBoundingClientRect();
        const sx = fr.left + fr.width * 0.59, sy = fr.top + fr.height * 0.46;
        const ty = clamp(tr.top + tr.height / 2, 80, innerHeight - 40), tx = Math.max(tr.left, sx + 80);
        buddy.point(Math.atan2(ty - sy, tx - sx) * 180 / Math.PI);
      } else buddy.target = idle ? Math.sin(now / 1900) * 0.25 : aimAt(buddy, foxEl);
      buddy.angle += (buddy.target - buddy.angle) * 0.12; buddy.draw();
    }
    requestAnimationFrame(tick);
  }
  if (reduce) { hero.draw(); buddy.draw(); }
  requestAnimationFrame(tick);
})();
</script>'''

title='<title>Phonetics4All Plus</title>\n<meta name="description" content="Plus-версія сайту: лисеня-провідник повертає голову за курсором і показує лапою на важливі блоки.">'
css=css.replace('</style>','')  # css chunk ends before </style> anyway
page=title+'\n'+css+EXTRA_CSS+'</style>\n\n'+header_and_main_open+HERO+rest_html+BUDDY+'\n'+index_js+'\n'+PLUS_JS+'\n'
open('plus.html','w').write(page)
print(len(page))
