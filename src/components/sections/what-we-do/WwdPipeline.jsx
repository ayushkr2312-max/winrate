import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { prefersReducedMotion } from "@/lib/device";

export default function WwdPipeline({ flow }) {
  const [activeStep, setActiveStep] = useState(0);
  const railRef = useRef(null);
  const fillRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".wwd-pipe-step",
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: railRef.current,
            start: "top 88%",
            once: false,
          },
        },
      );
    }, railRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const fill = fillRef.current;
    if (!fill) return;
    const pct = flow.length <= 1 ? 0 : (activeStep / (flow.length - 1)) * 100;
    fill.style.width = `${pct}%`;
  }, [activeStep, flow.length]);

  return (
    <div className="wwd-pipeline">
      <div className="wwd-pipeline-head">
        <span className="wwd-pipeline-k">Engagement pipeline</span>
        <p>How we move from understanding your org to systems that compound.</p>
      </div>

      <div className="wwd-pipeline-rail-wrap" ref={railRef}>
        <div className="wwd-pipeline-track" aria-hidden="true">
          <span ref={fillRef} className="wwd-pipeline-fill" />
        </div>
        <ol className="wwd-pipeline-rail">
          {flow.map((step, i) => (
            <motion.li
              key={step.n}
              className={"wwd-pipe-step" + (activeStep === i ? " is-active" : "") + (activeStep > i ? " is-done" : "")}
              onMouseEnter={() => setActiveStep(i)}
              onFocus={() => setActiveStep(i)}
              tabIndex={0}
            >
              <button
                type="button"
                className="wwd-pipe-btn"
                onClick={() => setActiveStep(i)}
                aria-pressed={activeStep === i}
              >
                <span className="wwd-pipe-num">{step.n}</span>
                <span className="wwd-pipe-title">{step.title}</span>
              </button>
              <p className="wwd-pipe-desc">{step.desc}</p>
              {i < flow.length - 1 && <span className="wwd-pipe-arrow" aria-hidden="true">→</span>}
            </motion.li>
          ))}
        </ol>
      </div>
    </div>
  );
}
