import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WHO_LIST = ["Esports Organizations", "Sports Teams", "Emerging Brands"];

const SERVICES = [
  "Workflow Automation",
  "Custom Dashboards & Analytics",
  "Tool & API Integrations",
  "Team Coordination Systems",
  "Analyst & Scouting Tooling",
  "Ops Architecture Consulting",
];

const STATUS_ITEMS = [
  { label: "AVAILABILITY",   value: "OPERATIONAL", ok: true  },
  { label: "BUILD CYCLE",    value: "6–12 WKS",    ok: true  },
  { label: "CUSTOMIZATION",  value: "100%",         ok: true  },
  { label: "SUPPORT",        value: "ACTIVE",       ok: true  },
  { label: "INTEGRATIONS",   value: "UNLIMITED",    ok: true  },
];

const cellEnter = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function SystemManifest() {
  const [whoIdx, setWhoIdx]   = useState(0);
  const [hovSvc, setHovSvc]   = useState(null);

  useEffect(() => {
    const iv = setInterval(() => setWhoIdx((v) => (v + 1) % WHO_LIST.length), 2800);
    return () => clearInterval(iv);
  }, []);

  return (
    <section className="sys-manifest" id="sys-manifest">
      {/* Ghost background text */}
      <div className="sm-ghost" aria-hidden="true">
        <span>SYSTEMATIC</span>
        <span>OPERATIONAL</span>
        <span>EXCELLENCE</span>
      </div>

      <div className="sm-inner">
        {/* Section label strip */}
        <div className="sm-header-strip">
          <span className="sm-strip-tag">WINRVTE — AGENCY OVERVIEW</span>
          <span className="sm-strip-line" aria-hidden="true" />
          <span className="sm-strip-num">◈</span>
        </div>

        <div className="sm-grid">

          {/* ── A: WHO WE SERVE ───────────────────── */}
          <motion.div className="sm-cell sm-a" {...cellEnter(0)}>
            <span className="sm-tag">WHO WE SERVE</span>
            <div className="sm-who-wrap">
              <AnimatePresence mode="wait">
                <motion.span
                  key={whoIdx}
                  className="sm-who"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
                >
                  {WHO_LIST[whoIdx]}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="sm-who-dots" aria-hidden="true">
              {WHO_LIST.map((_, i) => (
                <span key={i} className={"sm-who-dot" + (whoIdx === i ? " is-active" : "")} />
              ))}
            </div>
            {/* Scanning line */}
            <div className="sm-scan" aria-hidden="true" />
          </motion.div>

          {/* ── C: SYSTEM STATUS (right, spans rows) ─ */}
          <motion.div className="sm-cell sm-c" {...cellEnter(0.15)}>
            <span className="sm-tag">SYSTEM STATUS</span>
            <div className="sm-status-list">
              {STATUS_ITEMS.map((item, i) => (
                <div key={i} className="sm-status-row">
                  <span className="sm-status-dot" style={{ animationDelay: `${i * 0.22}s` }} />
                  <span className="sm-status-label">{item.label}</span>
                  <span className={"sm-status-val" + (item.ok ? " ok" : " warn")}>{item.value}</span>
                </div>
              ))}
            </div>
            <div className="sm-uptime">
              <span className="sm-uptime-label">WINRVTE.OS</span>
              <span className="sm-uptime-val">v2.0 STABLE</span>
            </div>
            {/* Vertical progress bar decoration */}
            <div className="sm-c-bar" aria-hidden="true">
              <div className="sm-c-bar-fill" />
            </div>
          </motion.div>

          {/* ── B: WHAT WE BUILD ──────────────────── */}
          <motion.div className="sm-cell sm-b" {...cellEnter(0.08)}>
            <span className="sm-tag">WHAT WE BUILD</span>
            <ul className="sm-svc-list">
              {SERVICES.map((s, i) => (
                <li
                  key={i}
                  className={"sm-svc" + (hovSvc === i ? " is-active" : "")}
                  onMouseEnter={() => setHovSvc(i)}
                  onMouseLeave={() => setHovSvc(null)}
                >
                  <span className="sm-svc-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="sm-svc-name">{s}</span>
                  <span className="sm-svc-arr" aria-hidden="true">→</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ── D: CORE STATEMENT ─────────────────── */}
          <motion.div className="sm-cell sm-d" {...cellEnter(0.22)}>
            <div className="sm-d-inner">
              <p className="sm-core-text">
                We don't take shortcuts. We don't sell templates. Every engagement
                starts with your stack, your team, your goals — and ends with
                infrastructure that actually works.
              </p>
              <a href="#problem" className="sm-cta" data-cursor-label="PROBLEMS">
                <span>See the problems we solve</span>
                <span className="sm-cta-arr" aria-hidden="true">→</span>
              </a>
            </div>
            {/* Big background number */}
            <span className="sm-d-ghost" aria-hidden="true">03</span>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
