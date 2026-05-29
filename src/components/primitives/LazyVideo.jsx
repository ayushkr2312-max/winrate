import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { BOOT_PRELOAD_DONE, isBootAssetReady } from "@/lib/bootPreload";

/**
 * Defers setting video src until near viewport — unless boot preload already cached it.
 */
const LazyVideo = forwardRef(function LazyVideo({
  src,
  className = "",
  rootMargin = "320px 0px",
  autoPlayWhenVisible = false,
  visibilityRootRef = null,
  visibilityThreshold = 0.06,
  playbackRate = 1,
  onReady,
  ...rest
}, forwardedRef) {
  const ref = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useImperativeHandle(forwardedRef, () => ref.current);

  useEffect(() => {
    const el = ref.current;
    if (!el || !src) return;

    const attach = () => {
      if (el.dataset.lazyLoaded) return;
      el.dataset.lazyLoaded = "1";
      el.src = src;
      el.preload = "auto";
      setLoaded(true);
    };

    if (isBootAssetReady(src)) {
      attach();
      return undefined;
    }

    const onBootReady = () => {
      if (isBootAssetReady(src)) attach();
    };
    window.addEventListener(BOOT_PRELOAD_DONE, onBootReady);

    if (!("IntersectionObserver" in window)) {
      attach();
      return () => window.removeEventListener(BOOT_PRELOAD_DONE, onBootReady);
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

    return () => {
      io.disconnect();
      window.removeEventListener(BOOT_PRELOAD_DONE, onBootReady);
    };
  }, [src, rootMargin]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !loaded || playbackRate === 1) return;
    el.playbackRate = playbackRate;
  }, [loaded, playbackRate]);

  useEffect(() => {
    if (!loaded) return;
    const el = ref.current;
    if (!el) return;

    const root = visibilityRootRef?.current;
    if (root) {
      el.muted = true;
      const play = () => { el.play().catch(() => {}); };
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) play();
          else el.pause();
        },
        { threshold: visibilityThreshold },
      );
      io.observe(root);
      const { top, bottom } = root.getBoundingClientRect();
      if (bottom > 0 && top < window.innerHeight) play();
      return () => io.disconnect();
    }

    if (!autoPlayWhenVisible) return undefined;

    const play = () => { el.play().catch(() => {}); };
    play();
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) play();
        else el.pause();
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [autoPlayWhenVisible, loaded, visibilityRootRef, visibilityThreshold]);

  return (
    <video
      ref={ref}
      className={className}
      muted
      playsInline
      preload="none"
      onLoadedData={onReady}
      {...rest}
    />
  );
});

export default LazyVideo;
