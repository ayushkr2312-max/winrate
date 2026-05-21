import { useCallback, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "@/hooks/useLenis";

gsap.registerPlugin(ScrollTrigger);

import Loader from "@/components/shell/Loader";
import TopProgress from "@/components/shell/TopProgress";
import Rail from "@/components/shell/Rail";
import MobileNav from "@/components/shell/MobileNav";
import HeroCanvas from "@/components/hero/HeroCanvas";

import Hero from "@/components/sections/Hero";
import BridgeSection from "@/components/sections/BridgeSection";
import ProblemToSolution from "@/components/sections/ProblemToSolution";
import Solutions from "@/components/sections/Solutions";
import Ticker from "@/components/sections/Ticker";
import Stats from "@/components/sections/Stats";
import WhatWeDo from "@/components/sections/WhatWeDo";
import StackSection from "@/components/sections/StackSection";
import Manifesto from "@/components/sections/Manifesto";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function App() {
  const [booted, setBooted] = useState(false);
  useLenis();

  // Once the loader unlocks the body, recalc every ScrollTrigger so triggers
  // that were created while scrolling was locked have correct positions.
  const onBoot = useCallback(() => {
    setBooted(true);
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  }, []);

  return (
    <>
      <HeroCanvas />
      <div className="site-watermark" aria-hidden="true">WINRVTE</div>
      <div className="scanlines" aria-hidden="true" />
      <TopProgress />
      <Rail />
      <div className="left-edge-line" aria-hidden="true" />
      <div className="right-edge-line" aria-hidden="true" />
      <MobileNav />

      <Loader onDone={onBoot} />

      <Hero playEntrance={booted} />
      <BridgeSection />
      <ProblemToSolution />
      <Solutions />
      <Ticker invert />
      <Stats />
      <WhatWeDo />
      <StackSection />
      <Manifesto />
      <Contact />
      <Footer />
    </>
  );
}
