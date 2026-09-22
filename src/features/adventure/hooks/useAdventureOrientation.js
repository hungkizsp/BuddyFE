/**
 * useAdventureOrientation
 *
 * Manages two things for adventure game pages:
 *  1. Portrait-mode detection on mobile → signals that the rotate overlay should show.
 *  2. Fullscreen entry/exit via the Fullscreen API (with vendor fallbacks).
 *
 * Usage:
 *   const { isPortrait, isMobile, isFullscreen, requestFullscreen, exitFullscreen } =
 *     useAdventureOrientation(containerRef);
 */

import { useCallback, useEffect, useState } from 'react';

/** Returns true when the device is likely a phone or small tablet (≤ 1024 logical px wide). */
function detectMobile() {
  return window.matchMedia('(max-width: 1024px)').matches;
}

/** Returns true when the current orientation is portrait. */
function detectPortrait() {
  // Prefer the modern Screen Orientation API
  if (screen.orientation?.type) {
    return screen.orientation.type.startsWith('portrait');
  }
  // Fallback: compare inner dimensions
  return window.innerHeight > window.innerWidth;
}

export default function useAdventureOrientation(containerRef) {
  const [isMobile, setIsMobile] = useState(detectMobile);
  const [isPortrait, setIsPortrait] = useState(detectPortrait);
  const [isFullscreen, setIsFullscreen] = useState(false);

  /* ── Orientation & resize listener ───────────────────────────────── */
  useEffect(() => {
    const update = () => {
      setIsMobile(detectMobile());
      setIsPortrait(detectPortrait());
    };

    // Modern API
    screen.orientation?.addEventListener?.('change', update);
    // Legacy + resize (catches desktop DevTools simulation)
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);

    return () => {
      screen.orientation?.removeEventListener?.('change', update);
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);

  /* ── Fullscreen change listener ──────────────────────────────────── */
  useEffect(() => {
    const onFsChange = () => {
      const el =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement;
      setIsFullscreen(Boolean(el));
    };

    document.addEventListener('fullscreenchange', onFsChange);
    document.addEventListener('webkitfullscreenchange', onFsChange);
    document.addEventListener('mozfullscreenchange', onFsChange);
    document.addEventListener('MSFullscreenChange', onFsChange);

    return () => {
      document.removeEventListener('fullscreenchange', onFsChange);
      document.removeEventListener('webkitfullscreenchange', onFsChange);
      document.removeEventListener('mozfullscreenchange', onFsChange);
      document.removeEventListener('MSFullscreenChange', onFsChange);
    };
  }, []);

  /* ── Request fullscreen ───────────────────────────────────────────── */
  const requestFullscreen = useCallback(async () => {
    const el = containerRef?.current ?? document.documentElement;
    try {
      if (el.requestFullscreen) {
        await el.requestFullscreen({ navigationUI: 'hide' });
      } else if (el.webkitRequestFullscreen) {
        await el.webkitRequestFullscreen();
      } else if (el.mozRequestFullScreen) {
        await el.mozRequestFullScreen();
      } else if (el.msRequestFullscreen) {
        await el.msRequestFullscreen();
      }

      // On Android/Chrome we can also lock to landscape after fullscreen
      try {
        await screen.orientation?.lock?.('landscape');
      } catch {
        // Not supported on all browsers – ignore
      }
    } catch (err) {
      console.warn('Fullscreen request failed:', err);
    }
  }, [containerRef]);

  /* ── Exit fullscreen ─────────────────────────────────────────────── */
  const exitFullscreen = useCallback(async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        await document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        await document.msExitFullscreen();
      }

      try {
        await screen.orientation?.unlock?.();
      } catch {
        // Ignore
      }
    } catch (err) {
      console.warn('Exit fullscreen failed:', err);
    }
  }, []);

  return { isMobile, isPortrait, isFullscreen, requestFullscreen, exitFullscreen };
}
