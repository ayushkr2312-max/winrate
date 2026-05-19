import { useEffect, useState } from "react";

const LINKS = [
  { id: "problem", label: "Problems", idx: "01" },
  { id: "solutions", label: "Solutions", idx: "02" },
  { id: "stats", label: "Outcomes", idx: "03" },
  { id: "what-we-do", label: "Why Winrvte", idx: "04" },
  { id: "manifesto", label: "About", idx: "05" },
  { id: "contact", label: "Contact", idx: "06" },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let rafId = 0;
    let last = false;
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        const next = window.scrollY > 40;
        if (next === last) return;
        last = next;
        setScrolled(next);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <header className={"mob-hdr" + (scrolled ? " is-scrolled" : "")}>
        <a href="#hero" className="mob-logo">WIN<span className="a">R</span>VTE</a>
        <button className={"mob-burger" + (open ? " is-open" : "")} onClick={() => setOpen((v) => !v)} aria-label="Toggle navigation" aria-expanded={open}>
          <span /><span /><span />
        </button>
      </header>

      <div className={"mob-overlay" + (open ? " is-open" : "")} role="dialog" aria-modal="true">
        {LINKS.map((l) => (
          <a key={l.id} href={`#${l.id}`} className="mob-link" onClick={() => setOpen(false)}>
            <span className="idx">{l.idx}</span>
            <span>{l.label}</span>
          </a>
        ))}
      </div>
    </>
  );
}
