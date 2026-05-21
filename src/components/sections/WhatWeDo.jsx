import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import AnimatedHeading from "../primitives/AnimatedHeading";

const LANES = [
  {
    id: "experience",
    num: "01",
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
  },
  {
    id: "technical",
    num: "02",
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
  },
  {
    id: "network",
    num: "03",
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
  },
  {
    id: "custom",
    num: "04",
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
  },
];

const FLOW = [
  { n: "01", title: "Understand", desc: "Learn your current structure, goals, constraints, and where operations feel heavy." },
  { n: "02", title: "Diagnose", desc: "Identify bottlenecks, repeated manual work, and process gaps causing delays or extra cost." },
  { n: "03", title: "Build", desc: "Design and implement workflows, dashboards, tooling, and support around your team realities." },
  { n: "04", title: "Iterate", desc: "Optimize with your team as your org scales to the next stage." },
];

const panelVariants = {
  hidden: { opacity: 0, y: 14, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: "blur(4px)",
    transition: { duration: 0.22, ease: [0.65, 0, 0.35, 1] },
  },
};

const flowVariants = {
  hidden: {
    opacity: 0, y: 24,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const fadeUp = {
  hidden: { opacity: 0, y: 24, transition: { duration: 0.3 } },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

export default function WhatWeDo() {
  const [active, setActive] = useState(0);
  const lane = LANES[active];

  const selectLane = useCallback((index) => {
    if (index === active || index < 0 || index >= LANES.length) return;
    setActive(index);
  }, [active]);

  useEffect(() => {
    const onKey = (e) => {
      if (!e.target.closest(".wwd")) return;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        selectLane(active + 1 >= LANES.length ? 0 : active + 1);
      }
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        selectLane(active - 1 < 0 ? LANES.length - 1 : active - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, selectLane]);

  return (
    <section className="sect wwd" id="what-we-do">
      <div className="sect-inner">
        <header className="wwd-head">
          <div className="wwd-head-main">
            <motion.span className="section-tag" initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.5 }} variants={fadeUp}>
              <span className="num">05</span> What We Do
            </motion.span>
            <AnimatedHeading
              tag="h2"
              rows={[
                { text: "WHY" },
                { parts: [{ text: "WINRVTE " }, { text: "TECH.", accent: true }] },
              ]}
            />
          </div>
          <motion.p className="wwd-intro" initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.5 }} variants={fadeUp}>
            Esports experience, technical execution, and an industry network — combined to build
            systems that help organizations run cleaner, faster, and more cost-effectively.
          </motion.p>
        </header>

        <LayoutGroup>
          <div className="wwd-stage">
            <div className="wwd-lanes" role="tablist" aria-label="What we do lanes">
              {LANES.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  id={`wwd-tab-${item.id}`}
                  aria-selected={active === i}
                  aria-controls="wwd-panel"
                  className={"wwd-lane" + (active === i ? " is-active" : "")}
                  onMouseEnter={() => selectLane(i)}
                  onFocus={() => selectLane(i)}
                  onClick={() => selectLane(i)}
                >
                  <span className="wwd-lane-num">{item.num}</span>
                  <span className="wwd-lane-label">{item.short}</span>
                  <span className="wwd-lane-title">{item.title}</span>
                  {active === i && (
                    <motion.span
                      layoutId="wwd-active-bar"
                      className="wwd-lane-bar wwd-lane-bar--active"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                </button>
              ))}
            </div>

            <article
              id="wwd-panel"
              role="tabpanel"
              aria-labelledby={`wwd-tab-${lane.id}`}
              className="wwd-panel"
            >
              <div className="wwd-panel-top">
                <span className="wwd-panel-num">{lane.num}</span>
                <span className="wwd-panel-tag">{lane.short}</span>
                <span className="wwd-panel-hint">Select to explore</span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={lane.id}
                  className="wwd-panel-inner"
                  variants={panelVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                >
                  <div className="wwd-panel-copy">
                    <h3>{lane.title}</h3>
                    <p className="wwd-panel-lead">{lane.lead}</p>
                    <p className="wwd-panel-body">{lane.body}</p>
                    <ul className="wwd-signals">
                      {lane.signals.map((row) => (
                        <li key={row.k} className="wwd-signal">
                          <span className="k">{row.k}</span>
                          <span className="v">{row.v}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="wwd-panel-outputs">
                    <span className="wwd-outputs-label">Typical outputs</span>
                    <div className="wwd-output-row">
                      {lane.outputs.map((tag) => (
                        <span key={tag} className="wwd-output-tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </article>
          </div>
        </LayoutGroup>

        <div className="wwd-flow">
          <motion.div className="wwd-flow-head" initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.3 }} variants={fadeUp}>
            <span className="wwd-flow-k">How We Work</span>
            <p>A practical process built for fast-moving esports environments.</p>
          </motion.div>
          <ol className="wwd-flow-rail">
            {FLOW.map((step, i) => (
              <motion.li
                key={step.n}
                className={"wwd-flow-step" + (i <= active ? " is-lit" : "")}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.2 }}
                variants={flowVariants}
              >
                <span className="wwd-flow-num">{step.n}</span>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
