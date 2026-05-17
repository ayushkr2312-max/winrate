import { useEffect, useRef, useState } from "react";

const FEED_LINES = [
  { msg: "Boot sequence...", ok: false },
  { msg: "Linking ops protocol", ok: true },
  { msg: "Calibrating data feeds  EU·NA·APAC", ok: true },
  { msg: "Compiling scout vectors", ok: true },
  { msg: "Online", ok: true },
];

export default function Loader({ onDone }) {
  const rootRef = useRef(null);
  const fillRef = useRef(null);
  const pctRef = useRef(null);
  const feedRef = useRef(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    let elapsed = 0;
    const total = 1500;
    const step = 40;
    let feedIdx = 0;

    const iv = setInterval(() => {
      elapsed += step;
      const t = Math.min(elapsed / total, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const pct = Math.min(Math.floor(eased * 100), elapsed < total ? 99 : 100);
      if (fillRef.current) fillRef.current.style.width = pct + "%";
      if (pctRef.current) pctRef.current.textContent = String(pct).padStart(3, "0");

      // step feed lines as pct passes thresholds
      const stage = Math.floor((pct / 100) * FEED_LINES.length);
      if (stage !== feedIdx && stage < FEED_LINES.length) {
        feedIdx = stage;
        const line = FEED_LINES[Math.min(stage, FEED_LINES.length - 1)];
        if (feedRef.current) {
          feedRef.current.innerHTML = line.ok
            ? `> ${line.msg} <span class="ok">OK</span>`
            : `> ${line.msg}`;
        }
      }

      if (elapsed >= total) {
        clearInterval(iv);
        if (feedRef.current) feedRef.current.innerHTML = `> ${FEED_LINES[FEED_LINES.length - 1].msg} <span class="ok">OK</span>`;
        setTimeout(() => {
          setDone(true);
          document.body.style.overflow = "";
          if (onDone) onDone();
        }, 360);
      }
    }, step);

    return () => clearInterval(iv);
  }, [onDone]);

  return (
    <div ref={rootRef} className={"loader" + (done ? " is-done" : "")} aria-hidden={done}>
      <div className="loader-top">
        <span>WINRVTE // TECH AGENCY</span>
        <span>BOOT.2026</span>
        <span>SEC.001 / 005</span>
      </div>

      <div className="loader-center">
        <div className="loader-mark">WIN<span className="a">R</span>VTE</div>
        <div className="loader-feed" ref={feedRef}>{`> Boot sequence...`}</div>
      </div>

      <div className="loader-bottom" style={{ flexDirection: "column", alignItems: "stretch", gap: "12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span>Initializing systems</span>
          <span className="loader-pct" ref={pctRef}>000</span>
        </div>
        <div className="loader-bar">
          <div className="loader-bar-fill" ref={fillRef} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
          <span>UID · {Math.floor(Math.random() * 9 + 1)}{Date.now().toString(36).slice(-7).toUpperCase()}</span>
          <span>SECURE LINK</span>
        </div>
      </div>
    </div>
  );
}
