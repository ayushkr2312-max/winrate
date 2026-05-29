import { useEffect, useRef, useState } from "react";
import { runBootPreload } from "@/lib/bootPreload";

const FEED_LINES = [
  { msg: "Boot sequence...", ok: false },
  { msg: "Linking ops protocol", ok: true },
  { msg: "Buffering media streams", ok: true },
  { msg: "Calibrating data feeds  EU·NA·APAC", ok: true },
  { msg: "Online", ok: true },
];

const MIN_BOOT_MS = 2800;
const MAX_BOOT_MS = 14000;
const TICK_MS = 50;
const EXIT_MS = 360;

export default function Loader({ onDone }) {
  const rootRef = useRef(null);
  const fillRef = useRef(null);
  const pctRef = useRef(null);
  const feedRef = useRef(null);
  const uidRef = useRef(`${Math.floor(Math.random() * 9 + 1)}${Date.now().toString(36).slice(-7).toUpperCase()}`);
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    let elapsed = 0;
    let preloadRatio = 0;
    let feedIdx = 0;
    let finished = false;

    runBootPreload((ratio) => {
      preloadRatio = ratio;
    });

    const finish = () => {
      if (finished) return;
      finished = true;
      if (feedRef.current) {
        feedRef.current.innerHTML = `> ${FEED_LINES[FEED_LINES.length - 1].msg} <span class="ok">OK</span>`;
      }
      if (fillRef.current) fillRef.current.style.width = "100%";
      if (pctRef.current) pctRef.current.textContent = "100";
      window.setTimeout(() => {
        setDone(true);
        document.body.style.overflow = "";
        onDone?.();
      }, EXIT_MS);
    };

    const iv = window.setInterval(() => {
      elapsed += TICK_MS;

      const timeRatio = Math.min(elapsed / MIN_BOOT_MS, 1);
      const eased = 1 - Math.pow(1 - timeRatio, 3);
      const combined = Math.min(
        elapsed >= MIN_BOOT_MS && preloadRatio >= 1 ? 100 : 99,
        Math.floor(Math.max(eased, preloadRatio) * 100),
      );

      if (fillRef.current) fillRef.current.style.width = `${combined}%`;
      if (pctRef.current) pctRef.current.textContent = String(combined).padStart(3, "0");

      const stage = Math.min(
        FEED_LINES.length - 1,
        Math.floor((combined / 100) * FEED_LINES.length),
      );
      if (stage !== feedIdx) {
        feedIdx = stage;
        const line = FEED_LINES[stage];
        if (feedRef.current) {
          feedRef.current.innerHTML = line.ok
            ? `> ${line.msg} <span class="ok">OK</span>`
            : `> ${line.msg}`;
        }
      }

      const ready = elapsed >= MIN_BOOT_MS && preloadRatio >= 1;
      if (ready || elapsed >= MAX_BOOT_MS) {
        window.clearInterval(iv);
        finish();
      }
    }, TICK_MS);

    return () => {
      window.clearInterval(iv);
      document.body.style.overflow = "";
    };
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
          <span>UID · {uidRef.current}</span>
          <span>SECURE LINK</span>
        </div>
      </div>
    </div>
  );
}
