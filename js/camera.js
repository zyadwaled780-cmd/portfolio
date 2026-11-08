/**
 * camera.js — Small camera helper for panning/zooming the world container.
 *
 * The "camera" works by transforming the .world div with translate3d + scale
 * so that a given world-space coordinate appears at the center of the viewport.
 *
 * Phase 5 polish:
 *   - Uses GPU-composited translate3d()
 *   - Respects prefers-reduced-motion
 *   - Supports live rubber-band drag offset (cameraDragOffset)
 *
 * Exports:
 *   initCamera(viewportEl, worldEl)
 *   cameraTo(x, y, scale, duration, ease) → GSAP tween
 *   cameraSet(x, y, scale)                → instant jump
 *   cameraDragOffset(dx, dy)              → rubber-band drag feedback
 *   getCameraState()                      → { x, y, scale }
 */

/* global gsap */

/** Internal state */
const cam = { x: 0, y: 0, scale: 1, dragX: 0, dragY: 0 };
let viewport = null;
let world = null;

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Apply current camera state to the world transform.
 * Called every GSAP frame during animation and on resize.
 * Automatically scales down slightly on narrow mobile viewports (<= 768px)
 * so wide nodes (like the 380px Intro card) fit with comfortable margins.
 */
function applyTransform() {
  if (!viewport || !world) return;
  const vw = viewport.clientWidth;
  const vh = viewport.clientHeight;
  const isMobile = vw <= 768;

  // On mobile viewports, scale node-focus views proportionally so 380px cards fit inside 375px screens
  const responsiveFactor = (isMobile && cam.scale > 0.5)
    ? Math.min(1, (vw - 28) / 395)
    : 1;
  const effectiveScale = cam.scale * responsiveFactor;

  // Slight upward offset on mobile so active node sits centered between topbar and bottom dock
  const mobileOffsetY = (isMobile && cam.scale > 0.5) ? -18 : 0;

  const tx = vw / 2 - cam.x * effectiveScale + cam.dragX;
  const ty = vh / 2 - cam.y * effectiveScale + cam.dragY + mobileOffsetY;
  world.style.transform =
    `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) scale(${effectiveScale.toFixed(4)})`;
}

/**
 * Initialize the camera system.
 * @param {HTMLElement} viewportEl — the .viewport element
 * @param {HTMLElement} worldEl   — the .world element inside it
 */
export function initCamera(viewportEl, worldEl) {
  viewport = viewportEl;
  world = worldEl;

  // Re-center on resize
  window.addEventListener('resize', applyTransform);
  applyTransform();
}

/**
 * Animate the camera to center on (x, y) at a given scale.
 * Returns the GSAP tween so callers can chain / await.
 *
 * @param {number} x        — world x to center on
 * @param {number} y        — world y to center on
 * @param {number} [scale=1]    — zoom level
 * @param {number} [duration=1] — seconds
 * @param {string} [ease='power3.inOut']
 * @returns {gsap.core.Tween}
 */
export function cameraTo(x, y, scale = 1, duration = 1, ease = 'power3.inOut') {
  const actualDuration = prefersReducedMotion() ? 0.01 : duration;
  return gsap.to(cam, {
    x,
    y,
    scale,
    dragX: 0,
    dragY: 0,
    duration: actualDuration,
    ease,
    overwrite: 'auto',
    onUpdate: applyTransform,
  });
}

/**
 * Instantly jump the camera (no animation).
 */
export function cameraSet(x, y, scale = 1) {
  gsap.killTweensOf(cam);
  cam.x = x;
  cam.y = y;
  cam.scale = scale;
  cam.dragX = 0;
  cam.dragY = 0;
  applyTransform();
}

/**
 * Apply a live pixel offset during canvas drag for tactile feedback.
 */
export function cameraDragOffset(dx = 0, dy = 0, snapBack = false) {
  if (snapBack) {
    gsap.to(cam, {
      dragX: 0,
      dragY: 0,
      duration: prefersReducedMotion() ? 0.01 : 0.35,
      ease: 'power3.out',
      onUpdate: applyTransform,
    });
  } else {
    cam.dragX = dx;
    cam.dragY = dy;
    applyTransform();
  }
}

/**
 * Read-only snapshot of current camera state.
 */
export function getCameraState() {
  return { ...cam };
}
