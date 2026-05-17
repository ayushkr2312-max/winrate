import { useEffect, useRef } from "react";

export default function TopProgress() {
  const fillRef = useRef(null);
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max <= 0 ? 0 : (window.scrollY / max) * 100;
      if (fillRef.current) fillRef.current.style.width = pct + "%";
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="top-prog" aria-hidden="true">
      <div className="top-prog-fill" ref={fillRef} />
    </div>
  );
}
