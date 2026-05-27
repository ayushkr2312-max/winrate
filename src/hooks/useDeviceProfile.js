import { useEffect, useState } from "react";
import {
  MQ_COARSE,
  MQ_MOBILE,
  MQ_REDUCED,
  isCoarsePointer,
  isMobileViewport,
  prefersReducedMotion,
  shouldUseLenis,
} from "@/lib/device";

export default function useDeviceProfile() {
  const [profile, setProfile] = useState(() => ({
    isMobile: isMobileViewport(),
    isCoarse: isCoarsePointer(),
    reducedMotion: prefersReducedMotion(),
    useLenis: shouldUseLenis(),
  }));

  useEffect(() => {
    const queries = [MQ_MOBILE, MQ_REDUCED, MQ_COARSE].map((q) => window.matchMedia(q));
    const sync = () => {
      setProfile({
        isMobile: isMobileViewport(),
        isCoarse: isCoarsePointer(),
        reducedMotion: prefersReducedMotion(),
        useLenis: shouldUseLenis(),
      });
    };
    queries.forEach((mq) => mq.addEventListener("change", sync));
    sync();
    return () => queries.forEach((mq) => mq.removeEventListener("change", sync));
  }, []);

  return profile;
}
