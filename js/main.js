/**
 * main.js — Bilingual Customer Portfolio Controller (English & Arabic)
 *
 * Powers both:
 *   - index.html (Main Customer Journey: Introduction → About → How I Help → Background & Credentials → Contact)
 *   - work.html  (Separate Optional Work / Projects Page + Optional Interactive Workflow Canvas)
 *
 * Features:
 *   - First-visit Language Chooser (English / العربية) with remembered preference
 *   - Live Language Switcher preserving current page, scroll section, and theme
 *   - Complete Light & Dark themes (system preference + persisted manual toggle)
 *   - Factual CV-backed rendering and working CV PDF download
 *   - Right-docked Digital Twin widget ("In development" / "قيد التطوير")
 */

import {
  SITE_CONTENT,
  CONTACT_INFO,
  DIGITAL_TWIN_CONFIG,
  content as legacyWorkflowContent,
} from './content.js';
import { initCamera, cameraTo, cameraSet } from './camera.js';
import { initAudio, play } from './audio.js';
import {
  createTriggerNode,
  createIntroNode,
  createHubNode,
  createProjectNode,
  createLetsTalkNode,
  createDigitalTwinNode,
  setNodeState,
  getHandlePos,
} from './nodes.js';
import {
  createConnection,
  animateDrawOn,
  addTravelingDots,
  clearConnections,
} from './connections.js';
import {
  initNavigation,
  setNodes,
  setNavEnabled,
  goTo,
  goNext,
  goPrev,
  toggleOverview,
} from './navigation.js';

/* global gsap */

const STORAGE_LANG_KEY = 'zw_portfolio_lang';
const STORAGE_THEME_KEY = 'zw_portfolio_theme';

let currentLang = 'en';
let currentTheme = 'dark';
let isMobileMenuOpen = false;
let isTwinPanelOpen = false;
let twinIframeMounted = false;
let twinLoadTimer = null;

function getVerifiedTwinUrl() {
  const raw = String(DIGITAL_TWIN_CONFIG?.liveUrl || '').trim();
  if (!raw || raw.includes('YOUR-SERVICE-NAME')) return '';
  if (!/^https?:\/\//i.test(raw)) return '';
  return raw;
}

function getThemedTwinUrl(baseUrl) {
  try {
    const u = new URL(baseUrl);
    u.searchParams.set('__theme', currentTheme === 'light' ? 'light' : 'dark');
    return u.toString();
  } catch (_) {
    return baseUrl;
  }
}

/* ================================================
   1. Theme Management (Light & Dark)
   ================================================ */

function getInitialTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch (_) {
    // ignore storage errors
  }
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'dark';
}

function applyTheme(theme, persist = false) {
  currentTheme = theme === 'light' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);

  if (persist) {
    try {
      localStorage.setItem(STORAGE_THEME_KEY, currentTheme);
    } catch (_) {
      // ignore storage errors
    }
  }

  updateThemeButtonsUI();
}

function toggleTheme() {
  const next = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(next, true);
}

function updateThemeButtonsUI() {
  const dict = SITE_CONTENT[currentLang]?.nav || SITE_CONTENT.en.nav;
  const isLight = currentTheme === 'light';
  const icon = isLight ? '🌙' : '☀️';
  const label = isLight ? dict.themeDark : dict.themeLight;

  const mainBtn = document.getElementById('btn-theme-toggle');
  if (mainBtn) {
    mainBtn.innerHTML = `<span aria-hidden="true">${icon}</span> <span>${label}</span>`;
    mainBtn.setAttribute('aria-label', dict.themeToggleAria);
    mainBtn.setAttribute('aria-pressed', String(isLight));
  }

  const chooserBtn = document.getElementById('chooser-theme-toggle');
  if (chooserBtn) {
    const chooserLabel = isLight ? '🌙 Dark / داكن' : '☀️ Light / فاتح';
    chooserBtn.textContent = chooserLabel;
    chooserBtn.setAttribute('aria-pressed', String(isLight));
  }
}

/* ================================================
   2. Language Selection & Bilingual Rendering
   ================================================ */

function getSavedLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_LANG_KEY);
    if (saved === 'en' || saved === 'ar') return saved;
  } catch (_) {
    // ignore
  }
  return null;
}

function selectLanguage(lang, { fromChooser = false } = {}) {
  currentLang = lang === 'ar' ? 'ar' : 'en';

  try {
    localStorage.setItem(STORAGE_LANG_KEY, currentLang);
  } catch (_) {
    // ignore
  }

  const html = document.documentElement;
  const meta = SITE_CONTENT[currentLang].meta;
  html.setAttribute('lang', meta.lang);
  html.setAttribute('dir', meta.dir);
  html.removeAttribute('data-lang-pending');
  html.setAttribute('data-lang-ready', 'true');

  // Preserve scroll position when toggling language in-page
  const prevScrollY = window.scrollY;

  renderAllContent();
  updateThemeButtonsUI();

  const chooserEl = document.getElementById('lang-chooser');
  if (chooserEl) {
    chooserEl.setAttribute('aria-hidden', 'true');
  }

  if (fromChooser) {
    window.scrollTo(0, 0);
    const mainHeading = document.getElementById('main-heading');
    if (mainHeading) {
      mainHeading.setAttribute('tabindex', '-1');
      mainHeading.focus({ preventScroll: true });
    }
  } else {
    window.scrollTo(0, prevScrollY);
  }
}

function toggleLanguage() {
  const nextLang = currentLang === 'en' ? 'ar' : 'en';
  selectLanguage(nextLang, { fromChooser: false });
}

/* ================================================
   3. Render Page Content (Home & Work Pages)
   ================================================ */

function renderAllContent() {
  const data = SITE_CONTENT[currentLang];
  const isWorkPage = document.body.dataset.page === 'work';

  // Document title
  document.title = isWorkPage ? data.meta.workTitle : data.meta.homeTitle;

  // Render Header & Navigation
  renderHeader(data);

  // Render Page-Specific Sections
  if (isWorkPage) {
    renderWorkPage(data);
  } else {
    renderHomePage(data);
  }

  // Render Footer
  renderFooter(data);

  // Render Right-Docked Digital Twin Widget
  renderDigitalTwin(data);
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el && text !== undefined) {
    el.textContent = text;
  }
}

function renderHeader(data) {
  const { nav } = data;
  setText('brand-name', nav.brandName);
  setText('brand-role', nav.brandRole);

  setText('nav-link-home', nav.home);
  setText('nav-link-about', nav.about);
  setText('nav-link-services', nav.services);
  setText('nav-link-background', nav.background);
  setText('nav-link-work', nav.work);
  setText('nav-link-contact', nav.contact);
  setText('nav-link-back-home', nav.backToHome);

  const langBtn = document.getElementById('btn-lang-switch');
  if (langBtn) {
    langBtn.textContent = nav.langSwitchLabel;
    langBtn.setAttribute('aria-label', nav.langSwitchAria);
  }

  const menuBtn = document.getElementById('btn-mobile-menu');
  if (menuBtn) {
    const labelEl = document.getElementById('mobile-menu-label');
    if (labelEl) {
      labelEl.textContent = isMobileMenuOpen ? nav.menuClose : nav.menuOpen;
    }
    menuBtn.setAttribute('aria-label', nav.menuAria);
    menuBtn.setAttribute('aria-expanded', String(isMobileMenuOpen));
  }
}

function renderHomePage(data) {
  const { hero, about, services, background, contact } = data;

  // --- 1. Hero / Introduction ---
  setText('hero-badge', hero.locationBadge);
  setText('main-heading', hero.headline);
  setText('hero-objective', hero.objective);
  setText('hero-supporting', hero.supporting);

  setText('hero-cta-call-text', hero.ctaCall);
  setText('hero-cta-whatsapp-text', hero.ctaWhatsapp);
  setText('hero-cta-email-text', hero.ctaEmail);
  setText('hero-cta-cv-text', hero.ctaCv);
  setText('hero-cta-cv-word-text', hero.ctaCvWord);
  setText('hero-cta-work', hero.ctaWork);

  const factsEl = document.getElementById('hero-facts');
  if (factsEl) {
    factsEl.innerHTML = hero.quickFacts
      .map(
        f => `
        <div class="hero-fact-item">
          <span class="hero-fact-item__label">${f.label}</span>
          <div class="hero-fact-item__value">${f.value}</div>
        </div>
      `
      )
      .join('');
  }

  // --- 2. About Me ---
  setText('about-eyebrow', about.eyebrow);
  setText('about-title', about.title);
  setText('about-lead', about.lead);

  const aboutParagraphsEl = document.getElementById('about-paragraphs');
  if (aboutParagraphsEl) {
    aboutParagraphsEl.innerHTML = about.paragraphs
      .map(p => `<p class="about-p">${p}</p>`)
      .join('');
  }

  setText('pillars-heading', about.pillarsTitle);
  const pillarsEl = document.getElementById('about-pillars');
  if (pillarsEl) {
    pillarsEl.innerHTML = about.pillars
      .map(
        item => `
        <article class="pillar-card">
          <h4 class="pillar-card__title">${item.title}</h4>
          <p class="pillar-card__desc">${item.desc}</p>
        </article>
      `
      )
      .join('');
  }

  // --- 3. How I Can Help (Services) ---
  setText('services-eyebrow', services.eyebrow);
  setText('services-title', services.title);
  setText('services-subtitle', services.subtitle);

  const servicesGridEl = document.getElementById('services-grid');
  if (servicesGridEl) {
    servicesGridEl.innerHTML = services.items
      .map(
        s => `
        <article class="service-card">
          <h3 class="service-card__title">${s.title}</h3>
          <div class="service-card__benefit">${s.benefit}</div>
          <p class="service-card__desc">${s.desc}</p>
        </article>
      `
      )
      .join('');
  }

  setText('work-banner-title', services.workBannerTitle);
  setText('work-banner-desc', services.workBannerDesc);
  setText('work-banner-cta', services.workBannerCta);

  // --- Featured AI Digital Twin Spotlight ---
  const { featuredTwin } = data;
  if (featuredTwin) {
    const liveUrl = getVerifiedTwinUrl();
    setText('home-twin-eyebrow', featuredTwin.eyebrow);
    setText('home-twin-title', featuredTwin.title);
    setText('home-twin-desc', featuredTwin.description);
    setText('home-twin-stack-label', data.workPage?.toolsLabel || 'Tools Used');

    const statusBadge = document.getElementById('home-twin-status');
    if (statusBadge) {
      statusBadge.className = `project-status-badge ${
        liveUrl ? 'project-status-badge--complete' : 'project-status-badge--dev'
      }`;
      statusBadge.textContent = `● ${liveUrl ? data.digitalTwin.statusBadgeLive : featuredTwin.comingSoonLabel}`;
    }

    const highlightsEl = document.getElementById('home-twin-highlights');
    if (highlightsEl && Array.isArray(featuredTwin.highlights)) {
      highlightsEl.innerHTML = featuredTwin.highlights.map(item => `<li>${item}</li>`).join('');
    }

    const stackEl = document.getElementById('home-twin-stack');
    if (stackEl && Array.isArray(featuredTwin.stack)) {
      stackEl.innerHTML = featuredTwin.stack
        .map(t => `<span class="skill-chip"><span class="ltr-inline">${t}</span></span>`)
        .join('');
    }

    const actionsEl = document.getElementById('home-twin-actions');
    if (actionsEl) {
      const repoUrl = DIGITAL_TWIN_CONFIG.repoUrl || CONTACT_INFO.digitalTwinRepo;
      let primaryHtml = `<span class="demo-status-pill" id="home-twin-coming-soon">${featuredTwin.comingSoonLabel}</span>`;
      if (liveUrl) {
        if (DIGITAL_TWIN_CONFIG.embedEnabled) {
          primaryHtml = `
            <button type="button" class="btn btn--primary" data-open-twin-chat>${featuredTwin.chatCtaLabel}</button>
            <a class="btn btn--secondary" href="${liveUrl}" target="_blank" rel="noopener noreferrer">${featuredTwin.openNewTabLabel}</a>
          `;
        } else {
          primaryHtml = `<a class="btn btn--primary" href="${liveUrl}" target="_blank" rel="noopener noreferrer">${featuredTwin.chatCtaLabel} ↗</a>`;
        }
      }
      actionsEl.innerHTML = `
        ${primaryHtml}
        <a class="btn btn--outline" id="home-twin-view-code" href="${repoUrl}" target="_blank" rel="noopener noreferrer">${featuredTwin.viewCodeLabel}</a>
      `;
    }
    setText('home-twin-note', liveUrl ? '' : featuredTwin.comingSoonNote);
  }

  // --- 4. Background & Credentials ---
  setText('bg-eyebrow', background.eyebrow);
  setText('bg-title', background.title);
  setText('bg-subtitle', background.subtitle);
  setText('bg-cv-cta-text', background.cvCta);
  setText('bg-cv-word-cta-text', background.cvWordCta);

  setText('edu-heading', background.educationTitle);
  const eduEl = document.getElementById('edu-content');
  if (eduEl) {
    eduEl.innerHTML = `
      <div class="cred-item">
        <div class="cred-item__header">
          <h4 class="cred-item__title">${background.education.degree}</h4>
        </div>
        <div class="cred-item__sub">${background.education.institution}</div>
        <div class="cred-item__desc">${background.education.details}</div>
      </div>
    `;
  }

  setText('exp-heading', background.experienceTitle);
  const expEl = document.getElementById('exp-content');
  if (expEl) {
    expEl.innerHTML = background.experience
      .map(
        e => `
        <div class="cred-item">
          <div class="cred-item__header">
            <h4 class="cred-item__title">${e.role}</h4>
            <span class="cred-item__badge">${e.company}</span>
          </div>
          <p class="cred-item__desc">${e.desc}</p>
        </div>
      `
      )
      .join('');
  }

  setText('courses-heading', background.coursesTitle);
  const coursesEl = document.getElementById('courses-content');
  if (coursesEl) {
    coursesEl.innerHTML = background.courses
      .map(
        c => `
        <div class="cred-item">
          <div class="cred-item__header">
            <h4 class="cred-item__title">${c.name}</h4>
            <span class="cred-item__badge">${c.period}</span>
          </div>
          <div class="cred-item__sub">${c.issuer}</div>
        </div>
      `
      )
      .join('');
  }

  setText('skills-heading', background.skillsTitle);
  setText('tech-skills-label', background.techSkillsLabel);
  const techChipsEl = document.getElementById('tech-skills-chips');
  if (techChipsEl) {
    techChipsEl.innerHTML = background.techSkills
      .map(s => `<span class="skill-chip"><span class="ltr-inline">${s}</span></span>`)
      .join('');
  }

  setText('soft-skills-label', background.softSkillsLabel);
  const softChipsEl = document.getElementById('soft-skills-chips');
  if (softChipsEl) {
    softChipsEl.innerHTML = background.softSkills
      .map(s => `<span class="skill-chip skill-chip--soft">${s}</span>`)
      .join('');
  }

  // --- 5. Contact Section ---
  setText('contact-eyebrow', contact.eyebrow);
  setText('contact-title', contact.title);
  setText('contact-lead', contact.lead);
  setText('contact-cta-call-text', contact.callCta);
  setText('contact-cta-whatsapp-text', contact.whatsappCta);
  setText('contact-cta-email-text', contact.emailCta);
  setText('contact-cta-cv-text', contact.cvCta);
  setText('contact-cta-cv-word-text', contact.cvWordCta);

  setText('contact-label-phone', contact.phoneLabel);
  setText('contact-label-whatsapp', contact.whatsappLabel);
  setText('contact-action-whatsapp', contact.whatsappAction);
  setText('contact-label-email', contact.emailLabel);
  setText('contact-label-location', contact.locationLabel);
  setText('contact-value-location', contact.locationValue);
  setText('contact-label-linkedin', contact.linkedinLabel);
  setText('contact-action-linkedin', contact.linkedinAction);
  setText('contact-label-github', contact.githubLabel);
  setText('contact-action-github', contact.githubAction);
  setText('btn-copy-email', contact.copyEmail);
}

function renderWorkPage(data) {
  const { workPage } = data;

  setText('work-eyebrow', workPage.eyebrow);
  setText('main-heading', workPage.title);
  setText('work-lead', workPage.lead);
  setText('work-back-home-cta', workPage.backHomeCta);
  setText('work-contact-cta', workPage.contactCta);
  setText('canvas-section-title', workPage.canvasSectionTitle);
  setText('canvas-section-desc', workPage.canvasSectionDesc);

  const gridEl = document.getElementById('projects-showcase-grid');
  if (gridEl) {
    const liveUrl = getVerifiedTwinUrl();
    gridEl.innerHTML = workPage.projects
      .map(proj => {
        const isFeaturedTwin = !!proj.featured;
        const isLiveTwin = isFeaturedTwin && !!liveUrl;
        const isComplete = proj.status === 'complete' || isLiveTwin;
        const statusClass = isComplete
          ? 'project-status-badge--complete'
          : 'project-status-badge--dev';
        const statusText = isFeaturedTwin
          ? (isLiveTwin ? data.digitalTwin.statusBadgeLive : workPage.liveDemoSoon)
          : (isComplete ? workPage.statusComplete : workPage.statusInDev);
        const chipsHtml = proj.stack
          .map(t => `<span class="skill-chip"><span class="ltr-inline">${t}</span></span>`)
          .join('');
        const repoLabel = isFeaturedTwin ? workPage.viewCodeLabel : workPage.repoLinkLabel;

        let actionsHtml = '';
        if (isFeaturedTwin) {
          if (liveUrl) {
            if (DIGITAL_TWIN_CONFIG.embedEnabled) {
              actionsHtml = `
                <button type="button" class="btn btn--primary" data-open-twin-chat>${workPage.chatCtaLabel}</button>
                <a class="btn btn--secondary" href="${liveUrl}" target="_blank" rel="noopener noreferrer">${workPage.openNewTabLabel}</a>
              `;
            } else {
              actionsHtml = `<a class="btn btn--primary" href="${liveUrl}" target="_blank" rel="noopener noreferrer">${workPage.chatCtaLabel} ↗</a>`;
            }
          } else {
            actionsHtml = `<span class="demo-status-pill">${workPage.liveDemoSoon}</span>`;
          }
          if (proj.repoUrl) {
            actionsHtml += `<a class="btn btn--outline" href="${proj.repoUrl}" target="_blank" rel="noopener noreferrer">${repoLabel}</a>`;
          }
        } else {
          actionsHtml = `
            <a class="btn btn--primary" href="index.html#contact">${workPage.contactCta}</a>
            ${
              proj.repoUrl
                ? `<a class="btn btn--outline" href="${proj.repoUrl}" target="_blank" rel="noopener noreferrer">${repoLabel}</a>`
                : ''
            }
          `;
        }

        return `
          <article class="project-showcase-card ${isFeaturedTwin ? 'project-showcase-card--featured' : ''}" id="project-${proj.id}">
            <div class="project-showcase-card__top">
              <div class="project-showcase-card__meta">
                <div class="project-badge-group">
                  ${isFeaturedTwin ? `<span class="featured-project-badge">★ ${workPage.featuredBadge}</span>` : ''}
                  <span class="project-status-badge ${statusClass}">● ${statusText}</span>
                </div>
              </div>
              <h2 class="project-showcase-card__title">${proj.title}</h2>

              <div class="project-field">
                <span class="project-field__label">${workPage.problemLabel}</span>
                <p class="project-field__text">${proj.problem}</p>
              </div>

              <div class="project-field">
                <span class="project-field__label">${workPage.builtLabel}</span>
                <p class="project-field__text">${proj.built}</p>
              </div>

              <div class="project-field project-field--benefit">
                <span class="project-field__label">${workPage.benefitLabel}</span>
                <p class="project-field__text">${proj.benefit}</p>
              </div>
            </div>

            <div class="project-showcase-card__footer">
              <div>
                <span class="project-field__label">${workPage.toolsLabel}</span>
                <div class="skills-chips" style="margin-top: 8px;">${chipsHtml}</div>
              </div>
              <div class="project-showcase-card__actions">${actionsHtml}</div>
            </div>
          </article>
        `;
      })
      .join('');
  }
}

function renderFooter(data) {
  const { footer } = data;
  setText('footer-copyright', footer.copyright);
  setText('footer-link-work', footer.workLink);
  setText('footer-link-home', footer.homeLink);
  setText('footer-link-cv', footer.cvLink);
  setText('footer-link-cv-word', footer.cvWordLink);
}

/* ================================================
   4. Right-Docked Digital Twin Widget
   ================================================ */

function mountTwinIframeIfNeeded() {
  const liveUrl = getVerifiedTwinUrl();
  if (!liveUrl || !DIGITAL_TWIN_CONFIG.embedEnabled || twinIframeMounted) return;

  const host = document.getElementById('dt-iframe-host');
  const loadingEl = document.getElementById('dt-embed-loading');
  const slowHintEl = document.getElementById('dt-slow-hint');
  const loadingOpenTabEl = document.getElementById('dt-loading-open-tab');
  if (!host) return;

  const dict = SITE_CONTENT[currentLang]?.digitalTwin || SITE_CONTENT.en.digitalTwin;
  const iframe = document.createElement('iframe');
  iframe.id = 'digital-twin-frame';
  iframe.className = 'dt-embed-iframe';
  iframe.src = getThemedTwinUrl(liveUrl);
  iframe.title = dict.iframeTitle;
  iframe.loading = 'lazy';
  iframe.setAttribute('allow', 'clipboard-write');
  iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');

  if (loadingEl) loadingEl.removeAttribute('hidden');
  if (slowHintEl) slowHintEl.setAttribute('hidden', '');
  if (loadingOpenTabEl) {
    loadingOpenTabEl.href = liveUrl;
    loadingOpenTabEl.setAttribute('hidden', '');
  }

  clearTimeout(twinLoadTimer);
  twinLoadTimer = setTimeout(() => {
    if (slowHintEl) slowHintEl.removeAttribute('hidden');
    if (loadingOpenTabEl) loadingOpenTabEl.removeAttribute('hidden');
  }, 15000);

  iframe.addEventListener('load', () => {
    clearTimeout(twinLoadTimer);
    if (loadingEl) loadingEl.setAttribute('hidden', '');
  });

  host.replaceChildren(iframe);
  twinIframeMounted = true;
}

function renderDigitalTwin(data) {
  const { digitalTwin, contact } = data;
  const liveUrl = getVerifiedTwinUrl();
  const canEmbed = !!liveUrl && !!DIGITAL_TWIN_CONFIG.embedEnabled;
  const repoUrl = DIGITAL_TWIN_CONFIG.repoUrl || CONTACT_INFO.digitalTwinRepo;

  setText('dt-launcher-label', digitalTwin.launcherLabel);
  setText('dt-launcher-badge', liveUrl ? digitalTwin.statusBadgeLive : digitalTwin.statusBadgeSoon);
  setText('dt-panel-title', digitalTwin.panelTitle);
  setText('dt-panel-status', liveUrl ? digitalTwin.panelSubtitleLive : digitalTwin.panelSubtitleSoon);
  setText('dt-panel-desc', liveUrl ? digitalTwin.descriptionDirect : digitalTwin.descriptionSoon);
  setText('dt-panel-note', digitalTwin.noteSoon);
  setText('dt-loading-text', digitalTwin.loadingText);
  setText('dt-slow-hint', digitalTwin.slowLoadHint);
  setText('dt-loading-open-tab', digitalTwin.openNewTabLabel);
  setText('dt-open-tab', digitalTwin.openNewTabLabel);
  setText('dt-embed-repo', digitalTwin.viewCodeLabel);
  setText('dt-panel-repo', digitalTwin.viewCodeLabel);
  setText('dt-call-btn', contact.callCta);
  setText('dt-whatsapp-btn', contact.whatsappCta);
  setText('dt-email-btn', contact.emailCta);
  setText('dt-direct-live-btn', `${digitalTwin.chatCtaLabel} ↗`);

  const panel = document.getElementById('dt-panel');
  const embedWrap = document.getElementById('dt-embed-wrap');
  const fallbackBody = document.getElementById('dt-fallback-body');
  const directLiveWrap = document.getElementById('dt-direct-live-wrap');
  const directLiveBtn = document.getElementById('dt-direct-live-btn');
  const openTabEl = document.getElementById('dt-open-tab');
  const loadingOpenTabEl = document.getElementById('dt-loading-open-tab');
  const embedRepoEl = document.getElementById('dt-embed-repo');
  const panelRepoEl = document.getElementById('dt-panel-repo');
  const launcherDot = document.querySelector('.digital-twin-launcher__dot');
  const iframe = document.getElementById('digital-twin-frame');

  if (panel) panel.classList.toggle('digital-twin-panel--live', canEmbed);
  if (embedRepoEl) embedRepoEl.href = repoUrl;
  if (panelRepoEl) panelRepoEl.href = repoUrl;
  if (launcherDot) {
    launcherDot.style.background = liveUrl ? 'var(--success-text)' : 'var(--warning-text)';
  }

  if (canEmbed) {
    if (embedWrap) embedWrap.removeAttribute('hidden');
    if (fallbackBody) fallbackBody.setAttribute('hidden', '');
    if (openTabEl) openTabEl.href = liveUrl;
    if (loadingOpenTabEl) loadingOpenTabEl.href = liveUrl;
    if (iframe) iframe.title = digitalTwin.iframeTitle;
  } else {
    if (embedWrap) embedWrap.setAttribute('hidden', '');
    if (fallbackBody) fallbackBody.removeAttribute('hidden');
    if (directLiveWrap && directLiveBtn) {
      if (liveUrl) {
        directLiveBtn.href = liveUrl;
        directLiveWrap.removeAttribute('hidden');
      } else {
        directLiveWrap.setAttribute('hidden', '');
      }
    }
  }

  const launcherBtn = document.getElementById('dt-launcher');
  if (launcherBtn) {
    launcherBtn.setAttribute('aria-label', liveUrl ? digitalTwin.openAriaLive : digitalTwin.openAriaSoon);
  }
  const minBtn = document.getElementById('dt-minimize');
  if (minBtn) {
    minBtn.setAttribute('aria-label', digitalTwin.minimizeAria);
  }
  const closeBtn = document.getElementById('dt-close');
  if (closeBtn) {
    closeBtn.setAttribute('aria-label', digitalTwin.closeAria);
  }
}

function setTwinPanelOpen(open, restoreFocus = false) {
  isTwinPanelOpen = !!open;
  const panel = document.getElementById('dt-panel');
  const launcher = document.getElementById('dt-launcher');
  if (!panel || !launcher) return;

  if (isTwinPanelOpen) {
    mountTwinIframeIfNeeded();
    panel.removeAttribute('hidden');
    launcher.setAttribute('aria-expanded', 'true');
    const closeBtn = document.getElementById('dt-close');
    if (closeBtn) closeBtn.focus({ preventScroll: true });
  } else {
    panel.setAttribute('hidden', '');
    launcher.setAttribute('aria-expanded', 'false');
    if (restoreFocus) {
      launcher.focus({ preventScroll: true });
    }
  }
}

/* ================================================
   5. Optional Interactive Workflow Canvas (work.html)
   ================================================ */

function initOptionalWorkflowCanvas() {
  const viewport = document.getElementById('viewport');
  const world = document.getElementById('world');
  const svgLayer = document.getElementById('connections-svg');
  if (!viewport || !world || !svgLayer || typeof gsap === 'undefined') return;

  initCamera(viewport, world);
  initNavigation({ viewport });

  const GAP = 680;
  const PROJECT_GAP_X = 620;
  const PROJECT_GAP_Y = 260;

  const projects = legacyWorkflowContent.projects;
  const count = projects.length;
  const totalHeight = (count - 1) * PROJECT_GAP_Y;
  const startY = -totalHeight / 2;

  const layout = {
    trigger: { x: 0, y: 0 },
    intro: { x: GAP, y: 0 },
    hub: { x: GAP * 2, y: 0 },
    projects: projects.map((_, i) => ({
      x: GAP * 2 + PROJECT_GAP_X,
      y: startY + i * PROJECT_GAP_Y,
    })),
    letsTalk: { x: GAP * 2 + PROJECT_GAP_X + GAP, y: 0 },
    digitalTwin: { x: GAP * 2 + PROJECT_GAP_X + GAP * 2, y: 0 },
  };

  let workflowBuilt = false;
  let audioReady = false;
  let dotCleanups = [];

  const triggerNode = createTriggerNode(world, layout.trigger.x, layout.trigger.y);
  cameraSet(layout.trigger.x, layout.trigger.y, 1);
  gsap.set(triggerNode, { opacity: 1, scale: 1 });

  function runCanvasWorkflow() {
    if (!audioReady) {
      initAudio();
      audioReady = true;
    }
    play('click');

    if (workflowBuilt) {
      goTo(1, true);
      return;
    }

    workflowBuilt = true;
    setNodeState(triggerNode, 'running');

    const introNode = createIntroNode(world, layout.intro.x, layout.intro.y, {
      title: legacyWorkflowContent.title,
      pitch: legacyWorkflowContent.pitch,
      credential: legacyWorkflowContent.credential,
    });
    const hubNode = createHubNode(world, layout.hub.x, layout.hub.y, 'My Work');
    const projectNodes = projects.map((proj, i) =>
      createProjectNode(world, layout.projects[i].x, layout.projects[i].y, proj, i)
    );
    const letsTalkNode = createLetsTalkNode(world, layout.letsTalk.x, layout.letsTalk.y);
    const digitalTwinNode = createDigitalTwinNode(
      world,
      layout.digitalTwin.x,
      layout.digitalTwin.y,
      legacyWorkflowContent.digitalTwin
    );

    const allRefs = [
      { el: triggerNode, x: layout.trigger.x, y: layout.trigger.y, id: 'trigger' },
      { el: introNode, x: layout.intro.x, y: layout.intro.y, id: 'intro' },
      { el: hubNode, x: layout.hub.x, y: layout.hub.y, id: 'hub' },
      ...projects.map((p, i) => ({
        el: projectNodes[i],
        x: layout.projects[i].x,
        y: layout.projects[i].y,
        id: p.id,
      })),
      { el: letsTalkNode, x: layout.letsTalk.x, y: layout.letsTalk.y, id: 'lets-talk' },
      { el: digitalTwinNode, x: layout.digitalTwin.x, y: layout.digitalTwin.y, id: 'digital-twin' },
    ];

    setNodes(allRefs);

    // Animate running counter 000 -> 100
    const counterEl = triggerNode.querySelector('.node__counter');
    if (counterEl) {
      const counterObj = { val: 0 };
      gsap.to(counterObj, {
        val: 100,
        duration: 0.55,
        ease: 'power1.inOut',
        onUpdate: () => {
          counterEl.textContent = String(Math.round(counterObj.val)).padStart(3, '0');
        },
      });
    }

    setTimeout(() => {
      setNodeState(triggerNode, 'success');
      play('chime');

      // Connect all nodes immediately for smooth exploration
      const pairs = [
        [triggerNode, introNode],
        [introNode, hubNode],
        ...projectNodes.map(pNode => [hubNode, pNode]),
        [projectNodes[projectNodes.length - 1], letsTalkNode],
        [letsTalkNode, digitalTwinNode],
      ];

      pairs.forEach(([fromEl, toEl]) => {
        const from = getHandlePos(fromEl, 'output');
        const to = getHandlePos(toEl, 'input');
        const path = createConnection(svgLayer, from.x, from.y, to.x, to.y);
        animateDrawOn(path, 0.45);
        dotCleanups.push(addTravelingDots(svgLayer, path, 2));
      });

      allRefs.forEach(ref => {
        gsap.to(ref.el, { opacity: 1, duration: 0.35 });
      });

      setNavEnabled(true);
      goTo(1, true);
    }, 600);
  }

  world.addEventListener('click', e => {
    if (e.target.closest('.btn-execute')) {
      runCanvasWorkflow();
      return;
    }
    const openProjBtn = e.target.closest('.btn-open-project');
    if (openProjBtn) {
      const pid = openProjBtn.dataset.projectId;
      const card = document.getElementById(`project-${pid}`);
      if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (e.target.closest('.btn-more-about')) {
      window.location.href = 'index.html#about';
      return;
    }
    if (e.target.closest('.btn-contact')) {
      window.location.href = 'index.html#contact';
      return;
    }
    if (e.target.closest('.btn-digital-twin')) {
      setTwinPanelOpen(true);
      return;
    }
    // Clicking any node card focuses the camera on that node
    const clickedNode = e.target.closest('.node');
    if (clickedNode && workflowBuilt) {
      const allNodes = Array.from(world.querySelectorAll('.node'));
      const idx = allNodes.indexOf(clickedNode);
      if (idx >= 0) {
        goTo(idx, true);
      }
    }
  });

  document.getElementById('btn-prev')?.addEventListener('click', () => goPrev());
  document.getElementById('btn-next')?.addEventListener('click', () => goNext());
  document.getElementById('btn-overview')?.addEventListener('click', () => toggleOverview());
}

/* ================================================
   6. Event Listeners & Initialization
   ================================================ */

function initEvents() {
  // Language Chooser buttons
  document.getElementById('choose-en')?.addEventListener('click', () => {
    selectLanguage('en', { fromChooser: true });
  });
  document.getElementById('choose-ar')?.addEventListener('click', () => {
    selectLanguage('ar', { fromChooser: true });
  });

  // In-page Language Switcher
  document.getElementById('btn-lang-switch')?.addEventListener('click', () => {
    toggleLanguage();
  });

  // Theme toggles (header + language chooser)
  document.getElementById('btn-theme-toggle')?.addEventListener('click', () => {
    toggleTheme();
  });
  document.getElementById('chooser-theme-toggle')?.addEventListener('click', () => {
    toggleTheme();
  });

  // Mobile navigation menu toggle
  const mobileMenuBtn = document.getElementById('btn-mobile-menu');
  const siteNav = document.getElementById('site-nav');
  if (mobileMenuBtn && siteNav) {
    mobileMenuBtn.addEventListener('click', () => {
      isMobileMenuOpen = !isMobileMenuOpen;
      siteNav.classList.toggle('site-nav--open', isMobileMenuOpen);
      renderHeader(SITE_CONTENT[currentLang]);
    });

    siteNav.addEventListener('click', e => {
      if (e.target.closest('.site-nav__link') && isMobileMenuOpen) {
        isMobileMenuOpen = false;
        siteNav.classList.remove('site-nav--open');
        renderHeader(SITE_CONTENT[currentLang]);
      }
    });
  }

  // Copy Email button in Contact section
  const copyBtn = document.getElementById('btn-copy-email');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const dict = SITE_CONTENT[currentLang].contact;
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(CONTACT_INFO.email);
        }
        copyBtn.textContent = dict.copiedEmail;
        setTimeout(() => {
          copyBtn.textContent = SITE_CONTENT[currentLang].contact.copyEmail;
        }, 2000);
      } catch (_) {
        window.location.href = CONTACT_INFO.emailHref;
      }
    });
  }

  // Digital Twin launcher, minimize, close, and inline "Chat with My Digital Twin" triggers
  document.getElementById('dt-launcher')?.addEventListener('click', () => {
    setTwinPanelOpen(!isTwinPanelOpen);
  });
  document.addEventListener('click', e => {
    if (e.target.closest('[data-open-twin-chat]')) {
      setTwinPanelOpen(true);
    }
  });
  document.getElementById('dt-minimize')?.addEventListener('click', () => {
    setTwinPanelOpen(false, true);
  });
  document.getElementById('dt-close')?.addEventListener('click', () => {
    setTwinPanelOpen(false, true);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (isTwinPanelOpen) {
        setTwinPanelOpen(false, true);
      }
      if (isMobileMenuOpen && siteNav) {
        isMobileMenuOpen = false;
        siteNav.classList.remove('site-nav--open');
        renderHeader(SITE_CONTENT[currentLang]);
      }
    }
  });

  // Scroll-spy for homepage navigation links
  if (document.body.dataset.page !== 'work') {
    const sections = ['home', 'about', 'services', 'background', 'contact'];
    window.addEventListener(
      'scroll',
      () => {
        const scrollPos = window.scrollY + 140;
        let currentSec = 'home';
        for (const id of sections) {
          const el = document.getElementById(id);
          if (el && el.offsetTop <= scrollPos) {
            currentSec = id;
          }
        }
        document.querySelectorAll('.site-nav__link[data-section]').forEach(link => {
          const isMatch = link.dataset.section === currentSec;
          link.classList.toggle('site-nav__link--active', isMatch);
          if (isMatch) {
            link.setAttribute('aria-current', 'location');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      },
      { passive: true }
    );
  }
}

function init() {
  // 1. Apply initial theme
  applyTheme(getInitialTheme(), false);

  // 2. Check saved language preference
  const savedLang = getSavedLanguage();
  if (savedLang) {
    selectLanguage(savedLang, { fromChooser: false });
  } else {
    // First visit: keep language chooser visible and render default strings in background
    currentLang = 'en';
    document.documentElement.setAttribute('data-lang-pending', 'true');
    renderAllContent();
    updateThemeButtonsUI();
  }

  // 3. Wire events
  initEvents();

  // 4. Initialize optional workflow canvas if on work.html
  initOptionalWorkflowCanvas();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
