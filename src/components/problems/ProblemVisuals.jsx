import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const monoMeta = {
  fontFamily: "var(--f-mono)",
  letterSpacing: ".14em",
  textTransform: "uppercase",
};

export function VisualOpsDrowning({ active }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!active) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".ops-kpi", { y: -10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.05 });
      gsap.fromTo(".ops-card", { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.04, ease: "power2.out" });
      gsap.fromTo(".ops-heat", { scaleY: 0.2 }, { scaleY: 1, transformOrigin: "bottom", duration: 0.6, stagger: 0.03 });
      gsap.to(".ops-shake", { x: () => gsap.utils.random(-1.2, 1.2), duration: 0.08, yoyo: true, repeat: -1, ease: "none", repeatRefresh: true });
    }, ref);
    return () => ctx.revert();
  }, [active]);

  return (
    <div ref={ref} style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ ...monoMeta, fontSize: ".52rem", color: "var(--whisper)", display: "flex", justifyContent: "space-between" }}>
        <span>Ops Load Grid / Week 38</span>
        <span style={{ color: "var(--amber)" }}>Critical Saturation</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
        {[
          ["OPEN BLOCKERS", "14", "var(--crimson)"],
          ["AVG RESPONSE", "9.2H", "var(--amber)"],
          ["OWNER LOAD", "183%", "var(--lime)"],
        ].map((k, i) => (
          <div key={i} className="ops-kpi" style={{ border: "1px solid var(--border-2)", background: "rgba(255,255,255,.02)", padding: "5px 7px", ...monoMeta, fontSize: ".46rem", color: "var(--muted)", display: "flex", justifyContent: "space-between" }}>
            <span>{k[0]}</span>
            <span style={{ color: k[2] }}>{k[1]}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.25fr .75fr", gap: 8, flex: 1, minHeight: 0 }}>
        <div style={{ border: "1px solid var(--border-2)", display: "grid", gridTemplateColumns: "1fr 1fr 1.1fr", gap: 6, padding: 6 }}>
          {[
            ["QUEUE", ["Player travel", "Scrim schedule", "Venue docs", "Matchday comms"], false],
            ["IN PROGRESS", ["Sponsor deck", "Asset QC", "Roster IDs"], true],
            ["BACKLOG", ["Visa follow-up", "VOD tagging", "Merch sync", "Invoice pass", "Compliance"], false],
          ].map((col, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <div style={{ ...monoMeta, fontSize: ".46rem", color: "var(--lime)", border: "1px solid var(--border)", padding: "4px 6px" }}>{col[0]}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {col[1].map((task, j) => (
                  <div key={j} className={`ops-card ${col[2] ? "ops-shake" : ""}`} style={{ border: "1px solid var(--border-2)", background: col[2] ? "rgba(255,83,101,.08)" : "rgba(255,255,255,.02)", borderLeft: `2px solid ${col[2] ? "var(--crimson)" : i === 2 ? "var(--amber)" : "var(--lime)"}`, padding: "5px 6px", ...monoMeta, fontSize: ".44rem", color: "var(--white)" }}>
                    {task}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ border: "1px solid var(--border-2)", padding: 7, display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ ...monoMeta, fontSize: ".46rem", color: "var(--whisper)" }}>Team Heatmap</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4, flex: 1 }}>
            {[0.4, 0.65, 0.8, 0.95, 0.55, 0.72, 0.93, 0.86, 0.48, 0.7, 0.9, 1].map((v, i) => (
              <div key={i} className="ops-heat" style={{ background: v > 0.9 ? "rgba(255,83,101,.55)" : v > 0.75 ? "rgba(255,181,71,.45)" : "rgba(182,255,30,.3)", border: "1px solid var(--border-2)" }} />
            ))}
          </div>
          <div style={{ ...monoMeta, fontSize: ".43rem", color: "var(--muted)", display: "flex", justifyContent: "space-between" }}>
            <span>BOTTLENECK ZONE</span>
            <span style={{ color: "var(--crimson)" }}>3 OWNERS OVERLOAD</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function VisualScoutingGuess({ active }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!active) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".sc-node", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, stagger: { amount: 0.5, from: "random" } });
      gsap.fromTo(".sc-radar", { scaleX: 0 }, { scaleX: 1, transformOrigin: "left", duration: 0.6, stagger: 0.06 });
      gsap.to(".sc-sweep", { x: 300, duration: 3.2, repeat: -1, ease: "none" });
    }, ref);
    return () => ctx.revert();
  }, [active]);

  const points = Array.from({ length: 34 }).map((_, i) => ({
    x: 7 + (((i * 19) % 89) * 1),
    y: 10 + (((i * 13) % 75) * 1),
  }));

  return (
    <div ref={ref} style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ ...monoMeta, fontSize: ".52rem", color: "var(--whisper)", display: "flex", justifyContent: "space-between" }}>
        <span>Prospect Intelligence Map</span>
        <span style={{ color: "var(--lime)" }}>One Captured / Three Missed</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.35fr .85fr", gap: 8, flex: 1, minHeight: 0 }}>
        <div style={{ border: "1px solid var(--border-2)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
          <div className="sc-sweep" style={{ position: "absolute", left: -140, top: 0, bottom: 0, width: 140, background: "linear-gradient(to right, transparent, rgba(102,232,255,.14), transparent)" }} />
          {points.map((p, i) => {
            const vip = i === 9;
            const missed = i === 3 || i === 16 || i === 27;
            return (
              <div
                key={i}
                className="sc-node"
                style={{
                  position: "absolute",
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: vip ? 12 : missed ? 8 : 4,
                  height: vip ? 12 : missed ? 8 : 4,
                  borderRadius: "50%",
                  transform: "translate(-50%,-50%)",
                  background: vip ? "var(--lime)" : missed ? "var(--crimson)" : "rgba(240,240,238,.3)",
                  boxShadow: vip ? "0 0 14px var(--lime)" : "none",
                }}
              />
            );
          })}
          <div style={{ position: "absolute", left: "57%", top: "34%", ...monoMeta, fontSize: ".44rem", color: "var(--lime)" }}>LOCKED TARGET</div>
          <div style={{ position: "absolute", left: "20%", top: "62%", ...monoMeta, fontSize: ".44rem", color: "var(--crimson)" }}>SIGNED ELSEWHERE</div>
        </div>

        <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: 8 }}>
          <div style={{ border: "1px solid var(--border-2)", padding: 7, display: "flex", flexDirection: "column", gap: 5 }}>
            <div style={{ ...monoMeta, fontSize: ".45rem", color: "var(--whisper)" }}>Role Depth Radar</div>
            {[
              ["ENTRY", 88],
              ["IGL", 61],
              ["SENTINEL", 72],
              ["FLEX", 57],
            ].map((r, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "62px 1fr auto", alignItems: "center", gap: 6 }}>
                <span style={{ ...monoMeta, fontSize: ".42rem", color: "var(--muted)" }}>{r[0]}</span>
                <div style={{ border: "1px solid var(--border)", height: 7 }}>
                  <div className="sc-radar" style={{ width: `${r[1]}%`, height: "100%", background: r[1] < 65 ? "var(--amber)" : "var(--lime)" }} />
                </div>
                <span style={{ ...monoMeta, fontSize: ".42rem", color: "var(--white)" }}>{r[1]}</span>
              </div>
            ))}
          </div>
          <div style={{ border: "1px solid var(--border-2)", padding: 7, display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ ...monoMeta, fontSize: ".45rem", color: "var(--whisper)" }}>Watchlist Velocity</div>
            {[
              ["DUELIST-19", "+11"],
              ["IGL-07", "+4"],
              ["SENT-14", "-2"],
              ["FLEX-31", "-7"],
            ].map((x, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", ...monoMeta, fontSize: ".42rem", color: "var(--muted)", borderTop: "1px solid var(--border)", paddingTop: 4 }}>
                <span>{x[0]}</span>
                <span style={{ color: x[1].startsWith("-") ? "var(--crimson)" : "var(--lime)" }}>{x[1]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function VisualDataScatter({ active }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!active) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".ds-node", { scale: 0.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, stagger: 0.06 });
      gsap.fromTo(".ds-link", { strokeDashoffset: 120 }, { strokeDashoffset: 0, duration: 0.9, stagger: 0.05 });
      gsap.fromTo(".ds-lat", { scaleY: 0.2 }, { scaleY: 1, transformOrigin: "bottom", duration: 0.5, stagger: 0.05 });
    }, ref);
    return () => ctx.revert();
  }, [active]);

  const tools = [
    { x: 16, y: 22, n: "SHEETS", ok: true },
    { x: 82, y: 20, n: "DISCORD", ok: false },
    { x: 83, y: 76, n: "CSV", ok: false },
    { x: 16, y: 76, n: "AIRTABLE", ok: true },
    { x: 10, y: 48, n: "NOTION", ok: false },
    { x: 90, y: 48, n: "API", ok: true },
  ];

  return (
    <div ref={ref} style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ ...monoMeta, fontSize: ".52rem", color: "var(--whisper)", display: "flex", justifyContent: "space-between" }}>
        <span>Decision Fabric Integrity</span>
        <span style={{ color: "var(--crimson)" }}>Source-of-Truth Broken</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr .9fr", gap: 8, flex: 1, minHeight: 0 }}>
        <div style={{ border: "1px solid var(--border-2)", position: "relative", minHeight: 0 }}>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
            {tools.map((t, i) => (
              <line
                key={i}
                className="ds-link"
                x1={t.x}
                y1={t.y}
                x2="50"
                y2="50"
                stroke={t.ok ? "rgba(182,255,30,.22)" : "rgba(255,83,101,.45)"}
                strokeWidth="0.55"
                strokeDasharray={t.ok ? "1 1.1" : "1.6 1.3"}
                style={{ strokeDashoffset: 0 }}
              />
            ))}
          </svg>
          <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: 96, height: 96, borderRadius: "50%", border: "1px solid var(--border-2)", background: "radial-gradient(circle, rgba(182,255,30,.08), rgba(0,0,0,.55) 65%)", display: "flex", alignItems: "center", justifyContent: "center", ...monoMeta, fontSize: ".46rem", color: "var(--amber)" }}>
            TRUST 41%
          </div>
          {tools.map((t, i) => (
            <div key={i} className="ds-node" style={{ position: "absolute", left: `calc(${t.x}% - 28px)`, top: `calc(${t.y}% - 11px)`, width: 56, height: 22, border: `1px solid ${t.ok ? "rgba(182,255,30,.35)" : "rgba(255,83,101,.45)"}`, background: "rgba(0,0,0,.74)", ...monoMeta, fontSize: ".42rem", color: t.ok ? "var(--white)" : "var(--crimson)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {t.n}
            </div>
          ))}
        </div>

        <div style={{ border: "1px solid var(--border-2)", padding: 7, display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ ...monoMeta, fontSize: ".45rem", color: "var(--whisper)" }}>Pipeline Latency</div>
          {[5.2, 9.6, 12.1, 3.4, 8.8].map((x, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "48px 1fr auto", alignItems: "center", gap: 6 }}>
              <span style={{ ...monoMeta, fontSize: ".4rem", color: "var(--muted)" }}>{`L${i + 1}`}</span>
              <div style={{ height: 8, border: "1px solid var(--border)", background: "rgba(255,255,255,.02)" }}>
                <div className="ds-lat" style={{ height: "100%", width: `${Math.min(100, x * 8)}%`, background: x > 9 ? "var(--crimson)" : x > 6 ? "var(--amber)" : "var(--lime)" }} />
              </div>
              <span style={{ ...monoMeta, fontSize: ".4rem", color: "var(--white)" }}>{x}h</span>
            </div>
          ))}
          <div style={{ marginTop: "auto", ...monoMeta, fontSize: ".42rem", color: "var(--muted)", display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--border)", paddingTop: 6 }}>
            <span>CONFLICTED FIELDS</span>
            <span style={{ color: "var(--crimson)" }}>29</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function VisualOldSite({ active }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!active) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".os-glitch", { x: 0 }, { x: () => gsap.utils.random(-1.5, 1.5), duration: 0.08, yoyo: true, repeat: -1 });
      gsap.fromTo(".os-modern", { scaleX: 0.2 }, { scaleX: 1, transformOrigin: "left", duration: 0.7, stagger: 0.07 });
      gsap.fromTo(".os-score", { rotate: -90 }, { rotate: 30, duration: 1, ease: "power2.out" });
    }, ref);
    return () => ctx.revert();
  }, [active]);

  return (
    <div ref={ref} style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ ...monoMeta, fontSize: ".52rem", color: "var(--whisper)", display: "flex", justifyContent: "space-between" }}>
        <span>Brand Surface Differential</span>
        <span style={{ color: "var(--lime)" }}>Perception Gap</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, flex: 1, minHeight: 0 }}>
        <div className="os-glitch" style={{ border: "1px solid rgba(255,83,101,.35)", background: "#1d0e10", display: "flex", flexDirection: "column" }}>
          <div style={{ ...monoMeta, fontSize: ".42rem", color: "rgba(255,83,101,.8)", borderBottom: "1px solid rgba(255,83,101,.3)", padding: "5px 6px" }}>Legacy Surface</div>
          <div style={{ padding: 7, display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
            <div style={{ fontFamily: "Times New Roman, serif", color: "#e7a7ad", fontSize: ".78rem", fontWeight: 700 }}>WELCOME TO BEST ESPORTS ORG</div>
            <div style={{ fontFamily: "Comic Sans MS, sans-serif", color: "#cb8c92", fontSize: ".55rem" }}>top team worldwide!!!</div>
            {["Auto-play hero", "Popup ad layer", "No CTA hierarchy", "Broken mobile nav"].map((x, i) => (
              <div key={i} style={{ ...monoMeta, fontSize: ".4rem", color: "#c99499", border: "1px dashed rgba(255,83,101,.3)", padding: "3px 4px" }}>{x}</div>
            ))}
          </div>
          <div style={{ ...monoMeta, fontSize: ".4rem", color: "rgba(255,83,101,.8)", borderTop: "1px solid rgba(255,83,101,.25)", padding: "4px 6px" }}>LCP 4.8s / Bounce 78%</div>
        </div>

        <div style={{ border: "1px solid var(--lime-20)", background: "rgba(8,8,8,.7)", display: "flex", flexDirection: "column", padding: 7, gap: 6 }}>
          <div style={{ ...monoMeta, fontSize: ".42rem", color: "var(--lime)" }}>Modern Surface</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8, alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {[92, 84, 73, 95].map((s, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "58px 1fr auto", gap: 4, alignItems: "center" }}>
                  <span style={{ ...monoMeta, fontSize: ".38rem", color: "var(--muted)" }}>{["UX", "PERF", "SEO", "A11Y"][i]}</span>
                  <div style={{ height: 7, border: "1px solid var(--border)" }}>
                    <div className="os-modern" style={{ width: `${s}%`, height: "100%", background: "rgba(182,255,30,.45)" }} />
                  </div>
                  <span style={{ ...monoMeta, fontSize: ".38rem", color: "var(--white)" }}>{s}</span>
                </div>
              ))}
            </div>
            <div style={{ position: "relative", width: 56, height: 56, borderRadius: "50%", border: "1px solid var(--border-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div className="os-score" style={{ position: "absolute", width: 2, height: 22, background: "var(--lime)", transformOrigin: "bottom center", bottom: "50%" }} />
              <span style={{ ...monoMeta, fontSize: ".36rem", color: "var(--lime)" }}>90</span>
            </div>
          </div>
          <div style={{ marginTop: "auto", ...monoMeta, fontSize: ".4rem", color: "var(--muted)", borderTop: "1px solid var(--border)", paddingTop: 5, display: "flex", justifyContent: "space-between" }}>
            <span>LCP 0.9s / Bounce 22%</span>
            <span style={{ color: "var(--lime)" }}>+3.4x Replies</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function VisualSponsorLeak({ active }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!active) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".sp-row", { x: -10, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, stagger: 0.05 });
      gsap.fromTo(".sp-bar", { scaleX: 0.2 }, { scaleX: 1, transformOrigin: "left", duration: 0.6, stagger: 0.08 });
      gsap.fromTo(".sp-ring", { rotate: -100 }, { rotate: 0, duration: 0.8, ease: "power2.out" });
    }, ref);
    return () => ctx.revert();
  }, [active]);

  return (
    <div ref={ref} style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ ...monoMeta, fontSize: ".52rem", color: "var(--whisper)", display: "flex", justifyContent: "space-between" }}>
        <span>Sponsor Delivery Risk Grid</span>
        <span style={{ color: "var(--amber)" }}>Renewal Exposure</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr .8fr", gap: 8, flex: 1, minHeight: 0 }}>
        <div style={{ border: "1px solid var(--border-2)", padding: 7, display: "flex", flexDirection: "column", gap: 5 }}>
          {[
            ["JERSEY LOCKUP", 100, "var(--lime)"],
            ["STREAM SEGMENT", 52, "var(--amber)"],
            ["SOCIAL SERIES", 34, "var(--crimson)"],
            ["MONTHLY REPORT", 61, "var(--amber)"],
            ["EVENT PHOTO PACK", 83, "var(--lime)"],
          ].map((x, i) => (
            <div key={i} className="sp-row" style={{ display: "grid", gridTemplateColumns: "96px 1fr auto", gap: 6, alignItems: "center" }}>
              <span style={{ ...monoMeta, fontSize: ".38rem", color: "var(--muted)" }}>{x[0]}</span>
              <div style={{ border: "1px solid var(--border)", height: 7, background: "rgba(255,255,255,.02)" }}>
                <div className="sp-bar" style={{ width: `${x[1]}%`, height: "100%", background: x[2] }} />
              </div>
              <span style={{ ...monoMeta, fontSize: ".38rem", color: "var(--white)" }}>{x[1]}%</span>
            </div>
          ))}
          <div style={{ marginTop: "auto", ...monoMeta, fontSize: ".42rem", color: "var(--muted)", borderTop: "1px solid var(--border)", paddingTop: 6, display: "flex", justifyContent: "space-between" }}>
            <span>PACKETS READY</span>
            <span style={{ color: "var(--amber)" }}>5 / 11</span>
          </div>
        </div>
        <div style={{ border: "1px solid var(--border-2)", padding: 7, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ alignSelf: "center", position: "relative", width: 84, height: 84, borderRadius: "50%", background: "conic-gradient(var(--crimson) 0 118deg, var(--amber) 118deg 238deg, rgba(182,255,30,.45) 238deg 360deg)" }}>
            <div className="sp-ring" style={{ position: "absolute", inset: 6, borderRadius: "50%", background: "var(--bg)", border: "1px solid var(--border-2)", display: "flex", alignItems: "center", justifyContent: "center", ...monoMeta, fontSize: ".42rem", color: "var(--amber)" }}>VAR 38%</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              ["At risk value", "$18.4K", "var(--crimson)"],
              ["Delivered value", "$42.6K", "var(--lime)"],
              ["Renewal confidence", "LOW", "var(--amber)"],
            ].map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", ...monoMeta, fontSize: ".4rem", color: "var(--muted)", borderTop: "1px solid var(--border)", paddingTop: 4 }}>
                <span>{m[0]}</span>
                <span style={{ color: m[2] }}>{m[1]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function VisualContentChaos({ active }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!active) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".cc-req", { scaleY: 0.2 }, { scaleY: 1, transformOrigin: "bottom", duration: 0.5, stagger: 0.04 });
      gsap.fromTo(".cc-lane", { x: 16, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, stagger: 0.05 });
    }, ref);
    return () => ctx.revert();
  }, [active]);

  return (
    <div ref={ref} style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ ...monoMeta, fontSize: ".52rem", color: "var(--whisper)", display: "flex", justifyContent: "space-between" }}>
        <span>Content Throughput Matrix</span>
        <span style={{ color: "var(--crimson)" }}>Momentum Loss Active</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr .95fr", gap: 8, flex: 1, minHeight: 0 }}>
        <div style={{ border: "1px solid var(--border-2)", padding: 7, display: "flex", flexDirection: "column", gap: 7 }}>
          <div style={{ ...monoMeta, fontSize: ".43rem", color: "var(--whisper)" }}>Requests vs Published (7D)</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, alignItems: "end", flex: 1 }}>
            {[84, 66, 91, 58, 88, 62, 70].map((h, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "center" }}>
                <div className="cc-req" style={{ width: "78%", height: `${h}%`, background: h > 85 ? "var(--amber)" : "rgba(240,240,238,.35)", border: "1px solid var(--border-2)" }} />
                <span style={{ ...monoMeta, fontSize: ".34rem", color: "var(--muted)" }}>{["M", "T", "W", "T", "F", "S", "S"][i]}</span>
              </div>
            ))}
          </div>
          <div style={{ ...monoMeta, fontSize: ".4rem", color: "var(--muted)", display: "flex", justifyContent: "space-between" }}>
            <span>REQUESTS 114</span>
            <span style={{ color: "var(--amber)" }}>PUBLISHED 63</span>
          </div>
        </div>

        <div style={{ border: "1px solid var(--border-2)", padding: 7, display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ ...monoMeta, fontSize: ".43rem", color: "var(--whisper)" }}>Approval Bottleneck Lanes</div>
          {[
            ["Creative review", "17h"],
            ["Brand sign-off", "22h"],
            ["Legal check", "31h"],
            ["Asset readiness", "18h"],
          ].map((l, i) => (
            <div key={i} className="cc-lane" style={{ border: "1px solid var(--border)", background: "rgba(255,255,255,.02)", padding: "5px 6px", display: "grid", gridTemplateColumns: "1fr auto", ...monoMeta, fontSize: ".4rem", color: "var(--muted)" }}>
              <span>{l[0]}</span>
              <span style={{ color: i === 2 ? "var(--crimson)" : "var(--amber)" }}>{l[1]}</span>
            </div>
          ))}
          <div style={{ marginTop: "auto", borderTop: "1px solid var(--border)", paddingTop: 5, ...monoMeta, fontSize: ".4rem", color: "var(--muted)", display: "flex", justifyContent: "space-between" }}>
            <span>SLA HIT RATE</span>
            <span style={{ color: "var(--crimson)" }}>54%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
