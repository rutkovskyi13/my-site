export function LetterCard({
  id: id,
  displayTop: displayTop,
  displayBottom: displayBottom,
  ukrName: ukrName,
  ukrSupport: ukrSupport,
  isVowel: isVowel,
  isDigraph: isDigraph,
  index: index,
  isActive: isActive,
  onClick: onClick,
}) {
  // Брендбук v2: приголосні білі, голосні теплі (помаранчевий акцент), диграфи лавандові. Текст завжди фіолетовий.
  let bg, borderColor, ringColor, supportBg, supportColor, nameColor;
  isDigraph
    ? ((bg = isActive ? "var(--lavender-light)" : "#F4EFFA"),
      (borderColor = isActive ? "var(--lavender-dark)" : "var(--lavender)"),
      (ringColor = "rgba(179,154,215,0.35)"),
      (supportBg = "var(--lavender)"),
      (supportColor = "var(--plum)"),
      (nameColor = "var(--lavender-dark)"))
    : isVowel
      ? ((bg = isActive ? "var(--coral-light)" : "#FFF1EC"),
        (borderColor = "var(--coral)"),
        (ringColor = "rgba(255,92,52,0.25)"),
        (supportBg = "var(--coral)"),
        (supportColor = "var(--plum)"),
        (nameColor = "var(--coral-dark)"))
      : ((bg = "var(--surface)"),
        (borderColor = isActive ? "var(--plum)" : "var(--border)"),
        (ringColor = "rgba(21,159,227,0.30)"),
        (supportBg = "var(--plum)"),
        (supportColor = "var(--milk)"),
        (nameColor = "var(--muted)"));
  let letterColor = "var(--text)";
  return (
    <div
      onClick={() => onClick(id)}
      className="card alphabet-card"
      data-active={isActive}
      style={{
        position: "relative",
        width: isDigraph ? "154px" : "124px",
        height: "158px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        cursor: "pointer",
        background: bg,
        border: `2px solid ${borderColor}`,
        boxShadow: isActive
          ? `0 0 0 3.5px ${ringColor}, var(--shadow-card)`
          : "var(--shadow-xs)",
        transition: "background 0.2s, border-color 0.2s, box-shadow 0.2s",
        overflow: "hidden",
        animation:
          "bounce-in 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275) both",
        animationDelay: `${(index % 10) * 0.05}s`,
        animationFillMode: "both",
      }}
    >
      {ukrName && (
        <div
          style={{
            position: "absolute",
            top: "8px",
            right: "9px",
            fontSize: "0.62rem",
            fontWeight: "800",
            color: nameColor,
            letterSpacing: "0.02em",
            lineHeight: 1,
            opacity: isActive ? 0 : 1,
            transform: isActive
              ? "translateY(-4px) scale(0.85)"
              : "translateY(0) scale(1)",
            transition: "opacity 0.2s ease, transform 0.2s ease",
            userSelect: "none",
            pointerEvents: "none",
            textAlign: "right",
            maxWidth: "44px",
          }}
        >
          {ukrName}
        </div>
      )}
      <div
        className="card-glyph"
        style={{
          fontSize: isDigraph ? "2.8rem" : "3.4rem",
          fontFamily: "var(--font-learn)",
          fontWeight: "700",
          color: letterColor,
          lineHeight: "1",
          letterSpacing: isDigraph ? "-0.5px" : "normal",
          userSelect: "none",
        }}
      >
        {displayTop}
        {displayBottom && (
          <span
            style={{
              opacity: 0.6,
              fontWeight: "400",
            }}
          >
            {displayBottom}
          </span>
        )}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "46px",
          background: supportBg,
          opacity: isActive ? 1 : 0,
          transform: isActive ? "translateY(0)" : "translateY(100%)",
          transition: "opacity 0.22s ease, transform 0.22s ease",
        }}
      >
        <span
          style={{
            fontSize: "1.55rem",
            fontFamily: "var(--font-learn)",
            fontWeight: "700",
            color: supportColor,
            userSelect: "none",
          }}
        >
          {ukrSupport}
        </span>
      </div>
    </div>
  );
}
