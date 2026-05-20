import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionCoord from "../primitives/SectionCoord";

gsap.registerPlugin(ScrollTrigger);

const PROBLEMS = [
  {
    tag: "OPERATIONS",
    title: "Repetitive work that could be automated",
    body: "The same tasks rebuilt manually every cycle — logistics, updates, follow-ups. Systemize once, free your team.",
  },
  {
    tag: "VISIBILITY",
    title: "Slow decisions from scattered data",
    body: "Context spread across Discord, Notion, sheets, and DMs. One centralized view could change everything.",
  },
  {
    tag: "COORDINATION",
    title: "Handoffs that break under pressure",
    body: "Unclear routing, overlapping ownership, chat-based delegation. Structure turns chaos into execution.",
  },
  {
    tag: "PREP + ANALYSIS",
    title: "Analyst workflows that should be faster",
    body: "Opponent prep and VOD review built on scattered data and manual cleanup. Better tooling means more insight, less busywork.",
  },
  {
    tag: "COST + SCALE",
    title: "Costs that scale faster than output",
    body: "Adding headcount instead of infrastructure. The right systems let you do more with what you have.",
  },
  {
    tag: "RETENTION",
    title: "Internal ops that don't match the brand",
    body: "Players, staff, and partners notice how an org actually runs. Operational quality keeps talent and closes deals.",
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

      </div>
    </section>
  );
}
