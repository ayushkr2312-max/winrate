import { motion } from "framer-motion";
import AnimatedHeading from "../primitives/AnimatedHeading";

const PROBLEMS = [
  {
    tag: "OPERATIONS",
    title: "Repetitive work that could be automated",
    body: "Logistics, updates, follow-ups rebuilt manually every cycle. Systemize once, free your team.",
  },
  {
    tag: "VISIBILITY",
    title: "Slow decisions from scattered data",
    body: "Context spread across Discord, Notion, sheets and DMs. One centralized view changes everything.",
  },
  {
    tag: "COORDINATION",
    title: "Handoffs that break under pressure",
    body: "Unclear routing, overlapping ownership, chat-based delegation. Structure turns chaos into execution.",
  },
  {
    tag: "PREP + ANALYSIS",
    title: "Analyst workflows that should be faster",
    body: "Opponent prep built on scattered data and manual cleanup. Better tooling means more insight, less busywork.",
  },
  {
    tag: "COST + SCALE",
    title: "Costs that scale faster than output",
    body: "Adding headcount instead of infrastructure. The right systems let you do more with what you have.",
  },
  {
    tag: "RETENTION",
    title: "Internal ops that don't match the brand",
    body: "Players, staff and partners notice how an org actually runs. Operational quality keeps talent.",
  },
];

const cardVariants = {
  hidden: {
    opacity: 0, y: 36, rotateX: -8, scale: 0.97,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
  show: (i) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transition: {
      duration: 0.85,
      delay: i * 0.08,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const fadeUp = {
  hidden: { opacity: 0, y: 24, transition: { duration: 0.3 } },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

export default function BridgeSection() {
  return (
    <section className="sect challenge-wall" id="problem">
      <div className="sect-inner">
        <div className="challenge-head">
          <div>
            <motion.span className="section-tag" initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.5 }} variants={fadeUp}>
              <span className="num">02</span> Problems
            </motion.span>
            <AnimatedHeading
              tag="h2"
              rows={[
                { parts: [{ text: "THE " }, { text: "PROBLEMS", accent: true }] },
              ]}
            />
          </div>
          <motion.p initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.5 }} variants={fadeUp}>
            These aren't failures — they're growth signals. Most orgs hit the
            same walls once they start scaling past the founding team.
          </motion.p>
        </div>

        <div className="cx-grid">
          {PROBLEMS.map((item, i) => (
            <motion.div
              className="cx-card"
              key={i}
              custom={i}
              initial="hidden"
              whileInView="show"
              whileHover={{ x: -6, y: -6, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
              viewport={{ once: false, amount: 0.15 }}
              variants={cardVariants}
              style={{ transformPerspective: 1200 }}
            >
              <div className="cx-card-top">
                <span className="cx-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="cx-tag">{item.tag}</span>
              </div>
              <h3 className="cx-title">{item.title}</h3>
              <p className="cx-body">{item.body}</p>
              <div className="cx-card-edge" aria-hidden="true" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
