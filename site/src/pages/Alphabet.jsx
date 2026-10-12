import { useEffect, useState } from "react";
import { ALPHABET } from "../data/alphabet.js";
import { DIGRAPH_CARDS } from "../lib/digraphs.js";
import { loadSettings, saveSettings } from "../lib/settings.js";
import { LetterCard } from "../components/LetterCard.jsx";
import { LetterBubbles } from "../components/LetterBubbles.jsx";
import { PageHead } from "../components/PageHead.jsx";
import { LuluLive } from "../components/LuluLive.jsx";


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
  let [reaction, setReaction] = useState({ name: "idle", id: 0 });
  let toggleCard = (e) => {
      if (!revealed[e]) {
        // кожна відкрита літера — Lulu прислухається; кожна п'ята — радіє
        let open = Object.values(revealed).filter(Boolean).length + 1;
        setReaction((r) => ({
          name: open % 5 === 0 ? "cheer" : "listen",
          id: r.id + 1,
        }));
      }
      setRevealed((t) => ({
        ...t,
        [e]: !t[e],
      }));
    },
    ids = [
      ...ALPHABET.map((t) => t.letter),
      ...(settings.digraphsEnabled
        ? DIGRAPH_CARDS.map((t) => `digraph_${t.key}`)
        : []),
    ],
    allOpen = ids.every((i) => revealed[i]),
    toggleAll = () => {
      if (!allOpen) setReaction((r) => ({ name: "cheer", id: r.id + 1 }));
      setRevealed(allOpen ? {} : Object.fromEntries(ids.map((i) => [i, true])));
    },
    toggleDigraphs = () =>
      saveSettings({ ...settings, digraphsEnabled: !settings.digraphsEnabled }),
    opened = Object.values(revealed).filter(Boolean).length;
  return (
    <>
      <LetterBubbles />
      <PageHead
        icon="icon-read.svg"
        eyebrow="Practice · Алфавіт"
        title="Як звучать англійські літери"
      >
        У кутку картки записано, як літера називається. Натисни на картку, і
        знизу з'явиться українська опора: як літера звучить у слові.
      </PageHead>
      <div className="panel fade-up">
        <div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px 20px",
              marginBottom: "20px",
            }}
          >
            <ul className="legend" style={{ margin: 0 }}>
              <li>
                <i />
                Приголосні
              </li>
              <li className="v">
                <i />
                Голосні
              </li>
              {settings.digraphsEnabled && (
                <li className="d">
                  <i />
                  Диграфи
                </li>
              )}
            </ul>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              <button
                type="button"
                className="pill"
                aria-pressed={settings.digraphsEnabled}
                onClick={toggleDigraphs}
              >
                Диграфи
              </button>
              <button type="button" className="pill" onClick={toggleAll}>
                {allOpen ? "Сховати всі" : "Відкрити всі"}
              </button>
            </div>
          </div>
          <ul className="letter-grid">
            {ALPHABET.map((t) => (
              <LetterCard
                key={t.letter}
                id={t.letter}
                displayTop={t.letter}
                displayBottom={t.lower}
                ukrName={t.ukrName}
                ukrSupport={t.ukrSupport}
                isVowel={t.type === "vowel"}
                isDigraph={false}
                isActive={!!revealed[t.letter]}
                onClick={toggleCard}
              />
            ))}
          </ul>
          {settings.digraphsEnabled && (
            <>
              <h2 className="digraphs-title">Диграфи: дві літери, один звук</h2>
              <ul className="letter-grid wide">
                {DIGRAPH_CARDS.map((t) => (
                  <LetterCard
                    key={t.key}
                    id={`digraph_${t.key}`}
                    displayTop={t.key}
                    displayBottom={null}
                    ukrName={null}
                    ukrSupport={t.ukrSupport}
                    isVowel={false}
                    isDigraph={true}
                    isActive={!!revealed[`digraph_${t.key}`]}
                    onClick={toggleCard}
                  />
                ))}
              </ul>
            </>
          )}
        </div>
        <div className="panel-lulu">
          <LuluLive react={reaction} label="Lulu слухає разом з тобою" />
          <p className="bubble" aria-live="polite">
            {opened === 0
              ? "Обери літеру й натисни на картку"
              : opened >= 5
                ? "У тебе виходить!"
                : "Прислухайся до звука"}
          </p>
        </div>
      </div>
    </>
  );
}
