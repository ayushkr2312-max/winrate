import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/* ──────────────────────────────────────────────────────────────
   01 — Workflow Automation
   Animated node-graph: trigger → branch → tools → output.
   Tokens stream along edges.
─────────────────────────────────────────────────────────────── */
export function VisualAutomation({ active }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!active) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".au-trigger", { scale: 0.85 }, { scale: 1, duration: 0.5, ease: "back.out(2)", transformBox: "fill-box", transformOrigin: "center" });
      gsap.fromTo(".au-edge", { strokeDashoffset: 200 }, { strokeDashoffset: 0, duration: 0.9, stagger: 0.07, ease: "power2.out" });
      gsap.to(".au-tool", {
        opacity: 0.6, duration: 0.8, yoyo: true, repeat: -1, ease: "sine.inOut", stagger: 0.2,
      });
    }, ref);

    // animate tokens along edges using normalized t parameter
    const tokens = ref.current?.querySelectorAll(".au-token");
    if (!tokens) return;
    // Edge definitions: cubic bezier control points matching au-path-N
    const edges = [
      { p0:[30,80], p1:[70,80], p2:[90,50], p3:[130,50] },
      { p0:[30,80], p1:[70,80], p2:[90,80], p3:[130,80] },
      { p0:[30,80], p1:[70,80], p2:[90,110], p3:[130,110] },
      { p0:[165,50], p1:[200,50], p2:[215,80], p3:[250,80] },
      { p0:[165,80], p1:[200,80], p2:[215,80], p3:[250,80] },
      { p0:[165,110], p1:[200,110], p2:[215,80], p3:[250,80] },
    ];
    function bezier(t, p0, p1, p2, p3, axis) {
      const u = 1 - t;
      return u*u*u*p0[axis] + 3*u*u*t*p1[axis] + 3*u*t*t*p2[axis] + t*t*t*p3[axis];
    }
    const tweens = [];
    tokens.forEach((tok, i) => {
      const e = edges[i % edges.length];
      const obj = { t: 0 };
      const tween = gsap.to(obj, {
        t: 1,
        duration: 2.2 + i * 0.15,
        repeat: -1,
        ease: "none",
        delay: i * 0.3,
        onUpdate: () => {
          const x = bezier(obj.t, e.p0, e.p1, e.p2, e.p3, 0);
          const y = bezier(obj.t, e.p0, e.p1, e.p2, e.p3, 1);
          tok.setAttribute("cx", x);
          tok.setAttribute("cy", y);
          tok.setAttribute("opacity", obj.t < 0.05 || obj.t > 0.95 ? "0.3" : "1");
        },
      });
      tweens.push(tween);
    });
    return () => { ctx.revert(); tweens.forEach(t => t.kill()); };
  }, [active]);

  return (
    <div ref={ref} style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--f-mono)", fontSize: ".54rem", letterSpacing: ".18em", color: "var(--whisper)" }}>
        <span>RUN.AUTOMATION · LOOP × ∞</span>
        <span style={{ color: "var(--lime)" }}>● ACTIVE</span>
      </div>

      <svg viewBox="0 0 280 160" style={{ flex: 1, width: "100%", marginTop: 10 }}>
        <path className="au-edge" d="M30 80 C 70 80, 90 50, 130 50" stroke="rgba(182,255,30,.32)" strokeWidth="0.7" fill="none" strokeDasharray="3,2" />
        <path className="au-edge" d="M30 80 C 70 80, 90 80, 130 80" stroke="rgba(182,255,30,.32)" strokeWidth="0.7" fill="none" strokeDasharray="3,2" />
        <path className="au-edge" d="M30 80 C 70 80, 90 110, 130 110" stroke="rgba(182,255,30,.32)" strokeWidth="0.7" fill="none" strokeDasharray="3,2" />
        <path className="au-edge" d="M165 50 C 200 50, 215 80, 250 80" stroke="rgba(182,255,30,.32)" strokeWidth="0.7" fill="none" strokeDasharray="3,2" />
        <path className="au-edge" d="M165 80 C 200 80, 215 80, 250 80" stroke="rgba(182,255,30,.32)" strokeWidth="0.7" fill="none" strokeDasharray="3,2" />
        <path className="au-edge" d="M165 110 C 200 110, 215 80, 250 80" stroke="rgba(182,255,30,.32)" strokeWidth="0.7" fill="none" strokeDasharray="3,2" />

        <g className="au-trigger">
          <circle cx="30" cy="80" r="10" fill="rgba(182,255,30,.18)" stroke="var(--lime)" strokeWidth="1" />
          <circle cx="30" cy="80" r="4" fill="var(--lime)" />
        </g>
        <text x="30" y="106" textAnchor="middle" fill="var(--lime)" style={{ font: "700 4px var(--f-mono)", letterSpacing: ".2em" }}>TRIGGER</text>

        {[
          { y: 50, lbl: "MAKE" },
          { y: 80, lbl: "API" },
          { y: 110, lbl: "n8n" },
        ].map((n, i) => (
          <g key={i}>
            <rect className="au-tool" x="135" y={n.y - 9} width="30" height="18" fill="rgba(0,0,0,.6)" stroke="var(--lime-20)" />
            <text x="150" y={n.y + 2} textAnchor="middle" fill="var(--white)" style={{ font: "600 4.2px var(--f-mono)", letterSpacing: ".15em" }}>{n.lbl}</text>
          </g>
        ))}

        <g>
          <circle cx="250" cy="80" r="10" fill="rgba(182,255,30,.06)" stroke="var(--lime)" strokeWidth="1" strokeDasharray="2,1.5" />
          <path d="M246 80 L 250 84 L 256 76" stroke="var(--lime)" strokeWidth="1.2" fill="none" />
        </g>
        <text x="250" y="106" textAnchor="middle" fill="var(--lime)" style={{ font: "700 4px var(--f-mono)", letterSpacing: ".2em" }}>SHIPPED</text>

        {[0,1,2,3,4,5].map(i => (
          <circle key={i} className="au-token" cx="30" cy="80" r="2" fill="var(--lime)" />
        ))}
      </svg>

      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--f-mono)", fontSize: ".52rem", letterSpacing: ".16em", color: "var(--muted)" }}>
        <span>NODES <span style={{ color: "var(--lime)" }}>3</span> · RUNS <span style={{ color: "var(--lime)" }}>1.4k/d</span></span>
        <span>OPS.SAVED · <span style={{ color: "var(--lime)" }}>18h / wk</span></span>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   02 — Talent Scouting
   Radar-grid with sweep + player pings. Each ping resolves
   into a tagged tile.
─────────────────────────────────────────────────────────────── */
export function VisualScouting({ active }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!active) return;
    const ctx = gsap.context(() => {
      gsap.to(".sc2-sweep", { rotate: 360, transformOrigin: "center center", duration: 4.5, repeat: -1, ease: "none" });
      gsap.fromTo(".sc2-ping", { scale: 0, opacity: 0 }, {
        scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2)",
        transformBox: "fill-box", transformOrigin: "center",
        stagger: { each: 0.12, from: "random" },
      });
      gsap.to(".sc2-pulse", {
        scale: 2.5, opacity: 0, duration: 1.6, ease: "power2.out",
        transformBox: "fill-box", transformOrigin: "center",
        repeat: -1, stagger: 0.2,
      });
    }, ref);
    return () => ctx.revert();
  }, [active]);

  const pings = [
    { x: 70, y: 50, tier: 1 }, { x: 145, y: 80, tier: 2 },
    { x: 110, y: 30, tier: 3 }, { x: 200, y: 60, tier: 1 },
    { x: 95, y: 110, tier: 2 }, { x: 175, y: 110, tier: 3 },
    { x: 230, y: 90, tier: 2 },
  ];

  return (
    <div ref={ref} style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--f-mono)", fontSize: ".54rem", letterSpacing: ".18em", color: "var(--whisper)" }}>
        <span>RADAR · VAL/NA/TIER-2 · 412 SCANNED</span>
        <span style={{ color: "var(--lime)" }}>● SWEEPING</span>
      </div>

      <svg viewBox="0 0 280 160" style={{ flex: 1, width: "100%", marginTop: 10 }}>
        <defs>
          <radialGradient id="sc2sweep" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(182,255,30,.35)" />
            <stop offset="100%" stopColor="rgba(182,255,30,0)" />
          </radialGradient>
        </defs>

        {/* radar rings */}
        {[35, 55, 75].map((r, i) => (
          <circle key={i} cx="140" cy="80" r={r} fill="none" stroke="rgba(182,255,30,.1)" strokeWidth="0.6" strokeDasharray="2,2" />
        ))}
        <line x1="60" y1="80" x2="220" y2="80" stroke="rgba(182,255,30,.06)" strokeWidth="0.5" />
        <line x1="140" y1="5" x2="140" y2="155" stroke="rgba(182,255,30,.06)" strokeWidth="0.5" />

        {/* sweep */}
        <g className="sc2-sweep">
          <path d="M140 80 L 220 80 A 80 80 0 0 0 196 21 Z" fill="url(#sc2sweep)" />
        </g>

        {/* center */}
        <circle cx="140" cy="80" r="2.5" fill="var(--lime)" />

        {/* pings */}
        {pings.map((p, i) => (
          <g key={i}>
            <circle className="sc2-pulse" cx={p.x} cy={p.y} r="4" fill="none" stroke="var(--lime)" strokeWidth="0.6" style={{ transformBox: "fill-box", transformOrigin: "center" }} />
            <circle className="sc2-ping" cx={p.x} cy={p.y} r={p.tier === 1 ? 3.6 : p.tier === 2 ? 2.6 : 1.8}
              fill={p.tier === 1 ? "var(--lime)" : p.tier === 2 ? "rgba(102,232,255,.85)" : "rgba(240,240,238,.4)"} />
          </g>
        ))}
      </svg>

      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        {[
          { name: "P-1421", k: "K/D 1.42", c: "var(--lime)" },
          { name: "P-3340", k: "ACS 280", c: "rgba(102,232,255,.85)" },
          { name: "P-0918", k: "Win 71%", c: "var(--lime)" },
        ].map((p, i) => (
          <div key={i} style={{ flex: 1, padding: "6px 8px", border: "1px solid var(--border-2)", background: "rgba(0,0,0,.4)" }}>
            <div style={{ fontFamily: "var(--f-mono)", fontSize: ".5rem", color: p.c, letterSpacing: ".16em" }}>{p.name}</div>
            <div style={{ fontFamily: "var(--f-mono)", fontSize: ".48rem", color: "var(--muted)", letterSpacing: ".12em", marginTop: 2 }}>{p.k}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   03 — Data Visualization
   Mini live dashboard: 3 chart widgets (bars, line, ring).
─────────────────────────────────────────────────────────────── */
export function VisualDashboard({ active }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!active) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".dv-bar", { scaleY: 0 }, { scaleY: 1, transformOrigin: "bottom", stagger: 0.05, duration: 0.7, ease: "power2.out" });
      gsap.fromTo(".dv-line", { strokeDashoffset: 600 }, { strokeDashoffset: 0, duration: 1.4, ease: "power2.out" });
      gsap.to(".dv-ring", { strokeDashoffset: 47, duration: 1.6, ease: "power2.out" });
      // tick the live numbers
      const num = ref.current?.querySelectorAll(".dv-num");
      if (num) num.forEach(n => {
        const target = parseFloat(n.getAttribute("data-v"));
        const o = { v: 0 };
        gsap.to(o, { v: target, duration: 1.6, ease: "power2.out",
          onUpdate: () => { n.textContent = (target % 1 ? o.v.toFixed(1) : Math.floor(o.v)) + (n.getAttribute("data-s") || ""); } });
      });
    }, ref);
    return () => ctx.revert();
  }, [active]);

  const bars = [40, 65, 50, 72, 90, 60, 78, 85, 55, 92, 70, 68];

  return (
    <div ref={ref} style={{ width: "100%", height: "100%", display: "grid", gridTemplateRows: "auto 1fr auto", padding: 10, gap: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--f-mono)", fontSize: ".54rem", letterSpacing: ".18em", color: "var(--whisper)" }}>
        <span>DASH · MATCH-PERF · LAST 12W</span>
        <span style={{ color: "var(--lime)" }}>● LIVE 132ms</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 10 }}>
        {/* bars */}
        <div style={{ padding: 8, border: "1px solid var(--border-2)", background: "rgba(0,0,0,.45)", display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: ".48rem", letterSpacing: ".18em", color: "var(--lime)" }}>K/D · WEEKLY</div>
          <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 4, marginTop: 8 }}>
            {bars.map((h, i) => (
              <div key={i} className="dv-bar" style={{
                flex: 1, height: `${h}%`,
                background: h > 80 ? "var(--lime)" : "rgba(182,255,30,.3)",
                borderTop: h > 80 ? "1px solid var(--lime)" : "none",
              }} />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--f-mono)", fontSize: ".42rem", color: "var(--muted)", marginTop: 4 }}>
            <span>W31</span><span>W42</span>
          </div>
        </div>

        {/* ring */}
        <div style={{ padding: 8, border: "1px solid var(--border-2)", background: "rgba(0,0,0,.45)", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: ".48rem", letterSpacing: ".18em", color: "var(--lime)", alignSelf: "flex-start" }}>WIN RATE</div>
          <svg viewBox="0 0 60 60" style={{ width: 90, height: 90 }}>
            <circle cx="30" cy="30" r="22" fill="none" stroke="rgba(182,255,30,.1)" strokeWidth="3" />
            <circle className="dv-ring" cx="30" cy="30" r="22" fill="none" stroke="var(--lime)" strokeWidth="3"
              strokeDasharray="138" strokeDashoffset="138" strokeLinecap="round"
              transform="rotate(-90 30 30)" />
          </svg>
          <div style={{ fontFamily: "var(--f-display)", fontSize: "1.4rem", fontWeight: 900, color: "var(--lime)", letterSpacing: "-.02em" }}>
            <span className="dv-num" data-v="66" data-s="%">0%</span>
          </div>
        </div>
      </div>

      {/* line */}
      <div style={{ padding: "6px 8px", border: "1px solid var(--border-2)", background: "rgba(0,0,0,.45)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--f-mono)", fontSize: ".48rem", letterSpacing: ".18em" }}>
          <span style={{ color: "var(--lime)" }}>ACS · ROLLING 30</span>
          <span style={{ color: "var(--white)" }}><span className="dv-num" data-v="284">0</span> avg</span>
        </div>
        <svg viewBox="0 0 280 30" style={{ width: "100%", height: 32 }}>
          <polyline className="dv-line" fill="none" stroke="var(--lime)" strokeWidth="1.2"
            strokeDasharray="600"
            points="0,20 25,16 50,18 75,12 100,14 125,9 150,11 175,6 200,8 225,4 250,7 280,3" />
          <polyline fill="rgba(182,255,30,.07)" stroke="none"
            points="0,30 0,20 25,16 50,18 75,12 100,14 125,9 150,11 175,6 200,8 225,4 250,7 280,3 280,30" />
        </svg>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   04 — Social Growth
   Constellation of platforms (X / IG / TT / TWITCH / YT)
   with growth arc + engagement bubbles.
─────────────────────────────────────────────────────────────── */
export function VisualSocial({ active }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!active) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".so-platform", { scale: 0 }, { scale: 1, duration: 0.6, ease: "back.out(2)", stagger: 0.08, transformBox: "fill-box", transformOrigin: "center" });
      gsap.fromTo(".so-arc", { strokeDashoffset: 500 }, { strokeDashoffset: 0, duration: 1.6, ease: "power2.out", stagger: 0.1 });
      gsap.to(".so-bubble", { y: -6, duration: 1.5, ease: "sine.inOut", yoyo: true, repeat: -1, stagger: 0.2 });
    }, ref);
    return () => ctx.revert();
  }, [active]);

  const platforms = [
    { x: 30, y: 60, lbl: "X", val: "+12%" },
    { x: 90, y: 30, lbl: "IG", val: "+8%" },
    { x: 150, y: 80, lbl: "TT", val: "+34%" },
    { x: 210, y: 35, lbl: "TW", val: "+5%" },
    { x: 250, y: 100, lbl: "YT", val: "+19%" },
  ];

  return (
    <div ref={ref} style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--f-mono)", fontSize: ".54rem", letterSpacing: ".18em", color: "var(--whisper)" }}>
        <span>SOCIAL · 5 NETWORKS · 90D</span>
        <span style={{ color: "var(--lime)" }}>● +18% QoQ</span>
      </div>

      <svg viewBox="0 0 280 130" style={{ flex: 1, width: "100%", marginTop: 10 }}>
        {/* arcs between platforms */}
        <path className="so-arc" d="M30 60 Q 60 40, 90 30" stroke="rgba(182,255,30,.25)" strokeWidth="0.6" fill="none" strokeDasharray="500" />
        <path className="so-arc" d="M90 30 Q 120 50, 150 80" stroke="rgba(182,255,30,.25)" strokeWidth="0.6" fill="none" strokeDasharray="500" />
        <path className="so-arc" d="M150 80 Q 180 50, 210 35" stroke="rgba(182,255,30,.25)" strokeWidth="0.6" fill="none" strokeDasharray="500" />
        <path className="so-arc" d="M210 35 Q 230 70, 250 100" stroke="rgba(182,255,30,.25)" strokeWidth="0.6" fill="none" strokeDasharray="500" />

        {/* engagement bubbles */}
        {[60, 110, 180, 230].map((cx, i) => (
          <circle key={i} className="so-bubble" cx={cx} cy={60 + (i % 2 === 0 ? -10 : 10)} r="2.5" fill="rgba(102,232,255,.6)" />
        ))}

        {/* platforms */}
        {platforms.map((p, i) => (
          <g key={i} className="so-platform" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <circle cx={p.x} cy={p.y} r="10" fill="rgba(0,0,0,.6)" stroke="var(--lime)" strokeWidth="0.8" />
            <text x={p.x} y={p.y + 1.5} textAnchor="middle" fill="var(--white)" style={{ font: "700 4.5px var(--f-mono)", letterSpacing: ".14em" }}>{p.lbl}</text>
            <text x={p.x} y={p.y + 22} textAnchor="middle" fill="var(--lime)" style={{ font: "700 4px var(--f-mono)", letterSpacing: ".16em" }}>{p.val}</text>
          </g>
        ))}
      </svg>

      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--f-mono)", fontSize: ".52rem", letterSpacing: ".16em", color: "var(--muted)" }}>
        <span>REACH · <span style={{ color: "var(--lime)" }}>3.2M+</span> CUMULATIVE</span>
        <span>POSTS/WK · <span style={{ color: "var(--lime)" }}>26</span></span>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   05 — Web Build
   Browser frame mid-construction: hero block, tile grid,
   scanning beam crosses as if rendering.
─────────────────────────────────────────────────────────────── */
export function VisualWebBuild({ active }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!active) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".wb-block", { scaleY: 0 }, { scaleY: 1, transformOrigin: "top", duration: 0.5, stagger: 0.08, ease: "power2.out" });
      gsap.fromTo(".wb-scan", { y: -20, opacity: 0 }, { y: 150, opacity: 1, duration: 2.2, repeat: -1, ease: "power1.in" });
      gsap.to(".wb-cursor", { x: 60, duration: 1.4, yoyo: true, repeat: -1, ease: "sine.inOut" });
    }, ref);
    return () => ctx.revert();
  }, [active]);

  return (
    <div ref={ref} style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: 10, gap: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--f-mono)", fontSize: ".54rem", letterSpacing: ".18em", color: "var(--whisper)" }}>
        <span>BUILD · v1.4 · LCP 0.9s</span>
        <span style={{ color: "var(--lime)" }}>● COMPILED</span>
      </div>

      <div style={{ flex: 1, border: "1px solid var(--lime-20)", background: "rgba(8,8,8,.6)", display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
        {/* chrome */}
        <div style={{ display: "flex", gap: 4, padding: "5px 7px", borderBottom: "1px solid var(--border-2)", alignItems: "center" }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--lime)" }} />
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--amber)" }} />
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "rgba(240,240,238,.3)" }} />
          <span style={{ marginLeft: 10, fontFamily: "var(--f-mono)", fontSize: ".48rem", letterSpacing: ".14em", color: "var(--muted)" }}>rivalorg.gg /</span>
          <span className="wb-cursor" style={{ display: "inline-block", width: 6, height: 8, background: "var(--lime)", marginLeft: 2 }} />
        </div>

        {/* content */}
        <div style={{ flex: 1, padding: 10, display: "flex", flexDirection: "column", gap: 6, position: "relative" }}>
          {/* hero */}
          <div className="wb-block" style={{ height: 38, background: "linear-gradient(to right, rgba(182,255,30,.12), rgba(102,232,255,.06))", border: "1px solid var(--lime-20)", padding: "8px 10px", display: "flex", flexDirection: "column", gap: 3 }}>
            <div style={{ fontFamily: "var(--f-display)", fontSize: ".62rem", fontWeight: 900, color: "var(--white)", letterSpacing: "-.02em" }}>RIVAL.ORG</div>
            <div style={{ height: 4, width: "55%", background: "rgba(255,255,255,.18)" }} />
          </div>

          {/* tile grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4 }}>
            {[0,1,2,3,4,5].map(i => (
              <div key={i} className="wb-block" style={{
                height: 32,
                background: i === 4 ? "rgba(182,255,30,.08)" : "rgba(255,255,255,.03)",
                border: "1px solid " + (i === 4 ? "var(--lime-20)" : "var(--border-2)"),
              }} />
            ))}
          </div>

          {/* footer-like block */}
          <div className="wb-block" style={{ height: 18, background: "rgba(255,255,255,.03)", border: "1px solid var(--border-2)" }} />

          {/* scan beam */}
          <div className="wb-scan" style={{ position: "absolute", left: 0, right: 0, height: 18, background: "linear-gradient(to bottom, transparent, rgba(182,255,30,.18), transparent)", pointerEvents: "none" }} />
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--f-mono)", fontSize: ".52rem", letterSpacing: ".16em", color: "var(--muted)" }}>
        <span>STACK · <span style={{ color: "var(--lime)" }}>NEXT · TS · CMS</span></span>
        <span>SHIPS IN <span style={{ color: "var(--lime)" }}>14 d</span></span>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   06 — Roster Management
   Player card grid; one card auto-swaps state (active→bench)
   showing live contract status.
─────────────────────────────────────────────────────────────── */
export function VisualRoster({ active }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!active) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".ro-card", { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.07, ease: "power2.out" });
      // cycle one card's flag
      const flag = ref.current?.querySelector(".ro-flag");
      if (flag) {
        gsap.to(flag, { opacity: 0.3, duration: 0.6, repeat: -1, yoyo: true, ease: "sine.inOut" });
      }
    }, ref);
    return () => ctx.revert();
  }, [active]);

  const players = [
    { id: "P-001", role: "DUEL", k: "1.42", status: "ACTIVE", flag: false },
    { id: "P-002", role: "SENT", k: "1.18", status: "ACTIVE", flag: false },
    { id: "P-003", role: "INI",  k: "1.05", status: "RENEW", flag: true  },
    { id: "P-004", role: "CTRL", k: "0.94", status: "ACTIVE", flag: false },
    { id: "P-005", role: "DUEL", k: "1.31", status: "BENCH",  flag: false },
    { id: "P-006", role: "IGL",  k: "1.08", status: "ACTIVE", flag: false },
  ];

  return (
    <div ref={ref} style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--f-mono)", fontSize: ".54rem", letterSpacing: ".18em", color: "var(--whisper)" }}>
        <span>ROSTER · ACTIVE × 4 · BENCH × 1 · RENEW × 1</span>
        <span style={{ color: "var(--lime)" }}>● SYNC</span>
      </div>

      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 10 }}>
        {players.map((p, i) => (
          <div key={i} className="ro-card" style={{
            padding: 8,
            border: "1px solid " + (p.flag ? "var(--amber)" : "var(--border-2)"),
            background: p.flag ? "rgba(255,181,71,.05)" : p.status === "BENCH" ? "rgba(255,255,255,.018)" : "rgba(0,0,0,.4)",
            display: "flex", flexDirection: "column", gap: 4,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "var(--f-mono)", fontSize: ".5rem", letterSpacing: ".14em", color: "var(--lime)" }}>{p.id}</span>
              <span className={p.flag ? "ro-flag" : ""} style={{ fontFamily: "var(--f-mono)", fontSize: ".44rem", letterSpacing: ".14em",
                color: p.status === "ACTIVE" ? "var(--lime)" : p.status === "BENCH" ? "var(--muted)" : "var(--amber)" }}>
                {p.status}
              </span>
            </div>
            <div style={{ fontFamily: "var(--f-display)", fontSize: ".68rem", fontWeight: 900, color: "var(--white)", letterSpacing: "-.02em" }}>{p.role}</div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "var(--f-mono)", fontSize: ".42rem", color: "var(--muted)", letterSpacing: ".12em" }}>K/D</span>
              <span style={{ fontFamily: "var(--f-mono)", fontSize: ".5rem", color: "var(--white)", fontWeight: 700 }}>{p.k}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontFamily: "var(--f-mono)", fontSize: ".52rem", letterSpacing: ".16em", color: "var(--muted)" }}>
        <span>CONTRACTS · <span style={{ color: "var(--amber)" }}>1 RENEW</span> · 5 ACTIVE</span>
        <span>SOURCE-OF-TRUTH · <span style={{ color: "var(--lime)" }}>1</span></span>
      </div>
    </div>
  );
}
