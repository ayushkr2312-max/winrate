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
    title: "Real esports operating experience",
    body: "We understand how esports organizations actually function day-to-day because our team has worked in esports management environments directly.",
    detail: "You get guidance and systems shaped by practical org realities, not generic frameworks.",
    tag: "Esports-native",
  },
  {
    n: "02",
    title: "Technical execution that ships",
    body: "We do more than recommend changes. We build and implement automations, dashboards, workflows, and data systems your team can use right away.",
    detail: "The focus is practical delivery: less friction, faster execution, cleaner organization.",
    tag: "Build-first",
  },
  {
    n: "03",
    title: "Custom solutions, cost-conscious delivery",
    body: "We adapt scope and pricing to each org's needs and available resources so teams can improve operations without overcommitting budget.",
    detail: "Every engagement is tailored for your structure, growth stage, and biggest operational pressure points.",
    tag: "Practical value",
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
        <span className="section-tag invert"><span className="num" style={{ color: "var(--lime-2)" }}>06</span> About / Why Us</span>
        <div className="manifesto-head">
          <KineticHeading
            tag="h2"
            rows={[
              { text: "BUILT FOR" },
              { parts: [{ text: "GROWING ", }, { text: "ORGS.", accent: true }] },
            ]}
          />
          <p>Winrvte Tech is a hands-on partner for organizations that need better systems, cleaner operations, and smarter use of limited budget.</p>
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
            <h3>Let&apos;s discuss your org</h3>
            <p>Share your current setup, biggest bottlenecks, and budget range. We&apos;ll suggest the most practical first move.</p>
          </div>
          <Magnetic as="a" href="#contact" className="btn-dark" data-cursor-label="GO" strength={0.32}>
            Book a Call →
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
