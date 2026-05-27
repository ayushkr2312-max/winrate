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

    const ctx = gsap.context(() => {
      setupScrollSwap = () => {
        scrollTrigger?.kill();
        swapped = false;

        const mobile = isCompactLayout();
        gsap.set(".hero-swap-hover", mobile
          ? { opacity: 0, y: 8, rotationX: 0, z: 0, scale: 1 }
          : { rotationX: -80, z: -400, scale: 0.8, opacity: 0, y: 0 });
        gsap.set(".hero-swap-default", { opacity: 1, y: 0, rotationX: 0, z: 0, scale: 1 });
        gsap.set(".hero-line-a", { scale: 1, fontWeight: 300 });

        scrollTrigger = ScrollTrigger.create({
          trigger: hero,
          start: "top top",
          end: mobile ? "bottom top" : "+=120",
          pin: !mobile,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const threshold = mobile ? 0.04 : 0.15;
            if (self.progress > threshold && !swapped) swapToHover(mobile);
            else if (self.progress <= threshold && swapped) swapToDefault(mobile);
          },
        });
      };

      setupScrollSwap();
      mobileMql.addEventListener("change", setupScrollSwap);
    }, heroRef);

    return () => {
      mobileMql.removeEventListener("change", setupScrollSwap);
      scrollTrigger?.kill();
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
              <span className="hero-line-hover">THAT <span className="lime-text">WINS.</span></span>
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
