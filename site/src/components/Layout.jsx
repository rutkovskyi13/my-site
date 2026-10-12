import { useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const BASE = import.meta.env.BASE_URL;
// Сайт курсу лежить на рівень вище: Practice збирається в landing/practice/.
const COURSE = "../index.html";

export const NAV_ITEMS = [
  { path: "/", label: "Огляд" },
  { path: "/alphabet", label: "Алфавіт" },
  { path: "/word-practice", label: "Читаємо слова" },
  { path: "/dashboard", label: "Для дорослих" },
];

// Шапка й підвал такі самі, як на сайті курсу; розділи тренажера — рядок «пігулок» під шапкою.
export function Layout() {
  let location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return (
    <>
      <header className="top">
        <div className="wrap top-row">
          <a
            className="top-logo"
            href={COURSE}
            aria-label="Phonics4All, на сайт курсу"
          >
            <img
              src={`${BASE}brand/logo-horizontal.svg`}
              alt="Phonics4All"
              width="200"
              height="60"
            />
          </a>
          <nav className="top-nav" aria-label="Розділи">
            <a href={COURSE}>Academy</a>
            <a href={`${COURSE}#step-4`}>
              Resources <small>скоро</small>
            </a>
            <Link to="/" aria-current="page">
              Practice
            </Link>
          </nav>
          <a className="btn btn-primary" href={`${COURSE}#buy`}>
            Купити курс
          </a>
        </div>
        <nav className="wrap subnav" aria-label="Розділи тренажера">
          {NAV_ITEMS.map((t) => (
            <Link
              key={t.path}
              to={t.path}
              className="pill"
              aria-current={location.pathname === t.path ? "page" : void 0}
            >
              {t.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="page">
        <div className="wrap">
          <Outlet />
        </div>
      </main>
      <footer className="site">
        <div className="wrap">
          <div className="brand stack">
            <img
              src={`${BASE}brand/logo-horizontal-light.svg`}
              alt="Phonics4All"
              width="220"
              height="66"
            />
            <p>Читаємо разом із Lulu.</p>
          </div>
          <div>
            <h4>Academy</h4>
            <ul>
              <li>
                <a href={`${COURSE}#step-5`}>Програма курсу</a>
              </li>
              <li>
                <a href={`${COURSE}#buy`}>Купити курс</a>
              </li>
            </ul>
          </div>
          <div>
            <h4>Resources</h4>
            <ul>
              <li>Шаблони карток, скоро</li>
              <li>Посібник для 5–7 років, скоро</li>
            </ul>
          </div>
          <div>
            <h4>Practice</h4>
            <ul>
              <li>
                <Link to="/alphabet">Алфавіт</Link>
              </li>
              <li>
                <Link to="/word-practice">Читаємо слова</Link>
              </li>
              <li>
                <a href={`${COURSE}#step-3`}>Гра «Склади слово»</a>
              </li>
            </ul>
          </div>
          <p className="fine">
            Демо-версія сайту. Публічна оферта й політика конфіденційності
            з'являться до запуску продажів.
          </p>
        </div>
      </footer>
    </>
  );
}
