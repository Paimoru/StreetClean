/**
 * StreetClean | Ibalong Festival 2026 (Legazpi City)
 * Main Application Orchestrator & Client-Side SPA Router (White & Green Theme)
 * Enforces Strict Role-Based Permissions (Cleaner, Resident, Verifier) & Dynamic Workspaces.
 */

// Central Route Mapper with Role-Based Route Guards
window.renderRoute = () => {
  const hash = window.location.hash || '#/';
  const appRoot = document.getElementById('app-root');
  if (!appRoot) return;

  const user = window.appState.getUser();

  // Cleanup prior maps/charts
  if (window.MapEngine) window.MapEngine.destroy();

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Update Header & Nav state tailored to active role
  window.updateNavState(hash);
  window.updateHeaderUserChip();

  // Route Dispatcher with RBAC Guards
  if (hash === '#/' || hash === '' || hash === '#/home') {
    appRoot.innerHTML = window.HomeView.render();
  } else if (hash.startsWith('#/commissions') || hash.startsWith('#/tasks')) {
    appRoot.innerHTML = window.CommissionsView.render();
  } else if (hash.startsWith('#/report')) {
    appRoot.innerHTML = window.ReportView.render();
    setTimeout(() => {
      if (window.ReportView.currentStep === 1 && window.MapEngine) {
        window.MapEngine.initReportLocationPicker('report-location-map', (lat, lng) => {
          window.ReportView.formData.lat = lat;
          window.ReportView.formData.lng = lng;
          const el = document.getElementById('report-coords');
          if (el) el.value = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        });
      }
    }, 100);
  } else if (hash.startsWith('#/verify')) {
    // RBAC Route Guard: Only Verifier can access Verification Hub
    if (user.role !== 'verifier') {
      appRoot.innerHTML = window.renderVerifierAccessDenied(user);
    } else {
      appRoot.innerHTML = window.VerifyView.render();
    }
  } else if (hash.startsWith('#/wallet')) {
    appRoot.innerHTML = window.WalletView.render();
  } else if (hash.startsWith('#/dashboard') || hash.startsWith('#/impact')) {
    appRoot.innerHTML = window.DashboardView.render();
    setTimeout(() => {
      if (window.DashboardView.initCharts) window.DashboardView.initCharts();
    }, 100);
  } else if (hash.startsWith('#/profile')) {
    appRoot.innerHTML = window.ProfileView.render();
  } else if (hash.startsWith('#/auth') || hash.startsWith('#/login') || hash.startsWith('#/register')) {
    appRoot.innerHTML = window.AuthView.render();
  } else {
    appRoot.innerHTML = window.HomeView.render();
  }
};

// Access Denied Screen when Cleaner/Resident tries to access Verifier Hub
window.renderVerifierAccessDenied = (user) => {
  return `
    <div class="animate-fade-in" style="padding: 2.5rem 1rem;">
      <div class="card card-gold-glow" style="max-width: 480px; margin: 0 auto; padding: 2rem 1.5rem; text-align: center; background: #ffffff; border: 1px solid #fed7aa;">
        <div style="width: 54px; height: 54px; border-radius: 50%; background: #fef3c7; color: #b45309; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin: 0 auto 1rem auto;">
          <i class="fa-solid fa-lock"></i>
        </div>
        <div style="font-size: 0.72rem; font-weight: 800; color: #b45309; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">
          LGU Marshall Authorization Required
        </div>
        <h2 style="font-size: 1.25rem; font-weight: 800; color: #0f172a; margin-bottom: 8px;">
          Verification Hub Access Restricted
        </h2>
        <p style="font-size: 0.82rem; color: #64748b; line-height: 1.5; margin-bottom: 1.5rem;">
          You are currently signed in as <strong>${user.name}</strong> (<span style="text-transform: uppercase; font-weight: 700; color: var(--emerald-700);">${user.role}</span>). Proof audits and escrow releases can only be authorized by official LGU Sanitation Marshalls.
        </p>

        <div style="display: flex; flex-direction: column; gap: 8px;">
          <button class="btn btn-gold btn-block" onclick="window.loginAsRoleDirect('verifier')">
            <i class="fa-solid fa-shield-halved"></i> Log In as Verifier (Engr. Carlo Villanueva)
          </button>
          <a href="#/commissions" class="btn btn-secondary btn-block">
            <i class="fa-solid fa-arrow-left"></i> Return to Tasks
          </a>
        </div>
      </div>
    </div>
  `;
};

// 1-Click Role Login Direct Action
window.loginAsRoleDirect = (role) => {
  let userId = 'usr_cleaner_01';
  if (role === 'resident') userId = 'usr_resident_01';
  if (role === 'verifier') userId = 'usr_verifier_01';

  window.switchUser(userId);
  window.soundSystem.fanfare();
  window.showToast(`Signed in as ${role.toUpperCase()}!`, 'success');

  if (role === 'cleaner') window.location.hash = '#/commissions';
  else if (role === 'resident') window.location.hash = '#/report';
  else if (role === 'verifier') window.location.hash = '#/verify';
};

// Update Dynamic Desktop & Mobile Navigation based on Active Role
window.updateNavState = (currentHash) => {
  const user = window.appState.getUser();
  const pendingVerifyCount = window.appState.getCommissions('in_review').length;

  // 1. Update Desktop Navigation Links tailored for role
  const desktopNav = document.getElementById('desktop-nav');
  if (desktopNav) {
    if (user.role === 'cleaner') {
      desktopNav.innerHTML = `
        <li><a href="#/" class="desktop-nav-link ${currentHash === '#/' ? 'active' : ''}"><i class="fa-solid fa-house"></i> Home</a></li>
        <li><a href="#/commissions" class="desktop-nav-link ${currentHash.startsWith('#/commissions') ? 'active' : ''}"><i class="fa-solid fa-list-check"></i> Tasks & Bounties</a></li>
        <li><a href="#/wallet" class="desktop-nav-link ${currentHash.startsWith('#/wallet') ? 'active' : ''}"><i class="fa-solid fa-vault"></i> My Wallet</a></li>
        <li><a href="#/profile" class="desktop-nav-link ${currentHash.startsWith('#/profile') ? 'active' : ''}"><i class="fa-solid fa-id-badge"></i> Eco-Rank</a></li>
        <li><a href="#/dashboard" class="desktop-nav-link ${currentHash.startsWith('#/dashboard') ? 'active' : ''}"><i class="fa-solid fa-chart-line"></i> Analytics</a></li>
      `;
    } else if (user.role === 'resident') {
      desktopNav.innerHTML = `
        <li><a href="#/" class="desktop-nav-link ${currentHash === '#/' ? 'active' : ''}"><i class="fa-solid fa-house"></i> Home</a></li>
        <li><a href="#/report" class="desktop-nav-link ${currentHash.startsWith('#/report') ? 'active' : ''}"><i class="fa-solid fa-camera"></i> Report Litter</a></li>
        <li><a href="#/commissions" class="desktop-nav-link ${currentHash.startsWith('#/commissions') ? 'active' : ''}"><i class="fa-solid fa-map-location-dot"></i> Cleanup Map</a></li>
        <li><a href="#/wallet" class="desktop-nav-link ${currentHash.startsWith('#/wallet') ? 'active' : ''}"><i class="fa-solid fa-hand-holding-dollar"></i> Civic Pledges</a></li>
        <li><a href="#/dashboard" class="desktop-nav-link ${currentHash.startsWith('#/dashboard') ? 'active' : ''}"><i class="fa-solid fa-chart-line"></i> Impact</a></li>
      `;
    } else if (user.role === 'verifier') {
      desktopNav.innerHTML = `
        <li><a href="#/" class="desktop-nav-link ${currentHash === '#/' ? 'active' : ''}"><i class="fa-solid fa-house"></i> Home</a></li>
        <li><a href="#/verify" class="desktop-nav-link ${currentHash.startsWith('#/verify') ? 'active' : ''}"><i class="fa-solid fa-shield-halved"></i> Verification Hub ${pendingVerifyCount > 0 ? `<span class="nav-badge-pill" style="position:static; margin-left:4px;">${pendingVerifyCount}</span>` : ''}</a></li>
        <li><a href="#/commissions" class="desktop-nav-link ${currentHash.startsWith('#/commissions') ? 'active' : ''}"><i class="fa-solid fa-list-check"></i> Inspect Hotspots</a></li>
        <li><a href="#/dashboard" class="desktop-nav-link ${currentHash.startsWith('#/dashboard') ? 'active' : ''}"><i class="fa-solid fa-chart-line"></i> ENRO Analytics</a></li>
        <li><a href="#/wallet" class="desktop-nav-link ${currentHash.startsWith('#/wallet') ? 'active' : ''}"><i class="fa-solid fa-vault"></i> Escrow Pool</a></li>
      `;
    }
  }

  // 2. Update Mobile Bottom Navigation Bar tailored for role
  const mobileNav = document.querySelector('.mobile-bottom-nav');
  if (mobileNav) {
    if (user.role === 'cleaner') {
      mobileNav.innerHTML = `
        <a href="#/" class="bottom-nav-item ${currentHash === '#/' ? 'active' : ''}" onclick="window.soundSystem.click()">
          <i class="fa-solid fa-house"></i>
          <span>Home</span>
        </a>
        <a href="#/commissions" class="bottom-nav-item ${currentHash.startsWith('#/commissions') ? 'active' : ''}" onclick="window.soundSystem.click()">
          <i class="fa-solid fa-list-check"></i>
          <span>Tasks</span>
        </a>
        <a href="#/commissions" class="bottom-nav-fab-wrap" onclick="window.soundSystem.click()">
          <div class="bottom-nav-fab" style="background: linear-gradient(135deg, #059669, #10b981);">
            <i class="fa-solid fa-broom"></i>
          </div>
        </a>
        <a href="#/wallet" class="bottom-nav-item ${currentHash.startsWith('#/wallet') ? 'active' : ''}" onclick="window.soundSystem.click()">
          <i class="fa-solid fa-vault"></i>
          <span>Wallet</span>
        </a>
        <a href="#/profile" class="bottom-nav-item ${currentHash.startsWith('#/profile') ? 'active' : ''}" onclick="window.soundSystem.click()">
          <i class="fa-solid fa-user"></i>
          <span>Profile</span>
        </a>
      `;
    } else if (user.role === 'resident') {
      mobileNav.innerHTML = `
        <a href="#/" class="bottom-nav-item ${currentHash === '#/' ? 'active' : ''}" onclick="window.soundSystem.click()">
          <i class="fa-solid fa-house"></i>
          <span>Home</span>
        </a>
        <a href="#/commissions" class="bottom-nav-item ${currentHash.startsWith('#/commissions') ? 'active' : ''}" onclick="window.soundSystem.click()">
          <i class="fa-solid fa-map-location-dot"></i>
          <span>Map</span>
        </a>
        <a href="#/report" class="bottom-nav-fab-wrap" onclick="window.soundSystem.click()">
          <div class="bottom-nav-fab" style="background: linear-gradient(135deg, #0284c7, #0ea5e9);">
            <i class="fa-solid fa-camera"></i>
          </div>
        </a>
        <a href="#/wallet" class="bottom-nav-item ${currentHash.startsWith('#/wallet') ? 'active' : ''}" onclick="window.soundSystem.click()">
          <i class="fa-solid fa-hand-holding-dollar"></i>
          <span>Pledges</span>
        </a>
        <a href="#/profile" class="bottom-nav-item ${currentHash.startsWith('#/profile') ? 'active' : ''}" onclick="window.soundSystem.click()">
          <i class="fa-solid fa-user"></i>
          <span>Profile</span>
        </a>
      `;
    } else if (user.role === 'verifier') {
      mobileNav.innerHTML = `
        <a href="#/" class="bottom-nav-item ${currentHash === '#/' ? 'active' : ''}" onclick="window.soundSystem.click()">
          <i class="fa-solid fa-house"></i>
          <span>Home</span>
        </a>
        <a href="#/commissions" class="bottom-nav-item ${currentHash.startsWith('#/commissions') ? 'active' : ''}" onclick="window.soundSystem.click()">
          <i class="fa-solid fa-list-check"></i>
          <span>Sites</span>
        </a>
        <a href="#/verify" class="bottom-nav-fab-wrap" onclick="window.soundSystem.click()">
          <div class="bottom-nav-fab" style="background: linear-gradient(135deg, #b45309, #f59e0b);">
            <i class="fa-solid fa-shield-halved"></i>
          </div>
        </a>
        <a href="#/verify" class="bottom-nav-item ${currentHash.startsWith('#/verify') ? 'active' : ''}" onclick="window.soundSystem.click()">
          <i class="fa-solid fa-clipboard-check"></i>
          <span>Verify</span>
          ${pendingVerifyCount > 0 ? `<span class="nav-badge-pill">${pendingVerifyCount}</span>` : ''}
        </a>
        <a href="#/dashboard" class="bottom-nav-item ${currentHash.startsWith('#/dashboard') ? 'active' : ''}" onclick="window.soundSystem.click()">
          <i class="fa-solid fa-chart-line"></i>
          <span>Impact</span>
        </a>
      `;
    }
  }
};

// Update header avatar chip with active user info & role badge
window.updateHeaderUserChip = () => {
  const user = window.appState.getUser();
  const chip = document.getElementById('header-user-chip');
  if (chip) {
    let roleIcon = 'fa-broom';
    let roleColor = 'var(--emerald-700)';

    if (user.role === 'resident') {
      roleIcon = 'fa-camera';
      roleColor = '#0284c7';
    } else if (user.role === 'verifier') {
      roleIcon = 'fa-shield-halved';
      roleColor = '#b45309';
    }

    chip.innerHTML = `
      <img src="${user.avatar}" class="user-quick-avatar" alt="${user.name}" style="border: 2px solid ${roleColor};" />
      <div style="text-align: left; line-height: 1.15;">
        <div class="user-quick-name">${user.name}</div>
        <div class="user-quick-role" style="color: ${roleColor}; display: flex; align-items: center; gap: 3px;">
          <i class="fa-solid ${roleIcon}"></i> ${user.role}
        </div>
      </div>
    `;
  }
};

// Modal Engine
window.openModal = (contentHtml) => {
  const backdrop = document.getElementById('global-modal-backdrop');
  if (backdrop) {
    backdrop.innerHTML = contentHtml;
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    window.soundSystem.modalOpen();
  }
};

window.closeModal = () => {
  const backdrop = document.getElementById('global-modal-backdrop');
  if (backdrop) {
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { backdrop.innerHTML = ''; }, 300);
  }
};

// Toast Engine
window.showToast = (message, type = 'success') => {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let icon = 'fa-circle-check';
  if (type === 'gold') icon = 'fa-award';
  if (type === 'error') icon = 'fa-triangle-exclamation';

  toast.innerHTML = `
    <i class="fa-solid ${icon}"></i>
    <div style="flex: 1;">${message}</div>
    <button onclick="this.parentElement.remove()" style="background:none;border:none;color:currentColor;cursor:pointer;opacity:0.6;"><i class="fa-solid fa-xmark"></i></button>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
};

// Switch User Account
window.switchUser = (userId) => {
  const success = window.appState.switchUser(userId);
  if (success) {
    window.soundSystem.success();
    const user = window.appState.getUser();
    window.renderRoute();
  }
};

// Toggle Mobile Frame Preview Simulation Mode
window.toggleMobileFrame = () => {
  document.body.classList.toggle('mode-mobile-frame');
  const isFrame = document.body.classList.contains('mode-mobile-frame');
  const btn = document.getElementById('device-toggle-btn');
  if (btn) {
    btn.innerHTML = isFrame ? '<i class="fa-solid fa-expand"></i>' : '<i class="fa-solid fa-mobile-screen"></i>';
    btn.title = isFrame ? 'Switch to Full-Screen Responsive View' : 'Switch to Mobile Frame Simulation View';
  }
  window.showToast(isFrame ? 'Mobile Device Frame Preview Enabled' : 'Full Responsive View Enabled', 'success');
};

// Open Commission Details & Role-Specific Actions Modal
window.openTaskModal = (id) => {
  window.openCommissionDetails(id);
};

window.openCommissionDetails = (id) => {
  const comm = window.appState.getCommissionById(id);
  if (!comm) return;

  const user = window.appState.getUser();

  let statusBadge = '<span class="status-badge status-open"><span class="badge-dot"></span> Open Bounty</span>';
  if (comm.status === 'in_progress') statusBadge = '<span class="status-badge status-in_progress"><span class="badge-dot"></span> In Progress</span>';
  if (comm.status === 'in_review') statusBadge = '<span class="status-badge status-in_review"><span class="badge-dot"></span> In Review by Verifier</span>';
  if (comm.status === 'completed') statusBadge = '<span class="status-badge status-completed"><span class="badge-dot"></span> Verified & Rewarded</span>';

  // Determine actions based on Role and Status
  let actionButtonsHtml = '';

  if (user.role === 'cleaner') {
    if (comm.status === 'open') {
      actionButtonsHtml = `
        <button class="btn btn-gold btn-block" onclick="window.claimTask('${comm.id}')">
          <i class="fa-solid fa-hand-holding-dollar"></i> Claim Task & Lock Bounty (₱${comm.rewardPhp.toFixed(0)})
        </button>
      `;
    } else if (comm.status === 'in_progress') {
      actionButtonsHtml = `
        <button class="btn btn-primary btn-block" onclick="window.openSubmitProofForm('${comm.id}')">
          <i class="fa-solid fa-upload"></i> Submit Before & After Proof of Work
        </button>
      `;
    } else if (comm.status === 'in_review') {
      actionButtonsHtml = `
        <div class="card" style="padding: 10px; background: #ffedd5; border: 1px solid #fed7aa; text-align: center; color: #c2410c; font-weight: 700; font-size: 0.82rem;">
          <i class="fa-solid fa-hourglass-half"></i> Under Inspection by Marshall. Escrow releases upon approval.
        </div>
      `;
    } else if (comm.status === 'completed') {
      actionButtonsHtml = `
        <div class="card" style="padding: 10px; background: #dcfce7; border: 1px solid #bbf7d0; text-align: center; color: #15803d; font-weight: 700; font-size: 0.82rem;">
          <i class="fa-solid fa-circle-check"></i> Clean Verified! ₱${comm.rewardPhp.toFixed(0)} Bounty Paid.
        </div>
      `;
    }
  } else if (user.role === 'resident') {
    // Resident actions: Pledge extra bounty or view progress
    actionButtonsHtml = `
      <div style="display: flex; gap: 8px;">
        <button class="btn btn-gold btn-block" onclick="window.pledgeExtraBounty('${comm.id}')">
          <i class="fa-solid fa-heart-circle-plus"></i> Pledge +₱100 Bounty
        </button>
        <a href="#/report" class="btn btn-secondary btn-block" onclick="window.closeModal()">
          <i class="fa-solid fa-camera"></i> Report New Spot
        </a>
      </div>
    `;
  } else if (user.role === 'verifier') {
    // Verifier actions: Inspect or authorize payout
    if (comm.status === 'in_review') {
      actionButtonsHtml = `
        <a href="#/verify" class="btn btn-gold btn-block" onclick="window.closeModal()">
          <i class="fa-solid fa-shield-halved"></i> Open Audit in Verification Hub
        </a>
      `;
    } else {
      actionButtonsHtml = `
        <div style="display: flex; gap: 8px;">
          <a href="#/verify" class="btn btn-secondary btn-block" onclick="window.closeModal()">
            <i class="fa-solid fa-clipboard-check"></i> Marshall Queue
          </a>
          <a href="#/dashboard" class="btn btn-primary btn-block" onclick="window.closeModal()">
            <i class="fa-solid fa-chart-line"></i> View City Stats
          </a>
        </div>
      `;
    }
  }

  const modalHtml = `
    <div class="modal-card">
      <button class="modal-close-btn" onclick="window.closeModal()"><i class="fa-solid fa-xmark"></i></button>

      <!-- Status & Category -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
        <div style="display: flex; align-items: center; gap: 6px;">
          ${statusBadge}
          <span class="severity-pill ${comm.severity}">${comm.severity}</span>
        </div>
        <span style="font-size: 0.75rem; color: #64748b; font-family: var(--font-mono); font-weight: 700;">${comm.id}</span>
      </div>

      <!-- Title & Location -->
      <h2 style="font-size: 1.2rem; font-weight: 800; line-height: 1.3; margin-bottom: 4px; color: #0f172a;">${comm.title}</h2>
      <div style="font-size: 0.8rem; color: #64748b; margin-bottom: 1rem;">
        <i class="fa-solid fa-location-dot" style="color: var(--emerald-600);"></i> ${comm.sector} • ${comm.address}
      </div>

      <!-- Bounty Hero -->
      <div style="display: flex; align-items: center; justify-content: space-between; background: #fef3c7; border: 1px solid #fde68a; padding: 12px 16px; border-radius: var(--radius-md); margin-bottom: 1.25rem;">
        <div>
          <div style="font-size: 0.72rem; color: #92400e; text-transform: uppercase; font-weight: 700;">Clean Bounty Reward</div>
          <div class="font-mono" style="font-size: 1.6rem; font-weight: 800; color: #b45309;">₱${comm.rewardPhp.toFixed(2)}</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 0.72rem; color: #92400e;">Est. Weight / Time</div>
          <div style="font-size: 0.95rem; font-weight: 800; color: #0f172a;">${comm.estimatedWeightKg} kg • ${comm.deadline}</div>
        </div>
      </div>

      <!-- Photo Display -->
      <div style="margin-bottom: 1.25rem;">
        <div style="font-size: 0.75rem; font-weight: 700; color: #0f172a; margin-bottom: 6px;">
          <i class="fa-solid fa-camera" style="color: var(--emerald-600);"></i> Site Evidence:
        </div>
        <img src="${comm.imageBefore}" alt="${comm.title}" style="width: 100%; height: 200px; object-fit: cover; border-radius: var(--radius-md); border: 1px solid #cbd5e1;" />
      </div>

      <!-- Description -->
      <div style="font-size: 0.82rem; color: #475569; line-height: 1.5; margin-bottom: 1.25rem; background: #f8fafc; padding: 12px; border-radius: var(--radius-md); border: 1px solid #e2e8f0;">
        ${comm.description}
      </div>

      <!-- Action Buttons -->
      ${actionButtonsHtml}

    </div>
  `;

  window.openModal(modalHtml);
};

// Pledge Extra Bounty (Resident Action)
window.pledgeExtraBounty = (commId) => {
  const comm = window.appState.getCommissionById(commId);
  const user = window.appState.getUser();
  if (!comm) return;

  if (user.phpBalance < 100) {
    window.showToast('Insufficient wallet balance. Please add funds in your Civic Wallet.', 'error');
    return;
  }

  user.phpBalance -= 100;
  comm.rewardPhp += 100;
  window.appState.save();
  window.soundSystem.fanfare();
  window.closeModal();
  window.showToast(`Pledged +₱100 bounty! Total reward is now ₱${comm.rewardPhp.toFixed(0)}.`, 'gold');
  window.renderRoute();
};

// Claim Task Action (Cleaner Action)
window.claimTask = (id) => {
  const success = window.appState.claimCommission(id);
  if (success) {
    window.soundSystem.success();
    window.closeModal();
    window.showToast('Task claimed! Head to the location and sweep the site.', 'success');
    window.renderRoute();
  }
};

// Open Submit Proof Form (Cleaner Flow)
window.openSubmitProofForm = (id) => {
  const comm = window.appState.getCommissionById(id);
  if (!comm) return;

  const modalHtml = `
    <div class="modal-card">
      <button class="modal-close-btn" onclick="window.closeModal()"><i class="fa-solid fa-xmark"></i></button>

      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 0.75rem;">
        <div class="brand-icon" style="width: 32px; height: 32px; font-size: 0.95rem;"><i class="fa-solid fa-upload"></i></div>
        <h3 style="font-size: 1.1rem; font-weight: 800; color: #0f172a;">Submit Proof of Cleanup</h3>
      </div>

      <p style="font-size: 0.82rem; color: #64748b; margin-bottom: 1.25rem;">
        Upload your 'After' photo showing the pristine site, and log the waste scale weight.
      </p>

      <div class="form-group">
        <label class="form-label">After-Cleanup Photo</label>
        <div class="upload-dropzone" onclick="window.showToast('After Photo snapshot attached!', 'success')">
          <div class="upload-icon"><i class="fa-solid fa-camera"></i></div>
          <div style="font-size: 0.85rem; font-weight: 700; color: #0f172a;">Tap to Snap Pristine Site Photo</div>
          <div style="font-size: 0.72rem; color: #64748b;">EXIF timestamp will be verified by LGU</div>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Recorded Waste Scale Weight (kg)</label>
        <input type="number" class="form-control font-mono" id="proof-weight" value="${comm.estimatedWeightKg}" />
      </div>

      <div class="form-group">
        <label class="form-label">Legazpi MRF Facility Dropoff Manifest</label>
        <input type="text" class="form-control font-mono" id="proof-manifest" value="LGU-MRF-2026-${Math.floor(100 + Math.random() * 900)}" />
      </div>

      <div class="form-group">
        <label class="form-label">Cleaner Notes / Segregation Summary</label>
        <textarea class="form-control" id="proof-notes" rows="2" placeholder="e.g. Cleared plastics and paper cups. Sorted for city recycling."></textarea>
      </div>

      <button class="btn btn-primary btn-block" onclick="window.submitProof('${comm.id}')">
        <i class="fa-solid fa-paper-plane"></i> Submit to LGU Marshall for Verification
      </button>
    </div>
  `;

  window.openModal(modalHtml);
};

// Submit Proof Action (Cleaner Flow)
window.submitProof = (id) => {
  const weight = parseFloat(document.getElementById('proof-weight')?.value || 15);
  const manifest = document.getElementById('proof-manifest')?.value || 'LGU-MRF-2026-088';
  const notes = document.getElementById('proof-notes')?.value || 'Cleanup completed.';

  const proofData = {
    weightRecordedKg: weight,
    facilityManifestId: manifest,
    cleanerNotes: notes,
    exifGpsMatch: 99.8,
    aiCleanlinessScore: 99.4,
    submittedAt: 'Just now'
  };

  const success = window.appState.submitProof(id, proofData);
  if (success) {
    window.soundSystem.fanfare();
    window.closeModal();
    window.showToast('Proof submitted to LGU Marshalls! ₱ Bounty escrow pending review.', 'gold');
    window.renderRoute();
  }
};

// Initial boot
window.addEventListener('DOMContentLoaded', () => {
  window.renderRoute();
  window.addEventListener('hashchange', window.renderRoute);
});
