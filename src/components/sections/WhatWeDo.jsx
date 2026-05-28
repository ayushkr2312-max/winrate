import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import AnimatedHeading from "../primitives/AnimatedHeading";
import WwdSchematic from "./what-we-do/WwdSchematic";

const PILLARS = [
  {
    id: "experience",
    num: "01",
    module: "CTX",
    role: "Context layer",
    short: "Experience",
    title: "Esports context, first",
    lead: "We come from esports operations, so we understand what breaks when teams scale quickly with limited resources.",
    body: "That context helps us design systems that fit real org pressure: match schedules, staff constraints, sponsor obligations, and fast-moving decisions.",
    signals: [
      { k: "Org reality", v: "Built around your structure, not a generic template." },
      { k: "Budget aware", v: "Scoped to what actually creates value at your stage." },
      { k: "Hands-on", v: "Practical and execution-focused from day one." },
    ],
    outputs: ["Operational audits", "Process mapping", "Execution plans"],
    stat: "Native",
    statLabel: "esports ops DNA",
    accent: "lime",
  },
  {
    id: "technical",
    num: "02",
    module: "BLD",
    role: "Build layer",
    short: "Technical",
    title: "Build, not just advise",
    lead: "We implement the systems ourselves: automations, dashboards, prep tooling, integrations, and operational workflows.",
    body: "Instead of reports and decks, you get working systems your team can use immediately and improve over time.",
    signals: [
      { k: "Automation", v: "Remove repetitive manual operations." },
      { k: "Dashboards", v: "Centralize team and org visibility." },
      { k: "Tooling", v: "Role-specific systems for faster execution." },
    ],
    outputs: ["Workflow systems", "Custom dashboards", "Data and prep tools"],
    stat: "Ship",
    statLabel: "working systems, not decks",
    accent: "lime",
  },
  {
    id: "network",
    num: "03",
    module: "NET",
    role: "Access layer",
    short: "Network",
    title: "Resource access that saves time and money",
    lead: "Our esports network helps orgs source reliable people and vendors without expensive trial-and-error.",
    body: "We route staffing, creative, analyst, coaching, and service sourcing through trusted channels that match your budget level.",
    signals: [
      { k: "Talent", v: "Staff, editors, designers, analysts, players, coaches." },
      { k: "Vendors", v: "Reliable suppliers and service partners." },
      { k: "Value", v: "Fit and cost-conscious options over hype picks." },
    ],
    outputs: ["Network sourcing", "Vendor routing", "Resource matchmaking"],
    stat: "Direct",
    statLabel: "industry routing",
    accent: "ion",
  },
  {
    id: "custom",
    num: "04",
    module: "SCP",
    role: "Scope layer",
    short: "Custom",
    title: "No one-size-fits-all",
    lead: "Every org is different, so every engagement is scoped to your goals, operating model, and current capacity.",
    body: "We build the right blend of systems, human support, and process optimization for your specific stage.",
    signals: [
      { k: "Flexible scope", v: "Start focused, then scale as results compound." },
      { k: "Clear delivery", v: "Defined priorities, milestones, and ownership." },
      { k: "Long-term", v: "Iterate and optimize beyond launch." },
    ],
    outputs: ["Custom systems", "Scoped implementation", "Continuous optimization"],
    stat: "Yours",
    statLabel: "scoped to your org",
    accent: "amber",
  },
];

const FLOW = [
  { n: "01", title: "Understand", desc: "Map structure, goals, constraints, and operational weight." },
  { n: "02", title: "Diagnose", desc: "Find bottlenecks, manual loops, and process gaps costing time." },
  { n: "03", title: "Build", desc: "Implement workflows, dashboards, and tooling around your team." },
  { n: "04", title: "Iterate", desc: "Optimize with your org as you scale to the next stage." },
];

const EQUATION = [
  { k: "Context", pillar: 0 },
  { k: "Execution", pillar: 1 },
  { k: "Network", pillar: 2 },
];

const panelVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.2 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20, transition: { duration: 0.3 } },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function WhatWeDo() {
  const [active, setActive] = useState(0);
  const [hotSignal, setHotSignal] = useState(null);
  const pillar = PILLARS[active];

  const selectPillar = useCallback((index) => {
    if (index < 0 || index >= PILLARS.length) return;
    setActive(index);
    setHotSignal(null);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (!e.target.closest(".wwd")) return;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        selectPillar(active + 1 >= PILLARS.length ? 0 : active + 1);
      }
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        selectPillar(active - 1 < 0 ? PILLARS.length - 1 : active - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, selectPillar]);

  return (
    <section className="sect wwd" id="what-we-do" data-active={pillar.id} data-accent={pillar.accent}>
      <div className="wwd-shell">
        <div className="sect-inner">
          <header className="wwd-head">
            <motion.span
              className="section-tag"
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.5 }}
              variants={fadeUp}
            >
              <span className="num">05</span> Why Winrvte
            </motion.span>
            <div className="wwd-head-grid">
              <AnimatedHeading
                tag="h2"
                rows={[
                  { text: "WHY" },
                  { parts: [{ text: "WINRVTE " }, { text: "TECH.", accent: true }] },
                ]}
              />
              <p className="wwd-intro">
                Four layers that stack into one operating system for competitive orgs —
                context, build capability, network access, and scope tailored to you.
              </p>
            </div>
          </header>

          <motion.div
            className="wwd-equation"
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.4 }}
            variants={fadeUp}
            aria-label="Value equation: Context times Execution times Network equals Your system"
          >
            {EQUATION.map((part, i) => (
              <span key={part.k} className="wwd-eq-group">
                <button
                  type="button"
                  className={"wwd-eq-term" + (active === part.pillar ? " is-active" : "")}
                  onClick={() => selectPillar(part.pillar)}
                >
                  {part.k}
                </button>
                {i < EQUATION.length - 1 && <span className="wwd-eq-op" aria-hidden="true">×</span>}
              </span>
            ))}
            <span className="wwd-eq-op" aria-hidden="true">→</span>
            <button
              type="button"
              className={"wwd-eq-result" + (active === 3 ? " is-active" : "")}
              onClick={() => selectPillar(3)}
            >
              Your system
            </button>
          </motion.div>

          <LayoutGroup>
            <div className="wwd-stack">
              <div className="wwd-pillars" role="tablist" aria-label="Why Winrvte pillars">
                {PILLARS.map((p, i) => (
                  <button
                    key={p.id}
                    type="button"
                    role="tab"
                    id={`wwd-tab-${p.id}`}
                    aria-selected={active === i}
                    aria-controls="wwd-module"
                    className={"wwd-pillar" + (active === i ? " is-active" : "")}
                    data-accent={p.accent}
                    onClick={() => selectPillar(i)}
                    onMouseEnter={() => selectPillar(i)}
                    onFocus={() => selectPillar(i)}
                  >
                    {active === i && (
                      <motion.span
                        layoutId="wwd-pillar-indicator"
                        className="wwd-pillar-indicator"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                    <span className="wwd-pillar-module">MOD.{p.num}</span>
                    <span className="wwd-pillar-role">{p.role}</span>
                    <span className="wwd-pillar-name">{p.short}</span>
                    <span className="wwd-pillar-stat">
                      <strong>{p.stat}</strong>
                      <em>{p.statLabel}</em>
                    </span>
                  </button>
                ))}
              </div>

              <article
                id="wwd-module"
                role="tabpanel"
                aria-labelledby={`wwd-tab-${pillar.id}`}
                className="wwd-module"
                data-accent={pillar.accent}
              >
                <div className="wwd-module-hud">
                  <span className="wwd-hud-sys">WINRVTE / {pillar.module}.{pillar.num}</span>
                  <span className="wwd-hud-role">{pillar.role}</span>
                  <span className="wwd-hud-status">
                    <span className="wwd-hud-dot" aria-hidden="true" />
                    Active layer
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={pillar.id}
                    className="wwd-module-body"
                    variants={panelVariants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                  >
                    <div className="wwd-brief">
                      <h3>{pillar.title}</h3>
                      <p className="wwd-brief-lead">{pillar.lead}</p>
                      <p className="wwd-brief-body">{pillar.body}</p>
                    </div>

                    <div className="wwd-spec">
                      <div className="wwd-spec-head">
                        <span className="wwd-spec-k">Capability spec</span>
                        <span className="wwd-spec-n">{pillar.signals.length} signals</span>
                      </div>
                      <ul className="wwd-spec-list">
                        {pillar.signals.map((row, si) => (
                          <li
                            key={row.k}
                            className={"wwd-spec-row" + (hotSignal === si ? " is-hot" : "")}
                            onMouseEnter={() => setHotSignal(si)}
                            onMouseLeave={() => setHotSignal(null)}
                            onFocus={() => setHotSignal(si)}
                            onBlur={() => setHotSignal(null)}
                            tabIndex={0}
                          >
                            <span className="wwd-spec-idx">{String(si + 1).padStart(2, "0")}</span>
                            <div className="wwd-spec-copy">
                              <span className="wwd-spec-label">{row.k}</span>
                              <span className="wwd-spec-val">{row.v}</span>
                            </div>
                            <span className="wwd-spec-link" aria-hidden="true">
                              → diagram
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="wwd-diagram">
                      <div className="wwd-diagram-head">
                        <span className="wwd-diagram-k">System map</span>
                        <span className="wwd-diagram-v">
                          {hotSignal != null
                            ? pillar.signals[hotSignal].k
                            : "Select a signal"}
                        </span>
                      </div>
                      <WwdSchematic
                        laneId={pillar.id}
                        accent={pillar.accent}
                        hotSignal={hotSignal}
                      />
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="wwd-deliverables">
                  <span className="wwd-deliverables-k">Typical outputs</span>
                  <div className="wwd-deliverables-row">
                    {pillar.outputs.map((tag, ti) => (
                      <motion.span
                        key={tag}
                        className="wwd-deliverable"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: ti * 0.05, duration: 0.3 }}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </article>
            </div>
          </LayoutGroup>

          <div className="wwd-process">
            <div className="wwd-process-head">
              <span className="wwd-process-k">Engagement pipeline</span>
              <p>How we move from understanding your org to systems that compound.</p>
            </div>
            <ol className="wwd-process-rail">
              {FLOW.map((step, i) => (
                <motion.li
                  key={step.n}
                  className="wwd-process-step"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ delay: i * 0.07, duration: 0.5 }}
                >
                  <span className="wwd-process-num">{step.n}</span>
                  <div className="wwd-process-copy">
                    <h4>{step.title}</h4>
                    <p>{step.desc}</p>
                  </div>
                  {i < FLOW.length - 1 && <span className="wwd-process-connector" aria-hidden="true" />}
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
