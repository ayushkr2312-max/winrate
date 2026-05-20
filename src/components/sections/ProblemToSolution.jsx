import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SHIFTS = [
  { from: "Manual processes", to: "Automated workflows" },
  { from: "Scattered tools", to: "Centralized systems" },
  { from: "Guesswork", to: "Real-time visibility" },
  { from: "Reactive ops", to: "Structured execution" },
];

export default function ProblemToSolution() {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".pts-line .inner", { opacity: 0, y: 14 });
      ScrollTrigger.create({
        trigger: ".pts-headline",
        start: "top 85%",
        once: true,
        onEnter: () =>
          gsap.to(".pts-line .inner", {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.1,
          }),
      });

      gsap.utils.toArray(".pts-shift").forEach((el, i) => {
        gsap.set(el, { opacity: 0, x: -16 });
        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          once: true,
          onEnter: () =>
            gsap.to(el, {
              opacity: 1,
              x: 0,
              duration: 0.6,
              delay: 0.3 + i * 0.07,
              ease: "power3.out",
            }),
        });
      });

      gsap.set(".pts-cta", { opacity: 0, y: 12 });
      ScrollTrigger.create({
        trigger: ".pts-cta",
        start: "top 90%",
        once: true,
        onEnter: () =>
          gsap.to(".pts-cta", {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: 0.6,
            ease: "power2.out",
          }),
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className="pts" ref={ref}>
      <div className="pts-inner">
        <div className="pts-headline">
          <span className="pts-line">
            <span className="inner">These are solvable.</span>
          </span>
          <span className="pts-line pts-line-accent">
            <span className="inner">Here's what changes.</span>
          </span>
        </div>

        <div className="pts-shifts">
          {SHIFTS.map((s, i) => (
            <div className="pts-shift" key={i}>
              <span className="pts-from">{s.from}</span>
              <span className="pts-arrow" aria-hidden="true">→</span>
              <span className="pts-to">{s.to}</span>
            </div>
          ))}
        </div>

        <div className="pts-cta">
          <span className="pts-cta-line" />
          <span className="pts-cta-text">Here's what we build</span>
          <span className="pts-cta-arrow">↓</span>
        </div>
      </div>
    </section>
  );
}
