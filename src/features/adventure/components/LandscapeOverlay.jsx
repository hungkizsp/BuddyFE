/**
 * LandscapeOverlay
 *
 * - Portrait + mobile  → Full-screen "please rotate" overlay with a
 *   tap-to-fullscreen button (works as user gesture on Android Chrome).
 * - Landscape + mobile + fullscreen → small ✕ exit button (bottom-right,
 *   clear of the mute button which sits top-right).
 * - Landscape + mobile + NOT fullscreen → nothing rendered (avoid cluttering
 *   the game UI with a button that silently fails on iOS Safari).
 */

import './LandscapeOverlay.css';

/** True when the Fullscreen API is available at all (not on iOS Safari). */
function canFullscreen() {
  return !!(
    document.fullscreenEnabled ||
    document.webkitFullscreenEnabled ||
    document.mozFullScreenEnabled
  );
}

export default function LandscapeOverlay({
  isPortrait,
  isMobile,
  isFullscreen,
  onRequestFullscreen,
  onExitFullscreen,
}) {
  /* ── Rotate overlay – only shown on mobile in portrait ── */
  if (isMobile && isPortrait) {
    return (
      <div className="ls-overlay" role="dialog" aria-modal="true" aria-label="Rotate your device">
        {/* Animated phone icon */}
        <div className="ls-overlay__icon" aria-hidden="true">
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="ls-overlay__phone">
            <rect x="8" y="4" width="28" height="48" rx="5" stroke="white" strokeWidth="3.5" fill="none" />
            <circle cx="22" cy="46" r="2.5" fill="white" />
            <path
              d="M44 20 C44 20 54 20 54 32 C54 44 44 44 44 44"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M48 36 L54 44 L44 44"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="ls-overlay__arrow" aria-hidden="true">↻</div>
        </div>

        <h2 className="ls-overlay__title">Xoay Màn Hình</h2>
        <p className="ls-overlay__desc">
          Hãy xoay ngang điện thoại<br />để bắt đầu cuộc phiêu lưu! 🎮
        </p>

        {/* Only show fullscreen button if the API is supported (not iOS Safari) */}
        {canFullscreen() && (
          <button
            type="button"
            className="ls-overlay__fs-btn"
            onClick={onRequestFullscreen}
          >
            <span className="ls-overlay__fs-icon">⛶</span>
            Chế độ toàn màn hình
          </button>
        )}
      </div>
    );
  }

  /* ── Exit-fullscreen button – only when actually in fullscreen ── */
  /* Placed bottom-right to avoid overlapping the mute button (top-right) */
  if (isMobile && isFullscreen) {
    return (
      <button
        type="button"
        className="ls-fs-toggle"
        title="Thoát toàn màn hình"
        onClick={onExitFullscreen}
        aria-label="Thoát toàn màn hình"
      >
        ✕
      </button>
    );
  }

  return null;
}
