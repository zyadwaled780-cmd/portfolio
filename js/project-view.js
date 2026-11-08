/**
 * project-view.js — Full-screen project detail view (Phase 3).
 *
 * Opens a large n8n-styled inspector overlay showing:
 *   - Large image area (or dithered placeholder with "Image coming soon")
 *   - Plain-business-language sections: Problem, What I built, Outcome
 *   - De-emphasized row of muted tech chips
 *   - Primary CTA ("Discuss a similar project") + secondary "View code" link
 *
 * Closing the view returns the visitor to the workflow at that exact
 * project node, ready to move to the next project.
 *
 * Exports:
 *   initProjectView(callbacks)
 *   openProject(projectId, triggerEl)
 *   closeProject(silent)
 *   isProjectOpen()
 */

/* global gsap */

import { content } from './content.js';
import { play } from './audio.js';

/* ================================================
   State & DOM references
   ================================================ */
let modalEl       = null;
let backdropEl    = null;
let cardEl        = null;
let stripeEl      = null;
let indexEl       = null;
let statusEl      = null;
let titleEl       = null;
let problemEl     = null;
let builtEl       = null;
let outcomeEl     = null;
let stackWrapEl   = null;
let stackEl       = null;
let ctaBtn        = null;
let repoLink      = null;
let placeholderEl = null;
let imageEl       = null;
let closeBtn      = null;
let prevBtn       = null;
let nextBtn       = null;

let isOpen            = false;
let currentProjectIdx = -1;
let lastTriggerEl     = null;

let callbacks = {
  onOpen: null,            // (projectId) => void
  onClose: null,           // (projectId) => void
  onNavigateProject: null, // (projectId) => void
  onDiscuss: null,         // (projectId) => void
};

/* ================================================
   Populate DOM content for a project
   ================================================ */
function renderProject(index) {
  const projects = content.projects;
  const project = projects[index];
  if (!project) return;

  currentProjectIdx = index;

  // Header metadata
  const num = String(index + 1).padStart(2, '0');
  const total = String(projects.length).padStart(2, '0');
  indexEl.textContent = `[ PROJECT ${num} / ${total} ]`;

  const isComingSoon = project.status === 'coming-soon';
  statusEl.textContent = isComingSoon ? '◌ Coming soon' : '● Ready to deploy';
  statusEl.className =
    'project-modal__status' +
    (isComingSoon ? ' project-modal__status--muted' : ' project-modal__status--active');

  stripeEl.className =
    'project-modal__stripe' +
    (isComingSoon ? ' project-modal__stripe--muted' : '');

  // Prev / Next buttons state
  prevBtn.disabled = index <= 0;
  nextBtn.disabled = index >= projects.length - 1;

  // Main copy
  titleEl.textContent = project.title;
  problemEl.textContent = project.problem || '—';
  builtEl.textContent = project.built || '—';
  outcomeEl.textContent = project.outcome || 'Outcome details coming soon.';

  // Image or dithered placeholder
  if (project.image) {
    imageEl.src = project.image;
    imageEl.alt = `${project.title} preview`;
    imageEl.hidden = false;
    placeholderEl.hidden = true;
  } else {
    imageEl.hidden = true;
    placeholderEl.hidden = false;
  }

  // Tech stack chips (de-emphasized, small, muted)
  stackEl.innerHTML = '';
  if (project.stack && project.stack.length > 0) {
    stackWrapEl.hidden = false;
    project.stack.forEach((tech) => {
      const chip = document.createElement('span');
      chip.className = 'project-modal__chip';
      chip.textContent = tech;
      stackEl.appendChild(chip);
    });
  } else {
    stackWrapEl.hidden = true;
  }

  // CTA button + secondary View code link
  ctaBtn.textContent = `${project.ctaLabel || 'Discuss a similar project'} →`;

  if (project.repoUrl) {
    repoLink.href = project.repoUrl;
    repoLink.hidden = false;
  } else {
    repoLink.hidden = true;
  }
}

/* ================================================
   Public API
   ================================================ */

/**
 * Open the project detail view for a given project ID.
 *
 * @param {string} projectId — matches content.projects[].id
 * @param {HTMLElement} [triggerEl] — button that opened the modal (for focus restore)
 */
export function openProject(projectId, triggerEl = null) {
  const idx = content.projects.findIndex((p) => p.id === projectId);
  if (idx === -1) return;

  lastTriggerEl = triggerEl;
  renderProject(idx);

  if (!isOpen) {
    isOpen = true;
    modalEl.classList.add('project-modal--open');
    modalEl.setAttribute('aria-hidden', 'false');

    play('open');
    if (callbacks.onOpen) callbacks.onOpen(projectId);

    const reduced =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Animate in (transform and opacity only)
    gsap.killTweensOf([backdropEl, cardEl]);
    gsap.fromTo(
      backdropEl,
      { opacity: 0 },
      { opacity: 1, duration: reduced ? 0.01 : 0.3, ease: 'power2.out' }
    );
    gsap.fromTo(
      cardEl,
      { opacity: 0, scale: reduced ? 1 : 0.94, y: reduced ? 0 : 18 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: reduced ? 0.01 : 0.38,
        ease: 'power3.out',
        onComplete: () => {
          closeBtn.focus();
        },
      }
    );
  } else {
    // Already open: subtle content transition when stepping prev/next
    play('tick');
    gsap.fromTo(
      cardEl,
      { opacity: 0.85, scale: 0.99 },
      { opacity: 1, scale: 1, duration: 0.22, ease: 'power2.out' }
    );
  }
}

/**
 * Close the project detail view and return to the workflow at that node.
 *
 * @param {boolean} [silent=false] — skip sound/animation (e.g. on full scene reset)
 */
export function closeProject(silent = false) {
  if (!isOpen) return;
  isOpen = false;

  const closedProject = content.projects[currentProjectIdx];
  const closedProjectId = closedProject ? closedProject.id : null;

  if (silent) {
    gsap.killTweensOf([backdropEl, cardEl]);
    modalEl.classList.remove('project-modal--open');
    modalEl.setAttribute('aria-hidden', 'true');
    return;
  }

  play('close');

  const reduced =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  gsap.killTweensOf([backdropEl, cardEl]);
  gsap.to(backdropEl, {
    opacity: 0,
    duration: reduced ? 0.01 : 0.25,
    ease: 'power2.in',
  });
  gsap.to(cardEl, {
    opacity: 0,
    scale: reduced ? 1 : 0.95,
    y: reduced ? 0 : 12,
    duration: reduced ? 0.01 : 0.26,
    ease: 'power2.in',
    onComplete: () => {
      modalEl.classList.remove('project-modal--open');
      modalEl.setAttribute('aria-hidden', 'true');

      if (callbacks.onClose) {
        callbacks.onClose(closedProjectId);
      }

      // Restore keyboard focus to the node's Open button on the canvas
      if (lastTriggerEl && document.body.contains(lastTriggerEl)) {
        lastTriggerEl.focus();
      }
    },
  });
}

/**
 * Whether the project detail view is currently open.
 */
export function isProjectOpen() {
  return isOpen;
}

/* ================================================
   Internal navigation between projects inside modal
   ================================================ */
function stepProject(delta) {
  const nextIdx = currentProjectIdx + delta;
  if (nextIdx < 0 || nextIdx >= content.projects.length) return;

  const nextProj = content.projects[nextIdx];
  renderProject(nextIdx);
  play('tick');

  // Subtle card pulse
  gsap.fromTo(
    cardEl,
    { opacity: 0.88, y: delta > 0 ? 6 : -6 },
    { opacity: 1, y: 0, duration: 0.24, ease: 'power2.out' }
  );

  // Sync the workflow camera in the background so closing returns to this node
  if (callbacks.onNavigateProject) {
    callbacks.onNavigateProject(nextProj.id);
  }
}

/* ================================================
   Initialization & Event Listeners
   ================================================ */
export function initProjectView(opts = {}) {
  callbacks = { ...callbacks, ...opts };

  modalEl       = document.getElementById('project-modal');
  backdropEl    = document.getElementById('project-modal-backdrop');
  cardEl        = document.getElementById('project-modal-card');
  stripeEl      = document.getElementById('project-modal-stripe');
  indexEl       = document.getElementById('project-modal-index');
  statusEl      = document.getElementById('project-modal-status');
  titleEl       = document.getElementById('project-modal-title');
  problemEl     = document.getElementById('project-modal-problem');
  builtEl       = document.getElementById('project-modal-built');
  outcomeEl     = document.getElementById('project-modal-outcome');
  stackWrapEl   = document.getElementById('project-modal-stack-wrap');
  stackEl       = document.getElementById('project-modal-stack');
  ctaBtn        = document.getElementById('project-modal-cta');
  repoLink      = document.getElementById('project-modal-repo');
  placeholderEl = document.getElementById('project-modal-placeholder');
  imageEl       = document.getElementById('project-modal-image');
  closeBtn      = document.getElementById('project-modal-close');
  prevBtn       = document.getElementById('project-modal-prev');
  nextBtn       = document.getElementById('project-modal-next');

  if (!modalEl) return;

  // Close button & backdrop click
  closeBtn.addEventListener('click', () => closeProject(false));
  backdropEl.addEventListener('click', () => closeProject(false));

  // Prev / Next project inside modal
  prevBtn.addEventListener('click', () => stepProject(-1));
  nextBtn.addEventListener('click', () => stepProject(1));

  // Main CTA: "Discuss a similar project"
  ctaBtn.addEventListener('click', () => {
    const proj = content.projects[currentProjectIdx];
    const projId = proj ? proj.id : null;
    play('click');
    closeProject(false);
    if (callbacks.onDiscuss) {
      callbacks.onDiscuss(projId);
    }
  });

  // Secondary link click sound
  repoLink.addEventListener('click', () => {
    play('click');
  });

  // Keyboard support when modal is open (Esc to close, Left/Right to switch project, Tab focus trap)
  document.addEventListener('keydown', (e) => {
    if (!isOpen) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      closeProject(false);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      stepProject(-1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      stepProject(1);
    } else if (e.key === 'Tab') {
      const focusables = Array.from(
        modalEl.querySelectorAll('button:not(:disabled), a[href]:not([hidden])')
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}
