import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import KineticHeading from "../primitives/KineticHeading";
import SectionCoord from "../primitives/SectionCoord";
import Magnetic from "../primitives/Magnetic";

gsap.registerPlugin(ScrollTrigger);

const ROWS = [
  {
    n: "01",
    title: "Built from the inside",
    body: "Built by people who've worked inside esports orgs, not consultants parachuting in. We know the difference between a roster manager's workflow and a GM's reporting needs.",
    detail: "Founders include former ops leads, data analysts, and developers from active esports organizations.",
    tag: "Insider",
  },
  {
    n: "02",
    title: "Custom-scoped, always",
    body: "Every solution is custom-scoped. No SaaS subscriptions for tools you'll never fully use. We scope to your actual problems, not to a feature list someone else validated.",
    detail: "Average engagement kick-off to first deliverable: 14 days.",
    tag: "No Bloat",
  },
  {
    n: "03",
    title: "We stay on",
    body: "Ongoing support, iteration, and a direct line — not a Zendesk ticket. We treat client relationships like we're embedded in your team, because functionally, we are.",
    detail: "All clients get a direct Slack channel and dedicated point of contact from day one.",
    tag: "Direct",
  },
];

export default function Manifesto() {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".manifesto-row").forEach((row, i) => {
        gsap.set(row, { x: -40, opacity: 0 });
        ScrollTrigger.create({
          trigger: row,
          start: "top 84%",
          once: true,
          onEnter: () => gsap.to(row, { x: 0, opacity: 1, duration: 0.8, delay: i * 0.1, ease: "power3.out" }),
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className="sect manifesto" id="manifesto" ref={ref}>
      <div className="sect-inner">
        <span className="section-tag invert"><span className="num" style={{ color: "var(--lime-2)" }}>03</span> Manifesto</span>
        <div className="manifesto-head">
          <KineticHeading
            tag="h2"
            rows={[
              { text: "WE SPEAK" },
              { parts: [{ text: "", }, { text: "ESPORTS.", accent: true }] },
            ]}
          />
          <p>Three principles that separate us from agencies that "also do esports." We're not adapted for this space — we were built in it.</p>
        </div>

        <div className="manifesto-rows">
          {ROWS.map((r, i) => (
            <div className="manifesto-row" key={i}>
              <div className="manifesto-row-num">{r.n}</div>
              <div>
                <h3 className="manifesto-row-title">{r.title}</h3>
                <p className="manifesto-row-body">{r.body}</p>
                <p className="manifesto-row-detail">{r.detail}</p>
              </div>
              <div className="manifesto-row-tag"><span>{r.tag}</span></div>
            </div>
          ))}
        </div>

        <div className="manifesto-cta">
          <div className="manifesto-cta-left">
            <h3>Ready to talk?</h3>
            <p>Strategy calls are free. We'll scope your biggest pain point in 30 minutes.</p>
          </div>
          <Magnetic as="a" href="#contact" className="btn-dark" data-cursor-label="GO" strength={0.32}>
            Book a Strategy Call →
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
