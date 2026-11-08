/**
 * Client-Side YouTube Duration Prober
 * Loads the official YouTube IFrame API to probe exact video length in the browser.
 * Fully compatible with static export (`output: "export"`) and works on all browsers.
 */

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export function formatSecondsToDuration(totalSec: number): string {
  if (isNaN(totalSec) || totalSec <= 0) return "";
  const hours = Math.floor(totalSec / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;
  return hours > 0
    ? `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    : `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

let ytApiLoading = false;
let ytApiReady = false;
const readyCallbacks: Array<() => void> = [];

function loadYouTubeIframeApi(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve();
      return;
    }

    if (window.YT && window.YT.Player) {
      ytApiReady = true;
      resolve();
      return;
    }

    readyCallbacks.push(resolve);

    if (ytApiLoading) return;
    ytApiLoading = true;

    const prevReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      ytApiReady = true;
      if (typeof prevReady === "function") prevReady();
      while (readyCallbacks.length > 0) {
        const cb = readyCallbacks.shift();
        if (cb) cb();
      }
    };

    const existingScript = document.getElementById("youtube-iframe-api-script");
    if (!existingScript) {
      const tag = document.createElement("script");
      tag.id = "youtube-iframe-api-script";
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }
  });
}

// In-memory cache for probed durations
const durationCache = new Map<string, string>();

export async function probeYouTubeDuration(videoId: string): Promise<string> {
  if (!videoId || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) return "";
  if (durationCache.has(videoId)) {
    return durationCache.get(videoId)!;
  }

  if (typeof window === "undefined") return "";

  await loadYouTubeIframeApi();

  if (!window.YT || !window.YT.Player) return "";

  return new Promise((resolve) => {
    const probeContainer = document.createElement("div");
    probeContainer.style.cssText =
      "position:fixed;top:-9999px;left:-9999px;width:120px;height:120px;opacity:0;pointer-events:none;z-index:-9999;";
    document.body.appendChild(probeContainer);

    let finished = false;
    let pollInterval: NodeJS.Timeout | null = null;
    let fallbackTimeout: NodeJS.Timeout | null = null;
    let playerInstance: any = null;

    const cleanup = () => {
      if (finished) return;
      finished = true;
      if (pollInterval) clearInterval(pollInterval);
      if (fallbackTimeout) clearTimeout(fallbackTimeout);
      try {
        if (playerInstance && typeof playerInstance.destroy === "function") {
          playerInstance.destroy();
        }
      } catch {}
      try {
        probeContainer.remove();
      } catch {}
    };

    const finishWith = (formatted: string) => {
      cleanup();
      if (formatted) {
        durationCache.set(videoId, formatted);
      }
      resolve(formatted);
    };

    fallbackTimeout = setTimeout(() => {
      finishWith("");
    }, 4500);

    try {
      playerInstance = new window.YT.Player(probeContainer, {
        videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
        },
        events: {
          onReady: (event: any) => {
            let attempts = 0;
            pollInterval = setInterval(() => {
              attempts++;
              try {
                const duration = event?.target?.getDuration
                  ? event.target.getDuration()
                  : 0;
                const sec = Math.floor(duration);
                if (sec > 0) {
                  finishWith(formatSecondsToDuration(sec));
                } else if (attempts > 25) {
                  finishWith("");
                }
              } catch {
                if (attempts > 25) finishWith("");
              }
            }, 100);
          },
          onError: () => {
            finishWith("");
          },
        },
      });
    } catch {
      finishWith("");
    }
  });
}
