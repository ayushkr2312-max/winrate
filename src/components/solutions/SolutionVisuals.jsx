import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

/* ──────────────────────────────────────────────────────────────
   01 — Workflow Automation
   Multi-trigger ops graph: day-to-day sources → route hub →
   integrations → live output. Tokens stream along edges.
─────────────────────────────────────────────────────────────── */
const AU_TRIGGERS = [
  { y: 32, label: "SCHEDULE", sub: "matches & scrims" },
  { y: 82, label: "DISCORD", sub: "staff channels" },
  { y: 132, label: "REQUEST", sub: "forms & approvals" },
];

const AU_TOOLS = [
  { y: 22, label: "SHEETS", sub: "roster · budget" },
  { y: 50, label: "DISCORD", sub: "pings · roles" },
  { y: 78, label: "CALENDAR", sub: "blocks · travel" },
  { y: 106, label: "DASHBOARD", sub: "KPIs · reports" },
  { y: 134, label: "NOTION", sub: "docs · SOPs" },
  { y: 162, label: "EMAIL", sub: "vendor · staff" },
];

const AU_TOOL_X = 168;
const AU_TOOL_W = 58;
const AU_HUB = { x: 108, y: 82 };
const AU_OUT = { x: 318, y: 82 };
const TX = 34;
const TR = 13;

function auBezierPath(p0, p3, bend = 0.42) {
  const mx = p0[0] + (p3[0] - p0[0]) * bend;
  const p1 = [mx, p0[1]];
  const p2 = [mx + (p3[0] - p0[0]) * 0.22, p3[1]];
  return { p0, p1, p2, p3, d: `M${p0[0]} ${p0[1]} C ${p1[0]} ${p1[1]}, ${p2[0]} ${p2[1]}, ${p3[0]} ${p3[1]}` };
}

function auToolCenter(y) {
  return [AU_TOOL_X + AU_TOOL_W / 2, y];
}

function auBuildEdges() {
  const hubIn = [AU_HUB.x - 20, AU_HUB.y];
  const hubOut = [AU_HUB.x + 22, AU_HUB.y];
  const outIn = [AU_OUT.x - 18, AU_OUT.y];
  const paths = [];
  const add = (a, b, bend, cross = false) => paths.push({ ...auBezierPath(a, b, bend), cross });

  AU_TRIGGERS.forEach((t) => add([TX + TR, t.y], hubIn, 0.38));
  AU_TOOLS.forEach((t) => {
    const c = auToolCenter(t.y);
    add(hubOut, [AU_TOOL_X, c[1]], 0.5);
    add([AU_TOOL_X + AU_TOOL_W, c[1]], outIn, 0.55);
  });
  add(auToolCenter(22), auToolCenter(106), 0.35, true);
  add(auToolCenter(50), auToolCenter(78), 0.4, true);
  add(auToolCenter(106), auToolCenter(134), 0.38, true);
  add(hubOut, auToolCenter(106), 0.62, true);

  return paths;
}

const AU_PATHS = auBuildEdges();

function auBezierPt(t, e, axis) {
  const { p0, p1, p2, p3 } = e;
  const u = 1 - t;
  return u * u * u * p0[axis] + 3 * u * u * t * p1[axis] + 3 * u * t * t * p2[axis] + t * t * t * p3[axis];
}

export function VisualAutomation({ active }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!active) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".au-trigger", { scale: 0.85 }, { scale: 1, duration: 0.5, ease: "back.out(2)", transformBox: "fill-box", transformOrigin: "center" });
      gsap.fromTo(".au-edge", { strokeDashoffset: 220 }, { strokeDashoffset: 0, duration: 0.85, stagger: 0.04, ease: "power2.out" });
      gsap.fromTo(".au-hub", { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.6)", transformBox: "fill-box", transformOrigin: "center" });
      gsap.to(".au-tool", {
        opacity: 0.55, duration: 0.9, yoyo: true, repeat: -1, ease: "sine.inOut", stagger: { each: 0.12, from: "random" },
      });
    }, ref);

    const tokens = ref.current?.querySelectorAll(".au-token");
    if (!tokens) return () => ctx.revert();

    const tweens = [];
    tokens.forEach((tok, i) => {
      const e = AU_PATHS[i % AU_PATHS.length];
      const obj = { t: 0 };
      const tween = gsap.to(obj, {
        t: 1,
        duration: 1.8 + (i % 5) * 0.2,
        repeat: -1,
        ease: "none",
        delay: i * 0.22,
        onUpdate: () => {
          tok.setAttribute("cx", auBezierPt(obj.t, e, 0));
          tok.setAttribute("cy", auBezierPt(obj.t, e, 1));
          tok.setAttribute("opacity", obj.t < 0.04 || obj.t > 0.96 ? "0.25" : "1");
        },
      });
      tweens.push(tween);
    });
    return () => { ctx.revert(); tweens.forEach((t) => t.kill()); };
  }, [active]);

  const mono = "var(--f-mono)";
  const lbl = { font: `700 6.5px ${mono}`, letterSpacing: ".05em" };
  const sub = { font: `600 5px ${mono}`, letterSpacing: ".03em" };

  return (
    <div ref={ref} style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "12px 14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: mono, fontSize: ".68rem", letterSpacing: ".14em", color: "var(--white)" }}>
        <span>OPS.AUTOMATION · DAY-TO-DAY</span>
        <span style={{ color: "var(--lime)" }}>● 9 NODES LIVE</span>
      </div>

      <svg viewBox="0 0 360 188" style={{ flex: 1, width: "100%", marginTop: 8 }} aria-label="Workflow automation connecting schedule, Discord, requests through integrations to live operations">
        <text x="34" y="14" textAnchor="middle" fill="rgba(182,255,30,.5)" style={{ font: `600 5px ${mono}`, letterSpacing: ".14em" }}>SOURCES</text>
        <text x="197" y="14" textAnchor="middle" fill="rgba(182,255,30,.5)" style={{ font: `600 5px ${mono}`, letterSpacing: ".14em" }}>INTEGRATIONS</text>
        <text x="318" y="14" textAnchor="middle" fill="rgba(182,255,30,.5)" style={{ font: `600 5px ${mono}`, letterSpacing: ".14em" }}>OUTPUT</text>

        {AU_PATHS.map((p, i) => (
          <path
            key={i}
            className="au-edge"
            d={p.d}
            stroke={p.cross ? "rgba(182,255,30,.14)" : "rgba(182,255,30,.32)"}
            strokeWidth={p.cross ? 0.7 : 1}
            fill="none"
            strokeDasharray={p.cross ? "2,4" : "4,3"}
          />
        ))}

        {AU_TRIGGERS.map((t, i) => (
          <g key={`tr-${i}`} className="au-trigger">
            <circle cx={TX} cy={t.y} r={TR} fill="rgba(182,255,30,.12)" stroke="var(--lime)" strokeWidth="1.2" />
            <circle cx={TX} cy={t.y} r={4} fill="var(--lime)" />
            <text x={TX} y={t.y + 22} textAnchor="middle" fill="var(--lime)" style={lbl}>{t.label}</text>
            <text x={TX} y={t.y + 30} textAnchor="middle" fill="rgba(255,255,255,.4)" style={sub}>{t.sub}</text>
          </g>
        ))}

        <g className="au-hub">
          <rect x={AU_HUB.x - 22} y={AU_HUB.y - 14} width={44} height={28} rx={5} fill="rgba(182,255,30,.1)" stroke="var(--lime)" strokeWidth="1.1" />
          <text x={AU_HUB.x} y={AU_HUB.y + 3} textAnchor="middle" fill="var(--lime)" style={{ font: `800 7px ${mono}`, letterSpacing: ".1em" }}>ROUTE</text>
        </g>

        {AU_TOOLS.map((t, i) => (
          <g key={`tl-${i}`} className="au-tool">
            <rect x={AU_TOOL_X} y={t.y - 11} width={AU_TOOL_W} height={22} rx={4} fill="rgba(0,0,0,.65)" stroke="rgba(182,255,30,.22)" strokeWidth="0.8" />
            <text x={AU_TOOL_X + AU_TOOL_W / 2} y={t.y + 1} textAnchor="middle" fill="var(--white)" style={lbl}>{t.label}</text>
            <text x={AU_TOOL_X + AU_TOOL_W / 2} y={t.y + 9} textAnchor="middle" fill="rgba(182,255,30,.5)" style={sub}>{t.sub}</text>
          </g>
        ))}

        <g className="au-trigger">
          <circle cx={AU_OUT.x} cy={AU_OUT.y} r={15} fill="rgba(182,255,30,.08)" stroke="var(--lime)" strokeWidth="1.3" strokeDasharray="3,2" />
          <path d={`M${AU_OUT.x - 6} ${AU_OUT.y} L${AU_OUT.x} ${AU_OUT.y + 6} L${AU_OUT.x + 8} ${AU_OUT.y - 6}`} stroke="var(--lime)" strokeWidth="1.5" fill="none" />
          <text x={AU_OUT.x} y={AU_OUT.y + 26} textAnchor="middle" fill="var(--lime)" style={{ font: `700 7px ${mono}`, letterSpacing: ".08em" }}>LIVE OPS</text>
          <text x={AU_OUT.x} y={AU_OUT.y + 34} textAnchor="middle" fill="rgba(255,255,255,.4)" style={sub}>one source of truth</text>
        </g>

        {AU_PATHS.map((_, i) => (
          <circle key={`tk-${i}`} className="au-token" cx={TX} cy={82} r={2.2} fill="var(--lime)" />
        ))}
      </svg>

      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 6, fontFamily: mono, fontSize: ".58rem", letterSpacing: ".1em", color: "rgba(255,255,255,.4)" }}>
        <span>ROUTES <span style={{ color: "var(--lime)" }}>{AU_PATHS.length}</span> · SHEETS ↔ DASH ↔ NOTION</span>
        <span>MANUAL STEPS <span style={{ color: "var(--lime)" }}>−18h / wk</span></span>
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
      gsap.fromTo(".aw-widget", { y: 10, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.5, stagger: 0.09, ease: "power2.out",
      });
      gsap.fromTo(".aw-bar-fill", { scaleX: 0 }, {
        scaleX: 1, transformOrigin: "left center", duration: 0.8, stagger: 0.06, ease: "power2.out", delay: 0.4,
      });
      gsap.fromTo(".aw-spark", { strokeDashoffset: 200 }, {
        strokeDashoffset: 0, duration: 1.2, ease: "power2.out", delay: 0.5,
      });
      gsap.to(".aw-scan-line", {
        x: "200%", duration: 3, repeat: -1, ease: "none",
      });

      const nums = ref.current?.querySelectorAll(".aw-num");
      if (nums) nums.forEach((n) => {
        const target = parseFloat(n.getAttribute("data-v"));
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target, duration: 1.3, ease: "power2.out", delay: 0.4,
          onUpdate: () => {
            const d = n.getAttribute("data-d");
            const s = n.getAttribute("data-s") || "";
            n.textContent = (d ? obj.v.toFixed(parseInt(d)) : Math.round(obj.v)) + s;
          },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, [active]);

  const F = "var(--f-mono)";

  return (
    <div ref={ref} style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: 14, gap: 12 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: F, fontSize: ".7rem", letterSpacing: ".16em", color: "var(--white)" }}>
        <span>ANALYST WORKSTATION</span>
        <span style={{ color: "var(--lime)", display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--lime)", boxShadow: "0 0 6px rgba(182,255,30,.6)", animation: "ia-pulse 1.4s ease-in-out infinite" }} />
          LIVE
        </span>
      </div>

      {/* ── SECTION 1: Team Performance Overview ── */}
      <div className="aw-widget" style={{ padding: "12px 14px", border: "1px solid var(--border-2)", background: "rgba(0,0,0,.45)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: F, fontSize: ".58rem", letterSpacing: ".14em", marginBottom: 12 }}>
          <span style={{ color: "var(--lime)" }}>TEAM PERFORMANCE · LAST 30D</span>
          <span style={{ color: "rgba(255,255,255,.45)" }}>5 TRACKED</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
          {[
            { id: "P-01", perf: 92, trend: "+8%"  },
            { id: "P-02", perf: 78, trend: "+3%"  },
            { id: "P-03", perf: 64, trend: "-2%"  },
            { id: "P-04", perf: 85, trend: "+11%" },
            { id: "P-05", perf: 71, trend: "+1%"  },
          ].map((p, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, padding: "6px 0" }}>
              <div style={{ width: 34, height: 34, borderRadius: 7, background: "rgba(182,255,30,.07)", border: "1px solid rgba(182,255,30,.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: F, fontSize: ".62rem", fontWeight: 700, color: "var(--lime)" }}>{p.id.split("-")[1]}</span>
              </div>
              <div style={{ width: "100%", height: 5, background: "rgba(182,255,30,.07)", position: "relative", overflow: "hidden", borderRadius: 2 }}>
                <div className="aw-bar-fill" style={{ position: "absolute", inset: 0, width: `${p.perf}%`, background: p.perf > 80 ? "var(--lime)" : p.perf > 65 ? "rgba(182,255,30,.5)" : "rgba(255,180,80,.5)", borderRadius: 2 }} />
              </div>
              <span style={{ fontFamily: F, fontSize: ".58rem", fontWeight: 700, color: "var(--white)" }}><span className="aw-num" data-v={p.perf} data-s="%">0%</span></span>
              <span style={{ fontFamily: F, fontSize: ".48rem", fontWeight: 600, color: p.trend.startsWith("+") ? "var(--lime)" : "rgba(255,130,80,.9)" }}>{p.trend}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── SECTION 2: Opponent Scouting + Trend Line ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 12, flex: 1, minHeight: 0 }}>
        {/* Opponent breakdown */}
        <div className="aw-widget" style={{ padding: "12px 14px", border: "1px solid var(--border-2)", background: "rgba(0,0,0,.45)", position: "relative", overflow: "hidden" }}>
          <div className="aw-scan-line" style={{ position: "absolute", top: 0, left: "-50%", width: "50%", height: "100%", background: "linear-gradient(90deg, transparent 40%, rgba(182,255,30,.03) 70%, transparent 100%)", pointerEvents: "none" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: F, fontSize: ".58rem", letterSpacing: ".14em", marginBottom: 12 }}>
            <span style={{ color: "rgba(255,100,80,.9)" }}>OPPONENT SCOUTING</span>
            <span style={{ color: "rgba(255,255,255,.4)" }}>SCANNING</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: "Win Rate",    val: 62, display: "62%" },
              { label: "Consistency", val: 48, display: "48%" },
              { label: "Aggression",  val: 81, display: "HIGH" },
              { label: "Adaptability", val: 35, display: "LOW" },
            ].map((row, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: F, fontSize: ".56rem" }}>
                  <span style={{ color: "rgba(255,255,255,.55)", letterSpacing: ".12em" }}>{row.label}</span>
                  <span style={{ fontWeight: 700, color: row.val > 65 ? "rgba(255,100,80,.9)" : row.val > 45 ? "var(--white)" : "var(--lime)" }}>{row.display}</span>
                </div>
                <div style={{ height: 6, background: "rgba(255,255,255,.05)", position: "relative", overflow: "hidden", borderRadius: 3 }}>
                  <div className="aw-bar-fill" style={{
                    position: "absolute", inset: 0, width: `${row.val}%`, borderRadius: 3,
                    background: row.val > 65 ? "rgba(255,100,80,.6)" : row.val > 45 ? "rgba(255,255,255,.2)" : "rgba(182,255,30,.4)",
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance trend */}
        <div className="aw-widget" style={{ padding: "12px 14px", border: "1px solid var(--border-2)", background: "rgba(0,0,0,.45)", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: F, fontSize: ".58rem", letterSpacing: ".14em", marginBottom: 8 }}>
            <span style={{ color: "var(--lime)" }}>TEAM TREND · 8W</span>
            <span style={{ fontWeight: 700, color: "var(--white)" }}>↑ <span className="aw-num" data-v="12" data-s="%">0%</span></span>
          </div>
          <svg viewBox="0 0 120 55" style={{ flex: 1, width: "100%" }}>
            <polyline className="aw-spark" fill="none" stroke="var(--lime)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray="200"
              points="5,42 20,38 35,40 50,32 65,28 80,22 95,18 115,10" />
            <polyline fill="rgba(182,255,30,.08)" stroke="none"
              points="5,50 5,42 20,38 35,40 50,32 65,28 80,22 95,18 115,10 115,50" />
            {[
              { x: 5, y: 42 }, { x: 20, y: 38 }, { x: 35, y: 40 }, { x: 50, y: 32 },
              { x: 65, y: 28 }, { x: 80, y: 22 }, { x: 95, y: 18 }, { x: 115, y: 10 },
            ].map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="2.2" fill="rgba(6,6,8,1)" stroke="var(--lime)" strokeWidth="1.2" />
            ))}
          </svg>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: F, fontSize: ".5rem", color: "rgba(255,255,255,.4)", marginTop: 4, letterSpacing: ".1em" }}>
            <span>W01</span><span>W08</span>
          </div>
        </div>
      </div>

      {/* ── SECTION 3: Prep Readiness ── */}
      <div className="aw-widget" style={{ padding: "10px 14px", border: "1px solid var(--border-2)", background: "rgba(0,0,0,.45)", display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ fontFamily: F, fontSize: ".58rem", letterSpacing: ".14em", color: "var(--lime)", flexShrink: 0 }}>PREP READINESS</span>
        <div style={{ flex: 1, height: 7, background: "rgba(182,255,30,.07)", position: "relative", overflow: "hidden", borderRadius: 3 }}>
          <div className="aw-bar-fill" style={{ position: "absolute", inset: 0, width: "87%", background: "var(--lime)", boxShadow: "0 0 8px rgba(182,255,30,.35)", borderRadius: 3 }} />
        </div>
        <span style={{ fontFamily: F, fontSize: ".72rem", fontWeight: 900, color: "var(--lime)" }}><span className="aw-num" data-v="87" data-s="%">0%</span></span>
      </div>

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: F, fontSize: ".6rem", letterSpacing: ".12em", color: "rgba(255,255,255,.4)" }}>
        <span>MATCHES ANALYZED · <span style={{ color: "var(--lime)" }}>34</span></span>
        <span>EDGE · <span style={{ color: "var(--lime)" }}>+4.2%</span></span>
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
      gsap.fromTo(".dv-card", { y: 12, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power2.out",
      });
      gsap.fromTo(".dv-bar", { scaleY: 0 }, {
        scaleY: 1, transformOrigin: "bottom", stagger: 0.03, duration: 0.65, ease: "power2.out", delay: 0.5,
      });
      gsap.fromTo(".dv-ring-main", { strokeDashoffset: 226 }, {
        strokeDashoffset: 78, duration: 1.6, ease: "power2.out", delay: 0.5,
      });
      gsap.fromTo(".dv-ring-alt", { strokeDashoffset: 176 }, {
        strokeDashoffset: 88, duration: 1.4, ease: "power2.out", delay: 0.7,
      });
      gsap.fromTo(".dv-sparkline", { strokeDashoffset: 300 }, {
        strokeDashoffset: 0, duration: 1.6, ease: "power2.out", delay: 0.4,
      });
      gsap.to(".dv-pulse", { opacity: 0.3, duration: 1, repeat: -1, yoyo: true, ease: "sine.inOut" });

      const nums = ref.current?.querySelectorAll(".dv-num");
      if (nums) nums.forEach((n) => {
        const target = parseFloat(n.getAttribute("data-v"));
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target, duration: 1.4, ease: "power2.out", delay: 0.45,
          onUpdate: () => {
            const dec = n.getAttribute("data-d");
            const suf = n.getAttribute("data-s") || "";
            n.textContent = (dec ? obj.v.toFixed(parseInt(dec, 10)) : Math.round(obj.v)) + suf;
          },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, [active]);

  const F = "var(--f-mono)";

  return (
    <div ref={ref} style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: 16, gap: 14 }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: F, fontSize: ".7rem", letterSpacing: ".14em", color: "var(--white)" }}>
        <span>ORG DASHBOARD</span>
        <span style={{ color: "var(--lime)", display: "inline-flex", alignItems: "center", gap: 6, fontSize: ".6rem" }}>
          <span className="dv-pulse" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--lime)", boxShadow: "0 0 6px rgba(182,255,30,.7)" }} />
          LIVE
        </span>
      </div>

      {/* ── KPI Strip — 3 big metrics ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {[
          { label: "WIN RATE",    value: 68, suffix: "%", trend: "+12%", up: true  },
          { label: "OPS HEALTH",  value: 94, suffix: "%", trend: "+6%",  up: true  },
          { label: "SOCIAL GROWTH", value: 5, suffix: "%", trend: "+5%", up: true },
        ].map((kpi, i) => (
          <div key={i} className="dv-card" style={{
            padding: "14px 16px",
            border: "1px solid var(--border-2)",
            background: "rgba(0,0,0,.45)",
            display: "flex", flexDirection: "column", gap: 6,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: F, fontSize: ".56rem", letterSpacing: ".12em", color: "var(--lime)" }}>{kpi.label}</span>
              <span style={{ fontFamily: F, fontSize: ".52rem", fontWeight: 600, color: kpi.up ? "var(--lime)" : "var(--amber)" }}>
                {kpi.up ? "↑" : "↓"} {kpi.trend}
              </span>
            </div>
            <div style={{ fontFamily: "var(--f-display)", fontSize: "1.5rem", fontWeight: 900, color: "var(--white)", letterSpacing: "-.02em", lineHeight: 1 }}>
              <span className="dv-num" data-v={kpi.value} data-s={kpi.suffix} {...(kpi.dec ? { "data-d": kpi.dec } : {})}>0{kpi.suffix}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Middle Row — Trend Chart + Donut Breakdown ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 12, flex: 1, minHeight: 0 }}>

        {/* Revenue / Output trend */}
        <div className="dv-card" style={{
          padding: "14px 16px",
          border: "1px solid var(--border-2)",
          background: "rgba(0,0,0,.45)",
          display: "flex", flexDirection: "column",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: F, fontSize: ".58rem", letterSpacing: ".12em", marginBottom: 10 }}>
            <span style={{ color: "var(--lime)" }}>WEEKLY OUTPUT · 12W</span>
            <span style={{ color: "var(--white)", fontWeight: 700 }}>avg <span className="dv-num" data-v="72">0</span></span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 4, flex: 1 }}>
            {[42, 58, 50, 66, 78, 60, 72, 85, 55, 92, 76, 88].map((h, i) => (
              <div key={i} className="dv-bar" style={{
                flex: 1, height: `${h}%`, borderRadius: "2px 2px 0 0",
                background: h > 80 ? "var(--lime)" : "rgba(182,255,30,.25)",
                boxShadow: h > 80 ? "0 0 6px rgba(182,255,30,.3)" : "none",
              }} />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: F, fontSize: ".5rem", color: "rgba(255,255,255,.35)", marginTop: 6 }}>
            <span>W31</span><span>W42</span>
          </div>
        </div>

        {/* Donut breakdown */}
        <div className="dv-card" style={{
          padding: "14px 16px",
          border: "1px solid var(--border-2)",
          background: "rgba(0,0,0,.45)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14,
        }}>
          <div style={{ position: "relative", width: 90, height: 90 }}>
            <svg viewBox="0 0 80 80" style={{ width: 90, height: 90 }}>
              <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(182,255,30,.06)" strokeWidth="5.5" />
              <circle className="dv-ring-main" cx="40" cy="40" r="36" fill="none" stroke="var(--lime)" strokeWidth="5.5"
                strokeDasharray="226" strokeDashoffset="226" strokeLinecap="round" transform="rotate(-90 40 40)" />
              <circle className="dv-ring-alt" cx="40" cy="40" r="28" fill="none" stroke="rgba(102,232,255,.6)" strokeWidth="4.5"
                strokeDasharray="176" strokeDashoffset="176" strokeLinecap="round" transform="rotate(-90 40 40)" />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "var(--f-display)", fontSize: "1.2rem", fontWeight: 900, color: "var(--lime)", lineHeight: 1 }}>
                <span className="dv-num" data-v="68" data-s="%">0%</span>
              </span>
              <span style={{ fontFamily: F, fontSize: ".44rem", color: "rgba(255,255,255,.4)", letterSpacing: ".1em", marginTop: 2 }}>EFFICIENCY</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5, width: "100%" }}>
            {[
              { c: "var(--lime)",            l: "Match Ops",  v: "44%" },
              { c: "rgba(102,232,255,.8)",   l: "Social",     v: "28%" },
              { c: "rgba(255,180,80,.8)",    l: "Sponsor",    v: "18%" },
              { c: "rgba(240,240,238,.35)",  l: "Other",      v: "10%" },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: F, fontSize: ".54rem" }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: s.c, flexShrink: 0 }} />
                <span style={{ flex: 1, color: "var(--white)" }}>{s.l}</span>
                <span style={{ color: s.c, fontWeight: 700 }}>{s.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom Row — Sparkline + Status ── */}
      <div className="dv-card" style={{
        padding: "12px 16px",
        border: "1px solid var(--border-2)",
        background: "rgba(0,0,0,.45)",
        display: "grid", gridTemplateColumns: "1fr auto", gap: 20, alignItems: "center",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: F, fontSize: ".56rem", letterSpacing: ".12em" }}>
            <span style={{ color: "var(--lime)" }}>GROWTH TREND · 8W</span>
            <span style={{ color: "var(--white)", fontWeight: 700 }}>↑ <span className="dv-num" data-v="18" data-s="%">0%</span></span>
          </div>
          <svg viewBox="0 0 200 40" style={{ width: "100%", height: 36 }}>
            <polyline fill="rgba(182,255,30,.05)" stroke="none"
              points="0,38 0,30 28,26 56,28 84,22 112,18 140,14 168,10 200,6 200,38" />
            <polyline className="dv-sparkline" fill="none" stroke="var(--lime)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray="300"
              points="0,30 28,26 56,28 84,22 112,18 140,14 168,10 200,6" />
            {[
              { x: 0, y: 30 }, { x: 28, y: 26 }, { x: 56, y: 28 }, { x: 84, y: 22 },
              { x: 112, y: 18 }, { x: 140, y: 14 }, { x: 168, y: 10 }, { x: 200, y: 6 },
            ].map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="rgba(6,6,8,1)" stroke="var(--lime)" strokeWidth="1.2" />
            ))}
          </svg>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
          {[
            { label: "SOURCES", val: "12", c: "var(--lime)" },
            { label: "UPTIME",  val: "99.4%", c: "var(--lime)" },
            { label: "ALERTS",  val: "2", c: "var(--amber)" },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: F, fontSize: ".52rem" }}>
              <span style={{ color: "rgba(255,255,255,.45)", letterSpacing: ".1em" }}>{s.label}</span>
              <span style={{ color: s.c, fontWeight: 700, minWidth: 30, textAlign: "right" }}>{s.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: F, fontSize: ".6rem", letterSpacing: ".12em", color: "rgba(255,255,255,.4)" }}>
        <span>CONNECTED · <span style={{ color: "var(--lime)" }}>DISCORD · SHEETS · CMS</span></span>
        <span>REFRESHED · <span style={{ color: "var(--lime)" }}>2s AGO</span></span>
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
    { x: 35, y: 55, lbl: "X", val: "+12%" },
    { x: 90, y: 28, lbl: "IG", val: "+8%" },
    { x: 145, y: 75, lbl: "TT", val: "+34%" },
    { x: 208, y: 32, lbl: "TW", val: "+5%" },
    { x: 248, y: 95, lbl: "YT", val: "+19%" },
  ];

  return (
    <div ref={ref} style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--f-mono)", fontSize: ".7rem", letterSpacing: ".16em", color: "var(--white)" }}>
        <span>SOCIAL · 5 NETWORKS · 90D</span>
        <span style={{ color: "var(--lime)" }}>● +18% QoQ</span>
      </div>

      <svg viewBox="0 0 280 140" style={{ flex: 1, width: "100%", marginTop: 10 }}>
        {/* arcs between platforms */}
        <path className="so-arc" d="M35 55 Q 62 38, 90 30" stroke="rgba(182,255,30,.2)" strokeWidth="1" fill="none" strokeDasharray="500" />
        <path className="so-arc" d="M90 30 Q 120 55, 145 75" stroke="rgba(182,255,30,.2)" strokeWidth="1" fill="none" strokeDasharray="500" />
        <path className="so-arc" d="M145 75 Q 175 48, 208 35" stroke="rgba(182,255,30,.2)" strokeWidth="1" fill="none" strokeDasharray="500" />
        <path className="so-arc" d="M208 35 Q 228 65, 248 95" stroke="rgba(182,255,30,.2)" strokeWidth="1" fill="none" strokeDasharray="500" />

        {/* engagement bubbles */}
        {[62, 118, 178, 228].map((cx, i) => (
          <circle key={i} className="so-bubble" cx={cx} cy={55 + (i % 2 === 0 ? -8 : 12)} r="3.5" fill="rgba(102,232,255,.5)" />
        ))}

        {/* platforms */}
        {platforms.map((p, i) => (
          <g key={i} className="so-platform" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <circle cx={p.x} cy={p.y} r="16" fill="rgba(0,0,0,.65)" stroke="var(--lime)" strokeWidth="1.2" />
            <text x={p.x} y={p.y + 3} textAnchor="middle" fill="var(--white)" style={{ font: "700 8px var(--f-mono)", letterSpacing: ".06em" }}>{p.lbl}</text>
            <text x={p.x} y={p.y + 28} textAnchor="middle" fill="var(--lime)" style={{ font: "700 7px var(--f-mono)", letterSpacing: ".08em" }}>{p.val}</text>
          </g>
        ))}
      </svg>

      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--f-mono)", fontSize: ".6rem", letterSpacing: ".12em", color: "rgba(255,255,255,.4)" }}>
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
    <div ref={ref} style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: 14, gap: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--f-mono)", fontSize: ".7rem", letterSpacing: ".16em", color: "var(--white)" }}>
        <span>BUILD · v1.4 · LCP 0.9s</span>
        <span style={{ color: "var(--lime)" }}>● COMPILED</span>
      </div>

      <div style={{ flex: 1, border: "1px solid var(--lime-20)", background: "rgba(8,8,8,.6)", display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
        {/* chrome */}
        <div style={{ display: "flex", gap: 5, padding: "6px 9px", borderBottom: "1px solid var(--border-2)", alignItems: "center" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--lime)" }} />
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--amber)" }} />
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(240,240,238,.3)" }} />
          <span style={{ marginLeft: 12, fontFamily: "var(--f-mono)", fontSize: ".58rem", letterSpacing: ".1em", color: "rgba(255,255,255,.5)" }}>rivalorg.gg /</span>
          <span className="wb-cursor" style={{ display: "inline-block", width: 7, height: 10, background: "var(--lime)", marginLeft: 2 }} />
        </div>

        {/* content */}
        <div style={{ flex: 1, padding: 12, display: "flex", flexDirection: "column", gap: 7, position: "relative" }}>
          {/* hero */}
          <div className="wb-block" style={{ height: 42, background: "linear-gradient(to right, rgba(182,255,30,.12), rgba(102,232,255,.06))", border: "1px solid var(--lime-20)", padding: "10px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ fontFamily: "var(--f-display)", fontSize: ".78rem", fontWeight: 900, color: "var(--white)", letterSpacing: "-.02em" }}>RIVAL.ORG</div>
            <div style={{ height: 4, width: "55%", background: "rgba(255,255,255,.18)" }} />
          </div>

          {/* tile grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 5 }}>
            {[0,1,2,3,4,5].map(i => (
              <div key={i} className="wb-block" style={{
                height: 34,
                background: i === 4 ? "rgba(182,255,30,.08)" : "rgba(255,255,255,.03)",
                border: "1px solid " + (i === 4 ? "var(--lime-20)" : "var(--border-2)"),
              }} />
            ))}
          </div>

          {/* footer-like block */}
          <div className="wb-block" style={{ height: 20, background: "rgba(255,255,255,.03)", border: "1px solid var(--border-2)" }} />

          {/* scan beam */}
          <div className="wb-scan" style={{ position: "absolute", left: 0, right: 0, height: 20, background: "linear-gradient(to bottom, transparent, rgba(182,255,30,.18), transparent)", pointerEvents: "none" }} />
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--f-mono)", fontSize: ".6rem", letterSpacing: ".12em", color: "rgba(255,255,255,.4)" }}>
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
    <div ref={ref} style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--f-mono)", fontSize: ".7rem", letterSpacing: ".16em", color: "var(--white)" }}>
        <span>ROSTER · 4 ACTIVE · 1 BENCH · 1 RENEW</span>
        <span style={{ color: "var(--lime)" }}>● SYNC</span>
      </div>

      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 12 }}>
        {players.map((p, i) => (
          <div key={i} className="ro-card" style={{
            padding: 10,
            border: "1px solid " + (p.flag ? "var(--amber)" : "var(--border-2)"),
            background: p.flag ? "rgba(255,181,71,.05)" : p.status === "BENCH" ? "rgba(255,255,255,.018)" : "rgba(0,0,0,.4)",
            display: "flex", flexDirection: "column", gap: 5,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "var(--f-mono)", fontSize: ".6rem", letterSpacing: ".1em", color: "var(--lime)", fontWeight: 700 }}>{p.id}</span>
              <span className={p.flag ? "ro-flag" : ""} style={{ fontFamily: "var(--f-mono)", fontSize: ".52rem", letterSpacing: ".1em", fontWeight: 600,
                color: p.status === "ACTIVE" ? "var(--lime)" : p.status === "BENCH" ? "rgba(255,255,255,.4)" : "var(--amber)" }}>
                {p.status}
              </span>
            </div>
            <div style={{ fontFamily: "var(--f-display)", fontSize: ".82rem", fontWeight: 900, color: "var(--white)", letterSpacing: "-.02em" }}>{p.role}</div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "var(--f-mono)", fontSize: ".52rem", color: "rgba(255,255,255,.45)", letterSpacing: ".1em" }}>K/D</span>
              <span style={{ fontFamily: "var(--f-mono)", fontSize: ".6rem", color: "var(--white)", fontWeight: 700 }}>{p.k}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontFamily: "var(--f-mono)", fontSize: ".6rem", letterSpacing: ".12em", color: "rgba(255,255,255,.4)" }}>
        <span>CONTRACTS · <span style={{ color: "var(--amber)" }}>1 RENEW</span> · 5 ACTIVE</span>
        <span>SOURCE-OF-TRUTH · <span style={{ color: "var(--lime)" }}>1</span></span>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   07 — Growth Tracking
   Central WINRVTE hub with 3 platform logos (X, YouTube, Twitch)
   orbiting around it, connected by lines. Positions computed
   each frame via GSAP onUpdate for correct circular motion.
─────────────────────────────────────────────────────────────── */
export function VisualGrowthTracking({ active }) {
  const ref = useRef(null);
  const orbitRef = useRef({ angle: 0 });

  const CX = 140;
  const CY = 140;
  const HUB_R = 34;
  const ORBIT_R = 95;
  const OFFSETS = [150, 270, 30];

  useEffect(() => {
    if (!active) return;

    const lines = ref.current?.querySelectorAll(".gt-line");
    const icons = ref.current?.querySelectorAll(".gt-icon");
    if (!lines || !icons) return;

    orbitRef.current.angle = 0;

    const tween = gsap.to(orbitRef.current, {
      angle: 360,
      duration: 40,
      ease: "none",
      repeat: -1,
      onUpdate: () => {
        const a = orbitRef.current.angle;
        OFFSETS.forEach((offset, i) => {
          const rad = ((a + offset) * Math.PI) / 180;
          const px = CX + ORBIT_R * Math.cos(rad);
          const py = CY + ORBIT_R * Math.sin(rad);
          lines[i]?.setAttribute("x2", String(px));
          lines[i]?.setAttribute("y2", String(py));
          icons[i]?.setAttribute("transform", `translate(${px},${py})`);
        });
      },
    });

    const entrance = gsap.timeline();
    entrance.fromTo(".gt-hub-circle", { scale: 0.8, opacity: 0, transformOrigin: "center", transformBox: "fill-box" },
      { scale: 1, opacity: 1, duration: 0.7, ease: "power2.out" });
    entrance.fromTo(".gt-icon", { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.12, ease: "power2.out" }, 0.3);
    entrance.fromTo(".gt-line", { opacity: 0 }, { opacity: 1, duration: 0.4, stagger: 0.1, ease: "power2.out" }, 0.4);

    return () => { tween.kill(); entrance.kill(); };
  }, [active]);

  return (
    <div ref={ref} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", padding: "14px 14px 10px" }}>
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", fontFamily: "var(--f-mono)", fontSize: ".7rem", letterSpacing: ".16em", color: "var(--white)", marginBottom: 6 }}>
        <span>GROWTH · 3 NETWORKS · LIVE</span>
        <span style={{ color: "var(--lime)" }}>● TRACKING</span>
      </div>

      <svg viewBox="0 0 280 280" style={{ width: "100%", maxWidth: 340 }}>
        {/* connection lines */}
        <line className="gt-line" x1={CX} y1={CY} x2={CX} y2={CY} stroke="rgba(255,255,255,.2)" strokeWidth="1.2" />
        <line className="gt-line" x1={CX} y1={CY} x2={CX} y2={CY} stroke="rgba(169,112,255,.3)" strokeWidth="1.2" />
        <line className="gt-line" x1={CX} y1={CY} x2={CX} y2={CY} stroke="rgba(255,60,60,.25)" strokeWidth="1.2" />

        {/* center hub */}
        <g className="gt-hub-circle">
          <circle cx={CX} cy={CY} r={HUB_R} fill="rgba(6,6,8,.94)" stroke="rgba(182,255,30,.45)" strokeWidth="1.6" />
          <circle cx={CX} cy={CY} r={HUB_R + 2} fill="none" stroke="rgba(182,255,30,.07)" strokeWidth="4" />
          <text x={CX} y={CY + 4} textAnchor="middle" style={{ font: "900 12px var(--f-display)", letterSpacing: ".06em" }}>
            <tspan fill="var(--lime)">WIN</tspan><tspan fill="var(--white)">RVTE</tspan>
          </text>
        </g>

        {/* X / Twitter */}
        <g className="gt-icon" transform={`translate(${CX},${CY})`}>
          <rect x="-18" y="-18" width="36" height="36" rx="8" fill="rgba(12,12,14,.92)" stroke="rgba(255,255,255,.3)" strokeWidth="1" />
          <path d="M-5,-6 L-1.5,-1 L-5.5,6 L-3,6 L0,1.5 L3,6 L5.5,6 L1.5,-1 L5,-6 L2.5,-6 L0,-1.5 L-2.5,-6Z" fill="var(--white)" />
        </g>

        {/* Twitch */}
        <g className="gt-icon" transform={`translate(${CX},${CY})`}>
          <rect x="-18" y="-18" width="36" height="36" rx="8" fill="rgba(12,12,14,.92)" stroke="rgba(169,112,255,.35)" strokeWidth="1" />
          <g>
            <path d="M-6.5,-8 L-8,-5 L-8,5 L-4.5,5 L-4.5,7.5 L-2,7.5 L0.5,5 L4,5 L7.5,1.5 L7.5,-8Z" fill="none" stroke="rgb(169,112,255)" strokeWidth="1.3" strokeLinejoin="round" />
            <path d="M-5.5,-5.5 L-5.5,3.5 L-2.5,3.5 L-2.5,6 L0,3.5 L3.5,3.5 L6,-1 L6,-5.5Z" fill="rgb(169,112,255)" opacity="0.15" />
            <rect x="-1" y="-4" width="1.8" height="5" rx="0.4" fill="rgb(169,112,255)" />
            <rect x="2.5" y="-4" width="1.8" height="5" rx="0.4" fill="rgb(169,112,255)" />
          </g>
        </g>

        {/* YouTube */}
        <g className="gt-icon" transform={`translate(${CX},${CY})`}>
          <rect x="-18" y="-18" width="36" height="36" rx="8" fill="rgba(12,12,14,.92)" stroke="rgba(255,60,60,.35)" strokeWidth="1" />
          <rect x="-9" y="-6" width="18" height="12" rx="3.5" fill="rgb(255,60,60)" />
          <polygon points="-2.5,-3.5 -2.5,3.5 4.5,0" fill="var(--white)" />
        </g>
      </svg>

      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", fontFamily: "var(--f-mono)", fontSize: ".6rem", letterSpacing: ".12em", color: "rgba(255,255,255,.4)" }}>
        <span>PLATFORMS · <span style={{ color: "var(--lime)" }}>3 CONNECTED</span></span>
        <span>SIGNALS · <span style={{ color: "var(--lime)" }}>REAL-TIME</span></span>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Network & Resource Sourcing
   HUD-style directory card with category list, vetting pipeline,
   delivery result, and status footer. Auto-cycles active category.
─────────────────────────────────────────────────────────────── */
const NS_CATEGORIES = [
  {
    icon: (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2" /><line x1="6" y1="12" x2="6" y2="12" /><line x1="10" y1="12" x2="10" y2="12" /><path d="M14 6v-2a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2" /><circle cx="14" cy="12" r="1" /><circle cx="18" cy="12" r="1" /></svg>,
    name: "PLAYERS & ROSTERS", count: "340+", desc: "Free agents, trialists, substitutes across all tiers",
  },
  {
    icon: (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><polyline points="16 11 18 13 22 9" /></svg>,
    name: "STAFF & COACHES", count: "180+", desc: "Analysts, coaches, managers, team ops leads",
  },
  {
    icon: (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r="2.5" /><path d="M17 2c0 2-2.5 4-5 6" /><path d="M2 21a9 9 0 0 1 15.8-6" /><path d="M21.8 15.5a4.5 4.5 0 0 0-5.6 0" /></svg>,
    name: "CREATIVES", count: "260+", desc: "Editors, designers, motion artists, brand directors",
  },
  {
    icon: (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l18-5v12L3 13v-2z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></svg>,
    name: "VENDORS & AGENCIES", count: "120+", desc: "Merch, production, events, sponsorship brokers",
  },
  {
    icon: (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
    name: "TALENT & CASTERS", count: "90+", desc: "On-air talent, hosts, desk analysts, streamers",
  },
];

const NS_PIPELINE = [
  { label: "SOURCED", count: "100+" },
  { label: "PRE-SCREENED", count: "30-40" },
  { label: "CULTURE MATCHED", count: "8-12" },
  { label: "BUDGET VERIFIED", count: "3-5" },
  { label: "RECOMMENDED", count: "1-2" },
];

export function VisualNetworkSourcing({ active }) {
  const ref = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => setActiveIdx((p) => (p + 1) % 5), 3000);
    return () => clearInterval(interval);
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current, { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" });
      gsap.fromTo(".ns-chip", { x: -10, opacity: 0 }, {
        x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out", delay: 0.3,
      });
      gsap.fromTo(".ns-result", { opacity: 0 }, { opacity: 1, duration: 0.6, delay: 0.8, ease: "power2.out" });
    }, ref);
    return () => ctx.revert();
  }, [active]);

  const L5 = "#84cc16";
  const L4 = "#a3e635";
  const L3 = "#bef264";
  const F = "var(--f-mono)";

  const PipeArrow = () => (
    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" style={{ flexShrink: 0, opacity: 0.25 }}>
      <path d="M0,5 L8,5 M6,2 L9,5 L6,8" stroke="white" strokeWidth="1" />
    </svg>
  );

  const txt = {
    header: { fontFamily: F, fontSize: 13, fontWeight: 700, color: "white", letterSpacing: "0.06em" },
    badge: { fontFamily: F, fontSize: 11, fontWeight: 700, color: L4 },
    catName: { fontFamily: F, fontSize: 12, fontWeight: 700, color: "white", letterSpacing: "0.04em", lineHeight: 1.25 },
    catDesc: { fontFamily: F, fontSize: 11, color: "#9ca3af", lineHeight: 1.45 },
    catCount: { fontFamily: F, fontSize: 13, fontWeight: 900 },
    pipeLabel: { fontFamily: F, fontSize: 9, fontWeight: 700, letterSpacing: "0.03em", lineHeight: 1.2 },
    pipeCount: { fontFamily: F, fontSize: 12, fontWeight: 900, marginTop: 5 },
    resultTitle: {
      fontFamily: F, fontSize: 15, fontWeight: 800, color: "white",
      letterSpacing: "0.05em", lineHeight: 1.45, display: "block", margin: 0,
    },
    resultSub: {
      fontFamily: F, fontSize: 12, color: "rgba(163,230,53,.9)", lineHeight: 1.55,
      display: "block", margin: 0,
    },
    resultVal: {
      fontFamily: F, fontSize: 16, fontWeight: 900, color: L4,
      letterSpacing: "0.05em", lineHeight: 1.3, display: "block", margin: 0,
    },
    status: { fontFamily: F, fontSize: 11, color: "#6b7280", letterSpacing: "0.02em" },
  };

  return (
    <div ref={ref} style={{
      width: "100%", height: "100%", display: "flex", flexDirection: "column",
      background: "#0C0C0C", border: `1px solid rgba(54,83,20,.3)`, borderRadius: 16, overflow: "hidden",
      boxShadow: "0 25px 50px -12px rgba(0,0,0,.5)", position: "relative", zIndex: 1,
    }}>

      {/* ── ZONE 1: Header Bar ── */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0,
        padding: "12px 16px", background: "rgba(54,83,20,.1)", borderBottom: `1px solid rgba(132,204,22,.15)`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={L5} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="16" y="16" width="6" height="6" rx="1" /><rect x="2" y="16" width="6" height="6" rx="1" /><rect x="9" y="2" width="6" height="6" rx="1" />
            <path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" /><line x1="12" y1="12" x2="12" y2="8" />
          </svg>
          <span style={txt.header}>NETWORK DIRECTORY</span>
        </div>
        <span style={{
          ...txt.badge,
          background: "rgba(132,204,22,.1)", border: "1px solid rgba(132,204,22,.3)",
          borderRadius: 50, padding: "5px 12px", flexShrink: 0,
        }}>990+ CONTACTS</span>
      </div>

      {/* ── ZONE 2: Category List ── */}
      <div style={{ flex: "1 1 auto", minHeight: 0, overflow: "hidden", padding: "10px 16px", display: "flex", flexDirection: "column", gap: 6, justifyContent: "space-between" }}>
        {NS_CATEGORIES.map((cat, i) => {
          const isActive = i === activeIdx;
          return (
            <div key={i} onClick={() => setActiveIdx(i)} style={{
              display: "flex", flexDirection: "column", gap: isActive ? 6 : 0,
              padding: "9px 12px", borderRadius: 10, cursor: "pointer", flex: "1 1 0",
              transition: "background .3s, border-color .3s",
              background: isActive ? "rgba(132,204,22,.08)" : "rgba(0,0,0,.4)",
              border: isActive ? "1px solid rgba(132,204,22,.4)" : "1px solid rgba(255,255,255,.05)",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                  <span style={{ flexShrink: 0 }}>{cat.icon(isActive ? L4 : "#6b7280")}</span>
                  <span style={{ ...txt.catName, color: isActive ? "white" : "rgba(255,255,255,.85)" }}>{cat.name}</span>
                </div>
                <span style={{ ...txt.catCount, color: isActive ? L4 : "#6b7280", flexShrink: 0 }}>{cat.count}</span>
              </div>
              {isActive && (
                <p style={{ ...txt.catDesc, margin: 0, paddingLeft: 28 }}>{cat.desc}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* ── ZONE 3: Vetting Pipeline ── */}
      <div style={{ flexShrink: 0, padding: "14px 16px 12px", borderTop: "1px solid rgba(255,255,255,.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={L5} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          <span style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color: L4, letterSpacing: "0.1em", textTransform: "uppercase" }}>Vetting Pipeline</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,.05)", marginLeft: 6 }} />
        </div>
        <div style={{ display: "flex", alignItems: "stretch", gap: 5 }}>
          {NS_PIPELINE.map((stage, i) => (
            <React.Fragment key={i}>
              <div className="ns-chip" style={{
                background: i >= 3 ? "rgba(132,204,22,.12)" : "rgba(132,204,22,.08)",
                border: `1px solid rgba(132,204,22,${i >= 3 ? ".3" : ".2"})`,
                borderRadius: 8, padding: "7px 6px", textAlign: "center", flex: 1, minWidth: 0,
              }}>
                <div style={{ ...txt.pipeLabel, color: i >= 3 ? L3 : L4 }}>{stage.label}</div>
                <div style={{ ...txt.pipeCount, color: i >= 3 ? L3 : L4 }}>{stage.count}</div>
              </div>
              {i < NS_PIPELINE.length - 1 && <PipeArrow />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── ZONE 4A: Delivery Result ── */}
      <div className="ns-result" style={{
        flexShrink: 0,
        minHeight: 76,
        padding: "16px 18px",
        borderTop: "1px solid rgba(132,204,22,.15)",
        background: "rgba(132,204,22,.04)",
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        alignItems: "center",
        gap: "12px 18px",
        position: "relative",
        zIndex: 2,
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 8, flexShrink: 0,
          background: "rgba(132,204,22,.15)", border: "1px solid rgba(132,204,22,.25)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={L5} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
          </svg>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 0, justifyContent: "center" }}>
          <p style={txt.resultTitle}>YOU ONLY SEE THE BEST</p>
          <p style={txt.resultSub}>Pre-vetted. Rate-verified. Culture-matched.</p>
        </div>
        <p style={{ ...txt.resultVal, flexShrink: 0, textAlign: "right", alignSelf: "center" }}>NO WASTE</p>
      </div>

      {/* ── ZONE 4B: Status Footer ── */}
      <div style={{
        flexShrink: 0,
        minHeight: 38, background: "rgba(255,255,255,.02)", borderTop: "1px solid rgba(255,255,255,.05)",
        padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: L5, animation: "ia-pulse 1.4s ease-in-out infinite", flexShrink: 0 }} />
          <span style={txt.status}>NETWORK: ACTIVE // PIPELINE: NOMINAL</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
          {[
            { delay: 0, h: 16 },
            { delay: 0.12, h: 8 },
            { delay: 0.24, h: 14 },
            { delay: 0.36, h: 10 },
          ].map((bar, i) => (
            <div key={i} style={{
              width: 2, borderRadius: 50, background: "rgba(132,204,22,.4)",
              animation: `ns-eq-${i} 0.6s ${bar.delay}s ease-in-out infinite alternate`,
            }} />
          ))}
        </div>
        <style>{`
          @keyframes ns-eq-0 { 0%,100% { height: 10px; } 50% { height: 16px; } }
          @keyframes ns-eq-1 { 0%,100% { height: 10px; } 50% { height: 8px; } }
          @keyframes ns-eq-2 { 0%,100% { height: 10px; } 50% { height: 14px; } }
          @keyframes ns-eq-3 { 0%,100% { height: 10px; } 50% { height: 10px; } }
        `}</style>
      </div>
    </div>
  );
}
