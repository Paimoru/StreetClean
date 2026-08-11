/**
 * StreetClean | Ibalong Festival 2026 (Legazpi City)
 * Wallet & Payment System View Component
 * Comprehensive Payment Engine with Interactive Filterable Transaction Ledger & Digital Receipts.
 */

window.WalletView = {
  activeLeaderboardTab: 'earnings', // 'earnings' | 'cleans' | 'weight'
  activeTxFilter: 'all', // 'all' | 'payouts' | 'withdrawals' | 'deposits'

  render() {
    const user = window.appState.getUser();
    const transactions = window.appState.getTransactions();

    return `
      <div class="wallet-view animate-fade-in" style="padding: 1rem 0 3.5rem 0;">
        <div class="app-container" style="max-width: 820px;">

          <!-- Wallet Master Balance Card -->
          <div class="card card-gold-glow" style="
            background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%);
            border-radius: var(--radius-xl);
            padding: 1.75rem 1.5rem;
            margin-bottom: 1.25rem;
            border: 1px solid #bbf7d0;
            box-shadow: var(--shadow-md);
          ">
            <div>
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; flex-wrap: wrap; gap: 8px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <div class="brand-icon" style="width: 32px; height: 32px; font-size: 0.95rem;">
                    <i class="fa-solid fa-vault"></i>
                  </div>
                  <span style="font-weight: 800; font-size: 0.88rem; color: #0f172a;">Ibalong Civic Wallet</span>
                </div>
                <div style="display: flex; gap: 6px;">
                  <span class="status-badge status-completed"><i class="fa-solid fa-bolt"></i> Instant Payouts Active</span>
                  <span class="status-badge status-open"><i class="fa-solid fa-mobile-screen"></i> ${user.payoutProvider}</span>
                </div>
              </div>

              <div style="margin-bottom: 1.25rem;">
                <div style="font-size: 0.76rem; color: var(--emerald-800); text-transform: uppercase; font-weight: 800; letter-spacing: 0.05em;">Available Wallet Balance</div>
                <div class="font-mono" style="font-size: clamp(2rem, 5vw, 2.75rem); font-weight: 800; color: #b45309; line-height: 1.1; margin-top: 4px;">
                  ₱${user.phpBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div style="font-size: 0.8rem; color: #64748b; margin-top: 4px;">
                  + <strong style="color: var(--emerald-700);">${user.cleanPoints.toLocaleString()}</strong> Ibalong Clean Points Earned
                </div>
              </div>

              <!-- Quick Metrics Grid -->
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 8px; margin-bottom: 1.25rem; background: #ffffff; padding: 10px; border-radius: var(--radius-md); border: 1px solid #e2e8f0;">
                <div>
                  <div style="font-size: 0.65rem; color: #64748b; font-weight: 600;">Locked in Escrow</div>
                  <div class="font-mono" style="font-size: 1rem; font-weight: 800; color: #0284c7;">₱${user.escrowLockedPhp.toFixed(2)}</div>
                </div>
                <div>
                  <div style="font-size: 0.65rem; color: #64748b; font-weight: 600;">Cleans Completed</div>
                  <div class="font-mono" style="font-size: 1rem; font-weight: 800; color: var(--emerald-600);">${user.stats.completedCleans} Sites</div>
                </div>
                <div>
                  <div style="font-size: 0.65rem; color: #64748b; font-weight: 600;">Total Waste Diverted</div>
                  <div class="font-mono" style="font-size: 1rem; font-weight: 800; color: #b45309;">${user.stats.kgRecycled} kg</div>
                </div>
              </div>

              <!-- Primary Action Buttons: Cashout & Top-Up & Settings -->
              <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                ${user.role === 'cleaner' ? `
                  <button class="btn btn-gold btn-sm" onclick="window.WalletView.openWithdrawModal()">
                    <i class="fa-solid fa-money-bill-transfer"></i> Cashout / Withdraw
                  </button>
                ` : ''}
                <button class="btn btn-primary btn-sm" onclick="window.WalletView.openDepositModal()">
                  <i class="fa-solid fa-plus-circle"></i> Top-Up / Add Funds
                </button>
                <button class="btn btn-secondary btn-sm" onclick="window.WalletView.openPaymentSettingsModal()">
                  <i class="fa-solid fa-gear"></i> Payment Methods
                </button>
              </div>
            </div>
          </div>

          <!-- Festival Eco-Warrior Leaderboard -->
          ${this.renderLeaderboardSection(user)}

          <!-- Transaction & Payout History Section -->
          ${this.renderTransactionLedgerSection(transactions)}

        </div>
      </div>
    `;
  },

  // =========================================================================
  // 1. LEADERBOARD SECTION WITH REALISTIC RANKINGS & METRICS
  // =========================================================================
  renderLeaderboardSection(currentUser) {
    const rankings = [
      {
        id: 'usr_eduardo',
        rank: 1,
        name: 'Eduardo "Ka Eddie" Ramos',
        barangay: 'Barangay Puro (Boulevard)',
        roleTitle: 'Master Sentinel #01',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        earningsPhp: 18450,
        cleans: 52,
        weightKg: 1640,
        points: 18200
      },
      {
        id: 'usr_cleaner_01',
        rank: 2,
        name: currentUser.id === 'usr_cleaner_01' ? `${currentUser.name} (You)` : 'Maria Bataller',
        barangay: 'Barangay Bitano (Astrodome)',
        roleTitle: 'Gold Sentinel #07',
        avatar: currentUser.id === 'usr_cleaner_01' ? currentUser.avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        earningsPhp: currentUser.id === 'usr_cleaner_01' ? Math.max(currentUser.phpBalance, 15200) : 15200,
        cleans: currentUser.id === 'usr_cleaner_01' ? currentUser.stats.completedCleans : 46,
        weightKg: currentUser.id === 'usr_cleaner_01' ? currentUser.stats.kgRecycled : 1420,
        points: currentUser.id === 'usr_cleaner_01' ? currentUser.cleanPoints : 14800
      },
      {
        id: 'usr_teresa',
        rank: 3,
        name: 'Teresa Morales',
        barangay: 'Barangay Albay District (Peñaranda)',
        roleTitle: 'Festival Veteran',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
        earningsPhp: 12800,
        cleans: 38,
        weightKg: 1180,
        points: 12100
      },
      {
        id: 'usr_danilo',
        rank: 4,
        name: 'Danilo "Kuya Dan" Fernandez',
        barangay: 'Barangay Victory Village (Embarcadero)',
        roleTitle: 'Coastal Eco-Champion',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        earningsPhp: 9650,
        cleans: 31,
        weightKg: 940,
        points: 9400
      },
      {
        id: 'usr_maricel',
        rank: 5,
        name: 'Maricel Villanueva',
        barangay: 'Barangay Cruzada (Central)',
        roleTitle: 'Eco-Guardian',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
        earningsPhp: 8100,
        cleans: 26,
        weightKg: 780,
        points: 7900
      },
      {
        id: 'usr_rogelio',
        rank: 6,
        name: 'Rogelio Alcantara',
        barangay: 'Barangay Washington (Old Albay)',
        roleTitle: 'Swift Sweeper',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
        earningsPhp: 6850,
        cleans: 22,
        weightKg: 650,
        points: 6600
      },
      {
        id: 'usr_analyn',
        rank: 7,
        name: 'Analyn Dela Cruz',
        barangay: 'Barangay San Roque (Airport Road)',
        roleTitle: 'Green Patrol',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
        earningsPhp: 5400,
        cleans: 19,
        weightKg: 520,
        points: 5200
      }
    ];

    return `
      <div class="card" style="padding: 1.25rem; background: #ffffff; border: 1px solid #bbf7d0; box-shadow: var(--shadow-sm); margin-bottom: 1.25rem;">
        
        <!-- Header & Category Switcher -->
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; margin-bottom: 1rem;">
          <div>
            <h3 style="font-size: 1.05rem; font-weight: 800; display: flex; align-items: center; gap: 8px; color: #0f172a; margin-bottom: 2px;">
              <i class="fa-solid fa-trophy" style="color: #b45309;"></i> Ibalong 2026 Eco-Warrior Leaderboard
            </h3>
            <p style="font-size: 0.74rem; color: #64748b;">
              Official sanitation rankings certified by Legazpi City ENRO.
            </p>
          </div>

          <!-- Metric Sort Pills -->
          <div style="display: inline-flex; background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: var(--radius-full); padding: 3px; gap: 2px;">
            <button class="btn btn-sm ${this.activeLeaderboardTab === 'earnings' ? 'btn-primary' : 'btn-secondary'}" style="padding: 4px 10px; border-radius: var(--radius-full); font-size: 0.72rem; border: none;" onclick="window.WalletView.setLeaderboardTab('earnings')">
              ₱ Earned
            </button>
            <button class="btn btn-sm ${this.activeLeaderboardTab === 'cleans' ? 'btn-primary' : 'btn-secondary'}" style="padding: 4px 10px; border-radius: var(--radius-full); font-size: 0.72rem; border: none;" onclick="window.WalletView.setLeaderboardTab('cleans')">
              ⚡ Cleans
            </button>
            <button class="btn btn-sm ${this.activeLeaderboardTab === 'weight' ? 'btn-primary' : 'btn-secondary'}" style="padding: 4px 10px; border-radius: var(--radius-full); font-size: 0.72rem; border: none;" onclick="window.WalletView.setLeaderboardTab('weight')">
              ♻️ Waste (kg)
            </button>
          </div>
        </div>

        <!-- Ranked List Items -->
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${rankings.map(item => this.renderLeaderboardItem(item, currentUser)).join('')}
        </div>

      </div>
    `;
  },

  renderLeaderboardItem(item, currentUser) {
    const isUser = currentUser.id === item.id || (currentUser.role === 'cleaner' && item.rank === 2);

    let rankBadge = `<span style="font-weight: 800; font-size: 0.9rem; color: #64748b; width: 26px; text-align: center;">#${item.rank}</span>`;
    let bgStyle = 'background: #f8fafc; border: 1px solid #e2e8f0;';

    if (item.rank === 1) {
      rankBadge = `<span style="font-weight: 800; font-size: 1.25rem; color: #b45309; width: 28px; text-align: center;">🥇</span>`;
      bgStyle = 'background: linear-gradient(135deg, #fffbeb, #fef3c7); border: 1px solid #fde68a;';
    } else if (item.rank === 2) {
      rankBadge = `<span style="font-weight: 800; font-size: 1.25rem; color: var(--emerald-700); width: 28px; text-align: center;">🥈</span>`;
      bgStyle = 'background: linear-gradient(135deg, #f0fdf4, #dcfce7); border: 1px solid #bbf7d0;';
    } else if (item.rank === 3) {
      rankBadge = `<span style="font-weight: 800; font-size: 1.25rem; color: #0284c7; width: 28px; text-align: center;">🥉</span>`;
      bgStyle = 'background: linear-gradient(135deg, #f0f9ff, #e0f2fe); border: 1px solid #bae6fd;';
    }

    if (isUser) {
      bgStyle = 'background: #ecfdf5; border: 2px solid var(--emerald-500); box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);';
    }

    let metricDisplay = `<div class="font-mono" style="font-weight: 800; color: #b45309; font-size: 0.95rem;">₱${item.earningsPhp.toLocaleString()}</div>`;
    let subMetric = `${item.cleans} Cleans • ${item.weightKg} kg`;

    if (this.activeLeaderboardTab === 'cleans') {
      metricDisplay = `<div class="font-mono" style="font-weight: 800; color: var(--emerald-700); font-size: 0.95rem;">${item.cleans} Cleans</div>`;
      subMetric = `₱${item.earningsPhp.toLocaleString()} earned`;
    } else if (this.activeLeaderboardTab === 'weight') {
      metricDisplay = `<div class="font-mono" style="font-weight: 800; color: #0284c7; font-size: 0.95rem;">${item.weightKg} kg</div>`;
      subMetric = `${item.cleans} Cleans • ₱${item.earningsPhp.toLocaleString()}`;
    }

    return `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; border-radius: var(--radius-md); ${bgStyle}; transition: all 0.2s ease;">
        <div style="display: flex; align-items: center; gap: 10px;">
          ${rankBadge}
          <img src="${item.avatar}" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 1.5px solid #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.1);" />
          <div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-weight: 800; font-size: 0.86rem; color: #0f172a;">${item.name}</span>
              ${isUser ? '<span class="status-badge status-completed" style="font-size: 0.6rem; padding: 1px 5px;">You</span>' : ''}
            </div>
            <div style="font-size: 0.68rem; color: #64748b;">
              <span style="color: var(--emerald-700); font-weight: 700;">${item.roleTitle}</span> • ${item.barangay.split('(')[0]}
            </div>
          </div>
        </div>

        <div style="text-align: right; flex-shrink: 0;">
          ${metricDisplay}
          <div style="font-size: 0.66rem; color: #64748b;">${subMetric}</div>
        </div>
      </div>
    `;
  },

  setLeaderboardTab(tab) {
    this.activeLeaderboardTab = tab;
    window.renderRoute();
  },

  // =========================================================================
  // 2. ENHANCED TRANSACTION & PAYOUT HISTORY SECTION
  // =========================================================================
  renderTransactionLedgerSection(transactions) {
    // Filter transactions
    let filteredTx = transactions;
    if (this.activeTxFilter === 'payouts') {
      filteredTx = transactions.filter(t => t.type === 'bounty_payout');
    } else if (this.activeTxFilter === 'withdrawals') {
      filteredTx = transactions.filter(t => t.type === 'withdrawal');
    } else if (this.activeTxFilter === 'deposits') {
      filteredTx = transactions.filter(t => t.type === 'deposit' || t.type === 'bounty_pledge');
    }

    // Financial Cashflow Totals
    let totalInflow = 0;
    let totalOutflow = 0;
    transactions.forEach(t => {
      if (t.amountPhp > 0) totalInflow += t.amountPhp;
      else totalOutflow += Math.abs(t.amountPhp);
    });

    const countPayouts = transactions.filter(t => t.type === 'bounty_payout').length;
    const countWithdrawals = transactions.filter(t => t.type === 'withdrawal').length;
    const countDeposits = transactions.filter(t => t.type === 'deposit' || t.type === 'bounty_pledge').length;

    return `
      <div class="card" style="padding: 1.25rem; background: #ffffff; border: 1px solid #bbf7d0; box-shadow: var(--shadow-sm);">
        
        <!-- Header -->
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin-bottom: 0.85rem;">
          <div>
            <h3 style="font-size: 1.05rem; font-weight: 800; color: #0f172a; display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-receipt" style="color: var(--emerald-600);"></i> Transaction & Payout History
            </h3>
            <p style="font-size: 0.74rem; color: #64748b;">
              Official digital ledger certified by ENRO & City Treasury. Tap any row to view E-Receipt.
            </p>
          </div>

          <span class="status-badge status-completed" style="font-size: 0.68rem;">
            <i class="fa-solid fa-shield-check"></i> 100% Escrow Verified
          </span>
        </div>

        <!-- Cashflow Financial Overview Banner -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 8px; background: #f8fafc; padding: 10px; border-radius: var(--radius-md); border: 1px solid #e2e8f0; margin-bottom: 1rem;">
          <div>
            <div style="font-size: 0.65rem; color: #64748b; font-weight: 600;">Total Inflow (Bounties & Deposits)</div>
            <div class="font-mono" style="font-size: 1.05rem; font-weight: 800; color: var(--emerald-700);">+₱${totalInflow.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
          </div>
          <div>
            <div style="font-size: 0.65rem; color: #64748b; font-weight: 600;">Total Outflow (Cashouts & Pledges)</div>
            <div class="font-mono" style="font-size: 1.05rem; font-weight: 800; color: #e11d48;">-₱${totalOutflow.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
          </div>
          <div>
            <div style="font-size: 0.65rem; color: #64748b; font-weight: 600;">Ledger Records</div>
            <div class="font-mono" style="font-size: 1.05rem; font-weight: 800; color: #0f172a;">${transactions.length} Total</div>
          </div>
        </div>

        <!-- Filter Tabs -->
        <div class="chip-group" style="margin-bottom: 1rem; overflow-x: auto; padding-bottom: 4px;">
          <button class="chip-select-btn ${this.activeTxFilter === 'all' ? 'active' : ''}" onclick="window.WalletView.setTxFilter('all')">
            All Records (${transactions.length})
          </button>
          <button class="chip-select-btn ${this.activeTxFilter === 'payouts' ? 'active' : ''}" onclick="window.WalletView.setTxFilter('payouts')">
            🟢 Payouts & Earnings (${countPayouts})
          </button>
          <button class="chip-select-btn ${this.activeTxFilter === 'withdrawals' ? 'active' : ''}" onclick="window.WalletView.setTxFilter('withdrawals')">
            🔴 Cashouts (${countWithdrawals})
          </button>
          <button class="chip-select-btn ${this.activeTxFilter === 'deposits' ? 'active' : ''}" onclick="window.WalletView.setTxFilter('deposits')">
            🔵 Top-Ups & Pledges (${countDeposits})
          </button>
        </div>

        <!-- Filtered Transaction Items List -->
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${filteredTx.length === 0 ? `
            <div style="text-align: center; padding: 2rem; color: #64748b; font-size: 0.82rem;">
              <i class="fa-solid fa-receipt" style="font-size: 1.8rem; color: #cbd5e1; margin-bottom: 6px;"></i>
              <div>No transactions found in this category.</div>
            </div>
          ` : filteredTx.map(tx => this.renderTransactionRow(tx)).join('')}
        </div>

      </div>
    `;
  },

  renderTransactionRow(tx) {
    const isPositive = tx.amountPhp > 0;

    let iconBg = '#dcfce7';
    let iconColor = 'var(--emerald-700)';
    let iconBorder = '#86efac';
    let mainIcon = 'fa-sack-dollar';
    let subBadge = 'fa-sparkles';
    let subBg = '#059669';
    let typeLabel = 'Bounty Payout';

    if (tx.type === 'withdrawal') {
      iconBg = '#fee2e2';
      iconColor = '#e11d48';
      iconBorder = '#fca5a5';
      mainIcon = 'fa-money-bill-transfer';
      subBadge = 'fa-arrow-up-right';
      subBg = '#e11d48';
      typeLabel = 'Cashout';
    } else if (tx.type === 'bounty_pledge') {
      iconBg = '#fef3c7';
      iconColor = '#b45309';
      iconBorder = '#fde68a';
      mainIcon = 'fa-heart-circle-plus';
      subBadge = 'fa-leaf';
      subBg = '#d97706';
      typeLabel = 'Bounty Pledge';
    } else if (tx.type === 'deposit') {
      iconBg = '#e0f2fe';
      iconColor = '#0284c7';
      iconBorder = '#7dd3fc';
      mainIcon = 'fa-wallet';
      subBadge = 'fa-plus';
      subBg = '#0284c7';
      typeLabel = 'Wallet Top-Up';
    }

    return `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: var(--radius-md); cursor: pointer; transition: all 0.2s ease;" 
           onclick="window.WalletView.openReceiptModal('${tx.id}')" 
           onmouseover="this.style.borderColor='var(--emerald-500)'; this.style.background='#f0fdf4';" 
           onmouseout="this.style.borderColor='#e2e8f0'; this.style.background='#f8fafc';">
        
        <div style="display: flex; align-items: center; gap: 12px; min-width: 0;">
          <!-- Distinguishable Colored Icon Logo Container with Sub-Badge -->
          <div style="position: relative; width: 42px; height: 42px; border-radius: var(--radius-md); background: ${iconBg}; border: 1.5px solid ${iconBorder}; color: ${iconColor}; display: flex; align-items: center; justify-content: center; font-size: 1.15rem; flex-shrink: 0; box-shadow: 0 2px 6px rgba(0,0,0,0.04);">
            <i class="fa-solid ${mainIcon}"></i>
            <div style="position: absolute; bottom: -3px; right: -3px; width: 16px; height: 16px; border-radius: 50%; background: ${subBg}; color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 8px; border: 1.5px solid #ffffff;">
              <i class="fa-solid ${subBadge}"></i>
            </div>
          </div>

          <div style="min-width: 0;">
            <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
              <span style="font-weight: 800; font-size: 0.88rem; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${tx.title}
              </span>
              <span style="font-size: 0.65rem; font-weight: 700; background: ${iconBg}; color: ${iconColor}; border: 1px solid ${iconBorder}; padding: 1px 6px; border-radius: 4px; text-transform: uppercase;">
                ${typeLabel}
              </span>
            </div>
            <div style="font-size: 0.72rem; color: #64748b; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-top: 2px;">
              <span>${tx.date} at ${tx.time}</span>
              <span>•</span>
              <span class="font-mono" style="color: #334155; font-weight: 700;">
                <i class="fa-solid fa-mobile-screen"></i> ${tx.channel}
              </span>
              <span>•</span>
              <span class="font-mono" style="color: var(--emerald-700); font-weight: 700;">${tx.reference || tx.id}</span>
            </div>
          </div>
        </div>

        <div style="text-align: right; flex-shrink: 0; padding-left: 10px;">
          <div class="font-mono" style="font-weight: 800; font-size: 1.05rem; color: ${isPositive ? 'var(--emerald-700)' : '#e11d48'};">
            ${isPositive ? '+' : ''}₱${Math.abs(tx.amountPhp).toFixed(2)}
          </div>
          <span class="status-badge status-completed" style="font-size: 0.62rem; padding: 2px 6px;">
            <i class="fa-solid fa-file-invoice"></i> E-Receipt
          </span>
        </div>

      </div>
    `;
  },

  setTxFilter(filter) {
    this.activeTxFilter = filter;
    window.renderRoute();
  },

  // =========================================================================
  // 3. MODALS: CASHOUT, TOP-UP, SETTINGS, DIGITAL RECEIPT
  // =========================================================================
  openWithdrawModal() {
    const user = window.appState.getUser();
    const modalHtml = `
      <div class="modal-card">
        <button class="modal-close-btn" onclick="window.closeModal()"><i class="fa-solid fa-xmark"></i></button>
        <div style="text-align: center; margin-bottom: 1.25rem;">
          <div class="brand-icon" style="width: 48px; height: 48px; margin: 0 auto 0.5rem auto; font-size: 1.3rem;">
            <i class="fa-solid fa-money-bill-transfer"></i>
          </div>
          <h2 style="font-size: 1.25rem; font-weight: 800; color: #0f172a;">Instant Cashout</h2>
          <p style="font-size: 0.8rem; color: #64748b;">Transfer your earned festival bounties directly to your mobile wallet.</p>
        </div>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: var(--radius-md); padding: 12px; margin-bottom: 1.25rem; text-align: center;">
          <div style="font-size: 0.72rem; color: #166534; font-weight: 700; text-transform: uppercase;">Available Cashout Balance</div>
          <div class="font-mono" style="font-size: 1.8rem; font-weight: 800; color: #b45309;">₱${user.phpBalance.toFixed(2)}</div>
        </div>

        <!-- Quick Amount Select Chips -->
        <div class="form-group">
          <label class="form-label">Select Amount (₱)</label>
          <div style="display: flex; gap: 6px; margin-bottom: 8px;">
            <button class="btn btn-secondary btn-sm" style="flex: 1;" onclick="document.getElementById('withdraw-amt').value = 500;">₱500</button>
            <button class="btn btn-secondary btn-sm" style="flex: 1;" onclick="document.getElementById('withdraw-amt').value = 1000;">₱1,000</button>
            <button class="btn btn-secondary btn-sm" style="flex: 1;" onclick="document.getElementById('withdraw-amt').value = 2000;">₱2,000</button>
            <button class="btn btn-secondary btn-sm" style="flex: 1;" onclick="document.getElementById('withdraw-amt').value = ${user.phpBalance};">Max All</button>
          </div>
          <input type="number" class="form-control font-mono" id="withdraw-amt" value="${user.phpBalance > 500 ? 500 : user.phpBalance}" min="50" max="${user.phpBalance}" step="50" required />
        </div>

        <div class="form-group">
          <label class="form-label">Payout Gateway</label>
          <select class="form-control" id="withdraw-provider" onchange="window.WalletView.updateAccountField(this.value)">
            <option value="GCash">GCash Instant Payout</option>
            <option value="Maya">Maya Wallet</option>
            <option value="LandBank">LandBank PesoNet</option>
            <option value="BDO">BDO Unibank</option>
            <option value="BPI">BPI Express Online</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Recipient Mobile Number / Account #</label>
          <input type="text" class="form-control font-mono" id="withdraw-account" value="${user.payoutAccount || '0928-551-3941'}" placeholder="e.g. 0917-000-0000" required />
        </div>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: var(--radius-sm); padding: 10px; margin-bottom: 1.25rem; font-size: 0.78rem;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="color: #64748b;">Transfer Fee:</span>
            <span style="color: var(--emerald-700); font-weight: 700;">₱0.00 (Ibalong 2026 Free Promo)</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #64748b;">Estimated Processing Time:</span>
            <span style="color: #0f172a; font-weight: 700;">Instant (Under 60 seconds)</span>
          </div>
        </div>

        <button class="btn btn-gold btn-block" onclick="window.WalletView.executeWithdrawal()">
          <i class="fa-solid fa-bolt"></i> Confirm Instant Cashout
        </button>
      </div>
    `;
    window.openModal(modalHtml);
  },

  updateAccountField(provider) {
    const user = window.appState.getUser();
    const accInput = document.getElementById('withdraw-account');
    if (accInput) {
      accInput.value = user.payoutAccount || '0928-551-3941';
    }
  },

  executeWithdrawal() {
    const amt = parseFloat(document.getElementById('withdraw-amt')?.value || 0);
    const provider = document.getElementById('withdraw-provider')?.value || 'GCash';
    const account = document.getElementById('withdraw-account')?.value || '0928-551-3941';

    if (isNaN(amt) || amt <= 0) {
      window.showToast('Please enter a valid cashout amount.', 'error');
      return;
    }

    const res = window.appState.withdraw(amt, provider, account);
    if (res.success) {
      window.soundSystem.fanfare();
      window.closeModal();
      window.showToast(`₱${amt.toFixed(2)} sent to ${provider} (${account})!`, 'gold');
      window.renderRoute();
      setTimeout(() => {
        window.WalletView.openReceiptModal(res.transaction.id);
      }, 400);
    } else {
      window.showToast(res.message, 'error');
    }
  },

  openDepositModal() {
    const user = window.appState.getUser();
    const modalHtml = `
      <div class="modal-card">
        <button class="modal-close-btn" onclick="window.closeModal()"><i class="fa-solid fa-xmark"></i></button>
        <div style="text-align: center; margin-bottom: 1.25rem;">
          <div class="brand-icon" style="width: 48px; height: 48px; margin: 0 auto 0.5rem auto; font-size: 1.3rem;">
            <i class="fa-solid fa-wallet"></i>
          </div>
          <h2 style="font-size: 1.25rem; font-weight: 800; color: #0f172a;">Civic Wallet Top-Up</h2>
          <p style="font-size: 0.8rem; color: #64748b;">Add funds to pledge cleanup bounties along Ibalong Festival parade routes.</p>
        </div>

        <div class="form-group">
          <label class="form-label">Select Top-Up Amount (₱)</label>
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-bottom: 8px;">
            <button class="btn btn-secondary btn-sm" onclick="document.getElementById('deposit-amt').value = 200;">+₱200</button>
            <button class="btn btn-secondary btn-sm" onclick="document.getElementById('deposit-amt').value = 500;">+₱500</button>
            <button class="btn btn-secondary btn-sm" onclick="document.getElementById('deposit-amt').value = 1000;">+₱1,000</button>
            <button class="btn btn-secondary btn-sm" onclick="document.getElementById('deposit-amt').value = 2500;">+₱2,500</button>
          </div>
          <input type="number" class="form-control font-mono" id="deposit-amt" value="500" min="50" step="50" required />
        </div>

        <div class="form-group">
          <label class="form-label">Payment Channel</label>
          <select class="form-control" id="deposit-provider">
            <option value="GCash">GCash QR / Express Checkout</option>
            <option value="Maya">Maya Wallet QR</option>
            <option value="Card">Visa / Mastercard Debit</option>
            <option value="LandBank">LandBank Online Banking</option>
          </select>
        </div>

        <div class="card" style="padding: 12px; background: #f0fdf4; border: 1px solid #bbf7d0; margin-bottom: 1.25rem;">
          <div style="display: flex; gap: 8px;">
            <i class="fa-solid fa-gift" style="color: var(--emerald-600); font-size: 1.2rem; margin-top: 2px;"></i>
            <div style="font-size: 0.76rem; color: #166534;">
              <strong>Civic Reward Bonus:</strong> Receive 10% bonus Ibalong Clean Points with every wallet top-up!
            </div>
          </div>
        </div>

        <button class="btn btn-primary btn-block" onclick="window.WalletView.executeDeposit()">
          <i class="fa-solid fa-shield-check"></i> Authorize & Add Funds
        </button>
      </div>
    `;
    window.openModal(modalHtml);
  },

  executeDeposit() {
    const amt = parseFloat(document.getElementById('deposit-amt')?.value || 0);
    const provider = document.getElementById('deposit-provider')?.value || 'GCash';

    if (isNaN(amt) || amt <= 0) {
      window.showToast('Please enter a valid deposit amount.', 'error');
      return;
    }

    const res = window.appState.depositFunds(amt, provider);
    if (res.success) {
      window.soundSystem.fanfare();
      window.closeModal();
      window.showToast(`₱${amt.toFixed(2)} successfully added to your Civic Wallet!`, 'success');
      window.renderRoute();
      setTimeout(() => {
        window.WalletView.openReceiptModal(res.transaction.id);
      }, 400);
    }
  },

  openPaymentSettingsModal() {
    const user = window.appState.getUser();
    const modalHtml = `
      <div class="modal-card">
        <button class="modal-close-btn" onclick="window.closeModal()"><i class="fa-solid fa-xmark"></i></button>
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 1rem;">
          <div class="brand-icon" style="width: 38px; height: 38px; font-size: 1.1rem;"><i class="fa-solid fa-credit-card"></i></div>
          <div>
            <h2 style="font-size: 1.15rem; font-weight: 800; color: #0f172a;">Payment Methods</h2>
            <p style="font-size: 0.76rem; color: #64748b;">Manage your linked mobile wallets and payout accounts.</p>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 1.25rem;">
          ${(user.paymentMethods || [
            { provider: 'GCash', account: user.payoutAccount || '0928-551-3941', isDefault: true }
          ]).map(pm => `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: var(--radius-md);">
              <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fa-solid fa-mobile-screen" style="color: var(--emerald-600); font-size: 1.2rem;"></i>
                <div>
                  <div style="font-weight: 800; font-size: 0.88rem; color: #0f172a;">${pm.provider}</div>
                  <div class="font-mono" style="font-size: 0.72rem; color: #64748b;">${pm.account}</div>
                </div>
              </div>
              <span class="status-badge status-completed" style="font-size: 0.65rem;">Active / Default</span>
            </div>
          `).join('')}
        </div>

        <h4 style="font-size: 0.88rem; font-weight: 800; color: #0f172a; margin-bottom: 8px;">Link New Payment Account</h4>
        <div class="form-group">
          <label class="form-label">Provider</label>
          <select class="form-control" id="new-pm-provider">
            <option value="GCash">GCash</option>
            <option value="Maya">Maya</option>
            <option value="LandBank">LandBank</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Mobile Number / Account #</label>
          <input type="text" class="form-control font-mono" id="new-pm-account" placeholder="0917-000-0000" />
        </div>

        <button class="btn btn-primary btn-block" style="margin-top: 0.5rem;" onclick="window.WalletView.saveNewPaymentMethod()">
          <i class="fa-solid fa-plus"></i> Save Payment Method
        </button>
      </div>
    `;
    window.openModal(modalHtml);
  },

  saveNewPaymentMethod() {
    const provider = document.getElementById('new-pm-provider')?.value || 'GCash';
    const account = document.getElementById('new-pm-account')?.value || '';

    if (!account.trim()) {
      window.showToast('Please enter an account number.', 'error');
      return;
    }

    window.appState.addPaymentMethod(provider, account);
    window.soundSystem.success();
    window.closeModal();
    window.showToast(`Added ${provider} (${account}) as default payout channel!`, 'success');
    window.renderRoute();
  },

  // 4. OFFICIAL DIGITAL RECEIPT VIEWER MODAL
  openReceiptModal(txId) {
    const tx = window.appState.getTransactionById(txId);
    if (!tx) return;

    const isPositive = tx.amountPhp > 0;

    const modalHtml = `
      <div class="modal-card" style="max-width: 440px; text-align: center;">
        <button class="modal-close-btn" onclick="window.closeModal()"><i class="fa-solid fa-xmark"></i></button>

        <!-- Official Header -->
        <div style="margin-bottom: 1rem; border-bottom: 2px dashed #cbd5e1; padding-bottom: 1rem;">
          <div style="display: flex; align-items: center; justify-content: center; gap: 6px; margin-bottom: 4px;">
            <i class="fa-solid fa-leaf" style="color: var(--emerald-600); font-size: 1.2rem;"></i>
            <span style="font-weight: 800; font-size: 1.1rem; color: #0f172a;">Street<span class="gradient-text">Clean</span> Official Receipt</span>
          </div>
          <div style="font-size: 0.7rem; color: #64748b; font-weight: 600; text-transform: uppercase;">
            Ibalong Festival 2026 • City of Legazpi, Albay
          </div>
        </div>

        <!-- Status Icon with Distinct Type Logo -->
        <div style="width: 54px; height: 54px; border-radius: 50%; background: ${
          tx.type === 'bounty_payout' ? '#dcfce7' : 
          (tx.type === 'withdrawal' ? '#fee2e2' : 
          (tx.type === 'deposit' ? '#e0f2fe' : '#fef3c7'))
        }; color: ${
          tx.type === 'bounty_payout' ? 'var(--emerald-700)' : 
          (tx.type === 'withdrawal' ? '#e11d48' : 
          (tx.type === 'deposit' ? '#0284c7' : '#b45309'))
        }; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; margin: 0 auto 0.75rem auto; box-shadow: 0 4px 14px rgba(0,0,0,0.06);">
          <i class="fa-solid ${
            tx.type === 'bounty_payout' ? 'fa-sack-dollar' : 
            (tx.type === 'withdrawal' ? 'fa-money-bill-transfer' : 
            (tx.type === 'deposit' ? 'fa-wallet' : 'fa-heart-circle-plus'))
          }"></i>
        </div>

        <div style="font-size: 0.75rem; color: #64748b; text-transform: uppercase; font-weight: 700;">Transaction Amount</div>
        <div class="font-mono" style="font-size: 2rem; font-weight: 800; color: ${isPositive ? 'var(--emerald-700)' : '#e11d48'}; margin-bottom: 1rem;">
          ${isPositive ? '+' : ''}₱${Math.abs(tx.amountPhp).toFixed(2)}
        </div>

        <!-- Receipt Metadata Table -->
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: var(--radius-md); padding: 12px; font-size: 0.78rem; text-align: left; margin-bottom: 1.25rem;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span style="color: #64748b;">Reference ID:</span>
            <span class="font-mono" style="font-weight: 800; color: #0f172a;">${tx.reference || tx.id}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span style="color: #64748b;">Transaction Type:</span>
            <span style="font-weight: 700; color: #0f172a; text-transform: capitalize;">${tx.type.replace('_', ' ')}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span style="color: #64748b;">Date & Time:</span>
            <span style="color: #0f172a;">${tx.date} • ${tx.time}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span style="color: #64748b;">Payment Channel:</span>
            <span style="font-weight: 700; color: #0f172a;">${tx.channel}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span style="color: #64748b;">Beneficiary / Account:</span>
            <span style="color: #0f172a; font-weight: 600;">${tx.recipient || 'Ibalong Clean Fund'}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span style="color: #64748b;">Transaction Fee:</span>
            <span style="color: var(--emerald-700); font-weight: 700;">₱0.00 (Promo)</span>
          </div>
          <div style="display: flex; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 6px;">
            <span style="color: #64748b;">Settlement Status:</span>
            <span class="status-badge status-completed" style="font-size: 0.68rem; padding: 2px 6px;">✓ Verified & Settled</span>
          </div>
        </div>

        <!-- QR Verification Stamp -->
        <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 1.25rem;">
          <div style="width: 44px; height: 44px; background: #0f172a; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.3rem;">
            <i class="fa-solid fa-qrcode"></i>
          </div>
          <div style="text-align: left; font-size: 0.68rem; color: #64748b; line-height: 1.3;">
            Digitally certified by <strong>City ENRO Legazpi</strong><br>
            Official Ibalong 2026 Escrow Record
          </div>
        </div>

        <div style="display: flex; gap: 8px;">
          <button class="btn btn-secondary btn-block" onclick="window.showToast('Official PDF Receipt downloaded to your device.', 'success')">
            <i class="fa-solid fa-download"></i> Download PDF
          </button>
          <button class="btn btn-primary btn-block" onclick="window.closeModal()">
            Done
          </button>
        </div>

      </div>
    `;
    window.openModal(modalHtml);
  }
};
