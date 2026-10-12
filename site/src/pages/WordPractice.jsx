import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, List, X } from "lucide-react";
import { PageHead } from "../components/PageHead.jsx";
import { LuluLive } from "../components/LuluLive.jsx";

const VOWELS = ["a", "e", "i", "o", "u"];
import { DEFAULT_WORDS } from "../data/words.js";
import { loadDecks } from "../lib/decks.js";

export const DEFAULT_DECK_ID = "default";
export function WordPractice() {
  let [decks, setDecks] = useState(loadDecks),
    [activeDeckId, setActiveDeckId] = useState(DEFAULT_DECK_ID),
    [wordIndex, setWordIndex] = useState(0),
    [revealed, setRevealed] = useState({}),
    [listOpen, setListOpen] = useState(false),
    [reaction, setReaction] = useState({ name: "idle", id: 0 }),
    touchStartX = useRef(null);
  useEffect(() => {
    let e = () => {
      let e = loadDecks();
      (setDecks(e),
        setActiveDeckId((t) =>
          t === DEFAULT_DECK_ID || e.some((e) => e.id === t)
            ? t
            : DEFAULT_DECK_ID,
        ));
    };
    return (
      window.addEventListener("phonics4all_decks_updated", e),
      window.addEventListener("storage", e),
      () => {
        (window.removeEventListener("phonics4all_decks_updated", e),
          window.removeEventListener("storage", e));
      }
    );
  }, []);
  let allDecks = [
      {
        id: DEFAULT_DECK_ID,
        name: "Основні слова",
        emoji: "📖",
        words: DEFAULT_WORDS,
      },
      ...decks,
    ],
    activeDeck = allDecks.find((e) => e.id === activeDeckId) || allDecks[0],
    words = activeDeck.words;
  useEffect(() => {
    words.length !== 0 && setWordIndex((e) => Math.min(e, words.length - 1));
  }, [activeDeckId, words.length]);
  let currentWord =
      words.length > 0 ? words[Math.min(wordIndex, words.length - 1)] : null,
    selectDeck = (e) => {
      (setActiveDeckId(e),
        setWordIndex(0),
        setRevealed({}),
        setListOpen(false));
    },
    goToWord = useCallback((e) => {
      (setWordIndex(e), setRevealed({}), setListOpen(false));
    }, []),
    prevWord = useCallback(() => {
      words.length !== 0 &&
        (setWordIndex((e) => (e > 0 ? e - 1 : words.length - 1)),
        setRevealed({}));
    }, [words.length]),
    nextWord = useCallback(() => {
      words.length !== 0 &&
        (setWordIndex((e) => (e < words.length - 1 ? e + 1 : 0)),
        setRevealed({}));
    }, [words.length]),
    toggleTile = (e) => {
      if (!revealed[e] && currentWord) {
        // Lulu реагує: прислухається до кожного звука, радіє, коли відкрито всі
        let open = Object.values(revealed).filter(Boolean).length + 1;
        setReaction((r) => ({
          name: open >= currentWord.letters.length ? "cheer" : "listen",
          id: r.id + 1,
        }));
      }
      setRevealed((t) => ({
        ...t,
        [e]: !t[e],
      }));
    },
    handleTouchStart = (e) => {
      touchStartX.current = e.touches[0].clientX;
    },
    handleTouchEnd = (e) => {
      if (touchStartX.current === null) return;
      let t = e.changedTouches[0].clientX - touchStartX.current;
      (Math.abs(t) > 50 && (t < 0 ? nextWord() : prevWord()),
        (touchStartX.current = null));
    };
  useEffect(() => {
    let e = (e) => {
      (listOpen && e.key === "Escape" && setListOpen(false),
        !listOpen && e.key === "ArrowLeft" && prevWord(),
        !listOpen && e.key === "ArrowRight" && nextWord());
    };
    return (
      window.addEventListener("keydown", e),
      () => window.removeEventListener("keydown", e)
    );
  }, [listOpen, prevWord, nextWord]);
  let isEmpty = words.length === 0,
    letterCount = currentWord?.letters?.length || 3,
    allRevealed =
      currentWord &&
      Object.keys(revealed).length === currentWord.letters.length &&
      Object.values(revealed).every(Boolean);
  let opened = Object.values(revealed).filter(Boolean).length,
    long = letterCount > 4;
  return (
    <>
      <PageHead
        icon="icon-connect.svg"
        eyebrow="Practice · Читаємо слова"
        title="Прочитай слово сам"
      >
        Зливай звуки в слово. Забув звук? Натисни на літеру, і під нею з'явиться
        підказка. Стрілки або свайп ведуть до наступного слова.
      </PageHead>
      <div className="decks" role="group" aria-label="Колоди слів">
        {allDecks.map((e) => (
          <button
            key={e.id}
            type="button"
            className="pill"
            aria-pressed={activeDeckId === e.id}
            onClick={() => selectDeck(e.id)}
          >
            {e.id !== DEFAULT_DECK_ID && e.emoji && (
              <span aria-hidden="true">{e.emoji}</span>
            )}
            {e.name}
            <small>{e.words.length}</small>
          </button>
        ))}
      </div>
      <div
        className="panel fade-up"
        onTouchStart={isEmpty ? void 0 : handleTouchStart}
        onTouchEnd={isEmpty ? void 0 : handleTouchEnd}
        style={{ touchAction: "pan-y" }}
      >
        <div>
          {isEmpty && (
            <div className="word-empty">
              <p style={{ fontWeight: 800, fontSize: "1.1rem" }}>
                Ця колода порожня
              </p>
              <p className="muted">
                {"Додайте слова в розділі "}
                <strong>«Для дорослих»</strong>.
              </p>
            </div>
          )}
          {!isEmpty && currentWord && (
            <>
              <div className="word" key={currentWord.id}>
                {currentWord.letters.map((e, t) => (
                  <button
                    key={`${currentWord.id}-${t}`}
                    type="button"
                    className={`wtile${VOWELS.includes(e) ? " vowel" : ""}${long ? " long" : ""}`}
                    aria-pressed={!!revealed[t]}
                    aria-label={`Літера ${e}${revealed[t] ? `, звук ${currentWord.sounds[t]}` : ""}`}
                    onClick={() => toggleTile(t)}
                  >
                    <span className="face" aria-hidden="true">
                      {e}
                    </span>
                    <span className="snd" aria-hidden="true">
                      {currentWord.sounds[t]}
                    </span>
                  </button>
                ))}
              </div>
              <div className="word-ctl">
                <button
                  type="button"
                  className="btn btn-ghost btn-round"
                  onClick={prevWord}
                  aria-label="Попереднє слово"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  type="button"
                  className="pill"
                  onClick={() => setListOpen(true)}
                  title="Відкрити список слів"
                >
                  <List size={18} aria-hidden="true" />
                  {wordIndex + 1} / {words.length}
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-round"
                  onClick={nextWord}
                  aria-label="Наступне слово"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </>
          )}
        </div>
        <div className="panel-lulu">
          <LuluLive
            react={reaction}
            label={allRevealed ? "Lulu радіє" : "Lulu допомагає читати"}
          />
          <p className="bubble" aria-live="polite">
            {isEmpty
              ? "Тут поки немає слів"
              : allRevealed
                ? "Усі звуки відкриті! Тепер прочитай слово цілим"
                : opened
                  ? "Спробуй злити звуки разом"
                  : "Спершу спробуй прочитати сам"}
          </p>
        </div>
      </div>
      {listOpen && (
        <div className="modal-bg" onClick={() => setListOpen(false)}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="word-list-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-head">
              <h2 id="word-list-title" style={{ fontSize: "var(--step-1)" }}>
                {activeDeck.name}{" "}
                <span
                  className="muted"
                  style={{ fontSize: ".9rem", fontWeight: 600 }}
                >
                  {words.length} слів
                </span>
              </h2>
              <button
                type="button"
                className="icon-btn"
                onClick={() => setListOpen(false)}
                aria-label="Закрити список"
              >
                <X size={22} />
              </button>
            </div>
            <div className="modal-list">
              {words.map((e, t) => (
                <button
                  key={e.id}
                  type="button"
                  className="pill"
                  aria-pressed={t === wordIndex}
                  onClick={() => goToWord(t)}
                >
                  <small>{t + 1}</small>
                  {e.word}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
