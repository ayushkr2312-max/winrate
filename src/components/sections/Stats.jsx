import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import AnimatedHeading from "../primitives/AnimatedHeading";
import ScrambleNum from "../primitives/ScrambleNum";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  {
    val: 70,
    suf: "%",
    label: "Less Manual Work",
    sub: "Average reduction in repetitive tasks once workflow automation is in place.",
    trend: "Efficiency",
    spark: [4, 6, 8, 11, 14, 17, 20, 24, 28, 32, 36, 40],
  },
  {
    val: 3,
    suf: "×",
    label: "Faster Prep",
    sub: "Analyst opponent research and data review accelerate after deployment.",
    trend: "Prep speed",
    spark: [5, 6, 7, 8, 9, 11, 13, 15, 17, 19, 21, 23],
  },
  {
    val: 1,
    suf: "",
    label: "Source of Truth",
    sub: "Centralized dashboards replace scattered notes and disconnected sheets.",
    trend: "Aligned teams",
    spark: [4, 4, 5, 6, 7, 7, 8, 9, 10, 10, 11, 12],
  },
  {
    val: 7,
    suf: "d",
    label: "Avg First Deploy",
    sub: "From discovery call to first working system live, in under a week on average.",
    trend: "Fast delivery",
    spark: [20, 18, 16, 15, 13, 12, 11, 10, 9, 8, 8, 7],
  },
  {
    val: 6,
    suf: "+",
    label: "Service Areas",
    sub: "Coverage across automation, dashboards, ops, prep tools, sourcing and custom builds.",
    trend: "Coverage",
    spark: [3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 9],
  },
  {
    val: 0,
    suf: "",
    label: "Generic Packages",
    sub: "Every solution is custom-built for the org and its budget. No templates.",
    trend: "Custom only",
    spark: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
  },
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

const cardVariants = {
  hidden: {
    opacity: 0, y: 40, scale: 0.97,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
  show: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.75,
      delay: i * 0.08,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const fadeUp = {
  hidden: { opacity: 0, y: 24, transition: { duration: 0.3 } },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

export default function Stats() {
  const gridRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".stat-spark path:not(.area)").forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
        ScrollTrigger.create({
          trigger: p,
          start: "top 82%",
          end: "bottom 20%",
          onEnter: () => gsap.to(p, { strokeDashoffset: 0, duration: 1.6, ease: "power2.out", delay: 0.45 }),
          onEnterBack: () => gsap.to(p, { strokeDashoffset: 0, duration: 1.2, ease: "power2.out", delay: 0.15 }),
          onLeave: () => gsap.set(p, { strokeDashoffset: len }),
          onLeaveBack: () => gsap.set(p, { strokeDashoffset: len }),
        });
      });
    }, gridRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="sect stats" id="stats">
      <div className="sect-inner">
        <div className="stats-head">
          <div>
            <motion.span className="section-tag" initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.5 }} variants={fadeUp}>
              <span className="num">04</span> Outcomes
            </motion.span>
            <AnimatedHeading
              tag="h2"
              rows={[
                { text: "WHAT ORGS" },
                { parts: [{ text: "GAIN.", accent: true }] },
              ]}
            />
          </div>
          <motion.p initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.5 }} variants={fadeUp}>
            Save time, reduce costs, and make teams easier to run through better systems and execution structure.
          </motion.p>
        </div>

        <div className="stats-grid" ref={gridRef}>
          {STATS.map((s, i) => (
            <motion.div
              className="stat-block"
              key={i}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.15 }}
              variants={cardVariants}
            >
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
