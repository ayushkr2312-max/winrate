import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "../primitives/SplitText";

gsap.registerPlugin(ScrollTrigger);

const ROW1 = [
  "Python", "Google Sheets", "Discord Bots", "Zapier", "Airtable",
  "React", "Node.js", "REST APIs", "PostgreSQL", "Notion",
];
const ROW2 = [
  "Webhooks", "Supabase", "Vercel", "TypeScript", "Data Pipelines",
  "Automation", "Integrations", "Analytics", "Custom Tooling", "Figma",
];

function StackTag({ label, dim }) {
  return (
    <span className={"stack-tag" + (dim ? " stack-tag--dim" : "")}>
      <span className="stack-tag-dot" aria-hidden="true" />
      {label}
    </span>
  );
}

export default function StackSection() {
  const sectionRef = useRef(null);
  const rail1Ref  = useRef(null);
  const rail2Ref  = useRef(null);
  const tween1Ref = useRef(null);
  const tween2Ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".stack-head", { y: 28, opacity: 0 });
      ScrollTrigger.create({
        trigger: ".stack-head",
        start: "top 86%",
        end: "bottom 20%",
        onEnter: () =>
          gsap.to(".stack-head", { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" }),
        onEnterBack: () =>
          gsap.to(".stack-head", { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }),
        onLeave: () => gsap.set(".stack-head", { y: 28, opacity: 0 }),
        onLeaveBack: () => gsap.set(".stack-head", { y: 28, opacity: 0 }),
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const r1 = rail1Ref.current;
    const r2 = rail2Ref.current;
    if (!r1 || !r2) return;

    const list1 = r1.firstElementChild;
    const list2 = r2.firstElementChild;
    r1.appendChild(list1.cloneNode(true));
    r2.appendChild(list2.cloneNode(true));

    const w1 = list1.offsetWidth;
    const w2 = list2.offsetWidth;

    tween1Ref.current = gsap.to(r1, {
      x: -w1, duration: 38, ease: "none", repeat: -1,
    });
    gsap.set(r2, { x: -w2 });
    tween2Ref.current = gsap.to(r2, {
      x: 0, duration: 46, ease: "none", repeat: -1,
    });

    let lastY = window.scrollY;
    let rafId  = 0;
    let settle;
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        const y    = window.scrollY;
        const velo = y - lastY;
        lastY = y;
        const scale = 1 + Math.min(Math.abs(velo) / 18, 2);
        const dir   = velo >= 0 ? 1 : -0.5;
        gsap.to(tween1Ref.current, { timeScale: scale * dir, duration: 0.5, overwrite: true });
        gsap.to(tween2Ref.current, { timeScale: scale * dir, duration: 0.5, overwrite: true });
      });
      clearTimeout(settle);
      settle = setTimeout(() => {
        gsap.to(tween1Ref.current, { timeScale: 1, duration: 0.8, overwrite: true });
        gsap.to(tween2Ref.current, { timeScale: 1, duration: 0.8, overwrite: true });
      }, 180);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      tween1Ref.current?.kill();
      tween2Ref.current?.kill();
      window.removeEventListener("scroll", onScroll);
      clearTimeout(settle);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const pauseAll  = () => { tween1Ref.current?.pause();  tween2Ref.current?.pause();  };
  const resumeAll = () => { tween1Ref.current?.resume(); tween2Ref.current?.resume(); };

  return (
    <section className="sect stack-sect" id="stack" ref={sectionRef}>
      <div className="sect-inner">
        <div className="stack-head">
          <div className="stack-head-text">
            <span className="section-tag">Powered By</span>
            <h2 className="stack-heading">
              <SplitText text="THE " splitBy="chars" stagger={0.04} duration={1.05} />
              <span className="stack-accent">
                <SplitText text="STACK" splitBy="chars" stagger={0.04} duration={1.05} delay={0.12} />
              </span>
            </h2>
          </div>
          <p className="stack-sub">
            Practical tools chosen for reliability and real-world performance.
          </p>
        </div>
      </div>

      <div
        className="stack-rows"
        onMouseEnter={pauseAll}
        onMouseLeave={resumeAll}
        aria-hidden="true"
      >
        <div className="stack-track">
          <div className="stack-rail" ref={rail1Ref}>
            <div className="stack-list">
              {ROW1.map((label, i) => <StackTag key={i} label={label} />)}
            </div>
          </div>
        </div>

        <div className="stack-track">
          <div className="stack-rail" ref={rail2Ref}>
            <div className="stack-list">
              {ROW2.map((label, i) => <StackTag key={i} label={label} dim />)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
