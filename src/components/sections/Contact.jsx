import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionCoord from "../primitives/SectionCoord";
import Magnetic from "../primitives/Magnetic";

gsap.registerPlugin(ScrollTrigger);

const TOPICS = [
  "Workflow Automation",
  "Talent Scouting",
  "Data Viz",
  "Social Growth",
  "Web Build",
  "Roster Management",
  "Other",
];

export default function Contact() {
  const headRef = useRef(null);
  const [topics, setTopics] = useState(new Set());
  const [ok, setOk] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const inners = headRef.current?.querySelectorAll(".inner");
      if (inners) {
        ScrollTrigger.create({
          trigger: headRef.current,
          start: "top 78%",
          once: true,
          onEnter: () => gsap.fromTo(
            inners,
            { yPercent: 110 },
            { yPercent: 0, duration: 1.1, stagger: 0.12, ease: "expo.out" },
          ),
        });
      }
    });
    return () => ctx.revert();
  }, []);

  const toggle = (t) => {
    setTopics((s) => {
      const n = new Set(s);
      if (n.has(t)) n.delete(t); else n.add(t);
      return n;
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setOk(true);
      e.target.reset();
      setTopics(new Set());
    }, 900);
  };

  return (
    <section className="sect contact" id="contact">
      <SectionCoord idx="07" label="CONTACT" lat="51.5°N" lon="0.1°W" />
      <div className="sect-inner">
        <div className="contact-inner-grid">
          <div>
            <span className="section-tag"><span className="num">07</span> Contact</span>
            <div className="contact-headline" ref={headRef}>
              <span className="contact-line"><span className="inner">LET'S BUILD</span></span>
              <span className="contact-line"><span className="inner">SOMETHING</span></span>
              <span className="contact-line accent"><span className="inner">DIFFERENT.</span></span>
            </div>

            <p className="contact-intro">Tell us which problems you're trying to crack. We'll respond within 24 hours with a 30-min slot — usually with a 1-page audit of what we'd build first.</p>

            <div className="contact-chips" data-cursor-label="PICK">
              {TOPICS.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={"contact-chip" + (topics.has(t) ? " is-on" : "")}
                  onClick={() => toggle(t)}
                >
                  {t}
                </button>
              ))}
            </div>

            <form className="contact-form" onSubmit={onSubmit} noValidate>
              <div className="cf-field">
                <label htmlFor="cf-name">Name</label>
                <input type="text" id="cf-name" name="name" placeholder="Your full name" required autoComplete="name" />
              </div>
              <div className="cf-field">
                <label htmlFor="cf-org">Org</label>
                <input type="text" id="cf-org" name="org" placeholder="Your organization" required autoComplete="organization" />
              </div>
              <div className="cf-field">
                <label htmlFor="cf-email">Email</label>
                <input type="email" id="cf-email" name="email" placeholder="your@email.com" required autoComplete="email" />
              </div>
              <div className="cf-field">
                <label htmlFor="cf-msg">What's the brief?</label>
                <input type="text" id="cf-msg" name="msg" placeholder="One sentence is fine." />
              </div>
              <div className="cf-row">
                <Magnetic as="button" type="submit" className="btn-submit" data-cursor-label="SEND" strength={0.3} disabled={sending}>
                  {sending ? "Sending…" : "Send it →"}
                </Magnetic>
                <span className={"cf-ok" + (ok ? " is-on" : "")}>Received. We&apos;ll be in touch within 24h.</span>
              </div>
            </form>
          </div>

          <div className="contact-right">
            <div className="contact-card">
              <div className="contact-card-head">
                <span>// DIRECT LINE</span>
                <span className="lime">● 24h RESPONSE</span>
              </div>
              <div className="contact-detail">
                <span className="k">Email</span>
                <span className="v"><a href="mailto:hello@rivaltech.gg">hello@rivaltech.gg</a></span>
              </div>
              <div className="contact-detail">
                <span className="k">Discord</span>
                <span className="v">rival.gg</span>
              </div>
              <div className="contact-detail">
                <span className="k">Region</span>
                <span className="v">NA · EU · APAC</span>
              </div>
              <div className="contact-detail">
                <span className="k">Status</span>
                <span className="v"><span style={{ color: "var(--lime)" }}>● Booking Q1 / 2026</span></span>
              </div>
            </div>

            <div className="contact-sigil">
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                <rect x="2" y="2" width="52" height="52" stroke="rgba(182,255,30,.35)" strokeWidth="1" strokeDasharray="3,2" />
                <path d="M14 28 L 28 14 L 42 28 L 28 42 Z" stroke="var(--lime)" strokeWidth="1.2" fill="rgba(182,255,30,.05)" />
                <text x="28" y="32" textAnchor="middle" fill="var(--lime)" style={{ font: "900 9px var(--f-display)", letterSpacing: ".05em" }}>RV</text>
              </svg>
              <div className="txt">
                Each engagement begins with a <strong>signed scope</strong> and a single, named engineer.<br />
                No churn through account managers. No retainers without delivery.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
