import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import KineticHeading from "../primitives/KineticHeading";
import SectionCoord from "../primitives/SectionCoord";
import {
  VisualAutomation,
  VisualScouting,
  VisualDashboard,
  VisualSocial,
  VisualWebBuild,
  VisualRoster,
} from "../solutions/SolutionVisuals";

gsap.registerPlugin(ScrollTrigger);

const SOLUTIONS = [
  {
    num: "01",
    name: "Workflow Automation",
    impact: 4,
    summary: <>Eliminate the manual ops chokepoints. We build <strong>custom flows</strong> across Make, n8n, Zapier and direct APIs that ship as part of your stack — not as another subscription.</>,
    bullets: [
      <><strong>Scheduling & comms:</strong> match-day cadence, scrim invites, recap DMs.</>,
      <><strong>Task routing:</strong> auto-assign by role, escalate on SLA breach.</>,
      <><strong>Reporting:</strong> nightly digests, weekly leadership reports.</>,
    ],
    tags: ["Make.com", "n8n", "Zapier", "Custom APIs"],
    meta: [["Delivery", "7–14 d"], ["Impact", "85", "lime"], ["Type", "ADVANCED"]],
    Visual: VisualAutomation,
  },
  {
    num: "02",
    name: "Talent Scouting Pipeline",
    impact: 5,
    summary: <>A <strong>structured discovery engine</strong> that ingests match data, VOD signals, and social pulse across multiple regions. Built so your scouting lead reviews <strong>candidates</strong>, not spreadsheets.</>,
    bullets: [
      <><strong>Multi-source ingest:</strong> match logs, VOD tags, social ranks.</>,
      <><strong>Scoring model:</strong> normalized across leagues and roles.</>,
      <><strong>Watchlist:</strong> alerts when a prospect's metrics shift.</>,
    ],
    tags: ["Python", "Postgres", "Custom DB", "Scrapers"],
    meta: [["Delivery", "14–21 d"], ["Impact", "92", "lime"], ["Type", "COMPLEX"]],
    Visual: VisualScouting,
  },
  {
    num: "03",
    name: "Data Visualization",
    impact: 4,
    summary: <>Live dashboards built around how coaches and GMs <strong>actually decide</strong>. We pull from your existing tools, normalize, and surface only what changes a call.</>,
    bullets: [
      <><strong>Coach view:</strong> player performance, side bias, agent fit.</>,
      <><strong>GM view:</strong> ROI per signing, sponsor delivery, social trend.</>,
      <><strong>Real-time alerts:</strong> SLO breaches, social anomalies.</>,
    ],
    tags: ["React", "D3.js", "REST APIs", "Postgres"],
    meta: [["Delivery", "10–18 d"], ["Impact", "88", "lime"], ["Type", "INTERMEDIATE"]],
    Visual: VisualDashboard,
  },
  {
    num: "04",
    name: "Social Growth Tracking",
    impact: 3,
    summary: <>Monitor, benchmark, and grow your footprint across every platform — in <strong>one view</strong>. Stop refreshing five dashboards before every leadership meeting.</>,
    bullets: [
      <><strong>Unified metrics:</strong> reach, engagement, retention.</>,
      <><strong>Benchmark vs. peers:</strong> normalized against tier/region.</>,
      <><strong>Content scoring:</strong> what's hitting, what to retire.</>,
    ],
    tags: ["Meta API", "TikTok API", "Analytics", "CMS"],
    meta: [["Delivery", "5–10 d"], ["Impact", "76", "lime"], ["Type", "STANDARD"]],
    Visual: VisualSocial,
  },
  {
    num: "05",
    name: "Web Build & Support",
    impact: 5,
    summary: <>Sites built for esports orgs — <strong>fast, dark, branded</strong>, and backed by ongoing support. Next.js stack. Built for sponsors to take you seriously in 0.9 seconds.</>,
    bullets: [
      <><strong>Performance budget:</strong> LCP &lt; 1s, CLS &lt; 0.05.</>,
      <><strong>Editor-friendly CMS:</strong> your team ships posts, not tickets.</>,
      <><strong>Ongoing iteration:</strong> not "deliver-and-bounce" agency work.</>,
    ],
    tags: ["Next.js", "Figma", "Sanity CMS", "CDN"],
    meta: [["Delivery", "14–28 d"], ["Impact", "90", "lime"], ["Type", "ADVANCED"]],
    Visual: VisualWebBuild,
  },
  {
    num: "06",
    name: "Roster Management",
    impact: 5,
    summary: <>One <strong>source of truth</strong> for your entire squad — contracts, performance history, transfers, renewals. Replaces the 4 spreadsheets your ops lead currently maintains.</>,
    bullets: [
      <><strong>Contract clocks:</strong> auto-flag renewal windows.</>,
      <><strong>Performance ledger:</strong> tied to match outcomes & VOD.</>,
      <><strong>Transfer history:</strong> internal CRM for player relationships.</>,
    ],
    tags: ["Custom App", "DB Design", "Contracts", "API"],
    meta: [["Delivery", "21–35 d"], ["Impact", "94", "lime"], ["Type", "COMPLEX"]],
    Visual: VisualRoster,
  },
];

export default function Solutions() {
  const [active, setActive] = useState(0);
  const stackRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".sol-card").forEach((card, i) => {
        gsap.set(card, { y: 20, opacity: 0 });
        ScrollTrigger.create({
          trigger: card,
          start: "top 88%",
          once: true,
          onEnter: () => gsap.to(card, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: i * 0.04 }),
        });
      });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        onLeave: () => {
          document.documentElement.style.setProperty("--edge-line-grow", "0px");
        },
        onEnterBack: () => {
          document.documentElement.style.setProperty("--edge-line-grow", "0px");
        },
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
              { text: "WHAT" },
              { parts: [{ text: "WE ", }, { text: "DO.", accent: true }] },
            ]}
          />
          <div className="sol-head-meta">
            <span className="section-tag"><span className="num">06</span> Our Solutions</span>
            <p>Six precision tools. Zero bloat. Built around how esports orgs actually operate — not what a SaaS roadmap thought they needed.</p>
          </div>
        </div>

        <div className="sol-stack" ref={stackRef}>
          {SOLUTIONS.map((s, i) => {
            const Visual = s.Visual;
            const isOn = i === active;
            return (
              <div
                key={i}
                className={"sol-card" + (isOn ? " is-active" : "")}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                tabIndex={0}
              >
                <div className="sol-card-head">
                  <span className="sol-num">{s.num}</span>
                  <h3 className="sol-name">{s.name}</h3>
                  <div className="sol-cap-dots">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <span key={j} className={"sol-cap-dot" + (j < s.impact ? " on" : "")} />
                    ))}
                  </div>
                  <span className="sol-card-arr">↗</span>
                </div>

                <div className="sol-card-body">
                  <div className="sol-card-text">
                    <p>{s.summary}</p>
                    <div className="sol-bullets">
                      {s.bullets.map((b, j) => (
                        <span className="sol-bullet" key={j}><span /><span>{b}</span></span>
                      ))}
                    </div>
                    <div className="sol-tag-row">
                      {s.tags.map((t, j) => <span className="tg" key={j}>{t}</span>)}
                    </div>
                    <div className="sol-meta-row">
                      {s.meta.map((m, j) => (
                        <div className="sol-meta" key={j}>
                          <span className="k">{m[0]}</span>
                          <span className={"v" + (m[2] === "lime" ? " lime" : "")}>{m[1]}{m[2] === "lime" ? "%" : ""}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="sol-card-visual">
                    <div className="prob-vis-frame">
                      <span className="left"><span className="live-dot" /><span className="accent">{s.name.toUpperCase()}</span></span>
                      <span>VIS.{s.num}</span>
                    </div>
                    <div className="prob-vis-body">
                      <Visual active={isOn} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
