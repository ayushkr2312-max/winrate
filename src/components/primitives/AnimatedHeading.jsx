import SplitText from "./SplitText";

/**
 * AnimatedHeading — drop-in replacement for KineticHeading that uses SplitText
 * for character-level reveal animations. Each row glides up from a mask on
 * scroll, with the accent fragments tinted lime. Multi-part rows are
 * sequenced so the stagger feels like one continuous read.
 *
 * Props
 *   rows: array of either
 *     { text: string }                                 — single fragment row
 *     { parts: [{ text, accent?, stroke? }] }          — multi-fragment row
 *   tag: 'h1' | 'h2' (default 'h2')
 *   className: forwarded to wrapper
 *   stagger: per-character stagger (default .022)
 *   rowStagger: delay between rows (default .14)
 *   triggerStart: ScrollTrigger start (default 'top 82%')
 */
export default function AnimatedHeading({
  rows = [],
  tag: Tag = "h2",
  className = "",
  stagger = 0.022,
  rowStagger = 0.14,
  triggerStart = "top 82%",
}) {
  const lengthOf = (s) => Array.from(String(s)).length;

  return (
    <Tag className={`k-head ${className}`}>
      {rows.map((row, i) => {
        const baseDelay = i * rowStagger;
        if (row.parts) {
          let cumulative = 0;
          return (
            <span key={i} className="row">
              {row.parts.map((p, j) => {
                const cls = p.accent ? "accent" : p.stroke ? "stroke" : "";
                const delay = baseDelay + cumulative * stagger;
                cumulative += lengthOf(p.text);
                return (
                  <SplitText
                    key={j}
                    text={p.text}
                    className={cls}
                    splitBy="chars"
                    stagger={stagger}
                    duration={1.0}
                    delay={delay}
                    trigger={triggerStart}
                  />
                );
              })}
            </span>
          );
        }
        return (
          <span key={i} className="row">
            <SplitText
              text={row.text}
              splitBy="chars"
              stagger={stagger}
              duration={1.0}
              delay={baseDelay}
              trigger={triggerStart}
            />
          </span>
        );
      })}
    </Tag>
  );
}
