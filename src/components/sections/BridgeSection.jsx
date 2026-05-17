import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  VisualOpsDrowning,
  VisualScoutingGuess,
  VisualDataScatter,
  VisualOldSite,
  VisualSponsorLeak,
  VisualContentChaos,
} from "../problems/ProblemVisuals";

gsap.registerPlugin(ScrollTrigger);

const CHALLENGES = [
  {
    num: "01",
    tag: "OPERATIONS",
    cluster: "EXECUTION LAYER",
    headline: "Operations core\nat burnout velocity.",
    statement:
      "Scheduling, approvals, travel, comms, and deliverables are split across disconnected tools. One person becomes the system, then the system breaks at peak match load.",
    stat: "67%",
    statLabel: "weekly admin capacity drained by repetitive hand-offs",
    details: [
      { k: "Capacity Drain", v: "67% of weekly admin time goes to repeat coordination and follow-up loops." },
      { k: "Failure Surface", v: "Ops context lives across 4-6 tools, so decisions lose continuity fast." },
      { k: "Competitive Cost", v: "2-4 avoidable misses each match week: late submissions, delayed posts, unresolved blockers." },
    ],
    Visual: VisualOpsDrowning,
    textSide: "left",
  },
  {
    num: "02",
    tag: "TALENT",
    cluster: "SCOUTING ENGINE",
    headline: "Talent pipeline\nis reactive.",
    statement:
      "Scouting from clips, DMs, and memory cannot compound. Faster orgs tag, score, and track prospects before hype cycles inflate price.",
    stat: "4×",
    statLabel: "faster shortlisting with unified match + VOD + role signals",
    details: [
      { k: "Signal Speed", v: "Structured pipelines identify high-upside players before they become obvious." },
      { k: "Coverage Quality", v: "Regional and grassroots coverage instead of trend-driven shortlist bias." },
      { k: "Signing Loss", v: "2-3 future top-tier prospects per quarter are identified too late." },
    ],
    Visual: VisualScoutingGuess,
    textSide: "right",
  },
  {
    num: "03",
    tag: "ANALYTICS",
    cluster: "DECISION STACK",
    headline: "Decision data\nis fragmented.",
    statement:
      "Performance, social, content, finance, and roster data all exist, but no team trusts it because each department works from a different export.",
    stat: "6+",
    statLabel: "systems on average with no canonical event model",
    details: [
      { k: "Fragmentation", v: "Multiple sources, no ownership, and zero dependable cross-team alignment." },
      { k: "Decision Lag", v: "Critical calls happen 48-72 hours behind live competitive reality." },
      { k: "Alignment Risk", v: "Coach, GM, and partnerships optimize against different snapshots." },
    ],
    Visual: VisualDataScatter,
    textSide: "left",
  },
  {
    num: "04",
    tag: "SPONSORSHIP",
    cluster: "REVENUE OPS",
    headline: "Sponsor delivery\nis panic-driven.",
    statement:
      "Deals are won, but renewals weaken when proof-of-delivery and media value are assembled from screenshots, scattered links, and last-minute reports.",
    stat: "11",
    statLabel: "average live obligations across active partner packages",
    details: [
      { k: "Renewal Friction", v: "No clean reporting means renewal calls start defensive, not strategic." },
      { k: "Fulfillment Drift", v: "8-15 obligations run in parallel without a true red-flag layer." },
      { k: "Revenue Exposure", v: "One missed premium deliverable can wipe months of net margin." },
    ],
    Visual: VisualSponsorLeak,
    textSide: "right",
  },
  {
    num: "05",
    tag: "CONTENT",
    cluster: "PUBLISHING PIPELINE",
    headline: "Content engine\nis chaotic.",
    statement:
      "Requests from players, social, and partners arrive in real time, but approvals and assets still move manually, so momentum dies in queue.",
    stat: "31h",
    statLabel: "average approval delay during active match weeks",
    details: [
      { k: "Cycle Time", v: "Manual review loops add 24-72h delays to momentum-dependent content." },
      { k: "Throughput Ceiling", v: "More urgency creates more context-switching and lower quality output." },
      { k: "Brand Risk", v: "No unified approval trail leads to messaging drift and partner stress." },
    ],
    Visual: VisualContentChaos,
    textSide: "left",
  },
  {
    num: "06",
    tag: "BRAND",
    cluster: "DIGITAL PRESENCE",
    headline: "Web presence\nkills credibility.",
    statement:
      "Before calls, sponsors and talent check your site. If it feels slow, dated, or inconsistent, they assume your operation is too.",
    stat: "3.4×",
    statLabel: "partner response lift on modernized org websites",
    details: [
      { k: "Trust Window", v: "You get about 2 seconds to signal legitimacy before bounce." },
      { k: "Conversion Delta", v: "Modern stacks consistently outperform legacy surfaces in sponsor response." },
      { k: "Speed Signal", v: "LCP improvements are often the fastest credibility multiplier." },
    ],
    Visual: VisualOldSite,
    textSide: "right",
  },
];

const EDGE_GROW_STEP = 0.5;
const EDGE_GROW_MAX = 14;

export default function BridgeSection() {
  const sectionRef = useRef(null);
  const stickyRef  = useRef(null);
  const fillRef    = useRef(null);
  const panelRefs  = useRef([]);
  const dotRefs    = useRef([]);
  const [activeIdx, setActiveIdx] = useState(0);

  const dotTops = CHALLENGES.map((_, i) => `${14 + (72 / Math.max(CHALLENGES.length - 1, 1)) * i}%`);

  useEffect(() => {
    const root = document.documentElement;
    const panels = panelRefs.current.filter(Boolean);
    const dots   = dotRefs.current.filter(Boolean);
    const n      = panels.length;

    const setEdgeGrow = (px) => {
      root.style.setProperty("--edge-line-grow", `${px.toFixed(1)}px`);
    };

    const quantizeGrow = (progress) =>
      Math.round((Math.min(1, Math.max(0, progress)) * EDGE_GROW_MAX) / EDGE_GROW_STEP) * EDGE_GROW_STEP;

    panels.forEach((el, i) => {
      const dir = CHALLENGES[i].textSide === "left" ? -1 : 1;
      gsap.set(el, { x: dir * 120, opacity: 0, scale: 0.94 });
    });
    gsap.set(fillRef.current, { scaleY: 0, transformOrigin: "top center" });
    gsap.set(dots, { scale: 0, opacity: 0 });

    const ctx = gsap.context(() => {
      const scrollPx = window.innerHeight * (n + 0.8);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${scrollPx}`,
          pin: stickyRef.current,
          scrub: 1.4,
          anticipatePin: 1,
          onEnter: () => setEdgeGrow(0),
          onEnterBack: () => setEdgeGrow(EDGE_GROW_MAX),
          onLeave: () => setEdgeGrow(EDGE_GROW_MAX),
          onLeaveBack: () => setEdgeGrow(0),
          onUpdate: (self) => {
            const idx = Math.min(Math.floor(self.progress * n + 0.1), n - 1);
            setActiveIdx(idx);
            setEdgeGrow(quantizeGrow(self.progress));
          },
        },
      });

      tl.to(fillRef.current, { scaleY: 1, ease: "none", duration: n }, 0);

      panels.forEach((panel, i) => {
        const s         = i;
        const enterEnd  = s + 0.38;
        const exitStart = s + 0.72;
        const exitEnd   = s + 1.0;

        tl.to(panel, {
          x: 0, opacity: 1, scale: 1,
          ease: "power3.out",
          duration: enterEnd - s,
        }, s);

        if (dots[i]) {
          tl.to(dots[i], { scale: 1, opacity: 1, duration: 0.15, ease: "back.out(2)" }, s + 0.1);
        }

        if (i < n - 1) {
          tl.to(panel, {
            y: -90, opacity: 0,
            ease: "power2.in",
            duration: exitEnd - exitStart,
          }, exitStart);
          if (dots[i]) {
            tl.to(dots[i], { scale: 0.3, opacity: 0.2, duration: 0.15 }, exitStart + 0.05);
          }
        }
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      setEdgeGrow(0);
    };
  }, []);

  return (
    <section className="bridge" id="problem" ref={sectionRef}>
      <div className="bridge-sticky" ref={stickyRef}>

        {/* Vertical spine */}
        <div className="bridge-spine">
          <div className="bridge-spine-track" />
          <div className="bridge-spine-fill" ref={fillRef} />
          {CHALLENGES.map((_, i) => (
            <div
              key={i}
              className="bridge-spine-dot"
              ref={el => { dotRefs.current[i] = el; }}
              style={{ top: dotTops[i] }}
            />
          ))}
        </div>

        {/* Panels */}
        {CHALLENGES.map((item, i) => {
          const Visual  = item.Visual;
          const isLeft  = item.textSide === "left";
          const isActive = activeIdx === i;

          const textBlock = (
            <div className="bridge-panel-text">
              <div className="bridge-tag-row">
                <span className="bridge-num">{item.num}</span>
                <span className="bridge-sep">/</span>
                <span className="bridge-tag">{item.tag}</span>
                <span className="bridge-sep">·</span>
                <span className="bridge-cluster">{item.cluster}</span>
              </div>

              <h2 className="bridge-headline">
                {item.headline.split("\n").map((line, j) => (
                  <span key={j} className="bridge-headline-line">{line}</span>
                ))}
              </h2>

              <p className="bridge-body">{item.statement}</p>

              <div className="bridge-stat">
                <span className="bridge-stat-val">{item.stat}</span>
                <span className="bridge-stat-label">{item.statLabel}</span>
              </div>

              <div className="bridge-details">
                {item.details.map((d, j) => (
                  <div className="bridge-detail-row" key={j}>
                    <span className="bridge-detail-k">{d.k}</span>
                    <span className="bridge-detail-v">{d.v}</span>
                  </div>
                ))}
              </div>
            </div>
          );

          const visualBlock = (
            <div className={`bridge-panel-visual bridge-panel-visual--${isLeft ? "right" : "left"}`}>
              <div className="bridge-vis-header">
                <span className="bridge-vis-header-left">
                  <span className="bridge-live-dot" />
                  <span className="bridge-vis-tag">{item.tag}</span>
                </span>
                <span className="bridge-vis-id">VIS.{item.num}</span>
              </div>
              <div className="bridge-vis-body">
                <Visual active={isActive} />
              </div>
            </div>
          );

          return (
            <div
              key={i}
              className={`bridge-panel bridge-panel--text-${item.textSide}`}
              ref={el => { panelRefs.current[i] = el; }}
            >
              {isLeft ? (
                <>{textBlock}{visualBlock}</>
              ) : (
                <>{visualBlock}{textBlock}</>
              )}
            </div>
          );
        })}

        <div className="bridge-section-label">
          <span>CHALLENGE</span>
        </div>
      </div>

      <div className="bridge-tail" aria-hidden="true" />
    </section>
  );
}
