/**
 * StreetClean | Ibalong Festival 2026 (Legazpi City)
 * Commissions & Task Dashboard View Component (White & Green Theme)
 * Fully Working Cards & Interactive Map View with Zone Shortcuts & Real-Time Filtering.
 */

window.CommissionsView = {
  activeFilter: 'all',
  activeView: 'grid', // 'grid' or 'map'

  render() {
    const user = window.appState.getUser();
    const commissions = window.appState.getCommissions(this.activeFilter);
    const openCount = window.appState.getCommissions('open').length;
    const activeCount = window.appState.getCommissions('in_progress').length;
    const reviewCount = window.appState.getCommissions('in_review').length;

    return `
      <div class="commissions-view animate-fade-in" style="padding: 1rem 0 2.5rem 0;">
        <div class="app-container" style="max-width: 900px;">

          <!-- Cleaner Top Earnings & Status Bar -->
          <div class="card card-gold-glow" style="padding: 1rem 1.25rem; margin-bottom: 1.25rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; background: #ffffff; border: 1px solid #bbf7d0;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 40px; height: 40px; border-radius: var(--radius-full); background: #dcfce7; color: var(--emerald-700); display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
                <i class="fa-solid fa-broom"></i>
              </div>
              <div>
                <div style="font-size: 0.72rem; color: var(--emerald-800); text-transform: uppercase; font-weight: 800;">Active Cleanup Hub</div>
                <div style="font-size: 0.95rem; font-weight: 800; color: #0f172a;">${user.name} • <span style="color: #b45309;">${user.barangay.split(',')[0]}</span></div>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 14px;">
              <div>
                <div style="font-size: 0.68rem; color: #64748b; font-weight: 600;">Available Balance</div>
                <div class="font-mono" style="font-size: 1.15rem; font-weight: 800; color: #b45309;">₱${user.phpBalance.toFixed(2)}</div>
              </div>
              <div style="border-left: 1px solid #e2e8f0; padding-left: 14px;">
                <div style="font-size: 0.68rem; color: #64748b; font-weight: 600;">Locked Escrow</div>
                <div class="font-mono" style="font-size: 1.15rem; font-weight: 800; color: #0284c7;">₱${user.escrowLockedPhp.toFixed(2)}</div>
              </div>
            </div>
          </div>

          <!-- Controls Header: Filter Tabs & View Switcher (Cards vs Map) -->
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; margin-bottom: 1.25rem;">
            
            <!-- Filter Pills -->
            <div class="chip-group" style="overflow-x: auto; max-width: 100%; padding-bottom: 4px;">
              <button class="chip-select-btn ${this.activeFilter === 'all' ? 'active' : ''}" onclick="window.CommissionsView.setFilter('all')">
                All (${window.appState.commissions.length})
              </button>
              <button class="chip-select-btn ${this.activeFilter === 'open' ? 'active' : ''}" onclick="window.CommissionsView.setFilter('open')">
                🟡 Open Bounties (${openCount})
              </button>
              <button class="chip-select-btn ${this.activeFilter === 'in_progress' ? 'active' : ''}" onclick="window.CommissionsView.setFilter('in_progress')">
                🔵 Claimed (${activeCount})
              </button>
              <button class="chip-select-btn ${this.activeFilter === 'in_review' ? 'active' : ''}" onclick="window.CommissionsView.setFilter('in_review')">
                🟠 In Review (${reviewCount})
              </button>
              <button class="chip-select-btn ${this.activeFilter === 'completed' ? 'active' : ''}" onclick="window.CommissionsView.setFilter('completed')">
                🟢 Verified
              </button>
            </div>

            <!-- Working Grid vs Map Toggle Switcher -->
            <div style="display: inline-flex; background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: var(--radius-full); padding: 3px; gap: 3px;">
              <button class="btn btn-sm ${this.activeView === 'grid' ? 'btn-primary' : 'btn-secondary'}" style="padding: 5px 14px; border-radius: var(--radius-full); border: none;" onclick="window.CommissionsView.setView('grid')">
                <i class="fa-solid fa-table-cells"></i> Cards
              </button>
              <button class="btn btn-sm ${this.activeView === 'map' ? 'btn-primary' : 'btn-secondary'}" style="padding: 5px 14px; border-radius: var(--radius-full); border: none;" onclick="window.CommissionsView.setView('map')">
                <i class="fa-solid fa-map-location-dot"></i> Map
              </button>
            </div>

          </div>

          <!-- Main Content Area (Grid or Map) -->
          ${this.activeView === 'map' ? this.renderMapView(commissions) : this.renderGridView(commissions)}

        </div>
      </div>
    `;
  },

  renderGridView(commissions) {
    if (!commissions.length) {
      return `
        <div class="card" style="text-align: center; padding: 3rem 1.5rem; background: #ffffff;">
          <div style="font-size: 2.5rem; color: var(--emerald-600); margin-bottom: 0.5rem;"><i class="fa-solid fa-broom-ball"></i></div>
          <h3 style="font-size: 1.1rem; margin-bottom: 6px; color: #0f172a;">No Cleanups In This Category</h3>
          <p style="font-size: 0.8rem; color: #64748b; max-width: 320px; margin: 0 auto 1.25rem auto;">
            All hotspots here have been cleared, or none have been submitted yet.
          </p>
          <a href="#/report" class="btn btn-primary btn-sm"><i class="fa-solid fa-camera"></i> Report New Hotspot</a>
        </div>
      `;
    }

    return `
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px;">
        ${commissions.map(c => this.renderCard(c)).join('')}
      </div>
    `;
  },

  renderCard(c) {
    return `
      <div class="card task-card" style="background: #ffffff;" onclick="window.openTaskModal('${c.id}')">
        <div class="task-card-header">
          <div>
            <span class="status-badge status-${c.status}"><span class="badge-dot"></span> ${c.status.replace('_', ' ')}</span>
            <span class="severity-pill ${c.severity}" style="margin-left: 4px;">${c.severity}</span>
          </div>
          <div class="task-card-bounty">
            ₱${c.rewardPhp.toFixed(0)}
          </div>
        </div>

        <div class="task-card-img-wrap">
          <img src="${c.imageBefore}" class="task-card-img" alt="${c.title}" />
          <div class="task-card-img-badge">
            <i class="fa-solid fa-location-dot" style="color: var(--emerald-400);"></i>
            <span>${c.distanceKm}</span>
          </div>
        </div>

        <div>
          <h3 style="font-size: 0.96rem; font-weight: 800; margin-bottom: 4px; line-height: 1.35; color: #0f172a;">
            ${c.title}
          </h3>
          <p style="font-size: 0.76rem; color: #64748b; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
            ${c.description}
          </p>
        </div>

        <div class="task-card-meta">
          <div>
            <i class="fa-solid fa-weight-hanging" style="color: var(--emerald-600);"></i> ~${c.estimatedWeightKg} kg • <i class="fa-solid fa-coins" style="color: var(--gold-600);"></i> +${c.cleanPoints} pts
          </div>
          <div style="font-weight: 700; color: #b45309;">
            ${c.deadline}
          </div>
        </div>
      </div>
    `;
  },

  renderMapView(commissions) {
    // Schedule Map initialization on DOM attach
    setTimeout(() => {
      if (window.MapEngine) {
        window.MapEngine.initCommissionsMap('commissions-map-canvas', commissions);
      }
    }, 100);

    return `
      <div class="card" style="padding: 1rem; background: #ffffff; border-radius: var(--radius-xl); border: 1px solid #bbf7d0; box-shadow: var(--shadow-md);">
        
        <!-- Zone Quick Jump Bar -->
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9;">
          <div style="display: flex; align-items: center; gap: 6px; font-size: 0.75rem; font-weight: 800; color: #0f172a;">
            <i class="fa-solid fa-location-crosshairs" style="color: var(--emerald-600);"></i> Festival Zones:
          </div>
          
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            <button class="btn btn-secondary btn-sm" style="padding: 4px 8px; font-size: 0.72rem;" onclick="window.CommissionsView.panTo(13.1398, 123.7345)">
              🏛️ Peñaranda Park
            </button>
            <button class="btn btn-secondary btn-sm" style="padding: 4px 8px; font-size: 0.72rem;" onclick="window.CommissionsView.panTo(13.1285, 123.7530)">
              🌊 Boulevard
            </button>
            <button class="btn btn-secondary btn-sm" style="padding: 4px 8px; font-size: 0.72rem;" onclick="window.CommissionsView.panTo(13.1465, 123.7410)">
              🏟️ Astrodome
            </button>
            <button class="btn btn-secondary btn-sm" style="padding: 4px 8px; font-size: 0.72rem;" onclick="window.CommissionsView.panTo(13.1430, 123.7555)">
              🚢 Embarcadero
            </button>
            <button class="btn btn-secondary btn-sm" style="padding: 4px 8px; font-size: 0.72rem;" onclick="window.CommissionsView.panTo(13.1320, 123.7510)">
              🌋 Sawangan
            </button>
            <button class="btn btn-primary btn-sm" style="padding: 4px 8px; font-size: 0.72rem;" onclick="window.CommissionsView.locateMe()">
              <i class="fa-solid fa-crosshairs"></i> Locate Me
            </button>
          </div>
        </div>

        <!-- Interactive Map Container -->
        <div style="position: relative; width: 100%; height: 520px; border-radius: var(--radius-lg); overflow: hidden; border: 1px solid #cbd5e1;">
          <div id="commissions-map-canvas" style="width: 100%; height: 100%; z-index: 1;"></div>
          
          <!-- Floating Status Legend Overlay -->
          <div style="position: absolute; bottom: 12px; left: 12px; z-index: 400; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(8px); padding: 8px 12px; border-radius: var(--radius-md); border: 1px solid #e2e8f0; font-size: 0.7rem; display: flex; flex-direction: column; gap: 4px; box-shadow: 0 4px 14px rgba(0,0,0,0.1);">
            <div style="font-weight: 800; color: #0f172a; margin-bottom: 2px;">Map Pins (${commissions.length})</div>
            <div style="display: flex; align-items: center; gap: 6px;"><span style="width: 8px; height: 8px; border-radius: 50%; background: #f59e0b;"></span> ₱ Open Hotspot (Claimable)</div>
            <div style="display: flex; align-items: center; gap: 6px;"><span style="width: 8px; height: 8px; border-radius: 50%; background: #0284c7;"></span> ₱ Claimed / In Progress</div>
            <div style="display: flex; align-items: center; gap: 6px;"><span style="width: 8px; height: 8px; border-radius: 50%; background: #059669;"></span> ✓ Cleaned & Verified</div>
          </div>
        </div>

      </div>
    `;
  },

  panTo(lat, lng) {
    if (window.MapEngine) {
      window.MapEngine.panToZone('commissions-map-canvas', lat, lng, 16);
    }
  },

  locateMe() {
    if (window.MapEngine) {
      window.MapEngine.locateUser('commissions-map-canvas');
      window.showToast('GPS Locked to your location in Legazpi City', 'success');
    }
  },

  setFilter(filter) {
    this.activeFilter = filter;
    window.renderRoute();
  },

  setView(view) {
    this.activeView = view;
    window.renderRoute();
  }
};
