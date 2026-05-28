import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Ticker — replaces generic marquee. Each item is a typed datum
 * (timestamp + region + label + value) so it reads like a real ops feed.
 */
const ITEMS = [
  { t: "00:01:14", label: "SYSTEMS", val: "WORKFLOW AUTOMATION" },
  { t: "00:02:38", label: "DASHBOARDS", val: "ORG CONTROL CENTER" },
  { t: "00:04:02", label: "OPERATIONS", val: "PROCESS OPTIMIZATION" },
  { t: "00:05:11", label: "ANALYST SUPPORT", val: "PREP TOOLING" },
  { t: "00:06:45", label: "RESOURCE NETWORK", val: "STAFF + VENDORS" },
  { t: "00:08:01", label: "CUSTOM DELIVERY", val: "SCOPED PER ORG" },
  { t: "00:09:20", label: "VALUE FOCUS", val: "LOWER COST / LESS DRAG" },
  { t: "00:10:55", label: "WINRVTE TECH", val: "ESPORTS OPS PARTNER" },
];

export default function Ticker({ invert = false }) {
  const wrapRef = useRef(null);
  const railRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const rail = railRef.current;
    if (!wrap || !rail) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return undefined;

    const inner = rail.firstElementChild;
    rail.appendChild(inner.cloneNode(true));

    const width = inner.offsetWidth;
    const tween = gsap.to(rail, {
      x: -width,
      duration: invert ? 30 : 38,
      ease: "none",
      repeat: -1,
    });

    const io = new IntersectionObserver(
      ([entry]) => {
        tween.paused(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "80px 0px" },
    );
    io.observe(wrap);

    return () => {
      io.disconnect();
      tween.kill();
    };
  }, [invert]);

  return (
    <div ref={wrapRef} className={"ticker" + (invert ? " invert" : "")} aria-hidden="true">
      <div className="ticker-rail" ref={railRef}>
        <div style={{ display: "flex", flexShrink: 0 }}>
          {ITEMS.map((it, i) => (
            <span className="ticker-item" key={i}>
              <span className="t">{it.t}</span>
              <span className="label">{it.label}</span>
              <span className="val">{it.val}</span>
              <span className="ticker-sep" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
