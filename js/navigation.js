/**
 * navigation.js — Workflow navigation system.
 *
 * Manages the ordered list of navigable nodes in the workflow,
 * handles prev/next movement, wheel, tactile rubber-band drag,
 * arrow keys, overview zoom-out mode, and magnetic snap to each node.
 *
 * Exports:
 *   initNavigation(opts)   — set up navigation on the viewport
 *   setNodes(nodeList)      — register the ordered node array
 *   setNavEnabled(bool)     — enable/disable user-driven navigation
 *   goTo(index, animate)    — navigate to node at index
 *   goNext() / goPrev()     — move forward / backward
 *   toggleOverview()        — zoom out to frame entire workflow or zoom back in
 *   getCurrentIndex()       — get current node index
 *   getNodeCount()          — total navigable nodes
 *   onNavigate(callback)    — register listener for nav changes
 */

/* global gsap */

import { cameraTo, cameraDragOffset } from './camera.js';
import { play } from './audio.js';

/* ================================================
   State
   ================================================ */

/** @type {Array<{el: HTMLElement, x: number, y: number, id: string}>} */
let nodes = [];
let currentIndex = 0;
let isAnimating = false;  // prevent rapid-fire wheel/drag/arrow nav
let unlockCall = null;
let enabled = false;      // navigation enabled? (disabled during reveal/modals)
let overviewMode = false; // zoomed-out full-workflow overview
let listeners = [];       // onNavigate callbacks

/* ================================================
   Public API
   ================================================ */

/**
 * Register the ordered list of navigable nodes.
 * Each entry: { el, x, y, id }
 */
export function setNodes(nodeList) {
  nodes = nodeList;
  currentIndex = 0;
  overviewMode = false;
  updateOverviewButton();
}

/**
 * Enable or disable user-driven navigation.
 * Use to prevent nav during reveal animations or open modals.
 */
export function setNavEnabled(val) {
  enabled = !!val;
}

/**
 * Navigate camera to a specific node index.
 * Plays tick sound and highlights the active node.
 *
 * @param {number} index — 0-based index in the nodes array
 * @param {boolean} [animate=true] — whether to animate or jump
 */
export function goTo(index, animate = true) {
  if (index < 0 || index >= nodes.length) return;

  const prevIndex = currentIndex;
  currentIndex = index;
  overviewMode = false;
  updateOverviewButton();

  const target = nodes[currentIndex];

  // Play tick if moving to a different node
  if (prevIndex !== currentIndex) {
    play('tick');
  }

  // Update highlights & button states
  updateHighlights();
  updateProgress();
  updateNavButtonStates();
  announceActiveNode(target);

  // Notify listeners
  listeners.forEach(fn => fn(currentIndex, prevIndex));

  if (animate) {
    isAnimating = true;
    if (unlockCall) unlockCall.kill();
    cameraTo(target.x, target.y, 1, 0.88, 'power3.inOut');
    unlockCall = gsap.delayedCall(0.7, () => { isAnimating = false; });
  } else {
    isAnimating = false;
  }
}

/** Move to the next node. */
export function goNext() {
  if (!enabled || isAnimating) return;
  if (overviewMode) {
    goTo(currentIndex, true);
    return;
  }
  if (currentIndex < nodes.length - 1) {
    goTo(currentIndex + 1);
  }
}

/** Move to the previous node. */
export function goPrev() {
  if (!enabled || isAnimating) return;
  if (overviewMode) {
    goTo(currentIndex, true);
    return;
  }
  if (currentIndex > 0) {
    goTo(currentIndex - 1);
  }
}

/**
 * Toggle full-workflow overview zoom-out mode.
 */
export function toggleOverview() {
  if (!enabled || nodes.length === 0) return;

  play('tick');
  overviewMode = !overviewMode;
  updateOverviewButton();

  if (overviewMode) {
    // Frame the middle of the entire workflow at a responsive zoomed-out scale
    const minX = Math.min(...nodes.map(n => n.x));
    const maxX = Math.max(...nodes.map(n => n.x));
    const centerX = (minX + maxX) / 2;

    const vp = document.getElementById('viewport');
    const vw = vp ? vp.clientWidth : window.innerWidth;
    const vh = vp ? vp.clientHeight : window.innerHeight;
    const spanX = (maxX - minX) + 460;
    const spanY = 1350;
    const fitScale = Math.max(0.09, Math.min(0.36, (vw * 0.92) / spanX, (vh * 0.78) / spanY));

    cameraTo(centerX, 0, fitScale, 1.0, 'power3.inOut');

    // Make all nodes clearly visible in overview mode
    nodes.forEach((node, i) => {
      gsap.to(node.el, {
        opacity: i === currentIndex ? 1 : 0.82,
        scale: 1,
        duration: 0.45,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    });
  } else {
    goTo(currentIndex, true);
  }
}

/** Get the current node index (0-based). */
export function getCurrentIndex() {
  return currentIndex;
}

/** Total number of navigable nodes. */
export function getNodeCount() {
  return nodes.length;
}

/**
 * Register a callback for navigation changes.
 * Callback receives (newIndex, prevIndex).
 */
export function onNavigate(callback) {
  listeners.push(callback);
}

/* ================================================
   Highlights, Progress, & A11y Announcements
   ================================================ */

/**
 * Highlight the active node (full opacity + scale 1)
 * and softly dim/scale inactive nodes.
 */
function updateHighlights() {
  nodes.forEach((node, i) => {
    const isActive = i === currentIndex;
    gsap.to(node.el, {
      opacity: isActive ? 1 : 0.45,
      scale: isActive ? 1 : 0.97,
      duration: 0.45,
      ease: 'power2.out',
      overwrite: 'auto',
    });
    node.el.classList.toggle('node--active', isActive);
  });
}

/** Update the "02 / 09" progress text. */
function updateProgress() {
  const el = document.getElementById('progress-indicator');
  if (!el) return;
  const current = String(currentIndex + 1).padStart(2, '0');
  const total = String(nodes.length).padStart(2, '0');
  el.textContent = `${current} / ${total}`;
}

/** Disable Prev at first node and Next at last node. */
function updateNavButtonStates() {
  const prevBtn = document.getElementById('btn-prev');
  const nextBtn = document.getElementById('btn-next');
  if (prevBtn) prevBtn.disabled = currentIndex <= 0;
  if (nextBtn) nextBtn.disabled = currentIndex >= nodes.length - 1;
}

function updateOverviewButton() {
  const btn = document.getElementById('btn-overview');
  if (!btn) return;
  btn.textContent = overviewMode ? '[ ⊡ Focus node ]' : '[ ⊞ Fit workflow ]';
  btn.classList.toggle('btn-overview--active', overviewMode);
}

function announceActiveNode(nodeObj) {
  const srEl = document.getElementById('sr-announcer');
  if (!srEl || !nodeObj || !nodeObj.el) return;
  const titleEl = nodeObj.el.querySelector('.node__title');
  const title = titleEl ? titleEl.textContent : nodeObj.id;
  srEl.textContent = `Step ${currentIndex + 1} of ${nodes.length}: ${title}`;
}

/* ================================================
   Input handling — wheel, rubber-band drag, keys
   ================================================ */

let wheelAccum = 0;
const WHEEL_THRESHOLD = 75;

let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
const DRAG_THRESHOLD = 55;

/**
 * Initialize all navigation input handlers.
 * Call once after the viewport is ready.
 *
 * @param {Object} opts
 * @param {HTMLElement} opts.viewport — the .viewport element
 */
export function initNavigation({ viewport }) {
  // --- Wheel: scroll left/right or up/down to navigate ---
  viewport.addEventListener('wheel', (e) => {
    if (!enabled || isAnimating || nodes.length === 0) return;
    e.preventDefault();

    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    wheelAccum += delta;

    if (wheelAccum > WHEEL_THRESHOLD) {
      wheelAccum = 0;
      goNext();
    } else if (wheelAccum < -WHEEL_THRESHOLD) {
      wheelAccum = 0;
      goPrev();
    }
  }, { passive: false });

  // --- Click-and-drag on canvas with rubber-band resistance ---
  viewport.addEventListener('pointerdown', (e) => {
    if (!enabled || e.button !== 0) return;
    if (e.target.closest('.node') || e.target.closest('button')) return;

    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    viewport.classList.add('viewport--dragging');
    viewport.setPointerCapture(e.pointerId);
  });

  viewport.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartX;
    const dy = e.clientY - dragStartY;
    // Soft rubber-band resistance while dragging
    cameraDragOffset(dx * 0.35, dy * 0.22, false);
  });

  viewport.addEventListener('pointerup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    viewport.classList.remove('viewport--dragging');
    viewport.releasePointerCapture(e.pointerId);

    const dx = e.clientX - dragStartX;
    const dy = e.clientY - dragStartY;
    const primaryDelta = Math.abs(dx) >= Math.abs(dy) ? dx : dy;
    const threshold = e.pointerType === 'touch' ? 38 : DRAG_THRESHOLD;

    if (Math.abs(primaryDelta) > threshold && !isAnimating) {
      if (primaryDelta < 0 && currentIndex < nodes.length - 1) {
        goNext();
      } else if (primaryDelta > 0 && currentIndex > 0) {
        goPrev();
      } else {
        cameraDragOffset(0, 0, true);
      }
    } else {
      // Spring back to current node
      cameraDragOffset(0, 0, true);
    }
  });

  viewport.addEventListener('pointercancel', () => {
    if (!isDragging) return;
    isDragging = false;
    viewport.classList.remove('viewport--dragging');
    cameraDragOffset(0, 0, true);
  });

  // --- Arrow keys (left/right and up/down) ---
  document.addEventListener('keydown', (e) => {
    if (!enabled || nodes.length === 0) return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        goNext();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        goPrev();
        break;
    }
  });
}
