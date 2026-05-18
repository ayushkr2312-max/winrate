import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import SectionCoord from "../primitives/SectionCoord";
import {
  VisualOpsDrowning,
  VisualScoutingGuess,
  VisualDataScatter,
  VisualOldSite,
  VisualSponsorLeak,
  VisualContentChaos,
} from "../problems/ProblemVisuals";

const CHALLENGES = [
  {
    num: "01",
    tag: "OPERATIONS",
    cluster: "EXECUTION LAYER",
    headline: "Operations core at burnout velocity",
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
    accent: "Execution layer",
  },
  {
    num: "02",
    tag: "TALENT",
    cluster: "SCOUTING ENGINE",
    headline: "Talent pipeline is reactive",
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
    accent: "Scouting engine",
  },
  {
    num: "03",
    tag: "ANALYTICS",
    cluster: "DECISION STACK",
    headline: "Decision data is fragmented",
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
    accent: "Decision stack",
  },
  {
    num: "04",
    tag: "SPONSORSHIP",
    cluster: "REVENUE OPS",
    headline: "Sponsor delivery is panic-driven",
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
    accent: "Revenue ops",
  },
  {
    num: "05",
    tag: "CONTENT",
    cluster: "PUBLISHING PIPELINE",
    headline: "Content engine is chaotic",
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
    accent: "Publishing pipeline",
  },
  {
    num: "06",
    tag: "BRAND",
    cluster: "DIGITAL PRESENCE",
    headline: "Web presence kills credibility",
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
    accent: "Digital presence",
  },
];

export default function BridgeSection() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const overlayRef = useRef(null);
  const cardRefs = useRef([]);
  const hoverTimerRef = useRef(null);
  const hoverIdxRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const activeItem = activeIdx !== null ? CHALLENGES[activeIdx] : null;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".challenge-card",
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.06,
          delay: 0.08,
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const expandFromCard = useCallback((index) => {
    const stage = stageRef.current;
    const overlay = overlayRef.current;
    const origin = cardRefs.current[index];
    if (!stage || !overlay || !origin) return;

    const stageRect = stage.getBoundingClientRect();
    const cardRect = origin.getBoundingClientRect();

    gsap.killTweensOf(overlay);
    gsap.killTweensOf(".challenge-overlay-details > *");
    gsap.set(overlay, {
      x: cardRect.left - stageRect.left,
      y: cardRect.top - stageRect.top,
      width: cardRect.width,
      height: cardRect.height,
      borderRadius: 18,
      autoAlpha: 1,
    });
    gsap.to(overlay, {
      x: 0,
      y: 0,
      width: stageRect.width,
      height: stageRect.height,
      borderRadius: 24,
      duration: 0.62,
      ease: "power3.inOut",
    });
    gsap.fromTo(
      ".challenge-overlay-details > *",
      { opacity: 0, y: 12 },
      {
        opacity: 1,
        y: 0,
        duration: 0.44,
        ease: "power2.out",
        stagger: 0.04,
        delay: 0.18,
      },
    );
  }, []);

  const activate = useCallback((index) => {
    setActiveIdx(index);
    setIsExpanded((wasExpanded) => {
      if (!wasExpanded) {
        requestAnimationFrame(() => expandFromCard(index));
      } else {
        gsap.fromTo(
          ".challenge-overlay-details > *",
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.33, ease: "power2.out", stagger: 0.03 },
        );
      }
      return true;
    });
  }, [expandFromCard]);

  const clearHoverIntent = useCallback(() => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  }, []);

  const queueActivate = useCallback((index) => {
    hoverIdxRef.current = index;
    clearHoverIntent();
    hoverTimerRef.current = setTimeout(() => {
      if (hoverIdxRef.current === index) activate(index);
    }, 140);
  }, [activate, clearHoverIntent]);

  const cancelQueuedActivate = useCallback((index) => {
    if (hoverIdxRef.current === index) {
      hoverIdxRef.current = null;
      clearHoverIntent();
    }
  }, [clearHoverIntent]);

  const collapse = useCallback(() => {
    if (!isExpanded || activeIdx === null) return;
    const stage = stageRef.current;
    const overlay = overlayRef.current;
    const origin = cardRefs.current[activeIdx];
    if (!stage || !overlay || !origin) {
      setIsExpanded(false);
      setActiveIdx(null);
      return;
    }

    const stageRect = stage.getBoundingClientRect();
    const cardRect = origin.getBoundingClientRect();

    gsap.killTweensOf(overlay);
    gsap.to(overlay, {
      x: cardRect.left - stageRect.left,
      y: cardRect.top - stageRect.top,
      width: cardRect.width,
      height: cardRect.height,
      borderRadius: 18,
      autoAlpha: 0,
      duration: 0.45,
      ease: "power2.inOut",
      onComplete: () => {
        setIsExpanded(false);
        setActiveIdx(null);
        hoverIdxRef.current = null;
      },
    });
  }, [activeIdx, isExpanded]);

  useEffect(() => () => clearHoverIntent(), [clearHoverIntent]);

  return (
    <section className="sect challenge-wall" id="problem" ref={sectionRef}>
      <SectionCoord idx="02" label="CHALLENGE" lat="40.7°N" lon="74.0°W" />
      <div className="sect-inner">
        <div className="challenge-head">
          <h2>
            THE <span className="accent">PROBLEM</span> MAP
          </h2>
          <p>hover to expand</p>
        </div>

        <div
          className={"challenge-stage" + (isExpanded ? " is-expanded" : "")}
          ref={stageRef}
          onMouseLeave={collapse}
        >
          <div className="challenge-grid">
            {CHALLENGES.map((item, i) => (
              <button
                key={item.num}
                type="button"
                className={"challenge-card" + (activeIdx === i ? " is-active" : "")}
                onMouseEnter={() => queueActivate(i)}
                onMouseLeave={() => cancelQueuedActivate(i)}
                onFocus={() => activate(i)}
                onClick={() => {
                  clearHoverIntent();
                  activate(i);
                }}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
              >
                <span className="challenge-card-num">{item.num}</span>
                <span className="challenge-card-tag">{item.tag}</span>
                <span className="challenge-card-title">{item.headline}</span>
                <span className="challenge-card-foot">{item.accent}</span>
              </button>
            ))}
          </div>

          {activeItem && (
            <div className={"challenge-overlay" + (isExpanded ? " is-open" : "")} ref={overlayRef}>
              <button type="button" className="challenge-overlay-close" onClick={collapse} aria-label="Close problem details">
                CLOSE
              </button>
              <div className="challenge-overlay-grid challenge-overlay-details">
                <div className="challenge-overlay-copy">
                  <div className="challenge-overlay-top">
                    <span>{activeItem.num}</span>
                    <span>{activeItem.tag}</span>
                    <span>{activeItem.cluster}</span>
                  </div>
                  <h3>{activeItem.headline}</h3>
                  <p>{activeItem.statement}</p>
                  <div className="challenge-overlay-stat">
                    <span className="v">{activeItem.stat}</span>
                    <span className="k">{activeItem.statLabel}</span>
                  </div>
                  <div className="challenge-overlay-list">
                    {activeItem.details.map((detail) => (
                      <div key={detail.k} className="challenge-overlay-row">
                        <span>{detail.k}</span>
                        <span>{detail.v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="challenge-overlay-visual">
                  <div className="challenge-overlay-visual-top">
                    <span>
                      <i /> LIVE ISSUE MODEL
                    </span>
                    <span>VIS.{activeItem.num}</span>
                  </div>
                  <div className="challenge-overlay-visual-body">
                    <activeItem.Visual active={isExpanded} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
