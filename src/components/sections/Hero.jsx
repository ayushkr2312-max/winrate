import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Hero({ playEntrance }) {
  const heroRef = useRef(null);
  const cueFillRef = useRef(null);

  useEffect(() => {
    if (!playEntrance) return;
    const tl = gsap.timeline({ delay: 0.05 });
    tl.to('.hero-line-a .inner', { y: 0, opacity: 1, duration: 0.9, ease: "expo.out" }, 0.2);
    tl.to('.hero-line-b .inner', { y: 0, opacity: 1, duration: 1.0, ease: "expo.out" }, 0.32);
    tl.to('.hero-line-c .inner', { y: 0, opacity: 1, duration: 1.0, ease: "expo.out" }, 0.44);
    tl.to('.hero-cue',  { opacity: 1, duration: 0.6 }, 1.0);
    tl.to('.hero-foot', { opacity: 1, y: 0, duration: 0.6 }, 1.0);
  }, [playEntrance]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.hero-swap-hover', { rotationX: -80, z: -400, scale: 0.8, opacity: 0 });

      let swapped = false;
      ScrollTrigger.create({
        trigger:   heroRef.current,
        start:     'top top',
        end:       '+=120',
        pin:       true,
        onUpdate: (self) => {
          if (self.progress > 0.15 && !swapped) {
            swapped = true;
            gsap.to('.hero-line-a',        { scale: 2, fontWeight: 500, duration: 0.55, ease: 'expo.out', overwrite: 'auto' });
            gsap.to('.hero-swap-default',  { rotationX: 80,  z: -400, scale: 0.8, opacity: 0, duration: 0.55, ease: 'expo.out', overwrite: 'auto' });
            gsap.to('.hero-swap-hover',    { rotationX: 0,   z: 0,    scale: 1,   opacity: 1, duration: 0.55, ease: 'expo.out', overwrite: 'auto' });
          } else if (self.progress <= 0.15 && swapped) {
            swapped = false;
            gsap.to('.hero-line-a',        { scale: 1, fontWeight: 300, duration: 0.55, ease: 'expo.out', overwrite: 'auto' });
            gsap.to('.hero-swap-default',  { rotationX: 0,   z: 0,    scale: 1,   opacity: 1, duration: 0.55, ease: 'expo.out', overwrite: 'auto' });
            gsap.to('.hero-swap-hover',    { rotationX: -80, z: -400, scale: 0.8, opacity: 0, duration: 0.55, ease: 'expo.out', overwrite: 'auto' });
          }
        },
      });

      gsap.to('.ops-card', {
        y: -50,
        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 1.6 },
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const onMove = (e) => {
      const rx = (e.clientX / window.innerWidth  - 0.5) * 8;
      const ry = (e.clientY / window.innerHeight - 0.5) * 5;

      gsap.to(".hero-line-b, .hero-line-c", { x: rx * 0.18, duration: 1, ease: "power2.out" });
    };
    hero.addEventListener("mousemove", onMove);
    return () => hero.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max <= 0 ? 0 : Math.min(1, Math.max(0, window.scrollY / max));
      if (cueFillRef.current) cueFillRef.current.style.height = `${pct * 100}%`;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="hero" id="hero" ref={heroRef}>
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-watermark" aria-hidden="true">WINRVTE</div>

      <div className="hero-left">
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

      <div className="hero-foot" style={{ opacity: 0, transform: "translateY(12px)" }}>
        <div className="right">
          <span className="tz"><span className="city">LA</span>02:14</span>
          <span className="tz"><span className="city">BLN</span>11:14</span>
          <span className="tz"><span className="city">SEL</span>19:14</span>
        </div>
      </div>
    </section>
  );
}
