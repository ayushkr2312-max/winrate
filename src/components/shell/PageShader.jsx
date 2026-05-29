import { useEffect, useRef } from "react";

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision mediump float;

uniform vec2  u_res;
uniform float u_time;
uniform float u_scroll;

// ── Value noise ───────────────────────────────────────────────
float hash(vec2 p) {
  p = fract(p * vec2(127.1, 311.7));
  p += dot(p, p + 19.19);
  return fract(p.x * p.y);
}
float vnoise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1,0)), u.x),
    mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0; float a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * vnoise(p); p *= 2.1; a *= 0.5; }
  return v;
}

// ── Soft radial blob ──────────────────────────────────────────
float blob(vec2 uv, vec2 c, float r, float soft) {
  return smoothstep(r, r * (1.0 - soft), length(uv - c));
}

void main() {
  vec2 uv  = gl_FragCoord.xy / u_res;           // [0,1] x [0,1]
  float ar = u_res.x / u_res.y;
  vec2 suv = vec2(uv.x * ar, uv.y);             // aspect-corrected

  // Scroll shifts the noise domain so the effect tiles vertically
  float sy = u_scroll * 0.00045;
  vec2 st  = suv + vec2(0.0, sy);

  float t  = u_time * 0.12;

  // ── Warped noise field (drives ambient texture) ───────────
  vec2 q = vec2(fbm(st + vec2(0.0, 0.0)), fbm(st + vec2(5.2, 1.3)));
  vec2 r = vec2(fbm(st + 3.5*q + vec2(1.7, 9.2) + t*0.5),
                fbm(st + 3.5*q + vec2(8.3, 2.8) + t*0.4));
  float f = fbm(st + 4.0*r + t*0.25);          // 0..1

  // ── 6 blobs — each drifts in its own quadrant ─────────────
  // Positions in aspect-corrected space (ar ≈ 1.6–1.9 typical)

  // 1  top-left     LIME
  vec2 p1 = vec2((0.12 + 0.18*sin(t*0.53 + 0.0)) * ar,
                  0.10 + 0.14*cos(t*0.41 + 1.1));
  float b1 = blob(suv, p1, 0.72, 0.55);

  // 2  top-right    ION (cyan)
  vec2 p2 = vec2((0.78 + 0.16*cos(t*0.47 + 2.3)) * ar,
                  0.15 + 0.12*sin(t*0.38 + 0.7));
  float b2 = blob(suv, p2, 0.65, 0.55);

  // 3  mid-left     ION
  vec2 p3 = vec2((0.08 + 0.14*sin(t*0.34 + 4.1)) * ar,
                  0.48 + 0.18*cos(t*0.29 + 2.5));
  float b3 = blob(suv, p3, 0.60, 0.52);

  // 4  centre       LIME (slow, large)
  vec2 p4 = vec2((0.50 + 0.22*cos(t*0.22 + 1.8)) * ar,
                  0.50 + 0.20*sin(t*0.19 + 3.0));
  float b4 = blob(suv, p4, 0.80, 0.62);

  // 5  bottom-left  AMBER (subtle warm accent)
  vec2 p5 = vec2((0.20 + 0.18*sin(t*0.44 + 3.6)) * ar,
                  0.82 + 0.12*cos(t*0.36 + 0.9));
  float b5 = blob(suv, p5, 0.58, 0.50);

  // 6  bottom-right LIME
  vec2 p6 = vec2((0.82 + 0.15*cos(t*0.51 + 5.2)) * ar,
                  0.78 + 0.14*sin(t*0.43 + 1.4));
  float b6 = blob(suv, p6, 0.63, 0.52);

  // ── Colours  ──────────────────────────────────────────────
  vec3 c_lime  = vec3(0.714, 1.000, 0.118);   // #B6FF1E
  vec3 c_ion   = vec3(0.400, 0.910, 1.000);   // #66E8FF
  vec3 c_amber = vec3(1.000, 0.710, 0.278);   // #FFB547

  // Ambient noise field — very faint colour wash everywhere
  vec3 col = c_lime * f * 0.055 + c_ion * (1.0 - f) * 0.035;

  // Blob contributions
  float noise_mod = 0.7 + 0.3 * f;
  col += c_lime  * b1 * 0.18 * noise_mod;
  col += c_ion   * b2 * 0.15 * noise_mod;
  col += c_ion   * b3 * 0.14 * noise_mod;
  col += c_lime  * b4 * 0.12 * noise_mod;   // large centre — kept softer
  col += c_amber * b5 * 0.10 * noise_mod;
  col += c_lime  * b6 * 0.16 * noise_mod;

  // Soft vignette — corners fade to black
  float vig = uv.x * (1.0 - uv.x) * uv.y * (1.0 - uv.y);
  vig = pow(vig * 16.0, 0.30);
  col *= vig;

  // Final cap — screen blend does the rest
  col = clamp(col, 0.0, 0.22);

  gl_FragColor = vec4(col, 1.0);
}
`;

function compileShader(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.warn("Shader compile:", gl.getShaderInfoLog(s));
    gl.deleteShader(s); return null;
  }
  return s;
}

export default function PageShader() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.innerWidth < 768) return;

    const gl = canvas.getContext("webgl", {
      alpha: false, antialias: false, powerPreference: "low-power",
    });
    if (!gl) return;

    const vert = compileShader(gl, gl.VERTEX_SHADER, VERT);
    const frag = compileShader(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vert || !frag) return;

    const prog = gl.createProgram();
    gl.attachShader(prog, vert);
    gl.attachShader(prog, frag);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER,
      new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes    = gl.getUniformLocation(prog, "u_res");
    const uTime   = gl.getUniformLocation(prog, "u_time");
    const uScroll = gl.getUniformLocation(prog, "u_scroll");

    let W = 0, H = 0;
    function resize() {
      // Render at half-res — shader is blurry by nature, saves GPU
      const dpr = Math.min(window.devicePixelRatio || 1, 1.0);
      W = Math.floor(window.innerWidth  * dpr);
      H = Math.floor(window.innerHeight * dpr);
      canvas.width  = W;
      canvas.height = H;
      canvas.style.width  = window.innerWidth  + "px";
      canvas.style.height = window.innerHeight + "px";
      gl.viewport(0, 0, W, H);
    }
    resize();
    window.addEventListener("resize", resize);

    const t0 = performance.now();
    const TARGET_MS = 1000 / 20; // 20 fps cap — blobs move slowly
    let last = 0;
    let rafId;

    function draw(now) {
      rafId = requestAnimationFrame(draw);
      if (document.hidden) return;
      if (now - last < TARGET_MS) return;
      last = now;
      gl.uniform2f(uRes, W, H);
      gl.uniform1f(uTime, (now - t0) * 0.001);
      gl.uniform1f(uScroll, window.scrollY);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="page-shader" aria-hidden="true" />
  );
}
