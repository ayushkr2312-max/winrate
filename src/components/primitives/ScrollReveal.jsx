import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * ScrollReveal — generic stagger-friendly reveal that lifts elements into
 * perspective as the user scrolls. Falls back gracefully under reduced motion.
 *
 * Children get a subtle 3d/y/opacity reveal once the wrapper enters the
 * viewport. Use `selector` to limit which descendants animate (default
 * `[data-reveal]` plus the immediate children).
 */
export default function ScrollReveal({
  children,
  as: Tag = "div",
  className = "",
  selector,
  y = 28,
  rotateX = 0,
  scale = 1,
  blur = 0,
  duration = 0.95,
  ease = "expo.out",
  stagger = 0.08,
  delay = 0,
  trigger = "top 85%",
  once = true,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const targets = selector
      ? root.querySelectorAll(selector)
      : Array.from(root.querySelectorAll("[data-reveal]"));

    const els = targets.length ? Array.from(targets) : Array.from(root.children);
    if (els.length === 0) return;

    const initial = {
      y,
      opacity: 0,
      rotateX,
      scale,
      transformOrigin: "50% 100%",
      transformPerspective: 1200,
      filter: blur > 0 ? `blur(${blur}px)` : "none",
      willChange: "transform, opacity",
    };

    gsap.set(els, initial);

    const st = ScrollTrigger.create({
      trigger: root,
      start: trigger,
      once,
      onEnter: () => {
        gsap.to(els, {
          y: 0,
          opacity: 1,
          rotateX: 0,
          scale: 1,
          filter: "blur(0px)",
          duration,
          ease,
          stagger,
          delay,
          clearProps: "filter,willChange,transformPerspective",
        });
      },
    });
    return () => st.kill();
  }, [selector, y, rotateX, scale, blur, duration, ease, stagger, delay, trigger, once]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
