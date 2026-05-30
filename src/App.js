import { useCallback, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "@/hooks/useLenis";
import useDeviceProfile from "@/hooks/useDeviceProfile";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ limitCallbacks: true });

import Loader from "@/components/shell/Loader";
import TopProgress from "@/components/shell/TopProgress";
import Rail from "@/components/shell/Rail";
import MobileNav from "@/components/shell/MobileNav";
import HeroCanvas from "@/components/hero/HeroCanvas";

import Hero from "@/components/sections/Hero";
import AboutUs, { HelpYouSection } from "@/components/sections/AboutUs";
import BridgeSection from "@/components/sections/BridgeSection";
import ProblemToSolution from "@/components/sections/ProblemToSolution";
import Solutions from "@/components/sections/Solutions";
import StackSection from "@/components/sections/StackSection";
import Manifesto from "@/components/sections/Manifesto";
import Contact from "@/components/sections/Contact";

export default function App() {
  const [booted, setBooted] = useState(false);
  const { isMobile, useLenis: lenisOn } = useDeviceProfile();
  useLenis();

  useEffect(() => {
    document.title = "WINRVTE — Esports Technology Agency";
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("is-mobile", isMobile);
    root.classList.toggle("is-lenis", lenisOn);
    return () => {
      root.classList.remove("is-mobile", "is-lenis");
    };
  }, [isMobile, lenisOn]);

  const onBoot = useCallback(() => {
    setBooted(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => ScrollTrigger.refresh(true));
    });
  }, []);

  return (
    <>
      {booted && <HeroCanvas />}
      <div className="site-watermark" aria-hidden="true">WINRVTE</div>
      <div className="scanlines" aria-hidden="true" />
      <TopProgress />
      <Rail />
      <div className="left-edge-line" aria-hidden="true" />
      <div className="right-edge-line" aria-hidden="true" />
      <MobileNav />

      <Loader onDone={onBoot} />

      <Hero playEntrance={booted} />
      {booted && (
        <>
          <AboutUs />
          <BridgeSection />
          <ProblemToSolution />
          <Solutions />
          <HelpYouSection />
          <StackSection />
          <Manifesto />
          <Contact />
        </>
      )}
    </>
  );
}
