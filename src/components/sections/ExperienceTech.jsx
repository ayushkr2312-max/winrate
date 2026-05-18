import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import KineticHeading from "../primitives/KineticHeading";
import SectionCoord from "../primitives/SectionCoord";

gsap.registerPlugin(ScrollTrigger);

const PILLARS = [
  {
    n: "01",
    name: "Tech With Purpose",
    desc: "We ship systems where they remove real drag—not because every workflow deserves a dashboard. If code doesn't earn its place in your org, we don't force it in.",
    meta: ["Approach", "Fit-first"],
    sub: "No automation theatre",
  },
  {
    n: "02",
    name: "Manual When It Matters",
    desc: "Some moments need a human in the loop. We keep concierge checkpoints, white-glove handoffs, and manual QA wherever judgment beats a webhook.",
    meta: ["Ops", "Human-led"],
    sub: "Process over plugins",
  },
  {
    n: "03",
    name: "Network You Can Use",
    desc: "Partner intros, talent lanes, sponsor bridges—we route you through relationships we've built across orgs, leagues, and vendors you can't replicate from a tool stack.",
    meta: ["Reach", "Warm paths"],
    sub: "Connections as leverage",
  },
  {
    n: "04",
    name: "Experience On Tap",
    desc: "Former ops leads, analysts, and builders who've run your calendar. The value isn't a slide deck—it's operators who've already solved your class of problem.",
    meta: ["Team", "In-the-trenches"],
    sub: "Outcomes for your org",
  },
];

export default function ExperienceTech() {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".exp-x-step").forEach((s, i) => {
        gsap.set(s, { y: 24, opacity: 0 });
        ScrollTrigger.create({
          trigger: s,
          start: "top 86%",
          once: true,
          onEnter: () => gsap.to(s, { y: 0, opacity: 1, duration: 0.7, delay: i * 0.08, ease: "power2.out" }),
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className="sect exp-x" id="experience" ref={ref}>
      <SectionCoord idx="05" label="EXPERIENCE × TECH" lat="40.7°N" lon="73.9°W" />
      <div className="sect-inner">
        <div className="exp-x-head">
          <div>
            <span className="section-tag"><span className="num">05</span> Experience × Tech</span>
            <KineticHeading
              tag="h2"
              rows={[
                { text: "EXPERIENCE" },
                { parts: [{ text: "× " }, { text: "TECH.", accent: true }] },
              ]}
            />
          </div>
          <p>
            We don't sell software alone. We blend engineered systems, deliberate manual work, and the
            network we've earned in esports—to deliver the highest-leverage outcome for your org.
          </p>
        </div>

        <div className="exp-x-rail">
          {PILLARS.map((s, i) => (
            <div className="exp-x-step" key={i}>
              <span className="exp-x-num">{s.n} · {s.name.toUpperCase()}</span>
              <h3 className="exp-x-name">{s.name}</h3>
              <p className="exp-x-desc">{s.desc}</p>
              <span className="exp-x-meta">
                {s.meta[0]} <span className="v">{s.meta[1]}</span>
                <br />
                {s.sub}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
