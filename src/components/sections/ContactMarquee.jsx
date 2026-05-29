import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const SEGMENTS = [
  { text: "WINRVTE", style: "solid" },
  { text: "◆", style: "sep" },
  { text: "WINRVTE", style: "outline" },
  { text: "//", style: "sep" },
  { text: "TECH × ESPORTS", style: "mono" },
  { text: "◆", style: "sep" },
];

function MarqueeTrack({ reverse = false, className = "" }) {
  const railRef = useRef(null);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const inner = rail.firstElementChild;
    if (!inner) return;

    rail.appendChild(inner.cloneNode(true));

    const width = inner.offsetWidth;
    const tween = gsap.fromTo(
      rail,
      { x: reverse ? -width : 0 },
      {
        x: reverse ? 0 : -width,
        duration: reverse ? 26 : 32,
        ease: "none",
        repeat: -1,
      },
    );

    return () => tween.kill();
  }, [reverse]);

  return (
    <div className={`winrvte-marquee-band${reverse ? " is-reverse" : ""} ${className}`.trim()}>
      <div className="winrvte-marquee-rail" ref={railRef}>
        <div className="winrvte-marquee-inner">
          {SEGMENTS.map((seg, i) => (
            <span
              key={i}
              className={[
                "winrvte-marquee-item",
                seg.style === "outline" && "is-outline",
                seg.style === "mono" && "is-mono",
                seg.style === "sep" && "is-sep",
              ].filter(Boolean).join(" ")}
            >
              {seg.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ContactMarquee() {
  return (
    <div className="winrvte-marquee" aria-hidden="true">
      <div className="winrvte-marquee-edge winrvte-marquee-edge--top" />
      <MarqueeTrack />
      <MarqueeTrack reverse className="winrvte-marquee-band--alt" />
      <div className="winrvte-marquee-edge winrvte-marquee-edge--bottom" />
    </div>
  );
}
