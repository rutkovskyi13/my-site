// Картка літери як навчальна картка брендбука: кремова з фіолетовою рамкою;
// голосні з помаранчевою рамкою, диграфи з блакитною. Натиск відкриває українську опору знизу.
export function LetterCard({
  id,
  displayTop,
  displayBottom,
  ukrName,
  ukrSupport,
  isVowel,
  isDigraph,
  isActive,
  onClick,
}) {
  let kind = isDigraph ? "digraph" : isVowel ? "vowel" : "consonant",
    label = `${displayTop}${displayBottom || ""}${
      isDigraph ? ", диграф" : isVowel ? ", голосна" : ""
    }${ukrName ? `, називається ${ukrName}` : ""}`;
  return (
    <li>
      <button
        type="button"
        className={`letter ${kind}`}
        aria-pressed={isActive}
        aria-label={label}
        onClick={() => onClick(id)}
      >
        {ukrName && (
          <span className="name" aria-hidden="true">
            {ukrName}
          </span>
        )}
        <span className="glyph" aria-hidden="true">
          {displayTop}
          {displayBottom && <span>{displayBottom}</span>}
        </span>
        <span className="sound">{ukrSupport}</span>
      </button>
    </li>
  );
}
