const BASE = import.meta.env.BASE_URL;

// Заголовок розділу як на сайті курсу: «брова» з іконкою, заголовок ліворуч, пояснення праворуч.
export function PageHead({ icon, eyebrow, title, children }) {
  return (
    <div className="section-head fade-up">
      <div className="eyebrow">
        <img src={`${BASE}brand/${icon}`} alt="" width="40" height="40" />
        {eyebrow}
      </div>
      <div className="split">
        <h1 style={{ fontSize: "var(--step-2)" }}>{title}</h1>
        {children && <p className="muted">{children}</p>}
      </div>
    </div>
  );
}
