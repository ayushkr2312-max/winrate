export const MQ_MOBILE = "(max-width: 768px)";
export const MQ_TABLET = "(max-width: 1024px)";
export const MQ_REDUCED = "(prefers-reduced-motion: reduce)";
export const MQ_COARSE = "(pointer: coarse)";

export function matchMq(query) {
  if (typeof window === "undefined") return false;
  return window.matchMedia(query).matches;
}

export function prefersReducedMotion() {
  return matchMq(MQ_REDUCED);
}

export function isMobileViewport() {
  return matchMq(MQ_MOBILE);
}

export function isCoarsePointer() {
  return matchMq(MQ_COARSE);
}

/** Native scroll is smoother on mobile; Lenis + ST pin often fight touch scrolling. */
export function shouldUseLenis() {
  return !prefersReducedMotion() && !isMobileViewport();
}
