import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Ticker — replaces generic marquee. Each item is a typed datum
 * (timestamp + region + label + value) so it reads like a real ops feed.
 * Drift speed is bound to scroll velocity (scroll forward → speed up).
 */
const ITEMS = [
  { t: "00:01:14", label: "VAL / NA", val: "412 SCOUTS" },
  { t: "00:02:38", label: "ROSTER PATCH", val: "v2.1.3" },
  { t: "00:04:02", label: "DASHBOARD", val: "132ms p95" },
  { t: "00:05:11", label: "AUTOMATIONS", val: "+18 /day" },
  { t: "00:06:45", label: "EU / MATCHDAY", val: "BO5" },
  { t: "00:08:01", label: "SOCIAL X-POST", val: "IG · X · TT" },
  { t: "00:09:20", label: "WEBHOOK INGEST", val: "1.4k ev" },
  { t: "00:10:55", label: "APAC / SCRIMS", val: "ONLINE" },
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
    let velo = 0;
    const onScroll = () => {
      const y = window.scrollY;
      velo = y - lastY;
      lastY = y;
      const target = 1 + Math.min(Math.abs(velo) / 18, 2.5);
      const dir = velo >= 0 ? 1 : -0.5;
      gsap.to(tween, { timeScale: target * dir, duration: 0.5, overwrite: true });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // settle back to normal
    let settle;
    const onSettle = () => {
      clearTimeout(settle);
      settle = setTimeout(() => gsap.to(tween, { timeScale: 1, duration: 0.8 }), 180);
    };
    window.addEventListener("scroll", onSettle, { passive: true });

    return () => {
      tween.kill();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", onSettle);
      clearTimeout(settle);
    };
  }, [invert]);

  return (
    <div className={"ticker" + (invert ? " invert" : "")} aria-hidden="true">
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
