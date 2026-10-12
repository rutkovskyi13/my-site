import { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  CirclePlus,
  FolderPlus,
  Settings,
  Trash2,
} from "lucide-react";
import { DEFAULT_WORDS } from "../data/words.js";
import { createDeck, loadDecks, saveDecks } from "../lib/decks.js";
import { DIGRAPH_CARDS, splitIntoUnits } from "../lib/digraphs.js";
import { loadSettings, saveSettings } from "../lib/settings.js";

export function Parents() {
  let [decks, setDecks] = useState(loadDecks),
    [settingsOpen, setSettingsOpen] = useState(false),
    [decksOpen, setDecksOpen] = useState(false),
    [settings, setSettings] = useState(loadSettings),
    [creatingDeck, setCreatingDeck] = useState(false),
    [newDeckName, setNewDeckName] = useState(""),
    [newDeckEmoji, setNewDeckEmoji] = useState(""),
    [emojiPickerOpen, setEmojiPickerOpen] = useState(false),
    [deckError, setDeckError] = useState(""),
    emojiPickerRef = useRef(null),
    [expandedDeckId, setExpandedDeckId] = useState(null),
    [addingToDeckId, setAddingToDeckId] = useState(null),
    [newWord, setNewWord] = useState(""),
    [wordUnits, setWordUnits] = useState([]),
    [unitSounds, setUnitSounds] = useState([]),
    [addStep, setAddStep] = useState("input"),
    [wordError, setWordError] = useState("");
  (useEffect(() => {
    saveDecks(decks);
  }, [decks]),
    useEffect(() => {
      if (!emojiPickerOpen) return;
      let e = (e) => {
        emojiPickerRef.current &&
          !emojiPickerRef.current.contains(e.target) &&
          setEmojiPickerOpen(false);
      };
      return (
        document.addEventListener("mousedown", e),
        () => document.removeEventListener("mousedown", e)
      );
    }, [emojiPickerOpen]));
  let toggleDigraphs = () => {
      let e = {
        ...settings,
        digraphsEnabled: !settings.digraphsEnabled,
      };
      (setSettings(e), saveSettings(e));
    },
    handleCreateDeck = () => {
      let n = newDeckName.trim();
      if (!n) {
        setDeckError("Введіть назву колоди.");
        return;
      }
      if (decks.some((e) => e.name.toLowerCase() === n.toLowerCase())) {
        setDeckError("Колода з такою назвою вже існує.");
        return;
      }
      let r = createDeck(n, newDeckEmoji || "🗂");
      (setDecks((e) => [...e, r]),
        setNewDeckName(""),
        setNewDeckEmoji(""),
        setEmojiPickerOpen(false),
        setCreatingDeck(false),
        setDeckError(""),
        setExpandedDeckId(r.id));
    },
    deleteDeck = (e) => {
      (setDecks((t) => t.filter((t) => t.id !== e)),
        expandedDeckId === e && setExpandedDeckId(null),
        addingToDeckId === e && resetWordForm());
    },
    resetWordForm = () => {
      (setNewWord(""),
        setWordUnits([]),
        setUnitSounds([]),
        setAddStep("input"),
        setWordError(""),
        setAddingToDeckId(null));
    },
    startAddingWord = (e) => {
      (resetWordForm(), setAddingToDeckId(e));
    },
    handleWordChange = (e) => {
      (setNewWord(e.target.value.toLowerCase().replace(/[^a-z]/g, "")),
        setWordError(""));
    },
    handleWordNext = () => {
      let e = newWord.trim();
      if (e.length < 2) {
        setWordError("Слово повинно мати щонайменше 2 літери.");
        return;
      }
      let t = settings.digraphsEnabled ? splitIntoUnits(e) : e.split("");
      (setWordUnits(t),
        setUnitSounds(Array(t.length).fill("")),
        setAddStep("sounds"),
        setWordError(""));
    },
    setUnitSound = (e, t) => {
      setUnitSounds((n) => {
        let r = [...n];
        return ((r[e] = t), r);
      });
    },
    handleSaveWord = () => {
      if (unitSounds.some((e) => !e.trim())) {
        setWordError("Будь ласка, заповніть всі звукові підказки.");
        return;
      }
      let e = {
        id: `custom_${Date.now()}`,
        word: newWord,
        letters: wordUnits,
        sounds: unitSounds.map((e) => e.trim()),
        isCustom: true,
      };
      (setDecks((t) =>
        t.map((t) =>
          t.id === addingToDeckId
            ? {
                ...t,
                words: [...t.words, e],
              }
            : t,
        ),
      ),
        setNewWord(""),
        setWordUnits([]),
        setUnitSounds([]),
        setAddStep("input"),
        setWordError(""));
    },
    deleteWord = (e, n) => {
      setDecks((t) =>
        t.map((t) =>
          t.id === e
            ? {
                ...t,
                words: t.words.filter((e) => e.id !== n),
              }
            : t,
        ),
      );
    };
  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <div
        className="text-center animate-bounce-in"
        style={{
          marginBottom: "36px",
        }}
      >
        <h1 className="text-gradient">Майстерня читання</h1>
        <p
          style={{
            fontSize: "1.1rem",
          }}
        >
          Правила, слова та налаштування для навчання.
        </p>
      </div>
      <div
        style={{
          marginBottom: "32px",
        }}
      >
        <h2
          style={{
            fontSize: "1.4rem",
            fontWeight: "800",
            color: "var(--text)",
            marginBottom: "18px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          📚 Правила читання
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
            gap: "16px",
          }}
        >
          <div
            className="card"
            style={{
              padding: "20px 22px",
              border: "1.5px solid rgba(77,184,255,0.25)",
              background: "linear-gradient(135deg, #F0F9FF, #FBFEFF)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "10px",
              }}
            >
              <span
                style={{
                  fontSize: "2rem",
                }}
              >
                🔤
              </span>
              <span
                style={{
                  fontWeight: "800",
                  fontSize: "1rem",
                  color: "var(--sky-dark)",
                }}
              >
                Голосні та приголосні
              </span>
            </div>
            <p
              style={{
                fontSize: "0.9rem",
                lineHeight: "1.6",
                color: "var(--muted)",
                marginBottom: "10px",
              }}
            >
              {"В англійській є "}
              <strong
                style={{
                  color: "var(--text)",
                }}
              >
                5 голосних
              </strong>
              : A, E, I, O, U. Всі інші — приголосні. У кожному складі є хоча б
              одна голосна.
            </p>
            <div
              style={{
                display: "flex",
                gap: "6px",
                flexWrap: "wrap",
              }}
            >
              {["A", "E", "I", "O", "U"].map((e) => (
                <span
                  key={e}
                  style={{
                    padding: "3px 10px",
                    background: "var(--yellow-light)",
                    border: "1.5px solid var(--yellow)",
                    borderRadius: "8px",
                    fontWeight: "800",
                    fontSize: "1rem",
                    color: "#B88A00",
                  }}
                >
                  {e}
                </span>
              ))}
            </div>
          </div>
          <div
            className="card"
            style={{
              padding: "20px 22px",
              border: "1.5px solid rgba(255,107,74,0.22)",
              background: "linear-gradient(135deg, #FFF5F3, #FFFBFF)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "10px",
              }}
            >
              <span
                style={{
                  fontSize: "2rem",
                }}
              >
                📖
              </span>
              <span
                style={{
                  fontWeight: "800",
                  fontSize: "1rem",
                  color: "var(--coral-dark)",
                }}
              >
                Короткий голосний звук
              </span>
            </div>
            <p
              style={{
                fontSize: "0.9rem",
                lineHeight: "1.6",
                color: "var(--muted)",
                marginBottom: "10px",
              }}
            >
              {"Якщо голосна стоїть між двома приголосними — вона читається "}
              <strong
                style={{
                  color: "var(--text)",
                }}
              >
                коротко
              </strong>
              . Це найпоширеніший тип коротких слів.
            </p>
            <div
              style={{
                display: "flex",
                gap: "6px",
                flexWrap: "wrap",
              }}
            >
              {["cat", "dog", "sit", "hot", "cup"].map((e) => (
                <span
                  key={e}
                  style={{
                    padding: "3px 10px",
                    background: "var(--coral-light)",
                    border: "1.5px solid rgba(255,107,74,0.35)",
                    borderRadius: "8px",
                    fontWeight: "700",
                    fontSize: "0.9rem",
                    color: "var(--coral-dark)",
                  }}
                >
                  {e}
                </span>
              ))}
            </div>
          </div>
          <div
            className="card"
            style={{
              padding: "20px 22px",
              border: "1.5px solid rgba(110,231,183,0.35)",
              background: "linear-gradient(135deg, #F0FDF8, #FBFFFD)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "10px",
              }}
            >
              <span
                style={{
                  fontSize: "2rem",
                }}
              >
                🎵
              </span>
              <span
                style={{
                  fontWeight: "800",
                  fontSize: "1rem",
                  color: "var(--mint-dark)",
                }}
              >
                Читаємо злиттям
              </span>
            </div>
            <p
              style={{
                fontSize: "0.9rem",
                lineHeight: "1.6",
                color: "var(--muted)",
                marginBottom: "10px",
              }}
            >
              {"Говоримо звук кожної літери і "}
              <strong
                style={{
                  color: "var(--text)",
                }}
              >
                зливаємо їх разом
              </strong>
              {" без зупинки. Спочатку повільно, потім швидше."}
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontWeight: "800",
                  color: "var(--mint-dark)",
                  fontSize: "1rem",
                }}
              >
                c + a + t
              </span>
              <span
                style={{
                  color: "var(--muted)",
                }}
              >
                →
              </span>
              <span
                style={{
                  padding: "3px 12px",
                  background: "var(--mint-light)",
                  border: "1.5px solid var(--mint)",
                  borderRadius: "8px",
                  fontWeight: "800",
                  fontSize: "1rem",
                  color: "var(--mint-dark)",
                }}
              >
                кет
              </span>
            </div>
          </div>
          <div
            className="card"
            style={{
              padding: "20px 22px",
              border: "1.5px solid rgba(183,146,255,0.30)",
              background: "linear-gradient(135deg, #F7F3FF, #FDFBFF)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "10px",
              }}
            >
              <span
                style={{
                  fontSize: "2rem",
                }}
              >
                🔗
              </span>
              <span
                style={{
                  fontWeight: "800",
                  fontSize: "1rem",
                  color: "var(--lavender-dark)",
                }}
              >
                Діграфи — два звуки разом
              </span>
            </div>
            <p
              style={{
                fontSize: "0.9rem",
                lineHeight: "1.6",
                color: "var(--muted)",
                marginBottom: "10px",
              }}
            >
              {"Деякі пари літер разом дають "}
              <strong
                style={{
                  color: "var(--text)",
                }}
              >
                один звук
              </strong>
              . Їх треба запам'ятати як одне ціле.
            </p>
            <div
              style={{
                display: "flex",
                gap: "6px",
                flexWrap: "wrap",
              }}
            >
              {[
                ["sh", "Ш"],
                ["ch", "Ч"],
                ["oo", "У"],
                ["ee", "І"],
                ["ph", "Ф"],
              ].map(([e, t]) => (
                <span
                  key={e}
                  style={{
                    padding: "3px 10px",
                    background: "var(--lavender-light)",
                    border: "1.5px solid rgba(183,146,255,0.5)",
                    borderRadius: "8px",
                    fontWeight: "800",
                    fontSize: "0.9rem",
                    color: "var(--lavender-dark)",
                  }}
                >
                  {e}={t}
                </span>
              ))}
            </div>
          </div>
          <div
            className="card"
            style={{
              padding: "20px 22px",
              border: "1.5px solid rgba(255,217,61,0.40)",
              background: "linear-gradient(135deg, #FFFEF0, #FFFDF5)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "10px",
              }}
            >
              <span
                style={{
                  fontSize: "2rem",
                }}
              >
                ✨
              </span>
              <span
                style={{
                  fontWeight: "800",
                  fontSize: "1rem",
                  color: "#B88A00",
                }}
              >
                Чарівна "E" в кінці
              </span>
            </div>
            <p
              style={{
                fontSize: "0.9rem",
                lineHeight: "1.6",
                color: "var(--muted)",
                marginBottom: "10px",
              }}
            >
              {"Якщо слово закінчується на "}
              <strong
                style={{
                  color: "var(--text)",
                }}
              >
                "e"
              </strong>
              {
                ", ця буква не читається. Але вона змінює попередній голосний — він читається як "
              }
              <strong
                style={{
                  color: "var(--text)",
                }}
              >
                назва літери
              </strong>
              .
            </p>
            <div
              style={{
                display: "flex",
                gap: "6px",
                flexWrap: "wrap",
              }}
            >
              {["cake", "pine", "home", "cube"].map((e) => (
                <span
                  key={e}
                  style={{
                    padding: "3px 10px",
                    background: "var(--yellow-light)",
                    border: "1.5px solid var(--yellow)",
                    borderRadius: "8px",
                    fontWeight: "700",
                    fontSize: "0.9rem",
                    color: "#B88A00",
                  }}
                >
                  {e}
                </span>
              ))}
            </div>
          </div>
          <div
            className="card"
            style={{
              padding: "20px 22px",
              border: "1.5px solid rgba(110,231,183,0.30)",
              background: "linear-gradient(135deg, #F0FDF8, #FBFFFD)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "10px",
              }}
            >
              <span
                style={{
                  fontSize: "2rem",
                }}
              >
                🎯
              </span>
              <span
                style={{
                  fontWeight: "800",
                  fontSize: "1rem",
                  color: "var(--mint-dark)",
                }}
              >
                Велика і мала — однаковий звук
              </span>
            </div>
            <p
              style={{
                fontSize: "0.9rem",
                lineHeight: "1.6",
                color: "var(--muted)",
                marginBottom: "10px",
              }}
            >
              {"Велика та мала літера мають "}
              <strong
                style={{
                  color: "var(--text)",
                }}
              >
                однаковий звук
              </strong>
              . Велика пишеться на початку речення або імені.
            </p>
            <div
              style={{
                display: "flex",
                gap: "6px",
                flexWrap: "wrap",
              }}
            >
              {[
                ["A", "a"],
                ["B", "b"],
                ["S", "s"],
                ["M", "m"],
              ].map(([e, t]) => (
                <span
                  key={e}
                  style={{
                    padding: "3px 10px",
                    background: "var(--mint-light)",
                    border: "1.5px solid var(--mint)",
                    borderRadius: "8px",
                    fontWeight: "800",
                    fontSize: "1rem",
                    color: "var(--mint-dark)",
                  }}
                >
                  {e}
                  {" = "}
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          marginBottom: "32px",
        }}
      >
        <h2
          style={{
            fontSize: "1.4rem",
            fontWeight: "800",
            color: "var(--text)",
            marginBottom: "18px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          💡 Поради батькам
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
            gap: "16px",
          }}
        >
          {[
            {
              icon: "🕐",
              color: "var(--sky-dark)",
              border: "rgba(77,184,255,0.25)",
              bg: "linear-gradient(135deg, #F0F9FF, #FBFEFF)",
              title: "Щодня по 5–10 хвилин",
              text: [
                "Короткі ",
                "регулярні заняття",
                " ефективніші за рідкісні й довгі. Щоденна практика формує звичку і прискорює прогрес.",
              ],
            },
            {
              icon: "📢",
              color: "var(--coral-dark)",
              border: "rgba(255,107,74,0.22)",
              bg: "linear-gradient(135deg, #FFF5F3, #FFFBFF)",
              title: "Читайте разом вголос",
              text: [
                "Спочатку ",
                "покажіть самі",
                ", як звучить слово, потім попросіть повторити. Дитина вчиться наслідуванням.",
              ],
            },
            {
              icon: "🌟",
              color: "var(--mint-dark)",
              border: "rgba(110,231,183,0.35)",
              bg: "linear-gradient(135deg, #F0FDF8, #FBFFFD)",
              title: "Хваліть за старання",
              text: [
                '"Ти так старалась!" важливіше ніж "Все правильно!". Похвала за ',
                "зусилля",
                ", а не результат, будує впевненість у собі.",
              ],
            },
            {
              icon: "⏳",
              color: "var(--lavender-dark)",
              border: "rgba(183,146,255,0.30)",
              bg: "linear-gradient(135deg, #F7F3FF, #FDFBFF)",
              title: "Не поспішайте виправляти",
              text: [
                "Дайте дитині ",
                "час подумати",
                ". Якщо не виходить — підкажіть лише перший звук, щоб вона дійшла до слова сама.",
              ],
            },
            {
              icon: "🎮",
              color: "#B88A00",
              border: "rgba(255,217,61,0.40)",
              bg: "linear-gradient(135deg, #FFFEF0, #FFFDF5)",
              title: "Грайте зі звуками",
              text: [
                "По дорозі чи в черзі запитуйте: ",
                "\"Яким звуком починається 'cat'?\"",
                " або \"Знайди щось, що починається на 'b'\".",
              ],
            },
            {
              icon: "🔍",
              color: "var(--sky-dark)",
              border: "rgba(77,184,255,0.25)",
              bg: "linear-gradient(135deg, #F0F9FF, #FBFEFF)",
              title: "Знаходьте літери навколо",
              text: [
                "Вивіски, упаковки, меню — ",
                "показуйте літери в реальному житті",
                ". Це допомагає дитині бачити навчання скрізь.",
              ],
            },
            {
              icon: "🔁",
              color: "var(--coral-dark)",
              border: "rgba(255,107,74,0.22)",
              bg: "linear-gradient(135deg, #FFF5F3, #FFFBFF)",
              title: "Повторення — це добре",
              text: [
                "Читати знайоме слово знову і знову — ",
                "це нормально",
                ". Повторення будує швидкість читання і впевненість.",
              ],
            },
            {
              icon: "💙",
              color: "var(--mint-dark)",
              border: "rgba(110,231,183,0.35)",
              bg: "linear-gradient(135deg, #F0FDF8, #FBFFFD)",
              title: "Кожна дитина у своєму темпі",
              text: [
                "Порівнюйте дитину ",
                "тільки з нею самою вчора",
                ", а не з іншими дітьми. Кожен маленький прогрес — це перемога.",
              ],
            },
          ].map((e) => (
            <div
              key={e.title}
              className="card"
              style={{
                padding: "20px 22px",
                border: `1.5px solid ${e.border}`,
                background: e.bg,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "8px",
                }}
              >
                <span
                  style={{
                    fontSize: "1.7rem",
                  }}
                >
                  {e.icon}
                </span>
                <span
                  style={{
                    fontWeight: "800",
                    fontSize: "0.95rem",
                    color: e.color,
                  }}
                >
                  {e.title}
                </span>
              </div>
              <p
                style={{
                  fontSize: "0.88rem",
                  lineHeight: "1.6",
                  color: "var(--muted)",
                  margin: 0,
                }}
              >
                {e.text[0]}
                <strong
                  style={{
                    color: "var(--text)",
                  }}
                >
                  {e.text[1]}
                </strong>
                {e.text[2]}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div
        className="card"
        style={{
          marginBottom: "24px",
        }}
      >
        <button
          onClick={() => setSettingsOpen((e) => !e)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Settings size={22} color="var(--text-muted)" />
            <h2
              style={{
                color: "var(--text-main)",
                margin: 0,
              }}
            >
              Налаштування
            </h2>
          </div>
          {settingsOpen ? (
            <ChevronUp size={24} color="var(--text-muted)" />
          ) : (
            <ChevronDown size={24} color="var(--text-muted)" />
          )}
        </button>
        {settingsOpen && (
          <div
            style={{
              marginTop: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 20px",
                background: "var(--bg-color)",
                borderRadius: "14px",
                border: "1px solid var(--border)",
              }}
            >
              <div>
                <div
                  style={{
                    fontWeight: "700",
                    fontSize: "1rem",
                    color: "var(--text-main)",
                    marginBottom: "4px",
                  }}
                >
                  Режим діграфів
                </div>
                <div
                  style={{
                    fontSize: "0.88rem",
                    color: "var(--text-muted)",
                    maxWidth: "420px",
                  }}
                >
                  Додає рядок діграфів на сторінку Алфавіту (sh, ch, ck, ee, oo,
                  qu) і автоматично групує їх при додаванні нових слів.
                </div>
              </div>
              <button
                onClick={toggleDigraphs}
                style={{
                  position: "relative",
                  width: "52px",
                  height: "28px",
                  borderRadius: "14px",
                  border: "none",
                  cursor: "pointer",
                  background: settings.digraphsEnabled
                    ? "var(--blue)"
                    : "var(--border)",
                  transition: "background 0.25s",
                  flexShrink: 0,
                  marginLeft: "20px",
                }}
                aria-label="Toggle digraphs"
              >
                <span
                  style={{
                    position: "absolute",
                    top: "3px",
                    left: settings.digraphsEnabled ? "26px" : "3px",
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    background: "white",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                    transition: "left 0.25s",
                  }}
                />
              </button>
            </div>
            {settings.digraphsEnabled && (
              <div
                style={{
                  marginTop: "14px",
                  padding: "14px 18px",
                  background: "var(--secondary-light)",
                  borderRadius: "12px",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    color: "var(--secondary)",
                    marginRight: "4px",
                  }}
                >
                  Активні діграфи:
                </span>
                {DIGRAPH_CARDS.map((e) => (
                  <span
                    key={e.key}
                    style={{
                      padding: "4px 12px",
                      background: "white",
                      border: "1.5px solid var(--secondary)",
                      borderRadius: "8px",
                      fontWeight: "800",
                      fontSize: "0.95rem",
                      color: "var(--secondary)",
                    }}
                  >
                    {e.key}
                    {" → "}
                    {e.ukrSupport}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <div
        className="card"
        style={{
          marginBottom: "32px",
        }}
      >
        <button
          onClick={() => setDecksOpen((e) => !e)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <BookOpen size={22} color="var(--text-muted)" />
            <h2
              style={{
                color: "var(--text-main)",
                margin: 0,
              }}
            >
              Мої колоди слів
            </h2>
            {decks.length > 0 && (
              <span
                style={{
                  fontSize: "0.8rem",
                  fontWeight: "700",
                  color: "var(--blue)",
                  background: "var(--blue-light)",
                  padding: "2px 8px",
                  borderRadius: "20px",
                }}
              >
                {decks.length}
              </span>
            )}
          </div>
          {decksOpen ? (
            <ChevronUp size={24} color="var(--text-muted)" />
          ) : (
            <ChevronDown size={24} color="var(--text-muted)" />
          )}
        </button>
        {decksOpen && (
          <div
            style={{
              marginTop: "24px",
            }}
          >
            {creatingDeck ? (
              <div
                style={{
                  marginBottom: "20px",
                  padding: "20px",
                  background: "var(--bg-color)",
                  borderRadius: "14px",
                  border: "1.5px solid rgba(77,184,255,0.25)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    ref={emojiPickerRef}
                    style={{
                      position: "relative",
                    }}
                  >
                    <button
                      onClick={() => setEmojiPickerOpen((e) => !e)}
                      title="Обрати емодзі"
                      style={{
                        width: "56px",
                        height: "56px",
                        fontSize: "1.9rem",
                        borderRadius: "14px",
                        border: emojiPickerOpen
                          ? "2.5px solid var(--blue)"
                          : "2px solid var(--border)",
                        background: emojiPickerOpen
                          ? "var(--blue-light)"
                          : "var(--surface)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.15s ease",
                        boxShadow: emojiPickerOpen
                          ? "0 0 0 3px rgba(77,184,255,0.18)"
                          : "none",
                      }}
                    >
                      {newDeckEmoji || "🗂"}
                    </button>
                    {emojiPickerOpen && (
                      <div
                        style={{
                          position: "absolute",
                          top: "64px",
                          left: 0,
                          zIndex: 2e3,
                          maxWidth: "calc(100vw - 90px)",
                        }}
                      >
                        <EmojiPicker
                          onEmojiClick={(e) => {
                            (setNewDeckEmoji(e.emoji),
                              setEmojiPickerOpen(false));
                          }}
                          autoFocusSearch={false}
                          skinTonesDisabled={true}
                          searchPlaceholder="Пошук емодзі…"
                          width={300}
                          height={360}
                          theme="light"
                          style={{
                            fontFamily: "Nunito, sans-serif",
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      flex: 1,
                    }}
                  >
                    <p
                      style={{
                        fontWeight: "700",
                        margin: "0 0 4px",
                        color: "var(--text-main)",
                        fontSize: "0.9rem",
                      }}
                    >
                      Емодзі колоди
                    </p>
                    <p
                      style={{
                        margin: 0,
                        color: "var(--muted)",
                        fontSize: "0.82rem",
                      }}
                    >
                      Натисни щоб обрати зі списку
                    </p>
                  </div>
                </div>
                <p
                  style={{
                    fontWeight: "700",
                    marginBottom: "10px",
                    color: "var(--text-main)",
                  }}
                >
                  Назва нової колоди
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  <input
                    type="text"
                    value={newDeckName}
                    onChange={(e) => {
                      (setNewDeckName(e.target.value), setDeckError(""));
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleCreateDeck()}
                    placeholder="напр. Урок 3, Тема: тварини…"
                    maxLength={40}
                    autoFocus={true}
                    style={{
                      flex: 1,
                      minWidth: "180px",
                      padding: "10px 14px",
                      fontSize: "1rem",
                      fontWeight: "600",
                      border: "2px solid var(--border)",
                      borderRadius: "10px",
                      outline: "none",
                      fontFamily: "inherit",
                      background: "var(--surface)",
                      color: "var(--text-main)",
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "var(--blue)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "var(--border)")
                    }
                  />
                  <button
                    className="btn btn-primary"
                    onClick={handleCreateDeck}
                    disabled={!newDeckName.trim()}
                  >
                    {newDeckEmoji || "🗂"} <CirclePlus size={18} />
                    {" Створити"}
                  </button>
                  <button
                    className="btn btn-outline"
                    onClick={() => {
                      (setCreatingDeck(false),
                        setNewDeckEmoji(""),
                        setEmojiPickerOpen(false));
                    }}
                  >
                    Скасувати
                  </button>
                </div>
                {deckError && (
                  <div
                    style={{
                      color: "#e53e3e",
                      marginTop: "8px",
                      fontSize: "0.9rem",
                    }}
                  >
                    {deckError}
                  </div>
                )}
              </div>
            ) : (
              <button
                className="btn btn-outline"
                onClick={() => {
                  (setCreatingDeck(true),
                    setNewDeckName(""),
                    setNewDeckEmoji(""),
                    setDeckError(""));
                }}
                style={{
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <FolderPlus size={18} />
                {" Нова колода"}
              </button>
            )}
            <div
              style={{
                marginBottom: "12px",
                borderRadius: "14px",
                border: "1.5px solid var(--border)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 20px",
                  background: "var(--surface)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "1.3rem",
                    }}
                  >
                    📖
                  </span>
                  <div>
                    <div
                      style={{
                        fontWeight: "800",
                        fontSize: "1rem",
                        color: "var(--text-main)",
                      }}
                    >
                      Основні слова
                    </div>
                    <div
                      style={{
                        fontSize: "0.82rem",
                        color: "var(--muted)",
                      }}
                    >
                      {DEFAULT_WORDS.length}
                      {" слів · вбудована колода"}
                    </div>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: "700",
                    color: "var(--muted)",
                    background: "var(--border)",
                    padding: "3px 10px",
                    borderRadius: "20px",
                  }}
                >
                  системна
                </span>
              </div>
            </div>
            {decks.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "32px",
                  color: "var(--muted)",
                  fontSize: "0.95rem",
                }}
              >
                Ще немає кастомних колод. Створіть першу вище!
              </div>
            )}
            {decks.map((e) => (
              <div
                key={e.id}
                style={{
                  marginBottom: "12px",
                  borderRadius: "14px",
                  border: `1.5px solid ${expandedDeckId === e.id ? "rgba(77,184,255,0.4)" : "var(--border)"}`,
                  overflow: "hidden",
                  transition: "border-color 0.2s",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 20px",
                    background:
                      expandedDeckId === e.id
                        ? "linear-gradient(135deg, #EDF7FF, #F0FFF8)"
                        : "var(--surface)",
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onClick={() =>
                    setExpandedDeckId((t) => (t === e.id ? null : e.id))
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "1.3rem",
                      }}
                    >
                      {e.emoji || "🗂"}
                    </span>
                    <div>
                      <div
                        style={{
                          fontWeight: "800",
                          fontSize: "1rem",
                          color: "var(--text-main)",
                        }}
                      >
                        {e.name}
                      </div>
                      <div
                        style={{
                          fontSize: "0.82rem",
                          color: "var(--muted)",
                        }}
                      >
                        {e.words.length}{" "}
                        {e.words.length === 1
                          ? "слово"
                          : e.words.length < 5
                            ? "слова"
                            : "слів"}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <button
                      onClick={(t) => {
                        (t.stopPropagation(), deleteDeck(e.id));
                      }}
                      title="Видалити колоду"
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#e53e3e",
                        padding: "6px",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.background = "#fff5f5")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.background = "none")
                      }
                    >
                      <Trash2 size={18} />
                    </button>
                    {expandedDeckId === e.id ? (
                      <ChevronUp size={20} color="var(--muted)" />
                    ) : (
                      <ChevronDown size={20} color="var(--muted)" />
                    )}
                  </div>
                </div>
                {expandedDeckId === e.id && (
                  <div
                    style={{
                      padding: "20px",
                      borderTop: "1px solid var(--border)",
                      background: "var(--bg-color)",
                    }}
                  >
                    {e.words.length > 0 && (
                      <div
                        style={{
                          marginBottom: "20px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        {e.words.map((t) => (
                          <div
                            key={t.id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "12px 16px",
                              border: "1px solid var(--border)",
                              borderRadius: "10px",
                              background: "var(--surface)",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                flexWrap: "wrap",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "1.2rem",
                                  fontWeight: "800",
                                  color: "var(--text-main)",
                                }}
                              >
                                {t.word}
                              </span>
                              <div
                                style={{
                                  display: "flex",
                                  gap: "6px",
                                  flexWrap: "wrap",
                                }}
                              >
                                {t.letters.map((e, n) => (
                                  <span
                                    key={n}
                                    style={{
                                      fontSize: "0.85rem",
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontWeight: "700",
                                        color: "var(--text-main)",
                                      }}
                                    >
                                      {e}
                                    </span>
                                    <span
                                      style={{
                                        color: "var(--blue)",
                                        fontWeight: "700",
                                      }}
                                    >
                                      ={t.sounds[n]}
                                    </span>
                                  </span>
                                ))}
                              </div>
                            </div>
                            <button
                              onClick={() => deleteWord(e.id, t.id)}
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "#e53e3e",
                                padding: "6px",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                flexShrink: 0,
                              }}
                              onMouseOver={(e) =>
                                (e.currentTarget.style.background = "#fff5f5")
                              }
                              onMouseOut={(e) =>
                                (e.currentTarget.style.background = "none")
                              }
                              title="Видалити слово"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    {addingToDeckId === e.id ? (
                      <div
                        style={{
                          padding: "20px",
                          background: "var(--surface)",
                          borderRadius: "12px",
                          border: "1.5px solid rgba(77,184,255,0.25)",
                        }}
                      >
                        <h3
                          style={{
                            marginBottom: "14px",
                            color: "var(--text-main)",
                            fontWeight: "700",
                            fontSize: "1rem",
                          }}
                        >
                          Додати слово до «{e.name}»
                        </h3>
                        {addStep === "input" && (
                          <div
                            style={{
                              display: "flex",
                              gap: "12px",
                              alignItems: "flex-start",
                              flexWrap: "wrap",
                            }}
                          >
                            <div
                              style={{
                                flex: 1,
                                minWidth: "200px",
                              }}
                            >
                              <input
                                type="text"
                                value={newWord}
                                onChange={handleWordChange}
                                placeholder="Введіть слово (напр. napkin)"
                                maxLength={12}
                                autoFocus={true}
                                onKeyDown={(e) =>
                                  e.key === "Enter" && handleWordNext()
                                }
                                style={{
                                  width: "100%",
                                  padding: "12px 16px",
                                  fontSize: "1.1rem",
                                  fontWeight: "600",
                                  border: "2px solid var(--border)",
                                  borderRadius: "12px",
                                  outline: "none",
                                  fontFamily: "inherit",
                                  background: "var(--bg-color)",
                                  color: "var(--text-main)",
                                  transition: "border-color 0.2s",
                                }}
                                onFocus={(e) =>
                                  (e.target.style.borderColor = "var(--blue)")
                                }
                                onBlur={(e) =>
                                  (e.target.style.borderColor = "var(--border)")
                                }
                              />
                              {wordError && (
                                <div
                                  style={{
                                    color: "#e53e3e",
                                    marginTop: "8px",
                                    fontSize: "0.9rem",
                                  }}
                                >
                                  {wordError}
                                </div>
                              )}
                            </div>
                            <button
                              className="btn btn-primary"
                              onClick={handleWordNext}
                              disabled={!newWord.trim()}
                              style={{
                                whiteSpace: "nowrap",
                              }}
                            >
                              <CirclePlus size={20} />
                              {" Далі"}
                            </button>
                          </div>
                        )}
                        {addStep === "sounds" && (
                          <div>
                            <p
                              style={{
                                marginBottom: "16px",
                                color: "var(--text-muted)",
                                fontSize: "0.95rem",
                              }}
                            >
                              {
                                "Введіть українську звукову підказку для кожної одиниці слова "
                              }
                              <strong
                                style={{
                                  color: "var(--text-main)",
                                }}
                              >
                                {newWord}
                              </strong>
                              :
                            </p>
                            {settings.digraphsEnabled &&
                              wordUnits.some((e) => e.length > 1) && (
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    background: "var(--secondary-light)",
                                    borderRadius: "10px",
                                    padding: "8px 14px",
                                    marginBottom: "16px",
                                    fontSize: "0.88rem",
                                    color: "var(--secondary)",
                                    fontWeight: "600",
                                  }}
                                >
                                  <span>Знайдено діграф(и):</span>
                                  {wordUnits
                                    .filter((e) => e.length > 1)
                                    .map((e) => (
                                      <span
                                        key={e}
                                        style={{
                                          fontWeight: "800",
                                        }}
                                      >
                                        {e}
                                        {" → "}
                                        {
                                          DIGRAPH_CARDS.find((t) => t.key === e)
                                            ?.ukrSupport
                                        }
                                      </span>
                                    ))}
                                </div>
                              )}
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "12px",
                                marginBottom: "20px",
                              }}
                            >
                              {wordUnits.map((e, t) => {
                                let n = e.length > 1,
                                  r = n ? "76px" : "56px";
                                return (
                                  <div
                                    key={t}
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      alignItems: "center",
                                      gap: "8px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: r,
                                        height: "56px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        background: n
                                          ? "var(--secondary-light)"
                                          : "var(--surface)",
                                        border: `2px solid ${n ? "var(--secondary)" : "var(--border)"}`,
                                        borderRadius: "12px",
                                        fontSize: n ? "1.4rem" : "1.8rem",
                                        fontWeight: "800",
                                        color: n
                                          ? "var(--secondary)"
                                          : "var(--text-main)",
                                        letterSpacing: n ? "-1px" : "normal",
                                      }}
                                    >
                                      {e}
                                    </div>
                                    <input
                                      type="text"
                                      value={unitSounds[t] || ""}
                                      onChange={(e) =>
                                        setUnitSound(t, e.target.value)
                                      }
                                      maxLength={3}
                                      placeholder="звук"
                                      style={{
                                        width: r,
                                        padding: "6px 4px",
                                        fontSize: "1rem",
                                        fontWeight: "700",
                                        textAlign: "center",
                                        border: `2px solid ${n ? "var(--secondary)" : "var(--border)"}`,
                                        borderRadius: "8px",
                                        outline: "none",
                                        fontFamily: "inherit",
                                        color: n
                                          ? "var(--secondary)"
                                          : "var(--blue)",
                                        background: "var(--bg-color)",
                                        transition: "border-color 0.2s",
                                      }}
                                      onFocus={(e) =>
                                        (e.target.style.borderColor = n
                                          ? "var(--secondary)"
                                          : "var(--blue)")
                                      }
                                      onBlur={(e) =>
                                        (e.target.style.borderColor = n
                                          ? "var(--secondary)"
                                          : "var(--border)")
                                      }
                                    />
                                  </div>
                                );
                              })}
                            </div>
                            {wordError && (
                              <div
                                style={{
                                  color: "#e53e3e",
                                  marginBottom: "12px",
                                  fontSize: "0.9rem",
                                }}
                              >
                                {wordError}
                              </div>
                            )}
                            <div
                              style={{
                                display: "flex",
                                gap: "12px",
                              }}
                            >
                              <button
                                className="btn btn-primary"
                                onClick={handleSaveWord}
                              >
                                <CirclePlus size={20} />
                                {" Додати слово"}
                              </button>
                              <button
                                className="btn btn-outline"
                                onClick={resetWordForm}
                              >
                                Скасувати
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        className="btn btn-outline"
                        onClick={() => startAddingWord(e.id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <CirclePlus size={18} />
                        {" Додати слово"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
