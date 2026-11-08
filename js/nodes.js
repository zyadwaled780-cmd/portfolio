/**
 * nodes.js — Create and manage n8n-style node cards.
 *
 * Phase 2 node types:
 *   - Trigger        (Phase 1 — unchanged)
 *   - Intro          ("Who I Am" — pitch + credential)
 *   - Hub            ("My Work" — branching point)
 *   - Project        (title, problem, image placeholder, Open btn)
 *   - LetsTalk       (contact CTA at the end)
 *
 * Nodes are positioned in world-space using CSS left/top.
 * GSAP handles centering (xPercent/yPercent) and animations.
 *
 * Exports:
 *   createTriggerNode(worldEl, x, y) → HTMLElement
 *   createIntroNode(worldEl, x, y, data) → HTMLElement
 *   createHubNode(worldEl, x, y, label) → HTMLElement
 *   createProjectNode(worldEl, x, y, project, index) → HTMLElement
 *   createLetsTalkNode(worldEl, x, y) → HTMLElement
 *   setNodeState(nodeEl, state) — 'idle' | 'running' | 'success'
 *   getHandlePos(nodeEl, side) → { x, y } in world coords
 */

/* global gsap */

/* ---- SVG icon paths (inline, tiny) ---- */
const ICONS = {
  trigger: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  user: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  work: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><polyline points="16 3 12 7 8 3"/></svg>`,
  project: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,
  talk: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  bot: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>`,
  check: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  clock: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
};

/* ================================================
   TRIGGER NODE (Phase 1 — unchanged)
   ================================================ */

/**
 * Create the Manual Trigger node.
 * Returns the root .node element (already appended to world).
 */
export function createTriggerNode(worldEl, x, y) {
  const el = document.createElement('div');
  el.className = 'node node--trigger';
  el.setAttribute('role', 'region');
  el.setAttribute('aria-label', 'Manual Trigger node');
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;

  el.innerHTML = `
    <div class="node__stripe"></div>
    <div class="node__header">
      <div class="node__icon">${ICONS.trigger}</div>
      <div class="node__info">
        <div class="node__title">Manual Trigger</div>
        <div class="node__subtitle">When clicking 'Execute workflow'</div>
      </div>
    </div>
    <div class="node__body">
      <!-- Idle state (visible by default) -->
      <div class="node__state node__state--active" data-state="idle">
        <button class="btn-execute" aria-label="Execute workflow">
          <span class="btn-execute__icon">▶</span>
          Execute workflow
        </button>
        <p class="trigger-hint">Best with sound on</p>
      </div>
      <!-- Running state -->
      <div class="node__state" data-state="running">
        <div class="node__counter">000</div>
      </div>
      <!-- Success state -->
      <div class="node__state" data-state="success">
        <div class="node__success-content">
          <span class="node__check">${ICONS.check}</span>
          <span class="node__badge">1 item</span>
        </div>
      </div>
    </div>
    <div class="node__handle node__handle--output"></div>
  `;

  worldEl.appendChild(el);

  // Let GSAP own the transform (centering + animation)
  gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 0, scale: 0.92 });

  return el;
}

/* ================================================
   INTRO NODE — "Who I Am"
   ================================================ */

/**
 * Create the intro/about node with pitch text.
 * Wider than standard nodes to fit paragraph text.
 *
 * @param {HTMLElement} worldEl
 * @param {number} x — world x position
 * @param {number} y — world y position
 * @param {Object} data — { title, pitch, credential }
 */
export function createIntroNode(worldEl, x, y, data) {
  const el = document.createElement('div');
  el.className = 'node node--intro';
  el.setAttribute('role', 'region');
  el.setAttribute('aria-label', 'About me node');
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;

  // Split pitch into paragraphs
  const pitchHtml = data.pitch
    .split('\n\n')
    .map(p => `<p class="intro__paragraph">${p}</p>`)
    .join('');

  el.innerHTML = `
    <div class="node__stripe node__stripe--accent"></div>
    <div class="node__header">
      <div class="node__icon">${ICONS.user}</div>
      <div class="node__info">
        <div class="node__title">Who I Am</div>
        <div class="node__subtitle">Introduction</div>
      </div>
    </div>
    <div class="node__body">
      <h2 class="intro__title">${data.title}</h2>
      <div class="intro__pitch">${pitchHtml}</div>
      <p class="intro__credential">${data.credential}</p>
      <button class="btn-node-action btn-more-about" aria-label="More about me">
        More about me
      </button>
    </div>
    <div class="node__handle node__handle--input"></div>
    <div class="node__handle node__handle--output"></div>
  `;

  worldEl.appendChild(el);
  gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 0 });

  return el;
}

/* ================================================
   HUB NODE — "My Work"
   ================================================ */

/**
 * Create the hub/branching node.
 */
export function createHubNode(worldEl, x, y, label = 'My Work') {
  const el = document.createElement('div');
  el.className = 'node node--hub';
  el.setAttribute('role', 'region');
  el.setAttribute('aria-label', `${label} hub node`);
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;

  el.innerHTML = `
    <div class="node__stripe"></div>
    <div class="node__header">
      <div class="node__icon">${ICONS.work}</div>
      <div class="node__info">
        <div class="node__title">${label}</div>
        <div class="node__subtitle">Projects overview</div>
      </div>
    </div>
    <div class="node__handle node__handle--input"></div>
    <div class="node__handle node__handle--output"></div>
  `;

  worldEl.appendChild(el);
  gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 0 });

  return el;
}

/* ================================================
   PROJECT NODE
   ================================================ */

/**
 * Create a project node card.
 * Shows: title, one-line problem, image placeholder, Open button.
 *
 * @param {HTMLElement} worldEl
 * @param {number} x
 * @param {number} y
 * @param {Object} project — from content.projects[]
 * @param {number} index — project index (for numbering)
 */
export function createProjectNode(worldEl, x, y, project, index) {
  const el = document.createElement('div');
  el.className = `node node--project${project.status === 'coming-soon' ? ' node--coming-soon' : ''}`;
  el.dataset.projectId = project.id;
  el.setAttribute('role', 'region');
  el.setAttribute('aria-label', `${project.title} project node`);
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;

  // Image area: placeholder with dithered pattern
  const imageHtml = `
    <div class="project__image-placeholder">
      <span class="project__image-label">Image coming soon</span>
    </div>
  `;

  // Status badge
  const statusBadge = project.status === 'coming-soon'
    ? `<span class="project__status">${ICONS.clock} Coming soon</span>`
    : '';

  el.innerHTML = `
    <div class="node__stripe${project.status === 'coming-soon' ? ' node__stripe--muted' : ''}"></div>
    <div class="node__header">
      <div class="node__icon">${ICONS.project}</div>
      <div class="node__info">
        <div class="node__title">${project.title}</div>
        <div class="node__subtitle">Project ${String(index + 1).padStart(2, '0')}</div>
      </div>
    </div>
    <div class="node__body">
      ${statusBadge}
      <p class="project__problem">${project.problem}</p>
      ${imageHtml}
      <button class="btn-node-action btn-open-project" data-project-id="${project.id}"
              aria-label="Open ${project.title}">
        Open
      </button>
    </div>
    <div class="node__handle node__handle--input"></div>
    <div class="node__handle node__handle--output"></div>
  `;

  worldEl.appendChild(el);
  gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 0 });

  return el;
}

/* ================================================
   LET'S TALK NODE
   ================================================ */

/**
 * Create the final "Let's Talk" CTA node.
 */
export function createLetsTalkNode(worldEl, x, y) {
  const el = document.createElement('div');
  el.className = 'node node--talk';
  el.setAttribute('role', 'region');
  el.setAttribute('aria-label', 'Contact node');
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;

  el.innerHTML = `
    <div class="node__stripe node__stripe--accent"></div>
    <div class="node__header">
      <div class="node__icon node__icon--accent">${ICONS.talk}</div>
      <div class="node__info">
        <div class="node__title">Let's Talk</div>
        <div class="node__subtitle">Get in touch</div>
      </div>
    </div>
    <div class="node__body">
      <p class="talk__text">Interested in working together? Let's discuss your project.</p>
      <button class="btn-node-action btn-contact" aria-label="Get in touch">
        Get in touch
      </button>
    </div>
    <div class="node__handle node__handle--input"></div>
    <div class="node__handle node__handle--output"></div>
  `;

  worldEl.appendChild(el);
  gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 0 });

  return el;
}

/* ================================================
   DIGITAL TWIN PLACEHOLDER NODE (Phase 4)
   ================================================ */

/**
 * Create the empty placeholder node reserved for a future AI chatbot ("Digital Twin").
 */
export function createDigitalTwinNode(worldEl, x, y, data = {}) {
  const el = document.createElement('div');
  el.className = 'node node--digital-twin';
  el.setAttribute('role', 'region');
  el.setAttribute('aria-label', 'Digital Twin AI chatbot placeholder node');
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;

  el.innerHTML = `
    <div class="node__stripe node__stripe--muted"></div>
    <div class="node__header">
      <div class="node__icon node__icon--muted">${ICONS.bot}</div>
      <div class="node__info">
        <div class="node__title">${data.title || 'Digital Twin'}</div>
        <div class="node__subtitle">${data.subtitle || 'AI Assistant · Coming Soon'}</div>
      </div>
    </div>
    <div class="node__body">
      <span class="project__status">${ICONS.clock} ${data.badge || 'Chatbot in development'}</span>
      <p class="talk__text">${
        data.description ||
        'Reserved for a future AI chatbot trained on my work and process.'
      }</p>
      <button
        class="btn-node-action btn-digital-twin"
        type="button"
        aria-label="Digital Twin chatbot coming soon"
      >
        [ ◉ Coming Soon ]
      </button>
    </div>
    <div class="node__handle node__handle--input"></div>
  `;

  worldEl.appendChild(el);
  gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 0 });

  return el;
}

/* ================================================
   NODE STATE (Phase 1 — unchanged)
   ================================================ */

/**
 * Switch a node between visual states: idle, running, success.
 * Handles showing/hiding the correct .node__state panels
 * and toggling CSS modifier classes.
 */
export function setNodeState(nodeEl, state) {
  // Toggle state panels
  nodeEl.querySelectorAll('.node__state').forEach((panel) => {
    panel.classList.toggle(
      'node__state--active',
      panel.dataset.state === state,
    );
  });

  // Toggle modifier classes
  nodeEl.classList.remove('node--running', 'node--success');
  if (state === 'running') nodeEl.classList.add('node--running');
  if (state === 'success') nodeEl.classList.add('node--success');
}

/* ================================================
   HANDLE POSITION
   ================================================ */

/**
 * Get the world-space position of a node's connection handle.
 * @param {HTMLElement} nodeEl
 * @param {'input'|'output'} side
 * @returns {{ x: number, y: number }}
 */
export function getHandlePos(nodeEl, side = 'output') {
  const worldX = parseFloat(nodeEl.style.left);
  const worldY = parseFloat(nodeEl.style.top);
  const w = nodeEl.offsetWidth || 280; // fallback to --node-w

  if (side === 'output') {
    return { x: worldX + w / 2 + 8, y: worldY };
  }
  // input
  return { x: worldX - w / 2 - 8, y: worldY };
}
