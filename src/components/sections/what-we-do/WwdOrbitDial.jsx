import { motion } from "framer-motion";
import { ORBIT_SLOTS } from "./wwdData";

export default function WwdOrbitDial({ pillars, active, onSelect, pillar }) {
  return (
    <div className="wwd-orbit" aria-hidden="true">
      <svg className="wwd-orbit-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <circle cx="50" cy="50" r="38" className="wwd-orbit-ring" />
        <motion.circle
          cx="50"
          cy="50"
          r="38"
          className="wwd-orbit-progress"
          fill="none"
          strokeWidth="0.6"
          strokeDasharray={`${((active + 1) / pillars.length) * 238} 238`}
          initial={false}
          animate={{ strokeDasharray: `${((active + 1) / pillars.length) * 238} 238` }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        />
        {ORBIT_SLOTS.map((slot, i) => {
          const next = ORBIT_SLOTS[(i + 1) % ORBIT_SLOTS.length];
          return (
            <line
              key={`link-${i}`}
              x1={slot.x}
              y1={slot.y}
              x2={next.x}
              y2={next.y}
              className={"wwd-orbit-link" + (active === i || active === (i + 1) % 4 ? " is-lit" : "")}
            />
          );
        })}
      </svg>

      <div className="wwd-core">
        <motion.span
          key={pillar.module}
          className="wwd-core-mod"
          initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.35 }}
        >
          {pillar.module}
        </motion.span>
        <span className="wwd-core-label">Active module</span>
        <span className="wwd-core-role">{pillar.role}</span>
      </div>

      {pillars.map((p, i) => {
        const slot = ORBIT_SLOTS[i];
        return (
          <button
            key={p.id}
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            className={"wwd-orbit-node" + (active === i ? " is-active" : "")}
            data-accent={p.accent}
            style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
            onClick={() => onSelect(i)}
          >
            <span className="wwd-orbit-node-ring" />
            <span className="wwd-orbit-node-num">{p.num}</span>
          </button>
        );
      })}
    </div>
  );
}
