import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Ticker — operations strip. Each item is label + value,
 * wrapped with "--" at start and end. Drift speed binds to scroll velocity.
 */
const ITEMS = [
  { label: "SYSTEMS", val: "WORKFLOW AUTOMATION" },
  { label: "DASHBOARDS", val: "ORG CONTROL CENTER" },
  { label: "OPERATIONS", val: "PROCESS OPTIMIZATION" },
  { label: "ANALYST SUPPORT", val: "PREP TOOLING" },
  { label: "RESOURCE NETWORK", val: "STAFF + VENDORS" },
  { label: "CUSTOM DELIVERY", val: "SCOPED PER ORG" },
  { label: "VALUE FOCUS", val: "LOWER COST / LESS DRAG" },
  { label: "WINRVTE TECH", val: "ESPORTS OPS PARTNER" },
];

export default function Ticker({ invert = false }) {
  const railRef = useRef(null);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    // duplicate content into rail for seamless loop
    const inner = rail.firstElementChild;
    rail.appendChild(inner.cloneNode(true));

    const width = inner.offsetWidth;
    const tween = gsap.to(rail, {
      x: -width,
      duration: invert ? 30 : 38,
      ease: "none",
      repeat: -1,
    });

    // bind speed to scroll velocity — speeds up on forward scroll, slows on reverse
    let lastY = window.scrollY;
    let rafId = 0;
    let settleTimeout;
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        const y = window.scrollY;
        const velo = y - lastY;
        lastY = y;
        const target = 1 + Math.min(Math.abs(velo) / 18, 2.5);
        const dir = velo >= 0 ? 1 : -0.5;
        gsap.to(tween, { timeScale: target * dir, duration: 0.5, overwrite: true });
      });

      clearTimeout(settleTimeout);
      settleTimeout = setTimeout(() => {
        gsap.to(tween, { timeScale: 1, duration: 0.8, overwrite: true });
      }, 180);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      tween.kill();
      window.removeEventListener("scroll", onScroll);
      clearTimeout(settleTimeout);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [invert]);

  return (
    <div className={"ticker" + (invert ? " invert" : "")} aria-hidden="true">
      <div className="ticker-rail" ref={railRef}>
        <div style={{ display: "flex", flexShrink: 0 }}>
          {ITEMS.map((it, i) => (
            <span className="ticker-item" key={i}>
              <span className="ticker-dash">--</span>
              <span className="label">{it.label}</span>
              <span className="val">{it.val}</span>
              <span className="ticker-dash">--</span>
              <span className="ticker-sep" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
