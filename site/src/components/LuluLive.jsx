import { useEffect, useRef } from "react";

const BASE = import.meta.env.BASE_URL;
// Жива Lulu: кліпи з прозорістю (tools/lulu-clips.py, формат stacked alpha: колір зверху, маска знизу).
// «idle» грає по колу; реакції вмикаються через проп `react` = { name, id } (новий id — нова реакція),
// після реакції Lulu повертається до «idle». Між кліпами — коротка змішка на canvas (WebGL).
const W = 494,
  H = 480,
  GAP = 16,
  FULL = H * 2 + GAP,
  FADE = 220,
  CLIPS = ["idle", "listen", "cheer"];

const VS = `attribute vec2 p; varying vec2 uv;
void main(){ uv = vec2((p.x + 1.0) * 0.5, (1.0 - p.y) * 0.5); gl_Position = vec4(p, 0.0, 1.0); }`;
const FS = `precision mediump float; varying vec2 uv; uniform sampler2D a0; uniform sampler2D a1; uniform float k;
vec4 smp(sampler2D t){
  vec3 c = texture2D(t, vec2(uv.x, uv.y * ${H}.0 / ${FULL}.0)).rgb;
  float a = texture2D(t, vec2(uv.x, (uv.y * ${H}.0 + ${H + GAP}.0) / ${FULL}.0)).r;
  a = clamp((a - 0.02) / 0.96, 0.0, 1.0);
  return vec4(c * a, a);
}
void main(){ gl_FragColor = mix(smp(a1), smp(a0), k); }`;

export function LuluLive({ react, className, label = "Lulu" }) {
  let canvasRef = useRef(null),
    posterRef = useRef(null),
    videos = useRef({}),
    api = useRef(null);

  useEffect(() => {
    let canvas = canvasRef.current,
      v = { ...videos.current }, // власна копія: під час прибирання React уже обнуляє ref-и відео
      reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      gl = canvas.getContext("webgl", {
        premultipliedAlpha: true,
        alpha: true,
      });
    if (!gl || reduce) return; // лишається нерухома Lulu-постер
    let sh = (type, src) => {
        let s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        return s;
      },
      prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    let loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    let texs = [0, 1].map((i) => {
      let t = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0 + i);
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      return t;
    });
    gl.uniform1i(gl.getUniformLocation(prog, "a0"), 0);
    gl.uniform1i(gl.getUniformLocation(prog, "a1"), 1);
    let kLoc = gl.getUniformLocation(prog, "k");

    let cur = "idle",
      prev = null,
      fadeAt = 0,
      alive = true,
      shown = false,
      visible = true,
      upload = (i, vid) => {
        gl.activeTexture(gl.TEXTURE0 + i);
        gl.bindTexture(gl.TEXTURE_2D, texs[i]);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, vid);
      },
      draw = (now) => {
        let a = v[cur];
        if (!a || a.readyState < 2) return;
        let k = prev ? Math.min(1, (now - fadeAt) / FADE) : 1;
        if (k >= 1) prev = null;
        gl.viewport(0, 0, W, H);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        upload(0, a);
        if (prev && v[prev].readyState >= 2) upload(1, v[prev]);
        else upload(1, a);
        gl.uniform1f(kLoc, k);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        if (!shown) {
          shown = true;
          canvas.style.opacity = 1;
          posterRef.current.style.opacity = 0;
        }
      },
      // перемикання: попередній кліп завмирає на поточному кадрі й тане, новий грає з початку
      play = (name) => {
        let next = v[name];
        if (!next || next.readyState < 2) return;
        if (cur === "cheer" && name === "listen") return; // радість не перебиваємо
        if (name === cur && name !== "idle") {
          if (next.currentTime < next.duration * 0.6) return; // ще реагує — нехай доведе рух
          next.currentTime = 0;
        }
        if (name !== cur) {
          prev = cur;
          v[prev].pause();
          cur = name;
          next.currentTime = 0;
          fadeAt = performance.now();
        }
        if (visible) next.play().catch(() => {});
      },
      tick = (now) => {
        if (!alive) return;
        if (visible) draw(now);
        requestAnimationFrame(tick);
      };
    CLIPS.forEach((n) => {
      v[n].muted = true;
      v[n].loop = n === "idle";
      if (n !== "idle") v[n].onended = () => play("idle");
    });
    v.idle.play().catch(() => {});
    requestAnimationFrame(tick);
    api.current = play;
    // поза екраном Lulu відпочиває
    let io = new IntersectionObserver(([e]) => {
      if (!alive) return;
      visible = e.isIntersecting;
      visible ? v[cur].play().catch(() => {}) : v[cur].pause();
    });
    io.observe(canvas);
    return () => {
      alive = false;
      api.current = null;
      io.disconnect();
      CLIPS.forEach((n) => v[n].pause());
    };
  }, []);

  useEffect(() => {
    if (react && api.current) api.current(react.name);
  }, [react?.id]);

  return (
    <div
      className={`lulu-live ${className || ""}`}
      role="img"
      aria-label={label}
    >
      <img
        ref={posterRef}
        src={`${BASE}brand/lulu-live-poster.webp`}
        alt=""
        width={W}
        height={H}
      />
      <canvas ref={canvasRef} width={W} height={H} style={{ opacity: 0 }} />
      {CLIPS.map((n) => (
        <video
          key={n}
          ref={(el) => {
            if (el) videos.current[n] = el;
          }}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source src={`${BASE}brand/lulu-${n}.mp4`} type="video/mp4" />
          <source src={`${BASE}brand/lulu-${n}.webm`} type="video/webm" />
        </video>
      ))}
    </div>
  );
}
