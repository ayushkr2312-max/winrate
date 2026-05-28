import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import AnimatedHeading from "../primitives/AnimatedHeading";
import LazyVideo from "../primitives/LazyVideo";

const VIDEO = {
  id: "video",
  video: "/Scene_abt.webm",
  pauseAt: 2,
  cls: "ab-video",
};

const CAPABILITIES = [
  { code: "GRW", label: "Growth Tracking",        desc: "Track roster, revenue, and reach in one place" },
  { code: "SCT", label: "Scouting Systems",       desc: "Searchable pipelines for talent and trials" },
  { code: "DAT", label: "Data Analysis",          desc: "Turn match and ops data into clear decisions" },
  { code: "CST", label: "Cost Cutting",           desc: "Find spend leaks before they scale with headcount" },
  { code: "WFL", label: "Efficient Workflows",    desc: "Cut repetitive handoffs from daily ops" },
  { code: "OPP", label: "Opponent Prep",          desc: "Structured scouting data for faster prep cycles" },
  { code: "CRD", label: "Staff Coordination",     desc: "Clear roles, routing, and ownership under pressure" },
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
  const [paused, setPaused] = useState(false);
  const [activeIdx, setActiveIdx] = useState(null);
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
    setPaused(false);
    setActiveIdx(null);
    onPopout?.(null);
  };

  useEffect(() => {
    const viewport = marqueeRef.current?.querySelector(".ab-mq-viewport");
    if (!viewport) return;
    const io = new IntersectionObserver(
      ([entry]) => viewport.classList.toggle("is-inview", entry.isIntersecting),
      { threshold: 0.08 },
    );
    io.observe(viewport);
    return () => io.disconnect();
  }, []);

  return (
    <motion.div
      ref={marqueeRef}
      className="ab-box ab-ml ab-marquee"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={handleMarqueeLeave}
    >
      <div className="ab-box-tl" aria-hidden="true" />
      <div className="ab-box-br" aria-hidden="true" />

      <div className="ab-mq-head">
        <span className="ab-mq-head-dot" aria-hidden="true" />
        <span className="ab-mq-head-label">CAPABILITY STREAM</span>
        <span className="ab-mq-head-count">{String(CAPABILITIES.length).padStart(2, "0")}</span>
      </div>

      <div className="ab-mq-rail" aria-hidden="true">
        <div className="ab-mq-rail-fill" />
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="ab-mq-rail-tick" style={{ top: `${(i + 1) * 11}%` }} />
        ))}
      </div>

      <div className="ab-mq-viewport">
        <div className="ab-mq-fade ab-mq-fade--top" aria-hidden="true" />
        <div className="ab-mq-fade ab-mq-fade--bot" aria-hidden="true" />

        <div className={"ab-mq-scroll" + (paused ? " is-paused" : "")}>
          {loop.map((item, i) => {
            const idx = i % CAPABILITIES.length;
            const isActive = activeIdx === idx;
            return (
              <div
                key={`${item.code}-${i}`}
                className={"ab-mq-item" + (isActive ? " is-active" : "")}
                onMouseEnter={(e) => handleItemEnter(idx, e)}
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

function PlaceholderBox({ box, delay = 0 }) {
  const videoRef = useRef(null);
  const playPromiseRef = useRef(null);
  const pauseAt = box.pauseAt ?? 2;

  const handleReady = () => {
    const v = videoRef.current;
    if (v) { v.currentTime = pauseAt; v.pause(); }
  };
  const handleEnter = () => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    playPromiseRef.current = v.play();
  };
  const handleLeave = () => {
    const v = videoRef.current;
    if (!v) return;
    const p = playPromiseRef.current;
    if (p !== undefined) {
      p.then(() => { v.pause(); v.currentTime = pauseAt; }).catch(() => {});
    } else {
      v.pause(); v.currentTime = pauseAt;
    }
    playPromiseRef.current = null;
  };

  return (
    <motion.div
      className={`ab-box ${box.cls}${box.video ? " ab-box--video" : ""}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={box.video ? handleEnter : undefined}
      onMouseLeave={box.video ? handleLeave : undefined}
    >
      {box.video ? (
        <>
          <LazyVideo
            ref={videoRef}
            className="ab-box-video"
            src={box.video}
            loop
            onReady={handleReady}
          />
          <div className="ab-box-tl" aria-hidden="true" />
          <div className="ab-box-br" aria-hidden="true" />
        </>
      ) : (
        <>
          <div className="ab-box-tl" aria-hidden="true" />
          <div className="ab-box-br" aria-hidden="true" />
          <div className="ab-box-rec" aria-hidden="true">
            <span className="ab-box-rec-dot" />
            <span className="ab-box-rec-label">MOTION GRAPHIC</span>
          </div>
          <div className="ab-box-label">{box.label}</div>
          <div className="ab-box-area">
            <div className="ab-box-cross" aria-hidden="true">
              <span /><span />
            </div>
            <span className="ab-box-hint">{box.hint}</span>
          </div>
        </>
      )}
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
        <PlaceholderBox box={VIDEO} delay={0} />

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
