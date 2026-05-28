import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedHeading from "../primitives/AnimatedHeading";

const STEPS = [
  {
    n: "01", title: "Understand",
    desc: "Map structure, goals, constraints, and operational weight.",
    detail: "We learn your org end-to-end before any system is designed — roles, workflows, bottlenecks, and the unofficial processes that actually run the day.",
    tags: ["Org audit", "Role mapping", "Constraint scan"],
  },
  {
    n: "02", title: "Diagnose",
    desc: "Find bottlenecks, manual loops, and process gaps costing time.",
    detail: "Every repeated manual task, every broken handoff, every data gap becomes a prioritized item on the roadmap — not a vague recommendation.",
    tags: ["Gap analysis", "Priority matrix", "Time-cost audit"],
  },
  {
    n: "03", title: "Build",
    desc: "Implement workflows, dashboards, and tooling around your team.",
    detail: "We build the actual systems — automations, dashboards, prep tooling, and integrations — so your team walks away with working infrastructure, not a slide deck.",
    tags: ["Automation", "Dashboards", "Integrations"],
  },
  {
    n: "04", title: "Iterate",
    desc: "Optimize with your org as you scale to the next stage.",
    detail: "Systems ship on day one. Then we stay in, measuring output, fixing friction, and evolving the stack as your org grows and goals shift.",
    tags: ["Performance loops", "Scale planning", "Continuous delivery"],
  },
];

const INTERVAL = 7000;

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

const stepIn = (i) => ({
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
});

export default function WhatWeDo() {
  const [active, setActive] = useState(0);
  const pausedRef = useRef(false);
  const timerRef = useRef(null);

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!pausedRef.current) {
        setActive(a => (a + 1) % STEPS.length);
      }
    }, INTERVAL);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStepClick = (i) => {
    setActive(i);
    startTimer();
  };

  return (
    <section className="sect wwd" id="what-we-do">
      <div className="wwd-pipe-glow" aria-hidden="true" />
      <div className="sect-inner">
        <header className="wwd-pipe-head">
          <motion.span
            className="section-tag"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
            variants={fadeUp}
          >
            <span className="num">05</span> Process
          </motion.span>

          <div className="wwd-pipe-head-grid">
            <AnimatedHeading
              tag="h2"
              rows={[
                { text: "HOW WE" },
                { parts: [{ text: "ENGAGE.", accent: true }] },
              ]}
            />
            <motion.p
              className="wwd-pipe-intro"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              variants={fadeUp}
            >
              How we move from understanding your org to systems that compound — four
              deliberate stages, no handoffs lost in translation.
            </motion.p>
          </div>
        </header>

        <div className="wwd-rh-pipeline">
          <div
            className="wwd-pipe-step-glow"
            aria-hidden="true"
            style={{ transform: `translateX(${active * 100}%)` }}
          />

          <div className="wwd-rh-pipeline-head">
            <motion.span
              className="wwd-rh-pipeline-k"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.5 }}
              variants={fadeUp}
            >
              Engagement pipeline
            </motion.span>
            <motion.p
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              variants={fadeUp}
            >
              Click a stage to explore — or watch the pipeline run.
            </motion.p>
          </div>

          <ol
            className="wwd-rh-steps"
            onMouseEnter={() => { pausedRef.current = true; }}
            onMouseLeave={() => { pausedRef.current = false; }}
          >
            {STEPS.map((step, i) => (
              <motion.li
                key={step.n}
                className={`wwd-rh-step${active === i ? " is-active" : ""}`}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                variants={stepIn(i)}
                onClick={() => handleStepClick(i)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === "Enter" && handleStepClick(i)}
              >
                <span className="wwd-rh-step-num">{step.n}</span>
                <div className="wwd-rh-step-body">
                  <h4>{step.title}</h4>
                  <p>{step.desc}</p>
                  <AnimatePresence>
                    {active === i && (
                      <motion.div
                        className="wwd-step-extra"
                        key={`extra-${i}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <p className="wwd-step-detail">{step.detail}</p>
                        <ul className="wwd-step-tags">
                          {step.tags.map(tag => (
                            <li key={tag}>{tag}</li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {active === i && (
                  <span
                    className="wwd-step-progress"
                    key={`prog-${active}`}
                    aria-hidden="true"
                  />
                )}

                {i < STEPS.length - 1 && (
                  <span
                    className={`wwd-rh-step-conn${active === i ? " is-active" : ""}`}
                    aria-hidden="true"
                  />
                )}
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
