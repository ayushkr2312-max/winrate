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
    name: "Workflow Automation",
    imageSrc: null,
    summary:
      "Eliminate the manual ops chokepoints. We build custom flows across Make, n8n, Zapier and direct APIs that ship as part of your stack — not as another subscription.",
    bullets: [
      { label: "Scheduling & comms", text: "Match-day cadence, scrim invites, recap DMs." },
      { label: "Task routing", text: "Auto-assign by role, escalate on SLA breach." },
      { label: "Reporting", text: "Nightly digests, weekly leadership reports." },
    ],
    tags: ["Make.com", "n8n", "Zapier", "Custom APIs"],
    meta: [["Delivery", "7–14 d"], ["Impact", "85", "lime"], ["Type", "ADVANCED"]],
  },
  {
    num: "02",
    id: "scouting",
    name: "Talent Scouting Pipeline",
    imageSrc: null,
    summary:
      "A structured discovery engine that ingests match data, VOD signals, and social pulse across regions—so your scouting lead reviews candidates, not spreadsheets.",
    bullets: [
      { label: "Multi-source ingest", text: "Match logs, VOD tags, social ranks." },
      { label: "Scoring model", text: "Normalized across leagues and roles." },
      { label: "Watchlist", text: "Alerts when a prospect's metrics shift." },
    ],
    tags: ["Python", "Postgres", "Custom DB", "Scrapers"],
    meta: [["Delivery", "14–21 d"], ["Impact", "92", "lime"], ["Type", "COMPLEX"]],
  },
  {
    num: "03",
    id: "data",
    name: "Data Visualization",
    imageSrc: null,
    summary:
      "Live dashboards built around how coaches and GMs actually decide. We pull from your existing tools, normalize, and surface only what changes a call.",
    bullets: [
      { label: "Coach view", text: "Player performance, side bias, agent fit." },
      { label: "GM view", text: "ROI per signing, sponsor delivery, social trend." },
      { label: "Real-time alerts", text: "SLO breaches, social anomalies." },
    ],
    tags: ["React", "D3.js", "REST APIs", "Postgres"],
    meta: [["Delivery", "10–18 d"], ["Impact", "88", "lime"], ["Type", "INTERMEDIATE"]],
  },
  {
    num: "04",
    id: "social",
    name: "Social Growth Tracking",
    imageSrc: null,
    summary:
      "Monitor, benchmark, and grow your footprint across every platform in one view. Stop refreshing five dashboards before every leadership meeting.",
    bullets: [
      { label: "Unified metrics", text: "Reach, engagement, retention." },
      { label: "Benchmark vs. peers", text: "Normalized against tier and region." },
      { label: "Content scoring", text: "What's hitting, what to retire." },
    ],
    tags: ["Meta API", "TikTok API", "Analytics", "CMS"],
    meta: [["Delivery", "5–10 d"], ["Impact", "76", "lime"], ["Type", "STANDARD"]],
  },
  {
    num: "05",
    id: "web",
    name: "Web Build & Support",
    imageSrc: null,
    summary:
      "Sites built for esports orgs—fast, dark, branded, and backed by ongoing support. Next.js stack. Built for sponsors to take you seriously in under a second.",
    bullets: [
      { label: "Performance budget", text: "LCP under 1s, CLS under 0.05." },
      { label: "Editor-friendly CMS", text: "Your team ships posts, not tickets." },
      { label: "Ongoing iteration", text: "Not deliver-and-bounce agency work." },
    ],
    tags: ["Next.js", "Figma", "Sanity CMS", "CDN"],
    meta: [["Delivery", "14–28 d"], ["Impact", "90", "lime"], ["Type", "ADVANCED"]],
  },
  {
    num: "06",
    id: "roster",
    name: "Roster Management",
    imageSrc: null,
    summary:
      "One source of truth for your entire squad—contracts, performance history, transfers, renewals. Replaces the spreadsheets your ops lead maintains by hand.",
    bullets: [
      { label: "Contract clocks", text: "Auto-flag renewal windows." },
      { label: "Performance ledger", text: "Tied to match outcomes and VOD." },
      { label: "Transfer history", text: "Internal CRM for player relationships." },
    ],
    tags: ["Custom App", "DB Design", "Contracts", "API"],
    meta: [["Delivery", "21–35 d"], ["Impact", "94", "lime"], ["Type", "COMPLEX"]],
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
              { text: "CAPABILITY" },
              { parts: [{ text: "STACK.", accent: true }] },
            ]}
          />
          <div className="sol-head-meta">
            <span className="section-tag"><span className="num">03</span> Build Units</span>
            <p>Hover a bar to expand. Six deliverables in one view—text left, your image on the right.</p>
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
