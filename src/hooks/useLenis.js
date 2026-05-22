import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let _lenis = null;
let _anchorNavUntil = 0;

export function getLenis() {
  return _lenis;
}

export function markAnchorNavigation(durationMs = 2800) {
  _anchorNavUntil = Date.now() + durationMs;
}

export function clearAnchorNavigation() {
  _anchorNavUntil = 0;
}

export function isAnchorNavigationActive() {
  return Date.now() < _anchorNavUntil;
}

const DOCK_BAR_H = 42;

export function useLenis() {
  const ref = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.1,
    });
    _lenis = lenis;
    ref.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // expose scrollTo on anchors
    const onAnchorClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();

      markAnchorNavigation(2800);
      lenis.scrollTo(el, {
        offset: id === "#hero" ? 0 : -DOCK_BAR_H,
        duration: 1.4,
        onComplete: clearAnchorNavigation,
      });
    };
    document.addEventListener("click", onAnchorClick);

    return () => {
      gsap.ticker.remove(raf);
      document.removeEventListener("click", onAnchorClick);
      lenis.destroy();
      _lenis = null;
    };
  }, []);

  return ref;
}
