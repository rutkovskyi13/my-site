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
  let bg, borderColor, ringColor, supportBg, supportColor, nameColor;
  isDigraph
    ? ((bg = isActive ? "var(--lavender-light)" : "#F5F0FF"),
      (borderColor = isActive ? "var(--lavender)" : "rgba(183,146,255,0.35)"),
      (ringColor = "rgba(183,146,255,0.30)"),
      (supportBg = "rgba(183,146,255,0.18)"),
      (supportColor = "var(--lavender-dark)"),
      (nameColor = "var(--lavender-dark)"))
    : isVowel
      ? ((bg = isActive ? "var(--yellow-light)" : "#FFFBEC"),
        (borderColor = isActive
          ? "var(--yellow-dark)"
          : "rgba(255,217,61,0.45)"),
        (ringColor = "rgba(255,217,61,0.30)"),
        (supportBg = "rgba(255,217,61,0.18)"),
        (supportColor = "#B88A00"),
        (nameColor = "#B88A00"))
      : ((bg = isActive ? "var(--sky-light)" : "var(--surface)"),
        (borderColor = isActive ? "var(--sky)" : "var(--border)"),
        (ringColor = "rgba(77,184,255,0.28)"),
        (supportBg = "rgba(77,184,255,0.13)"),
        (supportColor = "var(--sky-dark)"),
        (nameColor = "var(--sky-dark)"));
  let letterColor = isDigraph
    ? "var(--lavender-dark)"
    : isVowel
      ? "#B88A00"
      : "var(--text)";
  return (
    <div
      onClick={() => onClick(id)}
      className="card alphabet-card"
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
            fontSize: "0.6rem",
            fontWeight: "800",
            color: nameColor,
            letterSpacing: "0.02em",
            lineHeight: 1,
            opacity: isActive ? 0 : 0.7,
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
        style={{
          fontSize: isDigraph ? "2.6rem" : "3.4rem",
          fontWeight: "900",
          color: letterColor,
          lineHeight: "1",
          letterSpacing: isDigraph ? "-2px" : "normal",
          userSelect: "none",
        }}
      >
        {displayTop}
        {displayBottom && (
          <span
            style={{
              opacity: 0.45,
              fontWeight: "800",
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
            fontWeight: "800",
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
