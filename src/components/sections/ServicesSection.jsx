import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionCoord from "../primitives/SectionCoord";

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  {
    n: "01",
    name: "Workflow Automation",
    tag: "Systems & Automation",
    desc: "We build practical automations that eliminate repetitive manual work from your day-to-day. Request routing, data syncing, Discord workflows, approval flows — if your team does it manually every day, we can probably automate it.",
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
    desc: "One place for everything your org needs to see. We build custom dashboards connected to your sheets, Discord channels, and existing tools — so leadership always knows what's happening, who's doing what, and where things stand.",
    tags: ["React", "Google Sheets", "Airtable", "REST APIs", "Supabase"],
    delivery: "Custom Scoped",
    stat: "1",
    statLabel: "single source of truth for your org",
    steps: ["Data Audit", "Structure", "Build", "Connect", "Train"],
    outcome: "No more hunting across tabs, channels, and spreadsheets.",
  },
  {
    n: "03",
    name: "Analyst Support & Prep Tools",
    tag: "Performance Tech",
    desc: "We build tools that simplify opponent prep and team data management — scraping public data, structuring it cleanly, and giving your players and teams practical systems to work from instead of scattered notes.",
    tags: ["Python", "Data Scraping", "Notion", "Google Sheets", "Custom Tools"],
    delivery: "Custom Scoped",
    stat: "3×",
    statLabel: "faster prep workflow execution",
    steps: ["Define Needs", "Source Data", "Structure", "Build", "Handoff"],
    outcome: "Analysts and coaches spend less time organizing and more time finding the edge.",
  },
  {
    n: "04",
    name: "Network & Resource Sourcing",
    tag: "Industry Connections",
    desc: "Finding the right people at the right price is harder than it should be. We have a strong network across the esports ecosystem and can connect your org with the staff, creatives, players, and vendors you actually need.",
    tags: ["Staff", "Designers", "Editors", "Players", "Vendors & Manufacturers"],
    delivery: "Ongoing",
    stat: "Wide",
    statLabel: "esports network access",
    steps: ["Define Role", "Source", "Vet", "Connect", "Close"],
    outcome: "Get the right people and resources for what you can actually afford.",
  },
  {
    n: "05",
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

function ServiceIndexItem({ svc, isActive, onSelect }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect();
    }
  };

  return (
    <div
      role="button"
      aria-pressed={isActive}
      className={"svc-index-item" + (isActive ? " is-active" : "")}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="svc-index-bar" />
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

function ServiceDetailPanel({ svc, exiting }) {
  return (
    <div className={"svc-detail" + (exiting ? " is-exiting" : "")}>
      {/* Corner brackets */}
      <div className="svc-corner svc-corner--tl" />
      <div className="svc-corner svc-corner--tr" />
      <div className="svc-corner svc-corner--bl" />
      <div className="svc-corner svc-corner--br" />

      {/* Ghost watermark number */}
      <div className="svc-ghost-num" aria-hidden="true">{svc.n}</div>

      {/* HUD top bar */}
      <div className="svc-hud-bar">
        <div className="svc-hud-top-line" />
        <span className="svc-hud-sys">WINRVTE.SYS / {svc.n}</span>
        <div className="svc-hud-delivery">
          <span className="svc-hud-dot" />
          {svc.delivery}
        </div>
      </div>

      {/* Content */}
      <div className="svc-detail-body">
        {/* Name */}
        <div className="svc-detail-head">
          <h3 className="svc-detail-name">{svc.name}</h3>
          <span className="svc-detail-tag">{svc.tag}</span>
        </div>

        <div className="svc-detail-divider" />

        <p className="svc-detail-desc">{svc.desc}</p>

        {/* Tech tags */}
        <div className="svc-tech-tags">
          {svc.tags.map((t) => (
            <span key={t} className="svc-tech-tag">{t}</span>
          ))}
        </div>

        {/* Stat + Process grid */}
        <div className="svc-bottom-grid">
          {/* Stat block */}
          <div className="svc-stat-block">
            <div className="svc-stat-top-line" />
            <span className="svc-stat-val">{svc.stat}</span>
            <span className="svc-stat-label">{svc.statLabel}</span>
          </div>

          {/* Process steps */}
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

        {/* Outcome */}
        <div className="svc-outcome">{svc.outcome}</div>
      </div>
    </div>
  );
}

export default function ServicesSection() {
  const [active, setActive] = useState(0);
  const [exiting, setExiting] = useState(false);
  const sectionRef = useRef(null);
  const timerRef = useRef(null);

  const go = useCallback(
    (i) => {
      if (i === active || exiting) return;
      clearTimeout(timerRef.current);
      setExiting(true);
      timerRef.current = setTimeout(() => {
        setActive(i);
        setExiting(false);
      }, 280);
    },
    [active, exiting],
  );

  useEffect(() => () => clearTimeout(timerRef.current), []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".svc-index-item", { opacity: 0, x: -16 });
      ScrollTrigger.create({
        trigger: ".svc-head",
        start: "top 82%",
        once: true,
        onEnter: () =>
          gsap.to(".svc-index-item", {
            opacity: 1,
            x: 0,
            duration: 0.55,
            stagger: 0.07,
            ease: "power3.out",
            delay: 0.3,
          }),
      });

      gsap.set(".svc-head", { opacity: 0, y: 20 });
      ScrollTrigger.create({
        trigger: ".svc-head",
        start: "top 85%",
        once: true,
        onEnter: () =>
          gsap.to(".svc-head", { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }),
      });

      gsap.set(".svc-detail", { opacity: 0, y: 24 });
      ScrollTrigger.create({
        trigger: ".svc-detail",
        start: "top 85%",
        once: true,
        onEnter: () =>
          gsap.to(".svc-detail", { opacity: 1, y: 0, duration: 0.7, delay: 0.15, ease: "power3.out" }),
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const svc = SERVICES[active];

  return (
    <section className="sect services-section" id="services" ref={sectionRef}>
      <SectionCoord idx="03" label="SERVICES" lat="51.5°N" lon="0.1°W" />

      {/* Ghost watermark — morphs on switch */}
      <div className="svc-watermark" aria-hidden="true"
        style={{ opacity: exiting ? 0 : 1 }}>
        {svc.name}
      </div>

      <div className="sect-inner">
        {/* Header */}
        <div className="svc-head">
          <div className="svc-head-main">
            <span className="section-tag"><span className="num">03</span> Services Built To Fit</span>
            <h2 className="svc-heading">
              Six Services.<br />
              <span className="svc-heading-accent">One Partner.</span>
            </h2>
          </div>
          <div className="svc-head-meta">
            <div className="svc-active-indicator">
              <span className="svc-pulse-dot" />
              06 Services Active
            </div>
            <p className="svc-head-hint">Click any service to explore its scope and approach.</p>
          </div>
        </div>

        {/* Split layout */}
        <div className="svc-layout">
          {/* Left: service index */}
          <div className="svc-index">
            <div className="svc-index-list">
              {SERVICES.map((s, i) => (
                <ServiceIndexItem
                  key={i}
                  svc={s}
                  isActive={active === i}
                  onSelect={() => go(i)}
                />
              ))}
            </div>
            <div className="svc-index-footer">
              <p>Every engagement is fully custom — no packages, no guesswork.</p>
              <a href="#contact" className="svc-start-link">
                Start a Project →
              </a>
            </div>
          </div>

          {/* Right: sticky detail panel */}
          <div className="svc-detail-wrap">
            <ServiceDetailPanel svc={svc} exiting={exiting} />
          </div>
        </div>
      </div>
    </section>
  );
}
