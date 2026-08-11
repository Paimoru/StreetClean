/**
 * StreetClean | Ibalong Festival 2026 (Legazpi City)
 * Auth & Account Management View Component (White & Green Theme)
 * Account Creation First Flow with Role Selection (Cleaner, Resident, Verifier).
 */

window.AuthView = {
  activeTab: 'register', // Default to 'register' (Create Account First)
  registerStep: 1,
  selectedRegisterRole: 'cleaner', // 'cleaner' | 'resident' | 'verifier'
  selectedLoginRole: 'cleaner',
  selectedAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',

  avatarPresets: [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80'
  ],

  openCreateAccountWithRole(role) {
    this.activeTab = 'register';
    this.selectedRegisterRole = role || 'cleaner';
    this.registerStep = 1;
    window.location.hash = '#/auth';
    window.renderRoute();
  },

  render() {
    const allUsers = window.appState.getAllUsersList();
    const currentUser = window.appState.getUser();

    return `
      <div class="auth-view animate-fade-in" style="padding: 1.25rem 0 3.5rem 0;">
        <div class="app-container" style="max-width: 540px;">

          <!-- Top Header Card -->
          <div class="card card-gold-glow" style="text-align: center; margin-bottom: 1.25rem; padding: 1.5rem 1.25rem; background: #ffffff; border: 1px solid #bbf7d0;">
            <div class="brand-icon" style="width: 48px; height: 48px; margin: 0 auto 0.5rem auto; font-size: 1.4rem;">
              <i class="fa-solid fa-leaf"></i>
            </div>
            <h1 style="font-size: 1.35rem; font-weight: 800; margin-bottom: 2px; color: #0f172a;">
              Street<span class="gradient-text">Clean</span> Account Hub
            </h1>
            <div style="font-size: 0.72rem; font-weight: 800; color: #b45309; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">
              Ibalong Festival 2026 • Legazpi City
            </div>
            <p style="font-size: 0.8rem; color: #64748b; line-height: 1.45; max-width: 420px; margin: 0 auto 1.25rem auto;">
              Create your account first, choose your role as <strong>Cleaner</strong>, <strong>Resident</strong>, or <strong>Verifier</strong>, then start participating.
            </p>

            <!-- Navigation Tabs (Create Account First) -->
            <div style="display: flex; background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: var(--radius-full); padding: 4px; gap: 4px;">
              <button class="btn btn-sm ${this.activeTab === 'register' ? 'btn-primary' : 'btn-secondary'}" style="flex: 1.2; border-radius: var(--radius-full); font-size: 0.78rem; font-weight: 800;" onclick="window.AuthView.setTab('register')">
                <i class="fa-solid fa-user-plus"></i> 1. Create Account
              </button>
              <button class="btn btn-sm ${this.activeTab === 'login' ? 'btn-primary' : 'btn-secondary'}" style="flex: 1; border-radius: var(--radius-full); font-size: 0.78rem;" onclick="window.AuthView.setTab('login')">
                <i class="fa-solid fa-arrow-right-to-bracket"></i> 2. Log In
              </button>
              <button class="btn btn-sm ${this.activeTab === 'switch' ? 'btn-primary' : 'btn-secondary'}" style="flex: 0.9; border-radius: var(--radius-full); font-size: 0.78rem;" onclick="window.AuthView.setTab('switch')">
                <i class="fa-solid fa-users"></i> Profiles (${allUsers.length})
              </button>
            </div>
          </div>

          <!-- Active Tab View Content -->
          ${this.activeTab === 'register' ? this.renderRegisterView() : ''}
          ${this.activeTab === 'login' ? this.renderLoginView(allUsers, currentUser) : ''}
          ${this.activeTab === 'switch' ? this.renderSwitcherView(allUsers, currentUser) : ''}

        </div>
      </div>
    `;
  },

  // =========================================================================
  // 1. CREATE ACCOUNT VIEW (Registration with Role Selection First)
  // =========================================================================
  renderRegisterView() {
    return `
      <div class="card" style="padding: 1.5rem 1.25rem; background: #ffffff; border: 1px solid #bbf7d0; box-shadow: var(--shadow-sm);">
        
        <!-- Registration Stepper -->
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; border-bottom: 1px solid #f1f5f9; padding-bottom: 0.75rem;">
          <div style="display: flex; align-items: center; gap: 6px; font-size: 0.75rem; font-weight: 700; color: ${this.registerStep >= 1 ? 'var(--emerald-700)' : '#94a3b8'};">
            <span style="width: 20px; height: 20px; border-radius: 50%; background: ${this.registerStep >= 1 ? 'var(--emerald-600)' : '#cbd5e1'}; color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; font-weight: 800;">1</span>
            Pick Role
          </div>
          <div style="height: 2px; flex: 1; background: ${this.registerStep >= 2 ? 'var(--emerald-500)' : '#e2e8f0'}; margin: 0 6px;"></div>
          <div style="display: flex; align-items: center; gap: 6px; font-size: 0.75rem; font-weight: 700; color: ${this.registerStep >= 2 ? 'var(--emerald-700)' : '#94a3b8'};">
            <span style="width: 20px; height: 20px; border-radius: 50%; background: ${this.registerStep >= 2 ? 'var(--emerald-600)' : '#cbd5e1'}; color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; font-weight: 800;">2</span>
            Profile Details
          </div>
          <div style="height: 2px; flex: 1; background: ${this.registerStep >= 3 ? 'var(--emerald-500)' : '#e2e8f0'}; margin: 0 6px;"></div>
          <div style="display: flex; align-items: center; gap: 6px; font-size: 0.75rem; font-weight: 700; color: ${this.registerStep >= 3 ? 'var(--emerald-700)' : '#94a3b8'};">
            <span style="width: 20px; height: 20px; border-radius: 50%; background: ${this.registerStep >= 3 ? 'var(--emerald-600)' : '#cbd5e1'}; color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; font-weight: 800;">3</span>
            Wallet Payout
          </div>
        </div>

        ${this.registerStep === 1 ? this.renderStep1() : ''}
        ${this.registerStep === 2 ? this.renderStep2() : ''}
        ${this.registerStep === 3 ? this.renderStep3() : ''}

        <!-- Switch to Log In Prompt -->
        <div style="text-align: center; margin-top: 1.25rem; border-top: 1px solid #f1f5f9; padding-top: 1rem; font-size: 0.8rem; color: #64748b;">
          Already created your account? 
          <a href="javascript:void(0)" onclick="window.AuthView.setTab('login')" style="color: var(--emerald-700); font-weight: 800; text-decoration: underline;">
            Log in here
          </a>
        </div>

      </div>
    `;
  },

  renderStep1() {
    return `
      <div>
        <div style="margin-bottom: 1rem;">
          <h2 style="font-size: 1.1rem; font-weight: 800; color: #0f172a; margin-bottom: 3px;">
            Step 1: Pick What Role You Want to Create
          </h2>
          <p style="font-size: 0.78rem; color: #64748b;">
            Choose your role to define your permissions and actions during the festival:
          </p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 1.5rem;">
          
          <!-- Cleaner Role Option -->
          <div class="card ${this.selectedRegisterRole === 'cleaner' ? 'card-gold-glow' : ''}" 
               style="padding: 12px 14px; cursor: pointer; background: ${this.selectedRegisterRole === 'cleaner' ? '#f0fdf4' : '#f8fafc'}; border: 2px solid ${this.selectedRegisterRole === 'cleaner' ? 'var(--emerald-500)' : '#e2e8f0'}; border-radius: var(--radius-md); transition: all 0.2s ease;" 
               onclick="window.AuthView.selectRegisterRole('cleaner')">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 42px; height: 42px; border-radius: var(--radius-full); background: #dcfce7; color: var(--emerald-700); display: flex; align-items: center; justify-content: center; font-size: 1.25rem; flex-shrink: 0;">
                  <i class="fa-solid fa-broom"></i>
                </div>
                <div>
                  <div style="font-weight: 800; font-size: 0.92rem; color: #0f172a; display: flex; align-items: center; gap: 6px;">
                    🧹 Cleaner (Eco-Warrior)
                    <span class="status-badge status-open" style="font-size: 0.6rem; padding: 1px 5px;">Earn ₱ Cash</span>
                  </div>
                  <div style="font-size: 0.74rem; color: #64748b; margin-top: 2px;">
                    Claim reported festival zones, sweep streets, and earn instant ₱ GCash bounties.
                  </div>
                </div>
              </div>
              <input type="radio" name="regRole" value="cleaner" ${this.selectedRegisterRole === 'cleaner' ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: var(--emerald-600);" />
            </div>
          </div>

          <!-- Resident Role Option -->
          <div class="card ${this.selectedRegisterRole === 'resident' ? 'card-gold-glow' : ''}" 
               style="padding: 12px 14px; cursor: pointer; background: ${this.selectedRegisterRole === 'resident' ? '#f0f9ff' : '#f8fafc'}; border: 2px solid ${this.selectedRegisterRole === 'resident' ? '#0284c7' : '#e2e8f0'}; border-radius: var(--radius-md); transition: all 0.2s ease;" 
               onclick="window.AuthView.selectRegisterRole('resident')">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 42px; height: 42px; border-radius: var(--radius-full); background: #e0f2fe; color: #0284c7; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; flex-shrink: 0;">
                  <i class="fa-solid fa-camera"></i>
                </div>
                <div>
                  <div style="font-weight: 800; font-size: 0.92rem; color: #0f172a; display: flex; align-items: center; gap: 6px;">
                    📸 Resident (Festival Goer)
                    <span class="status-badge status-claimed" style="font-size: 0.6rem; padding: 1px 5px;">Report & Pledge</span>
                  </div>
                  <div style="font-size: 0.74rem; color: #64748b; margin-top: 2px;">
                    Take photos of littered festival spots, tag GPS coords, and pledge community bounties.
                  </div>
                </div>
              </div>
              <input type="radio" name="regRole" value="resident" ${this.selectedRegisterRole === 'resident' ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: #0284c7;" />
            </div>
          </div>

          <!-- Verifier Role Option -->
          <div class="card ${this.selectedRegisterRole === 'verifier' ? 'card-gold-glow' : ''}" 
               style="padding: 12px 14px; cursor: pointer; background: ${this.selectedRegisterRole === 'verifier' ? '#fffbeb' : '#f8fafc'}; border: 2px solid ${this.selectedRegisterRole === 'verifier' ? '#b45309' : '#e2e8f0'}; border-radius: var(--radius-md); transition: all 0.2s ease;" 
               onclick="window.AuthView.selectRegisterRole('verifier')">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 42px; height: 42px; border-radius: var(--radius-full); background: #fef3c7; color: #b45309; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; flex-shrink: 0;">
                  <i class="fa-solid fa-shield-halved"></i>
                </div>
                <div>
                  <div style="font-weight: 800; font-size: 0.92rem; color: #0f172a; display: flex; align-items: center; gap: 6px;">
                    🛡️ Verifier (City Marshall)
                    <span class="status-badge status-completed" style="font-size: 0.6rem; padding: 1px 5px;">Audit & Payout</span>
                  </div>
                  <div style="font-size: 0.74rem; color: #64748b; margin-top: 2px;">
                    Audit before/after cleanup photo proofs and authorize instant escrow payouts.
                  </div>
                </div>
              </div>
              <input type="radio" name="regRole" value="verifier" ${this.selectedRegisterRole === 'verifier' ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: #b45309;" />
            </div>
          </div>

        </div>

        <button class="btn btn-primary btn-block" style="padding: 12px; font-size: 0.88rem;" onclick="window.AuthView.setStep(2)">
          Continue as ${this.selectedRegisterRole.toUpperCase()} <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    `;
  },

  renderStep2() {
    return `
      <div>
        <div style="margin-bottom: 1rem;">
          <h2 style="font-size: 1.1rem; font-weight: 800; color: #0f172a; margin-bottom: 3px;">
            Step 2: Profile & Sign-In Credentials
          </h2>
          <p style="font-size: 0.78rem; color: #64748b;">
            Registering as <strong style="color: ${this.getRoleColor(this.selectedRegisterRole)}; text-transform: uppercase;">${this.selectedRegisterRole}</strong>
          </p>
        </div>

        <!-- Avatar Presets -->
        <div class="form-group" style="margin-bottom: 12px;">
          <label class="form-label" style="font-size: 0.75rem;">Select Profile Avatar</label>
          <div style="display: flex; gap: 8px; justify-content: center; margin-bottom: 4px;">
            ${this.avatarPresets.map(av => `
              <img src="${av}" style="width: 42px; height: 42px; border-radius: 50%; object-fit: cover; cursor: pointer; border: 2.5px solid ${this.selectedAvatar === av ? 'var(--emerald-500)' : '#e2e8f0'}; box-shadow: ${this.selectedAvatar === av ? '0 0 10px rgba(16, 185, 129, 0.4)' : 'none'}; transition: all 0.2s ease;" onclick="window.AuthView.setAvatar('${av}')" />
            `).join('')}
          </div>
        </div>

        <div class="form-group" style="margin-bottom: 10px;">
          <label class="form-label" style="font-size: 0.75rem;">Full Name</label>
          <input type="text" class="form-control" id="reg-name" placeholder="e.g. Christian Hernandez" value="Christian Hernandez" required />
        </div>

        <div class="form-group" style="margin-bottom: 10px;">
          <label class="form-label" style="font-size: 0.75rem;">Email Address (For Log In)</label>
          <input type="email" class="form-control" id="reg-email" placeholder="e.g. christian@ibalong.ph" value="christian@ibalong.ph" required />
        </div>

        <div class="form-group" style="margin-bottom: 10px;">
          <label class="form-label" style="font-size: 0.75rem;">Account Password</label>
          <input type="password" class="form-control" id="reg-password" placeholder="At least 6 characters" value="password123" required />
        </div>

        <div class="form-group" style="margin-bottom: 14px;">
          <label class="form-label" style="font-size: 0.75rem;">Legazpi City Barangay</label>
          <select class="form-control" id="reg-barangay">
            <option value="Barangay Albay District, Legazpi City">Barangay Albay District (Peñaranda Park)</option>
            <option value="Barangay Bitano, Legazpi City">Barangay Bitano (Astrodome Complex)</option>
            <option value="Barangay Puro, Legazpi City">Barangay Puro (Legazpi Boulevard)</option>
            <option value="Barangay Victory Village, Legazpi City">Barangay Victory Village (Embarcadero)</option>
            <option value="Barangay Cruzada, Legazpi City">Barangay Cruzada (Central District)</option>
          </select>
        </div>

        <div style="display: flex; gap: 8px;">
          <button class="btn btn-secondary btn-block" onclick="window.AuthView.setStep(1)">
            Back
          </button>
          <button class="btn btn-primary btn-block" onclick="window.AuthView.setStep(3)">
            Next: Payout Info <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    `;
  },

  renderStep3() {
    return `
      <div>
        <div style="margin-bottom: 1rem;">
          <h2 style="font-size: 1.1rem; font-weight: 800; color: #0f172a; margin-bottom: 3px;">
            Step 3: Mobile Wallet & Payout Account
          </h2>
          <p style="font-size: 0.78rem; color: #64748b;">
            Link your mobile wallet to send or receive verified Ibalong bounties.
          </p>
        </div>

        <div class="form-group" style="margin-bottom: 10px;">
          <label class="form-label" style="font-size: 0.75rem;">Mobile Phone Number</label>
          <input type="tel" class="form-control font-mono" id="reg-phone" placeholder="0917-000-0000" value="0917-889-4412" required />
        </div>

        <div class="form-group" style="margin-bottom: 10px;">
          <label class="form-label" style="font-size: 0.75rem;">Primary Mobile Wallet</label>
          <select class="form-control" id="reg-payout-provider">
            <option value="GCash">GCash Instant Payout</option>
            <option value="Maya">Maya Wallet</option>
            <option value="LandBank">LandBank PesoNet</option>
          </select>
        </div>

        <div class="form-group" style="margin-bottom: 12px;">
          <label class="form-label" style="font-size: 0.75rem;">GCash / Maya Account Mobile Number</label>
          <input type="text" class="form-control font-mono" id="reg-payout-account" placeholder="0917-000-0000" value="0917-889-4412" required />
        </div>

        <div class="card" style="padding: 10px 12px; background: #f0fdf4; border: 1px solid #bbf7d0; margin-bottom: 1.25rem; font-size: 0.75rem; color: #166534;">
          <i class="fa-solid fa-shield-check" style="color: var(--emerald-600);"></i>
          <strong>Instant Payout Ready:</strong> Your account will be certified immediately for official Ibalong Festival 2026 operations.
        </div>

        <div style="display: flex; gap: 8px;">
          <button class="btn btn-secondary btn-block" onclick="window.AuthView.setStep(2)">
            Back
          </button>
          <button class="btn btn-primary btn-block" onclick="window.AuthView.handleRegistrationSubmit()">
            <i class="fa-solid fa-user-check"></i> Create Account & Log In
          </button>
        </div>
      </div>
    `;
  },

  // =========================================================================
  // 2. LOG IN VIEW (For Existing Registered Accounts)
  // =========================================================================
  renderLoginView(allUsers, currentUser) {
    const roleUsers = {
      cleaner: allUsers.filter(u => u.role === 'cleaner'),
      resident: allUsers.filter(u => u.role === 'resident'),
      verifier: allUsers.filter(u => u.role === 'verifier')
    };

    const activeDemoUser = (roleUsers[this.selectedLoginRole] && roleUsers[this.selectedLoginRole][0]) || currentUser;

    return `
      <div class="card" style="padding: 1.5rem 1.25rem; background: #ffffff; border: 1px solid #bbf7d0; box-shadow: var(--shadow-sm);">
        
        <!-- Callout Banner to Create Account First -->
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: var(--radius-md); padding: 10px 12px; margin-bottom: 1.25rem; display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap;">
          <div style="font-size: 0.76rem; color: #166534;">
            <i class="fa-solid fa-circle-info"></i> Don't have an account yet? <strong>Create your account first</strong> to pick your role.
          </div>
          <button class="btn btn-primary btn-sm" style="padding: 4px 10px; font-size: 0.72rem;" onclick="window.AuthView.setTab('register')">
            Create Account
          </button>
        </div>

        <div style="margin-bottom: 1.25rem;">
          <h2 style="font-size: 1.1rem; font-weight: 800; color: #0f172a; margin-bottom: 3px;">
            Log In to Your Registered Account
          </h2>
          <p style="font-size: 0.78rem; color: #64748b;">
            Select your registered role or sign in with your email and password:
          </p>
        </div>

        <!-- 3 Role Choice Cards -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 1.25rem;">
          
          <!-- Role: Cleaner -->
          <div class="card ${this.selectedLoginRole === 'cleaner' ? 'card-gold-glow' : ''}" 
               style="padding: 12px 8px; text-align: center; cursor: pointer; background: ${this.selectedLoginRole === 'cleaner' ? '#f0fdf4' : '#f8fafc'}; border: 2px solid ${this.selectedLoginRole === 'cleaner' ? 'var(--emerald-500)' : '#e2e8f0'}; border-radius: var(--radius-md); transition: all 0.2s ease;"
               onclick="window.AuthView.selectLoginRole('cleaner')">
            <div style="width: 36px; height: 36px; border-radius: 50%; background: #dcfce7; color: var(--emerald-700); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; margin: 0 auto 6px auto;">
              <i class="fa-solid fa-broom"></i>
            </div>
            <div style="font-weight: 800; font-size: 0.82rem; color: #0f172a; margin-bottom: 2px;">Cleaner</div>
            <div style="font-size: 0.65rem; color: var(--emerald-700); font-weight: 700;">Earn ₱ Bounties</div>
          </div>

          <!-- Role: Resident -->
          <div class="card ${this.selectedLoginRole === 'resident' ? 'card-gold-glow' : ''}" 
               style="padding: 12px 8px; text-align: center; cursor: pointer; background: ${this.selectedLoginRole === 'resident' ? '#f0f9ff' : '#f8fafc'}; border: 2px solid ${this.selectedLoginRole === 'resident' ? '#0284c7' : '#e2e8f0'}; border-radius: var(--radius-md); transition: all 0.2s ease;"
               onclick="window.AuthView.selectLoginRole('resident')">
            <div style="width: 36px; height: 36px; border-radius: 50%; background: #e0f2fe; color: #0284c7; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; margin: 0 auto 6px auto;">
              <i class="fa-solid fa-camera"></i>
            </div>
            <div style="font-weight: 800; font-size: 0.82rem; color: #0f172a; margin-bottom: 2px;">Resident</div>
            <div style="font-size: 0.65rem; color: #0284c7; font-weight: 700;">Report Litter</div>
          </div>

          <!-- Role: Verifier -->
          <div class="card ${this.selectedLoginRole === 'verifier' ? 'card-gold-glow' : ''}" 
               style="padding: 12px 8px; text-align: center; cursor: pointer; background: ${this.selectedLoginRole === 'verifier' ? '#fffbeb' : '#f8fafc'}; border: 2px solid ${this.selectedLoginRole === 'verifier' ? '#b45309' : '#e2e8f0'}; border-radius: var(--radius-md); transition: all 0.2s ease;"
               onclick="window.AuthView.selectLoginRole('verifier')">
            <div style="width: 36px; height: 36px; border-radius: 50%; background: #fef3c7; color: #b45309; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; margin: 0 auto 6px auto;">
              <i class="fa-solid fa-shield-halved"></i>
            </div>
            <div style="font-weight: 800; font-size: 0.82rem; color: #0f172a; margin-bottom: 2px;">Verifier</div>
            <div style="font-size: 0.65rem; color: #b45309; font-weight: 700;">Audit & Payout</div>
          </div>

        </div>

        <!-- 1-Click Fast Role Sign-In -->
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: var(--radius-md); padding: 12px 14px; margin-bottom: 1.25rem;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <img src="${activeDemoUser.avatar}" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 2px solid ${this.getRoleBorder(this.selectedLoginRole)};" />
              <div>
                <div style="font-weight: 800; font-size: 0.88rem; color: #0f172a;">${activeDemoUser.name}</div>
                <div style="font-size: 0.68rem; color: #64748b;">
                  Active <span style="text-transform: capitalize; font-weight: 700; color: ${this.getRoleColor(this.selectedLoginRole)};">${this.selectedLoginRole}</span> • ${activeDemoUser.barangay.split(',')[0]}
                </div>
              </div>
            </div>
            <span class="status-badge status-completed" style="font-size: 0.65rem;">
              Verified
            </span>
          </div>

          <button class="btn btn-block ${this.selectedLoginRole === 'verifier' ? 'btn-gold' : 'btn-primary'}" 
                  style="font-size: 0.85rem; padding: 10px 12px;"
                  onclick="window.AuthView.loginAsRole('${this.selectedLoginRole}', '${activeDemoUser.id}')">
            <i class="fa-solid fa-arrow-right-to-bracket"></i> Log In as ${this.selectedLoginRole.charAt(0).toUpperCase() + this.selectedLoginRole.slice(1)} (${activeDemoUser.name})
          </button>
        </div>

        <!-- Custom Credential Sign In Form -->
        <div style="border-top: 1px solid #f1f5f9; padding-top: 1rem;">
          <div style="font-size: 0.78rem; font-weight: 700; color: #0f172a; margin-bottom: 8px;">
            Or Sign In with Email & Password:
          </div>

          <form onsubmit="event.preventDefault(); window.AuthView.handleCredentialLogin();">
            <div class="form-group" style="margin-bottom: 10px;">
              <label class="form-label" style="font-size: 0.75rem;">Email or Mobile Number</label>
              <input type="text" class="form-control" id="login-identifier" value="${activeDemoUser.email}" placeholder="e.g. maria@clean.ph" required />
            </div>

            <div class="form-group" style="margin-bottom: 12px;">
              <label class="form-label" style="font-size: 0.75rem;">Password</label>
              <input type="password" class="form-control" id="login-password" value="password123" placeholder="••••••••" required />
            </div>

            <button type="submit" class="btn btn-secondary btn-block" style="font-size: 0.82rem; padding: 10px 12px;">
              <i class="fa-solid fa-key"></i> Sign In with Credentials
            </button>
          </form>
        </div>

      </div>
    `;
  },

  // =========================================================================
  // 3. SAVED ACCOUNTS SWITCHER VIEW
  // =========================================================================
  renderSwitcherView(allUsers, currentUser) {
    return `
      <div class="card" style="padding: 1.5rem 1.25rem; background: #ffffff; border: 1px solid #bbf7d0;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
          <div>
            <h2 style="font-size: 1.05rem; font-weight: 800; color: #0f172a; margin-bottom: 2px;">
              Saved Registered Accounts
            </h2>
            <p style="font-size: 0.76rem; color: #64748b;">
              1-click switch between cleaner, resident, and verifier profiles.
            </p>
          </div>
          <button class="btn btn-primary btn-sm" onclick="window.AuthView.setTab('register')">
            + New Account
          </button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${allUsers.map(u => `
            <div class="card ${currentUser.id === u.id ? 'card-gold-glow' : ''}" 
                 style="padding: 10px 12px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; background: #f8fafc; border: 1px solid ${currentUser.id === u.id ? 'var(--emerald-500)' : '#e2e8f0'};" 
                 onclick="window.switchUser('${u.id}')">
              <div style="display: flex; align-items: center; gap: 10px;">
                <img src="${u.avatar}" style="width: 38px; height: 38px; border-radius: var(--radius-full); object-fit: cover; border: 2px solid ${this.getRoleBorder(u.role)};" />
                <div>
                  <div style="font-weight: 800; font-size: 0.88rem; color: #0f172a;">${u.name}</div>
                  <div style="font-size: 0.7rem; color: #64748b;">
                    <span style="text-transform: capitalize; font-weight: 700; color: ${this.getRoleColor(u.role)};">${u.role}</span> • ${u.barangay.split(',')[0]}
                  </div>
                </div>
              </div>
              ${currentUser.id === u.id ? 
                '<span class="status-badge status-completed" style="font-size: 0.65rem;"><i class="fa-solid fa-check"></i> Active</span>' : 
                '<button class="btn btn-secondary btn-sm" style="padding: 4px 10px; font-size: 0.72rem;">Switch</button>'}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  // Helper Methods
  getRoleColor(role) {
    if (role === 'resident') return '#0284c7';
    if (role === 'verifier') return '#b45309';
    return 'var(--emerald-700)';
  },

  getRoleBorder(role) {
    if (role === 'resident') return '#0284c7';
    if (role === 'verifier') return '#b45309';
    return 'var(--emerald-500)';
  },

  setTab(tab) {
    this.activeTab = tab;
    window.renderRoute();
  },

  selectLoginRole(role) {
    this.selectedLoginRole = role;
    window.renderRoute();
  },

  selectRegisterRole(role) {
    this.selectedRegisterRole = role;
    window.renderRoute();
  },

  setStep(step) {
    this.registerStep = step;
    window.renderRoute();
  },

  setAvatar(url) {
    this.selectedAvatar = url;
    window.renderRoute();
  },

  loginAsRole(role, userId) {
    window.switchUser(userId);
    window.soundSystem.fanfare();
    window.showToast(`Logged in as ${role.toUpperCase()}!`, 'success');
    
    // Direct to appropriate role workspace
    if (role === 'cleaner') {
      window.location.hash = '#/commissions';
    } else if (role === 'resident') {
      window.location.hash = '#/report';
    } else if (role === 'verifier') {
      window.location.hash = '#/verify';
    }
  },

  handleCredentialLogin() {
    const identifier = document.getElementById('login-identifier')?.value.trim();
    const password = document.getElementById('login-password')?.value.trim();

    if (!identifier || !password) {
      window.showToast('Please enter both your email/phone and password.', 'error');
      return;
    }

    const res = window.appState.loginUser(identifier, password);
    if (res.success) {
      window.soundSystem.fanfare();
      window.showToast(`Welcome back, ${res.user.name}! (${res.user.role})`, 'success');
      window.renderRoute();
      if (res.user.role === 'cleaner') window.location.hash = '#/commissions';
      else if (res.user.role === 'resident') window.location.hash = '#/report';
      else if (res.user.role === 'verifier') window.location.hash = '#/verify';
    } else {
      window.showToast(res.message, 'error');
    }
  },

  handleRegistrationSubmit() {
    const name = document.getElementById('reg-name')?.value.trim();
    const email = document.getElementById('reg-email')?.value.trim();
    const password = document.getElementById('reg-password')?.value.trim() || 'password123';
    const barangay = document.getElementById('reg-barangay')?.value;
    const phone = document.getElementById('reg-phone')?.value.trim();
    const payoutProvider = document.getElementById('reg-payout-provider')?.value;
    const payoutAccount = document.getElementById('reg-payout-account')?.value.trim();

    if (!name || !email) {
      window.showToast('Please provide your name and email.', 'error');
      return;
    }

    const res = window.appState.registerUser({
      name,
      email,
      password,
      role: this.selectedRegisterRole,
      barangay,
      phone,
      payoutProvider,
      payoutAccount,
      avatar: this.selectedAvatar
    });

    if (res.success) {
      window.soundSystem.fanfare();
      window.showToast(`Account created as ${this.selectedRegisterRole.toUpperCase()}! Welcome to Ibalong 2026.`, 'gold');
      this.activeTab = 'register';
      this.registerStep = 1;
      window.renderRoute();
      if (res.user.role === 'cleaner') window.location.hash = '#/commissions';
      else if (res.user.role === 'resident') window.location.hash = '#/report';
      else if (res.user.role === 'verifier') window.location.hash = '#/verify';
    } else {
      window.showToast(res.message, 'error');
    }
  }
};
