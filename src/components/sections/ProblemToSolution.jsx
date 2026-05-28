import { motion } from "framer-motion";
import SplitText from "../primitives/SplitText";

const SHIFTS = [
  { from: "Manual processes", to: "Automated workflows" },
  { from: "Scattered tools", to: "Centralized systems" },
  { from: "Guesswork", to: "Real-time visibility" },
  { from: "Reactive ops", to: "Structured execution" },
];

const shiftVariants = {
  hidden: {
    opacity: 0, x: -24,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
  show: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.65,
      delay: 0.25 + i * 0.08,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function ProblemToSolution() {
  return (
    <section className="pts">
      <div className="pts-inner">
        <div className="pts-headline">
          <span className="pts-line">
            <SplitText text="These are solvable." splitBy="chars" stagger={0.018} duration={0.95} />
          </span>
          <span className="pts-line pts-line-accent">
            <SplitText text="Here's what changes." splitBy="chars" stagger={0.018} duration={0.95} delay={0.18} />
          </span>
        </div>

        <div className="pts-shifts">
          {SHIFTS.map((s, i) => (
            <motion.div
              className="pts-shift"
              key={i}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={shiftVariants}
            >
              <span className="pts-from">{s.from}</span>
              <span className="pts-arrow" aria-hidden="true">→</span>
              <span className="pts-to">{s.to}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
