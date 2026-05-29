import { isMobileViewport } from "./device";

export const BOOT_PRELOAD_DONE = "boot-preload-done";

const preloaded = new Set();
let bootComplete = false;

const POSTERS = [
  "/rail-logo-poster.webp",
  "/new-web-reel-poster.webp",
];

const SECTION_VIDEOS = [
  "/Scene_abt.webm",
  "/Scene_x.webm",
  "/repeater-animation.webm",
  "/new-web-reel.webm",
];

const DESKTOP_VIDEOS = [
  "/luma-dot-bg.webm",
];

const VIDEO_TIMEOUT_MS = 18000;
const IMAGE_TIMEOUT_MS = 8000;

export function isBootAssetReady(src) {
  if (!src) return bootComplete;
  return preloaded.has(src) || bootComplete;
}

export function isBootPreloadComplete() {
  return bootComplete;
}

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((resolve) => { window.setTimeout(resolve, ms); }),
  ]);
}

function preloadImage(src) {
  return withTimeout(
    new Promise((resolve) => {
      const img = new Image();
      const finish = () => {
        preloaded.add(src);
        resolve();
      };
      img.onload = finish;
      img.onerror = finish;
      img.src = src;
    }),
    IMAGE_TIMEOUT_MS,
  );
}

function preloadVideo(src) {
  if (preloaded.has(src)) return Promise.resolve();

  return withTimeout(
    new Promise((resolve) => {
      const video = document.createElement("video");
      video.muted = true;
      video.playsInline = true;
      video.preload = "auto";

      const finish = () => {
        preloaded.add(src);
        video.removeAttribute("src");
        video.load();
        resolve();
      };

      video.addEventListener("loadeddata", finish, { once: true });
      video.addEventListener("error", finish, { once: true });
      video.src = src;
      video.load();
    }),
    VIDEO_TIMEOUT_MS,
  );
}

export function getBootAssets() {
  const mobile = isMobileViewport();
  return [
    ...POSTERS,
    ...SECTION_VIDEOS,
    ...(mobile ? [] : DESKTOP_VIDEOS),
  ];
}

export async function runBootPreload(onProgress) {
  const assets = getBootAssets();
  if (!assets.length) {
    bootComplete = true;
    onProgress?.(1);
    window.dispatchEvent(new Event(BOOT_PRELOAD_DONE));
    return;
  }

  let finished = 0;
  const tick = () => {
    finished += 1;
    onProgress?.(finished / assets.length);
  };

  await Promise.all(
    assets.map(async (src) => {
      try {
        if (/\.webm$/i.test(src)) {
          await preloadVideo(src);
        } else {
          await preloadImage(src);
        }
      } finally {
        tick();
      }
    }),
  );

  bootComplete = true;
  onProgress?.(1);
  window.dispatchEvent(new Event(BOOT_PRELOAD_DONE));
}
