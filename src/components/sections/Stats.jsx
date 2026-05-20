import { useEffect, useRef } from "react";
import { useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import KineticHeading from "../primitives/KineticHeading";
import SectionCoord from "../primitives/SectionCoord";
import ScrambleNum from "../primitives/ScrambleNum";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { val: 6, suf: "X", label: "Less Repetitive Work", sub: "Automated flows remove recurring admin drag so staff can focus on outcomes.", trend: "Time back", spark: [10, 11, 12, 14, 15, 17, 18, 20, 21, 23, 24, 26] },
  { val: 1, suf: "", label: "Clear Source Of Truth", sub: "Centralized dashboards replace scattered notes and disconnected sheets.", trend: "Aligned teams", spark: [4, 4, 5, 6, 7, 7, 8, 9, 10, 10, 11, 12] },
  { val: 2, suf: "X", label: "Faster Task Turnaround", sub: "Better routing, ownership, and reminders help requests move quickly.", trend: "Execution speed", spark: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19] },
  { val: 3, suf: "P", label: "Scalable Ops Foundation", sub: "Process + systems + support creates stronger growth readiness.", trend: "Built to scale", spark: [6, 7, 7, 8, 9, 9, 10, 11, 11, 12, 12, 13] },
  { val: 70, suf: "%", label: "Less Manual Work", sub: "Average reduction in repetitive manual tasks after workflow automation systems are implemented across org operations.", trend: "Efficiency", spark: [4, 6, 8, 11, 14, 17, 20, 24, 28, 32, 36, 40] },
  { val: 3, suf: "×", label: "Faster Prep", sub: "Teams using our analyst prep tools run opponent research and data review significantly faster than before implementation.", trend: "Prep speed", spark: [5, 6, 7, 8, 9, 11, 13, 15, 17, 19, 21, 23] },
  { val: 0, suf: "", label: "Generic Packages", sub: "Every solution is custom-built for the org and its budget. No templates, no recycled solutions, no one-size-fits-all.", trend: "Custom only", spark: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12] },
  { val: 6, suf: "+", label: "Service Areas", sub: "Complete coverage across automation, dashboards, operations, prep tools, resource sourcing, and fully custom builds.", trend: "Coverage", spark: [3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 9] },
  { val: 7, suf: "d", label: "Avg First Deploy", sub: "From discovery call to your first working system live. Built, connected, and handed off in under a week on average.", trend: "Fast delivery", spark: [20, 18, 16, 15, 13, 12, 11, 10, 9, 8, 8, 7] },
  { val: 100, suf: "%", label: "Esports-Focused", sub: "We only work with esports organizations. Every tool, framework, and approach is built around competitive gaming realities.", trend: "Dedicated", spark: [10, 10, 11, 11, 12, 12, 12, 12, 12, 12, 12, 12] },
];

const LIVE_SIGNALS = [
  { code: "OUTCOME // 01", text: "Less manual follow-up and cleaner handoffs across staff roles" },
  { code: "OUTCOME // 02", text: "Better visibility into tasks, teams, and operational bottlenecks" },
  { code: "OUTCOME // 03", text: "Lower operational waste by fixing process and system inefficiencies" },
  { code: "OUTCOME // 04", text: "Improved prep and analyst workflows through structured data" },
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
      <SectionCoord idx="04" label="OUTCOMES" lat="35.7°N" lon="139.6°E" />
      <div className="sect-inner">
        <div className="stats-head">
          <div>
            <span className="section-tag"><span className="num">04</span> Results and Outcomes</span>
            <KineticHeading
              tag="h2"
              className=""
              rows={[
                { text: "WHAT ORGS" },
                { parts: [{ text: "GAIN.", accent: true }] },
              ]}
            />
          </div>
          <p>The goal is practical improvement: save time, reduce costs, and make teams easier to run through better systems and execution structure.</p>
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
