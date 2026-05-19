import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Magnetic({ as: Tag = "div", strength = 0.35, children, ...rest }) {
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
      const x = (e.clientX - rect.left - rect.width / 2) * strength;
      const y = (e.clientY - rect.top - rect.height / 2) * strength;
      xTo(x);
      yTo(y);
    };
    const onLeave = () => {
      rect = null;
      gsap.to(el, { x: 0, y: 0, duration: 0.65, ease: "elastic.out(1,.4)" });
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
  }, [strength]);

  return <Tag ref={ref} {...rest}>{children}</Tag>;
}
