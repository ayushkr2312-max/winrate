import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import SplitText from "../primitives/SplitText";

const HOLD_MS = 1000;
/** Time for DIFFERENT char reveal (delay + duration + stagger tail) */
const ENTRANCE_MS = 1500;

function AccentChars({ text }) {
  const tokens = String(text).split(/(\s+)/);
  let key = 0;
  return (
    <span className="st" aria-hidden="true">
      {tokens.map((tok) => {
        if (!tok) return null;
        if (/^\s+$/.test(tok)) {
          return (
            <span key={`s-${key++}`} className="st-space">
              {tok}
            </span>
          );
        }
        return (
          <span key={`w-${key++}`} className="st-word">
            {Array.from(tok).map((char, i) => (
              <span key={i} className="st-wrap">
                <span className="st-unit">{char}</span>
              </span>
            ))}
          </span>
        );
      })}
    </span>
  );
}

function crossfadePhrase(showWins, diffUnits, winsUnits) {
  const tl = gsap.timeline();

  if (showWins) {
    tl.to(diffUnits, {
      yPercent: -92,
      opacity: 0,
      duration: 0.48,
      stagger: 0.012,
      ease: "power2.in",
    }).fromTo(
      winsUnits,
      { yPercent: 110, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.88,
        stagger: 0.022,
        ease: "expo.out",
      },
      "-=0.12",
    );
  } else {
    tl.to(winsUnits, {
      yPercent: -92,
      opacity: 0,
      duration: 0.48,
      stagger: 0.012,
      ease: "power2.in",
    }).fromTo(
      diffUnits,
      { yPercent: 110, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.88,
        stagger: 0.022,
        ease: "expo.out",
      },
      "-=0.12",
    );
  }

  return tl;
}

export default function ContactAccentSwap() {
  const rootRef = useRef(null);
  const differentRef = useRef(null);
  const winsRef = useRef(null);
  const loopTimerRef = useRef(null);
  const swapTweenRef = useRef(null);
  const loopActiveRef = useRef(false);
  const showingWinsRef = useRef(false);
  const [cycleKey, setCycleKey] = useState(0);
  const [swapped, setSwapped] = useState(false);

  const hideWins = useCallback(() => {
    const units = winsRef.current?.querySelectorAll(".st-unit");
    if (!units?.length) return;
    gsap.set(units, { yPercent: 110, opacity: 0 });
  }, []);

  const getUnits = useCallback(() => {
    const diffUnits = differentRef.current?.querySelectorAll(".st-unit");
    const winsUnits = winsRef.current?.querySelectorAll(".st-unit");
    if (!diffUnits?.length || !winsUnits?.length) return null;
    return { diffUnits, winsUnits };
  }, []);

  const runSwap = useCallback(async (showWins) => {
    const units = getUnits();
    if (!units || !loopActiveRef.current) return;

    swapTweenRef.current?.kill();
    const tl = crossfadePhrase(showWins, units.diffUnits, units.winsUnits);
    swapTweenRef.current = tl;
    await tl;
    if (!loopActiveRef.current) return;
    showingWinsRef.current = showWins;
    setSwapped(showWins);
  }, [getUnits]);

  const scheduleNextSwap = useCallback(() => {
    if (!loopActiveRef.current) return;
    loopTimerRef.current = window.setTimeout(async () => {
      loopTimerRef.current = null;
      if (!loopActiveRef.current) return;
      await runSwap(!showingWinsRef.current);
      scheduleNextSwap();
    }, HOLD_MS);
  }, [runSwap]);

  const startLoop = useCallback(() => {
    if (loopActiveRef.current) return;
    loopActiveRef.current = true;
    showingWinsRef.current = false;
    setSwapped(false);

    loopTimerRef.current = window.setTimeout(async () => {
      loopTimerRef.current = null;
      if (!loopActiveRef.current) return;
      await runSwap(true);
      scheduleNextSwap();
    }, ENTRANCE_MS + HOLD_MS);
  }, [runSwap, scheduleNextSwap]);

  const stopLoop = useCallback(() => {
    loopActiveRef.current = false;
    if (loopTimerRef.current) {
      clearTimeout(loopTimerRef.current);
      loopTimerRef.current = null;
    }
    swapTweenRef.current?.kill();
    swapTweenRef.current = null;
    showingWinsRef.current = false;
    setSwapped(false);
    hideWins();
    setCycleKey((k) => k + 1);
  }, [hideWins]);

  useEffect(() => {
    hideWins();
  }, [hideWins, cycleKey]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startLoop();
        } else {
          stopLoop();
        }
      },
      { threshold: 0.28, rootMargin: "0px 0px -8% 0px" },
    );

    io.observe(root);
    return () => {
      io.disconnect();
      stopLoop();
    };
  }, [startLoop, stopLoop]);

  return (
    <span className="contact-line accent contact-accent-swap" ref={rootRef}>
      <span className="contact-accent-slot" ref={differentRef} aria-hidden={swapped}>
        <SplitText
          key={cycleKey}
          text="DIFFERENT"
          splitBy="chars"
          stagger={0.024}
          duration={1.0}
          delay={0.36}
          once
          trigger="top 82%"
        />
      </span>
      <span
        className="contact-accent-slot contact-accent-slot--wins"
        ref={winsRef}
        aria-hidden={!swapped}
      >
        <AccentChars text="THAT WINS" />
      </span>
    </span>
  );
}
