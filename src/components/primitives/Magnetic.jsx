import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Magnetic({ as: Tag = "div", strength = 0.35, children, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power2.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power2.out" });
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * strength;
      const y = (e.clientY - r.top - r.height / 2) * strength;
      xTo(x);
      yTo(y);
    };
    const onLeave = () => gsap.to(el, { x: 0, y: 0, duration: 0.65, ease: "elastic.out(1,.4)" });
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength]);

  return <Tag ref={ref} {...rest}>{children}</Tag>;
}
