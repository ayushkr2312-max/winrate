import { motion } from "framer-motion";

const STACK_OFFSET = [0, 14, 28, 42];

export default function WwdLayerStack({ pillars, active, onSelect }) {
  return (
    <div className="wwd-rack-inner" role="tablist" aria-label="Operating system layers">
      <div className="wwd-rack-perspective">
        {pillars.map((p, i) => {
          const isActive = active === i;
          const depth = active - i;
          const behind = depth > 0;
          const ahead = depth < 0;

          return (
            <motion.button
              key={p.id}
              type="button"
              role="tab"
              id={`wwd-tab-${p.id}`}
              aria-selected={isActive}
              aria-controls="wwd-module"
              className={"wwd-slab" + (isActive ? " is-active" : "")}
              data-accent={p.accent}
              data-depth={depth}
              onClick={() => onSelect(i)}
              onFocus={() => onSelect(i)}
              animate={{
                y: isActive ? 0 : behind ? STACK_OFFSET[Math.min(depth, 3)] : -8,
                x: isActive ? 0 : ahead ? -6 : 4,
                scale: isActive ? 1 : behind ? 0.96 - depth * 0.02 : 0.98,
                opacity: isActive ? 1 : behind ? 0.45 - depth * 0.08 : 0.7,
                rotateX: isActive ? 0 : behind ? 4 + depth * 2 : -2,
                zIndex: isActive ? 10 : 4 - i,
              }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              style={{ transformOrigin: "center bottom" }}
            >
              <span className="wwd-slab-edge" aria-hidden="true" />
              <span className="wwd-slab-num">L{p.num}</span>
              <span className="wwd-slab-mod">{p.module}</span>
              <span className="wwd-slab-name">{p.short}</span>
              <span className="wwd-slab-stat">
                <strong>{p.stat}</strong>
                <em>{p.statLabel}</em>
              </span>
              {isActive && (
                <motion.span
                  layoutId="wwd-slab-glow"
                  className="wwd-slab-glow"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
      <p className="wwd-rack-hint">Select a layer — stack builds your OS</p>
    </div>
  );
}
