/**
 * SectionCoord — small "coordinate" strip placed top-right of each section.
 * Lends a subtle telemetry / mapping personality without being noisy.
 */
export default function SectionCoord({ idx, label, coord, lat = "41.0°N", lon = "73.5°W" }) {
  return (
    <div className="sect-coord">
      <span className="accent">SECT.{idx}</span>
      <span className="sect-coord-line" />
      <span>{label}</span>
      <span className="sect-coord-line" />
      <span>{lat} · {lon}</span>
    </div>
  );
}
