import { Link, Outlet, useLocation } from "react-router-dom";
import { BookOpen, ChartNoAxesColumn, House, Volume2 } from "lucide-react";

export const NAV_ITEMS = [
  {
    path: "/",
    label: "Home",
    icon: House,
    activeClass: "active-home",
    iconColor: "#FF6B4A",
  },
  {
    path: "/alphabet",
    label: "Alphabet",
    icon: BookOpen,
    activeClass: "active-alphabet",
    iconColor: "#4DB8FF",
  },
  {
    path: "/word-practice",
    label: "Word Practice",
    icon: Volume2,
    activeClass: "active-words",
    iconColor: "#2ECC8F",
  },
  {
    path: "/dashboard",
    label: "Parents",
    icon: ChartNoAxesColumn,
    activeClass: "active-parents",
    iconColor: "#B792FF",
  },
];
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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "16px 12px 0",
          position: "relative",
          zIndex: 10,
        }}
      >
        <nav className="nav-pill">
          {NAV_ITEMS.map((t) => {
            let n = location.pathname === t.path,
              Icon = t.icon;
            return (
              <Link
                key={t.path}
                to={t.path}
                className={`nav-item${n ? ` ${t.activeClass}` : ""}`}
                style={
                  n
                    ? {}
                    : {
                        color: t.iconColor,
                      }
                }
              >
                <Icon size={18} />
                <span className="nav-label">{t.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <main
        className="container"
        style={{
          flex: 1,
          paddingBottom: "80px",
          paddingTop: "20px",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
