import { Link } from "react-router-dom";
import { LetterBubbles } from "../components/LetterBubbles.jsx";
import { LuluCat } from "../components/LuluCat.jsx";

const BASE = import.meta.env.BASE_URL;
const SECTIONS = [
  {
    to: "/alphabet",
    icon: "icon-read.svg",
    title: "Алфавіт",
    text: "Як називаються англійські літери і як вони звучать у слові, з опорою на рідну мову.",
    cta: "Відкрити алфавіт",
  },
  {
    to: "/word-practice",
    icon: "icon-connect.svg",
    title: "Читаємо слова",
    text: "Короткі слова звук за звуком. Забув звук? Натисни на літеру й перевір себе.",
    cta: "Читати слова",
  },
  {
    to: "/dashboard",
    icon: "icon-progress.svg",
    title: "Для дорослих",
    text: "Правила читання, поради й власні колоди слів для занять з дитиною.",
    cta: "Відкрити майстерню",
  },
];

// Перший екран Practice зібраний як на сайті курсу: текст ліворуч, Lulu праворуч, далі білі картки розділів.
export function Home() {
  return (
    <>
      <LetterBubbles />
      <section className="hero fade-up">
        <div className="stack">
          <div className="eyebrow" style={{ marginBottom: 0 }}>
            <img
              src={`${BASE}brand/icon-listen.svg`}
              alt=""
              width="40"
              height="40"
            />
            Practice · Тренажер читання
          </div>
          <h1>Читаємо разом із Lulu</h1>
          <p className="lead muted">
            Запрошую до захопливої подорожі у світ читання англійською мовою.
            Почніть з алфавіту, а потім складайте звуки в слова.
          </p>
          <div className="ctas">
            <Link className="btn btn-primary" to="/alphabet">
              Почати з алфавіту
            </Link>
            <Link className="btn btn-ghost" to="/word-practice">
              Читати слова
            </Link>
          </div>
        </div>
        <div className="hero-art">
          {/* Lulu складає слово CAT: прозорий фон, повтор без стику */}
          <LuluCat className="hero-video" />
        </div>
      </section>
      <div className="cards3">
        {SECTIONS.map((s) => (
          <Link key={s.to} to={s.to} className="card card-link">
            <img src={`${BASE}brand/${s.icon}`} alt="" width="48" height="48" />
            <h2 style={{ fontSize: "var(--step-1)" }}>{s.title}</h2>
            <p className="muted">{s.text}</p>
            <span className="go">{s.cta} →</span>
          </Link>
        ))}
      </div>
    </>
  );
}
