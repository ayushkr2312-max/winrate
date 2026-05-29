import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedHeading from "../primitives/AnimatedHeading";

gsap.registerPlugin(ScrollTrigger);

const CAPABILITIES = [
  { code: "GRW", label: "Growth Tracking",        desc: "Track roster, revenue, and reach in one place" },
  { code: "SCT", label: "Scouting Systems",       desc: "Searchable pipelines for talent and trials" },
  { code: "DAT", label: "Data Analysis",          desc: "Turn match and ops data into clear decisions" },
  { code: "CST", label: "Cost Cutting",           desc: "Find spend leaks before they scale with headcount" },
  { code: "WFL", label: "Efficient Workflows",    desc: "Cut repetitive handoffs from daily ops" },
  { code: "OPP", label: "Opponent Prep",          desc: "Structured scouting data for faster prep cycles" },
  { code: "DSH", label: "Dashboard Builds",       desc: "One live view for everything leadership needs" },
  { code: "AUT", label: "Workflow Automation",    desc: "Automate tasks your team rebuilds every week" },
  { code: "DSC", label: "Discord Integrations",   desc: "Wire Discord into your ops and approval flows" },
  { code: "BUD", label: "Budget Optimization",    desc: "Stretch limited budget without cutting output" },
  { code: "RST", label: "Roster Management",      desc: "Trials, contracts, and roster moves in one system" },
  { code: "PRF", label: "Performance Metrics",    desc: "Consistent KPIs for players, staff, and teams" },
  { code: "API", label: "Tool Integrations",      desc: "Connect sheets, Notion, APIs, and existing tools" },
  { code: "PRC", label: "Process Design",         desc: "Ops flows built to hold up when stakes are high" },
  { code: "RPT", label: "Custom Reporting",       desc: "Reports shaped for your org — not a template" },
  { code: "TLT", label: "Talent Sourcing",        desc: "Staff, players, and vendors from esports networks" },
  { code: "WEB", label: "Website Development",    desc: "Brand-forward sites that stay current between seasons" },
  { code: "COM", label: "Internal Comms",         desc: "Structured comms that scale past the founding team" },
  { code: "SCL", label: "Scale Infrastructure",   desc: "Systems that grow with your org, not against it" },
];

const PILLARS = [
  { label: "Built in esports", desc: "Not adapted from outside playbooks" },
  { label: "Fully custom", desc: "Scoped to your org, roster, and budget" },
  { label: "Ops-first delivery", desc: "Systems your team runs every day" },
];

function CapabilitiesMarquee({ delay = 0, bentoRef, onPopout }) {
  const marqueeRef = useRef(null);
  const scrollRef = useRef(null);
  const tweenRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [activeIdx, setActiveIdx] = useState(null);
  const paused = activeIdx !== null;
  const loop = [...CAPABILITIES, ...CAPABILITIES];

  const handleItemEnter = (idx, e) => {
    setActiveIdx(idx);
    const marquee = marqueeRef.current;
    const bento = bentoRef?.current;
    const item = e.currentTarget;
    if (!marquee || !bento || !item) return;

    const mRect = marquee.getBoundingClientRect();
    const iRect = item.getBoundingClientRect();
    const bRect = bento.getBoundingClientRect();
    const videoEl = bento.querySelector(".ab-video");
    const gapRight = videoEl?.getBoundingClientRect().left ?? bRect.right;

    const left = mRect.right - bRect.left;
    const width = gapRight - mRect.right;

    onPopout?.({
      idx,
      top: iRect.top - bRect.top + iRect.height / 2,
      left,
      width: Math.max(0, width),
    });
  };

  const handleMarqueeLeave = () => {
    setActiveIdx(null);
    onPopout?.(null);
  };

  useEffect(() => {
    const root = marqueeRef.current;
    const scrollEl = scrollRef.current;
    if (!root || !scrollEl) return;

    gsap.set(scrollEl, { yPercent: 0 });

    const tween = gsap.to(scrollEl, {
      yPercent: -50,
      duration: 22,
      ease: "none",
      repeat: -1,
    });
    tween.pause();
    tweenRef.current = tween;

    const st = ScrollTrigger.create({
      trigger: root,
      start: "top bottom",
      end: "bottom top",
      onEnter: () => setInView(true),
      onLeave: () => setInView(false),
      onEnterBack: () => setInView(true),
      onLeaveBack: () => setInView(false),
    });

    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      setInView(st.isActive);
    });

    return () => {
      tween.kill();
      st.kill();
      tweenRef.current = null;
    };
  }, []);

  useEffect(() => {
    const tween = tweenRef.current;
    if (!tween) return;
    if (inView && !paused) tween.play();
    else tween.pause();
  }, [inView, paused]);

  return (
    <motion.div
      ref={marqueeRef}
      className="ab-box ab-ml ab-marquee"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      onMouseLeave={handleMarqueeLeave}
    >
      <div className="ab-box-tl" aria-hidden="true" />
      <div className="ab-box-br" aria-hidden="true" />

      <div className="ab-mq-head">
        <span className="ab-mq-head-dot" aria-hidden="true" />
        <span className="ab-mq-head-label">WHAT WE DO</span>
        <span className="ab-mq-head-count">{String(CAPABILITIES.length).padStart(2, "0")}</span>
      </div>

      <div className="ab-mq-rail" aria-hidden="true">
        <div className="ab-mq-rail-fill" />
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="ab-mq-rail-tick" style={{ top: `${(i + 1) * 11}%` }} />
        ))}
      </div>

      <div className={"ab-mq-viewport" + (inView ? " is-inview" : "")}>
        <div className="ab-mq-fade ab-mq-fade--top" aria-hidden="true" />
        <div className="ab-mq-fade ab-mq-fade--bot" aria-hidden="true" />

        <div ref={scrollRef} className={"ab-mq-scroll" + (paused ? " is-paused" : "")}>
          {loop.map((item, i) => {
            const idx = i % CAPABILITIES.length;
            const isActive = activeIdx === idx;
            return (
              <div
                key={`${item.code}-${i}`}
                className={"ab-mq-item" + (isActive ? " is-active" : "")}
                onMouseEnter={(e) => handleItemEnter(idx, e)}
                onMouseLeave={(e) => {
                  if (e.relatedTarget?.closest?.(".ab-mq-item")) return;
                  setActiveIdx(null);
                  onPopout?.(null);
                }}
              >
                <span className="ab-mq-bullet" aria-hidden="true" />
                <span className="ab-mq-label">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="ab-mq-foot">
        <span className="ab-mq-foot-hint">Capability stream · scrolls when in view</span>
      </div>
    </motion.div>
  );
}

function TechPanelParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const panel = canvas?.parentElement;
    if (!canvas || !panel) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId = 0;
    let visible = true;
    let t0 = performance.now();

    const particles = Array.from({ length: 32 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.15 + 0.35,
      vx: (Math.random() - 0.5) * 0.00014,
      vy: (Math.random() - 0.5) * 0.0001 - 0.00004,
      a: Math.random() * 0.28 + 0.06,
      pulse: Math.random() * Math.PI * 2,
    }));

    const resize = () => {
      const { width, height } = panel.getBoundingClientRect();
      if (!width || !height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const io = new IntersectionObserver(
      ([entry]) => { visible = entry.isIntersecting; },
      { threshold: 0.05 },
    );
    io.observe(panel);

    const ro = new ResizeObserver(resize);
    ro.observe(panel);
    resize();

    const draw = (now) => {
      rafId = requestAnimationFrame(draw);
      if (!visible) return;

      const w = panel.clientWidth;
      const h = panel.clientHeight;
      if (!w || !h) return;

      const t = (now - t0) * 0.001;
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > 1) p.vx *= -1;
        if (p.y < 0 || p.y > 1) p.vy *= -1;

        const flicker = 0.5 + 0.5 * Math.sin(t * 1.35 + p.pulse);
        const alpha = p.a * flicker;
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(182,255,30,${alpha})`;
        ctx.fill();
      }
    };

    draw(performance.now());

    return () => {
      cancelAnimationFrame(rafId);
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  return <canvas className="ab-tech-panel-particles" aria-hidden="true" ref={canvasRef} />;
}

const HELP_WORDS = ["GROW", "TRACK", "MANAGE", "OPTIMIZE", "SCOUT", "BUILD", "WIN"];

function TechEsportsPanel({ delay = 0 }) {
  const panelRef = useRef(null);
  const textRef = useRef(null);
  const wordARef = useRef(null);
  const wordBRef = useRef(null);
  const sweepRef = useRef(null);

  useEffect(() => {
    const panel = panelRef.current;
    const text = textRef.current;
    const a = wordARef.current;
    const b = wordBRef.current;
    const sweep = sweepRef.current;
    if (!panel || !text || !a || !b || !sweep) return;

    const ctx = gsap.context(() => {
      gsap.set(text, { transformOrigin: "50% 50%" });
      const aText = a.querySelector(".ab-help-word-text");
      const bText = b.querySelector(".ab-help-word-text");
      const getEdges = (wordEl) => ({
        b: wordEl.querySelector(".ab-help-edge--b"),
        r: wordEl.querySelector(".ab-help-edge--r"),
        t: wordEl.querySelector(".ab-help-edge--t"),
        l: wordEl.querySelector(".ab-help-edge--l"),
      });
      const aEdges = getEdges(a);
      const bEdges = getEdges(b);
      aText.textContent = HELP_WORDS[0];
      bText.textContent = HELP_WORDS[1 % HELP_WORDS.length];
      gsap.set(a, { yPercent: 0, opacity: 1 });
      gsap.set(b, { yPercent: 110, opacity: 0 });
      const resetEdges = (edges) => {
        gsap.set([edges.b, edges.t], { scaleX: 0 });
        gsap.set([edges.l, edges.r], { scaleY: 0 });
      };
      resetEdges(aEdges);
      resetEdges(bEdges);

      const tl = gsap.timeline({ repeat: -1, defaults: { ease: "expo.inOut" } });

      // Reset state at the start of every cycle so cross-cycle leftovers
      // (text content, position, edges) don't bleed into the first iteration.
      tl.call(() => {
        aText.textContent = HELP_WORDS[0];
        bText.textContent = HELP_WORDS[1 % HELP_WORDS.length];
        gsap.set(a, { yPercent: 0, opacity: 1 });
        gsap.set(b, { yPercent: 110, opacity: 0 });
        resetEdges(aEdges);
        resetEdges(bEdges);
      });

      let current = a;
      let nextEl = b;

      HELP_WORDS.forEach((_, i) => {
        const visibleWord = HELP_WORDS[i];
        const upcomingIdx = (i + 1) % HELP_WORDS.length;
        const upcomingWord = HELP_WORDS[upcomingIdx];
        const outgoing = current;
        const incoming = nextEl;
        const incomingText = incoming === a ? aText : bText;
        const outgoingEdges = outgoing === a ? aEdges : bEdges;
        const incomingEdges = incoming === a ? aEdges : bEdges;

        // Reset outgoing's edges at the start of its on-screen hold
        tl.set([outgoingEdges.b, outgoingEdges.t], { scaleX: 0 });
        tl.set([outgoingEdges.l, outgoingEdges.r], { scaleY: 0 });

        if (visibleWord === "WIN") {
          // WIN gets ~2x the on-screen time (1.8s): trace box around text, then hold.
          const seg = 0.32;
          tl.to(outgoingEdges.b, { scaleX: 1, duration: seg, ease: "power2.out" });
          tl.to(outgoingEdges.r, { scaleY: 1, duration: seg, ease: "power2.out" });
          tl.to(outgoingEdges.t, { scaleX: 1, duration: seg, ease: "power2.out" });
          tl.to(outgoingEdges.l, { scaleY: 1, duration: seg, ease: "power2.out" });
          tl.to({}, { duration: 0.52 });

          // Lime sweep bottom→top across the panel, then swap to GROW underneath, fade out.
          tl.set(sweep, { scaleX: 1, scaleY: 0, opacity: 1, transformOrigin: "center bottom" });
          tl.to(sweep, { scaleY: 1, duration: 0.32, ease: "power4.inOut" });
          tl.call(() => {
            incomingText.textContent = upcomingWord;
            gsap.set(outgoing, { yPercent: -110, opacity: 0 });
            gsap.set([outgoingEdges.b, outgoingEdges.t], { scaleX: 0 });
            gsap.set([outgoingEdges.l, outgoingEdges.r], { scaleY: 0 });
            gsap.set(incoming, { yPercent: 0, opacity: 1 });
            gsap.set([incomingEdges.b, incomingEdges.t], { scaleX: 0 });
            gsap.set([incomingEdges.l, incomingEdges.r], { scaleY: 0 });
          });
          tl.to(sweep, { opacity: 0, duration: 0.28, ease: "power2.out" });
          tl.set(sweep, { scaleY: 0, opacity: 1, transformOrigin: "center bottom" });
        } else {
          // Quick 0.35s underline draw, then hold the remaining 0.55s (0.9s total)
          tl.to(outgoingEdges.b, { scaleX: 1, duration: 0.35, ease: "power3.out" });
          tl.to({}, { duration: 0.55 });

          // Prepare incoming with next word, off-screen below, edges reset
          tl.call(() => {
            incomingText.textContent = upcomingWord;
            gsap.set(incoming, { yPercent: 110, opacity: 0 });
            gsap.set([incomingEdges.b, incomingEdges.t], { scaleX: 0 });
            gsap.set([incomingEdges.l, incomingEdges.r], { scaleY: 0 });
          });

          // 0.6s smooth push: outgoing slides up & out, incoming slides up into place
          tl.fromTo(outgoing,
            { yPercent: 0, opacity: 1 },
            { yPercent: -110, opacity: 0, duration: 0.6, immediateRender: false },
            ">");
          tl.fromTo(incoming,
            { yPercent: 110, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.6, immediateRender: false },
            "<");
        }

        current = incoming;
        nextEl = outgoing;
      });

      tl.pause();

      const st = ScrollTrigger.create({
        trigger: panel,
        start: "top bottom",
        end: "bottom top",
        onEnter: () => tl.play(),
        onLeave: () => tl.pause(),
        onEnterBack: () => tl.play(),
        onLeaveBack: () => tl.pause(),
      });

      requestAnimationFrame(() => {
        if (st.isActive) tl.play();
      });
    }, panel);

    return () => ctx.revert();
  }, []);

  return (
    <motion.div
      ref={panelRef}
      className="ab-box ab-video ab-box--tech-panel"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <TechPanelParticles />
      <div className="ab-tech-panel-sweep" ref={sweepRef} aria-hidden="true" />
      <div className="ab-tech-panel-inner">
        <div className="ab-help-stack" ref={textRef}>
          <span className="ab-help-top">WE HELP YOU</span>
          <span className="ab-help-words" aria-live="polite">
            <span className="ab-help-word" ref={wordARef}>
              <span className="ab-help-word-inner">
                <span className="ab-help-word-text">{HELP_WORDS[0]}</span>
                <span className="ab-help-edge ab-help-edge--b" aria-hidden="true" />
                <span className="ab-help-edge ab-help-edge--r" aria-hidden="true" />
                <span className="ab-help-edge ab-help-edge--t" aria-hidden="true" />
                <span className="ab-help-edge ab-help-edge--l" aria-hidden="true" />
              </span>
            </span>
            <span className="ab-help-word" ref={wordBRef} aria-hidden="true">
              <span className="ab-help-word-inner">
                <span className="ab-help-word-text">{HELP_WORDS[1]}</span>
                <span className="ab-help-edge ab-help-edge--b" aria-hidden="true" />
                <span className="ab-help-edge ab-help-edge--r" aria-hidden="true" />
                <span className="ab-help-edge ab-help-edge--t" aria-hidden="true" />
                <span className="ab-help-edge ab-help-edge--l" aria-hidden="true" />
              </span>
            </span>
          </span>
        </div>
      </div>
      <div className="ab-box-tl" aria-hidden="true" />
      <div className="ab-box-br" aria-hidden="true" />
    </motion.div>
  );
}

export default function AboutUs() {
  const bentoRef = useRef(null);
  const [popout, setPopout] = useState(null);

  return (
    <section className="about-sect" id="about">
      <div className="about-bento" ref={bentoRef}>

        <div className="ab-gap-watermark" aria-hidden="true">WINRVTE</div>

        <CapabilitiesMarquee delay={0.06} bentoRef={bentoRef} onPopout={setPopout} />

        {/* Top centre — video aligned with main text width */}
        <TechEsportsPanel delay={0} />

        {/* Centre — cols 2-3 */}
        <motion.div
          className="ab-center"
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="ab-center-glow" aria-hidden="true" />
          <div className="ab-center-inner">
            <AnimatedHeading
              tag="h2"
              className="ab-center-head"
              rows={[
                {
                  parts: [
                    { text: "WE L" },
                    { text: "I", className: "ab-kern-li" },
                    { text: "VE INSIDE" },
                  ],
                },
                { parts: [{ text: "ESPORTS.", accent: true }] },
              ]}
            />
            <p className="ab-center-lead">
              Winrvte is a hands-on operations and technology partner for
              competitive organizations. We build the infrastructure that keeps
              teams focused on winning — not managing chaos.
            </p>
            <div className="ab-center-pillars">
              {PILLARS.map((p) => (
                <div key={p.label} className="ab-pillar">
                  <span className="ab-pillar-label">{p.label}</span>
                  <span className="ab-pillar-desc">{p.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {popout && popout.width > 0 && (
          <div
            className="ab-mq-popout"
            style={{
              top: popout.top,
              left: popout.left,
              width: popout.width,
            }}
            aria-live="polite"
          >
            <span className="ab-mq-popout-tag">{CAPABILITIES[popout.idx].code}</span>
            <span className="ab-mq-popout-text">{CAPABILITIES[popout.idx].desc}</span>
          </div>
        )}

      </div>
    </section>
  );
}
