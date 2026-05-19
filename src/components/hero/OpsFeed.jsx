import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const STATIC_EVENTS = [
  { msg: "Ops request queue triaged by role", ok: true },
  { msg: "Dashboard sync complete across sheets + forms", ok: true },
  { msg: "Sponsor deliverable tracker updated", ok: true },
  { msg: "Prep dataset refreshed for analyst review", ok: true },
  { msg: "Staff intake workflow routed to approvals", ok: true },
  { msg: "Task reminder batch dispatched in Discord", ok: true },
  { msg: "Roster info check passed against source sheets", ok: true },
  { msg: "Scrim schedule automation completed", ok: true },
  { msg: "Content request board normalized by priority", ok: true },
  { msg: "Budget-ready operations snapshot generated", ok: true },
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
        <span className="tag">SAMPLE FEED</span>
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
          <span className="lbl">Core Stack</span>
          <span className="val">3X</span>
          <span className="sub">Experience x Tech x Network</span>
        </div>
        <div className="ops-metric">
          <span className="lbl">Delivery Model</span>
          <span className="val">Custom</span>
          <span className="sub">Scoped per org + budget</span>
        </div>
        <div className="ops-metric">
          <span className="lbl">Best For</span>
          <span className="val">SMB</span>
          <span className="sub">Growing esports orgs</span>
        </div>
        <div className="ops-metric">
          <span className="lbl">Response</span>
          <span className="val">24h</span>
          <span className="sub">Discovery call turnaround</span>
        </div>
      </div>
    </div>
  );
}
