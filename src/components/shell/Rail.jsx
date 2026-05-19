import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis } from "@/hooks/useLenis";

gsap.registerPlugin(ScrollTrigger);

const SECTIONS = [
  { id: "hero", label: "Index", num: "01" },
  { id: "problem", label: "Problems", num: "02" },
  { id: "solutions", label: "Solutions", num: "03" },
  { id: "stats", label: "Outcomes", num: "04" },
  { id: "what-we-do", label: "Why Winrvte", num: "05" },
  { id: "manifesto", label: "About", num: "06" },
  { id: "contact", label: "Contact", num: "07" },
];

function pad(n) { return String(n).padStart(2, "0"); }

const DOCK_BAR_H = 42;

function scrollProblemIntoDockView() {
  const problem = document.getElementById("problem");
  if (!problem) return;

  const rect = problem.getBoundingClientRect();
  const y = window.scrollY + rect.top - DOCK_BAR_H;

  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(y, { immediate: true, lock: true, force: true });
  } else {
    window.scrollTo(0, y);
  }
}

export default function Rail() {
  const [active, setActive] = useState("hero");
  const [docked, setDocked] = useState(false);
  const [clock, setClock] = useState("00:00 UTC");
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuHover, setMenuHover] = useState(false);
  const eqRef = useRef(null);
  const sweepRef = useRef(null);
  const sweepTlRef = useRef(null);
  const dockedRef = useRef(false);
  const lockRef = useRef(false);
  const menuRef = useRef(null);
  const lastScrollYRef = useRef(0);

  const activeSection = SECTIONS.find((s) => s.id === active) ?? SECTIONS[0];
  const menuVisible = menuOpen || menuHover;

  useEffect(() => {
    const upd = () => {
      const d = new Date();
      const utc = new Date(d.getTime() + d.getTimezoneOffset() * 60000);
      setClock(`${pad(utc.getHours())}:${pad(utc.getMinutes())} UTC`);
    };
    upd();
    const iv = setInterval(upd, 1000 * 30);
    return () => clearInterval(iv);
  }, []);

  const runSweep = useCallback((toDocked) => {
    if (lockRef.current) return;
    if (sweepTlRef.current) sweepTlRef.current.kill();
    const sw = sweepRef.current;
    if (!sw) return;
    lockRef.current = true;

    const tl = gsap.timeline({
      onComplete: () => {
        sweepTlRef.current = null;
        lockRef.current = false;
        ScrollTrigger.refresh();
        if (toDocked) {
          requestAnimationFrame(() => {
            requestAnimationFrame(scrollProblemIntoDockView);
          });
        }
      },
    });

    if (toDocked) {
      tl.set(sw, { scaleX: 0, opacity: 1, transformOrigin: "left center" })
        .to(sw, { scaleX: 1, duration: 0.3, ease: "power4.inOut" })
        .add(() => {
          setDocked(true);
          dockedRef.current = true;
          document.documentElement.style.setProperty("--rail", "0px");
          requestAnimationFrame(scrollProblemIntoDockView);
        })
        .to(sw, { opacity: 0, duration: 0.25, ease: "power2.out" })
        .set(sw, { scaleX: 0, opacity: 1 });
    } else {
      const hero = document.getElementById("hero");
      tl.set(sw, { scaleX: 0, opacity: 1, transformOrigin: "right center" })
        .to(sw, { scaleX: 1, duration: 0.3, ease: "power4.inOut" })
        .add(() => {
          setDocked(false);
          dockedRef.current = false;
          document.documentElement.style.setProperty("--rail", "56px");
          if (hero) {
            const lenis = getLenis();
            if (lenis) { lenis.scrollTo(hero, { immediate: true, offset: 0 }); }
            else { window.scrollTo(0, hero.offsetTop); }
          }
        })
        .to(sw, { opacity: 0, duration: 0.25, ease: "power2.out" })
        .set(sw, { scaleX: 0, opacity: 1 });
    }

    sweepTlRef.current = tl;
  }, []);

  useEffect(() => {
    let rafId = 0;
    const sectionEls = SECTIONS.map((s) => ({ id: s.id, el: document.getElementById(s.id) }));
    const heroEl = document.getElementById("hero");
    const eqBars = eqRef.current ? Array.from(eqRef.current.querySelectorAll(".bar")) : [];
    let lastEqKey = "";

    const onScroll = () => {
      if (lockRef.current) return;
      const scrolled = window.scrollY;
      const directionUp = scrolled < lastScrollYRef.current - 1;
      const directionDown = scrolled > lastScrollYRef.current + 1;
      lastScrollYRef.current = scrolled;

      let cur = "hero";
      const half = window.innerHeight / 2;
      for (const s of sectionEls) {
        const el = s.el;
        if (!el) continue;
        if (el.getBoundingClientRect().top - half <= 0) cur = s.id;
      }
      setActive((prev) => (prev === cur ? prev : cur));

      if (heroEl) {
        const heroRect = heroEl.getBoundingClientRect();
        const shouldDock = directionDown && heroRect.top < -200;
        const shouldUndock = dockedRef.current && directionUp && heroRect.top > -120;

        if (shouldDock && !dockedRef.current) {
          runSweep(true);
        } else if (shouldUndock) {
          runSweep(false);
        }
      }

      if (eqBars.length > 0) {
        const scrollBucket = Math.round(scrolled / 2);
        if (String(scrollBucket) === lastEqKey) return;
        lastEqKey = String(scrollBucket);
        eqBars.forEach((b, i) => {
          const phase = (scrolled / 30) + i * 0.6;
          const h = 0.3 + 0.7 * Math.abs(Math.sin(phase));
          b.setAttribute("transform", `scaleY(${h.toFixed(3)})`);
        });
      }
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
  }, [runSweep]);

  useEffect(() => {
    if (!docked) {
      setMenuOpen(false);
      setMenuHover(false);
    }
  }, [docked]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const onPointer = (e) => {
      if (!menuRef.current?.contains(e.target)) setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [menuOpen]);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    setMenuHover(false);
  }, []);

  const isInverted = ["manifesto"].includes(active);

  const cls = [
    "rail",
    isInverted && !docked && "is-inverted",
    docked && "is-docked",
    docked && menuVisible && "is-menu-visible",
  ].filter(Boolean).join(" ");

  return (
    <>
      <div className="rail-sweep" ref={sweepRef} aria-hidden="true" />
      <nav
        className={cls}
        aria-label="Primary"
        onMouseEnter={() => { if (docked) setMenuHover(true); }}
        onMouseLeave={() => { if (docked) setMenuHover(false); }}
      >
        <a href="#hero" className="rail-logo" data-cursor-label="HOME">
          <span className="short">W<span className="a">I</span></span>
          <span className="full">NRVTE</span>
        </a>

        {!docked && (
          <div className="rail-eq" ref={eqRef} aria-hidden="true">
            <svg viewBox="0 0 12 60" preserveAspectRatio="none">
              {Array.from({ length: 5 }).map((_, i) => (
                <rect key={i} className="bar" x={i * 2.4} y="10" width="1.4" height="40" rx="0.7"
                  style={{ transformBox: "fill-box", transformOrigin: "center" }} />
              ))}
            </svg>
          </div>
        )}

        {!docked && (
          <ul className="rail-items">
          {SECTIONS.map((s) => (
            <li key={s.id} className={"rail-item" + (active === s.id ? " is-active" : "")}>
              <a href={`#${s.id}`} className="rail-dot" aria-label={s.label} />
              <a href={`#${s.id}`} className="rail-label">{s.label}</a>
              <span className="rail-num">{s.num}</span>
            </li>
          ))}
          </ul>
        )}

        {docked && (
          <div ref={menuRef} className={"rail-dock-center" + (menuVisible ? " is-open" : "")}>
            <button
              type="button"
              className="rail-center-eq"
              aria-label={menuOpen ? "Close section navigation" : "Open section navigation"}
              aria-expanded={menuVisible}
              aria-controls="rail-dock-panel"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
            <div id="rail-dock-panel" className="rail-dock-panel" role="menu">
              <ul className="rail-dock-list">
                {SECTIONS.map((s) => (
                  <li key={s.id} role="none">
                    <a
                      href={`#${s.id}`}
                      role="menuitem"
                      className={"rail-dock-link" + (active === s.id ? " is-active" : "")}
                      onClick={closeMenu}
                    >
                      <span className="rail-dock-link-num">{s.num}</span>
                      <span className="rail-dock-link-label">{s.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {docked ? (
          <div className="rail-dock-right" aria-live="polite">
            <span className="rail-dock-right-k">Current</span>
            <span className="rail-dock-right-v">{activeSection.label}</span>
          </div>
        ) : (
          <div className="rail-foot">
            <a href="#" className="rail-social" aria-label="X" data-cursor-label="X">
            <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.734l7.726-8.877L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <a href="#" className="rail-social" aria-label="Discord" data-cursor-label="DC">
            <svg viewBox="0 0 24 24"><path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.003.022.015.043.031.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
          </a>
          <a href="#" className="rail-social" aria-label="Instagram" data-cursor-label="IG">
            <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
          </a>
          </div>
        )}
      </nav>
    </>
  );
}
