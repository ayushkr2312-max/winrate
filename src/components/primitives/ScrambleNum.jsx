import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * ScrambleNum — animates from 0 to `target` with a brief glyph-scramble pre-roll
 * so it doesn't read like every other count-up animation.
 */
export default function ScrambleNum({ target, suffix = "", decimals = 0, duration = 2.1, className = "", trigger = "top 82%" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const GLYPHS = "0123456789▮▯▰▱";
    let scrIv = null;
    let timeoutId = null;
    let tween = null;

    const play = () => {
      if (scrIv) clearInterval(scrIv);
      if (timeoutId) clearTimeout(timeoutId);
      if (tween) { tween.kill(); tween = null; }

      const len = String(target).length + suffix.length + (decimals > 0 ? decimals + 1 : 0);
      let elapsed = 0;
      scrIv = setInterval(() => {
        elapsed += 32;
        let s = "";
        for (let i = 0; i < len; i++) s += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        el.textContent = s;
        if (elapsed >= 380) { clearInterval(scrIv); scrIv = null; }
      }, 32);

      timeoutId = setTimeout(() => {
        const obj = { v: 0 };
        tween = gsap.to(obj, {
          v: target,
          duration,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = (decimals > 0 ? obj.v.toFixed(decimals) : Math.floor(obj.v)) + suffix;
          },
          onComplete: () => {
            el.textContent = (decimals > 0 ? target.toFixed(decimals) : target) + suffix;
            tween = null;
          },
        });
        timeoutId = null;
      }, 420);
    };

    const reset = () => {
      if (scrIv) { clearInterval(scrIv); scrIv = null; }
      if (timeoutId) { clearTimeout(timeoutId); timeoutId = null; }
      if (tween) { tween.kill(); tween = null; }
      el.textContent = "0" + suffix;
    };

    const st = ScrollTrigger.create({
      trigger: el,
      start: trigger,
      end: "bottom 20%",
      onEnter: play,
      onEnterBack: play,
      onLeave: reset,
      onLeaveBack: reset,
    });

    return () => {
      st.kill();
      if (scrIv) clearInterval(scrIv);
      if (timeoutId) clearTimeout(timeoutId);
      if (tween) tween.kill();
    };
  }, [target, suffix, decimals, duration, trigger]);

  return <span ref={ref} className={className}>0{suffix}</span>;
}
