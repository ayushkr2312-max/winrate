import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionCoord from "../primitives/SectionCoord";

gsap.registerPlugin(ScrollTrigger);

const PROBLEMS = [
  {
    tag: "OPERATIONS",
    title: "Repetitive work that could be running itself",
    body: "Match-week logistics, roster updates, internal follow-ups — the same tasks get rebuilt manually every cycle. A lot of this operational overhead could be systemized once and freed from your team's daily plate.",
  },
  {
    tag: "VISIBILITY",
    title: "Decisions that should be faster with better data access",
    body: "When key context lives across Discord, Notion, spreadsheets, and DMs, getting a clear picture takes longer than it should. Leads and managers could be making sharper calls if information was centralized and visible in real time.",
  },
  {
    tag: "COORDINATION",
    title: "Handoffs and ownership that could be more structured",
    body: "As orgs grow, tasks naturally start falling between the cracks — unclear routing, overlapping responsibilities, and chat-based delegation. A structured workflow layer could turn chaotic handoffs into predictable execution.",
  },
  {
    tag: "PREP + ANALYSIS",
    title: "Analyst workflows that should be faster and more reliable",
    body: "Opponent prep, VOD review, and performance tracking often depend on scattered public data and manual cleanup. With the right tooling, analysts and coaches could spend more time on insight and less time on data collection.",
  },
  {
    tag: "COST + SCALE",
    title: "Growth that could happen without proportionally growing costs",
    body: "Many orgs scale by adding headcount instead of infrastructure — which means costs rise faster than output. The right systems foundation could help teams do more with the resources they already have, and grow more efficiently when they're ready.",
  },
  {
    tag: "RETENTION",
    title: "Internal experience that should match the external brand",
    body: "Players, staff, and partners notice how an org actually runs — not just how it looks online. Operational quality could be the thing that keeps top talent and closes better deals, instead of quietly working against you.",
  },
];

export default function BridgeSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".cx-card").forEach((el, i) => {
        gsap.set(el, { opacity: 0, y: 30, scale: 0.97 });
        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          once: true,
          onEnter: () =>
            gsap.to(el, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.7,
              delay: i * 0.08,
              ease: "power3.out",
            }),
        });
      });

      const closerEls = sectionRef.current?.querySelectorAll(".cx-closer .inner");
      if (closerEls) {
        gsap.set(closerEls, { yPercent: 110 });
        ScrollTrigger.create({
          trigger: ".cx-closer",
          start: "top 82%",
          once: true,
          onEnter: () =>
            gsap.to(closerEls, {
              yPercent: 0,
              duration: 1.1,
              ease: "expo.out",
              stagger: 0.12,
            }),
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="sect challenge-wall" id="problem" ref={sectionRef}>
      <SectionCoord idx="02" label="CHALLENGE" lat="40.7°N" lon="74.0°W" />
      <div className="sect-inner">
        <div className="challenge-head">
          <h2>
            THE <span className="accent">PROBLEMS</span>
          </h2>
          <p>
            These aren't failures — they're growth signals. Most orgs hit
            the same walls once they start scaling past the founding team.
          </p>
        </div>

        <div className="cx-grid">
          {PROBLEMS.map((item, i) => (
            <div className="cx-card" key={i}>
              <div className="cx-card-top">
                <span className="cx-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="cx-tag">{item.tag}</span>
              </div>
              <h3 className="cx-title">{item.title}</h3>
              <p className="cx-body">{item.body}</p>
              <div className="cx-card-edge" aria-hidden="true" />
            </div>
          ))}
        </div>

        <div className="cx-closer">
          <span className="cx-closer-a">
            <span className="inner">We built the fix</span>
          </span>
          <span className="cx-closer-b">
            <span className="inner">FOR ALL OF IT.</span>
          </span>
        </div>
      </div>
    </section>
  );
}
