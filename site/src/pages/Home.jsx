import { Link } from "react-router-dom";
import { LetterBubbles } from "../components/LetterBubbles.jsx";

export function Home() {
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
      }}
    >
      <LetterBubbles />
      <div
        className="flex"
        style={{
          position: "relative",
          zIndex: 1,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "62vh",
          textAlign: "center",
        }}
      >
        <div
          className="animate-bounce-in"
          style={{
            marginBottom: "3rem",
          }}
        >
          <img
            src="/logo.png"
            alt="Phonics4All"
            style={{
              maxWidth: "420px",
              width: "100%",
              height: "auto",
              display: "block",
              margin: "0 auto 20px",
            }}
          />
          <p
            style={{
              maxWidth: "540px",
              margin: "0 auto",
              fontSize: "1.15rem",
              lineHeight: "1.65",
              color: "var(--muted)",
              fontWeight: "500",
            }}
          >
            Запрошую до захопливої подорожі у світ читання англійською мовою. 🚀
          </p>
        </div>
        <div
          className="grid"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
            gap: "28px",
            width: "100%",
            maxWidth: "860px",
          }}
        >
          <div
            className="card float-anim"
            style={{
              animationDelay: "0s",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                background: "var(--coral-light)",
                padding: "22px",
                borderRadius: "50%",
                marginBottom: "20px",
                boxShadow: "0 4px 16px rgba(255,107,74,0.18)",
              }}
            >
              <span
                style={{
                  fontSize: "2.8rem",
                  lineHeight: 1,
                }}
              >
                🔤
              </span>
            </div>
            <h2
              className="text-gradient"
              style={{
                marginBottom: "12px",
              }}
            >
              Alphabet Sounds
            </h2>
            <p
              style={{
                marginBottom: "28px",
                flex: 1,
              }}
            >
              Learn individual English letters using Ukrainian support sounds to
              help you.
            </p>
            <Link
              to="/alphabet"
              className="btn btn-primary"
              style={{
                width: "100%",
                fontSize: "1.1rem",
              }}
            >
              Start Alphabet
            </Link>
          </div>
          <div
            className="card float-anim"
            style={{
              animationDelay: "0.8s",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                background: "var(--sky-light)",
                padding: "22px",
                borderRadius: "50%",
                marginBottom: "20px",
                boxShadow: "0 4px 16px rgba(77,184,255,0.18)",
              }}
            >
              <span
                style={{
                  fontSize: "2.8rem",
                  lineHeight: 1,
                }}
              >
                🗣️
              </span>
            </div>
            <h2
              className="text-gradient-blue"
              style={{
                marginBottom: "12px",
              }}
            >
              Word Practice
            </h2>
            <p
              style={{
                marginBottom: "28px",
                flex: 1,
              }}
            >
              Blend sounds together to read your first real English words!
            </p>
            <Link
              to="/word-practice"
              className="btn btn-secondary"
              style={{
                width: "100%",
                fontSize: "1.1rem",
              }}
            >
              Practice Blending
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
