/* ============================================================
   CALM DOWN APP — MAIN LOGIC
   ============================================================ */

// ============================================================
// CONSTANTS & DATA
// ============================================================

const STRESS_DESCRIPTIONS = {
  1:  'A little uneasy — something\'s on your mind.',
  2:  'Mild tension — noticeable but manageable.',
  3:  'Low stress — off but still functioning.',
  4:  'Noticeable anxiety — thoughts starting to race.',
  5:  'Moderate stress — harder to focus and settle.',
  6:  'Anxious and overwhelmed — difficult to think clearly.',
  7:  'High stress — body and mind both affected.',
  8:  'Significant distress — hard to function normally.',
  9:  'Near-crisis level — everything feels urgent.',
  10: 'Complete overwhelm — hard to function at all.'
};

const CATEGORIES = [
  {
    id: 'physical',
    label: 'Physical',
    description: 'My body feels tense, tired, or out of control. I\'m not sleeping or eating well.',
    badgeClass: 'badge--physical'
  },
  {
    id: 'mental',
    label: 'Intellectual (Mental)',
    description: 'My thoughts are racing. I can\'t think clearly or stop worrying.',
    badgeClass: 'badge--mental'
  },
  {
    id: 'emotional',
    label: 'Emotional',
    description: 'My feelings are overwhelming me. I feel hopeless, sad, or like I\'m drowning.',
    badgeClass: 'badge--emotional'
  },
  {
    id: 'spiritual',
    label: 'Spiritual',
    description: 'I feel disconnected from what matters. I\'ve lost my sense of peace and purpose.',
    badgeClass: 'badge--spiritual'
  }
];

const TOOLS = [
  {
    id: 'box-breathing',
    name: 'Box Breathing',
    categories: ['physical', 'mental'],
    categoryLabels: ['Physical', 'Mental'],
    time: '3–4 min',
    description: 'Follow a visual guide through four equal breathing phases to activate your calm response.',
    stressWeight: { high: 10, moderate: 8, low: 6 }
  },
  {
    id: 'full-trunk-breathing',
    name: 'Full Trunk Deep Breathing',
    categories: ['physical', 'mental'],
    categoryLabels: ['Physical', 'Mental'],
    time: '2–3 min',
    description: 'A slower, body-awareness breathing exercise focused on breathing into your entire trunk.',
    stressWeight: { high: 8, moderate: 7, low: 5 }
  },
  {
    id: 'growth-mindset',
    name: 'Growth Mindset Reframe',
    categories: ['mental'],
    categoryLabels: ['Mental'],
    time: '3–5 min',
    description: 'Walk from an overwhelming thought to a growth-focused question, one step at a time.',
    stressWeight: { high: 3, moderate: 8, low: 9 }
  },
  {
    id: 'habit-loop',
    name: 'Habit Loop Audit',
    categories: ['mental'],
    categoryLabels: ['Mental'],
    time: '5–7 min',
    description: 'Identify a negative habit loop and begin designing a healthier replacement behavior.',
    stressWeight: { high: 2, moderate: 6, low: 9 }
  },
  {
    id: 'gratitude',
    name: 'Gratitude / Focus on the Good',
    categories: ['emotional'],
    categoryLabels: ['Emotional'],
    time: '2–4 min',
    description: 'Gently shift attention toward what is still good to interrupt the emotional spiral.',
    stressWeight: { high: 5, moderate: 8, low: 9 }
  },
  {
    id: 'name-the-lie',
    name: 'Name the Lie, Say the Truth',
    categories: ['emotional', 'mental'],
    categoryLabels: ['Emotional', 'Mental'],
    time: '5–8 min',
    description: 'Identify a negative thought you\'re believing and replace it with what is actually true.',
    stressWeight: { high: 3, moderate: 7, low: 8 }
  },
  {
    id: 'resourcing',
    name: 'Resourcing / Safe Place',
    categories: ['emotional'],
    categoryLabels: ['Emotional'],
    time: '3–5 min',
    description: 'Mentally visit a safe, calming place you create in your imagination to reduce overwhelm.',
    stressWeight: { high: 7, moderate: 8, low: 7 }
  },
  {
    id: 'mantra',
    name: 'Positive Mantra / Affirmation',
    categories: ['spiritual'],
    categoryLabels: ['Spiritual'],
    time: '2–3 min',
    description: 'Select or write a phrase and sit with it intentionally for two minutes.',
    stressWeight: { high: 6, moderate: 7, low: 8 }
  },
  {
    id: 'prayer',
    name: 'Prayer Prompt',
    categories: ['spiritual'],
    categoryLabels: ['Spiritual'],
    time: '2–5 min',
    description: 'A gentle prompt for prayer, with optional starter prayers provided.',
    stressWeight: { high: 6, moderate: 7, low: 8 }
  },
  {
    id: 'values',
    name: 'Values Alignment Check',
    categories: ['spiritual'],
    categoryLabels: ['Spiritual'],
    time: '4–6 min',
    description: 'Reconnect with what you genuinely care about and notice where life may be off course.',
    stressWeight: { high: 2, moderate: 5, low: 9 }
  },
  {
    id: 'sleep',
    name: 'Sleep Hygiene Quick Guide',
    categories: ['physical'],
    categoryLabels: ['Physical'],
    time: '2 min',
    description: 'Evidence-based sleep tips that directly improve your ability to handle stress.',
    stressWeight: { high: 3, moderate: 5, low: 8 }
  },
  {
    id: 'movement',
    name: 'Movement Prompt',
    categories: ['physical'],
    categoryLabels: ['Physical'],
    time: '2 min',
    description: 'Low-barrier movement options to release physical stress from your body.',
    stressWeight: { high: 7, moderate: 7, low: 6 }
  },
  {
    id: 'journaling',
    name: 'Journaling Prompt',
    categories: ['emotional'],
    categoryLabels: ['Emotional'],
    time: '5–10 min',
    description: 'An open-ended space to externalize and process what you are feeling.',
    stressWeight: { high: 3, moderate: 6, low: 9 }
  },
  {
    id: 'grounding',
    name: '5-Senses Grounding',
    categories: ['mental', 'physical'],
    categoryLabels: ['Mental', 'Physical'],
    time: '2–3 min',
    description: 'Anchor yourself to the present moment by slowly going through each of your five senses.',
    stressWeight: { high: 9, moderate: 7, low: 4 }
  },
  {
    id: 'nutrition',
    name: 'Nutrition Quick Guide',
    categories: ['physical'],
    categoryLabels: ['Physical'],
    time: '2 min',
    description: 'Evidence-based eating tips to stabilize your body and mind when stress affects your appetite.',
    stressWeight: { high: 3, moderate: 5, low: 8 }
  },
  {
    id: 'mindfulness',
    name: 'Mindfulness Check-In',
    categories: ['mental', 'emotional'],
    categoryLabels: ['Mental', 'Emotional'],
    time: '3–5 min',
    description: 'Turn toward what you\'re feeling with curiosity instead of fighting it — lean in and let the wave pass.',
    stressWeight: { high: 5, moderate: 8, low: 7 }
  }
];

const AFFIRMATIONS = {
  faithBased: [
    'God, help me. I need you right now.',
    'I can do all things through Christ who strengthens me.',
    'The Lord is close to the brokenhearted.',
    'Be still and know that I am God.',
    'Cast all your anxiety on him because he cares for you.',
    'Peace I leave with you; my peace I give you.'
  ],
  universal: [
    'This feeling is temporary.',
    'I am not my circumstances.',
    'I am stronger than this moment.',
    'I can handle hard things.',
    'I am worthy of peace.',
    'One moment at a time.',
    'I have survived every hard thing until now.',
    'I am enough as I am.',
    'This too shall pass.',
    'I choose to take this one breath at a time.'
  ]
};

// ============================================================
// STATE
// ============================================================

const state = {
  stressLevel: null,
  sessionStartLevel: null,
  currentStressLevel: null,
  stressHistory: [],
  toolsUsed: [],
  selectedCategories: [],
  safetyShown: false,
  currentTool: null,
  recommendedToolIds: [],
  activeTimers: [],
  quickSession: false,
  sessionResponses: []
};

// ============================================================
// UTILITIES
// ============================================================

function $(id) { return document.getElementById(id); }

function clearTimers() {
  state.activeTimers.forEach(id => clearInterval(id));
  state.activeTimers = [];
}

function addTimer(id) {
  state.activeTimers.push(id);
  return id;
}

function formatSeconds(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m > 0
    ? `${m}:${String(sec).padStart(2, '0')}`
    : `${sec}s`;
}

function stressBand(level) {
  if (level >= 7) return 'high';
  if (level >= 4) return 'moderate';
  return 'low';
}

// ============================================================
// DOWNLOAD UTILITY
// ============================================================

function downloadText(filename, content) {
  // Capture this tool's content for the session summary (skip if already captured)
  const toolId = state.currentTool;
  if (toolId && !state.sessionResponses.some(r => r.toolId === toolId)) {
    state.sessionResponses.push({ toolId, filename, content });
  }
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Capture any visible textarea content when user leaves a tool (covers journal + in-progress tools)
function captureCurrentToolTextareas() {
  if (!state.currentTool) return;
  if (state.sessionResponses.some(r => r.toolId === state.currentTool)) return;
  const container = $('tool-container');
  if (!container) return;
  const filled = [...container.querySelectorAll('textarea')].filter(ta => ta.value.trim());
  if (filled.length === 0) return;
  const toolName = TOOLS.find(t => t.id === state.currentTool)?.name || 'Tool';
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  let text = `Calm Down — ${toolName}\n${date}\n\n${'='.repeat(44)}\n\n`;
  filled.forEach(ta => {
    const prev = ta.previousElementSibling;
    const question = prev?.textContent?.trim() || 'Your response';
    text += `${question}\n\n${ta.value.trim()}\n\n${'-'.repeat(44)}\n\n`;
  });
  text += 'Privacy note: This file was created entirely on your device.\nNo data was saved, recorded, or transmitted by Calm Down.';
  state.sessionResponses.push({
    toolId: state.currentTool,
    filename: `calm-down-${state.currentTool}.txt`,
    content: text
  });
}

function buildSessionSummaryText() {
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const time = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  let text = `Calm Down — Session Summary\n${date} at ${time}\n\n${'='.repeat(44)}\n\n`;

  const start = state.sessionStartLevel;
  const end = state.currentStressLevel || state.stressLevel;
  if (start) {
    text += `STRESS JOURNEY\n`;
    text += `Started: ${start}/10\n`;
    if (end) {
      text += `Ended:   ${end}/10\n`;
      const diff = start - end;
      if (diff > 0)      text += `Shift:   ↓ ${diff} point${diff !== 1 ? 's' : ''}\n`;
      else if (diff < 0) text += `Shift:   ↑ ${Math.abs(diff)} point${Math.abs(diff) !== 1 ? 's' : ''}\n`;
    }
    text += `\n${'-'.repeat(44)}\n\n`;
  }

  if (state.toolsUsed.length > 0) {
    const names = state.toolsUsed.map(id => TOOLS.find(t => t.id === id)?.name).filter(Boolean);
    text += `TOOLS TRIED\n`;
    names.forEach(n => { text += `• ${n}\n`; });
    text += `\n${'-'.repeat(44)}\n\n`;
  }

  if (state.sessionResponses.length > 0) {
    text += `YOUR WRITTEN RESPONSES\n\n`;
    state.sessionResponses.forEach(r => {
      text += r.content;
      text += `\n\n${'='.repeat(44)}\n\n`;
    });
  } else {
    text += 'Privacy note: This file was created entirely on your device.\nNo data was saved, recorded, or transmitted by Calm Down.';
  }
  return text;
}

function renderSessionSummaryCard() {
  const card = $('session-summary-card');
  if (!card) return;
  const start = state.sessionStartLevel;
  const end = state.currentStressLevel || state.stressLevel;
  const toolNames = state.toolsUsed.map(id => TOOLS.find(t => t.id === id)?.name).filter(Boolean);
  let html = '';
  if (start) {
    const endLabel = end ? `${end}/10` : '–';
    const diff = end ? start - end : null;
    const shift = diff > 0 ? ` (↓ ${diff})` : diff < 0 ? ` (↑ ${Math.abs(diff)})` : '';
    html += `<div class="summary-row">
      <span class="summary-label">Stress</span>
      <span class="summary-value">${start}/10 → ${endLabel}${shift}</span>
    </div>`;
  }
  if (toolNames.length > 0) {
    html += `<div class="summary-row">
      <span class="summary-label">Tools tried</span>
      <span class="summary-value">${toolNames.join(', ')}</span>
    </div>`;
  }
  if (state.sessionResponses.length > 0) {
    const label = state.sessionResponses.length === 1 ? '1 response captured' : `${state.sessionResponses.length} responses captured`;
    html += `<div class="summary-row">
      <span class="summary-label">Written</span>
      <span class="summary-value">${label}</span>
    </div>`;
  }
  card.innerHTML = html || '<p style="color:var(--color-text-muted);font-size:14px;text-align:center;padding:8px 0">Great job showing up today.</p>';
}

function showSummaryPage() {
  $('overlay-done-page').classList.add('hidden');
  $('overlay-checkin-page').classList.add('hidden');
  $('overlay-summary-page').classList.remove('hidden');
  renderSessionSummaryCard();
}

function buildResponseText(toolName, entries) {
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  let text = `Calm Down — ${toolName}\n${date}\n\n${'='.repeat(44)}\n\n`;
  entries.forEach(({ label, question, response }) => {
    if (label) text += `[${label}]\n`;
    text += `${question}\n\n`;
    text += (response && response.trim()) ? response.trim() : '(no response written)';
    text += `\n\n${'-'.repeat(44)}\n\n`;
  });
  text += 'Privacy note: This file was created entirely on your device.\n';
  text += 'No data was saved, recorded, or transmitted by Calm Down.';
  return text;
}

function renderDownloadBlock(btnId, onDownload) {
  return `
    <button class="btn--download-responses" id="${btnId}">Download my responses</button>
    <p class="download-privacy-note">Saves only to your device — nothing is ever transmitted.</p>
  `;
}

// ============================================================
// INSTALL MODAL
// ============================================================

function showInstallModal() {
  const modal = $('install-modal');
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
}

function hideInstallModal() {
  const modal = $('install-modal');
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
  localStorage.setItem('calm-install-seen', '1');
}

function initInstallModal() {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone === true;

  if (isStandalone) {
    const btn = $('btn-open-install-modal');
    if (btn) btn.style.display = 'none';
    return;
  }

  if (!localStorage.getItem('calm-install-seen')) {
    showInstallModal();
  }

  $('btn-open-install-modal').addEventListener('click', showInstallModal);
  $('btn-close-install-modal').addEventListener('click', hideInstallModal);
  $('btn-install-modal-ok').addEventListener('click', hideInstallModal);
  $('install-modal-backdrop').addEventListener('click', hideInstallModal);
}

// ============================================================
// LEGAL MODALS (Terms, Privacy, Attribution)
// ============================================================

function initLegalModals() {
  [
    { openId: 'btn-open-terms',       modalId: 'terms-modal',       closeId: 'btn-close-terms-modal',       okId: 'btn-terms-ok',       backdropId: 'terms-modal-backdrop' },
    { openId: 'btn-open-privacy',     modalId: 'privacy-modal',     closeId: 'btn-close-privacy-modal',     okId: 'btn-privacy-ok',     backdropId: 'privacy-modal-backdrop' },
    { openId: 'btn-open-attribution',        modalId: 'attribution-modal', closeId: 'btn-close-attribution-modal', okId: 'btn-attribution-ok', backdropId: 'attribution-modal-backdrop' },
    { openId: 'btn-open-attribution-footer', modalId: 'attribution-modal', closeId: 'btn-close-attribution-modal', okId: 'btn-attribution-ok', backdropId: 'attribution-modal-backdrop' },
    { openId: 'btn-open-version',     modalId: 'version-modal',     closeId: 'btn-close-version-modal',     okId: 'btn-version-ok',     backdropId: 'version-modal-backdrop' }
  ].forEach(({ openId, modalId, closeId, okId, backdropId }) => {
    const modal = $(modalId);
    const show = () => { modal.classList.remove('hidden'); modal.setAttribute('aria-hidden', 'false'); };
    const hide = () => { modal.classList.add('hidden'); modal.setAttribute('aria-hidden', 'true'); };
    $(openId).addEventListener('click', show);
    $(closeId).addEventListener('click', hide);
    $(okId).addEventListener('click', hide);
    $(backdropId).addEventListener('click', hide);
  });

  $('btn-open-version').addEventListener('click', () => {
    const meta = document.querySelector('meta[name="app-version"]');
    const version = (meta && meta.content && meta.content !== '__APP_VERSION__')
      ? meta.content
      : 'calm-down-v1.0-dev';
    $('build-version-string').textContent = version;
  });
}

// ============================================================
// THEME
// ============================================================

function applyTheme(name) {
  document.documentElement.setAttribute('data-theme', name);
  document.querySelectorAll('.theme-swatch').forEach(s => {
    s.classList.toggle('theme-swatch--active', s.dataset.theme === name);
  });
  localStorage.setItem('calm-theme', name);
}

function initTheme() {
  const saved = localStorage.getItem('calm-theme') || 'midnight';
  applyTheme(saved);
  document.querySelectorAll('.theme-swatch').forEach(swatch => {
    swatch.addEventListener('click', () => applyTheme(swatch.dataset.theme));
  });
}

// ============================================================
// SCREEN NAVIGATION
// ============================================================

const SCREENS = ['screen-checkin', 'screen-safety', 'screen-categories', 'screen-plan', 'screen-tool'];

function showScreen(id) {
  clearTimers();
  VoiceGuide.cancel();
  SCREENS.forEach(sid => {
    const el = $(sid);
    if (sid === id) {
      el.classList.add('screen--active');
      el.scrollTop = 0;
    } else {
      el.classList.remove('screen--active');
    }
  });
}

// ============================================================
// SCREEN 1: STRESS CHECK-IN
// ============================================================

function initStressScale() {
  const container = $('scale-numbers');
  container.innerHTML = '';

  for (let i = 1; i <= 10; i++) {
    const range = i <= 3 ? 'low' : i <= 6 ? 'mid' : 'high';
    const btn = document.createElement('button');
    btn.className = 'stress-btn';
    btn.setAttribute('data-level', i);
    btn.setAttribute('data-range', range);
    btn.setAttribute('role', 'radio');
    btn.setAttribute('aria-checked', 'false');
    btn.setAttribute('aria-label', `Stress level ${i}`);
    btn.textContent = i;
    btn.addEventListener('click', () => selectStress(i));
    container.appendChild(btn);
  }
}

function selectStress(level) {
  state.stressLevel = level;

  document.querySelectorAll('.stress-btn').forEach(btn => {
    const isSelected = Number(btn.dataset.level) === level;
    btn.classList.toggle('stress-btn--selected', isSelected);
    btn.setAttribute('aria-checked', isSelected ? 'true' : 'false');
  });

  $('stress-description').textContent = STRESS_DESCRIPTIONS[level];

  const continueBtn = $('btn-continue-checkin');
  continueBtn.disabled = false;
  continueBtn.removeAttribute('aria-disabled');
}

function handleContinueCheckin() {
  if (!state.stressLevel) return;

  if (state.stressLevel >= 8 && !state.safetyShown) {
    showScreen('screen-safety');
  } else {
    showScreen('screen-categories');
    renderCategories();
  }
}

// ============================================================
// SAFETY INTERSTITIAL
// ============================================================

function handleSafetyOk() {
  state.safetyShown = true;
  showScreen('screen-categories');
  renderCategories();
}

// ============================================================
// SCREEN 2: CATEGORY SELECTION
// ============================================================

function renderCategories() {
  const grid = $('category-grid');
  grid.innerHTML = '';
  state.selectedCategories = [];
  updateBuildPlanBtn();

  CATEGORIES.forEach(cat => {
    const card = document.createElement('button');
    card.className = `category-card cat-${cat.id}`;
    card.setAttribute('aria-pressed', 'false');
    card.setAttribute('aria-label', cat.label);
    card.dataset.catId = cat.id;

    card.innerHTML = `
      <span class="category-card__title">
        <span class="category-checkmark"></span>
        ${cat.label}
      </span>
      <span class="category-card__desc">${cat.description}</span>
    `;

    card.addEventListener('click', () => toggleCategory(cat.id));
    grid.appendChild(card);
  });
}

function toggleCategory(id) {
  const idx = state.selectedCategories.indexOf(id);
  if (idx === -1) {
    state.selectedCategories.push(id);
  } else {
    state.selectedCategories.splice(idx, 1);
  }

  document.querySelectorAll('.category-card').forEach(card => {
    const isSelected = state.selectedCategories.includes(card.dataset.catId);
    card.classList.toggle('category-card--selected', isSelected);
    card.setAttribute('aria-pressed', isSelected ? 'true' : 'false');

    const check = card.querySelector('.category-checkmark');
    check.textContent = isSelected ? '✓' : '';
  });

  updateBuildPlanBtn();
}

function updateBuildPlanBtn() {
  const btn = $('btn-build-plan');
  const hasSelection = state.selectedCategories.length > 0;
  btn.disabled = !hasSelection;
  btn.setAttribute('aria-disabled', hasSelection ? 'false' : 'true');
}

function handleBuildPlan() {
  if (state.selectedCategories.length === 0) return;
  if (state.sessionStartLevel === null) {
    state.sessionStartLevel = state.stressLevel;
    state.currentStressLevel = state.stressLevel;
  }
  renderPlan();
  showScreen('screen-plan');
}

// ============================================================
// SCREEN 3: CALM-DOWN PLAN
// ============================================================

function getRecommendedTools() {
  const band = stressBand(state.stressLevel);

  const scored = TOOLS.map(tool => {
    let score = tool.stressWeight[band];
    const matched = tool.categories.filter(c => state.selectedCategories.includes(c)).length;
    score += matched * 4;
    return { ...tool, score };
  });

  // Box breathing always first for high stress
  if (band === 'high') {
    const bb = scored.find(t => t.id === 'box-breathing');
    if (bb) bb.score = 999;
  }

  scored.sort((a, b) => b.score - a.score);
  return scored;
}

function renderToolCardHTML(tool) {
  const badgesHTML = tool.categoryLabels
    .map(label => {
      const cls = label.toLowerCase().replace(/[^a-z]/g, '');
      return `<span class="badge badge--${cls}">${label}</span>`;
    })
    .join('');

  return `
    <button class="tool-card" data-tool-id="${tool.id}" role="listitem" aria-label="Start ${tool.name}">
      <div class="tool-card__header">
        <span class="tool-card__name">${tool.name}</span>
        <span class="tool-card__time">${tool.time}</span>
      </div>
      <div class="tool-card__badges">${badgesHTML}</div>
      <p class="tool-card__desc">${tool.description}</p>
      <span class="tool-card__arrow">→</span>
    </button>
  `;
}

function renderPlan() {
  const allSorted = getRecommendedTools();
  const recommended = allSorted.slice(0, 5);
  const others = allSorted.slice(5);

  state.recommendedToolIds = recommended.map(t => t.id);

  const recContainer = $('recommended-tools');
  recContainer.innerHTML = recommended.map(renderToolCardHTML).join('');

  const otherContainer = $('other-tools-list');
  otherContainer.innerHTML = others.map(renderToolCardHTML).join('');

  // Attach click handlers for all tool cards
  document.querySelectorAll('.tool-card').forEach(card => {
    card.addEventListener('click', () => {
      selectTool(card.dataset.toolId);
    });
  });

  // Reset other tools toggle state
  const toggle = $('other-tools-toggle');
  toggle.setAttribute('aria-expanded', 'false');
  otherContainer.classList.add('hidden');
  toggle.querySelector('.toggle-chevron').style.transform = '';

  renderSuggestedTool();
  renderNextTools();
  renderProgressPanel();
}

function selectTool(toolId) {
  state.currentTool = toolId;
  if (!state.toolsUsed.includes(toolId)) {
    state.toolsUsed.push(toolId);
  }
  renderTool(toolId);
  showScreen('screen-tool');
}

function renderNextTools() {
  const panel = $('next-tools-panel');
  if (!panel) return;

  if (!state.stressLevel) {
    panel.classList.add('hidden');
    return;
  }

  const suggestion = getCurrentSuggestion();
  const allSorted = getRecommendedTools();
  const next = allSorted.filter(t => t.id !== suggestion?.id).slice(0, 3);

  if (next.length === 0) {
    panel.classList.add('hidden');
    return;
  }

  panel.classList.remove('hidden');
  panel.innerHTML = `
    <hr class="next-tools-divider">
    <p class="next-tools-heading">Also recommended</p>
    <div class="next-tools-list">
      ${next.map(t => {
        const badgesHTML = t.categoryLabels.map(label => {
          const cls = label.toLowerCase().replace(/[^a-z]/g, '');
          return `<span class="badge badge--${cls}" style="font-size:10px;padding:2px 7px">${label}</span>`;
        }).join('');
        return `
          <button class="next-tool-card" data-tool-id="${t.id}" aria-label="Start ${t.name}">
            <div class="next-tool-info">
              <span class="next-tool-name">${t.name}</span>
              <div class="next-tool-badges">${badgesHTML}</div>
            </div>
            <span class="next-tool-time">${t.time}</span>
            <span class="next-tool-arrow">→</span>
          </button>`;
      }).join('')}
    </div>
  `;

  panel.querySelectorAll('.next-tool-card').forEach(card => {
    card.addEventListener('click', () => selectTool(card.dataset.toolId));
  });
}

// ============================================================
// SCREEN 4: TOOL EXPERIENCE
// ============================================================

function renderTool(toolId) {
  const container = $('tool-container');
  container.innerHTML = '';

  const renderers = {
    'box-breathing':      renderBoxBreathing,
    'full-trunk-breathing': renderFullTrunkBreathing,
    'growth-mindset':     renderGrowthMindset,
    'habit-loop':         renderHabitLoop,
    'gratitude':          renderGratitude,
    'name-the-lie':       renderNameTheLie,
    'resourcing':         renderResourcing,
    'mantra':             renderMantra,
    'prayer':             renderPrayer,
    'values':             renderValues,
    'sleep':              renderSleep,
    'movement':           renderMovement,
    'journaling':         renderJournaling,
    'grounding':          renderGrounding,
    'nutrition':          renderNutrition,
    'mindfulness':        renderMindfulness
  };

  const renderer = renderers[toolId];
  if (renderer) renderer(container);
}

// ============================================================
// TOOL 1: BOX BREATHING
// ============================================================

function renderBoxBreathing(container) {
  let extendedExhale = false;
  let totalRounds = 4;
  let roundsCompleted = 0;
  let phaseIndex = 0;
  let count = 4;
  let sessionRunning = true;
  let currentPhases = buildPhases(false);

  function buildPhases(extended) {
    return [
      { name: 'Breathe In',  duration: 4, cssClass: 'phase-inhale' },
      { name: 'Hold',        duration: 4, cssClass: 'phase-hold-top' },
      { name: 'Breathe Out', duration: extended ? 6 : 4, cssClass: extended ? 'phase-exhale-long' : 'phase-exhale' },
      { name: 'Hold',        duration: 4, cssClass: 'phase-hold-bottom' }
    ];
  }

  container.innerHTML = `
    <div class="tool-header">
      <h2 class="tool-title">Box Breathing</h2>
      <p class="tool-subtitle">4-count breathing — activates your calm response</p>
    </div>

    <div class="breath-stage">
      <p class="breath-round-label" id="round-label">Round 1 of 4</p>
      <div class="breath-wrapper">
        <div class="breath-glow"></div>
        <div class="breath-circle phase-hold-bottom" id="breath-circle">
          <span class="breath-count" id="breath-count">4</span>
          <span class="breath-phase-label" id="phase-label">Ready</span>
        </div>
      </div>
    </div>

    <div id="breath-complete" class="breath-complete hidden">
      <p class="breath-complete-msg">You completed ${totalRounds} rounds. Well done.</p>
      <button class="btn--keep-going" id="btn-keep-going">Keep Going</button>
    </div>

    <label class="breath-mode-toggle" id="mode-toggle-label" style="margin-top:24px">
      <div class="toggle-switch" id="exhale-toggle"></div>
      <span class="toggle-label"><strong>Extended Exhale Mode</strong> — shifts to a 6-count exhale for a deeper calm effect</span>
    </label>

    <div class="breath-coaching">
      Try to breathe into your whole trunk — chest AND belly. Place one hand on your chest and one on your stomach to feel both expand.
    </div>
  `;

  const circle    = $('breath-circle');
  const countEl   = $('breath-count');
  const phaseEl   = $('phase-label');
  const roundEl   = $('round-label');
  const completeEl = $('breath-complete');
  const toggleEl  = $('exhale-toggle');

  function updateCircle() {
    const phase = currentPhases[phaseIndex];
    circle.className = 'breath-circle ' + phase.cssClass;
    phaseEl.textContent = phase.name;
    countEl.textContent = count;
  }

  function nextPhase() {
    phaseIndex = (phaseIndex + 1) % currentPhases.length;
    if (phaseIndex === 0) {
      roundsCompleted++;
      if (roundsCompleted >= totalRounds) {
        endSession();
        return;
      }
      roundEl.textContent = `Round ${roundsCompleted + 1} of ${totalRounds}`;
    }
    count = currentPhases[phaseIndex].duration;
    updateCircle();
    VoiceGuide.speak(currentPhases[phaseIndex].name);
  }

  function endSession() {
    sessionRunning = false;
    clearTimers();
    VoiceGuide.speak('Well done.');
    circle.className = 'breath-circle phase-hold-top';
    phaseEl.textContent = '';
    countEl.textContent = '✓';
    completeEl.classList.remove('hidden');
    completeEl.querySelector('.breath-complete-msg').textContent =
      `You completed ${totalRounds} round${totalRounds > 1 ? 's' : ''}. Well done.`;
  }

  // Start after a brief delay
  setTimeout(() => {
    phaseIndex = 0;
    count = currentPhases[0].duration;
    roundEl.textContent = `Round 1 of ${totalRounds}`;
    updateCircle();
    VoiceGuide.speak(currentPhases[0].name);

    const tickId = setInterval(() => {
      if (!sessionRunning) return;
      count--;
      if (count <= 0) {
        nextPhase();
      } else {
        countEl.textContent = count;
      }
    }, 1000);
    addTimer(tickId);
  }, 800);

  // Extended exhale toggle
  document.getElementById('mode-toggle-label').addEventListener('click', () => {
    extendedExhale = !extendedExhale;
    toggleEl.classList.toggle('toggle-switch--on', extendedExhale);
    currentPhases = buildPhases(extendedExhale);
  });

  // Keep going
  $('btn-keep-going').addEventListener('click', () => {
    totalRounds += 4;
    roundsCompleted = roundsCompleted; // reset handled below
    sessionRunning = true;
    phaseIndex = 0;
    count = currentPhases[0].duration;
    roundEl.textContent = `Round ${roundsCompleted + 1} of ${totalRounds}`;
    completeEl.classList.add('hidden');
    updateCircle();
    VoiceGuide.speak(currentPhases[0].name);

    const tickId = setInterval(() => {
      if (!sessionRunning) return;
      count--;
      if (count <= 0) {
        nextPhase();
      } else {
        countEl.textContent = count;
      }
    }, 1000);
    addTimer(tickId);
  });
}

// ============================================================
// TOOL 2: FULL TRUNK DEEP BREATHING
// ============================================================

function renderFullTrunkBreathing(container) {
  let exhaleLen = 4;
  let cycleCount = 0;
  const totalCycles = 4;

  const steps = [
    'Find a comfortable position — lying down is ideal, but sitting works too.',
    'Place one hand on your chest and one on your belly.',
    'When you breathe in, feel BOTH your chest and your belly expand. Your back should expand too.',
    null, // timed: inhale 4
    null, // timed: hold 4
    null, // timed: exhale 4 or 6
    null  // timed: hold 4
  ];

  let stepIndex = 0;
  let inTimedPhase = false;
  let timedPhaseIndex = 0;

  const timedPhases = () => [
    { label: 'Breathe In',  duration: 4,        cssClass: 'phase-inhale' },
    { label: 'Hold',        duration: 4,        cssClass: 'phase-hold-top' },
    { label: 'Breathe Out', duration: exhaleLen, cssClass: exhaleLen === 6 ? 'phase-exhale-long' : 'phase-exhale' },
    { label: 'Hold Empty',  duration: 4,        cssClass: 'phase-hold-bottom' }
  ];

  container.innerHTML = `
    <div class="tool-header">
      <h2 class="tool-title">Full Trunk Deep Breathing</h2>
      <p class="tool-subtitle">Body-awareness breathing — chest, belly, and back</p>
    </div>

    <div id="ftb-text-step" style="margin-bottom:24px">
      <div class="step-card">
        <p class="step-number">Step 1</p>
        <p class="step-text" id="ftb-step-text">Find a comfortable position — lying down is ideal, but sitting works too.</p>
      </div>
    </div>

    <div id="ftb-timed-stage" class="breath-stage hidden">
      <p class="breath-round-label" id="ftb-cycle-label">Cycle 1 of 4</p>
      <div class="breath-wrapper">
        <div class="breath-glow"></div>
        <div class="breath-circle phase-hold-bottom" id="ftb-circle">
          <span class="breath-count" id="ftb-count">4</span>
          <span class="breath-phase-label" id="ftb-phase">Ready</span>
        </div>
      </div>
      <p class="text-muted" style="font-size:13px;text-align:center;margin-top:8px">Tap "Next" to advance between cycles</p>
    </div>

    <div class="step-advance-area">
      <label class="breath-mode-toggle" id="ftb-exhale-toggle" style="margin-bottom:16px;display:none">
        <div class="toggle-switch" id="ftb-toggle-switch"></div>
        <span class="toggle-label">6-count exhale (longer, deeper)</span>
      </label>
      <button class="btn--advance" id="ftb-next-btn">Next →</button>
      <p class="step-tap-hint" id="ftb-hint">Read the instruction, then tap Next when ready.</p>
    </div>

    <div id="ftb-complete" class="affirmation-card hidden">
      <p class="affirmation-text">Four full cycles complete. Your body is calmer than it was a few minutes ago.</p>
    </div>
  `;

  const stepTextEl   = $('ftb-step-text');
  const textStageEl  = $('ftb-text-step');
  const timedStageEl = $('ftb-timed-stage');
  const circleEl     = $('ftb-circle');
  const countEl      = $('ftb-count');
  const phaseLabelEl = $('ftb-phase');
  const cycleEl      = $('ftb-cycle-label');
  const nextBtn      = $('ftb-next-btn');
  const hintEl       = $('ftb-hint');
  const exhausteLabel = $('ftb-exhale-toggle');
  const exhausteSw   = $('ftb-toggle-switch');
  const completeEl   = $('ftb-complete');

  const textSteps = [
    'Find a comfortable position — lying down is ideal, but sitting works too.',
    'Place one hand on your chest and one on your belly.',
    'When you breathe in, feel BOTH your chest and your belly expand. Your back should expand too.'
  ];
  let textStepIdx = 0;

  function showTextStep(idx) {
    stepTextEl.textContent = textSteps[idx];
    textStageEl.querySelector('.step-number').textContent = `Step ${idx + 1}`;
    VoiceGuide.speak(textSteps[idx]);
  }

  function startTimedCycle() {
    timedStageEl.classList.remove('hidden');
    textStageEl.classList.add('hidden');
    exhausteLabel.style.display = 'flex';
    nextBtn.textContent = 'Start Next Cycle →';
    hintEl.textContent = `Cycle ${cycleCount + 1} of ${totalCycles}`;
    cycleEl.textContent = `Cycle ${cycleCount + 1} of ${totalCycles}`;
    runTimedCycle();
  }

  function runTimedCycle() {
    const phases = timedPhases();
    let pi = 0;
    let c = phases[0].duration;
    nextBtn.disabled = true;

    circleEl.className = 'breath-circle ' + phases[0].cssClass;
    phaseLabelEl.textContent = phases[0].label;
    countEl.textContent = c;
    VoiceGuide.speak(phases[0].label);

    const id = setInterval(() => {
      c--;
      if (c <= 0) {
        pi = (pi + 1) % phases.length;
        if (pi === 0) {
          clearInterval(id);
          cycleCount++;
          if (cycleCount >= totalCycles) {
            circleEl.className = 'breath-circle phase-hold-top';
            countEl.textContent = '✓';
            phaseLabelEl.textContent = '';
            cycleEl.textContent = 'Complete';
            nextBtn.classList.add('hidden');
            completeEl.classList.remove('hidden');
            VoiceGuide.speak('Four cycles complete. Well done.');
          } else {
            cycleEl.textContent = `Cycle ${cycleCount + 1} of ${totalCycles}`;
            hintEl.textContent = `Cycle ${cycleCount + 1} of ${totalCycles}`;
            nextBtn.disabled = false;
            nextBtn.textContent = `Start Cycle ${cycleCount + 1} →`;
          }
          return;
        }
        c = phases[pi].duration;
        circleEl.className = 'breath-circle ' + phases[pi].cssClass;
        phaseLabelEl.textContent = phases[pi].label;
        countEl.textContent = c;
        VoiceGuide.speak(phases[pi].label);
      } else {
        countEl.textContent = c;
      }
    }, 1000);
    addTimer(id);
  }

  nextBtn.addEventListener('click', () => {
    if (textStepIdx < textSteps.length - 1) {
      textStepIdx++;
      showTextStep(textStepIdx);
    } else if (textStepIdx === textSteps.length - 1 && cycleCount === 0) {
      startTimedCycle();
    } else if (!nextBtn.disabled) {
      runTimedCycle();
    }
  });

  exhausteLabel.addEventListener('click', () => {
    exhaleLen = exhaleLen === 4 ? 6 : 4;
    exhausteSw.classList.toggle('toggle-switch--on', exhaleLen === 6);
  });
}

// ============================================================
// TOOL 3: GROWTH MINDSET REFRAME
// ============================================================

function renderGrowthMindset(container) {
  const prompts = [
    { q: 'What is the thought that is overwhelming you right now?', hint: '(You don\'t have to type it — just hold it in mind.)' },
    { q: 'Is this a permanent fact, or is it a temporary situation?' },
    { q: 'What is one thing within this situation that you DO have control over?' },
    { q: 'What could this experience be teaching you, even if it is painful?' },
    { q: 'Write down or hold in mind one small action you can take today that is within your control.' }
  ];

  let step = 0;
  const responses = [];

  function render() {
    const isLast = step === prompts.length;
    const hasContent = responses.some(r => r.trim());
    container.innerHTML = `
      <div class="tool-header">
        <h2 class="tool-title">Growth Mindset Reframe</h2>
        <p class="tool-subtitle">Fixed thought → growth question</p>
      </div>
      ${!isLast ? `
        <div class="step-card" style="margin-bottom:20px">
          <p class="step-number">Question ${step + 1} of ${prompts.length}</p>
          <p class="step-prompt">${prompts[step].q}</p>
          ${prompts[step].hint ? `<p class="step-subtext">${prompts[step].hint}</p>` : ''}
        </div>
        <textarea class="tool-input" placeholder="Your thoughts (optional — nothing is saved or transmitted)" rows="4"></textarea>
        <button class="btn--advance mt-md" id="gm-next">
          ${step < prompts.length - 1 ? 'Next →' : 'Finish'}
        </button>
      ` : `
        <div class="affirmation-card">
          <p class="affirmation-text">You are not stuck. You are in a moment that will pass. Growth happens in hard seasons.</p>
          ${hasContent ? renderDownloadBlock('gm-download') : ''}
        </div>
      `}
    `;
    if (!isLast) {
      VoiceGuide.speak(prompts[step].q);
      $('gm-next').addEventListener('click', () => {
        const ta = container.querySelector('textarea');
        responses.push(ta ? ta.value : '');
        step++;
        render();
      });
    }
    const dlBtn = $('gm-download');
    if (dlBtn) {
      dlBtn.addEventListener('click', () => {
        downloadText('calm-down-growth-mindset.txt', buildResponseText(
          'Growth Mindset Reframe',
          prompts.map((p, i) => ({ label: `Question ${i + 1} of ${prompts.length}`, question: p.q, response: responses[i] || '' }))
        ));
      });
    }
  }
  render();
}

// ============================================================
// TOOL 4: HABIT LOOP AUDIT
// ============================================================

function renderHabitLoop(container) {
  const steps = [
    { label: 'Your Trigger', q: 'What is your trigger right now?', hint: 'A feeling, a time of day, a place, a person?' },
    { label: 'Your Behavior', q: 'What behavior do you default to when that trigger hits?' },
    { label: 'The Result', q: 'What is the short-term result? What is the long-term result?' },
    { label: 'Replacement', q: 'What is a healthier behavior you could try instead the next time this trigger appears?' }
  ];

  let step = 0;
  const responses = [];

  function render() {
    const isLast = step === steps.length;
    const hasContent = responses.some(r => r.trim());
    container.innerHTML = `
      <div class="tool-header">
        <h2 class="tool-title">Habit Loop Audit</h2>
        ${step === 0 ? `
          <div class="step-card" style="margin-bottom:20px">
            <p class="step-text">A habit loop has three parts: a <strong>Trigger</strong> (what sets it off), a <strong>Behavior</strong> (what you do), and a <strong>Result</strong> (what you feel after).</p>
          </div>
        ` : ''}
      </div>
      ${!isLast ? `
        <div class="step-card" style="margin-bottom:16px">
          <p class="step-number">${steps[step].label}</p>
          <p class="step-prompt" style="font-size:20px">${steps[step].q}</p>
          ${steps[step].hint ? `<p class="step-subtext">${steps[step].hint}</p>` : ''}
        </div>
        <textarea class="tool-input" placeholder="Write it out (nothing is saved or transmitted)" rows="4"></textarea>
        <button class="btn--advance mt-md" id="hl-next">
          ${step < steps.length - 1 ? 'Next →' : 'Finish'}
        </button>
      ` : `
        <div class="affirmation-card">
          <p class="affirmation-text">You don't have to fix the whole loop today. Just noticing it is the first step.</p>
          ${hasContent ? renderDownloadBlock('hl-download') : ''}
        </div>
      `}
    `;
    if (!isLast) {
      VoiceGuide.speak(steps[step].q);
      $('hl-next').addEventListener('click', () => {
        const ta = container.querySelector('textarea');
        responses.push(ta ? ta.value : '');
        step++;
        render();
      });
    }
    const dlBtn = $('hl-download');
    if (dlBtn) {
      dlBtn.addEventListener('click', () => {
        downloadText('calm-down-habit-loop.txt', buildResponseText(
          'Habit Loop Audit',
          steps.map((s, i) => ({ label: s.label, question: s.q, response: responses[i] || '' }))
        ));
      });
    }
  }
  render();
}

// ============================================================
// TOOL 5: GRATITUDE / FOCUS ON THE GOOD
// ============================================================

function renderGratitude(container) {
  const questions = [
    'What is one thing that happened today that was not terrible — even if it was small?',
    'Who is one person in your life who is on your side?',
    'What is one thing about yourself you are not giving yourself credit for right now?'
  ];

  let step = 0;
  const responses = [];

  function render() {
    const isLast = step === questions.length;
    const hasContent = responses.some(r => r.trim());
    container.innerHTML = `
      <div class="tool-header">
        <h2 class="tool-title">Focus on the Good</h2>
        ${step === 0 ? `<p class="step-framing">This is not about denying that things are hard. It is about reminding your brain that hard is not the whole picture.</p>` : ''}
      </div>
      ${!isLast ? `
        <div class="step-card" style="margin-bottom:16px">
          <p class="step-number">Question ${step + 1} of ${questions.length}</p>
          <p class="step-prompt">${questions[step]}</p>
        </div>
        <textarea class="tool-input" placeholder="Take your time (nothing is saved or transmitted)" rows="4"></textarea>
        <button class="btn--advance mt-md" id="gr-next">
          ${step < questions.length - 1 ? 'Next →' : 'Finish'}
        </button>
      ` : `
        <div class="affirmation-card">
          <p class="affirmation-text">Your brain needed that. Come back here any time.</p>
          ${hasContent ? renderDownloadBlock('gr-download') : ''}
        </div>
      `}
    `;
    if (!isLast) {
      VoiceGuide.speak(questions[step]);
      $('gr-next').addEventListener('click', () => {
        const ta = container.querySelector('textarea');
        responses.push(ta ? ta.value : '');
        step++;
        render();
      });
    }
    const dlBtn = $('gr-download');
    if (dlBtn) {
      dlBtn.addEventListener('click', () => {
        downloadText('calm-down-gratitude.txt', buildResponseText(
          'Focus on the Good',
          questions.map((q, i) => ({ label: `Question ${i + 1} of ${questions.length}`, question: q, response: responses[i] || '' }))
        ));
      });
    }
  }
  render();
}

// ============================================================
// TOOL 6: NAME THE LIE, SAY THE TRUTH
// ============================================================

function renderNameTheLie(container) {
  let step = 0;
  let pauseCount = 30;
  let pauseRunning = false;
  const responses = { step0: '', step2: '', step3: '' };

  function render() {
    if (step === 0) {
      container.innerHTML = `
        <div class="tool-header">
          <h2 class="tool-title">Name the Lie, Say the Truth</h2>
          <p class="step-framing" style="margin-top:12px">Right now you are probably telling yourself things that are not true. Let's look at one of them.</p>
        </div>
        <div class="step-card" style="margin-bottom:16px">
          <p class="step-number">Step 1 of 4</p>
          <p class="step-prompt" style="font-size:20px">What is the harshest thing you are currently saying to yourself?</p>
        </div>
        <textarea class="tool-input" placeholder="Write it down. You don't have to share it with anyone. Nothing is saved or transmitted." rows="4" id="ntl-input-1"></textarea>
        <button class="btn--advance mt-md" id="ntl-next">Next →</button>
      `;
      VoiceGuide.speak('What is the harshest thing you are currently saying to yourself?');
      $('ntl-next').addEventListener('click', () => {
        responses.step0 = $('ntl-input-1')?.value || '';
        step++;
        render();
      });

    } else if (step === 1) {
      container.innerHTML = `
        <div class="tool-header">
          <h2 class="tool-title">Name the Lie, Say the Truth</h2>
        </div>
        <div class="step-card" style="margin-bottom:16px">
          <p class="step-number">Step 2 of 4</p>
          <p class="step-prompt" style="font-size:20px">Wait a moment. Breathe.</p>
          <p class="step-subtext">Now ask: Is this statement 100% true, or is it a story I am telling myself?</p>
        </div>
        <div class="breath-stage" style="padding:16px 0">
          <div class="breath-wrapper" style="width:140px;height:140px">
            <div class="breath-glow"></div>
            <div class="breath-circle phase-inhale" id="ntl-pause-circle" style="width:110px;height:110px">
              <span class="breath-count" id="ntl-pause-count">${pauseCount}</span>
            </div>
          </div>
        </div>
        <button class="btn--advance" id="ntl-skip-pause">Skip →</button>
      `;

      const circleEl = $('ntl-pause-circle');
      const countEl  = $('ntl-pause-count');
      pauseRunning = true;
      let c = pauseCount;

      const phases = [
        { cssClass: 'phase-inhale',      duration: 4 },
        { cssClass: 'phase-hold-top',    duration: 4 },
        { cssClass: 'phase-exhale',      duration: 4 },
        { cssClass: 'phase-hold-bottom', duration: 4 }
      ];
      let pi = 0, pc = phases[0].duration;
      circleEl.className = 'breath-circle ' + phases[0].cssClass;

      const id = setInterval(() => {
        if (!pauseRunning) return;
        c--;
        pc--;
        countEl.textContent = c;
        if (pc <= 0) {
          pi = (pi + 1) % phases.length;
          pc = phases[pi].duration;
          circleEl.className = 'breath-circle ' + phases[pi].cssClass;
        }
        if (c <= 0) {
          clearInterval(id);
          step++;
          render();
        }
      }, 1000);
      addTimer(id);

      $('ntl-skip-pause').addEventListener('click', () => {
        pauseRunning = false;
        clearTimers();
        step++;
        render();
      });

    } else if (step === 2) {
      container.innerHTML = `
        <div class="tool-header">
          <h2 class="tool-title">Name the Lie, Say the Truth</h2>
        </div>
        <div class="step-card" style="margin-bottom:16px">
          <p class="step-number">Step 3 of 4</p>
          <p class="step-prompt" style="font-size:20px">What would you say to your best friend if they said this to you?</p>
        </div>
        <textarea class="tool-input" placeholder="Write what you'd say to someone you love. Nothing is saved or transmitted." rows="4"></textarea>
        <button class="btn--advance mt-md" id="ntl-next-3">Next →</button>
      `;
      VoiceGuide.speak('What would you say to your best friend if they said this to you?');
      $('ntl-next-3').addEventListener('click', () => {
        responses.step2 = container.querySelector('textarea')?.value || '';
        step++;
        render();
      });

    } else if (step === 3) {
      container.innerHTML = `
        <div class="tool-header">
          <h2 class="tool-title">Name the Lie, Say the Truth</h2>
        </div>
        <div class="step-card" style="margin-bottom:16px">
          <p class="step-number">Step 4 of 4</p>
          <p class="step-prompt" style="font-size:20px">Now write the truth.</p>
          <p class="step-subtext">Not a fake positive spin — the actual truth about yourself and this situation.</p>
        </div>
        <textarea class="tool-input" placeholder="The actual truth..." rows="5" id="ntl-truth"></textarea>
        <button class="btn--advance mt-md" id="ntl-finish">Finish</button>
      `;
      VoiceGuide.speak('Now write the truth. Not a fake positive spin — the actual truth about yourself and this situation.');
      $('ntl-finish').addEventListener('click', () => {
        responses.step3 = $('ntl-truth')?.value || '';
        step++;
        render();
      });

    } else {
      const hasContent = Object.values(responses).some(r => r.trim());
      container.innerHTML = `
        <div class="tool-header">
          <h2 class="tool-title">Name the Lie, Say the Truth</h2>
        </div>
        <div class="affirmation-card">
          <p class="affirmation-text">That truth is the thing worth listening to.</p>
          ${hasContent ? renderDownloadBlock('ntl-download') : ''}
        </div>
      `;
      const dlBtn = $('ntl-download');
      if (dlBtn) {
        dlBtn.addEventListener('click', () => {
          downloadText('calm-down-name-the-lie.txt', buildResponseText('Name the Lie, Say the Truth', [
            { label: 'Step 1 of 4', question: 'What is the harshest thing you are currently saying to yourself?', response: responses.step0 },
            { label: 'Step 3 of 4', question: 'What would you say to your best friend if they said this to you?', response: responses.step2 },
            { label: 'Step 4 of 4', question: 'Now write the truth.', response: responses.step3 }
          ]));
        });
      }
    }
  }
  render();
}

// ============================================================
// TOOL 7: RESOURCING / SAFE PLACE VISUALIZATION
// ============================================================

function renderResourcing(container) {
  const stepTexts = [
    'Think of a place — real or imagined — where you feel completely safe and at peace.',
    'What does it look like? Notice the colors, the light.',
    'What sounds are there? Or is it quiet?',
    'Feel the temperature. Feel the surface beneath you.',
    'You are here. Nothing can reach you in this place. Stay as long as you need.',
    null // 60-second hold
  ];

  let step = 0;

  function render() {
    if (step < stepTexts.length - 1) {
      container.innerHTML = `
        <div class="tool-header">
          <h2 class="tool-title">Safe Place Visualization</h2>
          ${step === 0 ? `<p class="step-framing" style="margin-top:8px">Close your eyes after reading each step. Take your time.</p>` : ''}
        </div>
        <div class="resourcing-step">
          <div class="resourcing-pulse"></div>
          <p class="resourcing-step-text">${stepTexts[step]}</p>
          <button class="btn--advance" id="res-next">
            ${step < stepTexts.length - 2 ? 'Continue →' : 'Enter your safe place →'}
          </button>
        </div>
      `;
      VoiceGuide.speak(stepTexts[step]);
      $('res-next').addEventListener('click', () => { step++; render(); });

    } else {
      // 60-second hold
      let holdCount = 60;
      container.innerHTML = `
        <div class="tool-header">
          <h2 class="tool-title">Safe Place Visualization</h2>
        </div>
        <div class="prayer-hold-screen">
          <div class="resourcing-pulse" style="width:140px;height:140px;margin-bottom:32px"></div>
          <div class="hold-timer" id="res-hold-count">${holdCount}</div>
          <p class="hold-label">You are safe. Stay here.</p>
        </div>
      `;

      const holdEl = $('res-hold-count');
      const id = setInterval(() => {
        holdCount--;
        holdEl.textContent = holdCount;
        if (holdCount <= 0) {
          clearInterval(id);
          container.innerHTML += `
            <div class="affirmation-card" style="margin-top:0;text-align:center">
              <p class="affirmation-text">When you are ready, take a slow breath and come back.</p>
            </div>
          `;
        }
      }, 1000);
      addTimer(id);
    }
  }
  render();
}

// ============================================================
// TOOL 8: POSITIVE MANTRA / SCRIPTURE AFFIRMATION
// ============================================================

function renderMantra(container) {
  let selectedMantra = '';
  let sessionRunning = false;
  let sessionTime = 120;

  container.innerHTML = `
    <div class="tool-header">
      <h2 class="tool-title">Positive Mantra</h2>
      <p class="tool-subtitle">Select a phrase or write your own</p>
    </div>

    <div id="mantra-select-stage">
      <p class="mantra-section-label">Faith-Based</p>
      <div class="mantra-library" id="mantra-faith">
        ${AFFIRMATIONS.faithBased.map((a, i) =>
          `<button class="mantra-item" data-mantra="${encodeURIComponent(a)}" data-idx="f${i}">${a}</button>`
        ).join('')}
      </div>

      <p class="mantra-section-label" style="margin-top:16px">Universal</p>
      <div class="mantra-library" id="mantra-universal">
        ${AFFIRMATIONS.universal.map((a, i) =>
          `<button class="mantra-item" data-mantra="${encodeURIComponent(a)}" data-idx="u${i}">${a}</button>`
        ).join('')}
      </div>

      <p class="mantra-section-label" style="margin-top:16px">Your own phrase</p>
      <textarea class="tool-input" placeholder="Write your own phrase..." rows="2" id="mantra-custom"></textarea>
      <button class="btn--advance mt-md" id="mantra-use-custom">Use This Phrase →</button>
    </div>

    <div id="mantra-session-stage" class="hidden">
      <div class="mantra-display">
        <p class="mantra-display-text" id="mantra-active-text"></p>
      </div>
      <p class="mantra-timer-display" id="mantra-timer">2:00 remaining</p>
      <p class="step-framing" style="text-align:center;margin-top:8px">Read it slowly. Read it again. Breathe between each reading.</p>
    </div>
  `;

  function startMantraSession(phrase) {
    selectedMantra = phrase;
    $('mantra-select-stage').classList.add('hidden');
    const sessionEl = $('mantra-session-stage');
    sessionEl.classList.remove('hidden');
    $('mantra-active-text').textContent = phrase;

    let remaining = sessionTime;
    $('mantra-timer').textContent = formatSeconds(remaining) + ' remaining';

    const id = setInterval(() => {
      remaining--;
      $('mantra-timer').textContent = remaining > 0
        ? formatSeconds(remaining) + ' remaining'
        : 'Session complete.';
      if (remaining <= 0) clearInterval(id);
    }, 1000);
    addTimer(id);
  }

  // Mantra item clicks
  container.querySelectorAll('.mantra-item').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.mantra-item').forEach(b => b.classList.remove('mantra-item--selected'));
      btn.classList.add('mantra-item--selected');
      const phrase = decodeURIComponent(btn.dataset.mantra);
      setTimeout(() => startMantraSession(phrase), 400);
    });
  });

  // Custom phrase
  $('mantra-use-custom').addEventListener('click', () => {
    const custom = $('mantra-custom').value.trim();
    if (custom.length > 0) startMantraSession(custom);
  });
}

// ============================================================
// TOOL 9: PRAYER PROMPT
// ============================================================

function renderPrayer(container) {
  let step = 0;

  function render() {
    if (step === 0) {
      container.innerHTML = `
        <div class="tool-header">
          <h2 class="tool-title">Prayer Prompt</h2>
          <p class="step-framing" style="margin-top:8px">Prayer does not have to be long or eloquent. Honest and heartfelt is enough.</p>
        </div>
        <div class="prayer-starters">
          <div class="prayer-starter">"God, be with me right now."</div>
          <div class="prayer-starter">"God, if you are real, make yourself real to me."</div>
          <div class="prayer-starter">"Jesus, I need you. Help me get through this moment."</div>
        </div>
        <div class="step-card" style="margin-top:16px;margin-bottom:16px">
          <p class="step-text">Or just talk to God in your own words. You do not have to have it figured out.</p>
        </div>
        <button class="btn--advance" id="prayer-enter-quiet">Enter quiet space →</button>
      `;
      $('prayer-enter-quiet').addEventListener('click', () => { step++; render(); });

    } else if (step === 1) {
      let holdTime = 75;
      container.innerHTML = `
        <div class="tool-header">
          <h2 class="tool-title">Prayer Prompt</h2>
        </div>
        <div class="prayer-hold-screen">
          <div class="resourcing-pulse" style="width:120px;height:120px;margin:0 auto 32px"></div>
          <div class="hold-timer" id="prayer-hold">${holdTime}</div>
          <p class="hold-label">He meets you exactly where you are.</p>
        </div>
      `;

      const holdEl = $('prayer-hold');
      const id = setInterval(() => {
        holdTime--;
        holdEl.textContent = holdTime;
        if (holdTime <= 0) {
          clearInterval(id);
          container.innerHTML += `
            <div class="affirmation-card" style="margin:16px 0 0">
              <p class="affirmation-text">He meets you exactly where you are.</p>
            </div>
          `;
        }
      }, 1000);
      addTimer(id);
    }
  }
  render();
}

// ============================================================
// TOOL 10: VALUES ALIGNMENT CHECK
// ============================================================

function renderValues(container) {
  const prompts = [
    { label: 'What Matters Most', q: 'What are the three things in life you care about most?', hint: 'Examples: my kids, my faith, my health, being a good person' },
    { label: 'Weekly Alignment', q: 'Looking at the past week — how aligned were your actions with those three things?' },
    { label: 'What\'s Off Course', q: 'Is there one thing you are doing right now that is working against what you care about?' },
    { label: 'One Small Move', q: 'What is one small thing you could do in the next 24 hours that would move you closer to what you care about?' }
  ];

  let step = 0;
  const responses = [];

  function render() {
    const isLast = step === prompts.length;
    const hasContent = responses.some(r => r.trim());
    container.innerHTML = `
      <div class="tool-header">
        <h2 class="tool-title">Values Alignment Check</h2>
      </div>
      ${!isLast ? `
        <div class="step-card" style="margin-bottom:16px">
          <p class="step-number">${prompts[step].label}</p>
          <p class="step-prompt" style="font-size:20px">${prompts[step].q}</p>
          ${prompts[step].hint ? `<p class="step-subtext">${prompts[step].hint}</p>` : ''}
        </div>
        <textarea class="tool-input" placeholder="Take your time (nothing is saved or transmitted)" rows="4"></textarea>
        <button class="btn--advance mt-md" id="val-next">
          ${step < prompts.length - 1 ? 'Next →' : 'Finish'}
        </button>
      ` : `
        <div class="affirmation-card">
          <p class="affirmation-text">Clarity about what matters is itself a form of calm. You know who you want to be.</p>
          ${hasContent ? renderDownloadBlock('val-download') : ''}
        </div>
      `}
    `;
    if (!isLast) {
      VoiceGuide.speak(prompts[step].q);
      $('val-next').addEventListener('click', () => {
        const ta = container.querySelector('textarea');
        responses.push(ta ? ta.value : '');
        step++;
        render();
      });
    }
    const dlBtn = $('val-download');
    if (dlBtn) {
      dlBtn.addEventListener('click', () => {
        downloadText('calm-down-values.txt', buildResponseText(
          'Values Alignment Check',
          prompts.map((p, i) => ({ label: p.label, question: p.q, response: responses[i] || '' }))
        ));
      });
    }
  }
  render();
}

// ============================================================
// TOOL 11: SLEEP HYGIENE QUICK GUIDE
// ============================================================

function renderSleep(container) {
  const tips = [
    'Set a consistent bedtime and stick to it.',
    'Start dimming lights 1 hour before bed.',
    'Avoid screens 30–60 minutes before sleep.',
    'Try a calming pre-sleep routine: light reading, gentle stretching, or a warm bath.',
    '7–9 hours is the research-supported target. If you toss and turn, allow extra time in bed.',
    'If racing thoughts keep you up: try box breathing in bed, or listen to something calm and distracting.'
  ];

  container.innerHTML = `
    <div class="tool-header">
      <h2 class="tool-title">Sleep Hygiene Guide</h2>
      <p class="tool-subtitle">Tap each item to check it off</p>
    </div>
    <div class="checklist-items">
      ${tips.map((tip, i) => `
        <button class="checklist-item" data-idx="${i}" aria-pressed="false">
          <span class="checklist-check" id="check-${i}"></span>
          <span class="checklist-text">${tip}</span>
        </button>
      `).join('')}
    </div>
    <div class="sleep-note">
      Sleep is the single biggest lever for your ability to handle stress. Prioritize it even when it feels impossible.
    </div>
  `;

  container.querySelectorAll('.checklist-item').forEach(item => {
    item.addEventListener('click', () => {
      const isChecked = item.classList.toggle('checklist-item--checked');
      item.setAttribute('aria-pressed', isChecked ? 'true' : 'false');
      item.querySelector('.checklist-check').textContent = isChecked ? '✓' : '';
    });
  });
}

// ============================================================
// TOOL 12: MOVEMENT PROMPT
// ============================================================

function renderMovement(container) {
  const options = [
    'A 10-minute walk outside (even slow, even around the block)',
    '5 minutes of light stretching',
    'Put on a song and move however feels right',
    'Do 10 slow squats or 10 wall push-ups — just to move'
  ];

  let selected = null;

  function render() {
    if (!selected) {
      container.innerHTML = `
        <div class="tool-header">
          <h2 class="tool-title">Movement Prompt</h2>
          <p class="step-framing" style="margin-top:8px">Your body is holding stress. Movement releases it. You do not need a gym.</p>
        </div>
        <div class="movement-options">
          ${options.map((opt, i) =>
            `<button class="movement-option" data-idx="${i}">${opt}</button>`
          ).join('')}
        </div>
      `;
      container.querySelectorAll('.movement-option').forEach(btn => {
        btn.addEventListener('click', () => {
          selected = options[btn.dataset.idx];
          render();
        });
      });
    } else {
      container.innerHTML = `
        <div class="tool-header">
          <h2 class="tool-title">Movement Prompt</h2>
        </div>
        <div class="movement-return">
          <p style="font-size:15px;color:var(--color-text-secondary);margin-bottom:24px;font-style:italic">"${selected}"</p>
          <p class="movement-return-msg">Go do it now. Come back when you are done.</p>
          <p class="movement-return-sub">This page will be here when you return.</p>
        </div>
        <div class="affirmation-card" style="margin-top:24px">
          <p class="affirmation-text">Nice work. Your cortisol just dropped a little. That mattered.</p>
        </div>
      `;
    }
  }
  render();
}

// ============================================================
// TOOL 13: JOURNALING PROMPT
// ============================================================

function renderJournaling(container) {
  let timerActive = false;
  let timerMinutes = 5;
  let timerRemaining = 0;
  let timerIntervalId = null;

  const secondaryPrompts = [
    'What am I most afraid of right now?',
    'What do I wish someone would say to me?',
    'What is one thing I need to let go of today?'
  ];

  container.innerHTML = `
    <div class="tool-header">
      <h2 class="tool-title">Journaling</h2>
    </div>
    <div class="journal-stage">
      <p class="journal-prompt">Write whatever is in your head. Nobody will see this. It does not have to make sense.</p>
      <textarea class="tool-input tool-input--large" id="journal-text" placeholder="Start anywhere..." aria-label="Journal entry"></textarea>

      <div>
        <p class="step-subtext" style="margin-bottom:8px">Stuck? Try one of these:</p>
        <div class="journal-secondary-prompts">
          ${secondaryPrompts.map(p =>
            `<button class="journal-prompt-btn" data-prompt="${p}">"${p}"</button>`
          ).join('')}
        </div>
      </div>

      <div class="journal-timer-controls">
        <span style="font-size:13px;color:var(--color-text-muted)">Timer:</span>
        <button class="timer-toggle-btn" id="timer-5">5 min</button>
        <button class="timer-toggle-btn" id="timer-10">10 min</button>
        <span class="journal-timer-display" id="journal-timer-display"></span>
      </div>

      <div class="journal-action-row">
        <button class="btn--clear" id="journal-clear">Clear & Discard</button>
        <button class="btn--download-journal" id="journal-download">Download entry</button>
      </div>
      <p class="download-privacy-note" style="margin-top:4px">Your entry is never saved or transmitted — download creates a local file only.</p>
    </div>
  `;

  // Secondary prompt insertion
  container.querySelectorAll('.journal-prompt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const textarea = $('journal-text');
      const prompt = btn.dataset.prompt + '\n\n';
      textarea.value += (textarea.value.length > 0 ? '\n\n' : '') + prompt;
      textarea.focus();
      textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    });
  });

  // Timer buttons
  function startTimer(minutes) {
    if (timerIntervalId) {
      clearInterval(timerIntervalId);
      state.activeTimers = state.activeTimers.filter(id => id !== timerIntervalId);
    }
    timerMinutes = minutes;
    timerRemaining = minutes * 60;
    timerActive = true;

    [$('timer-5'), $('timer-10')].forEach(b => b.classList.remove('timer-toggle-btn--active'));
    $(`timer-${minutes}`).classList.add('timer-toggle-btn--active');

    const display = $('journal-timer-display');
    display.textContent = formatSeconds(timerRemaining);

    timerIntervalId = setInterval(() => {
      timerRemaining--;
      display.textContent = timerRemaining > 0
        ? formatSeconds(timerRemaining)
        : 'Time\'s up!';
      if (timerRemaining <= 0) {
        clearInterval(timerIntervalId);
        timerActive = false;
      }
    }, 1000);
    addTimer(timerIntervalId);
  }

  $('timer-5').addEventListener('click', () => startTimer(5));
  $('timer-10').addEventListener('click', () => startTimer(10));

  // Clear
  $('journal-clear').addEventListener('click', () => {
    if (confirm('Clear your journal entry? This cannot be undone.')) {
      $('journal-text').value = '';
    }
  });

  // Download
  $('journal-download').addEventListener('click', () => {
    const text = $('journal-text').value.trim();
    if (!text) return;
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const content = `Calm Down — Journal Entry\n${date}\n\n${'='.repeat(44)}\n\n${text}\n\n${'='.repeat(44)}\n\nPrivacy note: This file was created on your device.\nNo data was saved, recorded, or transmitted by Calm Down.`;
    downloadText(`calm-down-journal.txt`, content);
  });
}

// ============================================================
// TOOL 14: 5-SENSES GROUNDING
// ============================================================

function renderGrounding(container) {
  const senses = [
    { label: '5 — See',   prompt: 'Look around slowly. Name 5 things you can see right now.', placeholder: 'A lamp, the wall, my hands, a window, a cup...' },
    { label: '4 — Touch', prompt: 'Notice 4 things you can physically feel — texture, weight, temperature.', placeholder: 'The floor under my feet, the chair beneath me...' },
    { label: '3 — Hear',  prompt: 'Listen quietly. What are 3 sounds you can hear right now?', placeholder: 'Traffic outside, my own breathing, the fan...' },
    { label: '2 — Smell', prompt: 'Take a slow breath through your nose. Name 2 things you can smell, even faintly.', placeholder: 'Coffee, fresh air, nothing in particular...' },
    { label: '1 — Taste', prompt: 'What do you taste right now, even the faintest trace?', placeholder: 'Water, toothpaste, nothing at all...' }
  ];

  let step = 0;
  const responses = [];

  function render() {
    const isLast = step === senses.length;
    const hasContent = responses.some(r => r.trim());
    container.innerHTML = `
      <div class="tool-header">
        <h2 class="tool-title">5-Senses Grounding</h2>
        ${step === 0 ? `<p class="step-framing" style="margin-top:8px">You are here. Right now. Let's prove that to your nervous system — one sense at a time.</p>` : ''}
      </div>
      ${!isLast ? `
        <div class="step-card" style="margin-bottom:16px">
          <p class="step-number">${senses[step].label}</p>
          <p class="step-prompt">${senses[step].prompt}</p>
        </div>
        <textarea class="tool-input" placeholder="${senses[step].placeholder}" rows="3"></textarea>
        <button class="btn--advance mt-md" id="gs-next">
          ${step < senses.length - 1 ? 'Next sense →' : 'Finish'}
        </button>
      ` : `
        <div class="affirmation-card">
          <p class="affirmation-text">You just proved to your brain that you are safe right now — in this moment, in this place.</p>
          ${hasContent ? renderDownloadBlock('gs-download') : ''}
        </div>
      `}
    `;
    if (!isLast) {
      VoiceGuide.speak(senses[step].prompt);
      $('gs-next').addEventListener('click', () => {
        const ta = container.querySelector('textarea');
        responses.push(ta ? ta.value : '');
        step++;
        render();
      });
    }
    const dlBtn = $('gs-download');
    if (dlBtn) {
      dlBtn.addEventListener('click', () => {
        downloadText('calm-down-grounding.txt', buildResponseText(
          '5-Senses Grounding',
          senses.map((s, i) => ({ label: s.label, question: s.prompt, response: responses[i] || '' }))
        ));
      });
    }
  }
  render();
}

// ============================================================
// TOOL 15: NUTRITION QUICK GUIDE
// ============================================================

function renderNutrition(container) {
  const tips = [
    'Eat something — even small. Your brain needs glucose to think and process emotions.',
    'Prioritize protein: eggs, chicken, Greek yogurt, legumes. It stabilizes blood sugar and mood.',
    'Choose whole foods over comfort foods. Processed food spikes then crashes your blood sugar, worsening anxiety.',
    'Aim for 3 meals today. Skipping meals raises cortisol and makes everything feel harder.',
    'Limit sugar and refined carbs — they feel comforting in the moment but intensify emotional swings.',
    'Limit or skip alcohol. It disrupts sleep and keeps cortisol elevated — the opposite of calm.',
    'Drink water. Dehydration worsens anxiety, brain fog, and emotional dysregulation.'
  ];

  container.innerHTML = `
    <div class="tool-header">
      <h2 class="tool-title">Nutrition Guide</h2>
      <p class="tool-subtitle">Tap each item to check it off</p>
    </div>
    <div class="checklist-items">
      ${tips.map((tip, i) => `
        <button class="checklist-item" data-idx="${i}" aria-pressed="false">
          <span class="checklist-check" id="ncheck-${i}"></span>
          <span class="checklist-text">${tip}</span>
        </button>
      `).join('')}
    </div>
    <div class="sleep-note">
      When your body is undernourished, it is incredibly difficult to think clearly. Feeding yourself is not a luxury right now — it is a calming intervention.
    </div>
  `;

  container.querySelectorAll('.checklist-item').forEach(item => {
    item.addEventListener('click', () => {
      const isChecked = item.classList.toggle('checklist-item--checked');
      item.setAttribute('aria-pressed', isChecked ? 'true' : 'false');
      item.querySelector('.checklist-check').textContent = isChecked ? '✓' : '';
    });
  });
}

// ============================================================
// TOOL 16: MINDFULNESS CHECK-IN
// ============================================================

function renderMindfulness(container) {
  let step = 0;
  const responses = { emotion: '', body: '' };

  function render() {
    if (step === 0) {
      container.innerHTML = `
        <div class="tool-header">
          <h2 class="tool-title">Mindfulness Check-In</h2>
          <p class="step-framing" style="margin-top:8px">You don't have to fix what you're feeling. Just notice it. That is the whole practice.</p>
        </div>
        <div class="step-card" style="margin-bottom:16px">
          <p class="step-number">Step 1 of 4 — Settle</p>
          <p class="step-prompt">Find a comfortable position. Close your eyes if you'd like.</p>
          <p class="step-subtext">Take three slow, deep breaths before continuing.</p>
        </div>
        <button class="btn--advance" id="mf-next-1">I've taken three breaths →</button>
      `;
      $('mf-next-1').addEventListener('click', () => { step++; render(); });

    } else if (step === 1) {
      container.innerHTML = `
        <div class="tool-header">
          <h2 class="tool-title">Mindfulness Check-In</h2>
        </div>
        <div class="step-card" style="margin-bottom:16px">
          <p class="step-number">Step 2 of 4 — Notice</p>
          <p class="step-prompt">What emotion is present right now?</p>
          <p class="step-subtext">Don't judge it. Don't fix it. Just name it like you're naming weather outside.</p>
        </div>
        <textarea class="tool-input" placeholder="e.g. Dread. Sadness. Rage. Numbness. Anxiety. Relief. Nothing." rows="3"></textarea>
        <button class="btn--advance mt-md" id="mf-next-2">Next →</button>
      `;
      $('mf-next-2').addEventListener('click', () => {
        responses.emotion = container.querySelector('textarea')?.value || '';
        step++;
        render();
      });

    } else if (step === 2) {
      container.innerHTML = `
        <div class="tool-header">
          <h2 class="tool-title">Mindfulness Check-In</h2>
        </div>
        <div class="step-card" style="margin-bottom:16px">
          <p class="step-number">Step 3 of 4 — Get Curious</p>
          <p class="step-prompt">Where do you feel this in your body?</p>
          <p class="step-subtext">A tight chest? Heavy shoulders? Pit in your stomach? Describe the sensation, not the story.</p>
        </div>
        <textarea class="tool-input" placeholder="Describe what you physically feel, not what happened or why." rows="3"></textarea>
        <button class="btn--advance mt-md" id="mf-next-3">Next →</button>
      `;
      $('mf-next-3').addEventListener('click', () => {
        responses.body = container.querySelector('textarea')?.value || '';
        step++;
        render();
      });

    } else if (step === 3) {
      let holdCount = 60;
      container.innerHTML = `
        <div class="tool-header">
          <h2 class="tool-title">Mindfulness Check-In</h2>
        </div>
        <div class="step-card" style="margin-bottom:16px">
          <p class="step-number">Step 4 of 4 — Ride the Wave</p>
          <p class="step-prompt">Just sit with it for 60 seconds. Don't fight it or feed it.</p>
          <p class="step-subtext">Watch the feeling like a wave. Let it rise, peak, and begin to fall on its own.</p>
        </div>
        <div class="prayer-hold-screen">
          <div class="resourcing-pulse" style="width:110px;height:110px;margin:0 auto 24px"></div>
          <div class="hold-timer" id="mf-hold-count">${holdCount}</div>
          <p class="hold-label">Just notice. You don't have to do anything.</p>
        </div>
      `;
      const holdEl = $('mf-hold-count');
      const id = setInterval(() => {
        holdCount--;
        holdEl.textContent = holdCount;
        if (holdCount <= 0) {
          clearInterval(id);
          step++;
          render();
        }
      }, 1000);
      addTimer(id);

    } else {
      const hasContent = responses.emotion.trim() || responses.body.trim();
      container.innerHTML = `
        <div class="tool-header">
          <h2 class="tool-title">Mindfulness Check-In</h2>
        </div>
        <div class="affirmation-card">
          <p class="affirmation-text">You leaned in instead of running. That takes more courage than most people realize.</p>
          ${hasContent ? renderDownloadBlock('mf-download') : ''}
        </div>
      `;
      const dlBtn = $('mf-download');
      if (dlBtn) {
        dlBtn.addEventListener('click', () => {
          downloadText('calm-down-mindfulness.txt', buildResponseText('Mindfulness Check-In', [
            { label: 'Step 2 of 4 — Notice', question: 'What emotion is present right now?', response: responses.emotion },
            { label: 'Step 3 of 4 — Get Curious', question: 'Where do you feel this in your body?', response: responses.body }
          ]));
        });
      }
    }
  }
  render();
}

// ============================================================
// SUGGESTED TOOL BANNER
// ============================================================

function getCurrentSuggestion() {
  const allSorted = getRecommendedTools();
  return allSorted.find(t => !state.toolsUsed.includes(t.id)) || allSorted[0];
}

function renderSuggestedTool() {
  const banner = $('suggested-tool-banner');
  if (!banner) return;

  const allSorted = getRecommendedTools();
  const suggestion = allSorted.find(t => !state.toolsUsed.includes(t.id)) || allSorted[0];

  if (!suggestion) {
    banner.classList.add('hidden');
    return;
  }

  const levelDisplay = state.currentStressLevel || state.stressLevel;
  const badgesHTML = suggestion.categoryLabels.map(label => {
    const cls = label.toLowerCase().replace(/[^a-z]/g, '');
    return `<span class="badge badge--${cls}">${label}</span>`;
  }).join('');

  banner.classList.remove('hidden');
  banner.innerHTML = `
    <span class="suggested-eyebrow">Suggested for your level ${levelDisplay}</span>
    <button class="suggested-card" id="btn-suggested-tool" aria-label="Start ${suggestion.name}">
      <div class="suggested-card-info">
        <span class="suggested-card-name">${suggestion.name}</span>
        <span class="suggested-card-time">${suggestion.time}</span>
      </div>
      <div class="tool-card__badges" style="margin-top:4px">${badgesHTML}</div>
      <span class="suggested-card-arrow">Start →</span>
    </button>
  `;

  $('btn-suggested-tool').addEventListener('click', () => selectTool(suggestion.id));
}

// ============================================================
// SESSION PROGRESS PANEL
// ============================================================

function renderProgressPanel() {
  const panel = $('session-progress-panel');
  if (!panel) return;

  if (state.toolsUsed.length === 0) {
    panel.classList.add('hidden');
    return;
  }

  panel.classList.remove('hidden');

  const start = state.sessionStartLevel;
  const current = state.currentStressLevel;
  const diff = start - current;

  const startEl = $('progress-start-val');
  const currentEl = $('progress-current-val');
  const arrowEl = $('progress-arrow');
  const toolsEl = $('progress-tools-list');

  if (startEl) startEl.textContent = start;
  if (currentEl) currentEl.textContent = current;

  if (arrowEl) {
    if (diff > 0) {
      arrowEl.textContent = '↓';
      arrowEl.className = 'progress-arrow progress-arrow--down';
    } else if (diff < 0) {
      arrowEl.textContent = '↑';
      arrowEl.className = 'progress-arrow progress-arrow--up';
    } else {
      arrowEl.textContent = '→';
      arrowEl.className = 'progress-arrow';
    }
  }

  if (toolsEl) {
    const toolNames = state.toolsUsed
      .map(id => TOOLS.find(t => t.id === id)?.name)
      .filter(Boolean);
    toolsEl.textContent = toolNames.join(' · ');
  }
}

// ============================================================
// MID-SESSION CHECK-IN
// ============================================================

function renderMiniCheckin() {
  const container = $('checkin-mini-scale');
  if (!container) return;
  container.innerHTML = '';

  const msgEl = $('checkin-progress-msg');
  if (msgEl) {
    msgEl.textContent = '';
    msgEl.classList.add('hidden');
  }

  for (let i = 1; i <= 10; i++) {
    const range = i <= 3 ? 'low' : i <= 6 ? 'mid' : 'high';
    const btn = document.createElement('button');
    btn.className = 'stress-btn stress-btn--mini';
    btn.dataset.level = i;
    btn.dataset.range = range;
    btn.setAttribute('aria-label', `Stress level ${i}`);
    btn.textContent = i;
    btn.addEventListener('click', () => handleMiniCheckin(i));
    container.appendChild(btn);
  }
}

function handleMiniCheckin(level) {
  const prev = state.currentStressLevel;
  state.currentStressLevel = level;
  state.stressHistory.push({ level, toolId: state.currentTool, at: Date.now() });

  document.querySelectorAll('.stress-btn--mini').forEach(btn => {
    const sel = Number(btn.dataset.level) === level;
    btn.classList.toggle('stress-btn--selected', sel);
  });

  const msgEl = $('checkin-progress-msg');
  if (msgEl) {
    msgEl.classList.remove('hidden');
    const diff = prev - level;
    if (diff >= 3) {
      msgEl.textContent = `From ${prev} to ${level} — that's a real shift. You're doing the work.`;
    } else if (diff > 0) {
      msgEl.textContent = `You moved from ${prev} to ${level}. Small steps are real steps.`;
    } else if (diff === 0) {
      msgEl.textContent = `Holding steady at ${level}. Showing up matters — even when it's hard.`;
    } else {
      msgEl.textContent = `Stress can rise before it settles. That's completely normal. Let's keep going.`;
    }
  }
}

// ============================================================
// COMPLETION OVERLAY
// ============================================================

function showCompletionOverlay() {
  const overlay = $('completion-overlay');
  overlay.classList.remove('hidden');
  overlay.setAttribute('aria-hidden', 'false');
}

function hideCompletionOverlay() {
  const overlay = $('completion-overlay');
  overlay.classList.add('hidden');
  overlay.setAttribute('aria-hidden', 'true');
}

// ============================================================
// OTHER TOOLS TOGGLE
// ============================================================

function initOtherToolsToggle() {
  const toggle = $('other-tools-toggle');
  const list   = $('other-tools-list');

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    list.classList.toggle('hidden', expanded);
  });
}

// ============================================================
// PWA: INSTALL PROMPT
// ============================================================

function initPWA() {
  // Register service worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
  }

  // Install prompt (Android/Chrome)
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone === true;

  if (isStandalone) return;

  let deferredPrompt = null;
  const banner = $('install-banner');

  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    banner.classList.remove('hidden');
  });

  $('btn-install').addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    banner.classList.add('hidden');
  });

  $('btn-dismiss-banner').addEventListener('click', () => {
    banner.classList.add('hidden');
  });

  window.addEventListener('appinstalled', () => {
    banner.classList.add('hidden');
    deferredPrompt = null;
  });
}

// ============================================================
// EVENT WIRING
// ============================================================

function wireEvents() {
  // Voice toggle (check-in screen + tool screen)
  document.querySelectorAll('[data-voice-toggle]').forEach(btn => {
    btn.addEventListener('click', () => VoiceGuide.toggle());
  });

  // Screen 1
  $('btn-continue-checkin').addEventListener('click', handleContinueCheckin);

  // Safety
  $('btn-safety-ok').addEventListener('click', handleSafetyOk);
  $('back-safety').addEventListener('click', () => showScreen('screen-checkin'));

  // Screen 2
  $('btn-build-plan').addEventListener('click', handleBuildPlan);
  $('back-categories').addEventListener('click', () => showScreen('screen-checkin'));

  // Screen 3
  $('back-plan').addEventListener('click', () => {
    state.selectedCategories = [];
    showScreen('screen-categories');
    renderCategories();
  });

  // Screen 4
  $('back-tool').addEventListener('click', () => {
    clearTimers();
    if (state.quickSession) {
      state.quickSession = false;
      showScreen('screen-checkin');
    } else {
      renderSuggestedTool();
      renderNextTools();
      renderProgressPanel();
      showScreen('screen-plan');
    }
  });

  $('btn-done-tool').addEventListener('click', () => {
    captureCurrentToolTextareas();
    clearTimers();
    if (state.quickSession) {
      state.quickSession = false;
      showScreen('screen-checkin');
    } else {
      showCompletionOverlay();
    }
  });

  // Quick breathing shortcut on check-in screen
  $('btn-quick-breathing').addEventListener('click', () => {
    state.quickSession = true;
    selectTool('box-breathing');
  });

  // Completion overlay — page 1
  $('btn-try-another').addEventListener('click', () => {
    $('overlay-done-page').classList.add('hidden');
    $('overlay-checkin-page').classList.remove('hidden');
    renderMiniCheckin();
  });

  $('btn-done-session').addEventListener('click', () => {
    showSummaryPage();
  });

  // Completion overlay — page 2 (check-in)
  $('btn-checkin-continue').addEventListener('click', () => {
    $('overlay-done-page').classList.remove('hidden');
    $('overlay-checkin-page').classList.add('hidden');
    hideCompletionOverlay();
    renderSuggestedTool();
    renderNextTools();
    renderProgressPanel();
    showScreen('screen-plan');
  });

  $('btn-done-session-2').addEventListener('click', () => {
    showSummaryPage();
  });

  // Session summary page (page 3)
  $('btn-summary-done').addEventListener('click', () => {
    $('overlay-summary-page').classList.add('hidden');
    $('overlay-done-page').classList.remove('hidden');
    hideCompletionOverlay();
    resetSession();
    showScreen('screen-checkin');
  });

  // Other tools toggle
  initOtherToolsToggle();
}

// ============================================================
// SESSION RESET
// ============================================================

function resetSession() {
  clearTimers();
  state.stressLevel = null;
  state.sessionStartLevel = null;
  state.currentStressLevel = null;
  state.stressHistory = [];
  state.toolsUsed = [];
  state.selectedCategories = [];
  state.safetyShown = false;
  state.currentTool = null;
  state.recommendedToolIds = [];
  state.quickSession = false;
  state.sessionResponses = [];

  // Reset stress scale
  document.querySelectorAll('.stress-btn').forEach(btn => {
    btn.classList.remove('stress-btn--selected');
    btn.setAttribute('aria-checked', 'false');
  });
  $('stress-description').textContent = '';

  const continueBtn = $('btn-continue-checkin');
  continueBtn.disabled = true;
  continueBtn.setAttribute('aria-disabled', 'true');
}

// ============================================================
// INIT
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initStressScale();
  wireEvents();
  VoiceGuide.init();
  initPWA();
  initInstallModal();
  initLegalModals();
});
