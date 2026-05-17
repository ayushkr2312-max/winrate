import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const STATIC_EVENTS = [
  { msg: "Scout pipeline · VAL/NA · 412 prospects", ok: true },
  { msg: "Roster patch shipped · CLIENT-014", ok: true },
  { msg: "Dashboard query · 132ms p95", ok: true },
  { msg: "Auto-DM cadence triggered", ok: true },
  { msg: "Contract sync · Tier-2 OCE", ok: true },
  { msg: "Match log · BO5 · 2 maps remaining", ok: true },
  { msg: "Social cross-post · IG + X + TT", ok: true },
  { msg: "Webhook ingest · 1.4k events", ok: true },
  { msg: "Sponsor lookbook generated", ok: true },
  { msg: "Player VOD tags · 48 added", ok: true },
];

function nowTime() {
  const d = new Date();
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}:${String(d.getUTCSeconds()).padStart(2, "0")}`;
}

export default function OpsFeed() {
  const cardRef = useRef(null);
  const feedRef = useRef(null);
  const [events, setEvents] = useState(() => {
    const start = STATIC_EVENTS.slice(0, 4);
    return start.map((e, i) => ({ ...e, t: nowTime(), id: i }));
  });
  const idRef = useRef(4);

  useEffect(() => {
    const card = cardRef.current;
    gsap.to(card, { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.2 });
  }, []);

  useEffect(() => {
    // rotate events every ~3.2s
    let i = 4;
    const iv = setInterval(() => {
      const next = STATIC_EVENTS[i % STATIC_EVENTS.length];
      i++;
      const id = ++idRef.current;
      setEvents((prev) => {
        const updated = [...prev.slice(1), { ...next, t: nowTime(), id }];
        return updated;
      });
    }, 3200);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    // animate-in the latest row
    const rows = feedRef.current?.querySelectorAll(".ops-event");
    if (!rows || rows.length === 0) return;
    const last = rows[rows.length - 1];
    gsap.fromTo(last, { opacity: 0, x: 16 }, { opacity: 1, x: 0, duration: 0.45, ease: "power2.out" });
    // others fade to baseline
    rows.forEach((r, i) => {
      if (i < rows.length - 1) gsap.set(r, { opacity: 1 - (rows.length - 1 - i) * 0.18 });
    });
  }, [events]);

  return (
    <div className="ops-card" ref={cardRef}>
      <div className="ops-head">
        <span className="live">OPERATIONAL</span>
        <span className="tag">LIVE FEED · UTC</span>
      </div>

      <div className="ops-feed" ref={feedRef}>
        {events.map((e) => (
          <div className="ops-event" key={e.id}>
            <span className="t">{e.t}</span>
            <span className="msg">{e.msg}</span>
            <span className="ok">OK</span>
          </div>
        ))}
      </div>

      <div className="ops-metrics">
        <div className="ops-metric">
          <span className="lbl">Active Clients</span>
          <span className="val">12+</span>
          <span className="sub">NA · EU · APAC</span>
        </div>
        <div className="ops-metric">
          <span className="lbl">Retention</span>
          <span className="val">98%</span>
          <span className="sub">Renewals YTD</span>
        </div>
        <div className="ops-metric">
          <span className="lbl">Fan Reach</span>
          <span className="val">3.2M+</span>
          <span className="sub">↑ 18% QoQ</span>
        </div>
        <div className="ops-metric">
          <span className="lbl">Avg. Delivery</span>
          <span className="val">14 d</span>
          <span className="sub">↓ Fastest yet</span>
        </div>
      </div>
    </div>
  );
}
