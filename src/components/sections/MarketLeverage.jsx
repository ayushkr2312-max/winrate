import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "../primitives/SplitText";

gsap.registerPlugin(ScrollTrigger);

const POINTS = [
  {
    n: "01",
    tag: "Market Reality",
    title: "The rules changed.",
    body: "The esports winter is over. Speculative capital isn't coming back — investors and partners now demand operational resilience and financial maturity, not hype.",
  },
  {
    n: "02",
    tag: "Burn Rate",
    title: "Lower the overhead.",
    body: "Investors evaluate cash flow and scalability. Automate manual ops, streamline pipelines, and cut bloated payroll — run lean at a fraction of competitor overhead.",
  },
  {
    n: "03",
    tag: "Foundation",
    title: "Systems before scale.",
    body: "Most growing orgs still operate on Discord chaos and scattered sheets. Build the operational backbone before funding or partnership opportunities arrive.",
  },
  {
    n: "04",
    tag: "Execution",
    title: "Run like a business.",
    body: "Stop hunting data like a gaming clan. Install infrastructure that proves you run scalable, high-margin ops — even before you're in the room.",
  },
  {
    n: "05",
    tag: "The Leverage",
    title: "Infrastructure to get funded.",
    body: "You're not buying software. Capital rewards execution over hype — we cut the fat, automate the labor, and organize your data so you pitch like a million-dollar company on a fraction of the budget.",
  },
];

const COMPACT_MQ = "(max-width: 768px)";
const REDUCED_MQ = "(prefers-reduced-motion: reduce)";

export default function MarketLeverage() {
  const rootRef = useRef(null);
  const pinRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const pin = pinRef.current;
    if (!root || !pin) return;

    const rows = gsap.utils.toArray(".ml-row", root);
    const drawers = gsap.utils.toArray(".ml-drawer", root);
    const fills = gsap.utils.toArray(".ml-fill", root);
    const counter = root.querySelector(".mkt-counter-current");
    if (!rows.length) return;

    let activeIdx = -1;

    const activate = (idx) => {
      if (idx === activeIdx) return;
      activeIdx = idx;

      rows.forEach((row, i) => {
        const isActive = i === idx;
        const isPast = i < idx;
        row.classList.toggle("is-active", isActive);
        row.classList.toggle("is-past", isPast);
      });

      drawers.forEach((drawer, i) => {
        const open = i === idx;
        gsap.to(drawer, {
          height: open ? "auto" : 0,
          opacity: open ? 1 : 0,
          duration: 0.42,
          ease: "power2.inOut",
          overwrite: "auto",
        });
      });

      fills.forEach((fill, i) => {
        gsap.to(fill, {
          scaleX: i <= idx ? 1 : 0,
          duration: i === idx ? 0.6 : 0.35,
          ease: i <= idx ? "power2.out" : "power2.in",
          overwrite: "auto",
        });
      });

      if (counter) counter.textContent = String(idx + 1).padStart(2, "0");
    };

    const head = root.querySelector(".mkt-scroll-head");
    const headTag = head?.querySelector(".section-tag");
    const headCounter = head?.querySelector(".mkt-counter");

    const playEntrance = () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      if (headTag) tl.to(headTag, { opacity: 1, y: 0, duration: 0.6 }, 0);
      if (headCounter) tl.to(headCounter, { opacity: 1, duration: 0.5 }, 0.15);
      rows.forEach((row, i) => {
        tl.to(row, { opacity: 1, y: 0, duration: 0.55 }, 0.25 + i * 0.08);
      });
      tl.call(() => activate(0), null, 0.3);
    };

    const resetEntrance = () => {
      if (headTag) gsap.set(headTag, { opacity: 0, y: 12 });
      if (headCounter) gsap.set(headCounter, { opacity: 0 });
      rows.forEach((row) => gsap.set(row, { opacity: 0, y: 20 }));
      activeIdx = -1;
    };

    const ctx = gsap.context(() => {
      const reduced = window.matchMedia(REDUCED_MQ).matches;
      const compact = window.matchMedia(COMPACT_MQ).matches;

      gsap.set(drawers, { height: 0, opacity: 0, overflow: "hidden" });
      gsap.set(fills, { scaleX: 0, transformOrigin: "left center" });

      if (!reduced) {
        if (headTag) gsap.set(headTag, { opacity: 0, y: 12 });
        if (headCounter) gsap.set(headCounter, { opacity: 0 });
        rows.forEach((row) => gsap.set(row, { opacity: 0, y: 20 }));

        ScrollTrigger.create({
          trigger: root,
          start: "top 88%",
          end: "top 88%",
          onEnter: playEntrance,
          onEnterBack: playEntrance,
          onLeaveBack: resetEntrance,
        });
      }

      if (reduced) {
        drawers.forEach((d) => gsap.set(d, { height: "auto", opacity: 1 }));
        fills.forEach((f) => gsap.set(f, { scaleX: 1 }));
        rows.forEach((r) => {
          r.classList.add("is-past");
          gsap.set(r, { opacity: 1, y: 0 });
        });
        rows[rows.length - 1].classList.add("is-active");
        if (headTag) gsap.set(headTag, { opacity: 1, y: 0 });
        if (headCounter) gsap.set(headCounter, { opacity: 1 });
        return;
      }

      if (compact) {
        rows.forEach((row, i) => {
          ScrollTrigger.create({
            trigger: row,
            start: "top 78%",
            end: "bottom 22%",
            onEnter: () => {
              gsap.to(row, { opacity: 1, y: 0, duration: 0.55, ease: "power3.out", overwrite: "auto" });
              activate(i);
            },
            onEnterBack: () => {
              gsap.to(row, { opacity: 1, y: 0, duration: 0.45, ease: "power3.out", overwrite: "auto" });
              activate(i);
            },
          });
        });
        activate(0);
        return;
      }

      // Desktop: pinned accordion — smooth scrub, no snap-back
      let lastScrubIdx = -1;
      const scrollPerStep = () => window.innerHeight * 0.92;

      ScrollTrigger.create({
        trigger: root,
        pin,
        pinSpacing: true,
        start: "top top",
        end: () => `+=${scrollPerStep() * (rows.length - 1)}`,
        scrub: 0.85,
        anticipatePin: 0,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const idx = Math.min(
            rows.length - 1,
            Math.max(0, Math.floor(self.progress * rows.length))
          );
          if (idx !== lastScrubIdx) {
            lastScrubIdx = idx;
            activate(idx);
          }
        },
        onLeave: () => {
          lastScrubIdx = rows.length - 1;
          activate(rows.length - 1);
        },
        onEnterBack: () => {
          lastScrubIdx = -1;
        },
      });
    }, root);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
  }, []);

  return (
    <section className="mkt-scroll" id="leverage" ref={rootRef}>
      <div className="mkt-scroll-pin" ref={pinRef}>
        <div className="mkt-scroll-layout sect-inner">
          <header className="mkt-scroll-head">
            <div className="mkt-scroll-head-left">
              <span className="section-tag">Market Signal · 2026</span>
              <h2 className="mkt-scroll-title">
                <span className="mkt-scroll-line">
                  <SplitText
                    text="CAPITAL REWARDS EXECUTION."
                    splitBy="chars"
                    stagger={0.024}
                    duration={0.95}
                    trigger="top 95%"
                    once
                  />
                </span>
                <span className="mkt-scroll-line mkt-scroll-line--accent">
                  <SplitText
                    text="NOT HYPE."
                    splitBy="chars"
                    stagger={0.03}
                    duration={0.9}
                    delay={0.18}
                    trigger="top 95%"
                    once
                  />
                </span>
              </h2>
            </div>
            <div className="mkt-counter" aria-hidden="true">
              <span className="mkt-counter-current">01</span>
              <span className="mkt-counter-sep">/</span>
              <span className="mkt-counter-total">{String(POINTS.length).padStart(2, "0")}</span>
            </div>
          </header>

          <div className="ml-rows">
            {POINTS.map((p, i) => (
              <div className={`ml-row${i === 0 ? " is-active" : ""}`} key={p.n}>
                <div className="ml-bar">
                  <span className="ml-fill" aria-hidden="true" />
                </div>
                <button type="button" className="ml-header" tabIndex={-1}>
                  <span className="ml-num">{p.n}</span>
                  <span className="ml-rule" aria-hidden="true" />
                  <span className="ml-tag">{p.tag}</span>
                  <span className="ml-icon" aria-hidden="true">
                    <svg viewBox="0 0 12 12" fill="none">
                      <path d="M6 2.5v7M2.5 6h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>
                </button>
                <div className="ml-drawer">
                  <div className="ml-content">
                    <h3 className="ml-title">{p.title}</h3>
                    <p className="ml-body">{p.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
