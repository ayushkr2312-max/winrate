import { useEffect, useRef } from "react";
import { useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import KineticHeading from "../primitives/KineticHeading";
import SectionCoord from "../primitives/SectionCoord";
import ScrambleNum from "../primitives/ScrambleNum";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { val: 48, suf: "H", label: "Prototype Turnaround", sub: "From kickoff to first working build in focused sprints.", trend: "Sprint-ready", spark: [18, 20, 24, 26, 30, 28, 34, 36, 38, 40, 43, 48] },
  { val: 7, suf: "", label: "Delivery Modules", sub: "Automation, scouting, data systems, web, and growth stacks ready to deploy.", trend: "Scope-adaptive", spark: [2, 3, 4, 4, 5, 5, 6, 6, 6, 7, 7, 7] },
  { val: 24, suf: "/7", label: "Operational Coverage", sub: "Monitoring and support cadence built for global esports schedules.", trend: "Always-on", spark: [8, 10, 11, 13, 15, 18, 19, 21, 22, 23, 24, 24] },
  { val: 3, suf: " REG", label: "Timezone Overlap", sub: "Execution windows aligned across NA, EU, and APAC collaboration hours.", trend: "Global-ready", spark: [1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3] },
];

const LIVE_SIGNALS = [
  { code: "LIVE // 01", text: "Automation blueprint currently in queue for next sprint window" },
  { code: "LIVE // 02", text: "Data dashboard template pre-wired for KPI ingestion and overlays" },
  { code: "LIVE // 03", text: "Scouting pipeline tuned for role tags, alerts, and roster filters" },
  { code: "LIVE // 04", text: "Web + social stack prepared for rapid campaign landing pages" },
];

function buildSparkPath(points) {
  if (!points || points.length === 0) return "";
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const w = 100;
  const h = 28;
  const step = w / (points.length - 1);
  return points.map((p, i) => `${i === 0 ? "M" : "L"} ${(i * step).toFixed(2)},${(h - ((p - min) / range) * (h - 4) - 2).toFixed(2)}`).join(" ");
}
function buildSparkArea(points) {
  if (!points || points.length === 0) return "";
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const w = 100;
  const h = 28;
  const step = w / (points.length - 1);
  const top = points.map((p, i) => `${(i * step).toFixed(2)},${(h - ((p - min) / range) * (h - 4) - 2).toFixed(2)}`).join(" L ");
  return `M 0,${h} L ${top} L ${w},${h} Z`;
}

export default function Stats() {
  const gridRef = useRef(null);
  const [liveIdx, setLiveIdx] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".stat-block").forEach((b, i) => {
        gsap.set(b, { y: 40, opacity: 0 });
        ScrollTrigger.create({
          trigger: b,
          start: "top 85%",
          once: true,
          onEnter: () => gsap.to(b, { y: 0, opacity: 1, duration: 0.7, delay: i * 0.1, ease: "power2.out" }),
        });
      });

      // animate spark paths
      gsap.utils.toArray(".stat-spark path:not(.area)").forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
        ScrollTrigger.create({
          trigger: p,
          start: "top 82%",
          once: true,
          onEnter: () => gsap.to(p, { strokeDashoffset: 0, duration: 1.6, ease: "power2.out", delay: 0.4 }),
        });
      });

      gsap.utils.toArray(".readiness-chip").forEach((chip, i) => {
        gsap.set(chip, { y: 18, opacity: 0 });
        ScrollTrigger.create({
          trigger: chip,
          start: "top 90%",
          once: true,
          onEnter: () => gsap.to(chip, { y: 0, opacity: 1, duration: 0.55, delay: i * 0.07, ease: "power2.out" }),
        });
      });
    }, gridRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      setLiveIdx((v) => (v + 1) % LIVE_SIGNALS.length);
    }, 2200);
    return () => clearInterval(iv);
  }, []);

  return (
    <section className="sect stats" id="stats">
      <SectionCoord idx="04" label="READINESS" lat="35.7°N" lon="139.6°E" />
      <div className="sect-inner">
        <div className="stats-head">
          <div>
            <span className="section-tag"><span className="num">04</span> Build Readiness</span>
            <KineticHeading
              tag="h2"
              className=""
              rows={[
                { text: "PROOF OF" },
                { parts: [{ text: "EXECUTION ", }, { text: "READY.", accent: true }] },
              ]}
            />
          </div>
          <p>We are early-stage, so this panel shows operational readiness instead of vanity outcomes: build speed, delivery breadth, and live execution capacity.</p>
        </div>

        <div className="stats-grid" ref={gridRef}>
          {STATS.map((s, i) => (
            <div className="stat-block" key={i}>
              <div className="stat-val-row">
                <span className="stat-val">
                  <ScrambleNum target={s.val} suffix="" decimals={s.dec || 0} />
                </span>
                <span className="stat-suffix">{s.suf}</span>
              </div>
              <span className="stat-label">{s.label}</span>
              <span className="stat-sub">{s.sub}</span>
              <svg className="stat-spark" viewBox="0 0 100 28" preserveAspectRatio="none">
                <path className="area" d={buildSparkArea(s.spark)} />
                <path d={buildSparkPath(s.spark)} />
              </svg>
              <span className="stat-trend">{s.trend}</span>
            </div>
          ))}
        </div>

        <div className="readiness-tape">
          {LIVE_SIGNALS.map((s, i) => (
            <div className={"readiness-chip" + (i === liveIdx ? " is-live" : "")} key={s.code}>
              <span className="code">{s.code}</span>
              <span className="txt">{s.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
