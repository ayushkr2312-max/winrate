import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis, isAnchorNavigationActive } from "@/hooks/useLenis";
import { MQ_MOBILE, isMobileViewport } from "@/lib/device";

gsap.registerPlugin(ScrollTrigger);

const SECTIONS = [
  { id: "hero",       label: "Home",        num: "01" },
  { id: "about",      label: "About Us",    num: "02" },
  { id: "problem",    label: "Problems",    num: "03" },
  { id: "solutions",  label: "Solutions",   num: "04" },
  { id: "manifesto",  label: "Manifesto",   num: "05" },
  { id: "contact",    label: "Contact",     num: "06" },
];

const DOCK_BAR_H = 48;
const LOGO_VIDEO = "/luma-dot-bg.webm";

function RailLogo() {
  const videoRef = useRef(null);
  const playPromiseRef = useRef(null);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const sync = () => setMobile(isMobileViewport());
    sync();
    const mq = window.matchMedia(MQ_MOBILE);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const seekToEnd = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (!Number.isFinite(v.duration) || v.duration <= 0) return;
    v.pause();
    v.currentTime = Math.max(0, v.duration - 0.04);
  }, []);

  const parkAtEnd = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (Number.isFinite(v.duration) && v.duration > 0) {
      seekToEnd();
      return;
    }
    const onMeta = () => seekToEnd();
    v.addEventListener("loadedmetadata", onMeta, { once: true });
  }, [seekToEnd]);

  useEffect(() => {
    if (mobile) return;
    const v = videoRef.current;
    if (!v) return;

    const onReady = () => parkAtEnd();
    v.addEventListener("loadeddata", onReady);
    v.addEventListener("loadedmetadata", onReady);
    if (v.readyState >= HTMLMediaElement.HAVE_METADATA) onReady();
    v.load();

    return () => {
      v.removeEventListener("loadeddata", onReady);
      v.removeEventListener("loadedmetadata", onReady);
    };
  }, [mobile, parkAtEnd]);

  const handleEnter = () => {
    const v = videoRef.current;
    if (!v) return;
    const play = () => {
      v.currentTime = 0;
      const result = v.play();
      playPromiseRef.current =
        result && typeof result.then === "function" ? result : null;
    };
    if (v.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      play();
    } else {
      v.addEventListener("canplay", play, { once: true });
    }
  };

  const handleLeave = () => {
    const v = videoRef.current;
    if (!v) return;
    const finish = () => parkAtEnd();
    const p = playPromiseRef.current;
    playPromiseRef.current = null;
    if (p && typeof p.then === "function") {
      p.then(finish).catch(finish);
    } else {
      v.pause();
      finish();
    }
  };

  const handleEnded = () => {
    parkAtEnd();
    playPromiseRef.current = null;
  };

  if (mobile) {
    return (
      <a
        href="#hero"
        className="rail-logo rail-logo--static"
        data-cursor-label="HOME"
        aria-label="WINRVTE Home"
      >
        <span className="rail-logo-mark" aria-hidden="true">W</span>
      </a>
    );
  }

  return (
    <a
      href="#hero"
      className="rail-logo"
      data-cursor-label="HOME"
      aria-label="WINRVTE Home"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <video
        ref={videoRef}
        className="rail-logo-video"
        src={LOGO_VIDEO}
        muted
        playsInline
        preload="metadata"
        onLoadedData={parkAtEnd}
        onLoadedMetadata={parkAtEnd}
        onEnded={handleEnded}
      />
    </a>
  );
}

function scrollAboutIntoDockView() {
  if (isAnchorNavigationActive()) return;

  const about = document.getElementById("about");
  if (!about) return;

  const rect = about.getBoundingClientRect();
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuHover, setMenuHover] = useState(false);
  const eqRef = useRef(null);
  const sweepRef = useRef(null);
  const flashRef = useRef(null);
  const sweepTlRef = useRef(null);
  const dockedRef = useRef(false);
  const lockRef = useRef(false);
  const menuRef = useRef(null);
  const lastScrollYRef = useRef(0);

  const activeSection = SECTIONS.find((s) => s.id === active) ?? SECTIONS[0];
  const menuVisible = menuOpen || menuHover;

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
        // Force active section to refresh now that the scroll lock has lifted.
        let cur = "hero";
        const half = window.innerHeight / 2;
        for (const s of SECTIONS) {
          const el = document.getElementById(s.id);
          if (!el) continue;
          if (el.getBoundingClientRect().top - half <= 0) cur = s.id;
        }
        setActive(cur);
        if (toDocked) {
          requestAnimationFrame(() => {
            requestAnimationFrame(scrollAboutIntoDockView);
          });
        }
      },
    });

    if (toDocked) {
      const flash = flashRef.current;
      tl.set(sw, { scaleX: 0, opacity: 1, transformOrigin: "left center" })
        .set(flash, { opacity: 0, scale: 0.9 })
        .to(sw, { scaleX: 1, duration: 0.42, ease: "power4.inOut" })
        .to(flash, { opacity: 1, scale: 1, duration: 0.22, ease: "power2.out" }, "-=0.18")
        .add(() => {
          setDocked(true);
          dockedRef.current = true;
          document.documentElement.style.setProperty("--rail", "0px");
          requestAnimationFrame(scrollAboutIntoDockView);
        })
        .to({}, { duration: 0.42 })
        .to(flash, { opacity: 0, duration: 0.2, ease: "power2.in" })
        .to(sw, { opacity: 0, duration: 0.32, ease: "power2.out" }, "<")
        .set(sw, { scaleX: 0, opacity: 1 })
        .set(flash, { opacity: 0, scale: 0.9 });
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
          if (isAnchorNavigationActive()) {
            setDocked(true);
            dockedRef.current = true;
            document.documentElement.style.setProperty("--rail", "0px");
          } else {
            runSweep(true);
          }
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

  const handleNavClick = useCallback((e, id) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
    e.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;

    const rootStyle = getComputedStyle(document.documentElement);
    const dockH = parseFloat(rootStyle.getPropertyValue("--dock-bar-h")) || 48;
    const margin = 24;

    let y = 0;
    if (id !== "hero") {
      const cs = getComputedStyle(target);
      const paddingTop = parseFloat(cs.paddingTop) || 0;
      const rectTop = target.getBoundingClientRect().top + window.scrollY;
      y = Math.max(0, rectTop + paddingTop - dockH - margin);
    }

    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(y, { lock: false, force: true, duration: 1.05 });
    } else {
      window.scrollTo({ top: y, behavior: "smooth" });
    }

    if (history.replaceState) history.replaceState(null, "", `#${id}`);
    closeMenu();
  }, [closeMenu]);

  const isInverted = ["manifesto"].includes(active);

  const cls = [
    "rail",
    active === "hero" && !docked && "is-on-hero",
    isInverted && !docked && "is-inverted",
    docked && "is-docked",
    docked && menuVisible && "is-menu-visible",
  ].filter(Boolean).join(" ");

  return (
    <>
      <div className="rail-sweep" ref={sweepRef} aria-hidden="true" />
      <div className="rail-sweep-flash" ref={flashRef} aria-hidden="true">
        <div className="rail-sweep-mark">
          <span className="rail-sweep-mark-win">WIN</span>
          <span className="rail-sweep-mark-rvte">RVTE</span>
        </div>
        <div className="rail-sweep-section">ABOUT US</div>
      </div>
      <nav
        className={cls}
        aria-label="Primary"
        onMouseEnter={() => { if (docked) setMenuHover(true); }}
        onMouseLeave={() => { if (docked) setMenuHover(false); }}
      >
        <RailLogo />

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
              <a href={`#${s.id}`} className="rail-dot" aria-label={s.label} onClick={(e) => handleNavClick(e, s.id)} />
              <a href={`#${s.id}`} className="rail-label" onClick={(e) => handleNavClick(e, s.id)}>{s.label}</a>
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
                      onClick={(e) => handleNavClick(e, s.id)}
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
            <div className="rail-dock-status">
              <span className="rail-dock-right-k">Section</span>
              <span className="rail-dock-right-v">{activeSection.label}</span>
            </div>
            <a href="#contact" className="rail-dock-cta" onClick={closeMenu}>
              Contact
            </a>
          </div>
        ) : (
          <div className="rail-foot">
            <div className="rail-foot-live" aria-hidden="true">
              <span className="rail-foot-live-text">Live</span>
              <span className="rail-foot-live-dot" />
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
