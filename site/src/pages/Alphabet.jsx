import { useEffect, useState } from "react";
import { ALPHABET } from "../data/alphabet.js";
import { DIGRAPH_CARDS } from "../lib/digraphs.js";
import { loadSettings } from "../lib/settings.js";
import { LetterCard } from "../components/LetterCard.jsx";

export function Alphabet() {
  let [revealed, setRevealed] = useState({}),
    [settings, setSettings] = useState(loadSettings);
  useEffect(() => {
    let e = () => setSettings(loadSettings());
    return (
      window.addEventListener("phonics4all_settings_updated", e),
      () => window.removeEventListener("phonics4all_settings_updated", e)
    );
  }, []);
  let toggleCard = (e) => {
    setRevealed((t) => ({
      ...t,
      [e]: !t[e],
    }));
  };
  return (
    <div>
      <div
        className="text-center animate-bounce-in"
        style={{
          marginBottom: "48px",
        }}
      >
        <h1 className="text-gradient-blue">Alphabet Sounds</h1>
        <p
          style={{
            fontSize: "1.15rem",
            fontWeight: "500",
          }}
        >
          Натисніть на картку, щоб побачити відповідну українську літеру!
        </p>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        {ALPHABET.map((t, n) => (
          <LetterCard
            key={t.letter}
            id={t.letter}
            displayTop={t.letter}
            displayBottom={t.lower}
            ukrName={t.ukrName}
            ukrSupport={t.ukrSupport}
            isVowel={t.type === "vowel"}
            isDigraph={false}
            index={n}
            isActive={!!revealed[t.letter]}
            onClick={toggleCard}
          />
        ))}
      </div>
      {settings.digraphsEnabled && (
        <div
          style={{
            maxWidth: "1000px",
            margin: "52px auto 0",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                flex: 1,
                height: "2px",
                background: "var(--lavender-light)",
                borderRadius: "2px",
              }}
            />
            <span
              style={{
                fontSize: "0.95rem",
                fontWeight: "800",
                color: "var(--lavender-dark)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                padding: "4px 14px",
                background: "var(--lavender-light)",
                borderRadius: "var(--radius-pill)",
                border: "1.5px solid rgba(183,146,255,0.4)",
              }}
            >
              ✨ Digraphs
            </span>
            <div
              style={{
                flex: 1,
                height: "2px",
                background: "var(--lavender-light)",
                borderRadius: "2px",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              justifyContent: "center",
            }}
          >
            {DIGRAPH_CARDS.map((t, n) => (
              <LetterCard
                key={t.key}
                id={`digraph_${t.key}`}
                displayTop={t.key}
                displayBottom={null}
                ukrName={null}
                ukrSupport={t.ukrSupport}
                isVowel={false}
                isDigraph={true}
                index={n}
                isActive={!!revealed[`digraph_${t.key}`]}
                onClick={toggleCard}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
