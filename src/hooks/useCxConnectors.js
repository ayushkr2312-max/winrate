import { useLayoutEffect } from "react";

/** Size horizontal .cx-connector lines from problem cards to the viewport edge rails. */
export default function useCxConnectors(containerRef) {
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let rafId = 0;
    const update = () => {
      rafId = 0;
      container.querySelectorAll(".cx-connector").forEach((line) => {
        const host = line.parentElement;
        if (!host) return;
        const rect = host.getBoundingClientRect();

        line.style.top = "";
        line.style.transform = "";
        line.style.left = "";
        line.style.right = "";

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
    ro.observe(container);

    return () => {
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule);
      ro.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [containerRef]);
}
