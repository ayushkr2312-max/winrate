import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * KineticHeading — mask-slide-up reveal triggered on scroll.
 * Props:
 *   rows: array of { text, className, accent: bool }
 *   className: outer
 *   tag: 'h1' | 'h2' | ...
 *   stagger: seconds between row reveals
 *   triggerStart: ScrollTrigger start (default 'top 82%')
 */
export default function KineticHeading({ rows, className = "", tag: Tag = "h2", stagger = 0.12, triggerStart = "top 82%" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const inners = el.querySelectorAll(".inner");

    const st = ScrollTrigger.create({
      trigger: el,
      start: triggerStart,
      once: true,
      onEnter: () => {
        gsap.fromTo(
          inners,
          { yPercent: 110 },
          { yPercent: 0, duration: 1.1, ease: "expo.out", stagger },
        );
      },
    });
    return () => st.kill();
  }, [stagger, triggerStart]);

  return (
    <Tag ref={ref} className={`k-head ${className}`}>
      {rows.map((r, i) => (
        <span key={i} className="row">
          <span className={"inner " + (r.className || "")}>
            {r.parts
              ? r.parts.map((p, j) => (p.accent
                ? <span key={j} className="accent">{p.text}</span>
                : (p.stroke ? <span key={j} className="stroke">{p.text}</span> : p.text)))
              : r.text}
          </span>
        </span>
      ))}
    </Tag>
  );
}
