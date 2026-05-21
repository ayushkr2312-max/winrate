import { useState } from "react";
import { motion } from "framer-motion";
import SplitText from "../primitives/SplitText";
import Magnetic from "../primitives/Magnetic";

const TOPICS = [
  "Workflow Automation",
  "Dashboards",
  "Operations",
  "Analyst Tools",
  "Resource Sourcing",
  "Custom Build",
];

const fadeUp = {
  hidden: { opacity: 0, y: 24, transition: { duration: 0.3 } },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const staggerChild = {
  hidden: { opacity: 0, y: 16, transition: { duration: 0.25 } },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function Contact() {
  const [topics, setTopics] = useState(new Set());
  const [ok, setOk] = useState(false);
  const [sending, setSending] = useState(false);

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
      <div className="sect-inner">
        <div className="contact-inner-grid">
          <div>
            <motion.span className="section-tag" initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.5 }} variants={fadeUp}>
              <span className="num">07</span> Contact
            </motion.span>
            <div className="contact-headline">
              <span className="contact-line">
                <SplitText text="LET'S BUILD" splitBy="chars" stagger={0.024} duration={1.0} />
              </span>
              <span className="contact-line">
                <SplitText text="SOMETHING" splitBy="chars" stagger={0.024} duration={1.0} delay={0.18} />
              </span>
              <span className="contact-line accent">
                <SplitText text="DIFFERENT." splitBy="chars" stagger={0.024} duration={1.0} delay={0.36} />
              </span>
            </div>

            <motion.p className="contact-intro" initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.5 }} variants={fadeUp}>
              Tell us which problems you're trying to crack. We'll respond within 24 hours with a 30-min slot — usually with a 1-page audit of what we'd build first.
            </motion.p>

            <motion.div className="contact-chips" data-cursor-label="PICK" initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.3 }} variants={staggerContainer}>
              {TOPICS.map((t) => {
                const isOn = topics.has(t);
                return (
                  <motion.button
                    key={t}
                    type="button"
                    className={"contact-chip" + (isOn ? " is-on" : "")}
                    onClick={() => toggle(t)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    animate={{
                      scale: isOn ? 1.02 : 1,
                    }}
                    variants={staggerChild}
                    transition={{ type: "spring", stiffness: 380, damping: 24 }}
                  >
                    {t}
                  </motion.button>
                );
              })}
            </motion.div>

            <motion.form className="contact-form" onSubmit={onSubmit} noValidate initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.15 }} variants={staggerContainer}>
              <motion.div className="cf-field" variants={staggerChild}>
                <label htmlFor="cf-name">Name</label>
                <input type="text" id="cf-name" name="name" placeholder="Your full name" required autoComplete="name" />
              </motion.div>
              <motion.div className="cf-field" variants={staggerChild}>
                <label htmlFor="cf-org">Org</label>
                <input type="text" id="cf-org" name="org" placeholder="Your organization" required autoComplete="organization" />
              </motion.div>
              <motion.div className="cf-field" variants={staggerChild}>
                <label htmlFor="cf-email">Email</label>
                <input type="email" id="cf-email" name="email" placeholder="your@email.com" required autoComplete="email" />
              </motion.div>
              <motion.div className="cf-field" variants={staggerChild}>
                <label htmlFor="cf-msg">What's the brief?</label>
                <input type="text" id="cf-msg" name="msg" placeholder="One sentence is fine." />
              </motion.div>
              <motion.div className="cf-row" variants={staggerChild}>
                <Magnetic as="button" type="submit" className="btn-submit" data-cursor-label="SEND" strength={0.3} disabled={sending}>
                  {sending ? "Sending…" : "Send it →"}
                </Magnetic>
                <span className={"cf-ok" + (ok ? " is-on" : "")}>Received. We&apos;ll be in touch within 24h.</span>
              </motion.div>
            </motion.form>
          </div>

          <motion.div className="contact-right" initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.2 }} variants={fadeUp}>
            <div className="contact-card">
              <div className="contact-card-head">
                <span>// DIRECT LINE</span>
                <span className="lime">● 24h RESPONSE</span>
              </div>
              <div className="contact-detail">
                <span className="k">Email</span>
                <span className="v"><a href="mailto:hello@winrvte.tech">hello@winrvte.tech</a></span>
              </div>
              <div className="contact-detail">
                <span className="k">Discord</span>
                <span className="v">winrvte.tech</span>
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}
