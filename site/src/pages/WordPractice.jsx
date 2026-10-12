import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, List, Sparkles, X } from "lucide-react";
import { DEFAULT_WORDS } from "../data/words.js";
import { loadDecks } from "../lib/decks.js";

export const TILE_COLORS = [
  {
    bg: "#FFF0EB",
    border: "#FFBCAD",
    revealBg: "#FF6B4A",
    revealText: "white",
  },
  {
    bg: "#EDF7FF",
    border: "#B3DEFF",
    revealBg: "#4DB8FF",
    revealText: "white",
  },
  {
    bg: "#FFFBEC",
    border: "#FFE899",
    revealBg: "#FFD93D",
    revealText: "#7A5800",
  },
  {
    bg: "#EDFAF4",
    border: "#A8F0D3",
    revealBg: "#6EE7B7",
    revealText: "#0E6646",
  },
  {
    bg: "#F5F0FF",
    border: "#D7C4FF",
    revealBg: "#B792FF",
    revealText: "white",
  },
];
export const DEFAULT_DECK_ID = "default";
export function WordPractice() {
  let [decks, setDecks] = useState(loadDecks),
    [activeDeckId, setActiveDeckId] = useState(DEFAULT_DECK_ID),
    [wordIndex, setWordIndex] = useState(0),
    [revealed, setRevealed] = useState({}),
    [listOpen, setListOpen] = useState(false),
    touchStartX = useRef(null),
    cardRef = useRef(null);
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
    tilePadding =
      letterCount <= 4
        ? "clamp(14px, 3.5vw, 22px) 6px"
        : letterCount <= 6
          ? "clamp(10px, 2.5vw, 16px) 4px"
          : "clamp(8px, 2vw, 12px) 3px",
    tileFontSize =
      letterCount <= 4
        ? "clamp(2rem, 13vw, 5rem)"
        : letterCount <= 6
          ? "clamp(1.4rem, 9vw, 3.6rem)"
          : "clamp(1.1rem, 7vw, 2.8rem)",
    soundFontSize =
      letterCount <= 4
        ? "clamp(1rem, 4.5vw, 1.9rem)"
        : "clamp(0.8rem, 3vw, 1.3rem)",
    tileGap = letterCount <= 4 ? 12 : letterCount <= 6 ? 8 : 6,
    allRevealed =
      currentWord &&
      Object.keys(revealed).length === currentWord.letters.length &&
      Object.values(revealed).every(Boolean);
  return (
    <div
      style={{
        maxWidth: "860px",
        margin: "0 auto",
      }}
    >
      <div
        className="text-center animate-bounce-in"
        style={{
          marginBottom: "28px",
        }}
      >
        <h1 className="text-gradient-blue">Word Practice</h1>
        <p
          style={{
            fontSize: "1.1rem",
            fontWeight: "600",
          }}
        >
          Спробуй прочитати слово самостійно. Якщо забув звук — натисни на
          літеру!
        </p>
      </div>
      <div
        style={{
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          paddingBottom: "4px",
          marginBottom: "20px",
          scrollbarWidth: "none",
        }}
      >
        {allDecks.map((e) => (
          <button
            key={e.id}
            onClick={() => selectDeck(e.id)}
            style={{
              flexShrink: 0,
              padding: "10px 20px",
              borderRadius: "99px",
              border:
                activeDeckId === e.id
                  ? "2px solid var(--blue)"
                  : "2px solid var(--border)",
              background:
                activeDeckId === e.id
                  ? "linear-gradient(135deg, #4DB8FF, #6EE7B7)"
                  : "var(--surface)",
              color: activeDeckId === e.id ? "white" : "var(--text)",
              fontWeight: "700",
              fontSize: "0.95rem",
              cursor: "pointer",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
              boxShadow:
                activeDeckId === e.id
                  ? "0 4px 14px rgba(77,184,255,0.30)"
                  : "none",
            }}
          >
            <span
              style={{
                marginRight: "5px",
              }}
            >
              {e.emoji || "🗂"}
            </span>
            {e.name}
            <span
              style={{
                marginLeft: "6px",
                fontSize: "0.78rem",
                opacity: activeDeckId === e.id ? 0.85 : 0.5,
                fontWeight: "600",
              }}
            >
              {e.words.length}
            </span>
          </button>
        ))}
      </div>
      <div
        ref={cardRef}
        className="card text-center"
        onTouchStart={isEmpty ? void 0 : handleTouchStart}
        onTouchEnd={isEmpty ? void 0 : handleTouchEnd}
        style={{
          padding: "48px 16px 36px",
          background: "linear-gradient(160deg, #FBFEFF 0%, #F0F8FF 100%)",
          border: "1.5px solid rgba(77,184,255,0.18)",
          boxShadow: "0 12px 48px rgba(77,184,255,0.10)",
          position: "relative",
          overflow: "visible",
          touchAction: "pan-y",
        }}
      >
        {isEmpty && (
          <div
            style={{
              padding: "32px 0",
              color: "var(--muted)",
            }}
          >
            <div
              style={{
                fontSize: "3rem",
                marginBottom: "12px",
              }}
            >
              📭
            </div>
            <p
              style={{
                fontWeight: "700",
                fontSize: "1.1rem",
                color: "var(--text)",
                marginBottom: "6px",
              }}
            >
              Ця колода порожня
            </p>
            <p
              style={{
                fontSize: "0.95rem",
              }}
            >
              {"Перейди у вкладку "}
              <strong>Parents</strong>
              {" і додай слова до цієї колоди."}
            </p>
          </div>
        )}
        {!isEmpty && allRevealed && (
          <div
            style={{
              position: "absolute",
              top: "-18px",
              left: "50%",
              transform: "translateX(-50%)",
              background: "linear-gradient(135deg, #6EE7B7, #2ECC8F)",
              color: "white",
              fontWeight: "800",
              fontSize: "0.9rem",
              padding: "6px 18px",
              borderRadius: "var(--radius-pill)",
              boxShadow: "var(--shadow-mint)",
              whiteSpace: "nowrap",
              animation:
                "bounce-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) both",
            }}
          >
            <Sparkles
              size={14}
              style={{
                display: "inline",
                marginRight: "6px",
              }}
            />
            Молодець! Всі звуки відкриті!
          </div>
        )}
        {!isEmpty && currentWord && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${letterCount}, 1fr)`,
                gap: `${tileGap}px`,
                marginBottom: "40px",
              }}
            >
              {currentWord.letters.map((e, t) => {
                let n = !!revealed[t],
                  r = TILE_COLORS[t % TILE_COLORS.length];
                return (
                  <div
                    key={`${currentWord.id}-${t}`}
                    className="word-tile"
                    onClick={() => toggleTile(t)}
                    style={{
                      padding: tilePadding,
                      cursor: "pointer",
                      background: n ? r.revealBg : r.bg,
                      border: `2.5px solid ${n ? r.revealBg : r.border}`,
                      borderRadius: "20px",
                      boxShadow: n
                        ? "0 10px 28px rgba(36,50,74,0.18)"
                        : "0 4px 16px rgba(36,50,74,0.07)",
                      transform: n
                        ? "translateY(-6px) scale(1.04)"
                        : "scale(1)",
                      transition: "all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      animationDelay: `${t * 0.1}s`,
                      userSelect: "none",
                    }}
                  >
                    <div
                      style={{
                        fontSize: tileFontSize,
                        fontWeight: "900",
                        lineHeight: 1,
                        color: n ? r.revealText : "var(--text)",
                        letterSpacing: e.length > 1 ? "-2px" : "normal",
                        transition: "color 0.2s ease",
                      }}
                    >
                      {e}
                    </div>
                    <div
                      style={{
                        marginTop: "10px",
                        height: "30px",
                        opacity: n ? 1 : 0,
                        transform: n ? "translateY(0)" : "translateY(-8px)",
                        transition: "all 0.25s ease",
                        pointerEvents: "none",
                      }}
                    >
                      <div
                        style={{
                          fontSize: soundFontSize,
                          fontWeight: "800",
                          color: n ? r.revealText : "transparent",
                          opacity: n ? 0.9 : 0,
                        }}
                      >
                        {currentWord.sounds[t]}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
              }}
            >
              <button
                onClick={prevWord}
                aria-label="Попереднє слово"
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  border: "2px solid var(--border)",
                  background: "var(--surface)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.18s ease",
                  flexShrink: 0,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                }}
                onMouseOver={(e) => {
                  ((e.currentTarget.style.background = "#EDF7FF"),
                    (e.currentTarget.style.borderColor = "var(--blue)"));
                }}
                onMouseOut={(e) => {
                  ((e.currentTarget.style.background = "var(--surface)"),
                    (e.currentTarget.style.borderColor = "var(--border)"));
                }}
              >
                <ChevronLeft size={28} color="var(--text)" />
              </button>
              <button
                onClick={() => setListOpen(true)}
                title="Відкрити список слів"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 22px",
                  borderRadius: "99px",
                  border: "2px solid var(--border)",
                  background: "var(--surface)",
                  cursor: "pointer",
                  fontWeight: "800",
                  fontSize: "1.05rem",
                  color: "var(--text)",
                  transition: "all 0.18s ease",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                }}
                onMouseOver={(e) => {
                  ((e.currentTarget.style.background = "#EDF7FF"),
                    (e.currentTarget.style.borderColor = "var(--blue)"));
                }}
                onMouseOut={(e) => {
                  ((e.currentTarget.style.background = "var(--surface)"),
                    (e.currentTarget.style.borderColor = "var(--border)"));
                }}
              >
                <List size={18} color="var(--blue)" />
                <span
                  style={{
                    color: "var(--blue)",
                  }}
                >
                  {wordIndex + 1}
                </span>
                <span
                  style={{
                    color: "var(--muted)",
                    fontWeight: "600",
                  }}
                >
                  /
                </span>
                <span>{words.length}</span>
              </button>
              <button
                onClick={nextWord}
                aria-label="Наступне слово"
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  border: "2px solid var(--border)",
                  background: "var(--surface)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.18s ease",
                  flexShrink: 0,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                }}
                onMouseOver={(e) => {
                  ((e.currentTarget.style.background = "#EDF7FF"),
                    (e.currentTarget.style.borderColor = "var(--blue)"));
                }}
                onMouseOut={(e) => {
                  ((e.currentTarget.style.background = "var(--surface)"),
                    (e.currentTarget.style.borderColor = "var(--border)"));
                }}
              >
                <ChevronRight size={28} color="var(--text)" />
              </button>
            </div>
          </>
        )}
      </div>
      {listOpen && (
        <div
          onClick={() => setListOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 1e3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--surface)",
              borderRadius: "20px",
              padding: "24px",
              width: "100%",
              maxWidth: "420px",
              maxHeight: "70vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 24px 64px rgba(0,0,0,0.22)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontWeight: "800",
                  fontSize: "1.1rem",
                }}
              >
                <span
                  style={{
                    marginRight: "6px",
                  }}
                >
                  {activeDeck.emoji || "🗂"}
                </span>
                {activeDeck.name}
                <span
                  style={{
                    marginLeft: "8px",
                    color: "var(--muted)",
                    fontWeight: "600",
                    fontSize: "0.9rem",
                  }}
                >
                  {words.length}
                  {" слів"}
                </span>
              </h3>
              <button
                onClick={() => setListOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px",
                  borderRadius: "8px",
                  color: "var(--muted)",
                }}
              >
                <X size={22} />
              </button>
            </div>
            <div
              style={{
                overflowY: "auto",
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              {words.map((e, t) => (
                <button
                  key={e.id}
                  onClick={() => goToWord(t)}
                  style={{
                    padding: "10px 16px",
                    borderRadius: "12px",
                    border:
                      t === wordIndex
                        ? "2px solid var(--blue)"
                        : "2px solid var(--border)",
                    background:
                      t === wordIndex
                        ? "linear-gradient(135deg, #4DB8FF22, #6EE7B722)"
                        : "var(--bg-color)",
                    cursor: "pointer",
                    fontWeight: "700",
                    fontSize: "1rem",
                    color: t === wordIndex ? "var(--blue)" : "var(--text)",
                    transition: "all 0.15s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.7rem",
                      color: "var(--muted)",
                      fontWeight: "600",
                      minWidth: "18px",
                    }}
                  >
                    {t + 1}
                  </span>
                  {e.word}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
