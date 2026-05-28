import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * SplitText — text splitter that pairs with GSAP ScrollTrigger for
 * buttery-smooth, on-scroll character reveal animations.
 *
 * Layout
 *   • Tokens are grouped by WORD so the browser never breaks a line mid-word.
 *     Each word is an inline-block with `white-space: nowrap`. Inside, each
 *     character is wrapped in its own mask so the per-letter slide-up works.
 *
 * Reveal
 *   • A single paused `gsap.fromTo` tween is created in useLayoutEffect.
 *     immediateRender: true (the default) applies the hidden `from` state
 *     synchronously before the browser paints — no FOUC, no CSS dependency.
 *   • play() is invoked by whichever fires first: ScrollTrigger onEnter or
 *     an IntersectionObserver fallback. A playedRef guard prevents double-play.
 */
export default function SplitText({
  text,
  as: Tag = "span",
  className = "",
  splitBy = "chars",
  stagger,
  duration = 1.0,
  ease = "expo.out",
  y = 110,
  trigger = "top 85%",
  delay = 0,
  once = true,
  active = true,
}) {
  const ref = useRef(null);
  const tweenRef = useRef(null);
  const playedRef = useRef(false);

  // Group tokens by word so each word stays unbreakable. Spaces sit between
  // word groups so the layout still flows like a normal paragraph.
  const groups = useMemo(() => {
    if (!text) return [];
    const segments = String(text).split(/(\s+)/);
    const out = [];
    let key = 0;
    for (const seg of segments) {
      if (!seg) continue;
      if (/\s+/.test(seg)) {
        out.push({ kind: "space", value: seg, key: `s-${key++}` });
        continue;
      }
      if (splitBy === "words") {
        out.push({
          kind: "word",
          key: `w-${key++}`,
          chars: [{ char: seg, key: 0 }],
        });
      } else {
        out.push({
          kind: "word",
          key: `w-${key++}`,
          chars: Array.from(seg).map((char, i) => ({ char, key: i })),
        });
      }
    }
    return out;
  }, [text, splitBy]);

  // Total number of animated units — used as a dep so the effect re-runs if
  // the text changes length.
  const unitCount = useMemo(
    () => groups.reduce((n, g) => n + (g.chars ? g.chars.length : 0), 0),
    [groups],
  );

  // Build the paused tween BEFORE paint. immediateRender commits the hidden
  // `from` state synchronously, so the first frame the user ever sees is
  // already in the masked-out position.
  useIsoLayoutEffect(() => {
    if (!active) return;
    const el = ref.current;
    if (!el) return;
    const units = el.querySelectorAll(".st-unit");
    if (units.length === 0) return;

    // Clean up any prior tween (StrictMode double-invoke, prop change, etc.)
    if (tweenRef.current) {
      tweenRef.current.kill();
      tweenRef.current = null;
    }
    playedRef.current = false;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce), (max-width: 768px)").matches;
    if (prefersReduced) {
      gsap.set(units, { yPercent: 0, opacity: 1 });
      playedRef.current = true;
      return;
    }

    const computedStagger = stagger ?? (splitBy === "chars" ? 0.018 : 0.06);

    tweenRef.current = gsap.fromTo(
      units,
      { yPercent: y, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration,
        ease,
        stagger: computedStagger,
        delay,
        paused: true,
      },
    );

    return () => {
      if (tweenRef.current) {
        tweenRef.current.kill();
        tweenRef.current = null;
      }
    };
  }, [active, y, splitBy, stagger, duration, ease, delay, unitCount]);

  useEffect(() => {
    if (!active) return;
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce), (max-width: 768px)").matches) return;

    if (once) {
      const play = () => {
        if (playedRef.current) return;
        if (!tweenRef.current) return;
        playedRef.current = true;
        tweenRef.current.play(0);
      };
      const st = ScrollTrigger.create({
        trigger: el,
        start: trigger,
        once: true,
        onEnter: play,
      });
      return () => st.kill();
    }

    const play = () => tweenRef.current?.restart();
    const reset = () => tweenRef.current?.progress(0).pause();

    const st = ScrollTrigger.create({
      trigger: el,
      start: trigger,
      end: "bottom 20%",
      onEnter: play,
      onEnterBack: play,
      onLeave: reset,
      onLeaveBack: reset,
    });

    return () => st.kill();
  }, [active, trigger, once]);

  return (
    <Tag ref={ref} className={`st ${className}`} aria-label={text}>
      {groups.map((g) => {
        if (g.kind === "space") {
          return (
            <span key={g.key} className="st-space" aria-hidden="true">
              {g.value}
            </span>
          );
        }
        return (
          <span key={g.key} className="st-word" aria-hidden="true">
            {g.chars.map((c) => (
              <span key={c.key} className="st-wrap">
                <span className="st-unit">{c.char}</span>
              </span>
            ))}
          </span>
        );
      })}
    </Tag>
  );
}
