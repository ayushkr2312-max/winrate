import { useCallback, useState } from "react";
import { AnimatePresence, motion, LayoutGroup } from "framer-motion";
import AnimatedHeading from "../primitives/AnimatedHeading";

const fadeUp = {
  hidden: { opacity: 0, y: 24, transition: { duration: 0.3 } },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

const SERVICES = [
  {
    n: "01",
    name: "Workflow Automation",
    tag: "Systems & Automation",
    desc: "Practical automations that remove repetitive manual work from your day-to-day. Request routing, data syncing, Discord workflows, approval flows — if your team does it manually every day, we can probably automate it.",
    tags: ["Python", "Zapier", "APIs", "Discord Bots", "Google Sheets"],
    delivery: "Custom Scoped",
    stat: "↓70%",
    statLabel: "avg manual task reduction",
    steps: ["Ops Audit", "Map Flows", "Build", "Test", "Deploy"],
    outcome: "Your team stops doing busywork and starts focusing on what actually matters.",
  },
  {
    n: "02",
    name: "Personalized Dashboards",
    tag: "Custom Data Systems",
    desc: "One place for everything your org needs to see. Custom dashboards connected to your sheets, Discord channels and tools — so leadership always knows what's happening and where things stand.",
    tags: ["React", "Google Sheets", "Airtable", "REST APIs", "Supabase"],
    delivery: "Custom Scoped",
    stat: "1",
    statLabel: "single source of truth",
    steps: ["Data Audit", "Structure", "Build", "Connect", "Train"],
    outcome: "No more hunting across tabs, channels, and spreadsheets.",
  },
  {
    n: "03",
    name: "Operations Optimization",
    tag: "Esports Ops",
    desc: "We look at how your org actually runs, find the bottlenecks and inefficiencies costing you time and money, and fix them with better processes and tooling. Built from real experience inside growing esports orgs.",
    tags: ["Process Design", "Staff Workflows", "Reporting", "Comms Structure", "Internal Tools"],
    delivery: "Custom Scoped",
    stat: "10+",
    statLabel: "types of org inefficiencies solved",
    steps: ["Diagnose", "Prioritize", "Design", "Implement", "Optimize"],
    outcome: "Your org runs leaner, faster, and with significantly less friction.",
  },
  {
    n: "04",
    name: "Analyst Support & Prep Tools",
    tag: "Performance Tech",
    desc: "Tools that simplify opponent prep and team data management — scraping public data, structuring it cleanly, giving your analysts and coaches practical systems to work from instead of scattered notes.",
    tags: ["Python", "Data Scraping", "Notion", "Google Sheets", "Custom Tools"],
    delivery: "Custom Scoped",
    stat: "3×",
    statLabel: "faster prep workflow",
    steps: ["Define Needs", "Source Data", "Structure", "Build", "Handoff"],
    outcome: "Analysts and coaches spend less time organizing and more time finding the edge.",
  },
  {
    n: "05",
    name: "Network & Resource Sourcing",
    tag: "Industry Connections",
    desc: "Finding the right people at the right price is harder than it should be. We have a strong network across the esports ecosystem and can connect your org with the staff, creatives, players and vendors you actually need.",
    tags: ["Staff", "Designers", "Editors", "Players", "Vendors"],
    delivery: "Ongoing",
    stat: "Wide",
    statLabel: "esports network access",
    steps: ["Define Role", "Source", "Vet", "Connect", "Close"],
    outcome: "Get the right people and resources for what you can actually afford.",
  },
  {
    n: "06",
    name: "Custom Solutions",
    tag: "Bespoke Builds",
    desc: "Not every problem fits a standard service. We work with individual teams and orgs to build exactly what they need — unique tooling, specific workflow improvements, data management setups, or operational frameworks built from scratch.",
    tags: ["Full Custom", "Flexible Scope", "Any Stack", "Team-Level", "Org-Level"],
    delivery: "Custom Scoped",
    stat: "0",
    statLabel: "generic packages — ever",
    steps: ["Discovery", "Plan", "Build", "Review", "Deliver"],
    outcome: "Built specifically for your org and budget. Not recycled from someone else's.",
  },
];

function ServiceIndexItem({ svc, isActive, onHover }) {
  return (
    <div
      className={"svc-index-item" + (isActive ? " is-active" : "")}
      onMouseEnter={onHover}
      onFocus={onHover}
      tabIndex={0}
    >
      {isActive && (
        <motion.div
          layoutId="svc-active-bar"
          className="svc-index-bar svc-index-bar--active"
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
        />
      )}
      <span className="svc-index-num">{svc.n}</span>
      <div className="svc-index-text">
        <span className="svc-index-name">{svc.name}</span>
        <span className="svc-index-tag">{svc.tag}</span>
      </div>
      <svg className="svc-index-arrow" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </div>
  );
}

const panelVariants = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -10,
    filter: "blur(6px)",
    transition: { duration: 0.28, ease: [0.65, 0, 0.35, 1] },
  },
};

function ServiceDetailPanel({ svc }) {
  return (
    <motion.div
      key={svc.n}
      className="svc-detail"
      variants={panelVariants}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      <div className="svc-corner svc-corner--tl" />
      <div className="svc-corner svc-corner--tr" />
      <div className="svc-corner svc-corner--bl" />
      <div className="svc-corner svc-corner--br" />

      <div className="svc-ghost-num" aria-hidden="true">{svc.n}</div>

      <div className="svc-hud-bar">
        <div className="svc-hud-top-line" />
        <span className="svc-hud-sys">WINRVTE / {svc.n}</span>
        <div className="svc-hud-delivery">
          <span className="svc-hud-dot" />
          {svc.delivery}
        </div>
      </div>

      <div className="svc-detail-body">
        <div className="svc-detail-head">
          <h3 className="svc-detail-name">{svc.name}</h3>
          <span className="svc-detail-tag">{svc.tag}</span>
        </div>

        <div className="svc-detail-divider" />

        <p className="svc-detail-desc">{svc.desc}</p>

        <div className="svc-tech-tags">
          {svc.tags.map((t) => (
            <span key={t} className="svc-tech-tag">{t}</span>
          ))}
        </div>

        <div className="svc-bottom-grid">
          <div className="svc-stat-block">
            <div className="svc-stat-top-line" />
            <span className="svc-stat-val">{svc.stat}</span>
            <span className="svc-stat-label">{svc.statLabel}</span>
          </div>

          <div className="svc-process">
            <span className="svc-process-label">Process</span>
            {svc.steps.map((step, i) => (
              <div key={i} className={"svc-process-step" + (i === 0 ? " is-first" : "")}>
                <span className="svc-process-dot" />
                <span className="svc-process-text">{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="svc-outcome">{svc.outcome}</div>
      </div>
    </motion.div>
  );
}

export default function Solutions() {
  const [active, setActive] = useState(0);

  const go = useCallback((i) => {
    setActive((current) => (current === i ? current : i));
  }, []);

  const svc = SERVICES[active];

  return (
    <section className="sect solutions" id="solutions">
      <div
        className="svc-watermark"
        aria-hidden="true"
        key={svc.name}
      >
        {svc.name}
      </div>

      <div className="sect-inner">
        <div className="sol-head">
          <div>
            <motion.span className="section-tag" initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.5 }} variants={fadeUp}>
              <span className="num">03</span> Solutions
            </motion.span>
            <AnimatedHeading
              tag="h2"
              rows={[
                { text: "SERVICES" },
                { parts: [{ text: "BUILT TO FIT.", accent: true }] },
              ]}
            />
          </div>
          <motion.div className="sol-head-meta" initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.5 }} variants={fadeUp}>
            <div className="svc-active-indicator">
              <span className="svc-pulse-dot" />
              <span>Six services. One partner.</span>
            </div>
            <p>Hover any service to explore its scope and approach.</p>
          </motion.div>
        </div>

        <LayoutGroup>
          <motion.div className="svc-layout" initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.1 }} variants={fadeUp}>
            <div className="svc-index">
              {SERVICES.map((s, i) => (
                <ServiceIndexItem
                  key={s.n}
                  svc={s}
                  isActive={active === i}
                  onHover={() => go(i)}
                />
              ))}
              <div className="svc-index-footer">
                <p>Every engagement is fully custom — no packages, no guesswork.</p>
                <a href="#contact" className="svc-start-link">Start a Project →</a>
              </div>
            </div>

            <div className="svc-detail-wrap">
              <AnimatePresence mode="wait">
                <ServiceDetailPanel svc={svc} />
              </AnimatePresence>
            </div>
          </motion.div>
        </LayoutGroup>
      </div>
    </section>
  );
}
