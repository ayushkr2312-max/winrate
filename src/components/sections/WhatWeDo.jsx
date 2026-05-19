import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import KineticHeading from "../primitives/KineticHeading";
import SectionCoord from "../primitives/SectionCoord";

gsap.registerPlugin(ScrollTrigger);

const LANES = [
  {
    id: "experience",
    num: "01",
    short: "Experience",
    title: "Esports context first, always",
    lead: "We come from esports operations, so we understand what breaks when teams scale quickly with limited resources.",
    body: "That context helps us design systems that fit real org pressure: match schedules, staff constraints, sponsor obligations, and fast-moving decisions.",
    signals: [
      { k: "Org reality", v: "Built around your structure, not a generic template." },
      { k: "Budget aware", v: "Scoped to what actually creates value at your stage." },
      { k: "Hands-on", v: "We stay practical and execution-focused from day one." },
    ],
    outputs: ["Operational audits", "Process mapping", "Practical execution plans"],
  },
  {
    id: "technical",
    num: "02",
    short: "Technical",
    title: "Build, not just advise",
    lead: "We implement the systems ourselves: automations, dashboards, prep tooling, integrations, and operational workflows.",
    body: "Instead of reports and slide decks, you get working systems your team can use immediately and improve over time.",
    signals: [
      { k: "Automation", v: "Remove repetitive manual operations." },
      { k: "Dashboards", v: "Centralize team and org visibility." },
      { k: "Tooling", v: "Create role-specific systems for faster execution." },
    ],
    outputs: ["Workflow systems", "Custom dashboards", "Data and prep tools"],
  },
  {
    id: "network",
    num: "03",
    short: "Network",
    title: "Resource access that saves time and money",
    lead: "Our esports network helps orgs source reliable people and vendors without expensive trial-and-error.",
    body: "We can route staffing, creative, analyst, coaching, and service sourcing through known trusted channels that match your budget level.",
    signals: [
      { k: "Talent", v: "Staff, editors, designers, analysts, players, and coaches." },
      { k: "Vendors", v: "Reliable suppliers and service partners." },
      { k: "Value", v: "Fit and cost-conscious options over hype picks." },
    ],
    outputs: ["Network sourcing", "Vendor routing", "Resource matchmaking"],
  },
  {
    id: "custom",
    num: "04",
    short: "Custom",
    title: "No one-size-fits-all packaging",
    lead: "Every org is different, so every engagement is scoped to your goals, operating model, and current capacity.",
    body: "We build the right blend of systems, human support, and process optimization for your specific stage instead of forcing a fixed package.",
    signals: [
      { k: "Flexible scope", v: "Start focused, then scale as results compound." },
      { k: "Clear delivery", v: "Defined priorities, milestones, and ownership." },
      { k: "Long-term support", v: "Iterate and optimize beyond launch." },
    ],
    outputs: ["Custom systems", "Scoped implementation", "Continuous optimization"],
  },
];

const FLOW = [
  {
    n: "01",
    title: "Understand Your Org",
    desc: "Learn your current structure, goals, constraints, and where operations feel heavy.",
  },
  {
    n: "02",
    title: "Find The Friction",
    desc: "Identify bottlenecks, repeated manual work, and process gaps causing delays or extra cost.",
  },
  {
    n: "03",
    title: "Build The Right System",
    desc: "Design and implement workflows, dashboards, tooling, and support around your team realities.",
  },
  {
    n: "04",
    title: "Improve Over Time",
    desc: "Iterate with your team and keep optimizing as your org scales to the next stage.",
  },
];

export default function WhatWeDo() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef(null);
  const panelCopyRef = useRef(null);
  const panelTagsRef = useRef(null);
  const flowRef = useRef(null);
  const animatingRef = useRef(false);
  const lane = LANES[active];

  const transitionPanel = useCallback((next) => {
    const copy = panelCopyRef.current;
    const tags = panelTagsRef.current;
    if (!copy || !tags || animatingRef.current) return;

    animatingRef.current = true;
    const tl = gsap.timeline({
      onComplete: () => {
        animatingRef.current = false;
      },
    });

    tl.to([copy, tags], { opacity: 0, y: 10, duration: 0.22, ease: "power2.in" })
      .add(() => setActive(next))
      .fromTo(
        [copy, tags],
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.42, ease: "power3.out", stagger: 0.05 },
      );
  }, []);

  const selectLane = useCallback(
    (index) => {
      if (index === active || index < 0 || index >= LANES.length) return;
      transitionPanel(index);
    },
    [active, transitionPanel],
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".wwd-thesis-chip",
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.07,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".wwd-thesis",
            start: "top 82%",
            once: true,
          },
        },
      );

      gsap.utils.toArray(".wwd-flow-step").forEach((step, i) => {
        gsap.set(step, { opacity: 0, y: 20 });
        ScrollTrigger.create({
          trigger: step,
          start: "top 88%",
          once: true,
          onEnter: () => gsap.to(step, { opacity: 1, y: 0, duration: 0.65, delay: i * 0.08, ease: "power2.out" }),
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

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
    <section className="sect wwd" id="what-we-do" ref={sectionRef}>
      <SectionCoord idx="05" label="WHAT WE DO" lat="40.7°N" lon="73.9°W" />

      <div className="sect-inner">
        <header className="wwd-head">
          <div className="wwd-head-main">
            <span className="section-tag"><span className="num">05</span> What We Do</span>
            <KineticHeading
              tag="h2"
              rows={[
                { text: "WHY" },
                { parts: [{ text: "WINRVTE ", }, { text: "TECH.", accent: true }] },
              ]}
            />
          </div>
          <p className="wwd-intro">
            We sit at the intersection of esports experience, technical execution, and industry network to build
            custom systems that help organizations run cleaner, faster, and more cost-effectively.
          </p>
        </header>

        <div className="wwd-thesis" aria-hidden="true">
          {["Esports Experience", "Technical Capability", "Industry Network", "Custom Solutions"].map((label) => (
            <span key={label} className="wwd-thesis-chip">{label}</span>
          ))}
          <span className="wwd-thesis-chip wwd-thesis-chip--accent">Scoped per organization</span>
        </div>

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
                <span className="wwd-lane-bar" aria-hidden="true" />
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

            <div ref={panelCopyRef} className="wwd-panel-copy">
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

            <div ref={panelTagsRef} className="wwd-panel-outputs">
              <span className="wwd-outputs-label">Typical outputs</span>
              <div className="wwd-output-row">
                {lane.outputs.map((tag) => (
                  <span key={tag} className="wwd-output-tag">{tag}</span>
                ))}
              </div>
            </div>
          </article>
        </div>

        <div className="wwd-flow" ref={flowRef}>
          <div className="wwd-flow-head">
            <span className="wwd-flow-k">How We Work</span>
            <p>A practical process built for fast-moving esports environments.</p>
          </div>
          <ol className="wwd-flow-rail">
            {FLOW.map((step, i) => (
              <li
                key={step.n}
                className={"wwd-flow-step" + (i <= active ? " is-lit" : "")}
              >
                <span className="wwd-flow-num">{step.n}</span>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

