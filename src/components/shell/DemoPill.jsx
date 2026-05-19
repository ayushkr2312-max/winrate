import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function DemoPill() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power2.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power2.out" });
    let rect = null;
    const measure = () => {
      rect = el.getBoundingClientRect();
    };
    const onEnter = () => measure();
    const onMove = (e) => {
      if (!rect) measure();
      if (!rect) return;
      const x = (e.clientX - rect.left - rect.width / 2) * 0.08;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.08;
      xTo(x);
      yTo(y);
    };
    const onLeave = () => {
      rect = null;
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,.4)" });
    };
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", measure);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <a href="#contact" ref={ref} className="pill" data-cursor-label="GO" style={{ transform: "translateX(-50%)" }}>
      <span className="pill-label">Get in Touch</span>
      <span className="pill-arrow">→</span>
    </a>
  );
}
