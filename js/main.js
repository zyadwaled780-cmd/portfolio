/**
 * main.js — Entry point. Orchestrates Phase 1 + Phase 2.
 *
 * Phase 1: Dither overlay, trigger node, execute animation.
 * Phase 2: Full workflow canvas — intro, hub, project nodes,
 *          let's-talk, connections, camera nav, prev/next.
 */

import { initCamera, cameraTo, cameraSet }        from './camera.js';
import { initAudio, play, setEnabled, isEnabled }  from './audio.js';
import { createTriggerNode, createIntroNode,
         createHubNode, createProjectNode,
         createLetsTalkNode, createDigitalTwinNode,
         setNodeState, getHandlePos }              from './nodes.js';
import { createConnection, animateDrawOn,
         addTravelingDots, setDotsPaused,
         clearConnections }                        from './connections.js';
import { initNavigation, setNodes, setNavEnabled,
         goTo, goNext, goPrev,
         toggleOverview, getCurrentIndex }         from './navigation.js';
import { initProjectView, openProject,
         closeProject, isProjectOpen }             from './project-view.js';
import { initInfoView, openInfo,
         closeInfo, isInfoOpen }                   from './info-view.js';
import { content }                                 from './content.js';

/* global gsap */

/* ================================================
   World layout — positions for every node.
   Flow: Trigger → Intro → Hub → Projects (fan) → Let's Talk → Digital Twin
   ================================================ */

const GAP = 700;            // horizontal gap between main nodes
const PROJECT_GAP_X = 650;  // x gap from hub to projects
const PROJECT_GAP_Y = 340;  // vertical spacing between projects

const LAYOUT = {
  trigger:     { x: 0,            y: 0 },
  intro:       { x: GAP,          y: 0 },
  hub:         { x: GAP * 2,      y: 0 },
  // Projects fan out from the hub:
  // Spread vertically, centered around y=0
  projects:    [],               // filled in buildLayout()
  letsTalk:    { x: 0, y: 0 },   // filled in buildLayout()
  digitalTwin: { x: 0, y: 0 },   // filled in buildLayout()
};

/**
 * Calculate project node positions (fan layout).
 * Projects spread vertically, each one step to the right of the hub.
 * The last project leads to the Let's Talk node, followed by the Digital Twin node.
 */
function buildLayout() {
  const count = content.projects.length;
  const totalHeight = (count - 1) * PROJECT_GAP_Y;
  const startY = -totalHeight / 2;

  content.projects.forEach((_, i) => {
    LAYOUT.projects.push({
      x: LAYOUT.hub.x + PROJECT_GAP_X,
      y: startY + i * PROJECT_GAP_Y,
    });
  });

  // Let's Talk node: to the right of the project column
  const lastProject = LAYOUT.projects[LAYOUT.projects.length - 1];
  LAYOUT.letsTalk = {
    x: lastProject.x + PROJECT_GAP_X,
    y: 0, // centered vertically
  };

  // Digital Twin placeholder node: to the right of Let's Talk
  LAYOUT.digitalTwin = {
    x: LAYOUT.letsTalk.x + PROJECT_GAP_X,
    y: 0,
  };
}

buildLayout();

/* ================================================
   DOM references
   ================================================ */
const viewport       = document.getElementById('viewport');
const world          = document.getElementById('world');
const svgLayer       = document.getElementById('connections-svg');
const ditherEl       = document.getElementById('dither-overlay');
const soundBtn        = document.getElementById('sound-toggle');
const replayBtn       = document.getElementById('btn-replay');
const overviewBtn     = document.getElementById('btn-overview');
const prevBtn         = document.getElementById('btn-prev');
const nextBtn        = document.getElementById('btn-next');
const progressEl     = document.getElementById('progress-indicator');
const navWorkBtn     = document.getElementById('nav-work');
const navInfoBtn     = document.getElementById('nav-info');
const navContactBtn  = document.getElementById('nav-contact');
const twinShortcutBtn = document.getElementById('btn-twin-shortcut');
const wordmarkEl     = document.querySelector('.wordmark');

/* ================================================
   State
   ================================================ */
let triggerNode     = null;
let introNode       = null;
let hubNode         = null;
let projectNodes    = [];
let letsTalkNode    = null;
let digitalTwinNode = null;
let allNodeRefs     = [];       // ordered list for navigation

let isRunning    = false;       // prevent double-clicks during execute
let dotCleanups  = [];          // traveling-dots cleanup functions
let audioStarted = false;       // has AudioContext been created?
let workflowBuilt = false;      // has the full workflow been revealed?

/* ================================================
   1. Generate Bayer dither overlay (static, once)
   ================================================ */
function generateDither() {
  const CELL = 3;
  const N = 8;
  const canvas = document.createElement('canvas');
  canvas.width = N * CELL;
  canvas.height = N * CELL;
  const c = canvas.getContext('2d');

  /* prettier-ignore */
  const bayer = [
    [ 0, 48, 12, 60,  3, 51, 15, 63],
    [32, 16, 44, 28, 35, 19, 47, 31],
    [ 8, 56,  4, 52, 11, 59,  7, 55],
    [40, 24, 36, 20, 43, 27, 39, 23],
    [ 2, 50, 14, 62,  1, 49, 13, 61],
    [34, 18, 46, 30, 33, 17, 45, 29],
    [10, 58,  6, 54,  9, 57,  5, 53],
    [42, 26, 38, 22, 41, 25, 37, 21],
  ];

  for (let row = 0; row < N; row++) {
    for (let col = 0; col < N; col++) {
      const val = bayer[row][col] / 64;
      c.fillStyle = `rgba(255, 255, 255, ${val})`;
      c.fillRect(col * CELL, row * CELL, CELL, CELL);
    }
  }

  ditherEl.style.backgroundImage = `url(${canvas.toDataURL()})`;
  ditherEl.style.backgroundRepeat = 'repeat';
}

/* ================================================
   2. Sound toggle
   ================================================ */
function updateSoundUI() {
  const on = isEnabled();
  soundBtn.classList.toggle('sound-toggle--on', on);
  soundBtn.setAttribute('aria-label', on ? 'Sound on, click to mute' : 'Sound off, click to unmute');
}

function handleSoundToggle() {
  if (!audioStarted) {
    initAudio();
    audioStarted = true;
  }
  setEnabled(!isEnabled());
  updateSoundUI();
}

/* ================================================
   3. Build the initial scene (trigger only)
   ================================================ */
function buildInitialScene() {
  // Create trigger node at world origin
  triggerNode = createTriggerNode(world, LAYOUT.trigger.x, LAYOUT.trigger.y);

  // Center camera on trigger
  cameraSet(LAYOUT.trigger.x, LAYOUT.trigger.y, 1);

  // Entrance animation
  gsap.to(triggerNode, {
    opacity: 1,
    scale: 1,
    duration: 0.9,
    delay: 0.35,
    ease: 'power2.out',
  });
}

/* ================================================
   4. Build the full workflow (called after trigger)
   ================================================ */
function buildWorkflow() {
  // --- Create all nodes ---

  // Intro node
  introNode = createIntroNode(world, LAYOUT.intro.x, LAYOUT.intro.y, {
    title: content.title,
    pitch: content.pitch,
    credential: content.credential,
  });

  // Hub node
  hubNode = createHubNode(world, LAYOUT.hub.x, LAYOUT.hub.y, 'My Work');

  // Project nodes
  projectNodes = content.projects.map((proj, i) => {
    return createProjectNode(
      world,
      LAYOUT.projects[i].x,
      LAYOUT.projects[i].y,
      proj,
      i,
    );
  });

  // Let's Talk node
  letsTalkNode = createLetsTalkNode(
    world,
    LAYOUT.letsTalk.x,
    LAYOUT.letsTalk.y,
  );

  // Digital Twin placeholder node (Phase 4)
  digitalTwinNode = createDigitalTwinNode(
    world,
    LAYOUT.digitalTwin.x,
    LAYOUT.digitalTwin.y,
    content.digitalTwin,
  );

  // --- Build the ordered node list for navigation ---
  allNodeRefs = [
    { el: triggerNode,  x: LAYOUT.trigger.x,  y: LAYOUT.trigger.y,  id: 'trigger' },
    { el: introNode,    x: LAYOUT.intro.x,    y: LAYOUT.intro.y,    id: 'intro' },
    { el: hubNode,      x: LAYOUT.hub.x,      y: LAYOUT.hub.y,      id: 'hub' },
  ];

  content.projects.forEach((proj, i) => {
    allNodeRefs.push({
      el: projectNodes[i],
      x: LAYOUT.projects[i].x,
      y: LAYOUT.projects[i].y,
      id: proj.id,
    });
  });

  allNodeRefs.push({
    el: letsTalkNode,
    x: LAYOUT.letsTalk.x,
    y: LAYOUT.letsTalk.y,
    id: 'lets-talk',
  });

  allNodeRefs.push({
    el: digitalTwinNode,
    x: LAYOUT.digitalTwin.x,
    y: LAYOUT.digitalTwin.y,
    id: 'digital-twin',
  });

  // Register with navigation system
  setNodes(allNodeRefs);
}

/* ================================================
   5. Reveal workflow — animated sequence after trigger
   ================================================ */
function revealWorkflow() {
  const tl = gsap.timeline();

  // Small delay to ensure newly created nodes have layout
  tl.to({}, { duration: 0.1 });

  // -- Step 1: Draw connection Trigger → Intro & reveal Intro --
  tl.call(() => {
    const from = getHandlePos(triggerNode, 'output');
    const to   = getHandlePos(introNode, 'input');
    const path = createConnection(svgLayer, from.x, from.y, to.x, to.y);
    animateDrawOn(path, 0.6);
    gsap.delayedCall(0.25, () => {
      dotCleanups.push(addTravelingDots(svgLayer, path, 3));
    });
  });

  tl.to(introNode, { opacity: 1, duration: 0.5, ease: 'power2.out' }, '+=0.15');

  // Camera glide to intro
  tl.call(() => {
    play('tick');
    cameraTo(LAYOUT.intro.x, LAYOUT.intro.y, 1, 0.9, 'power3.inOut');
  });
  tl.to({}, { duration: 1.0 });

  // -- Step 2: Draw connection Intro → Hub & reveal Hub --
  tl.call(() => {
    const from = getHandlePos(introNode, 'output');
    const to   = getHandlePos(hubNode, 'input');
    const path = createConnection(svgLayer, from.x, from.y, to.x, to.y);
    animateDrawOn(path, 0.5);
    gsap.delayedCall(0.2, () => {
      dotCleanups.push(addTravelingDots(svgLayer, path, 2));
    });
  });

  tl.to(hubNode, { opacity: 1, duration: 0.4, ease: 'power2.out' }, '+=0.1');

  // Camera glide to hub
  tl.call(() => {
    play('tick');
    cameraTo(LAYOUT.hub.x, LAYOUT.hub.y, 1, 0.9, 'power3.inOut');
  });
  tl.to({}, { duration: 1.0 });

  // -- Step 3: Fan connections Hub → each Project node --
  projectNodes.forEach((projNode, i) => {
    tl.call(() => {
      const from = getHandlePos(hubNode, 'output');
      const to   = getHandlePos(projNode, 'input');
      const path = createConnection(svgLayer, from.x, from.y, to.x, to.y);
      animateDrawOn(path, 0.4);
      gsap.delayedCall(0.15, () => {
        dotCleanups.push(addTravelingDots(svgLayer, path, 2));
      });
    });

    tl.to(projNode, { opacity: 1, duration: 0.35, ease: 'power2.out' }, '+=0.05');

    // Brief pause between each fan arm
    if (i < projectNodes.length - 1) {
      tl.to({}, { duration: 0.12 });
    }
  });

  // Camera pulls back slightly to show the fan
  tl.call(() => {
    play('tick');
    // Center on the project column, zoomed out a bit to show the fan
    const centerY = 0;
    cameraTo(LAYOUT.projects[0].x, centerY, 0.72, 1.1, 'power3.inOut');
  });
  tl.to({}, { duration: 1.2 });

  // -- Step 4: Draw last project → Let's Talk --
  tl.call(() => {
    const lastProj = projectNodes[projectNodes.length - 1];
    const from = getHandlePos(lastProj, 'output');
    const to   = getHandlePos(letsTalkNode, 'input');
    const path = createConnection(svgLayer, from.x, from.y, to.x, to.y);
    animateDrawOn(path, 0.5);
    gsap.delayedCall(0.2, () => {
      dotCleanups.push(addTravelingDots(svgLayer, path, 2));
    });
  });

  tl.to(letsTalkNode, { opacity: 1, duration: 0.4, ease: 'power2.out' }, '+=0.1');

  // -- Step 4b: Draw Let's Talk → Digital Twin placeholder node --
  tl.call(() => {
    const from = getHandlePos(letsTalkNode, 'output');
    const to   = getHandlePos(digitalTwinNode, 'input');
    const path = createConnection(svgLayer, from.x, from.y, to.x, to.y);
    animateDrawOn(path, 0.45);
    gsap.delayedCall(0.18, () => {
      dotCleanups.push(addTravelingDots(svgLayer, path, 1));
    });
  });

  tl.to(digitalTwinNode, { opacity: 1, duration: 0.4, ease: 'power2.out' }, '+=0.08');

  // -- Step 5: Enable navigation, zoom to fit the intro as starting point --
  tl.call(() => {
    workflowBuilt = true;

    // Show nav controls
    showNavControls();

    // Navigate to intro node (index 1) — first "real" content node
    goTo(1, true);
  });

  tl.to({}, { duration: 0.3 });

  // Show replay button and enable user navigation
  tl.call(() => {
    if (!isProjectOpen() && !isInfoOpen()) {
      setNavEnabled(true);
    }
    replayBtn.classList.add('btn-replay--visible');
    isRunning = false;
  });
}

/* ================================================
   6. Execute workflow — GSAP master timeline
   ================================================ */
function executeWorkflow() {
  if (isRunning) return;
  isRunning = true;

  // Ensure AudioContext is started on this user gesture
  if (!audioStarted) {
    initAudio();
    audioStarted = true;
    updateSoundUI();
  }

  // References inside the trigger node
  const executeBtn = triggerNode.querySelector('.btn-execute');
  const counterEl  = triggerNode.querySelector('.node__counter');

  // Hide replay and nav during run
  replayBtn.classList.remove('btn-replay--visible');
  hideNavControls();

  /* --- Master timeline --- */
  const tl = gsap.timeline();

  // a. Button press feedback + click sound
  tl.call(() => play('click'))
    .to(executeBtn, { scale: 0.95, duration: 0.08, ease: 'power2.in' })
    .to(executeBtn, { scale: 1, duration: 0.12, ease: 'power2.out' });

  // b. Switch to running state, animate counter 000→100
  tl.call(() => setNodeState(triggerNode, 'running'), null, '+=0.1');

  const counter = { val: 0 };
  tl.to(counter, {
    val: 100,
    duration: 1.2,
    ease: 'none',
    onUpdate: () => {
      counterEl.textContent = String(Math.floor(counter.val)).padStart(3, '0');
    },
  });

  // c. Success state + chime
  tl.call(() => {
    setNodeState(triggerNode, 'success');
    play('chime');
  });

  // Brief pause
  tl.to({}, { duration: 0.45 });

  // d. Build the full workflow nodes (in DOM, hidden)
  tl.call(() => {
    buildWorkflow();
  });

  // e. Reveal the entire workflow with animated connections
  tl.call(() => {
    revealWorkflow();
  });
}

/* ================================================
   7. Nav controls (prev/next, progress, topbar pills)
   ================================================ */
function showNavControls() {
  if (prevBtn) prevBtn.classList.add('nav-btn--visible');
  if (nextBtn) nextBtn.classList.add('nav-btn--visible');
  if (progressEl) progressEl.classList.add('progress--visible');
  if (overviewBtn) overviewBtn.classList.add('btn-overview--visible');
}

function hideNavControls() {
  if (prevBtn) prevBtn.classList.remove('nav-btn--visible');
  if (nextBtn) nextBtn.classList.remove('nav-btn--visible');
  if (progressEl) progressEl.classList.remove('progress--visible');
  if (overviewBtn) overviewBtn.classList.remove('btn-overview--visible');
}

function updateTopbarPills(active = 'work') {
  if (navWorkBtn) navWorkBtn.classList.toggle('pill--active', active === 'work');
  if (navInfoBtn) navInfoBtn.classList.toggle('pill--active', active === 'info');
  if (navContactBtn) navContactBtn.classList.toggle('pill--active', active === 'contact');
}

/* ================================================
   8. Replay — reset everything
   ================================================ */
function resetScene() {
  if (isRunning) return;

  // Close overlays if open
  closeProject(true);
  closeInfo(true);
  updateTopbarPills('work');

  // Kill traveling dots
  dotCleanups.forEach(fn => fn());
  dotCleanups = [];

  // Clear SVG connections
  clearConnections(svgLayer);

  // Remove all nodes from DOM
  [triggerNode, introNode, hubNode, letsTalkNode, digitalTwinNode, ...projectNodes]
    .filter(Boolean)
    .forEach(n => n.remove());

  triggerNode = null;
  introNode = null;
  hubNode = null;
  projectNodes = [];
  letsTalkNode = null;
  digitalTwinNode = null;
  allNodeRefs = [];
  workflowBuilt = false;

  // Hide controls
  replayBtn.classList.remove('btn-replay--visible');
  hideNavControls();

  // Reset navigation
  setNavEnabled(false);
  setNodes([]);

  // Reset camera instantly
  cameraSet(LAYOUT.trigger.x, LAYOUT.trigger.y, 1);

  // Rebuild initial scene
  buildInitialScene();
}

/* ================================================
   9. Click handlers for node & UI actions
   ================================================ */

function ensureAudioOnGesture() {
  if (!audioStarted) {
    initAudio();
    audioStarted = true;
    updateSoundUI();
  }
}

/**
 * Handle clicks on "Open" project buttons (Phase 3).
 * Focuses the camera on that project node and opens the full detail view.
 */
function handleProjectOpen(projectId, triggerEl = null) {
  ensureAudioOnGesture();
  const idx = allNodeRefs.findIndex(n => n.id === projectId);
  if (idx >= 0) {
    goTo(idx, true);
  }
  openProject(projectId, triggerEl);
}

/**
 * Handle clicks on "More about me" button or topbar INFO pill (Phase 4).
 */
function handleMoreAbout(triggerEl = null) {
  ensureAudioOnGesture();
  if (isProjectOpen()) closeProject(true);
  openInfo({ scrollToContact: false, triggerEl });
}

/**
 * Handle clicks on "Get in touch", "Discuss a similar project", or topbar CONTACT pill (Phase 4).
 * Opens the Info view scrolled to the Contact section.
 */
function handleContact(triggerEl = null) {
  ensureAudioOnGesture();
  if (isProjectOpen()) closeProject(true);

  const talkIdx = allNodeRefs.findIndex(n => n.id === 'lets-talk');
  if (talkIdx >= 0 && workflowBuilt) {
    goTo(talkIdx, true);
  }

  openInfo({ scrollToContact: true, triggerEl });
}

/**
 * Handle clicks on the reserved Digital Twin button or node (Phase 4).
 */
function handleDigitalTwin(triggerEl = null) {
  ensureAudioOnGesture();
  play('tick');

  if (isProjectOpen()) closeProject(true);
  if (isInfoOpen()) closeInfo(true);

  if (workflowBuilt) {
    const twinIdx = allNodeRefs.findIndex(n => n.id === 'digital-twin');
    if (twinIdx >= 0) {
      goTo(twinIdx, true);
    }
  }

  // Subtle status feedback on the clicked button
  const btn = triggerEl || twinShortcutBtn;
  if (btn) {
    const original = btn.textContent;
    btn.textContent = '[ ◉ Chatbot coming soon ]';
    setTimeout(() => {
      btn.textContent = original;
    }, 1800);
  }
}

/* ================================================
   10. Init
   ================================================ */
function init() {
  // Dither overlay
  generateDither();

  // Camera
  initCamera(viewport, world);

  // Navigation system (input handlers)
  initNavigation({ viewport });

  // Project detail view (Phase 3)
  initProjectView({
    onOpen: () => {
      setNavEnabled(false);
      setDotsPaused(true);
    },
    onClose: (projectId) => {
      if (!isInfoOpen()) {
        setDotsPaused(false);
      }
      if (workflowBuilt && !isInfoOpen()) {
        const idx = allNodeRefs.findIndex(n => n.id === projectId);
        if (idx >= 0) goTo(idx, true);
        setNavEnabled(true);
      }
    },
    onNavigateProject: (projectId) => {
      const idx = allNodeRefs.findIndex(n => n.id === projectId);
      if (idx >= 0) {
        goTo(idx, true);
      }
    },
    onDiscuss: () => {
      // Opens Info view scrolled directly to Contact section
      handleContact();
    },
  });

  // Info & Contact view (Phase 4)
  initInfoView({
    onOpen: (mode) => {
      setNavEnabled(false);
      setDotsPaused(true);
      updateTopbarPills(mode === 'contact' ? 'contact' : 'info');
    },
    onClose: () => {
      updateTopbarPills('work');
      if (!isProjectOpen()) {
        setDotsPaused(false);
      }
      if (workflowBuilt && !isProjectOpen()) {
        setNavEnabled(true);
      }
    },
  });

  // Build initial scene (trigger only)
  buildInitialScene();

  // --- Topbar navigation pills (WORK, INFO, CONTACT) ---
  if (navWorkBtn) {
    navWorkBtn.addEventListener('click', (e) => {
      e.preventDefault();
      ensureAudioOnGesture();
      if (isInfoOpen()) closeInfo(false);
      if (isProjectOpen()) closeProject(false);
      updateTopbarPills('work');

      if (workflowBuilt) {
        const hubIdx = allNodeRefs.findIndex(n => n.id === 'hub');
        if (hubIdx >= 0) goTo(hubIdx, true);
      } else if (!isRunning) {
        executeWorkflow();
      }
    });
  }

  if (navInfoBtn) {
    navInfoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleMoreAbout(navInfoBtn);
    });
  }

  if (navContactBtn) {
    navContactBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleContact(navContactBtn);
    });
  }

  if (wordmarkEl) {
    wordmarkEl.addEventListener('click', () => {
      if (isInfoOpen()) closeInfo(false);
      if (isProjectOpen()) closeProject(false);
      updateTopbarPills('work');
    });
  }

  // Digital Twin shortcut button in bottom-left
  if (twinShortcutBtn) {
    twinShortcutBtn.addEventListener('click', () => {
      handleDigitalTwin(twinShortcutBtn);
    });
  }

  // --- Delegated click handlers on world ---
  world.addEventListener('click', (e) => {
    // Execute button
    const execBtn = e.target.closest('.btn-execute');
    if (execBtn) {
      executeWorkflow();
      return;
    }

    // Open project button
    const openBtn = e.target.closest('.btn-open-project');
    if (openBtn) {
      handleProjectOpen(openBtn.dataset.projectId, openBtn);
      return;
    }

    // More about me button
    const moreBtn = e.target.closest('.btn-more-about');
    if (moreBtn) {
      handleMoreAbout(moreBtn);
      return;
    }

    // Get in touch button
    const contactBtn = e.target.closest('.btn-contact');
    if (contactBtn) {
      handleContact(contactBtn);
      return;
    }

    // Digital Twin node button
    const twinBtn = e.target.closest('.btn-digital-twin');
    if (twinBtn) {
      handleDigitalTwin(twinBtn);
      return;
    }

    // Click on any node card to navigate to it
    const nodeEl = e.target.closest('.node');
    if (nodeEl && workflowBuilt) {
      const idx = allNodeRefs.findIndex(n => n.el === nodeEl);
      if (idx >= 0) {
        goTo(idx, true);
      }
    }
  });

  // Keyboard: Enter/Space on execute button
  world.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.btn-execute')) {
      e.preventDefault();
      executeWorkflow();
    }
  });

  // Sound toggle
  soundBtn.addEventListener('click', handleSoundToggle);

  // Replay & Overview buttons
  replayBtn.addEventListener('click', resetScene);
  if (overviewBtn) overviewBtn.addEventListener('click', toggleOverview);

  // Prev / Next buttons
  if (prevBtn) prevBtn.addEventListener('click', goPrev);
  if (nextBtn) nextBtn.addEventListener('click', goNext);

  // Keyboard shortcuts on workflow canvas:
  //   - Escape to replay (only when neither modal nor Info view is open)
  //   - Enter to activate the currently focused workflow node when no button/link has focus
  document.addEventListener('keydown', (e) => {
    if (isProjectOpen() || isInfoOpen()) return;

    if (e.key === 'Escape' && replayBtn.classList.contains('btn-replay--visible')) {
      resetScene();
      return;
    }

    if (
      e.key === 'Enter' &&
      workflowBuilt &&
      (document.activeElement === document.body || document.activeElement === viewport)
    ) {
      const activeNode = allNodeRefs[getCurrentIndex()];
      if (!activeNode) return;
      if (activeNode.id === 'intro') {
        handleMoreAbout();
      } else if (activeNode.id === 'lets-talk') {
        handleContact();
      } else if (content.projects.some(p => p.id === activeNode.id)) {
        const openBtn = activeNode.el.querySelector('.btn-open-project');
        handleProjectOpen(activeNode.id, openBtn);
      }
    }
  });
}

// ES modules are deferred, so DOM is ready when this runs.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
