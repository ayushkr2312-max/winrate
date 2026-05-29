import { useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";
import AnimatedHeading from "../primitives/AnimatedHeading";

function useCxConnectors(gridRef) {
  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    let rafId = 0;
    const update = () => {
      rafId = 0;
      grid.querySelectorAll(".cx-connector").forEach((line) => {
        const card = line.parentElement;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        if (line.classList.contains("cx-connector--left")) {
          line.style.width = `${Math.max(0, rect.left)}px`;
        } else {
          line.style.width = `${Math.max(0, window.innerWidth - rect.right)}px`;
        }
      });
    };

    const schedule = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("scroll", schedule, { passive: true });

    const ro = new ResizeObserver(schedule);
    ro.observe(grid);

    return () => {
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule);
      ro.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [gridRef]);
}

function CardConnector({ side }) {
  return (
    <span
      className={`cx-connector cx-connector--${side}`}
      aria-hidden="true"
    />
  );
}

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
    tag: "SCOUTING",
    title: "Signing hype, not value",
    body: "Rosters get built on clips and gut feel. The orgs winning the signing race are tracking prospects with real data — before the price goes up.",
  },
  {
    tag: "CONTENT + SPEND",
    title: "Content budget with no feedback loop",
    body: "Posts, campaigns, content drops — money goes out but nobody knows what's actually working. Without clear numbers, every spend is a coin flip.",
  },
  {
    tag: "PROCUREMENT",
    title: "Urgency costing more than the problem",
    body: "When things move fast, orgs grab the first vendor, tool, or hire available instead of finding the best fit for their budget. That means paying more, getting less, or both.",
  },
  {
    tag: "SPONSORSHIP",
    title: "Sponsors need proof, not promises",
    body: "Sponsors don't care about hype. If you can't show real growth and proven delivery with data to back it up — you're invisible to serious capital.",
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
  const gridRef = useRef(null);
  useCxConnectors(gridRef);

  return (
    <section className="sect challenge-wall" id="problem">
      <div className="sect-inner">
        <div className="challenge-head">
          <div>
            <motion.span className="section-tag" initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.5 }} variants={fadeUp}>
              <span className="num">03</span> Problems
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

        <div className="cx-grid" ref={gridRef}>
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
              {i % 2 === 0 ? (
                <CardConnector side="left" />
              ) : (
                <CardConnector side="right" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
