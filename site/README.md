# Phonics4All: вихідний код сайту

Відтворено з живого сайту phonics4all.fun (версія від 06.04.2026). Зібрана версія збігається з оригіналом до пікселя.

## Структура
- `src/pages/` — сторінки: `Home`, `Alphabet`, `WordPractice`, `Parents`
- `src/components/` — меню (`Layout`), картка літери (`LetterCard`), бульбашки на фоні (`LetterBubbles`)
- `src/data/` — абетка (`alphabet.js`) і вбудовані слова (`words.js`)
- `src/lib/` — налаштування, колоди слів, діграфи (все зберігається в localStorage браузера)
- `public/` — логотип та іконки

## Команди
```
npm install      # один раз
npm run dev      # локальний перегляд
npm run build    # готова версія у папці dist/ — її вміст кладемо в www/ на хостингу
```
