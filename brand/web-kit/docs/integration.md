# Підключення

Скопіюйте assets, fonts і styles в одну публічну директорію. Відносні шляхи в CSS залежать від цієї структури. Якщо використовуєте /brand/, додайте цей префікс у HTML та manifest.

```html
<link rel="stylesheet" href="/brand/styles/phonics4all.css">
<link rel="icon" href="/brand/assets/favicons/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/brand/assets/favicons/favicon.ico" sizes="any">
<link rel="apple-touch-icon" href="/brand/assets/favicons/icon-180.png">
<link rel="manifest" href="/brand/site.webmanifest">
<meta name="theme-color" content="#302047">
```

CSS застосовує оформлення компонентів у .p4a-scope; змінні доступні через :root. Для існуючого сайту можна перенести лише токени та потрібні класи.

```html
<div class="p4a-scope">
  <img class="p4a-logo" src="/brand/assets/logos/logo-horizontal.svg" alt="Phonics4All">
  <a class="p4a-button" href="/reading">Матеріали для читання</a>
  <section class="p4a-pattern p4a-pattern--books">...</section>
</div>
```

Не кладіть текст безпосередньо поверх щільного патерну: використовуйте чисту картку. SVG-тайли повторюйте через background-repeat; масштаб задавайте background-size. P5 — 320px, решта — 240px. Вони не містять зовнішніх шрифтів чи зображень.

## Іконки

Кольорові іконки можна вставляти через img. Для зміни кольору використовуйте inline SVG з assets/icons/mono або sprite:

```html
<svg class="p4a-icon" aria-hidden="true" style="color:var(--p4a-violet)">
  <use href="/brand/assets/icons/sprite.svg#icon-read"></use>
</svg>
```

ID: icon-listen, icon-speak, icon-read, icon-connect, icon-write, icon-progress. Зовнішній sprite має бути на тому самому origin і подаватися як image/svg+xml. Якщо піктограма дублює текст, aria-hidden="true". Окрема кнопка з іконкою потребує доступної назви. currentColor не успадковується всередину SVG, вставленого через img.

## Персонажі

```html
<picture>
  <source type="image/webp"
    srcset="/brand/assets/characters/Lulu-480.webp 480w,
            /brand/assets/characters/Lulu-960.webp 960w"
    sizes="(max-width:700px) 80vw, 400px">
  <img src="/brand/assets/characters/Lulu.png" alt="Lulu читає книгу"
       style="max-width:100%;height:auto">
</picture>
```

Для головної ілюстрації не застосовуйте lazy loading; для нижніх секцій застосовуйте loading="lazy". У виробничому макеті задайте width і height згідно з assets-manifest.json для резервування місця. Масштабуйте пропорційно. Не додавайте кольорові фільтри. Декоративний персонаж — alt="".

## Колір, типографіка і розміри

Для звичайного тексту та кнопок використовуйте фіолетовий і кремовий/білий. Помаранчевий та блакитний — акценти; не використовуйте білий дрібний текст на цих заливках. Основні текстові пари перевірені за формулою WCAG, значення в docs/contrast.json.

Nunito Sans: 400 для тексту, 600 для кнопок, 800 для заголовків. Andika: 400/700 для навчальних слів. Уникайте синтетичних ваг, яких немає в комплекті.
Горизонтальний логотип: рекомендовано від 280 CSS px. Для вузького мобільного заголовка використовуйте знак від 64 CSS px і текстову назву поруч. Кольорові іконки: від 48 CSS px; вони містять деталі й не призначені для 16px. Для навігації можна брати монохромні версії від 32px після перевірки читабельності.

Це комплект оформлення, а не реалізований сайт. Поведінка кнопок, маршрути, SEO, cookie consent та тексти визначаються під час розробки.
