# Жива Lulu у «Читаємо слова»: кліпи для генерації

Зараз у вправі «Читаємо слова» Lulu — три нерухомі картинки, які просто змінюють одна одну:
«Спершу спробуй прочитати сам» → «Спробуй злити звуки разом» → «Усі звуки відкриті!».
План: замінити їх короткими відео, які вмикаються в ті самі моменти, а між ними Lulu постійно «живе».

## Головне правило для всіх кліпів

Кожен кліп **починається і закінчується одним і тим самим кадром** — `start-frame.png`
(Lulu з книжкою на зеленому фоні). Тоді будь-який кліп можна «зшити» з будь-яким іншим без стрибка.
У генераторі вмикаємо режим «перший і останній кадр» (first & last frame / start & end frame)
і ставимо цю картинку в обидва місця.

Спільне для всіх кліпів:
- 1920×1080, 24 кадри/с, без звуку;
- фон — рівний зелений, без тіней і градієнтів;
- камера нерухома, Lulu на тому самому місці й того самого розміру;
- Lulu не виходить за кадр, не зникає книжка.

Додавайте до кожного промпта такий хвіст:

> Static camera, no zoom, no camera movement. Flat solid chroma-key green background, no shadows on the background. Same character, same size, same position in frame. The video starts and ends on exactly the provided frame. Soft 3D children's animation style, smooth gentle motion.

## Кліпи

| № | Назва файлу | Коли грає | Тривалість | Промпт (англійською, для генератора) |
|---|---|---|---|---|
| 1 | `lulu-idle.mp4` | Нове слово, дитина ще нічого не натиснула. Грає по колу. | 4–6 с, повтор | Lulu the lavender bunny stands holding an open pink book, breathing gently, blinks twice, glances at the viewer with a soft smile, then looks back at the book. Ears sway slightly. |
| 2 | `lulu-listen.mp4` | Щоразу, коли дитина відкриває звук на плитці. | 1,5–2 с, один раз | Lulu's ears perk up as if she hears a sound, she tilts her head slightly to her right side (viewer's left) listening, gives a small nod, then returns to reading the book. |
| 3 | `lulu-read.mp4` | Відкрито кілька звуків. Грає по колу. | 4–6 с, повтор | Lulu reads the open book with focus, moving her eyes along the line, mouth moving softly as if sounding out a word, small encouraging nods. |
| 4 | `lulu-cheer.mp4` | Усі звуки відкрито (слово прочитане). | 2,5–3 с, один раз | Lulu lights up with joy, lifts the open book up happily, does a small happy hop and wiggles her ears, smiles at the viewer, then settles back to holding the book. |
| 5 | `lulu-hint.mp4` | Дитина нічого не робить ~10 секунд. | 2–3 с, один раз | Lulu lowers the book with one paw and points with the other paw to her right side (viewer's left), looking there encouragingly, then returns to holding the book with both paws. |
| 6 | `lulu-page.mp4` | Перехід до наступного слова. | 1,5–2 с, один раз | Lulu turns a page of her open book with one paw, looks at the new page curiously, then holds the book with both paws again. |

Картки зі словами на сторінці стоять **ліворуч від Lulu**, тому в кліпах 2 і 5 вона дивиться й показує в бік глядача ліворуч.

## Як це підключимо (для розробки)

- Кожен кліп обробляємо як `lulu-cat`: вирізаємо зелений фон, робимо прозорим (stacked alpha + WebGL, `site/src/components/LuluCat.jsx`).
- Повторювані кліпи (1, 3) замикаємо на найближчих кадрах, як `tools/lulu-cat-render.py`.
- Реакції (2, 4, 5, 6) вмикаються одразу після дії дитини. Щоб не чекати кінця поточного кліпу, перемикаємо з короткою (~0,15 с) змішкою двох відео на canvas; оскільки всі кліпи починаються з тієї самої пози, змішка майже непомітна.
- Після реакції повертаємось до відповідного повтору (1 або 3); після 4 — до 1 на наступному слові.
