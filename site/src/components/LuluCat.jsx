import { useEffect, useRef } from "react";

const BASE = import.meta.env.BASE_URL;
// Відео з прозорістю для всіх браузерів: у кадрі колір зверху, маска прозорості знизу
// (tools/lulu-cat-render.py). WebGL складає їх у прозоре зображення на canvas.
const W = 626,
  H = 640,
  GAP = 16,
  FULL = H * 2 + GAP;

const VS = `attribute vec2 p; varying vec2 uv;
void main(){ uv = vec2((p.x + 1.0) * 0.5, (1.0 - p.y) * 0.5); gl_Position = vec4(p, 0.0, 1.0); }`;
const FS = `precision mediump float; varying vec2 uv; uniform sampler2D t;
void main(){
  vec3 c = texture2D(t, vec2(uv.x, uv.y * ${H}.0 / ${FULL}.0)).rgb;
  float a = texture2D(t, vec2(uv.x, (uv.y * ${H}.0 + ${H + GAP}.0) / ${FULL}.0)).r;
  a = clamp((a - 0.02) / 0.96, 0.0, 1.0);
  gl_FragColor = vec4(c * a, a);
}`;

export function LuluCat({ className }) {
  let canvasRef = useRef(null),
    videoRef = useRef(null),
    posterRef = useRef(null);
  useEffect(() => {
    let canvas = canvasRef.current,
      video = videoRef.current,
      reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      gl = canvas.getContext("webgl", {
        premultipliedAlpha: true,
        alpha: true,
      });
    if (!gl || reduce) return; // без WebGL або без анімації лишається прозорий постер
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
    let buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    let loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    let tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    let alive = true,
      shown = false,
      draw = () => {
        if (video.readyState < 2) return;
        gl.viewport(0, 0, W, H);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGB,
          gl.RGB,
          gl.UNSIGNED_BYTE,
          video,
        );
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        if (!shown) {
          shown = true;
          canvas.style.opacity = 1;
          posterRef.current.style.opacity = 0;
        }
      },
      useRVFC = "requestVideoFrameCallback" in video,
      loop = () => {
        if (!alive) return;
        draw();
        useRVFC
          ? video.requestVideoFrameCallback(loop)
          : requestAnimationFrame(loop);
      };
    video.muted = true;
    video.play().catch(() => {});
    useRVFC
      ? video.requestVideoFrameCallback(loop)
      : requestAnimationFrame(loop);
    // Відео поза екраном не крутимо
    let io = new IntersectionObserver(([e]) => {
      e.isIntersecting ? video.play().catch(() => {}) : video.pause();
    });
    io.observe(canvas);
    return () => {
      alive = false;
      io.disconnect();
      video.pause();
    };
  }, []);
  return (
    <div
      className={className}
      role="img"
      aria-label="Lulu складає з карток слово CAT"
    >
      <img
        ref={posterRef}
        src={`${BASE}brand/lulu-cat-poster.webp`}
        alt=""
        width={W}
        height={H}
      />
      <canvas ref={canvasRef} width={W} height={H} style={{ opacity: 0 }} />
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source src={`${BASE}brand/lulu-cat-alpha.mp4`} type="video/mp4" />
        <source src={`${BASE}brand/lulu-cat-alpha.webm`} type="video/webm" />
      </video>
    </div>
  );
}
