/**
 * StreetClean | Ibalong Festival 2026 (Legazpi City)
 * Clean, Friendly & Streamlined Home View Component (White & Green Aesthetic)
 * Role selection directs to dedicated login/workspace for Cleaner, Resident, Verifier.
 */

window.HomeView = {
  render() {
    const user = window.appState.getUser();

    return `
      <div class="home-view animate-fade-in" style="padding: 1.25rem 0 2.5rem 0;">
        <div class="app-container" style="max-width: 720px;">
          
          <!-- Clean & Inspiring Festival Welcome Hero (White / Mint Glow) -->
          <div class="card card-gold-glow" style="
            background: linear-gradient(145deg, #ffffff 0%, #f0fdf4 100%);
            border-radius: var(--radius-xl);
            padding: 2.25rem 1.75rem;
            margin-bottom: 1.5rem;
            text-align: center;
            border: 1px solid #bbf7d0;
            box-shadow: 0 10px 30px -4px rgba(16, 185, 129, 0.12);
          ">
            
            <div style="max-width: 540px; margin: 0 auto;">
              
              <!-- Festival Badge -->
              <div style="display: inline-flex; align-items: center; gap: 6px; background: #fef3c7; border: 1px solid #fde68a; padding: 5px 14px; border-radius: var(--radius-full); margin-bottom: 1rem;">
                <i class="fa-solid fa-masks-theater" style="color: #b45309;"></i>
                <span style="font-size: 0.78rem; font-weight: 800; color: #92400e; text-transform: uppercase; letter-spacing: 0.05em;">Ibalong Festival 2026 • Legazpi City</span>
              </div>

              <!-- Main Heading -->
              <h1 style="font-size: clamp(1.75rem, 5vw, 2.35rem); font-weight: 800; line-height: 1.2; margin-bottom: 0.75rem; color: #0f172a;">
                Keep Legazpi Clean & <span class="gradient-text">Festive</span>
              </h1>
              
              <!-- Simple, Friendly Mission Statement -->
              <p style="color: #475569; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.75rem;">
                A community-led cleanup initiative for the 2026 Ibalong Festival. Report litter along parade routes, claim cleanup tasks in your area, and help keep our city pristine.
              </p>

              <!-- Two Primary Action Buttons -->
              <div style="display: flex; flex-wrap: wrap; gap: 12px; justify-content: center;">
                <a href="#/report" class="btn btn-gold btn-lg" style="min-width: 190px;" onclick="window.soundSystem.click()">
                  <i class="fa-solid fa-camera"></i> Report Litter
                </a>
                <a href="#/commissions" class="btn btn-primary btn-lg" style="min-width: 190px;" onclick="window.soundSystem.click()">
                  <i class="fa-solid fa-broom"></i> Find Cleanup Tasks
                </a>
              </div>

            </div>
          </div>

          <!-- Section: Create Account First / Log In by Role -->
          <div style="margin-bottom: 1.5rem;">
            <div style="text-align: center; margin-bottom: 1rem;">
              <div style="display: inline-flex; align-items: center; gap: 6px; background: #f0fdf4; border: 1px solid #bbf7d0; padding: 4px 12px; border-radius: var(--radius-full); margin-bottom: 6px;">
                <span style="font-size: 0.74rem; font-weight: 800; color: var(--emerald-800); text-transform: uppercase;">Step 1: Pick What Role & Create Account</span>
              </div>
              <h2 style="font-size: 1.18rem; font-weight: 800; color: #0f172a;">Join StreetClean by Role</h2>
              <p style="font-size: 0.82rem; color: #64748b;">Create your account first, choose your role, or log in to an existing profile.</p>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
              
              <!-- Cleaner Role Card -->
              <div class="card ${user.role === 'cleaner' ? 'card-gold-glow' : ''}" style="padding: 1.25rem 1rem; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: space-between; background: #ffffff; border: 2px solid ${user.role === 'cleaner' ? 'var(--emerald-500)' : '#e2e8f0'};">
                <div>
                  <div style="width: 48px; height: 48px; border-radius: var(--radius-full); background: #dcfce7; color: var(--emerald-600); display: flex; align-items: center; justify-content: center; font-size: 1.35rem; margin: 0 auto 0.75rem auto;">
                    <i class="fa-solid fa-broom"></i>
                  </div>
                  <h3 style="font-size: 1rem; margin-bottom: 4px; color: #0f172a;">🧹 Cleaner</h3>
                  <div style="font-size: 0.68rem; font-weight: 800; color: var(--emerald-700); text-transform: uppercase; margin-bottom: 6px;">Earn ₱ Cash Bounties</div>
                  <p style="font-size: 0.78rem; color: #64748b; line-height: 1.45; margin-bottom: 1rem;">
                    Pick up reported cleanup tasks, sweep streets, and earn instant ₱ GCash payouts.
                  </p>
                </div>
                <div style="width: 100%; display: flex; flex-direction: column; gap: 6px;">
                  <button class="btn btn-sm btn-primary" style="width: 100%; border-radius: var(--radius-full);" onclick="window.AuthView.openCreateAccountWithRole('cleaner')">
                    <i class="fa-solid fa-user-plus"></i> Create Cleaner Account
                  </button>
                  <button class="btn btn-sm btn-secondary" style="width: 100%; border-radius: var(--radius-full); font-size: 0.72rem;" onclick="window.loginAsRoleDirect('cleaner')">
                    ${user.role === 'cleaner' ? '<i class="fa-solid fa-check"></i> Logged In as Maria' : 'Log In as Cleaner'}
                  </button>
                </div>
              </div>

              <!-- Resident Role Card -->
              <div class="card ${user.role === 'resident' ? 'card-gold-glow' : ''}" style="padding: 1.25rem 1rem; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: space-between; background: #ffffff; border: 2px solid ${user.role === 'resident' ? '#0284c7' : '#e2e8f0'};">
                <div>
                  <div style="width: 48px; height: 48px; border-radius: var(--radius-full); background: #e0f2fe; color: #0284c7; display: flex; align-items: center; justify-content: center; font-size: 1.35rem; margin: 0 auto 0.75rem auto;">
                    <i class="fa-solid fa-camera"></i>
                  </div>
                  <h3 style="font-size: 1rem; margin-bottom: 4px; color: #0f172a;">📸 Resident</h3>
                  <div style="font-size: 0.68rem; font-weight: 800; color: #0284c7; text-transform: uppercase; margin-bottom: 6px;">Report & Pledge</div>
                  <p style="font-size: 0.78rem; color: #64748b; line-height: 1.45; margin-bottom: 1rem;">
                    Spot litter during festival activities, tag GPS coordinates, and pledge cleanup bounties.
                  </p>
                </div>
                <div style="width: 100%; display: flex; flex-direction: column; gap: 6px;">
                  <button class="btn btn-sm btn-primary" style="width: 100%; border-radius: var(--radius-full);" onclick="window.AuthView.openCreateAccountWithRole('resident')">
                    <i class="fa-solid fa-user-plus"></i> Create Resident Account
                  </button>
                  <button class="btn btn-sm btn-secondary" style="width: 100%; border-radius: var(--radius-full); font-size: 0.72rem;" onclick="window.loginAsRoleDirect('resident')">
                    ${user.role === 'resident' ? '<i class="fa-solid fa-check"></i> Logged In as Juan' : 'Log In as Resident'}
                  </button>
                </div>
              </div>

              <!-- Verifier Role Card -->
              <div class="card ${user.role === 'verifier' ? 'card-gold-glow' : ''}" style="padding: 1.25rem 1rem; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: space-between; background: #ffffff; border: 2px solid ${user.role === 'verifier' ? '#b45309' : '#e2e8f0'};">
                <div>
                  <div style="width: 48px; height: 48px; border-radius: var(--radius-full); background: #fef3c7; color: #d97706; display: flex; align-items: center; justify-content: center; font-size: 1.35rem; margin: 0 auto 0.75rem auto;">
                    <i class="fa-solid fa-shield-halved"></i>
                  </div>
                  <h3 style="font-size: 1rem; margin-bottom: 4px; color: #0f172a;">🛡️ Verifier</h3>
                  <div style="font-size: 0.68rem; font-weight: 800; color: #b45309; text-transform: uppercase; margin-bottom: 6px;">Audit & Payout</div>
                  <p style="font-size: 0.78rem; color: #64748b; line-height: 1.45; margin-bottom: 1rem;">
                    Inspect photo proofs submitted by cleaners and authorize instant escrow cashouts.
                  </p>
                </div>
                <div style="width: 100%; display: flex; flex-direction: column; gap: 6px;">
                  <button class="btn btn-sm btn-primary" style="width: 100%; border-radius: var(--radius-full);" onclick="window.AuthView.openCreateAccountWithRole('verifier')">
                    <i class="fa-solid fa-user-plus"></i> Create Verifier Account
                  </button>
                  <button class="btn btn-sm btn-secondary" style="width: 100%; border-radius: var(--radius-full); font-size: 0.72rem;" onclick="window.loginAsRoleDirect('verifier')">
                    ${user.role === 'verifier' ? '<i class="fa-solid fa-check"></i> Logged In as Carlo' : 'Log In as Verifier'}
                  </button>
                </div>
              </div>

            </div>
          </div>

          <!-- Festival Map Shortcut -->
          <div class="card" style="padding: 1.25rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; background: #ffffff; border: 1px solid #bbf7d0;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 42px; height: 42px; border-radius: var(--radius-md); background: #dcfce7; color: var(--emerald-700); display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">
                <i class="fa-solid fa-map-location-dot"></i>
              </div>
              <div>
                <h4 style="font-size: 0.95rem; margin-bottom: 2px; color: #0f172a;">Festival Cleanup Map</h4>
                <p style="font-size: 0.78rem; color: #64748b;">View cleanups around Peñaranda Park, Legazpi Boulevard, and Astrodome.</p>
              </div>
            </div>
            <a href="#/commissions" class="btn btn-secondary btn-sm" onclick="window.soundSystem.click()">
              <i class="fa-solid fa-arrow-right"></i> Open Map
            </a>
          </div>

        </div>
      </div>
    `;
  }
};
