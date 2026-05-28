import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/device";

/**
 * Defers video src until near viewport. Pauses off-screen and when tab is hidden.
 */
const LazyVideo = forwardRef(function LazyVideo({
  src,
  poster,
  className = "",
  rootMargin = "240px 0px",
  autoPlayWhenVisible = false,
  loop = false,
  onReady,
  ...rest
}, forwardedRef) {
  const ref = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const visibleRef = useRef(false);

  useImperativeHandle(forwardedRef, () => ref.current);

  useEffect(() => {
    const el = ref.current;
    if (!el || !src) return;

    const attach = () => {
      if (el.dataset.lazyLoaded) return;
      el.dataset.lazyLoaded = "1";
      el.src = src;
      setLoaded(true);
    };

    if (!("IntersectionObserver" in window)) {
      attach();
      return undefined;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          attach();
          io.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [src, rootMargin]);

  useEffect(() => {
    if (!autoPlayWhenVisible || !loaded || prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;

    let playing = false;

    const tryPlay = () => {
      if (!visibleRef.current || document.hidden || playing) return;
      if (el.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) {
        el.addEventListener("canplay", tryPlay, { once: true });
        return;
      }
      const result = el.play();
      if (result && typeof result.then === "function") {
        playing = true;
        result
          .then(() => { playing = false; })
          .catch(() => { playing = false; });
      }
    };

    const pause = () => {
      playing = false;
      el.pause();
    };

    const sync = () => {
      if (visibleRef.current && !document.hidden) tryPlay();
      else pause();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        sync();
      },
      { threshold: 0.25 },
    );
    io.observe(el);

    const onVisibility = () => sync();
    document.addEventListener("visibilitychange", onVisibility);

    sync();

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      pause();
    };
  }, [autoPlayWhenVisible, loaded]);

  return (
    <video
      ref={ref}
      className={className}
      poster={poster}
      muted
      playsInline
      loop={loop}
      preload="none"
      disablePictureInPicture
      onLoadedData={onReady}
      {...rest}
    />
  );
});

export default LazyVideo;
