import { useState } from "react";
import { useLenis } from "@/hooks/useLenis";

import Loader from "@/components/shell/Loader";
import TopProgress from "@/components/shell/TopProgress";
import Rail from "@/components/shell/Rail";
import MobileNav from "@/components/shell/MobileNav";
import FrameMeta from "@/components/shell/FrameMeta";
import HeroCanvas from "@/components/hero/HeroCanvas";

import Hero from "@/components/sections/Hero";
import Ticker from "@/components/sections/Ticker";
import BridgeSection from "@/components/sections/BridgeSection";
import Solutions from "@/components/sections/Solutions";
import Stats from "@/components/sections/Stats";
import WhatWeDo from "@/components/sections/WhatWeDo";
import EdgeSection from "@/components/sections/EdgeSection";
import StackSection from "@/components/sections/StackSection";
import Manifesto from "@/components/sections/Manifesto";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function App() {
  const [booted, setBooted] = useState(false);
  useLenis();

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
      <FrameMeta />

      <Loader onDone={() => setBooted(true)} />

      <Hero playEntrance={booted} />
      <BridgeSection />
      <Solutions />
      <Ticker invert />
      <Stats />
      <EdgeSection />
      <WhatWeDo />
      <StackSection />
      <Manifesto />
      <Contact />
      <Footer />
    </>
  );
}
