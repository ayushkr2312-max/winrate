import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import KineticHeading from "../primitives/KineticHeading";
import SectionCoord from "../primitives/SectionCoord";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    n: "01",
    name: "Discovery",
    desc: "30-min strategy call. We map your stack, decide what's actually broken, and tell you which problems we won't take on.",
    meta: ["Time", "30 min"],
    sub: "Free · No deck",
  },
  {
    n: "02",
    name: "Scope",
    desc: "Fixed-scope proposal in 48 hours. Real numbers, real milestones, real engineering — not a 12-page agency brochure.",
    meta: ["Lead", "48 h"],
    sub: "Lock-in optional",
  },
  {
    n: "03",
    name: "Build",
    desc: "Direct Slack channel with the engineer on your work. Daily nudges, weekly demos. You're embedded with us, not waiting in a queue.",
    meta: ["Sprint", "1–4 wk"],
    sub: "Slack + Linear",
  },
  {
    n: "04",
    name: "Ship & Stay",
    desc: "We don't deliver-and-bounce. Most clients renew for ongoing iteration. The platform grows with your org, not against it.",
    meta: ["Retention", "98%"],
    sub: "Forever-friendly",
  },
];

export default function Process() {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".process-step").forEach((s, i) => {
        gsap.set(s, { y: 24, opacity: 0 });
        ScrollTrigger.create({
          trigger: s,
          start: "top 86%",
          once: true,
          onEnter: () => gsap.to(s, { y: 0, opacity: 1, duration: 0.7, delay: i * 0.08, ease: "power2.out" }),
        });
      });
      // line draw — already inline via gradient
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className="sect process" id="process">
      <SectionCoord idx="05" label="PROCESS" lat="52.5°N" lon="13.4°E" />
      <div className="sect-inner">
        <div className="process-head">
          <div>
            <span className="section-tag"><span className="num">04</span> Engagement Loop</span>
            <KineticHeading
              tag="h2"
              rows={[
                { text: "FROM CALL" },
                { parts: [{ text: "TO ", }, { text: "SHIPPED.", accent: true }] },
              ]}
            />
          </div>
          <p>Four checkpoints, no theatre. We optimize for clarity over spectacle: every milestone is a thing your team can actually see in their stack.</p>
        </div>

        <div className="process-rail" ref={ref}>
          {STEPS.map((s, i) => (
            <div className="process-step" key={i}>
              <span className="process-num">{s.n} · {s.name.toUpperCase()}</span>
              <h3 className="process-name">{s.name}</h3>
              <p className="process-desc">{s.desc}</p>
              <span className="process-meta">{s.meta[0]} <span className="v">{s.meta[1]}</span><br />{s.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
