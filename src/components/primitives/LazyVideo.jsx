import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

/**
 * Defers setting video src until near viewport. Reduces initial bandwidth and decode work.
 */
const LazyVideo = forwardRef(function LazyVideo({
  src,
  className = "",
  rootMargin = "240px 0px",
  autoPlayWhenVisible = false,
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
    if (!autoPlayWhenVisible || !loaded) return;
    const el = ref.current;
    if (!el) return;
    const play = () => el.play().catch(() => {});
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
  }, [autoPlayWhenVisible, loaded]);

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
