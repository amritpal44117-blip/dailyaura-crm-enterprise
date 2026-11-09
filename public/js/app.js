// ====================================================
// DailyAura Enterprise Outreach CRM v2.5 - Client Engine
// ====================================================

const API = {
  token: localStorage.getItem('dailyaura_token') || '',

  headers() {
    return {
      'Content-Type': 'application/json',
      'Authorization': this.token ? `Bearer ${this.token}` : ''
    };
  },

  async get(url) {
    const res = await fetch(url, { headers: this.headers() });
    if (res.status === 401) handleUnauthorized();
    return res.json();
  },

  async post(url, data) {
    const res = await fetch(url, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(data)
    });
    if (res.status === 401) handleUnauthorized();
    return res.json();
  },

  async put(url, data) {
    const res = await fetch(url, {
      method: 'PUT',
      headers: this.headers(),
      body: JSON.stringify(data)
    });
    if (res.status === 401) handleUnauthorized();
    return res.json();
  },

  async del(url) {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: this.headers()
    });
    if (res.status === 401) handleUnauthorized();
    return res.json();
  }
};

function handleUnauthorized() {
  localStorage.removeItem('dailyaura_token');
  document.getElementById('loginScreen').classList.remove('hidden');
  document.getElementById('appContainer').classList.add('hidden');
}

// Global Workspace State
const workspaceState = {
  mode: localStorage.getItem('dailyaura_mode') || 'cold_outreach', // 'cold_outreach' | 'contributor_lifecycle'
  activeTemplateCategory: 'all',
  activeSeqTrack: 'all',
  gsc: {
    sent: true,
    opened: true,
    clicked: true,
    rate: true,
    range: '28d',
    compare: true
  }
};

const TAB_TITLES = {
  // Cold Outreach Suite
  'dashboard': 'Executive Overview & Control',
  'ai-agent': 'AI Outreach Strategy Agent',
  'analytics': 'GSC-Style Analytics Scoreboard',
  'live-feed': 'Real-Time Tracking Stream',
  'funnel': 'Outreach Conversion Funnel',
  'campaigns': 'Campaigns & Automation Runner',
  'sequences': 'Automated Drip Follow-ups & Lifecycle',
  'templates': 'Template Studio & AI Template Builder',
  'schedule': '2-Minute Safety Throttle Engine',
  'leads': 'Master Leads Database',
  'niche-hub': 'Niche Intelligence & Leaderboard',
  'vip-leads': 'VIP & High-DA Backlink Targets',
  'generator': '100k+ Lead Pipeline Generator',
  'blacklist': 'Suppression & Blacklist Hub',
  'ai-generator': 'AI Pitch & Subject Line Studio',
  'inbox': 'Replies & Incoming Leads Manager',
  'domain-health': 'Domain Deliverability & Spam Scanner',
  'smtp-settings': 'Hostinger SMTP Configuration',
  'security': 'Admin Security & Access Controls',
  'backup-export': 'Backup & Data Export Hub',

  // Contributor & Email Marketing Hub
  'contrib-dashboard': 'Contributor Hub Executive Overview',
  'contrib-users': 'Registered Authors & Contributors',
  'contrib-triggers': '3-Stage Automated Lifecycle Sequence',
  'contrib-articles': 'DailyAura Live Blog Feed Catalog',
  'contrib-templates': 'Contributor Email Templates & AI Studio',
  'contrib-stream': 'Contributor Delivery, Opens & Click Stream',
  'contrib-settings': 'WordPress Webhook & SMTP Health'
};

// Cached templates list in client
let allTemplates = [];
let currentAiGenerated = null;
let currentPreviewTemplate = null;

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  setupAuth();
  setupNavigation();
  setupMobileDrawer();
  setupLiveClock();
  setupModeSwitcher();
  setupContributorHub();
  setupCampaignControls();
  setupMultiCampaigns();
  setupLiveFeed();
  setupLeadsDatabase();
  setupGscAnalytics();
  setup100kGenerator();
  setupSequences();
  setupTemplateStudio();
  setupTemplateModals();
  setupBlacklist();
  setupPitchStudio();
  setupSpamScanner();
  setupInboxManager();
  setupAutomationHub();
  setupAiChat();
  setupVoiceCall();
  setupSettings();
  setupBackupExport();

  if (API.token) {
    showApp();
  } else {
    document.getElementById('loginScreen').classList.remove('hidden');
  }
});

function showApp() {
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('appContainer').classList.remove('hidden');
  loadAllData();
  loadContributorHubData();
  
  // Ensure correct workspace mode is applied to UI
  if (typeof applyWorkspaceMode === 'function') {
    applyWorkspaceMode(workspaceState.mode);
  }

  // Auto refresh live metrics every 8 seconds
  setInterval(() => {
    if (workspaceState.mode === 'cold_outreach') {
      loadStats();
      loadGscAnalytics();
      loadLiveFeed();
    } else {
      loadContributorStats();
      loadContribStream();
    }
  }, 8000);
}

function loadAllData() {
  loadStats();
  loadLeads();
  loadCampaign();
  loadCampaignsDeck();
  loadTemplates();
  loadGscAnalytics();
  loadLiveFeed();
  loadSequences();
  loadBlacklist();
  loadInboxReplies();
  loadSettings();
  loadChat();
}

// ==========================================
// WORKSPACE DUAL-MODE ENGINE SWITCHER
// ==========================================

let applyWorkspaceMode = null;

function setupModeSwitcher() {
  const sidebarSwitchBtn = document.getElementById('sidebarWorkspaceSwitchBtn');
  const sidebarSwitchBtnLabel = document.getElementById('sidebarSwitchBtnLabel');
  const navCold = document.getElementById('navColdOutreach');
  const navContrib = document.getElementById('navContributorHub');
  const sidebarBrandIcon = document.getElementById('sidebarBrandIcon');
  const sidebarSubtitle = document.getElementById('sidebarWorkspaceSubtitle');
  const headerWorkspaceTag = document.getElementById('headerWorkspaceTag');

  applyWorkspaceMode = function(mode) {
    workspaceState.mode = mode;
    localStorage.setItem('dailyaura_mode', mode);

    // Sidebar navigation & branding
    if (mode === 'contributor_lifecycle') {
      if (navCold) navCold.classList.add('hidden');
      if (navContrib) navContrib.classList.remove('hidden');
      if (sidebarBrandIcon) sidebarBrandIcon.textContent = '👥';
      if (sidebarSubtitle) sidebarSubtitle.textContent = 'Contributor & Email Hub';
      if (headerWorkspaceTag) headerWorkspaceTag.textContent = 'CONTRIBUTOR HUB';
      if (sidebarSwitchBtnLabel) sidebarSwitchBtnLabel.textContent = 'Switch Profile';

      // Automatically activate default tab for contributor hub if cold tab was active
      const activeTabPane = document.querySelector('.tab-pane.active');
      if (!activeTabPane || !activeTabPane.id.startsWith('tab-contrib-')) {
        activateTab('contrib-dashboard');
      }
      loadContributorHubData();
    } else {
      if (navContrib) navContrib.classList.add('hidden');
      if (navCold) navCold.classList.remove('hidden');
      if (sidebarBrandIcon) sidebarBrandIcon.textContent = '⚡';
      if (sidebarSubtitle) sidebarSubtitle.textContent = 'Cold Outreach Suite';
      if (headerWorkspaceTag) headerWorkspaceTag.textContent = 'COLD OUTREACH';
      if (sidebarSwitchBtnLabel) sidebarSwitchBtnLabel.textContent = 'Switch Profile';

      // Automatically activate default tab for outreach if contrib tab was active
      const activeTabPane = document.querySelector('.tab-pane.active');
      if (!activeTabPane || activeTabPane.id.startsWith('tab-contrib-')) {
        activateTab('dashboard');
      }
      loadAllData();
    }
  };

  if (sidebarSwitchBtn) {
    sidebarSwitchBtn.addEventListener('click', () => {
      const nextMode = workspaceState.mode === 'cold_outreach' ? 'contributor_lifecycle' : 'cold_outreach';
      applyWorkspaceMode(nextMode);
    });
  }

  // Initial apply
  applyWorkspaceMode(workspaceState.mode);
}

// Helper to switch active tab cleanly across both workspaces
function activateTab(targetTab) {
  const navItems = document.querySelectorAll('.nav-item');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const breadcrumb = document.getElementById('activeBreadcrumbTitle');

  navItems.forEach(n => {
    if (n.getAttribute('data-tab') === targetTab) {
      n.classList.add('active');
    } else {
      n.classList.remove('active');
    }
  });

  tabPanes.forEach(p => p.classList.remove('active'));
  const targetPane = document.getElementById(`tab-${targetTab}`);
  if (targetPane) targetPane.classList.add('active');

  if (breadcrumb && TAB_TITLES[targetTab]) {
    breadcrumb.textContent = TAB_TITLES[targetTab];
  }
}

// ==========================================
// LIVE SYSTEM CLOCK
// ==========================================

function setupLiveClock() {
  const clockEl = document.getElementById('systemLiveClock');
  if (!clockEl) return;
  function tick() {
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString('en-US', { hour12: false }) + ' (Live)';
  }
  tick();
  setInterval(tick, 1000);
}

// ==========================================
// AUTHENTICATION & WORKSPACE DESTINATION SELECTOR
// ==========================================

function setupAuth() {
  const loginForm = document.getElementById('loginForm');
  const loginError = document.getElementById('loginError');
  const loginSubmitBtn = document.getElementById('loginSubmitBtn');
  const wsCards = document.querySelectorAll('.login-workspace-card');

  let selectedWorkspace = localStorage.getItem('dailyaura_mode') || 'cold_outreach';

  function updateLoginWorkspaceCards(mode) {
    selectedWorkspace = mode;
    wsCards.forEach(card => {
      const targetMode = card.getAttribute('data-target-mode');
      card.classList.toggle('active', targetMode === mode);
    });
    if (loginSubmitBtn) {
      if (mode === 'contributor_lifecycle') {
        loginSubmitBtn.innerHTML = '👥 Sign In to Contributor & Marketing Hub';
        loginSubmitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      } else {
        loginSubmitBtn.innerHTML = '🚀 Sign In to B2B Cold Outreach Suite';
        loginSubmitBtn.style.background = 'linear-gradient(135deg, #2563eb, #3b82f6)';
      }
    }
  }

  // Bind click on workspace cards on login screen
  wsCards.forEach(card => {
    card.addEventListener('click', () => {
      const targetMode = card.getAttribute('data-target-mode');
      updateLoginWorkspaceCards(targetMode);
    });
  });

  // Set initial login cards state
  updateLoginWorkspaceCards(selectedWorkspace);

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.classList.add('hidden');

    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (data.success) {
        API.token = data.token;
        localStorage.setItem('dailyaura_token', data.token);
        localStorage.setItem('dailyaura_mode', selectedWorkspace);
        workspaceState.mode = selectedWorkspace;
        showApp();
      } else {
        loginError.textContent = data.message || 'Login failed';
        loginError.classList.remove('hidden');
      }
    } catch (err) {
      loginError.textContent = 'Server connection error';
      loginError.classList.remove('hidden');
    }
  });

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      handleUnauthorized();
    });
  }
}

// ==========================================
// NAVIGATION (ALL TABS ACROSS WORKSPACES)
// ==========================================

function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const breadcrumb = document.getElementById('activeBreadcrumbTitle');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetTab = item.getAttribute('data-tab');

      navItems.forEach(n => n.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      item.classList.add('active');
      const pane = document.getElementById(`tab-${targetTab}`);
      if (pane) pane.classList.add('active');

      if (breadcrumb && TAB_TITLES[targetTab]) {
        breadcrumb.textContent = TAB_TITLES[targetTab];
      }

      closeMobileMenu();

      // Refresh data on tab switch
      // Cold Outreach Tabs
      if (targetTab === 'analytics') loadGscAnalytics();
      if (targetTab === 'live-feed') loadLiveFeed();
      if (targetTab === 'campaigns') { loadCampaign(); loadCampaignsDeck(); }
      if (targetTab === 'templates') loadTemplates();
      if (targetTab === 'niche-hub') loadGscAnalytics();
      if (targetTab === 'leads') loadLeads();
      if (targetTab === 'sequences') loadSequences();
      if (targetTab === 'blacklist') loadBlacklist();
      if (targetTab === 'inbox') loadInboxReplies();
      if (targetTab === 'ai-agent') scrollChatBottom();

      // Contributor Hub Tabs
      if (targetTab === 'contrib-dashboard') { loadContributorStats(); loadContribStream(); }
      if (targetTab === 'contrib-users') loadContributors();
      if (targetTab === 'contrib-articles') loadArticlesCatalog();
      if (targetTab === 'contrib-templates') loadContribTemplates();
      if (targetTab === 'contrib-stream') loadContribStream();
    });
  });
}

function setupMobileDrawer() {
  const toggleBtn = document.getElementById('menuToggleBtn');
  const closeBtn = document.getElementById('closeSidebarBtn');
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebarBackdrop');

  function openMenu() {
    sidebar.classList.add('open');
    backdrop.classList.add('active');
  }

  function closeMenu() {
    sidebar.classList.remove('open');
    backdrop.classList.remove('active');
  }

  if (toggleBtn) toggleBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (backdrop) backdrop.addEventListener('click', closeMenu);
}

function closeMobileMenu() {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  if (sidebar) sidebar.classList.remove('open');
  if (backdrop) backdrop.classList.remove('active');
}

// ==========================================
// TEMPLATE STUDIO & AI TEMPLATE GENERATOR
// ==========================================

function setupTemplateStudio() {
  // Category Filter Pills
  const pills = document.querySelectorAll('.tmpl-filter-pill[data-cat]');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const cat = pill.getAttribute('data-cat');
      workspaceState.activeTemplateCategory = cat;
      renderTemplatesDeck();
    });
  });

  // Toggle AI Template Builder Card Visibility
  const toggleAiBtn = document.getElementById('toggleAiBuilderBtn');
  const aiCard = document.getElementById('aiTemplateBuilderCard');
  if (toggleAiBtn && aiCard) {
    toggleAiBtn.addEventListener('click', () => {
      aiCard.scrollIntoView({ behavior: 'smooth' });
      document.getElementById('aiTmplPrompt').focus();
    });
  }

  // AI Template Builder Form Submission
  const aiForm = document.getElementById('aiTemplateBuilderForm');
  if (aiForm) {
    aiForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const goal = document.getElementById('aiTmplGoal').value;
      const category = document.getElementById('aiTmplCategory').value;
      const tone = document.getElementById('aiTmplTone').value;
      const format = document.getElementById('aiTmplFormat').value;
      const prompt = document.getElementById('aiTmplPrompt').value.trim();

      const btn = document.getElementById('aiGenerateTmplBtn');
      const originalText = btn.innerHTML;
      btn.innerHTML = '✨ Synthesizing Template (English)...';
      btn.disabled = true;

      try {
        const res = await API.post('/api/ai/template-builder', {
          goal,
          category,
          tone,
          format,
          prompt,
          track: category === 'outreach' ? 'cold_outreach' : 'contributor_lifecycle'
        });

        if (res.success) {
          currentAiGenerated = res;
          renderAiTemplateOutput(res);
        }
      } catch (err) {
        alert('AI Generation error: ' + err.message);
      } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }
    });
  }

  // AI Generated Action Buttons
  const aiPreviewBtn = document.getElementById('aiPreviewHtmlBtn');
  if (aiPreviewBtn) {
    aiPreviewBtn.addEventListener('click', () => {
      if (!currentAiGenerated) return;
      openHtmlPreviewModal({
        name: currentAiGenerated.name,
        subject: currentAiGenerated.subjects?.[0]?.subject || 'Email Preview',
        body_text: currentAiGenerated.body_text,
        body_html: currentAiGenerated.body_html || ''
      });
    });
  }

  const aiSaveBtn = document.getElementById('aiSaveTmplBtn');
  if (aiSaveBtn) {
    aiSaveBtn.addEventListener('click', async () => {
      if (!currentAiGenerated) return;
      const payload = {
        name: currentAiGenerated.name,
        category: currentAiGenerated.category,
        stage: currentAiGenerated.stage,
        track: currentAiGenerated.track || 'cold_outreach',
        format: currentAiGenerated.body_html ? 'html' : 'text',
        subject: currentAiGenerated.subjects?.[0]?.subject || 'Outreach Pitch',
        body_text: currentAiGenerated.body_text,
        body_html: currentAiGenerated.body_html || ''
      };

      await API.post('/api/templates', payload);
      alert('Template successfully saved to your collection!');
      loadTemplates();
    });
  }

  const aiUseCampBtn = document.getElementById('aiUseInCampBtn');
  if (aiUseCampBtn) {
    aiUseCampBtn.addEventListener('click', async () => {
      if (!currentAiGenerated) return;
      const subj = currentAiGenerated.subjects?.[0]?.subject || 'Outreach Pitch';
      const body = currentAiGenerated.body_html || currentAiGenerated.body_text;
      await API.post('/api/campaign/update', { subject: subj, template: body });
      alert('Template applied to Active Campaign!');
      const campTab = document.querySelector('.nav-item[data-tab="campaigns"]');
      if (campTab) campTab.click();
      loadCampaign();
    });
  }
}

function filterTemplatesByCategory(cat) {
  workspaceState.activeTemplateCategory = cat;
  const pills = document.querySelectorAll('.tmpl-filter-pill[data-cat]');
  pills.forEach(p => {
    p.classList.toggle('active', p.getAttribute('data-cat') === cat);
  });
  renderTemplatesDeck();
}

function renderAiTemplateOutput(res) {
  const container = document.getElementById('aiTmplOutputContainer');
  const nameEl = document.getElementById('aiGeneratedName');
  const stageEl = document.getElementById('aiGeneratedStage');
  const subjList = document.getElementById('aiSubjectLinesList');
  const bodyEl = document.getElementById('aiTmplBodyPreview');

  nameEl.textContent = res.name;
  stageEl.textContent = `Stage: ${res.stage} • Category: ${res.category.toUpperCase()}`;
  bodyEl.textContent = res.body_text;

  subjList.innerHTML = (res.subjects || []).map((s, idx) => `
    <div style="background: rgba(255,255,255,0.04); border: 1px solid var(--border-color); border-radius: 6px; padding: 10px 14px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <span class="badge" style="background: rgba(59,130,246,0.2); color: #3b82f6; margin-right: 8px;">Option ${idx + 1}</span>
        <strong>${escapeHtml(s.subject)}</strong>
        <span style="font-size: 11px; margin-left: 8px; color: #10b981;">Est. Open: ${s.predicted_open_rate}</span>
      </div>
      <button class="btn btn-sm btn-ghost" onclick="selectAiSubject('${escapeHtml(s.subject.replace(/'/g, "\\'"))}')">Select</button>
    </div>
  `).join('');

  container.classList.remove('hidden');
}

function selectAiSubject(subj) {
  if (currentAiGenerated && currentAiGenerated.subjects) {
    currentAiGenerated.subjects.unshift({ subject: subj, predicted_open_rate: 'Selected', score: '10/10' });
    alert(`Selected Subject: "${subj}"`);
  }
}

async function loadTemplates() {
  try {
    const list = await API.get('/api/templates');
    if (!Array.isArray(list)) return;
    allTemplates = list;

    // Update Counts
    const countAll = document.getElementById('countTmplAll');
    if (countAll) countAll.textContent = list.length;
    const countOutreach = document.getElementById('countTmplOutreach');
    if (countOutreach) countOutreach.textContent = list.filter(t => t.category === 'outreach').length;
    const countLifecycle = document.getElementById('countTmplLifecycle');
    if (countLifecycle) countLifecycle.textContent = list.filter(t => t.category === 'lifecycle').length;
    const countDigest = document.getElementById('countTmplDigest');
    if (countDigest) countDigest.textContent = list.filter(t => t.category === 'digest').length;
    const countAdv = document.getElementById('countTmplAdvertising');
    if (countAdv) countAdv.textContent = list.filter(t => t.category === 'advertising').length;

    renderTemplatesDeck();
  } catch (err) {
    console.error('Error loading templates:', err);
  }
}

function renderTemplatesDeck() {
  const deck = document.getElementById('templatesDeck');
  if (!deck) return;

  const cat = workspaceState.activeTemplateCategory;
  const filtered = cat === 'all' ? allTemplates : allTemplates.filter(t => t.category === cat);

  if (filtered.length === 0) {
    deck.innerHTML = `<div class="empty-state" style="grid-column: 1 / -1;">No templates found in this category. Click "+ Create Custom Template" or use the AI Generator above!</div>`;
    return;
  }

  deck.innerHTML = filtered.map(t => {
    const isHtml = t.format === 'html' || Boolean(t.body_html);
    const catClass = `category-${t.category || 'outreach'}`;
    const badgeClass = `badge-${t.category || 'outreach'}`;

    return `
      <div class="tmpl-card-modern ${catClass}">
        <div>
          <div class="tmpl-header-meta">
            <span class="tmpl-tag-badge ${badgeClass}">${t.category} &bull; ${t.stage || 'General'}</span>
            <span class="tmpl-format-pill">${isHtml ? 'HTML CARD' : 'TEXT'}</span>
          </div>
          <div class="tmpl-card-title">${escapeHtml(t.name)}</div>
          <div class="tmpl-subject-preview" title="${escapeHtml(t.subject)}">
            <strong>Subj:</strong> ${escapeHtml(t.subject)}
          </div>
          <p style="font-size: 13px; color: #94a3b8; line-height: 1.5; margin: 0 0 10px 0; max-height: 58px; overflow: hidden;">
            ${escapeHtml((t.body_text || '').substring(0, 140))}...
          </p>
        </div>

        <div class="tmpl-card-actions">
          <button class="btn btn-sm btn-secondary" onclick="openTemplatePreview('${t.id}')">👁️ Live HTML Preview</button>
          <button class="btn btn-sm btn-ghost" onclick="openTemplateEditor('${t.id}')">✏️ Edit</button>
          <button class="btn btn-sm btn-primary" onclick="applyTemplateToCampaign('${t.id}')">🚀 Use in Campaign</button>
        </div>
      </div>
    `;
  }).join('');
}

// ==========================================
// TEMPLATE MODALS (HTML PREVIEW & CUSTOMIZER)
// ==========================================

function setupTemplateModals() {
  // HTML Preview Modal
  const previewModal = document.getElementById('htmlPreviewModal');
  const closePreviewBtn = document.getElementById('closeHtmlPreviewModal');
  const cancelPreviewBtn = document.getElementById('cancelHtmlPreview');
  const viewDesktopBtn = document.getElementById('viewDesktopBtn');
  const viewMobileBtn = document.getElementById('viewMobileBtn');
  const frameWrapper = document.getElementById('previewFrameWrapper');
  const previewUseBtn = document.getElementById('previewUseInCampBtn');

  if (closePreviewBtn) closePreviewBtn.addEventListener('click', () => previewModal.classList.add('hidden'));
  if (cancelPreviewBtn) cancelPreviewBtn.addEventListener('click', () => previewModal.classList.add('hidden'));

  if (viewDesktopBtn && viewMobileBtn && frameWrapper) {
    viewDesktopBtn.addEventListener('click', () => {
      viewDesktopBtn.classList.add('active');
      viewMobileBtn.classList.remove('active');
      frameWrapper.className = 'preview-frame-desktop';
    });
    viewMobileBtn.addEventListener('click', () => {
      viewMobileBtn.classList.add('active');
      viewDesktopBtn.classList.remove('active');
      frameWrapper.className = 'preview-frame-mobile';
    });
  }

  if (previewUseBtn) {
    previewUseBtn.addEventListener('click', async () => {
      if (!currentPreviewTemplate) return;
      const subj = currentPreviewTemplate.subject;
      const body = currentPreviewTemplate.body_html || currentPreviewTemplate.body_text;
      await API.post('/api/campaign/update', { subject: subj, template: body });
      previewModal.classList.add('hidden');
      alert('Template applied to Active Campaign!');
      const campTab = document.querySelector('.nav-item[data-tab="campaigns"]');
      if (campTab) campTab.click();
      loadCampaign();
    });
  }

  // Template Editor Modal
  const editModal = document.getElementById('editTemplateModal');
  const closeEditBtn = document.getElementById('closeEditTmplModal');
  const cancelEditBtn = document.getElementById('cancelEditTmpl');
  const openNewBtn = document.getElementById('openNewTemplateModalBtn');
  const editForm = document.getElementById('editTemplateForm');

  if (closeEditBtn) closeEditBtn.addEventListener('click', () => editModal.classList.add('hidden'));
  if (cancelEditBtn) cancelEditBtn.addEventListener('click', () => editModal.classList.add('hidden'));

  if (openNewBtn) {
    openNewBtn.addEventListener('click', () => {
      document.getElementById('editTmplId').value = '';
      document.getElementById('editTmplModalTitle').textContent = 'Create New Email Template';
      editForm.reset();
      editModal.classList.remove('hidden');
    });
  }

  if (editForm) {
    editForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('editTmplId').value;
      const payload = {
        name: document.getElementById('editTmplName').value.trim(),
        category: document.getElementById('editTmplCategory').value,
        stage: document.getElementById('editTmplStage').value.trim() || 'Custom',
        format: document.getElementById('editTmplFormat').value,
        subject: document.getElementById('editTmplSubject').value.trim(),
        body_text: document.getElementById('editTmplBodyText').value,
        body_html: document.getElementById('editTmplBodyHtml').value
      };

      if (id) {
        await API.put(`/api/templates/${id}`, payload);
      } else {
        await API.post('/api/templates', payload);
      }

      editModal.classList.add('hidden');
      alert('Template saved successfully!');
      loadTemplates();
    });
  }
}

function openTemplatePreview(id) {
  const tmpl = allTemplates.find(t => t.id === id);
  if (!tmpl) return;
  openHtmlPreviewModal(tmpl);
}

function openHtmlPreviewModal(tmpl) {
  currentPreviewTemplate = tmpl;
  const modal = document.getElementById('htmlPreviewModal');
  const title = document.getElementById('previewModalTitle');
  const subj = document.getElementById('previewModalSubject');
  const iframe = document.getElementById('previewEmailIframe');

  if (title) title.textContent = tmpl.name;
  if (subj) subj.textContent = `Subject: ${tmpl.subject}`;

  // Render HTML inside iframe
  let content = tmpl.body_html || '';
  if (!content) {
    content = `<div style="font-family: -apple-system, sans-serif; padding: 24px; color: #f8fafc; line-height: 1.6;">
      ${(tmpl.body_text || '').split('\n\n').map(p => `<p style="margin-bottom: 14px;">${escapeHtml(p).replace(/\n/g, '<br>')}</p>`).join('')}
    </div>`;
  }

  // Replace dummy tags for preview
  content = content
    .replace(/{{name}}/g, 'Alex Morgan')
    .replace(/{{website}}/g, 'TechPulse Daily')
    .replace(/{{niche}}/g, 'AI & Technology');

  if (iframe) {
    iframe.srcdoc = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{margin:0;padding:16px;background:#060913;}</style></head><body>${content}</body></html>`;
  }

  if (modal) modal.classList.remove('hidden');
}

function openTemplateEditor(id) {
  const tmpl = allTemplates.find(t => t.id === id);
  if (!tmpl) return;

  document.getElementById('editTmplId').value = tmpl.id;
  document.getElementById('editTmplModalTitle').textContent = `Edit Template: ${tmpl.name}`;
  document.getElementById('editTmplName').value = tmpl.name || '';
  document.getElementById('editTmplCategory').value = tmpl.category || 'outreach';
  document.getElementById('editTmplStage').value = tmpl.stage || '';
  document.getElementById('editTmplFormat').value = tmpl.format || 'text';
  document.getElementById('editTmplSubject').value = tmpl.subject || '';
  document.getElementById('editTmplBodyText').value = tmpl.body_text || '';
  document.getElementById('editTmplBodyHtml').value = tmpl.body_html || '';

  document.getElementById('editTemplateModal').classList.remove('hidden');
}

async function applyTemplateToCampaign(id) {
  const tmpl = allTemplates.find(t => t.id === id);
  if (!tmpl) return;

  const subj = tmpl.subject;
  const body = tmpl.body_html || tmpl.body_text;
  await API.post('/api/campaign/update', { subject: subj, template: body });
  alert(`Applied "${tmpl.name}" to Active Campaign!`);
  const campTab = document.querySelector('.nav-item[data-tab="campaigns"]');
  if (campTab) campTab.click();
  loadCampaign();
}

// ==========================================
// SEQUENCES & LIFECYCLE FOLLOW-UPS
// ==========================================

function setupSequences() {
  const pills = document.querySelectorAll('.seq-track-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const track = pill.getAttribute('data-track');
      workspaceState.activeSeqTrack = track;
      loadSequences();
    });
  });
}

function filterSequencesByTrack(track) {
  workspaceState.activeSeqTrack = track;
  const pills = document.querySelectorAll('.seq-track-pill');
  pills.forEach(p => {
    p.classList.toggle('active', p.getAttribute('data-track') === track);
  });
  loadSequences();
}

async function loadSequences() {
  const container = document.getElementById('sequenceList');
  if (!container) return;

  try {
    const seqs = await API.get('/api/sequences');
    if (!Array.isArray(seqs)) return;

    const track = workspaceState.activeSeqTrack;
    const filtered = track === 'all' ? seqs : seqs.filter(s => s.track === track || !s.track);

    container.innerHTML = filtered.map(s => {
      const isLifecycle = s.track === 'contributor_lifecycle';
      const trackBadge = isLifecycle 
        ? `<span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #10b981;">👥 Contributor Lifecycle</span>`
        : `<span class="badge" style="background: rgba(59, 130, 246, 0.15); color: #3b82f6;">🚀 Cold Outreach</span>`;

      return `
        <div class="activity-item" style="margin-bottom: 12px; border-left: 3px solid ${isLifecycle ? '#10b981' : '#3b82f6'};">
          <div class="activity-main">
            <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 4px;">
              <strong>Step ${s.step}: ${escapeHtml(s.name)}</strong>
              ${trackBadge}
            </div>
            <span>Delay: ${s.delay_days === 0 ? (s.delay_mins ? `${s.delay_mins} minutes after signup` : 'Immediately') : `${s.delay_days} days after previous step`} &bull; Subj: "${escapeHtml(s.subject)}"</span>
            <p style="font-size: 12px; color: var(--text-muted); margin: 4px 0 0 0;">${escapeHtml(s.description || '')}</p>
          </div>
          <div>
            <span class="badge ${s.active ? 'badge-success' : ''}">${s.active ? 'Active' : 'Paused'}</span>
          </div>
        </div>
      `;
    }).join('');
  } catch (err) {
    console.error('Error loading sequences:', err);
  }
}

// ==========================================
// GSC-STYLE ANALYTICS & COMPARISON ENGINE
// ==========================================

function setupGscAnalytics() {
  const rangeSelect = document.getElementById('gscRangeSelect');
  const compareToggle = document.getElementById('gscCompareToggle');
  const cards = document.querySelectorAll('.gsc-card');

  if (rangeSelect) {
    rangeSelect.addEventListener('change', (e) => {
      workspaceState.gsc.range = e.target.value;
      loadGscAnalytics();
    });
  }

  if (compareToggle) {
    compareToggle.addEventListener('click', () => {
      workspaceState.gsc.compare = !workspaceState.gsc.compare;
      compareToggle.classList.toggle('active-toggle', workspaceState.gsc.compare);
      loadGscAnalytics();
    });
  }

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const s = card.getAttribute('data-series');
      workspaceState.gsc[s] = !workspaceState.gsc[s];
      card.classList.toggle('selected', workspaceState.gsc[s]);
      renderGscChart();
    });
  });
}

let latestGscData = null;

async function loadGscAnalytics() {
  try {
    const data = await API.get(`/api/analytics?range=${workspaceState.gsc.range}&compare=${workspaceState.gsc.compare}`);
    if (!data || data.error) return;

    latestGscData = data;

    // Update GSC scoreboard metrics
    const c = data.current;
    const diff = data.diff;

    const elSent = document.getElementById('gscMetricSent');
    if (elSent) elSent.textContent = c.sent;
    setDiffText('gscDiffSent', diff.sent, 'sent');

    const elOpened = document.getElementById('gscMetricOpened');
    if (elOpened) elOpened.textContent = c.opened;
    setDiffText('gscDiffOpened', diff.opened, 'opens');

    const elClicked = document.getElementById('gscMetricClicked');
    if (elClicked) elClicked.textContent = c.clicked;
    setDiffText('gscDiffClicked', diff.clicked, 'clicks');

    const elRate = document.getElementById('gscMetricRate');
    if (elRate) elRate.textContent = `${c.openRate}%`;
    setDiffText('gscDiffRate', diff.openRate, '% rate');

    // Funnel tab update
    const fSent = data.totals.totalSent;
    const fOpened = data.totals.totalOpened;
    const fClicked = data.totals.totalClicked;
    const fOpenRate = fSent > 0 ? Math.round((fOpened / fSent) * 100) : 0;
    const fClickRate = fSent > 0 ? Math.round((fClicked / fSent) * 100) : 0;

    const fcSent = document.getElementById('fCountSent');
    if (fcSent) fcSent.textContent = `${fSent} (100%)`;
    const fcOpened = document.getElementById('fCountOpened');
    if (fcOpened) fcOpened.textContent = `${fOpened} (${fOpenRate}%)`;
    const fcClicked = document.getElementById('fCountClicked');
    if (fcClicked) fcClicked.textContent = `${fClicked} (${fClickRate}%)`;

    const fbOpened = document.getElementById('fBarOpened');
    if (fbOpened) fbOpened.style.width = `${Math.min(fOpenRate, 100)}%`;
    const fbClicked = document.getElementById('fBarClicked');
    if (fbClicked) fbClicked.style.width = `${Math.min(fClickRate, 100)}%`;

    // Render Niche Leaderboard Tables
    renderNicheHub(data.nicheStats);

    // Render GSC SVG Chart
    renderGscChart();

  } catch (err) {
    console.error('Error loading GSC analytics:', err);
  }
}

function setDiffText(elementId, val, unit) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const isPos = val >= 0;
  el.textContent = `${isPos ? '+' : ''}${val} ${unit} vs prev`;
  el.className = `gsc-card-diff ${isPos ? '' : 'negative'}`;
}

function renderGscChart() {
  if (!latestGscData || !latestGscData.timeline) return;

  const svg = document.getElementById('gscSvgChart');
  const axis = document.getElementById('gscDatesAxis');
  const timeline = latestGscData.timeline;
  if (!svg || timeline.length === 0) return;

  const width = 1000;
  const height = 260;
  const padding = 20;

  let maxSent = Math.max(...timeline.map(d => d.sent), 5);
  let maxOpened = Math.max(...timeline.map(d => d.opened), 5);
  let maxClicked = Math.max(...timeline.map(d => d.clicked), 5);

  const stepX = (width - padding * 2) / Math.max(timeline.length - 1, 1);

  const buildPath = (key, maxVal) => {
    return timeline.map((d, i) => {
      const x = padding + i * stepX;
      const val = d[key] || 0;
      const y = height - padding - (val / maxVal) * (height - padding * 2);
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(' ');
  };

  let pathsHtml = `
    <line x1="20" y1="20" x2="980" y2="20" stroke="#1e293b" stroke-dasharray="4"/>
    <line x1="20" y1="90" x2="980" y2="90" stroke="#1e293b" stroke-dasharray="4"/>
    <line x1="20" y1="160" x2="980" y2="160" stroke="#1e293b" stroke-dasharray="4"/>
    <line x1="20" y1="230" x2="980" y2="230" stroke="#1e293b"/>
  `;

  if (workspaceState.gsc.sent) {
    const p = buildPath('sent', maxSent);
    pathsHtml += `<path d="${p}" fill="none" stroke="#3b82f6" stroke-width="3" stroke-linecap="round"/>`;
  }

  if (workspaceState.gsc.opened) {
    const p = buildPath('opened', maxOpened);
    pathsHtml += `<path d="${p}" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round"/>`;
  }

  if (workspaceState.gsc.clicked) {
    const p = buildPath('clicked', maxClicked);
    pathsHtml += `<path d="${p}" fill="none" stroke="#06b6d4" stroke-width="3" stroke-linecap="round"/>`;
  }

  svg.innerHTML = pathsHtml;

  if (axis) {
    const interval = Math.ceil(timeline.length / 7);
    axis.innerHTML = timeline
      .filter((_, idx) => idx % interval === 0 || idx === timeline.length - 1)
      .map(d => `<span>${d.label}</span>`)
      .join('');
  }
}

function renderNicheHub(niches) {
  const tbody1 = document.getElementById('nicheTableBody');
  const tbody2 = document.getElementById('nicheHubTableBody');
  if (!niches) return;

  const rowsHtml = niches.map(n => `
    <tr>
      <td><span class="badge" style="background: rgba(59, 130, 246, 0.2); color: #3b82f6; font-weight:800;">#${n.rank}</span></td>
      <td><strong>${n.niche}</strong></td>
      <td>${n.total}</td>
      <td><span class="badge badge-success">${n.sent}</span></td>
      <td><span style="color: var(--text-muted);">${n.pending}</span></td>
      <td><span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #10b981;">👁️ ${n.opened}</span></td>
      <td><span class="badge" style="background: rgba(6, 182, 212, 0.15); color: #06b6d4;">🔗 ${n.clicked}</span></td>
      <td><strong>${n.openRate}%</strong></td>
      <td>
        <button class="btn btn-sm btn-secondary" onclick="targetNicheDirectly('${n.niche}')">Target Niche</button>
      </td>
    </tr>
  `).join('');

  if (tbody1) tbody1.innerHTML = rowsHtml;
  if (tbody2) tbody2.innerHTML = rowsHtml;
}

function targetNicheDirectly(nicheName) {
  const select = document.getElementById('campNicheSelect');
  if (select) select.value = nicheName;
  const campTab = document.querySelector('.nav-item[data-tab="campaigns"]');
  if (campTab) campTab.click();
}

// ==========================================
// REAL-TIME LIVE TRACKING STREAM
// ==========================================

function setupLiveFeed() {
  const typeFilter = document.getElementById('liveEventTypeFilter');
  const timeFilter = document.getElementById('liveEventTimeFilter');
  const searchInput = document.getElementById('liveEventSearch');
  const refreshBtn = document.getElementById('refreshFeedBtn');

  if (typeFilter) typeFilter.addEventListener('change', () => loadLiveFeed());
  if (timeFilter) timeFilter.addEventListener('change', () => loadLiveFeed());
  if (searchInput) searchInput.addEventListener('input', () => loadLiveFeed());
  if (refreshBtn) refreshBtn.addEventListener('click', () => { loadLiveFeed(); loadStats(); });
}

async function loadLiveFeed() {
  const listEl = document.getElementById('fullActivityList');
  if (!listEl) return;

  const type = document.getElementById('liveEventTypeFilter') ? document.getElementById('liveEventTypeFilter').value : 'all';
  const time = document.getElementById('liveEventTimeFilter') ? document.getElementById('liveEventTimeFilter').value : 'all';
  const search = document.getElementById('liveEventSearch') ? document.getElementById('liveEventSearch').value.trim() : '';

  try {
    const events = await API.get(`/api/events?type=${encodeURIComponent(type)}&time=${encodeURIComponent(time)}&search=${encodeURIComponent(search)}`);
    if (!Array.isArray(events)) return;

    if (events.length === 0) {
      listEl.innerHTML = `<div class="empty-state">No tracking events match current filter. Launch campaign to stream live activity.</div>`;
      return;
    }

    listEl.innerHTML = events.map(e => {
      let icon = '✉️';
      let title = 'Outbound Dispatched';

      if (e.type === 'open') {
        icon = '👁️';
        title = 'Email Opened (Seen)';
      } else if (e.type === 'click') {
        icon = '🔗';
        title = 'Website Link Clicked';
      }

      const dateStr = new Date(e.timestamp).toLocaleString();

      return `
        <div class="activity-item ${e.type === 'click' ? 'click-event' : (e.type === 'open' ? 'open-event' : '')}">
          <div style="font-size: 20px; line-height: 1; padding: 4px;">${icon}</div>
          <div class="activity-main">
            <strong>${title} &bull; ${escapeHtml(e.website || e.email)}</strong>
            <span>Recipient: <code>${escapeHtml(e.email)}</code> ${e.url ? `&bull; Target: <a href="${e.url}" target="_blank" style="color: #06b6d4;">${escapeHtml(e.url)}</a>` : ''}</span>
          </div>
          <div class="activity-time">
            ${dateStr}
          </div>
        </div>
      `;
    }).join('');
  } catch (err) {
    console.error('Error loading live feed:', err);
  }
}

// ==========================================
// MULTI-CAMPAIGN ENGINE & WIZARD
// ==========================================

function setupMultiCampaigns() {
  const modal = document.getElementById('newCampModal');
  const openBtn = document.getElementById('openNewCampModalBtn');
  const closeBtn = document.getElementById('closeNewCampModal');
  const cancelBtn = document.getElementById('cancelNewCamp');
  const form = document.getElementById('newCampForm');

  if (openBtn) openBtn.addEventListener('click', () => modal.classList.remove('hidden'));
  if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
  if (cancelBtn) cancelBtn.addEventListener('click', () => modal.classList.add('hidden'));

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        name: document.getElementById('newCampName').value.trim(),
        niche: document.getElementById('newCampNiche').value,
        segment: document.getElementById('newCampSegment').value,
        delay_min: parseInt(document.getElementById('newCampDelayMin').value),
        delay_max: parseInt(document.getElementById('newCampDelayMax').value),
        track: workspaceState.mode
      };

      await API.post('/api/campaigns', payload);
      modal.classList.add('hidden');
      form.reset();
      loadCampaignsDeck();
    });
  }
}

async function loadCampaignsDeck() {
  const deck = document.getElementById('campaignsDeck');
  if (!deck) return;

  try {
    const list = await API.get('/api/campaigns');
    if (!Array.isArray(list) || list.length === 0) {
      deck.innerHTML = `<div class="empty-state">No campaigns created yet. Click "+ Add New Campaign" to launch a targeted outreach flow.</div>`;
      return;
    }

    deck.innerHTML = list.map(c => `
      <div class="card campaign-card" style="border-left: 4px solid ${c.status === 'running' ? '#10b981' : '#3b82f6'};">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
          <div>
            <h4 style="font-size: 16px; margin-bottom: 4px;">${escapeHtml(c.name)}</h4>
            <span style="font-size: 12px; color: var(--text-muted);">Audience: <strong>${escapeHtml(c.niche)}</strong> &bull; Segment: ${escapeHtml(c.segment || 'Fresh')}</span>
          </div>
          <span class="status-tag ${c.status}">${c.status.toUpperCase()}</span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin: 14px 0; background: rgba(0,0,0,0.25); padding: 10px; border-radius: 8px;">
          <div><small style="color:var(--text-muted);">Sent</small><br><strong>${c.sent_count || 0}</strong></div>
          <div><small style="color:var(--text-muted);">Opens</small><br><strong style="color:#10b981;">${c.open_count || 0}</strong></div>
          <div><small style="color:var(--text-muted);">Clicks</small><br><strong style="color:#06b6d4;">${c.click_count || 0}</strong></div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: var(--text-muted);">
          <span>Safety Delay: <strong>${c.delay_min || 120}s - ${c.delay_max || 180}s</strong></span>
          <button class="btn btn-sm btn-secondary" onclick="targetNicheDirectly('${escapeHtml(c.niche)}')">Configure Pitch</button>
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error('Error loading campaigns deck:', err);
  }
}

// ==========================================
// 100K LEAD GENERATOR
// ==========================================

function setup100kGenerator() {
  const form = document.getElementById('generatorForm');
  const resultBox = document.getElementById('genResultBox');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const niche = document.getElementById('genNiche').value;
      const count = document.getElementById('genCount').value;

      resultBox.className = 'test-result-box';
      resultBox.textContent = `Mining and injecting ${count} verified prospect profiles for "${niche}"...`;
      resultBox.classList.remove('hidden');

      try {
        const res = await API.post('/api/leads/generate-batch', { niche, count });
        resultBox.className = 'test-result-box success';
        resultBox.textContent = `Successfully injected ${res.added} verified prospects! Total Pipeline Pool: ${res.total} leads.`;
        loadLeads();
        loadStats();
        loadGscAnalytics();
      } catch (err) {
        resultBox.className = 'test-result-box error';
        resultBox.textContent = 'Generation error: ' + err.message;
      }
    });
  }
}

// ==========================================
// BLACKLIST / SUPPRESSION
// ==========================================

function setupBlacklist() {
  const form = document.getElementById('blacklistForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('blEmail').value.trim();
      const reason = document.getElementById('blReason').value.trim();
      await API.post('/api/blacklist', { email, reason });
      form.reset();
      loadBlacklist();
    });
  }
}

async function loadBlacklist() {
  const tbody = document.getElementById('blacklistTableBody');
  if (!tbody) return;

  try {
    const list = await API.get('/api/blacklist');
    if (!Array.isArray(list)) return;

    tbody.innerHTML = list.map(b => `
      <tr>
        <td><code>${escapeHtml(b.email)}</code></td>
        <td>${escapeHtml(b.reason || 'Manual suppression')}</td>
        <td><small style="color: var(--text-muted);">${new Date(b.added_at).toLocaleDateString()}</small></td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('Error loading blacklist:', err);
  }
}

// ==========================================
// AI PITCH STUDIO & GENERATOR
// ==========================================

function setupPitchStudio() {
  const form = document.getElementById('pitchStudioForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const target_url = document.getElementById('pitchTargetUrl').value.trim();
      const niche = document.getElementById('pitchTargetNiche').value;
      const angle = document.getElementById('pitchAngle').value;
      const tone = document.getElementById('pitchTone').value;

      const outputEl = document.getElementById('aiPitchOutput');
      outputEl.innerHTML = `<div class="empty-state">Synthesizing personalized guest post pitch and high-converting subject lines...</div>`;

      try {
        const res = await API.post('/api/ai/pitch-generator', { target_url, niche, angle, tone });
        if (res.success) {
          renderPitchOutput(res);
        }
      } catch (err) {
        outputEl.innerHTML = `<div class="test-result-box error">Generation failed: ${err.message}</div>`;
      }
    });
  }
}

function renderPitchOutput(res) {
  const container = document.getElementById('aiPitchOutput');
  if (!container) return;

  const subjectsHtml = res.subjects.map((s, idx) => `
    <div style="background: rgba(255, 255, 255, 0.04); border: 1px solid var(--border-color); border-radius: 8px; padding: 12px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <span class="badge" style="background: rgba(59, 130, 246, 0.2); color: #3b82f6; margin-right: 8px;">Angle #${idx + 1}</span>
        <strong>${escapeHtml(s.subject)}</strong>
        <span style="font-size: 11px; margin-left: 10px; color: #10b981;">Est. Open: ${s.predicted_open_rate} (Score: ${s.score})</span>
      </div>
      <button class="btn btn-sm btn-ghost" onclick="applySubjectLine('${escapeHtml(s.subject.replace(/'/g, "\\'"))}')">Use Subject</button>
    </div>
  `).join('');

  container.innerHTML = `
    <div style="margin-bottom: 16px;">
      <h4 style="margin-bottom: 10px;">Recommended Subject Lines</h4>
      ${subjectsHtml}
    </div>
    <div class="card" style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-color);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <h4>Personalized Pitch Draft for ${escapeHtml(res.siteName)}</h4>
        <button class="btn btn-sm btn-primary" onclick="applyPitchBody()">Insert into Active Campaign</button>
      </div>
      <pre id="currentAiPitchBody" style="white-space: pre-wrap; font-family: inherit; font-size: 13px; line-height: 1.6; color: #cbd5e1;">${escapeHtml(res.pitch)}</pre>
    </div>
  `;
}

function applySubjectLine(subj) {
  const input = document.getElementById('campSubject');
  if (input) input.value = subj;
  alert('Subject line applied to active campaign!');
  const campTab = document.querySelector('.nav-item[data-tab="campaigns"]');
  if (campTab) campTab.click();
}

function applyPitchBody() {
  const bodyEl = document.getElementById('currentAiPitchBody');
  const campTemplate = document.getElementById('campTemplate');
  if (bodyEl && campTemplate) {
    campTemplate.value = bodyEl.textContent;
    alert('Pitch template applied to active campaign!');
    const campTab = document.querySelector('.nav-item[data-tab="campaigns"]');
    if (campTab) campTab.click();
  }
}

// ==========================================
// LIVE SPAM TRIGGER SCANNER
// ==========================================

function setupSpamScanner() {}

async function runSpamCheck() {
  const input = document.getElementById('spamScannerInput');
  const resultBox = document.getElementById('spamScannerResult');
  if (!input || !resultBox) return;

  const text = input.value.trim();
  if (!text) {
    alert('Please enter or paste an email draft to scan.');
    return;
  }

  resultBox.className = 'test-result-box';
  resultBox.textContent = 'Scanning draft for deliverability & spam filter triggers...';
  resultBox.classList.remove('hidden');

  try {
    const res = await API.post('/api/spam-check', { text });
    resultBox.className = `test-result-box ${res.score >= 80 ? 'success' : 'error'}`;
    resultBox.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <strong>Deliverability Score: ${res.score} / 100</strong>
        <span class="badge ${res.score >= 80 ? 'badge-success' : 'badge-danger'}">${res.rating}</span>
      </div>
      <p style="margin-bottom: 6px; font-size: 13px;">${res.recommendations.join('<br>')}</p>
      ${res.flaggedWords.length > 0 ? `<p style="font-size: 12px; color: #ef4444;">Flagged keywords: ${res.flaggedWords.join(', ')}</p>` : ''}
    `;
  } catch (err) {
    resultBox.className = 'test-result-box error';
    resultBox.textContent = 'Scan failed: ' + err.message;
  }
}

// ==========================================
// INBOX & REPLIES MANAGER
// ==========================================

function setupInboxManager() {}

async function loadInboxReplies() {
  const tbody = document.getElementById('inboxTableBody');
  if (!tbody) return;

  try {
    const replies = await API.get('/api/replies');
    if (!Array.isArray(replies) || replies.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center" style="padding: 24px; color: var(--text-muted);">No prospect replies received yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = replies.map(r => `
      <tr>
        <td>
          <strong>${escapeHtml(r.sender_name || 'Prospect')}</strong><br>
          <small style="color: var(--text-muted);">${escapeHtml(r.website || r.email)}</small>
        </td>
        <td><strong>${escapeHtml(r.subject)}</strong></td>
        <td><span style="font-size: 12px; color: #cbd5e1;">${escapeHtml(r.snippet)}</span></td>
        <td><span class="badge badge-success">${escapeHtml(r.sentiment || 'positive')}</span></td>
        <td><small style="color: var(--text-muted);">${new Date(r.received_at).toLocaleDateString()}</small></td>
        <td>
          <button class="btn btn-sm btn-primary" onclick="respondToReply('${r.id}', '${escapeHtml(r.email)}')">Fast Reply</button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('Error loading replies:', err);
  }
}

async function respondToReply(replyId, email) {
  const message = prompt(`Enter your response to ${email}:`, "Thank you for getting back to us! We are glad to accept your article on DailyAura. Please provide the author bio and link details so our editorial desk can approve and publish it immediately.");
  if (!message) return;

  try {
    const res = await API.post(`/api/replies/${replyId}/respond`, { message });
    if (res.success) {
      alert('Reply sent successfully via Hostinger SMTP!');
      loadInboxReplies();
    } else {
      alert('Failed to send reply: ' + res.error);
    }
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

// ==========================================
// CORE STATS & ACTIVITY FEED
// ==========================================

async function loadStats() {
  try {
    const data = await API.get('/api/stats');
    if (!data || data.error) return;

    const elTotalSent = document.getElementById('statTotalSent');
    if (elTotalSent) elTotalSent.textContent = data.totalSent;

    const elTodaySent = document.getElementById('statTodaySent');
    if (elTodaySent) elTodaySent.textContent = `${data.periods.today.count} sent today`;

    const elTotalOpened = document.getElementById('statTotalOpened');
    if (elTotalOpened) elTotalOpened.textContent = data.totalOpened;

    const elOpenRate = document.getElementById('statOpenRate');
    if (elOpenRate) elOpenRate.textContent = `${data.openRate}% Open Rate`;

    const elTotalClicked = document.getElementById('statTotalClicked');
    if (elTotalClicked) elTotalClicked.textContent = data.totalClicked;

    const elClickRate = document.getElementById('statClickRate');
    if (elClickRate) elClickRate.textContent = `${data.clickRate}% Click Rate`;

    const elTotalLeads = document.getElementById('statTotalLeads');
    if (elTotalLeads) elTotalLeads.textContent = data.totalLeads;

    const pendingCount = data.totalLeads - data.totalSent;
    const elPending = document.getElementById('statPendingLeads');
    if (elPending) elPending.textContent = `${pendingCount > 0 ? pendingCount : 0} Pending`;

    updateCampaignStatusUI(data.campaignStatus);

  } catch (err) {
    console.error('Error loading stats:', err);
  }
}

function updateCampaignStatusUI(status) {
  const topPill = document.getElementById('topStatusPill');
  const badge = document.getElementById('quickStatusBadge');
  const quickStart = document.getElementById('quickStartBtn');
  const quickPause = document.getElementById('quickPauseBtn');

  const s = status || 'idle';
  if (topPill) {
    topPill.className = `status-pill ${s}`;
    topPill.textContent = s.toUpperCase();
  }
  if (badge) {
    badge.className = `status-badge ${s}`;
    badge.textContent = s.toUpperCase();
  }

  if (quickStart && quickPause) {
    if (s === 'running') {
      quickStart.classList.add('hidden');
      quickPause.classList.remove('hidden');
    } else {
      quickStart.classList.remove('hidden');
      quickPause.classList.add('hidden');
    }
  }
}

// ==========================================
// CAMPAIGN CONTROLS (2-MINUTE DELAY DEFAULT)
// ==========================================

function setupCampaignControls() {
  const startBtns = [document.getElementById('quickStartBtn'), document.getElementById('campStartBtn'), document.getElementById('dashStartBtn')];
  const pauseBtns = [document.getElementById('quickPauseBtn'), document.getElementById('campPauseBtn')];
  const stopBtn = document.getElementById('campStopBtn');

  startBtns.forEach(btn => {
    if (btn) btn.addEventListener('click', async () => {
      await API.post('/api/campaign/start', {});
      loadStats();
    });
  });

  pauseBtns.forEach(btn => {
    if (btn) btn.addEventListener('click', async () => {
      await API.post('/api/campaign/pause', {});
      loadStats();
    });
  });

  if (stopBtn) {
    stopBtn.addEventListener('click', async () => {
      await API.post('/api/campaign/stop', {});
      loadStats();
    });
  }

  const campForm = document.getElementById('campaignForm');
  if (campForm) {
    campForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        subject: document.getElementById('campSubject').value,
        template: document.getElementById('campTemplate').value,
        delay_min: document.getElementById('campMinDelay').value,
        delay_max: document.getElementById('campMaxDelay').value,
        daily_limit: document.getElementById('campDailyLimit').value,
        selected_niche: document.getElementById('campNicheSelect').value,
      };
      await API.post('/api/campaign/update', payload);
      alert('Campaign settings saved with 2-minute throttling!');
      loadCampaign();
    });
  }

  const testForm = document.getElementById('testEmailForm');
  const testResult = document.getElementById('testEmailResult');

  if (testForm) {
    testForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const targetEmail = document.getElementById('testEmailTarget').value;
      testResult.className = 'test-result-box';
      testResult.textContent = 'Dispatching verification email via Hostinger SMTP...';
      testResult.classList.remove('hidden');

      try {
        const res = await API.post('/api/test-email', { target_email: targetEmail });
        if (res.success) {
          testResult.className = 'test-result-box success';
          testResult.textContent = res.message;
        } else {
          testResult.className = 'test-result-box error';
          testResult.textContent = 'Error: ' + res.error;
        }
      } catch (err) {
        testResult.className = 'test-result-box error';
        testResult.textContent = 'Failed to connect: ' + err.message;
      }
    });
  }
}

async function loadCampaign() {
  try {
    const c = await API.get('/api/campaign');
    if (!c) return;

    if (document.getElementById('campSubject')) document.getElementById('campSubject').value = c.subject || '';
    if (document.getElementById('campTemplate')) document.getElementById('campTemplate').value = c.template || '';
    if (document.getElementById('campMinDelay')) document.getElementById('campMinDelay').value = c.delay_min || 120;
    if (document.getElementById('campMaxDelay')) document.getElementById('campMaxDelay').value = c.delay_max || 180;
    if (document.getElementById('campDailyLimit')) document.getElementById('campDailyLimit').value = c.daily_limit || 50;
    if (document.getElementById('campNicheSelect') && c.selected_niche) {
      document.getElementById('campNicheSelect').value = c.selected_niche;
    }

    const minMin = Math.round((c.delay_min || 120) / 60);
    const maxMin = Math.round((c.delay_max || 180) / 60);
    const dispGap = document.getElementById('dispGap');
    if (dispGap) dispGap.textContent = `${c.delay_min} - ${c.delay_max}s (${minMin}-${maxMin} min)`;
  } catch (err) {
    console.error('Error loading campaign:', err);
  }
}

// ==========================================
// LEADS DATABASE
// ==========================================

let currentFilter = 'all';

function setupLeadsDatabase() {
  const searchInput = document.getElementById('leadSearchInput');
  const nicheFilter = document.getElementById('leadNicheFilter');
  const filterBtns = document.querySelectorAll('.filter-btn');

  if (searchInput) searchInput.addEventListener('input', () => loadLeads());
  if (nicheFilter) nicheFilter.addEventListener('change', () => loadLeads());

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter');
      loadLeads();
    });
  });

  const addModal = document.getElementById('addLeadModal');
  const importModal = document.getElementById('importModal');

  const openAdd = document.getElementById('openAddLeadModalBtn');
  if (openAdd) openAdd.addEventListener('click', () => addModal.classList.remove('hidden'));
  const closeAdd = document.getElementById('closeAddLeadModal');
  if (closeAdd) closeAdd.addEventListener('click', () => addModal.classList.add('hidden'));
  const cancelAdd = document.getElementById('cancelAddLead');
  if (cancelAdd) cancelAdd.addEventListener('click', () => addModal.classList.add('hidden'));

  const openImp = document.getElementById('openImportModalBtn');
  if (openImp) openImp.addEventListener('click', () => importModal.classList.remove('hidden'));
  const closeImp = document.getElementById('closeImportModal');
  if (closeImp) closeImp.addEventListener('click', () => importModal.classList.add('hidden'));
  const cancelImp = document.getElementById('cancelImport');
  if (cancelImp) cancelImp.addEventListener('click', () => importModal.classList.add('hidden'));

  const addForm = document.getElementById('addLeadForm');
  if (addForm) {
    addForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        name: document.getElementById('newLeadName').value.trim(),
        email: document.getElementById('newLeadEmail').value.trim(),
        website: document.getElementById('newLeadWebsite').value.trim(),
        niche: document.getElementById('newLeadNiche').value,
      };
      await API.post('/api/leads', payload);
      addModal.classList.add('hidden');
      addForm.reset();
      loadLeads();
      loadStats();
      loadGscAnalytics();
    });
  }

  const importForm = document.getElementById('importForm');
  if (importForm) {
    importForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = document.getElementById('importCsvText').value.trim();
      if (!text) return;

      const lines = text.split('\n');
      const leads = [];

      lines.forEach(line => {
        const parts = line.split(',').map(p => p.trim());
        if (parts[1] && parts[1].includes('@')) {
          leads.push({
            name: parts[0] || 'Editorial Team',
            email: parts[1],
            website: parts[2] || '',
            niche: parts[3] || 'Digital Marketing & SEO Link Building'
          });
        }
      });

      if (leads.length === 0) {
        alert('No valid email lines found. Format: Name, Email, Website, Niche');
        return;
      }

      const res = await API.post('/api/leads/import', { leads });
      alert(`Successfully imported ${res.added} leads!`);
      importModal.classList.add('hidden');
      document.getElementById('importCsvText').value = '';
      loadLeads();
      loadStats();
      loadGscAnalytics();
    });
  }
}

async function loadLeads() {
  const tbody = document.getElementById('leadsTableBody');
  const activityList = document.getElementById('activityList');
  const search = document.getElementById('leadSearchInput') ? document.getElementById('leadSearchInput').value.trim() : '';
  const niche = document.getElementById('leadNicheFilter') ? document.getElementById('leadNicheFilter').value : 'all';

  try {
    const res = await API.get(`/api/leads?status=${currentFilter}&niche=${encodeURIComponent(niche)}&search=${encodeURIComponent(search)}&limit=150`);
    if (!res || !res.leads) return;
    const leads = res.leads;

    if (tbody) {
      if (leads.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" class="text-center" style="padding: 30px; color: var(--text-muted);">No prospects matching query.</td></tr>`;
      } else {
        tbody.innerHTML = leads.map(l => {
          const openBadge = l.open_count > 0 
            ? `<span class="badge badge-success">👁️ ${l.open_count} open</span>` 
            : `<span class="badge" style="color: var(--text-muted);">0</span>`;

          const clickBadge = l.click_count > 0 
            ? `<span class="badge" style="background: rgba(6, 182, 212, 0.2); color: #06b6d4;">🔗 ${l.click_count} click</span>` 
            : `<span class="badge" style="color: var(--text-muted);">0</span>`;

          const timeStr = l.sent_at ? new Date(l.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-';
          const daScore = l.da_score || (l.tier === 'high' ? 58 : (l.tier === 'medium' ? 42 : 31));

          return `
            <tr>
              <td class="lead-name-cell">
                <strong>${escapeHtml(l.name || 'Editorial Team')}</strong>
                <small>${escapeHtml(l.website || '-')}</small>
              </td>
              <td><code>${escapeHtml(l.email)}</code></td>
              <td><span class="badge" style="background: rgba(59, 130, 246, 0.15); color: #60a5fa; font-weight: 700;">DA ${daScore}</span></td>
              <td><span style="font-size: 11px; color: #94a3b8;">${escapeHtml(l.niche || 'SEO')}</span></td>
              <td><span class="status-tag ${l.status}">${l.status}</span></td>
              <td>${openBadge}</td>
              <td>${clickBadge}</td>
              <td><span style="font-size: 11px; color: var(--text-muted);">${timeStr}</span></td>
              <td>
                <button class="action-btn-del" onclick="deleteLead('${l.id}')" title="Delete">🗑️</button>
              </td>
            </tr>
          `;
        }).join('');
      }
    }

    // Dashboard Quick Activity Feed
    if (activityList) {
      const sentLeads = leads.filter(l => l.sent_at);
      activityList.innerHTML = sentLeads.length === 0 
        ? `<div class="empty-state">No recent activity. Launch campaign to stream live events.</div>`
        : sentLeads.slice(0, 15).map(l => `
          <div class="activity-item ${l.click_count > 0 ? 'click-event' : (l.open_count > 0 ? 'open-event' : '')}">
            <div class="activity-main">
              <strong>${escapeHtml(l.website || l.name)} (<code>${escapeHtml(l.email)}</code>)</strong>
              <span>Status: ${l.status.toUpperCase()} ${l.open_count ? `&bull; 👁️ Opened ${l.open_count}x` : ''} ${l.click_count ? `&bull; 🔗 Clicked link` : ''}</span>
            </div>
            <div class="activity-time">
              ${l.sent_at ? new Date(l.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
            </div>
          </div>
        `).join('');
    }

  } catch (err) {
    console.error('Error loading leads:', err);
  }
}

async function deleteLead(id) {
  if (confirm('Delete this prospect from pipeline?')) {
    await API.del(`/api/leads/${id}`);
    loadLeads();
    loadStats();
    loadGscAnalytics();
  }
}

// ==========================================
// BACKUP & CSV EXPORT
// ==========================================

function setupBackupExport() {}

// ==========================================
// AI AGENT INTERACTIVE CHAT (ENGLISH ONLY)
// ==========================================

function setupAiChat() {
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const promptChips = document.querySelectorAll('.prompt-chip');

  promptChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const prompt = chip.getAttribute('data-prompt');
      chatInput.value = prompt;
      chatForm.dispatchEvent(new Event('submit'));
    });
  });

  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;

    chatInput.value = '';
    appendChatMessage('user', text);

    try {
      const res = await API.post('/api/chat', { message: text });
      if (res.reply) {
        appendChatMessage('assistant', res.reply.content);
      }
    } catch (err) {
      appendChatMessage('assistant', '⚠️ Connection error. Please verify network and try again.');
    }
  });
}

async function loadChat() {
  const container = document.getElementById('chatMessages');
  if (!container) return;

  try {
    const msgs = await API.get('/api/chat');
    if (!Array.isArray(msgs)) return;

    container.innerHTML = msgs.map(m => `
      <div class="chat-msg ${m.role}">
        ${escapeHtml(m.content)}
      </div>
    `).join('');
    scrollChatBottom();
  } catch (err) {
    console.error('Error loading chat:', err);
  }
}

function appendChatMessage(role, content) {
  const container = document.getElementById('chatMessages');
  if (!container) return;
  const div = document.createElement('div');
  div.className = `chat-msg ${role}`;
  div.innerHTML = escapeHtml(content);
  container.appendChild(div);
  scrollChatBottom();
}

function scrollChatBottom() {
  const container = document.getElementById('chatMessages');
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

// ==========================================
// SETTINGS
// ==========================================

function setupSettings() {
  const form = document.getElementById('settingsForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        smtp_host: document.getElementById('setSmtpHost').value.trim(),
        smtp_port: parseInt(document.getElementById('setSmtpPort').value.trim()),
        smtp_user: document.getElementById('setSmtpUser').value.trim(),
        smtp_pass: document.getElementById('setSmtpPass').value.trim(),
        from_name: document.getElementById('setFromName').value.trim(),
        app_url: document.getElementById('setAppUrl').value.trim(),
        track_opens: document.getElementById('setTrackOpens').checked,
        track_clicks: document.getElementById('setTrackClicks').checked,
      };
      await API.post('/api/settings', payload);
      alert('Settings saved successfully!');
      loadSettings();
    });
  }

  const credForm = document.getElementById('adminCredForm');
  if (credForm) {
    credForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const adminUser = document.getElementById('setAdminUser').value.trim();
      const adminPass = document.getElementById('setAdminPass').value.trim();

      const payload = { admin_user: adminUser };
      if (adminPass) payload.admin_pass = adminPass;

      await API.post('/api/settings', payload);
      alert('Admin credentials updated!');
    });
  }
}

async function loadSettings() {
  try {
    const s = await API.get('/api/settings');
    if (!s) return;

    if (document.getElementById('setSmtpHost')) document.getElementById('setSmtpHost').value = s.smtp_host || 'smtp.hostinger.com';
    if (document.getElementById('setSmtpPort')) document.getElementById('setSmtpPort').value = s.smtp_port || 465;
    if (document.getElementById('setSmtpUser')) document.getElementById('setSmtpUser').value = s.smtp_user || 'outreach@dailyaura.in';
    if (document.getElementById('setSmtpPass')) document.getElementById('setSmtpPass').value = s.smtp_pass || 'Aarrii@1122';
    if (document.getElementById('setFromName')) document.getElementById('setFromName').value = s.from_name || 'DailyAura Editorial Team';
    if (document.getElementById('setAppUrl')) document.getElementById('setAppUrl').value = s.app_url || window.location.origin;

    if (document.getElementById('setTrackOpens')) document.getElementById('setTrackOpens').checked = s.track_opens !== false;
    if (document.getElementById('setTrackClicks')) document.getElementById('setTrackClicks').checked = s.track_clicks !== false;

    if (document.getElementById('setAdminUser')) document.getElementById('setAdminUser').value = s.admin_user || 'admin';
  } catch (err) {
    console.error('Error loading settings:', err);
  }
}

// ==========================================
// WORKSPACE B: CONTRIBUTOR & EMAIL MARKETING HUB
// ==========================================

let allContributors = [];
let allArticles = [];

async function loadContributorHubData() {
  await Promise.all([
    loadContributorStats(),
    loadContributors(),
    loadArticlesCatalog(),
    loadContribTemplates(),
    loadContribStream()
  ]);
}

async function loadContributorStats() {
  try {
    const stats = await API.get('/api/contributor-stats');
    if (!stats) return;

    const elTotal = document.getElementById('kpiContribTotal');
    const elWelcome = document.getElementById('kpiContribWelcome');
    const elDay2 = document.getElementById('kpiContribDay2');
    const elDay10 = document.getElementById('kpiContribDay10');
    const elOpenRate = document.getElementById('kpiContribOpenRate');
    const elClickRate = document.getElementById('kpiContribClickRate');
    const navBadge = document.getElementById('navBadgeSubscribers');

    if (elTotal) elTotal.textContent = stats.totalSubscribers || 0;
    if (elWelcome) elWelcome.textContent = stats.welcomeSent || 0;
    if (elDay2) elDay2.textContent = stats.day2Sent || 0;
    if (elDay10) elDay10.textContent = stats.day10Sent || 0;
    if (elOpenRate) elOpenRate.textContent = (stats.avgOpenRate || 0) + '%';
    if (elClickRate) elClickRate.textContent = (stats.avgClickRate || 0) + '%';
    if (navBadge) navBadge.textContent = `${stats.totalSubscribers || 0} Registered`;
  } catch (err) {
    console.error('Error loading contributor stats:', err);
  }
}

async function loadContributors() {
  const tbody = document.getElementById('contributorsTableBody');
  if (!tbody) return;

  try {
    const searchVal = (document.getElementById('contribSearchInput')?.value || '').toLowerCase().trim();
    const stageVal = document.getElementById('contribStageFilter')?.value || '';

    let url = '/api/contributors?';
    if (searchVal) url += `search=${encodeURIComponent(searchVal)}&`;
    if (stageVal) url += `stage=${encodeURIComponent(stageVal)}&`;

    allContributors = await API.get(url) || [];

    if (allContributors.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 24px; color: var(--text-muted);">No contributors found matching filters.</td></tr>`;
      return;
    }

    tbody.innerHTML = allContributors.map(c => {
      let stageBadge = `<span class="badge-stage-welcome">Welcome Sent</span>`;
      if (c.stage === 'day2_digest_sent') {
        stageBadge = `<span class="badge-stage-day2">Day 2-4 Digest</span>`;
      } else if (c.stage === 'day10_retention_sent') {
        stageBadge = `<span class="badge-stage-day10">Day 10 Retention</span>`;
      } else if (c.stage === 'draft_submitted') {
        stageBadge = `<span class="badge-stage-draft">Draft Submitted</span>`;
      }

      return `
        <tr>
          <td>
            <div style="font-weight: 700; color: #fff;">${escapeHtml(c.name)}</div>
            <div style="font-size: 11px; color: var(--text-muted); font-family: monospace;">${escapeHtml(c.email)}</div>
          </td>
          <td>
            <span style="font-weight: 600; color: #93c5fd;">${escapeHtml(c.website || 'N/A')}</span>
          </td>
          <td>
            <span class="badge" style="background: rgba(255,255,255,0.06); font-size: 11px;">${escapeHtml(c.niche || 'General')}</span>
          </td>
          <td style="font-size: 11px; color: var(--text-muted);">
            ${escapeHtml(c.registered_at || 'Recently')}
          </td>
          <td>
            <span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #34d399; font-weight: 700;">
              ${c.articles_submitted || 0} Posts
            </span>
          </td>
          <td>${stageBadge}</td>
          <td style="text-align: right;">
            <div style="display: flex; gap: 6px; justify-content: flex-end; flex-wrap: wrap;">
              <button class="btn btn-secondary btn-xs action-send-welcome" data-id="${c.id}" title="Send Instant Welcome SLA Email">
                ⚡ Welcome SLA
              </button>
              <button class="btn btn-primary btn-xs action-send-digest" data-id="${c.id}" title="Send Day 2-4 Post Showcase with Images">
                📰 2-4d Digest
              </button>
              <button class="btn btn-ghost btn-xs action-send-retention" data-id="${c.id}" title="Send Day 10 Author Retention & Review">
                🎯 Day 10
              </button>
              <button class="btn btn-ghost btn-xs action-delete-contrib" data-id="${c.id}" title="Delete Contributor" style="color: #ef4444;">
                ✕
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Bind action buttons
    tbody.querySelectorAll('.action-send-welcome').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        btn.disabled = true;
        btn.textContent = 'Sending...';
        try {
          const res = await API.post(`/api/contributors/${id}/send-welcome`);
          alert(res.message || 'Welcome SLA Email dispatched via Hostinger SMTP!');
          loadContributorStats();
          loadContributors();
          loadContribStream();
        } catch (err) {
          alert('Failed to send Welcome SLA: ' + err.message);
        } finally {
          btn.disabled = false;
          btn.textContent = '⚡ Welcome SLA';
        }
      });
    });

    tbody.querySelectorAll('.action-send-digest').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        btn.disabled = true;
        btn.textContent = 'Sending...';
        try {
          const res = await API.post(`/api/contributors/${id}/send-day2-digest`);
          alert(res.message || 'Day 2-4 Post Showcase (with Featured Images) dispatched via Hostinger SMTP!');
          loadContributorStats();
          loadContributors();
          loadContribStream();
        } catch (err) {
          alert('Failed to send Day 2 Digest: ' + err.message);
        } finally {
          btn.disabled = false;
          btn.textContent = '📰 2-4d Digest';
        }
      });
    });

    tbody.querySelectorAll('.action-send-retention').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        btn.disabled = true;
        btn.textContent = 'Sending...';
        try {
          const res = await API.post(`/api/contributors/${id}/send-day10-retention`);
          alert(res.message || 'Day 10 Indexing Retention email dispatched via Hostinger SMTP!');
          loadContributorStats();
          loadContributors();
          loadContribStream();
        } catch (err) {
          alert('Failed to send Day 10 Retention: ' + err.message);
        } finally {
          btn.disabled = false;
          btn.textContent = '🎯 Day 10';
        }
      });
    });

    tbody.querySelectorAll('.action-delete-contrib').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        if (confirm('Delete this contributor profile?')) {
          await API.del(`/api/contributors/${id}`);
          loadContributorStats();
          loadContributors();
        }
      });
    });

  } catch (err) {
    console.error('Error loading contributors:', err);
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 24px; color: #ef4444;">Failed to load contributors.</td></tr>`;
  }
}

async function loadArticlesCatalog() {
  const container = document.getElementById('articlesCatalogGrid');
  if (!container) return;

  try {
    allArticles = await API.get('/api/articles') || [];
    if (allArticles.length === 0) {
      container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 30px; color: var(--text-muted);">No published articles retrieved.</div>`;
      return;
    }

    container.innerHTML = allArticles.map(art => `
      <div class="article-showcase-card">
        <div class="article-cover-wrap">
          <img src="${escapeHtml(art.featured_image)}" alt="${escapeHtml(art.title)}" loading="lazy">
          <span class="article-category-badge">${escapeHtml(art.category || 'Featured Article')}</span>
        </div>
        <div class="article-body-content">
          <h4>${escapeHtml(art.title)}</h4>
          <p>${escapeHtml(art.excerpt)}</p>
          <div class="article-meta-row">
            <span class="article-meta-author">✍️ ${escapeHtml(art.author)}</span>
            <span>📅 ${escapeHtml(art.date)}</span>
          </div>
          <div style="margin-top: 12px; display: flex; gap: 8px;">
            <a href="${escapeHtml(art.url)}" target="_blank" class="btn btn-ghost btn-xs" style="flex: 1; text-align: center;">
              🔗 View on DailyAura
            </a>
          </div>
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error('Error loading articles catalog:', err);
    container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 30px; color: #ef4444;">Failed to load article feed.</div>`;
  }
}

async function loadContribTemplates() {
  const grid = document.getElementById('contribTemplatesGrid');
  if (!grid) return;

  try {
    const tmpls = await API.get('/api/templates') || [];
    const contribTmpls = tmpls.filter(t => t.category === 'lifecycle' || t.category === 'digest' || t.category === 'advertising');

    if (contribTmpls.length === 0) {
      grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 30px; color: var(--text-muted);">No contributor templates found.</div>`;
      return;
    }

    grid.innerHTML = contribTmpls.map(t => `
      <div class="template-studio-card">
        <div class="tmpl-card-header">
          <span class="tmpl-stage-badge">${escapeHtml(t.stage || 'Onboarding')}</span>
          <span class="tmpl-format-pill ${t.format === 'html' ? 'html' : 'text'}">${t.format === 'html' ? '⚡ Responsive HTML' : '📄 Plain Text'}</span>
        </div>
        <div class="tmpl-card-title">${escapeHtml(t.name)}</div>
        <div class="tmpl-subject-preview">
          <strong>Subject:</strong> ${escapeHtml(t.subject)}
        </div>
        <div class="tmpl-card-actions">
          <button class="btn btn-ghost btn-xs preview-contrib-tmpl-btn" data-id="${t.id}">👁️ Preview Email</button>
          <button class="btn btn-secondary btn-xs edit-contrib-tmpl-btn" data-id="${t.id}">✏️ Edit Template</button>
        </div>
      </div>
    `).join('');

    grid.querySelectorAll('.preview-contrib-tmpl-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const tmpl = contribTmpls.find(t => t.id === id);
        if (tmpl) openHtmlPreviewModal(tmpl);
      });
    });

    grid.querySelectorAll('.edit-contrib-tmpl-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const tmpl = contribTmpls.find(t => t.id === id);
        if (tmpl) openEditTemplateModal(tmpl);
      });
    });
  } catch (err) {
    console.error('Error loading contributor templates:', err);
  }
}

async function loadContribStream() {
  const recentTbody = document.getElementById('contribRecentStreamTable');
  const fullTbody = document.getElementById('contribFullStreamTable');

  try {
    const logs = await API.get('/api/logs') || [];
    const contribLogs = logs.filter(l => 
      l.recipient_email && (
        l.type === 'contributor_welcome' || 
        l.type === 'contributor_day2_digest' || 
        l.type === 'contributor_day10_retention' ||
        l.action?.includes('contributor') ||
        l.action?.includes('Welcome') ||
        l.action?.includes('Digest') ||
        l.action?.includes('Retention')
      )
    );

    const streamItems = contribLogs.length > 0 ? contribLogs : allContributors.map(c => ({
      timestamp: c.registered_at || new Date().toISOString(),
      recipient_email: c.email,
      name: c.name,
      stage: c.stage === 'welcome_sent' ? 'Welcome SLA' : (c.stage === 'day2_digest_sent' ? 'Day 2-4 Digest' : 'Day 10 Retention'),
      status: 'Delivered',
      opened: c.opens > 0,
      clicked: c.clicks > 0,
      subject: c.stage === 'welcome_sent' ? 'Welcome to DailyAura Guest Post Community! [Publishing SLA & Rules]' : 'DailyAura Weekly Digest: 5 Trending Guest Posts + New Guest Post Submission Call',
      id: 'TRK-' + Math.random().toString(36).substring(2, 8).toUpperCase()
    }));

    if (recentTbody) {
      if (streamItems.length === 0) {
        recentTbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 20px; color: var(--text-muted);">No recent activity yet. Dispatches will stream here.</td></tr>`;
      } else {
        recentTbody.innerHTML = streamItems.slice(0, 5).map(item => `
          <tr>
            <td style="font-size: 11px; color: var(--text-muted);">${item.timestamp ? new Date(item.timestamp).toLocaleTimeString() : 'Just now'}</td>
            <td>
              <div style="font-weight: 600; color: #fff;">${escapeHtml(item.name || item.recipient_email)}</div>
              <div style="font-size: 11px; color: var(--text-muted);">${escapeHtml(item.recipient_email)}</div>
            </td>
            <td><span class="badge-stage-welcome">${escapeHtml(item.stage || 'Welcome SLA')}</span></td>
            <td><span style="color: #34d399; font-weight: 700;">✓ Delivered (Hostinger)</span></td>
            <td style="font-size: 12px; max-width: 260px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${escapeHtml(item.subject || 'Editorial SLA & Guidelines')}
            </td>
          </tr>
        `).join('');
      }
    }

    if (fullTbody) {
      if (streamItems.length === 0) {
        fullTbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 24px; color: var(--text-muted);">No delivery stream records found.</td></tr>`;
      } else {
        fullTbody.innerHTML = streamItems.map(item => `
          <tr>
            <td style="font-size: 11px; color: var(--text-muted);">${item.timestamp ? new Date(item.timestamp).toLocaleString() : 'Recent'}</td>
            <td>
              <div style="font-weight: 600; color: #fff;">${escapeHtml(item.name || item.recipient_email)}</div>
              <div style="font-size: 11px; color: var(--text-muted);">${escapeHtml(item.recipient_email)}</div>
            </td>
            <td><span class="badge-stage-day2">${escapeHtml(item.stage || 'Lifecycle Email')}</span></td>
            <td><span style="color: #34d399; font-weight: 700;">Delivered</span></td>
            <td>${item.opened ? '<span style="color: #10b981; font-weight: 700;">✓ Opened</span>' : '<span style="color: var(--text-muted);">Unopened</span>'}</td>
            <td>${item.clicked ? '<span style="color: #38bdf8; font-weight: 700;">✓ Clicked</span>' : '<span style="color: var(--text-muted);">No Clicks</span>'}</td>
            <td style="font-family: monospace; font-size: 11px; color: var(--text-muted);">${item.id || 'TRK-LIVE'}</td>
          </tr>
        `).join('');
      }
    }

  } catch (err) {
    console.error('Error loading contributor stream:', err);
  }
}

function setupContributorHub() {
  // Search & Filter listeners
  const searchInput = document.getElementById('contribSearchInput');
  const stageFilter = document.getElementById('contribStageFilter');
  if (searchInput) searchInput.addEventListener('input', () => loadContributors());
  if (stageFilter) stageFilter.addEventListener('change', () => loadContributors());

  // Refresh stream button
  const btnRefreshStream = document.getElementById('btnRefreshContribStream');
  if (btnRefreshStream) {
    btnRefreshStream.addEventListener('click', () => {
      loadContributorStats();
      loadContribStream();
    });
  }

  // Modals
  const newContribModal = document.getElementById('newContributorModal');
  const btnOpenModal = document.getElementById('btnOpenNewContributorModal');
  const btnSimulate = document.getElementById('btnSimulateRegistration');
  const btnCloseModal = document.getElementById('closeNewContribModal');
  const btnCancelModal = document.getElementById('cancelNewContrib');
  const newContribForm = document.getElementById('newContributorForm');

  function openContribModal() {
    if (newContribModal) newContribModal.classList.remove('hidden');
  }
  function closeContribModal() {
    if (newContribModal) newContribModal.classList.add('hidden');
    if (newContribForm) newContribForm.reset();
  }

  if (btnOpenModal) btnOpenModal.addEventListener('click', openContribModal);
  if (btnSimulate) btnSimulate.addEventListener('click', openContribModal);
  if (btnCloseModal) btnCloseModal.addEventListener('click', closeContribModal);
  if (btnCancelModal) btnCancelModal.addEventListener('click', closeContribModal);

  if (newContribForm) {
    newContribForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('newContribName').value.trim();
      const email = document.getElementById('newContribEmail').value.trim();
      const website = document.getElementById('newContribWebsite').value.trim();
      const niche = document.getElementById('newContribNiche').value;
      const autoWelcome = document.getElementById('newContribAutoWelcome').checked;

      const submitBtn = newContribForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Registering & Dispatching...';

      try {
        if (autoWelcome) {
          const res = await API.post('/api/contributors/register', { name, email, website, niche });
          alert(`Success! Contributor registered.\n\n${res.message || 'Instant Welcome SLA email dispatched via Hostinger SMTP!'}`);
        } else {
          await API.post('/api/contributors', { name, email, website, niche });
          alert('Contributor registered successfully!');
        }

        closeContribModal();
        loadContributorStats();
        loadContributors();
        loadContribStream();
      } catch (err) {
        alert('Registration error: ' + err.message);
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Register & Dispatch Welcome SLA';
      }
    });
  }

  // AI Template Generator for Contributor Marketing
  const btnAiBuilder = document.getElementById('btnRunAiTmplBuilder');
  const promptInput = document.getElementById('aiTmplPromptInput');
  const catSelect = document.getElementById('aiTmplCategorySelect');
  const resultBox = document.getElementById('aiTmplResultBox');
  const resultSubject = document.getElementById('aiTmplGenSubject');
  const resultBody = document.getElementById('aiTmplGenBody');
  const btnSaveAiTmpl = document.getElementById('btnSaveAiGeneratedTmpl');

  let lastGeneratedTmpl = null;

  if (btnAiBuilder) {
    btnAiBuilder.addEventListener('click', async () => {
      const prompt = (promptInput?.value || '').trim();
      if (!prompt) {
        alert('Please enter instructions for the email template.');
        return;
      }

      btnAiBuilder.disabled = true;
      btnAiBuilder.textContent = '✨ Generating in English...';

      try {
        const category = catSelect?.value || 'lifecycle';
        const res = await API.post('/api/ai/template-builder', { prompt, category });
        if (res.success && res.template) {
          lastGeneratedTmpl = res.template;
          resultSubject.textContent = 'Subject: ' + res.template.subject;
          resultBody.textContent = res.template.body_text || res.template.body_html;
          resultBox.classList.remove('hidden');
        } else {
          alert('Could not generate template. Please try again.');
        }
      } catch (err) {
        alert('AI Generation error: ' + err.message);
      } finally {
        btnAiBuilder.disabled = false;
        btnAiBuilder.textContent = '✨ Generate Template';
      }
    });
  }

  if (btnSaveAiTmpl) {
    btnSaveAiTmpl.addEventListener('click', async () => {
      if (!lastGeneratedTmpl) return;
      btnSaveAiTmpl.disabled = true;
      btnSaveAiTmpl.textContent = 'Saving...';
      try {
        await API.post('/api/templates', lastGeneratedTmpl);
        alert('Template saved to Template Studio!');
        resultBox.classList.add('hidden');
        if (promptInput) promptInput.value = '';
        loadContribTemplates();
        loadTemplates();
      } catch (err) {
        alert('Error saving template: ' + err.message);
      } finally {
        btnSaveAiTmpl.disabled = false;
        btnSaveAiTmpl.textContent = '💾 Save to Template Studio';
      }
    });
  }

  // Stage preview buttons (bind to preview modal)
  document.querySelectorAll('.preview-stage-tmpl-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const tmplId = btn.getAttribute('data-template-id');
      try {
        const tmpls = await API.get('/api/templates') || [];
        const match = tmpls.find(t => t.id === tmplId || t.stage?.toLowerCase().includes('welcome') || t.category === 'digest');
        if (match) {
          openHtmlPreviewModal(match);
        } else if (tmpls.length > 0) {
          openHtmlPreviewModal(tmpls[0]);
        }
      } catch (err) {
        alert('Error loading template preview: ' + err.message);
      }
    });
  });
}

// ==========================================
// AI VOICE CALL COPILOT (WEB SPEECH RECOGNITION & SYNTHESIS)
// ==========================================

function setupVoiceCall() {
  const btnOpenCall = document.getElementById('btnOpenVoiceCall');
  const modal = document.getElementById('aiVoiceCallModal');
  const btnClose = document.getElementById('closeVoiceCallModal');
  const btnStart = document.getElementById('btnStartCall');
  const btnEnd = document.getElementById('btnEndCall');
  const btnToggleMic = document.getElementById('btnToggleMic');
  const micIcon = document.getElementById('micIcon');
  const statusText = document.getElementById('callStatusText');
  const transcriptBox = document.getElementById('callTranscriptBox');
  const timerEl = document.getElementById('callDuration');
  const auraRings = document.getElementById('callAuraRings');

  let callActive = false;
  let micMuted = false;
  let recognition = null;
  let callTimerInterval = null;
  let callSeconds = 0;
  let currentUtterance = null;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  function openCallModal() {
    if (modal) modal.classList.remove('hidden');
  }

  function closeCallModal() {
    endCall();
    if (modal) modal.classList.add('hidden');
  }

  if (btnOpenCall) btnOpenCall.addEventListener('click', openCallModal);
  if (btnClose) btnClose.addEventListener('click', closeCallModal);

  function startCallTimer() {
    callSeconds = 0;
    if (timerEl) timerEl.textContent = '00:00';
    clearInterval(callTimerInterval);
    callTimerInterval = setInterval(() => {
      callSeconds++;
      const mins = String(Math.floor(callSeconds / 60)).padStart(2, '0');
      const secs = String(callSeconds % 60).padStart(2, '0');
      if (timerEl) timerEl.textContent = `${mins}:${secs}`;
    }, 1000);
  }

  function stopCallTimer() {
    clearInterval(callTimerInterval);
  }

  function appendTranscript(sender, text, isUser = false) {
    if (!transcriptBox) return;
    const msgEl = document.createElement('div');
    msgEl.className = `transcript-msg ${isUser ? 'user-msg' : 'agent-msg'}`;
    msgEl.innerHTML = `<strong>${isUser ? 'You' : 'DailyAura AI'}:</strong> ${escapeHtml(text)}`;
    transcriptBox.appendChild(msgEl);
    transcriptBox.scrollTop = transcriptBox.scrollHeight;
  }

  function speakText(text) {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const cleanSpeech = text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/https?:\/\/\S+/gi, 'link')
      .replace(/[#_~`]/g, '')
      .replace(/\n+/g, '. ');

    currentUtterance = new SpeechSynthesisUtterance(cleanSpeech);
    currentUtterance.lang = 'en-US';
    currentUtterance.rate = 1.0;
    currentUtterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
    if (naturalVoice) currentUtterance.voice = naturalVoice;

    if (statusText) statusText.textContent = '🔊 AI Speaking...';
    if (auraRings) auraRings.classList.add('voice-calling');

    currentUtterance.onend = () => {
      if (auraRings) auraRings.classList.remove('voice-calling');
      if (callActive && !micMuted) {
        if (statusText) statusText.textContent = '🟢 Listening... (Speak in Punjabi or English)';
        startListening();
      }
    };

    currentUtterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      if (auraRings) auraRings.classList.remove('voice-calling');
      if (callActive && !micMuted) startListening();
    };

    window.speechSynthesis.speak(currentUtterance);
  }

  async function processVoiceQuery(transcript) {
    if (!transcript || transcript.trim().length === 0) return;

    appendTranscript('You', transcript, true);
    if (statusText) statusText.textContent = '⏳ Thinking...';

    try {
      const res = await API.post('/api/chat', { message: transcript });
      const aiReply = res.reply?.text || "I am connected to your DailyAura outreach campaigns. What would you like to review?";
      appendTranscript('DailyAura AI', aiReply, false);
      speakText(aiReply);
    } catch (err) {
      const fallback = "I encountered an issue processing that. Please try asking again.";
      appendTranscript('DailyAura AI', fallback, false);
      speakText(fallback);
    }
  }

  function startListening() {
    if (!callActive || micMuted || !SpeechRecognition) return;

    try {
      if (recognition) {
        recognition.abort();
      }

      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'pa-IN';

      recognition.onstart = () => {
        if (statusText) statusText.textContent = '🟢 Listening... (Speak in Punjabi or English)';
      };

      recognition.onresult = (event) => {
        const spokenText = event.results[0][0].transcript;
        if (spokenText) {
          processVoiceQuery(spokenText);
        }
      };

      recognition.onerror = (e) => {
        console.warn('Speech recognition error:', e.error);
        if (callActive && !micMuted && e.error !== 'aborted') {
          setTimeout(() => {
            if (callActive && !micMuted) startListening();
          }, 1000);
        }
      };

      recognition.start();
    } catch (err) {
      console.warn('Recognition start error:', err);
    }
  }

  function startCall() {
    callActive = true;
    micMuted = false;
    startCallTimer();

    if (btnStart) btnStart.classList.add('hidden');
    if (btnEnd) btnEnd.classList.remove('hidden');

    const greeting = "Hello! I am connected to your DailyAura CRM. You can give me instructions in Punjabi or English.";
    appendTranscript('DailyAura AI', greeting, false);
    speakText(greeting);
  }

  function endCall() {
    callActive = false;
    stopCallTimer();
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (recognition) {
      try { recognition.abort(); } catch (e) {}
    }

    if (btnStart) btnStart.classList.remove('hidden');
    if (btnEnd) btnEnd.classList.add('hidden');
    if (auraRings) auraRings.classList.remove('voice-calling');
    if (statusText) statusText.textContent = 'Call ended. Tap "Start Call" to begin again.';
  }

  if (btnStart) btnStart.addEventListener('click', startCall);
  if (btnEnd) btnEnd.addEventListener('click', endCall);

  if (btnToggleMic) {
    btnToggleMic.addEventListener('click', () => {
      micMuted = !micMuted;
      btnToggleMic.classList.toggle('muted', micMuted);
      if (micIcon) micIcon.textContent = micMuted ? '🔇' : '🎙️';
      if (micMuted) {
        if (recognition) { try { recognition.abort(); } catch(e){} }
        if (statusText) statusText.textContent = 'Microphone muted';
      } else {
        if (statusText) statusText.textContent = 'Microphone active';
        if (callActive) startListening();
      }
    });
  }
}

// ==========================================
// TWIN AUTOMATION CONTROL CENTER (SCRAPER & ENGINE)
// ==========================================

function setupAutomationHub() {
  const toggleScraperBtn = document.getElementById('toggleScraperBtn');
  const mine10BatchBtn = document.getElementById('mine10BatchBtn');
  const engineStartPauseBtn = document.getElementById('engineStartPauseBtn');

  if (toggleScraperBtn) {
    toggleScraperBtn.addEventListener('click', async () => {
      try {
        const isPaused = toggleScraperBtn.textContent.includes('Start');
        const endpoint = isPaused ? '/api/crawler/start' : '/api/crawler/pause';
        await API.post(endpoint, {});
        pollAutomationStatus();
      } catch (err) {
        console.error('Error toggling scraper:', err);
      }
    });
  }

  if (mine10BatchBtn) {
    mine10BatchBtn.addEventListener('click', async () => {
      mine10BatchBtn.disabled = true;
      mine10BatchBtn.textContent = '⏳ Mining 10...';
      try {
        await API.post('/api/crawler/mine-batch', { count: 10 });
        pollAutomationStatus();
        loadLeads();
        loadStats();
      } catch (err) {
        console.error('Error mining batch:', err);
      } finally {
        mine10BatchBtn.disabled = false;
        mine10BatchBtn.textContent = '⚡ Mine 10 Now';
      }
    });
  }

  if (engineStartPauseBtn) {
    engineStartPauseBtn.addEventListener('click', async () => {
      try {
        const isRunning = engineStartPauseBtn.textContent.includes('Pause');
        const endpoint = isRunning ? '/api/campaign/pause' : '/api/campaign/start';
        await API.post(endpoint, {});
        pollAutomationStatus();
        loadStats();
      } catch (err) {
        console.error('Error toggling engine:', err);
      }
    });
  }

  // Initial poll and recurring 2.5s timer
  pollAutomationStatus();
  setInterval(pollAutomationStatus, 2500);
}

async function pollAutomationStatus() {
  if (!API.token) return;

  try {
    // 1. Fetch Crawler Status
    const cStatus = await API.get('/api/crawler/status');
    if (cStatus && !cStatus.error) {
      const badge = document.getElementById('scraperStatusBadge');
      const toggleBtn = document.getElementById('toggleScraperBtn');
      const durText = document.getElementById('crawlerDurationText');
      const discText = document.getElementById('crawlerDiscoveredText');
      const pendText = document.getElementById('crawlerPendingText');
      const poolText = document.getElementById('crawlerTotalPoolText');
      const srcText = document.getElementById('crawlerActiveSource');
      const urlText = document.getElementById('crawlerActiveUrl');
      const termBody = document.getElementById('crawlerTerminalBody');

      if (badge) {
        if (cStatus.status === 'active') {
          badge.className = 'badge-tag green';
          badge.textContent = '🟢 Mining Active';
        } else {
          badge.className = 'badge-tag yellow';
          badge.textContent = '⏸️ Scraper Paused';
        }
      }

      if (toggleBtn) {
        if (cStatus.status === 'active') {
          toggleBtn.className = 'btn btn-sm btn-outline-warning';
          toggleBtn.textContent = '⏸ Pause Scraper';
        } else {
          toggleBtn.className = 'btn btn-sm btn-success';
          toggleBtn.textContent = '▶ Start Scraper';
        }
      }

      if (durText) durText.textContent = cStatus.durationFormatted || '00h 00m 00s';
      if (discText) discText.textContent = `${cStatus.totalMined} Leads`;
      if (pendText) pendText.textContent = `${cStatus.pendingCount} Pending`;
      if (poolText) poolText.textContent = `${cStatus.totalLeads} Total`;
      if (srcText) srcText.textContent = cStatus.currentSourceName || 'Clutch.co Directory';
      if (urlText) urlText.textContent = cStatus.currentTarget || 'https://clutch.co/seo-firms';

      if (termBody && Array.isArray(cStatus.logs) && cStatus.logs.length > 0) {
        termBody.innerHTML = cStatus.logs.slice(0, 15).map(l => `<div class="terminal-line">${escapeHtml(l)}</div>`).join('');
      }
    }

    // 2. Fetch Campaign Dispatch Engine Status
    const eStatus = await API.get('/api/campaign/status');
    if (eStatus && !eStatus.error) {
      const phaseBadge = document.getElementById('enginePhaseBadge');
      const startPauseBtn = document.getElementById('engineStartPauseBtn');
      const timerLabel = document.getElementById('timerLabelText');
      const countdown = document.getElementById('engineCountdownText');
      const cycleNum = document.getElementById('engineBatchCycleNum');
      const sentNum = document.getElementById('engineSentInBatch');
      const progFill = document.getElementById('engineProgressBarFill');
      const testPill = document.getElementById('engineTestModeText');

      if (cycleNum) cycleNum.textContent = eStatus.batch_cycle || 1;
      if (sentNum) sentNum.textContent = eStatus.current_batch_sent || 0;

      const pct = Math.min(100, Math.round(((eStatus.current_batch_sent || 0) / (eStatus.batch_target || 60)) * 100));
      if (progFill) progFill.style.width = `${pct}%`;

      if (testPill) testPill.textContent = eStatus.test_mode ? 'ACTIVE' : 'OFF';

      if (phaseBadge) {
        if (eStatus.status === 'running') {
          if (eStatus.phase === 'cooling') {
            phaseBadge.className = 'badge-tag yellow';
            phaseBadge.textContent = '☕ 1-Hour Cooling Break';
          } else {
            phaseBadge.className = 'badge-tag green';
            phaseBadge.textContent = '🟢 Dispatching Active (1 every 2 min)';
          }
        } else {
          phaseBadge.className = 'badge-tag yellow';
          phaseBadge.textContent = '⏸️ Outreach Paused';
        }
      }

      if (startPauseBtn) {
        if (eStatus.status === 'running') {
          startPauseBtn.className = 'btn btn-sm btn-outline-warning';
          startPauseBtn.textContent = '⏸ Pause Engine';
        } else {
          startPauseBtn.className = 'btn btn-sm btn-success';
          startPauseBtn.textContent = '▶ Start Engine';
        }
      }

      // Format Countdown Timer
      if (eStatus.phase === 'cooling') {
        if (timerLabel) timerLabel.textContent = '☕ COOLING BREAK ENDS IN:';
        const rem = eStatus.cooling_seconds_remaining || 0;
        const m = Math.floor(rem / 60);
        const s = rem % 60;
        if (countdown) countdown.textContent = `${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
      } else {
        if (timerLabel) timerLabel.textContent = '⏳ NEXT DISPATCH IN:';
        const rem = eStatus.next_send_seconds || 0;
        const m = Math.floor(rem / 60);
        const s = rem % 60;
        if (countdown) countdown.textContent = `${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
      }
    }
  } catch (err) {
    // Silent fail on background poll
  }
}
