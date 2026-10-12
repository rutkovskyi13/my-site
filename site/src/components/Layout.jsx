import { Link, Outlet, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  ChartNoAxesColumn,
  House,
  Volume2,
} from "lucide-react";

export const NAV_ITEMS = [
  {
    path: "/",
    label: "Home",
    icon: House,
  },
  {
    path: "/alphabet",
    label: "Alphabet",
    icon: BookOpen,
  },
  {
    path: "/word-practice",
    label: "Word Practice",
    icon: Volume2,
  },
  {
    path: "/dashboard",
    label: "Parents",
    icon: ChartNoAxesColumn,
  },
];
// Шапка як на сайті курсу (landing): логотип, розділи тренажера, повернення на курс.
const BASE = import.meta.env.BASE_URL;
export function Layout() {
  let location = useLocation();
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header className="site-top">
        <div className="site-top-row">
          <Link
            to="/"
            className="site-logo"
            aria-label="Phonics4All Practice, на початок"
          >
            <img
              src={`${BASE}brand/logo-horizontal.svg`}
              alt="Phonics4All"
              width="180"
              height="54"
            />
          </Link>
          <nav className="site-nav" aria-label="Розділи тренажера">
            {NAV_ITEMS.map((t) => {
              let n = location.pathname === t.path,
                Icon = t.icon;
              return (
                <Link
                  key={t.path}
                  to={t.path}
                  className={`nav-item${n ? " active" : ""}`}
                  aria-current={n ? "page" : void 0}
                >
                  <Icon size={18} aria-hidden="true" />
                  <span className="nav-label">{t.label}</span>
                </Link>
              );
            })}
          </nav>
          <a className="back-link" href="../index.html">
            <ArrowLeft size={18} aria-hidden="true" />
            До курсу
          </a>
        </div>
      </header>
      <main
        className="container"
        style={{
          flex: 1,
          paddingBottom: "80px",
          paddingTop: "28px",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
