import { useEffect, useRef } from "react";

// Single Gaussian light band sweeps left → right across the full page.
// Dots outside the band are invisible. Dots inside fade in/out smoothly
// with low opacity so foreground content stays readable.
export default function HeroCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isSmallViewport = window.innerWidth < 900;
    const lowPowerDevice = (navigator.hardwareConcurrency || 8) <= 4;
    const disableCanvas = reducedMotion || isSmallViewport;
    if (disableCanvas) return;

    let W = 0, H = 0;
    const points = [];
    let t0 = performance.now();
    let lastDraw = 0;
    let pillPos = null;
    const targetFrameTime = lowPowerDevice ? 1000 / 24 : 1000 / 30;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width  = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    }

    function build() {
      points.length = 0;
      const area = W * H;
      const densityScale = lowPowerDevice ? 1.35 : 1;
      const SP = Math.max(7, Math.min(12, Math.sqrt(area / 8500) * densityScale));
      for (let y = SP / 2; y < H + SP; y += SP) {
        for (let x = SP / 2; x < W + SP; x += SP) {
          points.push({ bx: x, by: y, phase: Math.random() * Math.PI * 2 });
        }
      }
    }

    resize();
    window.addEventListener("resize", resize);

    const pillAttachId = requestAnimationFrame(() => {
      const pill = document.querySelector(".pill");
      if (!pill) return;
      function onEnter() {
        const r = pill.getBoundingClientRect();
        pillPos = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      }
      function onLeave() { pillPos = null; }
      pill.addEventListener("mouseenter", onEnter);
      pill.addEventListener("mouseleave", onLeave);
      canvas._pill = pill;
      canvas._onEnter = onEnter;
      canvas._onLeave = onLeave;
    });

    const BAND_SPEED = 375;   // px / second
    const SIGMA      = 360;   // Gaussian half-width — larger = wider, softer band
    const MAX_ALPHA  = 0.20;  // keep well below foreground text
    const CUTOFF     = 0.015; // skip dots below this Gaussian value (invisible)

    // Gather params for pill hover
    const GATHER_R = 260;
    const GATHER_F = 20;

    let rafId;
    function draw() {
      const now = performance.now();
      if (document.hidden) {
        rafId = requestAnimationFrame(draw);
        return;
      }

      if (now - lastDraw < targetFrameTime) {
        rafId = requestAnimationFrame(draw);
        return;
      }
      lastDraw = now;

      const t = (now - t0) * 0.001;
      ctx.clearRect(0, 0, W, H);

      // Band centre travels from -2σ (off-screen left) to W+2σ (off-screen right), then repeats
      const cycle  = W + SIGMA * 4;
      const bandX  = ((t * BAND_SPEED) % cycle) - SIGMA * 2;

      for (let i = 0; i < points.length; i++) {
        const p = points[i];

        // Pill hover: circular gather overrides band
        if (pillPos) {
          const dx = pillPos.x - p.bx;
          const dy = pillPos.y - p.by;
          const d2 = dx * dx + dy * dy;
          if (d2 < GATHER_R * GATHER_R) {
            const d = Math.sqrt(d2);
            const f      = 1 - d / GATHER_R;
            const smooth = f * f * (3 - 2 * f);
            const px     = p.bx + (dx / (d || 1)) * smooth * GATHER_F;
            const py     = p.by + (dy / (d || 1)) * smooth * GATHER_F;
            const a      = Math.min(smooth * 0.55, 0.88);
            const r      = 1.0 + smooth * 2.0;
            ctx.beginPath();
            ctx.arc(px, py, r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(182,255,30,${a})`;
            ctx.fill();
          }
          continue;
        }

        // Gaussian falloff from band centre (x-axis only)
        const dist = p.bx - bandX;
        const g    = Math.exp(-(dist * dist) / (2 * SIGMA * SIGMA));

        if (g < CUTOFF) continue;

        const breath = Math.sin(t * 0.7 + p.phase) * 0.03;
        const a      = Math.min(g * MAX_ALPHA + breath * g, MAX_ALPHA);
        const r      = 0.6 + g * 1.4;

        ctx.beginPath();
        ctx.arc(p.bx, p.by, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(182,255,30,${a})`;
        ctx.fill();
      }

      rafId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(rafId);
      cancelAnimationFrame(pillAttachId);
      window.removeEventListener("resize", resize);
      if (canvas._pill) {
        canvas._pill.removeEventListener("mouseenter", canvas._onEnter);
        canvas._pill.removeEventListener("mouseleave", canvas._onLeave);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="hero-canvas"
      aria-hidden="true"
    />
  );
}
