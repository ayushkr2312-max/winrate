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
import AboutUs from "@/components/sections/AboutUs";
import SystemManifest from "@/components/sections/SystemManifest";
import BridgeSection from "@/components/sections/BridgeSection";
import ProblemToSolution from "@/components/sections/ProblemToSolution";
import Solutions from "@/components/sections/Solutions";
import Ticker from "@/components/sections/Ticker";
import WhatWeDo from "@/components/sections/WhatWeDo";
import Manifesto from "@/components/sections/Manifesto";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function App() {
  const [booted, setBooted] = useState(false);
  const { isMobile, reducedMotion, useLenis: lenisOn } = useDeviceProfile();
  useLenis();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("is-mobile", isMobile);
    root.classList.toggle("is-reduced-motion", reducedMotion);
    root.classList.toggle("is-lenis", lenisOn);
    return () => {
      root.classList.remove("is-mobile", "is-reduced-motion", "is-lenis");
    };
  }, [isMobile, reducedMotion, lenisOn]);

  const onBoot = useCallback(() => {
    setBooted(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => ScrollTrigger.refresh(true));
    });
  }, []);

  return (
    <>
      {!isMobile && <HeroCanvas />}
      <div className="site-watermark" aria-hidden="true">WINRVTE</div>
      <div className="scanlines" aria-hidden="true" />
      <TopProgress />
      <Rail />
      <div className="left-edge-line" aria-hidden="true" />
      <div className="right-edge-line" aria-hidden="true" />
      <MobileNav />

      <Loader onDone={onBoot} />

      <Hero playEntrance={booted} />
      <AboutUs />
      <BridgeSection />
      <ProblemToSolution />
      <Solutions />
      <Ticker invert />
      <WhatWeDo />
      <Manifesto />
      <Contact />
      <Footer />
    </>
  );
}
