import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

import { MQ_TABLET } from "@/lib/device";

const LAYOUT_MQ = MQ_TABLET;
const TOUCH_MQ = "(hover: none), (pointer: coarse)";

function isCompactLayout() {
  return window.matchMedia(LAYOUT_MQ).matches;
}

function isTouchDevice() {
  return window.matchMedia(TOUCH_MQ).matches;
}

export default function Hero({ playEntrance }) {
  const heroRef = useRef(null);
  const cueFillRef = useRef(null);

  useEffect(() => {
    if (!playEntrance) return;
    const tl = gsap.timeline({ delay: 0.05 });
    tl.to(".hero-pre", { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" }, 0.08);
    tl.to(".hero-line-a .inner", { y: 0, opacity: 1, duration: 0.9, ease: "expo.out" }, 0.2);
    tl.to(".hero-line-b .inner", { y: 0, opacity: 1, duration: 1.0, ease: "expo.out" }, 0.32);
    tl.to(".hero-line-c .inner", { y: 0, opacity: 1, duration: 1.0, ease: "expo.out" }, 0.44);
    tl.to(".hero-cue", { opacity: 1, duration: 0.6 }, 1.0);
  }, [playEntrance]);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const mobileMql = window.matchMedia(LAYOUT_MQ);
    let scrollTrigger = null;
    let swapped = false;
    let setupScrollSwap = () => {};

    const swapToHover = (mobile) => {
      swapped = true;
      gsap.to(".hero-line-a", {
        scale: mobile ? 1.08 : 2,
        fontWeight: 500,
        duration: mobile ? 0.42 : 0.55,
        ease: "expo.out",
        overwrite: "auto",
      });
      gsap.fromTo(".hero-wins-underline",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: mobile ? 0.7 : 0.9,
          delay: mobile ? 0.08 : 0.15,
          ease: "power2.out",
          overwrite: "auto",
        });

      if (mobile) {
        gsap.to(".hero-swap-default", {
          opacity: 0,
          y: -10,
          duration: 0.42,
          ease: "expo.out",
          overwrite: "auto",
        });
        gsap.to(".hero-swap-hover", {
          opacity: 1,
          y: 0,
          rotationX: 0,
          z: 0,
          scale: 1,
          duration: 0.42,
          ease: "expo.out",
          overwrite: "auto",
        });
        return;
      }

      gsap.to(".hero-swap-default", {
        rotationX: 80,
        z: -400,
        scale: 0.8,
        opacity: 0,
        duration: 0.55,
        ease: "expo.out",
        overwrite: "auto",
      });
      gsap.to(".hero-swap-hover", {
        rotationX: 0,
        z: 0,
        scale: 1,
        opacity: 1,
        duration: 0.55,
        ease: "expo.out",
        overwrite: "auto",
      });
    };

    const swapToDefault = (mobile) => {
      swapped = false;
      gsap.to(".hero-line-a", {
        scale: 1,
        fontWeight: 300,
        duration: mobile ? 0.42 : 0.55,
        ease: "expo.out",
        overwrite: "auto",
      });
      gsap.to(".hero-wins-underline", {
        scaleX: 0,
        duration: 0.3,
        ease: "power2.in",
        overwrite: "auto",
      });

      if (mobile) {
        gsap.to(".hero-swap-default", {
          opacity: 1,
          y: 0,
          duration: 0.42,
          ease: "expo.out",
          overwrite: "auto",
        });
        gsap.to(".hero-swap-hover", {
          opacity: 0,
          y: 8,
          duration: 0.42,
          ease: "expo.out",
          overwrite: "auto",
        });
        return;
      }

      gsap.to(".hero-swap-default", {
        rotationX: 0,
        z: 0,
        scale: 1,
        opacity: 1,
        duration: 0.55,
        ease: "expo.out",
        overwrite: "auto",
      });
      gsap.to(".hero-swap-hover", {
        rotationX: -80,
        z: -400,
        scale: 0.8,
        opacity: 0,
        duration: 0.55,
        ease: "expo.out",
        overwrite: "auto",
      });
    };

    // Desktop scroll-lock state machine
    let lockState = "default"; // default | playing | wins | released
    let cooldownEnd = 0;
    let playingTimer = null;
    let wheelHandler = null;
    let touchHandler = null;
    let touchStartY = 0;

    const clearLockTimers = () => {
      if (playingTimer) { clearTimeout(playingTimer); playingTimer = null; }
    };
    const detachLockHandlers = () => {
      if (wheelHandler) {
        window.removeEventListener("wheel", wheelHandler, { capture: true });
        wheelHandler = null;
      }
      if (touchHandler) {
        window.removeEventListener("touchmove", touchHandler.move, { capture: true });
        window.removeEventListener("touchstart", touchHandler.start, { capture: true });
        touchHandler = null;
      }
    };
    const attachLockHandlers = () => {
      const isAtHeroTop = () => window.scrollY <= 2;
      const swallow = (e) => { e.preventDefault(); e.stopPropagation(); };

      const triggerLock = () => {
        lockState = "playing";
        swapToHover(false);
        clearLockTimers();
        playingTimer = setTimeout(() => {
          lockState = "wins";
          cooldownEnd = performance.now() + 190;
          playingTimer = null;
        }, 620);
      };

      const releaseUpward = () => {
        lockState = "default";
        clearLockTimers();
        swapToDefault(false);
      };

      const handleDir = (e, deltaY) => {
        const now = performance.now();
        const atTop = isAtHeroTop();

        if (deltaY > 0) {
          if (lockState === "default" && atTop) {
            swallow(e);
            triggerLock();
            return;
          }
          if (lockState === "playing") { swallow(e); return; }
          if (lockState === "wins") {
            if (now < cooldownEnd) { swallow(e); return; }
            lockState = "released";
            // event passes through to Lenis/native scroll
          }
          return;
        }
        if (deltaY < 0) {
          if (atTop && (lockState === "wins" || lockState === "released")) {
            swallow(e);
            releaseUpward();
          }
        }
      };

      wheelHandler = (e) => handleDir(e, e.deltaY ?? 0);
      window.addEventListener("wheel", wheelHandler, { passive: false, capture: true });

      touchHandler = {
        start: (e) => { touchStartY = e.touches?.[0]?.clientY ?? 0; },
        move: (e) => {
          const y = e.touches?.[0]?.clientY ?? 0;
          // touch deltaY: positive when finger moves UP (page scrolls down)
          const deltaY = touchStartY - y;
          handleDir(e, deltaY);
        },
      };
      window.addEventListener("touchstart", touchHandler.start, { passive: false, capture: true });
      window.addEventListener("touchmove", touchHandler.move, { passive: false, capture: true });
    };

    const ctx = gsap.context(() => {
      setupScrollSwap = () => {
        scrollTrigger?.kill();
        detachLockHandlers();
        clearLockTimers();
        swapped = false;
        lockState = "default";

        const mobile = isCompactLayout();
        gsap.set(".hero-swap-hover", mobile
          ? { opacity: 0, y: 8, rotationX: 0, z: 0, scale: 1 }
          : { rotationX: -80, z: -400, scale: 0.8, opacity: 0, y: 0 });
        gsap.set(".hero-swap-default", { opacity: 1, y: 0, rotationX: 0, z: 0, scale: 1 });
        gsap.set(".hero-line-a", { scale: 1, fontWeight: 300 });
        gsap.set(".hero-wins-underline", { scaleX: 0, transformOrigin: "0% 50%" });

        if (mobile) {
          // Mobile: keep the existing scroll-driven swap (no hard lock).
          scrollTrigger = ScrollTrigger.create({
            trigger: hero,
            start: "top top",
            end: "bottom top",
            pin: false,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const threshold = 0.04;
              if (self.progress > threshold && !swapped) { swapped = true; swapToHover(true); }
              else if (self.progress <= threshold && swapped) { swapped = false; swapToDefault(true); }
            },
          });
        } else {
          // Desktop: scroll is fully locked until the swap finishes + a fresh down-scroll.
          attachLockHandlers();
        }
      };

      setupScrollSwap();
      mobileMql.addEventListener("change", setupScrollSwap);
    }, heroRef);

    return () => {
      mobileMql.removeEventListener("change", setupScrollSwap);
      scrollTrigger?.kill();
      detachLockHandlers();
      clearLockTimers();
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || isTouchDevice()) return;

    const xTo = gsap.quickTo(".hero-line-b, .hero-line-c", "x", { duration: 1, ease: "power2.out" });
    let rafId = 0;
    let nextX = 0;
    const onMove = (e) => {
      nextX = ((e.clientX / window.innerWidth - 0.5) * 8) * 0.18;
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        xTo(nextX);
      });
    };
    hero.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      hero.removeEventListener("mousemove", onMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    let rafId = 0;
    let lastPct = -1;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max <= 0 ? 0 : Math.min(1, Math.max(0, window.scrollY / max));
      const roundedPct = Math.round(pct * 1000) / 10;
      if (roundedPct === lastPct) return;
      lastPct = roundedPct;
      if (cueFillRef.current) cueFillRef.current.style.height = `${roundedPct}%`;
    };
    const requestOnScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        onScroll();
      });
    };

    requestOnScroll();
    window.addEventListener("scroll", requestOnScroll, { passive: true });
    window.addEventListener("resize", requestOnScroll);
    return () => {
      window.removeEventListener("scroll", requestOnScroll);
      window.removeEventListener("resize", requestOnScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section className="hero" id="hero" ref={heroRef}>
      <div className="hero-grid" aria-hidden="true" />

      <div className="hero-left">
        <div className="hero-pre">
          <span className="pulse" />
          <span className="hero-pre-main">Esports Operations + Systems Agency</span>
          <span className="pipe" aria-hidden="true">/</span>
          <span className="hero-pre-sub">Custom-Built For Growing Orgs</span>
        </div>

        <div className="hero-title">
          <span className="hero-line-a"><span className="inner">THE TECH</span></span>
          <div className="hero-swap-wrap">
            <div className="hero-swap-default">
              <span className="hero-line-b"><span className="inner">YOUR ORG</span></span>
              <span className="hero-line-c"><span className="inner">DESERVES.</span></span>
            </div>
            <div className="hero-swap-hover" aria-hidden="true">
              <span className="hero-line-hover">THAT <span className="lime-text">WINS.<span className="hero-wins-underline" aria-hidden="true" /></span></span>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-right" />

      <div className="hero-cue" style={{ opacity: 0 }} aria-hidden="true">
        <div className="hero-cue-track">
          <div className="hero-cue-fill" ref={cueFillRef} />
        </div>
        <span className="hero-cue-txt">Scroll</span>
      </div>
    </section>
  );
}
