import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CLAIMS = [
  {
    num: "70%",
    label: "Less Manual Work",
    desc: "Average reduction in repetitive manual tasks after workflow automation systems are implemented across org operations.",
  },
  {
    num: "3×",
    label: "Faster Prep",
    desc: "Teams using our analyst prep tools run opponent research and data review significantly faster than before implementation.",
  },
  {
    num: "0",
    label: "Generic Packages",
    desc: "Every solution is custom-built for the org and its budget. No templates, no recycled solutions, no one-size-fits-all.",
  },
  {
    num: "6+",
    label: "Service Areas",
    desc: "Complete coverage across automation, dashboards, operations, prep tools, resource sourcing, and fully custom builds.",
  },
  {
    num: "7d",
    label: "Avg First Deploy",
    desc: "From discovery call to your first working system live. Built, connected, and handed off in under a week on average.",
  },
  {
    num: "100%",
    label: "Esports-Focused",
    desc: "We only work with esports organizations. Every tool, framework, and approach is built around competitive gaming realities.",
  },
];

export default function EdgeSection() {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".edge-tag-line", { y: 16, opacity: 0 });
      ScrollTrigger.create({
        trigger: ".edge-tag-line",
        start: "top 88%",
        once: true,
        onEnter: () =>
          gsap.to(".edge-tag-line", { y: 0, opacity: 1, duration: 0.55, ease: "power2.out" }),
      });

      gsap.utils.toArray(".edge-claim").forEach((el, i) => {
        gsap.set(el, { y: 32, opacity: 0 });
        ScrollTrigger.create({
          trigger: el,
          start: "top 86%",
          once: true,
          onEnter: () =>
            gsap.to(el, {
              y: 0,
              opacity: 1,
              duration: 0.72,
              delay: i * 0.14,
              ease: "power2.out",
            }),
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className="sect edge-sect" id="edge" ref={ref}>
      <div className="edge-watermark" aria-hidden="true">EDGE</div>
      <div className="sect-inner">
        <span className="section-tag edge-tag-line">The Competitive Edge</span>
        <div className="edge-grid">
          {CLAIMS.map((c, i) => (
            <div key={i} className="edge-claim">
              <div className="edge-num" aria-hidden="true">{c.num}</div>
              <h3 className="edge-label">{c.label}</h3>
              <p className="edge-desc">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
