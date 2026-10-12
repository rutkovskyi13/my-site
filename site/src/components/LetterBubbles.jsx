import { useCallback, useEffect, useRef, useState } from "react";

// Letters floating up in the background of the home page.
export const BUBBLE_LETTERS =
    "A.B.C.D.E.F.G.H.I.J.K.L.M.N.O.P.R.S.T.U.W.sh.ch.ee.oo.a.b.c.d.e.f.g".split(
      ".",
    ),
  BUBBLE_COLORS = [
    {
      bg: "rgba(255,92,52, 0.08)",
      border: "rgba(255,92,52, 0.24)",
      text: "rgba(200,64,29, 0.7)",
    },
    {
      bg: "rgba(21,159,227, 0.08)",
      border: "rgba(21,159,227, 0.24)",
      text: "rgba(11,111,163, 0.7)",
    },
    {
      bg: "rgba(239,184,77, 0.08)",
      border: "rgba(239,184,77, 0.24)",
      text: "rgba(150,100,10, 0.7)",
    },
    {
      bg: "rgba(39,185,160, 0.08)",
      border: "rgba(39,185,160, 0.24)",
      text: "rgba(19,121,106, 0.7)",
    },
    {
      bg: "rgba(179,154,215, 0.08)",
      border: "rgba(179,154,215, 0.24)",
      text: "rgba(108,79,153, 0.7)",
    },
  ];
export function getBubbleConfig() {
  let e = window.innerWidth;
  return e >= 1024
    ? {
        maxBubbles: 20,
        initialCount: 10,
      }
    : e >= 600
      ? {
          maxBubbles: 13,
          initialCount: 7,
        }
      : {
          maxBubbles: 7,
          initialCount: 4,
        };
}
let nextBubbleId = 0;
export function createBubble(e = 0) {
  let t = Math.floor(Math.random() * 7) + 10;
  return {
    id: nextBubbleId++,
    letter: BUBBLE_LETTERS[Math.floor(Math.random() * BUBBLE_LETTERS.length)],
    x: Math.random() * 86 + 2,
    size: Math.floor(Math.random() * 32) + 42,
    dur: t,
    swayDur: (Math.random() * 2 + 3).toFixed(1),
    colorIdx: Math.floor(Math.random() * BUBBLE_COLORS.length),
    popping: false,
    negDelay: e,
  };
}
export function createInitialBubbles(e) {
  return Array.from(
    {
      length: e,
    },
    (t, n) => {
      let r = Math.floor(Math.random() * 7) + 10,
        i = -((r * (n + 1)) / (e + 1));
      return {
        id: nextBubbleId++,
        letter:
          BUBBLE_LETTERS[Math.floor(Math.random() * BUBBLE_LETTERS.length)],
        x: Math.random() * 86 + 2,
        size: Math.floor(Math.random() * 32) + 42,
        dur: r,
        swayDur: (Math.random() * 2 + 3).toFixed(1),
        colorIdx: Math.floor(Math.random() * BUBBLE_COLORS.length),
        popping: false,
        negDelay: i,
      };
    },
  );
}
export function LetterBubbles() {
  let [config, setConfig] = useState(getBubbleConfig),
    [bubbles, setBubbles] = useState(() =>
      createInitialBubbles(getBubbleConfig().initialCount),
    ),
    timerRef = useRef(null),
    mountedRef = useRef(true),
    configRef = useRef(config);
  ((configRef.current = config),
    useEffect(() => {
      let e,
        n = () => {
          (clearTimeout(e),
            (e = setTimeout(() => {
              mountedRef.current && setConfig(getBubbleConfig());
            }, 250)));
        };
      return (
        window.addEventListener("resize", n),
        () => {
          (window.removeEventListener("resize", n), clearTimeout(e));
        }
      );
    }, []));
  let scheduleNext = useCallback(() => {
    let e = Math.random() * 2500 + 1500;
    timerRef.current = setTimeout(() => {
      mountedRef.current &&
        (setBubbles((e) =>
          e.length < configRef.current.maxBubbles ? [...e, createBubble(0)] : e,
        ),
        scheduleNext());
    }, e);
  }, []);
  useEffect(
    () => (
      (mountedRef.current = true),
      scheduleNext(),
      () => {
        ((mountedRef.current = false), clearTimeout(timerRef.current));
      }
    ),
    [scheduleNext],
  );
  let startPop = useCallback((e, t) => {
      t === "bubble-rise-y" &&
        setBubbles((t) =>
          t.map((t) =>
            t.id === e
              ? {
                  ...t,
                  popping: true,
                }
              : t,
          ),
        );
    }, []),
    removeBubble = useCallback((e) => {
      setBubbles((t) => t.filter((t) => t.id !== e));
    }, []);
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      
      {bubbles.map((e) => {
        let t = BUBBLE_COLORS[e.colorIdx],
          n = e.letter.length > 1,
          r = `${e.negDelay}s`;
        return (
          <div
            key={e.id}
            style={{
              position: "absolute",
              bottom: "-80px",
              left: `${e.x}%`,
              pointerEvents: "none",
              animation: `bubble-rise-y ${e.dur}s ${r} linear forwards`,
            }}
            onAnimationEnd={(t) => {
              !e.popping &&
                t.animationName === "bubble-rise-y" &&
                startPop(e.id, t.animationName);
            }}
          >
            <div
              style={{
                animation: `bubble-sway-x ${e.swayDur}s ease-in-out infinite`,
              }}
            >
              <div
                style={{
                  width: e.size,
                  height: e.size,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "700",
                  fontFamily: "var(--font-learn)",
                  background: t.bg,
                  border: `1.5px solid ${t.border}`,
                  color: t.text,
                  fontSize: n
                    ? `${Math.round(e.size * 0.3)}px`
                    : `${Math.round(e.size * 0.42)}px`,
                  backdropFilter: "blur(2px)",
                  WebkitBackdropFilter: "blur(2px)",
                  boxShadow:
                    "inset 0 -3px 8px rgba(255,255,255,0.3), inset 0 3px 10px rgba(255,255,255,0.45)",
                  animation: e.popping
                    ? "bubble-pop 0.45s ease-out forwards"
                    : `bubble-appear ${e.dur}s ${r} ease-in-out forwards`,
                }}
                onAnimationEnd={e.popping ? () => removeBubble(e.id) : void 0}
              >
                {e.letter}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
