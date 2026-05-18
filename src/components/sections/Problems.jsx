import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import KineticHeading from "../primitives/KineticHeading";
import SectionCoord from "../primitives/SectionCoord";
import {
  VisualOpsDrowning,
  VisualScoutingGuess,
  VisualDataScatter,
  VisualOldSite,
  VisualSponsorLeak,
  VisualContentChaos,
} from "../problems/ProblemVisuals";

gsap.registerPlugin(ScrollTrigger);

const PROBLEMS = [
  {
    num: "01",
    tag: "OPERATIONS",
    cluster: "EXECUTION LAYER",
    name: "Your operations core is running at burnout velocity",
    statement:
      "Scheduling, approvals, travel, comms, and deliverables are spread across disconnected tools. One person becomes the system, then the system breaks when match load spikes.",
    severity: 4,
    details: [
      { k: "Capacity Drain", v: <>≈ <span className="nm">67%</span> of weekly admin time is spent on repetitive hand-offs and follow-ups.</> },
      { k: "Failure Surface", v: <>Ops lives in <strong>4-6 disconnected tools</strong>, so context gets lost between every status check.</> },
      { k: "Competitive Cost", v: <>2-4 preventable misses each match week: delayed posts, late submissions, unresolved blockers.</> },
    ],
    Visual: VisualOpsDrowning,
  },
  {
    num: "02",
    tag: "TALENT",
    cluster: "SCOUTING ENGINE",
    name: "Your talent pipeline is reactive instead of compounding",
    statement:
      "Most teams still scout from clips, DMs, and memory. The orgs beating you to break-out players are tagging, scoring, and tracking prospects before hype hits.",
    severity: 5,
    details: [
      { k: "Signal Speed", v: <><span className="nm">4×</span> faster shortlisting when match, VOD, and role metrics are unified.</> },
      { k: "Coverage Quality", v: <>Tier-1 and grassroots across regions, instead of sampling whoever trends on socials that week.</> },
      { k: "Signing Loss", v: <>2-3 future top-tier prospects per quarter are identified late and signed by faster orgs.</> },
    ],
    Visual: VisualScoutingGuess,
  },
  {
    num: "03",
    tag: "ANALYTICS",
    cluster: "DECISION STACK",
    name: "Your decision data is fragmented and stale",
    statement:
      "Performance, social, content, finance, and roster data exist, but nobody trusts it because every department works from a different export and timeline.",
    severity: 4,
    details: [
      { k: "Fragmentation", v: <>Avg. <span className="nm">6+</span> systems with no canonical event model or owner.</> },
      { k: "Decision Lag", v: <>Critical calls happen <strong>48-72 hours late</strong>, after momentum has shifted.</> },
      { k: "Alignment Risk", v: <>Coach, GM, and partnerships teams optimize against different versions of reality.</> },
    ],
    Visual: VisualDataScatter,
  },
  {
    num: "04",
    tag: "SPONSORSHIP",
    cluster: "REVENUE OPS",
    name: "Sponsor delivery lives in panic mode",
    statement:
      "Growing orgs win deals but lose renewal leverage because proof-of-delivery, media value, and asset status are buried in screenshots and last-minute exports.",
    severity: 5,
    details: [
      { k: "Renewal Friction", v: <>Without clean reporting, renewal conversations start defensive instead of strategic.</> },
      { k: "Fulfillment Drift", v: <>8-15 sponsor obligations can be active at once with no live red-flag system.</> },
      { k: "Revenue Impact", v: <>One missed premium deliverable can erase months of margin for a growing roster.</> },
    ],
    Visual: VisualSponsorLeak,
  },
  {
    num: "05",
    tag: "CONTENT",
    cluster: "PUBLISHING PIPELINE",
    name: "Your content machine is chaotic, not scalable",
    statement:
      "Content requests arrive from players, brand partners, and social in real time, but approvals and asset flow are still manual and context disappears every hand-off.",
    severity: 4,
    details: [
      { k: "Cycle Time", v: <>Manual review loops create 24-72 hour delays on posts tied to live match momentum.</> },
      { k: "Throughput Ceiling", v: <>Teams ship less by doing more context switching; quality drops as urgency rises.</> },
      { k: "Brand Risk", v: <>No single approval trail means misaligned messaging and avoidable sponsor/legal stress.</> },
    ],
    Visual: VisualContentChaos,
  },
  {
    num: "06",
    tag: "BRAND",
    cluster: "DIGITAL PRESENCE",
    name: "Your web presence undercuts competitive credibility",
    statement:
      "Before calls, sponsors and talent check your site. If it feels slow, dated, or inconsistent, they assume the operation behind it is the same.",
    severity: 3,
    details: [
      { k: "Trust Window", v: <>You get <span className="nm">2 seconds</span> to signal legitimacy before visitors bounce.</> },
      { k: "Conversion Delta", v: <><strong>3.4×</strong> higher partner response rates on modernized org web stacks.</> },
      { k: "Speed Signal", v: <>LCP from 4.8s to 0.9s is often the fastest credibility win available.</> },
    ],
    Visual: VisualOldSite,
  },
];

export default function Problems() {
  const [active, setActive] = useState(0);
  const [sectionVisible, setSectionVisible] = useState(false);
  const sectionRef = useRef(null);
  const stackRef = useRef(null);
  const closerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // entrance — fade cards up
      gsap.utils.toArray(".prob-card").forEach((card, i) => {
        gsap.set(card, { y: 22, opacity: 0 });
        ScrollTrigger.create({
          trigger: card,
          start: "top 88%",
          once: true,
          onEnter: () => gsap.to(card, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: i * 0.05 }),
        });
      });

      // closer slide-up
      const inners = closerRef.current?.querySelectorAll(".inner");
      if (inners) {
        gsap.set(inners, { yPercent: 110 });
        ScrollTrigger.create({
          trigger: closerRef.current,
          start: "top 82%",
          once: true,
          onEnter: () => gsap.to(inners, { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.12 }),
        });
      }

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => setSectionVisible(self.isActive),
      });
    }, stackRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="sect problems" id="problem" ref={sectionRef}>
      <SectionCoord idx="02" label="CHALLENGE" lat="40.7°N" lon="74.0°W" />
      <div className="sect-inner">
        <div className="prob-head">
          <KineticHeading
            tag="h2"
            rows={[
              { text: "THE GRIND" },
              { parts: [{ text: "IS " }, { text: "REAL.", accent: true }] },
            ]}
          />
          <div className="prob-head-meta">
            <span className="lime">{String(PROBLEMS.length).padStart(2, "0")} / CRITICAL PAIN POINTS</span>
            <span>SECT.02 / OBSERVED</span>
            <p>Failure patterns we repeatedly see in emerging and scaling esports orgs. Hover or focus a row to expand each issue map.</p>
          </div>
        </div>

        <div className="prob-stack" ref={stackRef}>
          {PROBLEMS.map((p, i) => {
            const Visual = p.Visual;
            const isOn = sectionVisible && i === active;
            return (
              <div
                key={i}
                className={"prob-card" + (isOn ? " is-active" : "")}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                tabIndex={0}
              >
                <div className="prob-card-head">
                  <span className="prob-num">{p.num}</span>
                  <div>
                    <div className="prob-tag-row">
                      <span className="tag">{p.tag}</span>
                      <span className="tag">{p.cluster}</span>
                    </div>
                    <h3 className="prob-name">{p.name}</h3>
                  </div>
                  <div className="prob-card-pip">
                    <div className="prob-severity-bars">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <span key={j} className={"prob-bar" + (j < p.severity ? " on" : "")} />
                      ))}
                    </div>
                    <span className="prob-card-arr">→</span>
                  </div>
                </div>

                <div className="prob-card-body">
                  <div className="prob-card-text">
                    <p className="prob-statement">{p.statement}</p>
                    <div className="prob-detail-rows">
                      {p.details.map((d, j) => (
                        <div className="prob-detail-row" key={j}>
                          <span className="k">{d.k}</span>
                          <span className="v">{d.v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="prob-card-visual">
                    <div className="prob-vis-frame">
                      <span className="left"><span className="live-dot" /><span className="accent">{p.tag}</span></span>
                      <span>VIS.{p.num}</span>
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

        <div className="prob-closer" ref={closerRef}>
          <span className="prob-closer-a"><span className="inner">We built the fix</span></span>
          <span className="prob-closer-b"><span className="inner">FOR ALL OF IT.</span></span>
        </div>
      </div>
    </section>
  );
}
