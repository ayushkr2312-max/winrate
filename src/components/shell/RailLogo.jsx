import { useCallback, useEffect, useRef, useState } from "react";
import { MQ_MOBILE, isMobileViewport } from "@/lib/device";

const LOGO_VIDEO = "/luma-dot-bg-nav.webm";
const LOGO_POSTER = "/rail-logo-poster.webp";

function attachVideoSource(video) {
  if (!video || video.dataset.srcAttached) return;
  video.dataset.srcAttached = "1";
  video.src = LOGO_VIDEO;
  video.load();
}

export default function RailLogo() {
  const videoRef = useRef(null);
  const playPromiseRef = useRef(null);
  const [mobile, setMobile] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const sync = () => setMobile(isMobileViewport());
    sync();
    const mq = window.matchMedia(MQ_MOBILE);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const parkAtEnd = useCallback(() => {
    const v = videoRef.current;
    if (!v || !Number.isFinite(v.duration) || v.duration <= 0) return;
    v.pause();
    try {
      v.currentTime = Math.max(0, v.duration - 0.04);
    } catch {
      /* seek may fail before enough data is buffered */
    }
  }, []);

  useEffect(() => {
    if (mobile || failed) return undefined;
    const v = videoRef.current;
    if (!v) return undefined;

    const onReady = () => {
      setReady(true);
      parkAtEnd();
    };
    const onError = () => setFailed(true);

    v.addEventListener("loadeddata", onReady);
    v.addEventListener("error", onError);

    const prefetch = () => attachVideoSource(v);
    let idleId = 0;
    let timeoutId = 0;

    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(prefetch, { timeout: 2500 });
    } else {
      timeoutId = window.setTimeout(prefetch, 500);
    }

    return () => {
      v.removeEventListener("loadeddata", onReady);
      v.removeEventListener("error", onError);
      if (idleId) window.cancelIdleCallback(idleId);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [mobile, failed, parkAtEnd]);

  const handleEnter = () => {
    const v = videoRef.current;
    if (!v || failed) return;

    attachVideoSource(v);

    const play = () => {
      try {
        v.currentTime = 0;
      } catch {
        /* ignore */
      }
      const result = v.play();
      playPromiseRef.current =
        result && typeof result.then === "function" ? result : null;
    };

    if (v.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      play();
      return;
    }

    const onCanPlay = () => play();
    v.addEventListener("canplay", onCanPlay, { once: true });
  };

  const handleLeave = () => {
    const v = videoRef.current;
    if (!v) return;

    const finish = () => parkAtEnd();
    const pending = playPromiseRef.current;
    playPromiseRef.current = null;

    if (pending && typeof pending.then === "function") {
      pending.finally(finish);
    } else {
      v.pause();
      finish();
    }
  };

  const handleEnded = () => {
    playPromiseRef.current = null;
    parkAtEnd();
  };

  if (mobile || failed) {
    return (
      <a
        href="#hero"
        className="rail-logo rail-logo--static"
        data-cursor-label="HOME"
        aria-label="WINRVTE Home"
      >
        <span className="rail-logo-mark" aria-hidden="true">W</span>
      </a>
    );
  }

  return (
    <a
      href="#hero"
      className="rail-logo"
      data-cursor-label="HOME"
      aria-label="WINRVTE Home"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
    >
      <video
        ref={videoRef}
        className={"rail-logo-video" + (ready ? " is-ready" : "")}
        poster={LOGO_POSTER}
        muted
        playsInline
        preload="none"
        disablePictureInPicture
        aria-hidden="true"
        onEnded={handleEnded}
      />
    </a>
  );
}
