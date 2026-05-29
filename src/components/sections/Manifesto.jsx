import { useRef } from "react";
import { motion } from "framer-motion";
import AnimatedHeading from "../primitives/AnimatedHeading";
import LazyVideo from "../primitives/LazyVideo";

const MANIFESTO_BG_VIDEO = "/Repeater-Animation.webm";

const ROWS = [
  {
    n: "01",
    title: "Real esports operating experience",
    body: "We understand how esports orgs actually function day-to-day, because our team has worked inside them.",
    tag: "Esports-native",
  },
  {
    n: "02",
    title: "Technical execution that ships",
    body: "We build and implement the automations, dashboards, and workflows your team can use right away.",
    tag: "Build-first",
  },
  {
    n: "03",
    title: "Custom solutions, cost-conscious delivery",
    body: "We adapt scope and pricing to each org's needs so teams can improve operations without overcommitting budget.",
    tag: "Practical value",
  },
];

const rowVariants = {
  hidden: {
    opacity: 0, x: -32,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
  show: (i) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const fadeUp = {
  hidden: { opacity: 0, y: 24, transition: { duration: 0.3 } },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

export default function Manifesto() {
  const sectionRef = useRef(null);

  return (
    <section className="sect manifesto" id="manifesto" ref={sectionRef}>
      <div className="manifesto-bg" aria-hidden="true">
        <LazyVideo
          className="manifesto-bg-video"
          src={MANIFESTO_BG_VIDEO}
          visibilityRootRef={sectionRef}
          playbackRate={0.4}
          loop
        />
      </div>
      <div className="sect-inner">
        <motion.span className="section-tag" initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.5 }} variants={fadeUp}>
          <span className="num">05</span> Manifesto
        </motion.span>
        <div className="manifesto-head">
          <AnimatedHeading
            tag="h2"
            rows={[
              { text: "BUILT FOR" },
              { text: "GROWING" },
              { parts: [{ text: "ORGS.", accent: true }] },
            ]}
          />
          <motion.p initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.5 }} variants={fadeUp}>
            A hands-on partner for organizations that need better systems, cleaner operations, and smarter use of limited budget.
          </motion.p>
        </div>

        <div className="manifesto-rows">
          {ROWS.map((r, i) => (
            <motion.div
              className="manifesto-row"
              key={i}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.2 }}
              variants={rowVariants}
            >
              <div className="manifesto-row-num">{r.n}</div>
              <div>
                <h3 className="manifesto-row-title">{r.title}</h3>
                <p className="manifesto-row-body">{r.body}</p>
              </div>
              <div className="manifesto-row-tag"><span>{r.tag}</span></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
