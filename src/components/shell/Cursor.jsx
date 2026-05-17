import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      gsap.to(dot, { x: mx, y: my, duration: 0.08, ease: "none" });
    };
    document.addEventListener("mousemove", onMove);

    const tick = () => {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      gsap.set(ring, { x: rx, y: ry });
    };
    gsap.ticker.add(tick);

    // hover detect
    const onOver = (e) => {
      const el = e.target.closest("[data-cursor], a, button, input, textarea, [role='button']");
      if (!el) {
        document.body.classList.remove("is-hover", "is-drag");
        if (label) label.textContent = "";
        return;
      }
      const kind = el.getAttribute("data-cursor");
      if (kind === "drag") {
        document.body.classList.add("is-drag");
        document.body.classList.remove("is-hover");
        if (label) label.textContent = "DRAG";
      } else {
        document.body.classList.add("is-hover");
        document.body.classList.remove("is-drag");
        if (label) label.textContent = el.getAttribute("data-cursor-label") || "";
      }
    };
    document.addEventListener("mouseover", onOver);

    const onDown = () => document.body.classList.add("is-click");
    const onUp = () => document.body.classList.remove("is-click");
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      gsap.ticker.remove(tick);
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
      <div className="cursor-ring" ref={ringRef} aria-hidden="true">
        <span className="cur-label" ref={labelRef}></span>
      </div>
    </>
  );
}
