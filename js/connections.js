/**
 * connections.js — SVG connection lines between nodes.
 *
 * Draws n8n-style bezier curves and animates them with
 * a draw-on effect plus traveling dots.
 *
 * Phase 5 performance optimization:
 *   - Path coordinates are pre-sampled once into a lookup table
 *     (zero per-frame getPointAtLength() calls).
 *   - Dots move using CSS transform: translate3d(x, y, 0) instead
 *     of mutating cx/cy attributes every frame.
 *   - Traveling dots pause automatically when an overlay is open,
 *     when the tab is hidden, or when prefers-reduced-motion is set.
 *
 * Exports:
 *   createConnection(svgEl, x1, y1, x2, y2) → SVGPathElement
 *   animateDrawOn(path, duration)            → GSAP tween
 *   addTravelingDots(svgEl, path, count)     → cleanup function
 *   setDotsPaused(bool)                      → pause/resume all active dots
 *   clearConnections(svgEl)
 */

/* global gsap */

const SVG_NS = 'http://www.w3.org/2000/svg';
const SAMPLE_STEPS = 60;

/** All active dot tweens so we can pause/resume them globally */
const activeDotTweens = new Set();

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Build an n8n-style horizontal bezier path string.
 * Control points extend horizontally from each handle.
 */
function bezierPath(x1, y1, x2, y2) {
  const dx = Math.abs(x2 - x1) * 0.45;
  return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
}

/**
 * Create an SVG <path> for a connection line (not yet visible).
 * The path starts fully hidden (dashoffset = full length).
 */
export function createConnection(svgEl, x1, y1, x2, y2) {
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', bezierPath(x1, y1, x2, y2));
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', '#4a4b55');
  path.setAttribute('stroke-width', '2');
  path.setAttribute('stroke-linecap', 'round');

  svgEl.appendChild(path);
  const len = path.getTotalLength();
  path.style.strokeDasharray = len;
  path.style.strokeDashoffset = prefersReducedMotion() ? 0 : len;

  return path;
}

/**
 * Animate the path drawing from start to end.
 * Returns the GSAP tween.
 */
export function animateDrawOn(path, duration = 0.8) {
  if (prefersReducedMotion()) {
    path.style.strokeDashoffset = 0;
    return gsap.to({}, { duration: 0.01 });
  }
  return gsap.to(path.style, {
    strokeDashoffset: 0,
    duration,
    ease: 'power2.inOut',
  });
}

/**
 * Pre-sample points along an SVG path once so per-frame updates
 * only do a fast array interpolation.
 */
function preSamplePath(path, steps = SAMPLE_STEPS) {
  const len = path.getTotalLength();
  const pts = new Array(steps + 1);
  for (let i = 0; i <= steps; i++) {
    const p = path.getPointAtLength((i / steps) * len);
    pts[i] = { x: p.x, y: p.y };
  }
  return pts;
}

/**
 * Add small circles that travel along the path repeatedly using transform.
 * Returns a cleanup function to remove them.
 *
 * @param {SVGElement} svgEl
 * @param {SVGPathElement} path
 * @param {number} count — number of dots
 * @returns {Function} cleanup
 */
export function addTravelingDots(svgEl, path, count = 3) {
  const pts = preSamplePath(path, SAMPLE_STEPS);
  const dots = [];
  const tweens = [];
  const reduced = prefersReducedMotion();

  for (let i = 0; i < count; i++) {
    const circle = document.createElementNS(SVG_NS, 'circle');
    circle.setAttribute('cx', '0');
    circle.setAttribute('cy', '0');
    circle.setAttribute('r', '3');
    circle.setAttribute('fill', '#ff6d5a');
    circle.setAttribute('opacity', '0.75');
    circle.style.willChange = 'transform';
    svgEl.appendChild(circle);
    dots.push(circle);

    if (reduced) {
      // Static dot placement for reduced-motion preference
      const midIdx = Math.floor(((i + 1) / (count + 1)) * SAMPLE_STEPS);
      const p = pts[midIdx];
      circle.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0)`;
      continue;
    }

    const proxy = { t: 0 };
    const tween = gsap.to(proxy, {
      t: SAMPLE_STEPS,
      duration: 1.9,
      ease: 'none',
      repeat: -1,
      delay: i * (1.9 / count),
      onUpdate: () => {
        const idx = Math.floor(proxy.t);
        const frac = proxy.t - idx;
        const p0 = pts[idx] || pts[0];
        const p1 = pts[idx + 1] || p0;
        const x = p0.x + (p1.x - p0.x) * frac;
        const y = p0.y + (p1.y - p0.y) * frac;
        circle.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      },
    });

    tweens.push(tween);
    activeDotTweens.add(tween);
  }

  return () => {
    tweens.forEach((tw) => {
      activeDotTweens.delete(tw);
      tw.kill();
    });
    dots.forEach((d) => d.remove());
  };
}

/**
 * Pause or resume all traveling dot animations (e.g. while modals are open).
 */
export function setDotsPaused(paused) {
  activeDotTweens.forEach((tw) => {
    if (paused) tw.pause();
    else tw.resume();
  });
}

/**
 * Remove all paths and circles from the SVG.
 */
export function clearConnections(svgEl) {
  activeDotTweens.forEach((tw) => tw.kill());
  activeDotTweens.clear();
  while (svgEl.firstChild) {
    svgEl.removeChild(svgEl.firstChild);
  }
}

// Automatically pause dot animations when browser tab is hidden
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    setDotsPaused(document.hidden);
  });
}
