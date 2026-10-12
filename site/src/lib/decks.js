export const DECKS_KEY = "phonics4all_decks";
export const LEGACY_WORDS_KEY = "phonics4all_custom_words";

export function loadDecks() {
  try {
    let e = localStorage.getItem(DECKS_KEY);
    if (e) return JSON.parse(e);
    let t = localStorage.getItem(LEGACY_WORDS_KEY);
    if (t) {
      let e = JSON.parse(t);
      if (e.length > 0) {
        let t = [
          {
            id: "deck_migrated",
            name: "Мої слова",
            words: e,
          },
        ];
        return (saveDecks(t), t);
      }
    }
    return [];
  } catch {
    return [];
  }
}
export function saveDecks(e) {
  (localStorage.setItem(DECKS_KEY, JSON.stringify(e)),
    window.dispatchEvent(new Event("phonics4all_decks_updated")));
}
export function createDeck(e, t = "🗂") {
  return {
    id: `deck_${Date.now()}`,
    name: e.trim(),
    emoji: t,
    words: [],
  };
}
