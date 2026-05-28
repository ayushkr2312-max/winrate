import { motion } from "framer-motion";
import WwdSystemMap, { SIGNAL_HOT } from "./WwdSystemMap";

export { SIGNAL_HOT };

export default function WwdSchematic({ laneId, accent = "lime", hotSignal = null }) {
  return (
    <div className="wwd-schem" data-lane={laneId}>
      <div className="wwd-schem-frame">
        <span className="wwd-schem-corner wwd-schem-corner--tl" />
        <span className="wwd-schem-corner wwd-schem-corner--tr" />
        <span className="wwd-schem-corner wwd-schem-corner--bl" />
        <span className="wwd-schem-corner wwd-schem-corner--br" />
        <motion.div
          key={laneId}
          className="wwd-schem-inner"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        >
          <WwdSystemMap laneId={laneId} accent={accent} hotSignal={hotSignal} />
        </motion.div>
      </div>
    </div>
  );
}
