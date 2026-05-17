import { useEffect, useState } from "react";

function makeUID() {
  const ts = Date.now().toString(36).slice(-5).toUpperCase();
  const r = Math.floor(Math.random() * 0xfffff).toString(16).toUpperCase().padStart(5, "0");
  return `RV-${ts}-${r}`;
}

export default function FrameMeta() {
  const [uid] = useState(makeUID);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    let raf, last = performance.now(), f = 0;
    const tick = (t) => {
      // increment ~20fps to feel alive without flicker
      if (t - last > 50) { f += 1; last = t; setFrame(f); }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="frame-meta" aria-hidden="true">
      <span className="dot" />
      <span>FRAME {String(frame).padStart(5, "0")}</span>
      <span className="uid">{uid}</span>
    </div>
  );
}
