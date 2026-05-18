import { useEffect, useRef } from "react";

export default function TopProgress() {
  const fillRef = useRef(null);
  useEffect(() => {
    let rafId = 0;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max <= 0 ? 0 : (window.scrollY / max) * 100;
      if (fillRef.current) fillRef.current.style.width = pct + "%";
    };
    const requestOnScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        onScroll();
      });
    };
    requestOnScroll();
    window.addEventListener("scroll", requestOnScroll, { passive: true });
    window.addEventListener("resize", requestOnScroll);
    return () => {
      window.removeEventListener("scroll", requestOnScroll);
      window.removeEventListener("resize", requestOnScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);
  return (
    <div className="top-prog" aria-hidden="true">
      <div className="top-prog-fill" ref={fillRef} />
    </div>
  );
}
