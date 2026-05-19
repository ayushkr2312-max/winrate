import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import KineticHeading from "../primitives/KineticHeading";
import SectionCoord from "../primitives/SectionCoord";
import { SolutionIcon } from "./SolutionIcons";

gsap.registerPlugin(ScrollTrigger);

const SOLUTIONS = [
  {
    num: "01",
    id: "workflow",
    name: "Systems and Workflow Automation",
    imageSrc: null,
    summary:
      "We design and build practical automation that removes repetitive work and keeps your staff focused on high-impact execution.",
    bullets: [
      { label: "Automation flows", text: "Forms, requests, routing, reminders, and approvals." },
      { label: "Integrations", text: "Sync data between sheets, channels, and internal systems." },
      { label: "Operational reliability", text: "Runbooks and handoff logic your team can actually use." },
    ],
    tags: ["Workflow Design", "Automation", "Integrations", "Ops Systems"],
    meta: [["Format", "Custom"], ["Priority", "High"], ["Type", "Core"]],
  },
  {
    num: "02",
    id: "scouting",
    name: "Personalized Dashboards",
    imageSrc: null,
    summary:
      "Custom dashboard hubs that give your organization one clear place to manage teams, staff, prep inputs, and live operational data.",
    bullets: [
      { label: "One source of truth", text: "Bring key org data into one clean interface." },
      { label: "Role-based views", text: "Different views for ops leads, managers, analysts, and staff." },
      { label: "Connected systems", text: "Keep existing tools while syncing into a centralized dashboard." },
    ],
    tags: ["Dashboard UI", "Data Sync", "Team Views", "Org Tracking"],
    meta: [["Format", "Custom"], ["Priority", "High"], ["Type", "Core"]],
  },
  {
    num: "03",
    id: "data",
    name: "Esports Operations Optimization",
    imageSrc: null,
    summary:
      "We audit daily operations, identify bottlenecks, and redesign execution workflows so teams move faster with less friction.",
    bullets: [
      { label: "Workflow tuning", text: "Improve communication structure and task ownership." },
      { label: "Resource planning", text: "Allocate people and budget where they create most value." },
      { label: "Process cleanup", text: "Replace chaotic routines with repeatable systems." },
    ],
    tags: ["Ops Review", "Process Design", "Execution Speed", "Cost Control"],
    meta: [["Format", "Custom"], ["Priority", "High"], ["Type", "Core"]],
  },
  {
    num: "04",
    id: "social",
    name: "Analyst Support and Prep Tools",
    imageSrc: null,
    summary:
      "Tools and data pipelines that help analysts and coaches prepare faster by structuring public opponent data and reusable prep views.",
    bullets: [
      { label: "Data collection", text: "Scrape, organize, and store relevant public match information." },
      { label: "Prep workflows", text: "Make weekly prep easier with structured, reusable tooling." },
      { label: "Analyst support", text: "Set up clear data systems for review and decision-making." },
    ],
    tags: ["Prep Stack", "Opponent Data", "Analyst Tools", "Review Systems"],
    meta: [["Format", "Custom"], ["Priority", "Medium"], ["Type", "Specialized"]],
  },
  {
    num: "05",
    id: "web",
    name: "Network and Resource Sourcing",
    imageSrc: null,
    summary:
      "Access trusted esports network channels for staff, editors, designers, coaches, players, vendors, and other operational resources.",
    bullets: [
      { label: "People sourcing", text: "Connect with reliable talent and staff options." },
      { label: "Vendor routing", text: "Find vetted providers matched to your budget level." },
      { label: "Value-first matching", text: "Prioritize practical fit over expensive default choices." },
    ],
    tags: ["Esports Network", "Talent Access", "Vendor Sourcing", "Budget Fit"],
    meta: [["Format", "On-Demand"], ["Priority", "Medium"], ["Type", "Support"]],
  },
  {
    num: "06",
    id: "roster",
    name: "Custom Solutions for Teams",
    imageSrc: null,
    summary:
      "Team-specific builds and optimizations tailored to your structure, goals, and current resources, not a fixed package template.",
    bullets: [
      { label: "Flexible scope", text: "Build only what your org actually needs right now." },
      { label: "Budget-aware pricing", text: "Solutions sized for available resources and impact targets." },
      { label: "Hands-on support", text: "Continuous improvement as your org grows and priorities shift." },
    ],
    tags: ["Custom Scope", "Team Tools", "Ops Support", "Iterative Delivery"],
    meta: [["Format", "Tailored"], ["Priority", "High"], ["Type", "Strategic"]],
  },
];

export default function Solutions() {
  const [active, setActive] = useState(-1);
  const stackRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".sol-card",
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.05,
          ease: "power2.out",
          scrollTrigger: {
            trigger: stackRef.current,
            start: "top 85%",
            once: true,
          },
        },
      );

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        onLeave: () => document.documentElement.style.setProperty("--edge-line-grow", "0px"),
        onEnterBack: () => document.documentElement.style.setProperty("--edge-line-grow", "0px"),
      });
    }, stackRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="sect solutions" id="solutions" ref={sectionRef}>
      <SectionCoord idx="03" label="SOLUTIONS" lat="34.0°N" lon="118.2°W" />
      <div className="sect-inner">
        <div className="sol-head">
          <KineticHeading
            tag="h2"
            rows={[
              { text: "SERVICES" },
              { parts: [{ text: "BUILT TO FIT.", accent: true }] },
            ]}
          />
          <div className="sol-head-meta">
            <span className="section-tag"><span className="num">03</span> Core Services</span>
            <p>Every engagement is custom. Hover each lane to see what we can design, build, and optimize for your org.</p>
          </div>
        </div>

        <div
          className="sol-stack"
          ref={stackRef}
          onMouseLeave={() => setActive(-1)}
        >
          {SOLUTIONS.map((s, i) => {
            const isActive = active === i;
            return (
              <article
                key={s.id}
                className={"sol-card" + (isActive ? " is-active" : "")}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive((prev) => (prev === i ? -1 : i))}
                tabIndex={0}
              >
                <div className="sol-bar">
                  <span className="sol-icon" aria-hidden="true">
                    <SolutionIcon id={s.id} />
                  </span>
                  <span className="sol-num">{s.num}</span>
                  <h3 className="sol-name">{s.name}</h3>
                  <span className="sol-bar-arr" aria-hidden="true">↗</span>
                </div>

                <div className="sol-panel">
                  <div className="sol-card-text">
                    <p>{s.summary}</p>
                    <ul className="sol-bullets">
                      {s.bullets.map((b) => (
                        <li className="sol-bullet" key={b.label}>
                          <strong>{b.label}:</strong> {b.text}
                        </li>
                      ))}
                    </ul>
                    <div className="sol-tag-row">
                      {s.tags.map((t) => (
                        <span className="tg" key={t}>{t}</span>
                      ))}
                    </div>
                    <div className="sol-meta-row">
                      {s.meta.map((m) => (
                        <div className="sol-meta" key={m[0]}>
                          <span className="k">{m[0]}</span>
                          <span className={"v" + (m[2] === "lime" ? " lime" : "")}>
                            {m[1]}{m[2] === "lime" ? "%" : ""}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="sol-card-visual">
                    {s.imageSrc ? (
                      <img src={s.imageSrc} alt="" className="sol-media-img" />
                    ) : (
                      <div className="sol-media-placeholder">
                        <span className="sol-media-k">IMG.{s.num}</span>
                        <span className="sol-media-title">{s.name}</span>
                        <span className="sol-media-hint">Add your image asset</span>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
