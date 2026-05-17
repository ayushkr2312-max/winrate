import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Reveal — opacity + y reveal triggered on scroll. Intentionally lightweight;
 * heavier reveals are inline within section components.
 */
export default function Reveal({ children, as: Tag = "div", className = "", y = 18, delay = 0, duration = 0.7, trigger = "top 86%" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.set(el, { opacity: 0, y });
    const st = ScrollTrigger.create({
      trigger: el,
      start: trigger,
      once: true,
      onEnter: () => {
        gsap.to(el, { opacity: 1, y: 0, duration, delay, ease: "power3.out" });
      },
    });
    return () => st.kill();
  }, [y, delay, duration, trigger]);

  return <Tag ref={ref} className={className}>{children}</Tag>;
}
