import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import KineticHeading from "../primitives/KineticHeading";
import SectionCoord from "../primitives/SectionCoord";

gsap.registerPlugin(ScrollTrigger);

const LANES = [
  {
    id: "systems",
    num: "01",
    short: "Systems",
    title: "Tech when it earns its place",
    lead: "We build where code removes repeatable drag—never where a dashboard would look impressive in a deck.",
    body: "Automations, internal tools, and data layers scoped to how your org actually runs match week. If a workflow needs judgment, we don't force a bot on it.",
    signals: [
      { k: "Fit test", v: "Every build must clear a time-saved or error-removed bar before we scope it." },
      { k: "Stack", v: "Make, n8n, custom APIs, React dashboards—chosen for maintainability, not trend." },
      { k: "Handoff", v: "Your team owns the runbook; we document like we're embedding, not vending." },
    ],
    outputs: ["Workflow automation", "Decision dashboards", "API integrations"],
  },
  {
    id: "manual",
    num: "02",
    short: "Manual",
    title: "Human ops where nuance wins",
    lead: "Concierge checkpoints, white-glove handoffs, and manual QA when the stakes are reputation or revenue.",
    body: "Esports runs on timing and relationships. We keep people in the loop for sponsor calls, crisis comms, roster moments, and anything where a wrong auto-send costs more than the labor saved.",
    signals: [
      { k: "Checkpoints", v: "Approval gates, call summaries, and escalation paths—not infinite Slack threads." },
      { k: "Coverage", v: "Match-week war rooms, partner prep, and last-mile deliverable assembly." },
      { k: "Quality", v: "Human review on outward-facing assets before they hit social or inboxes." },
    ],
    outputs: ["Concierge ops", "Partner prep", "QA & approvals"],
  },
  {
    id: "network",
    num: "03",
    short: "Network",
    title: "Connections you can't buy off a shelf",
    lead: "Warm intros across partners, talent, vendors, and league ops—routes we've built by being in the room.",
    body: "Your org gets access to paths that don't show up in a software catalog: sponsor bridges, scouting lanes, production crews, and vendor terms shaped by prior deals—not cold outreach.",
    signals: [
      { k: "Partners", v: "Brand and endemic intros with context on what you've already delivered." },
      { k: "Talent", v: "Grassroots and tier-2 pipelines before players price themselves out." },
      { k: "Vendors", v: "Production, legal, and platform contacts with org-appropriate pricing." },
    ],
    outputs: ["Sponsor bridges", "Talent lanes", "Vendor routing"],
  },
  {
    id: "operators",
    num: "04",
    short: "Operators",
    title: "Experience you can staff against",
    lead: "Former ops leads, analysts, and builders who've run your calendar—not consultants parachuting in.",
    body: "The bench is people who've held the pager during roster moves, sponsor crunch, and split logistics. They bring pattern recognition your stack can't replicate.",
    signals: [
      { k: "Bench", v: "Ops, data, and engineering leads with active-org backgrounds." },
      { k: "Embed", v: "Slack-native, sprint rhythm, weekly demos—functionally part of your team." },
      { k: "Accountability", v: "Milestones tied to things your GM and partnerships lead can verify." },
    ],
    outputs: ["Embedded leads", "Season playbooks", "Executive reporting"],
  },
];

const FLOW = [
  {
    n: "01",
    title: "Diagnose",
    desc: "Map where drag lives—tools, people, partners—and what not to touch.",
  },
  {
    n: "02",
    title: "Blend",
    desc: "Pick the mix of systems, manual ops, network, and operators for this season.",
  },
  {
    n: "03",
    title: "Deploy",
    desc: "Ship in tight loops with your staff in channel—not a black-box agency handoff.",
  },
  {
    n: "04",
    title: "Stay",
    desc: "Iterate through match weeks; most orgs keep us for the next split.",
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
                { text: "EXPERIENCE" },
                { parts: [{ text: "× ", }, { text: "TECH.", accent: true }] },
              ]}
            />
          </div>
          <p className="wwd-intro">
            One compiled delivery model for competitive orgs: engineered systems, deliberate manual work,
            a network we've earned in esports, and operators who've already run your kind of week.
          </p>
        </header>

        <div className="wwd-thesis" aria-hidden="true">
          {["Systems", "Manual", "Network", "Operators"].map((label) => (
            <span key={label} className="wwd-thesis-chip">{label}</span>
          ))}
          <span className="wwd-thesis-chip wwd-thesis-chip--accent">Blended per engagement</span>
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
              <span className="wwd-panel-hint">Select a lane</span>
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
            <span className="wwd-flow-k">Engagement flow</span>
            <p>How we move from first call to in-season iteration—no theatre, no mystery phases.</p>
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

