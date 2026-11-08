/**
 * info-view.js — Full-screen Info & Contact overlay (Phase 4).
 *
 * Editorial layout inspired by the mood reference:
 *   - Big display name + subtitle + short business-friendly about paragraphs
 *   - Qualification & What I Build columns + muted tools chips
 *   - Reserved Digital Twin placeholder block
 *   - Contact & Elsewhere columns (LinkedIn, GitHub, Email + copy helper)
 *
 * Exports:
 *   initInfoView(callbacks)
 *   openInfo(opts)         — { scrollToContact: boolean, triggerEl: HTMLElement }
 *   closeInfo(silent)
 *   isInfoOpen()
 */

/* global gsap */

import { content } from './content.js';
import { play } from './audio.js';

/* ================================================
   State & DOM references
   ================================================ */
let viewEl        = null;
let scrollEl      = null;
let closeBtn      = null;
let contactSecEl  = null;
let copyEmailBtn  = null;

let isOpen        = false;
let lastTriggerEl = null;

let callbacks = {
  onOpen: null,  // (mode: 'info' | 'contact') => void
  onClose: null, // () => void
};

/* ================================================
   Populate static content from js/content.js
   ================================================ */
function populateInfoContent() {
  const info = content.info || {};
  const twin = content.digitalTwin || {};
  const links = content.links || {};

  const nameEl     = document.getElementById('info-view-name');
  const subEl      = document.getElementById('info-view-subtitle');
  const leadEl     = document.getElementById('info-view-lead');
  const parasEl    = document.getElementById('info-view-paragraphs');
  const qualsEl    = document.getElementById('info-view-qualifications');
  const skillsEl   = document.getElementById('info-view-skills');
  const toolsEl    = document.getElementById('info-view-tools');
  const twinTitle  = document.getElementById('info-twin-title');
  const twinDesc   = document.getElementById('info-twin-desc');
  const contactHd  = document.getElementById('info-contact-heading');
  const contactPt  = document.getElementById('info-contact-pitch');
  const mailtoBtn  = document.getElementById('info-contact-mailto');
  const lnkIn      = document.getElementById('info-link-linkedin');
  const lnkGh      = document.getElementById('info-link-github');
  const lnkMail    = document.getElementById('info-link-email');
  const lnkMailTxt = document.getElementById('info-link-email-text');

  if (nameEl) nameEl.textContent = (content.name || 'Zyad Waled').toUpperCase();
  if (subEl) subEl.textContent = info.subtitle || content.title || '';
  if (leadEl) leadEl.textContent = info.lead || '';

  // Paragraphs
  if (parasEl && Array.isArray(info.paragraphs)) {
    parasEl.innerHTML = info.paragraphs
      .map((p) => `<p class="info-hero__p">${p}</p>`)
      .join('');
  }

  // Qualifications
  if (qualsEl && Array.isArray(info.qualifications)) {
    qualsEl.innerHTML = info.qualifications
      .map(
        (q) => `
        <div class="info-qual-item">
          <dt class="info-qual-item__label">${q.label}</dt>
          <dd class="info-qual-item__value">${q.value}</dd>
        </div>
      `
      )
      .join('');
  }

  // Skills / Capabilities
  if (skillsEl && Array.isArray(info.skills)) {
    skillsEl.innerHTML = info.skills
      .map(
        (s) => `
        <div class="info-skill-item">
          <h3 class="info-skill-item__title">${s.title}</h3>
          <p class="info-skill-item__detail">${s.detail}</p>
        </div>
      `
      )
      .join('');
  }

  // Tools chips
  if (toolsEl && Array.isArray(info.tools)) {
    toolsEl.innerHTML = info.tools
      .map((t) => `<span class="project-modal__chip">${t}</span>`)
      .join('');
  }

  // Digital Twin section
  if (twinTitle && twin.title) {
    twinTitle.textContent = `${twin.title} — ${twin.subtitle || 'AI Assistant'}`;
  }
  if (twinDesc && twin.description) {
    twinDesc.textContent = twin.description;
  }

  // Contact section
  if (contactHd && info.contactHeading) contactHd.textContent = info.contactHeading;
  if (contactPt && info.contactPitch) contactPt.textContent = info.contactPitch;

  const email = links.email || 'hello@example.com';
  if (mailtoBtn) mailtoBtn.href = `mailto:${email}`;
  if (lnkIn && links.linkedin) lnkIn.href = links.linkedin;
  if (lnkGh && links.github) lnkGh.href = links.github;
  if (lnkMail) lnkMail.href = `mailto:${email}`;
  if (lnkMailTxt) lnkMailTxt.textContent = `${email} ↗`;
}

/* ================================================
   Public API
   ================================================ */

/**
 * Open the Info view.
 *
 * @param {Object} [opts]
 * @param {boolean} [opts.scrollToContact=false] — scroll directly to Contact section
 * @param {HTMLElement} [opts.triggerEl=null] — element to restore focus to on close
 */
export function openInfo({ scrollToContact = false, triggerEl = null } = {}) {
  if (!viewEl) return;

  if (triggerEl) lastTriggerEl = triggerEl;
  const mode = scrollToContact ? 'contact' : 'info';

  if (!isOpen) {
    isOpen = true;
    viewEl.classList.add('info-view--open');
    viewEl.setAttribute('aria-hidden', 'false');

    play('open');
    if (callbacks.onOpen) callbacks.onOpen(mode);

    // Position scroll before animating in (and confirm after layout frame)
    const applyInitialScroll = () => {
      if (scrollToContact && contactSecEl) {
        scrollEl.scrollTop = Math.max(0, contactSecEl.offsetTop - 20);
      } else {
        scrollEl.scrollTop = 0;
      }
    };
    applyInitialScroll();
    requestAnimationFrame(applyInitialScroll);

    const reduced =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    gsap.killTweensOf(viewEl);
    gsap.fromTo(
      viewEl,
      { opacity: 0, y: reduced ? 0 : 16 },
      {
        opacity: 1,
        y: 0,
        duration: reduced ? 0.01 : 0.36,
        ease: 'power3.out',
        onComplete: () => {
          closeBtn.focus();
        },
      }
    );
  } else {
    // Already open: smoothly scroll to either top (Info) or Contact section
    play('tick');
    if (callbacks.onOpen) callbacks.onOpen(mode);

    const targetTop = scrollToContact && contactSecEl
      ? Math.max(0, contactSecEl.offsetTop - 24)
      : 0;

    scrollEl.scrollTo({ top: targetTop, behavior: 'smooth' });
  }
}

/**
 * Close the Info view and return to the workflow.
 *
 * @param {boolean} [silent=false]
 */
export function closeInfo(silent = false) {
  if (!isOpen || !viewEl) return;
  isOpen = false;

  if (silent) {
    gsap.killTweensOf(viewEl);
    viewEl.classList.remove('info-view--open');
    viewEl.setAttribute('aria-hidden', 'true');
    if (callbacks.onClose) callbacks.onClose();
    return;
  }

  play('close');

  const reduced =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  gsap.killTweensOf(viewEl);
  gsap.to(viewEl, {
    opacity: 0,
    y: reduced ? 0 : 12,
    duration: reduced ? 0.01 : 0.26,
    ease: 'power2.in',
    onComplete: () => {
      viewEl.classList.remove('info-view--open');
      viewEl.setAttribute('aria-hidden', 'true');
      if (callbacks.onClose) callbacks.onClose();

      if (lastTriggerEl && document.body.contains(lastTriggerEl)) {
        lastTriggerEl.focus();
      }
    },
  });
}

/**
 * Whether the Info view is currently open.
 */
export function isInfoOpen() {
  return isOpen;
}

/* ================================================
   Initialization
   ================================================ */
export function initInfoView(opts = {}) {
  callbacks = { ...callbacks, ...opts };

  viewEl       = document.getElementById('info-view');
  scrollEl     = document.getElementById('info-view-scroll');
  closeBtn     = document.getElementById('info-view-close');
  contactSecEl = document.getElementById('info-contact-section');
  copyEmailBtn = document.getElementById('info-copy-email');

  if (!viewEl) return;

  populateInfoContent();

  // Close button
  closeBtn.addEventListener('click', () => closeInfo(false));

  // Copy email helper
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = (content.links && content.links.email) || 'hello@example.com';
      play('click');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).catch(() => {});
      }
      copyEmailBtn.textContent = '[ ✓ Email copied ]';
      setTimeout(() => {
        copyEmailBtn.textContent = '[ Copy email ]';
      }, 2000);
    });
  }

  // Escape key closes Info view; Tab traps focus inside Info view
  document.addEventListener('keydown', (e) => {
    if (!isOpen) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      closeInfo(false);
    } else if (e.key === 'Tab') {
      const focusables = Array.from(
        viewEl.querySelectorAll('button:not(:disabled), a[href]:not([hidden])')
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
