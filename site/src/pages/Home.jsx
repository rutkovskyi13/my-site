import { Link } from "react-router-dom";
import { LetterBubbles } from "../components/LetterBubbles.jsx";

const BASE = import.meta.env.BASE_URL;

// Перший екран тренажера: Lulu поруч із запрошенням і дві головні дії.
const SECTIONS = [
  {
    to: "/alphabet",
    icon: "icon-read.svg",
    tint: "var(--coral-light)",
    title: "Alphabet Sounds",
    text: "Англійські літери з опорою на звуки рідної мови.",
    cta: "Почати з алфавіту",
    btn: "btn-primary",
  },
  {
    to: "/word-practice",
    icon: "icon-connect.svg",
    tint: "var(--ice)",
    title: "Word Practice",
    text: "Зливай звуки й читай перші справжні англійські слова.",
    cta: "Читати слова",
    btn: "btn-secondary",
  },
];

export function Home() {
  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <LetterBubbles />
      <div
        className="flex"
        style={{
          position: "relative",
          zIndex: 1,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "62vh",
          textAlign: "center",
        }}
      >
        <div
          className="animate-bounce-in"
          style={{
            marginBottom: "2.5rem",
          }}
        >
          <img
            src={`${BASE}brand/Lulu-guide-480.webp`}
            alt="Зайчиха Lulu з книжкою"
            width="180"
            height="180"
            style={{
              width: "clamp(130px, 22vw, 180px)",
              height: "auto",
              display: "block",
              margin: "0 auto 12px",
            }}
          />
          <h1>Читаємо разом із Lulu</h1>
          <p
            style={{
              maxWidth: "540px",
              margin: "0 auto",
              fontSize: "1.15rem",
              lineHeight: "1.65",
            }}
          >
            Запрошую до захопливої подорожі у світ читання англійською мовою.
          </p>
        </div>
        <div
          className="grid"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
            gap: "28px",
            width: "100%",
            maxWidth: "860px",
          }}
        >
          {SECTIONS.map((s, i) => (
            <div
              key={s.to}
              className="card float-anim"
              style={{
                animationDelay: `${i * 0.8}s`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  background: s.tint,
                  padding: "18px",
                  borderRadius: "50%",
                  marginBottom: "20px",
                }}
              >
                <img
                  src={`${BASE}brand/${s.icon}`}
                  alt=""
                  width="64"
                  height="64"
                  style={{ display: "block" }}
                />
              </div>
              <h2
                style={{
                  marginBottom: "12px",
                }}
              >
                {s.title}
              </h2>
              <p
                style={{
                  marginBottom: "28px",
                  flex: 1,
                }}
              >
                {s.text}
              </p>
              <Link
                to={s.to}
                className={`btn ${s.btn}`}
                style={{
                  width: "100%",
                  fontSize: "1.1rem",
                }}
              >
                {s.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
