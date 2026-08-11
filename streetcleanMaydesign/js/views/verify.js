/**
 * StreetClean | Ibalong Festival 2026 (Legazpi City)
 * Verification & Marshall Audit View Component (White & Green Theme)
 * Responsive layout with perfectly fitting mobile action buttons and audit controls.
 */

window.VerifyView = {
  render() {
    const user = window.appState.getUser();
    const pendingReviews = window.appState.getCommissions('in_review');
    const completedCleans = window.appState.getCommissions('completed');

    return `
      <div class="verify-view animate-fade-in" style="padding: 1rem 0 2.5rem 0;">
        <div class="app-container" style="max-width: 800px;">

          <!-- Verifier Status Banner -->
          <div class="card card-gold-glow" style="padding: 1rem 1.25rem; margin-bottom: 1.25rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; background: #ffffff; border: 1px solid #bbf7d0;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 40px; height: 40px; border-radius: var(--radius-full); background: #fef3c7; color: #b45309; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0;">
                <i class="fa-solid fa-shield-halved"></i>
              </div>
              <div>
                <div style="font-size: 0.7rem; color: #b45309; text-transform: uppercase; font-weight: 800; letter-spacing: 0.05em;">
                  Sanitation Audit Hub
                </div>
                <div style="font-size: 0.95rem; font-weight: 800; color: #0f172a;">
                  ${user.name} • <span style="color: var(--emerald-700);">${user.badgeLevel || 'Marshall'}</span>
                </div>
              </div>
            </div>

            <div style="display: flex; gap: 8px;">
              <div class="card" style="padding: 4px 10px; background: #f8fafc; text-align: center; border: 1px solid #e2e8f0;">
                <div style="font-size: 0.62rem; color: #64748b; font-weight: 700;">Pending</div>
                <div class="font-mono" style="font-size: 1rem; font-weight: 800; color: #b45309;">${pendingReviews.length}</div>
              </div>
              <div class="card" style="padding: 4px 10px; background: #f8fafc; text-align: center; border: 1px solid #e2e8f0;">
                <div style="font-size: 0.62rem; color: #64748b; font-weight: 700;">Approved</div>
                <div class="font-mono" style="font-size: 1rem; font-weight: 800; color: var(--emerald-600);">${completedCleans.length}</div>
              </div>
            </div>
          </div>

          <!-- Pending Verifications Queue -->
          <div style="margin-bottom: 1.5rem;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
              <h2 style="font-size: 1.05rem; font-weight: 800; display: flex; align-items: center; gap: 8px; color: #0f172a;">
                <i class="fa-solid fa-clipboard-check" style="color: var(--emerald-600);"></i> Awaiting Verification (${pendingReviews.length})
              </h2>
            </div>

            ${pendingReviews.length === 0 ? `
              <div class="card" style="text-align: center; padding: 2.5rem 1.25rem; background: #ffffff;">
                <i class="fa-solid fa-circle-check" style="font-size: 2.5rem; color: var(--emerald-600); margin-bottom: 0.5rem;"></i>
                <h3 style="font-size: 1.05rem; margin-bottom: 4px; color: #0f172a;">All Cleanups Verified!</h3>
                <p style="font-size: 0.78rem; color: #64748b; max-width: 320px; margin: 0 auto;">
                  No pending proof submissions in the queue. New submissions from cleaners will appear here.
                </p>
              </div>
            ` : `
              <div style="display: flex; flex-direction: column; gap: 12px;">
                ${pendingReviews.map(c => this.renderVerificationCard(c)).join('')}
              </div>
            `}
          </div>

          <!-- Recently Verified History -->
          <div>
            <h3 style="font-size: 0.95rem; font-weight: 800; margin-bottom: 0.75rem; color: #0f172a;">
              <i class="fa-solid fa-clock-rotate-left" style="color: var(--emerald-600);"></i> Recently Verified & Escrow Released
            </h3>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${completedCleans.map(c => `
                <div class="card" style="padding: 10px 12px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; background: #ffffff; border: 1px solid #e2e8f0;">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <img src="${c.imageAfter}" style="width: 38px; height: 38px; border-radius: var(--radius-sm); object-fit: cover; border: 1.5px solid var(--emerald-500); flex-shrink: 0;" />
                    <div>
                      <div style="font-weight: 800; font-size: 0.85rem; color: #0f172a;">${c.title}</div>
                      <div style="font-size: 0.7rem; color: #64748b;"><i class="fa-solid fa-location-dot" style="color: var(--emerald-600);"></i> ${c.sector} • Cleaned by ${c.assignedTo}</div>
                    </div>
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="font-mono" style="font-weight: 800; color: #b45309; font-size: 0.9rem;">₱${c.rewardPhp}</span>
                    <span class="status-badge status-completed" style="font-size: 0.65rem; padding: 2px 6px;"><i class="fa-solid fa-check"></i> Approved</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

        </div>
      </div>
    `;
  },

  renderVerificationCard(c) {
    const proof = c.proofData || {
      weightRecordedKg: c.estimatedWeightKg,
      facilityManifestId: 'LGU-MRF-2026-088',
      exifGpsMatch: 99.8,
      aiCleanlinessScore: 99.2,
      submittedAt: 'Just now',
      cleanerNotes: 'Completed cleanup.'
    };

    return `
      <div class="card card-gold-glow" style="padding: 1rem; background: #ffffff; border: 1px solid #bbf7d0;">
        
        <!-- Header Info -->
        <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; margin-bottom: 0.85rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 3px;">
              <span class="status-badge status-in_review"><span class="badge-dot"></span> Needs Review</span>
              <span class="font-mono" style="font-size: 0.68rem; color: #64748b;">${c.id}</span>
            </div>
            <h3 style="font-size: 1rem; font-weight: 800; color: #0f172a; line-height: 1.3;">${c.title}</h3>
            <p style="font-size: 0.74rem; color: #64748b;"><i class="fa-solid fa-map-pin" style="color: var(--emerald-600);"></i> ${c.address}</p>
          </div>
          <div style="text-align: right; flex-shrink: 0;">
            <div class="font-mono" style="font-size: 1.2rem; font-weight: 800; color: #b45309;">₱${c.rewardPhp.toFixed(0)}</div>
            <div style="font-size: 0.68rem; color: var(--emerald-700); font-weight: 700;">+${c.cleanPoints} pts</div>
          </div>
        </div>

        <!-- Interactive Before / After Split Slider -->
        <div style="margin-bottom: 1rem;">
          <div style="display: flex; justify-content: space-between; font-size: 0.72rem; font-weight: 700; margin-bottom: 4px;">
            <span style="color: #e11d48;"><i class="fa-solid fa-arrow-left"></i> Before</span>
            <span style="color: #64748b; font-size: 0.68rem;">Drag split slider</span>
            <span style="color: var(--emerald-700);">After <i class="fa-solid fa-arrow-right"></i></span>
          </div>

          <div class="before-after-container" id="slider-wrap-${c.id}" style="height: 220px;">
            <img src="${c.imageAfter}" class="before-after-img" alt="After Clean" />
            <div class="after-badge-label"><i class="fa-solid fa-sparkles"></i> Cleaned</div>
            
            <div class="before-img-wrap" id="before-crop-${c.id}">
              <img src="${c.imageBefore}" id="before-img-${c.id}" class="before-after-img" alt="Before Litter" />
              <div class="before-badge-label"><i class="fa-solid fa-trash-can"></i> Littered</div>
            </div>

            <div class="slider-handle" id="slider-handle-${c.id}">
              <i class="fa-solid fa-arrows-left-right"></i>
            </div>

            <input type="range" min="0" max="100" value="50" class="slider-range-input" oninput="window.VerifyView.handleSlider('${c.id}', this.value)" />
          </div>
        </div>

        <!-- Automated LGU Compliance Audit Chips -->
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: var(--radius-sm); padding: 8px 10px; margin-bottom: 0.85rem;">
          <div style="font-size: 0.68rem; font-weight: 800; color: #0f172a; text-transform: uppercase; margin-bottom: 6px;">
            <i class="fa-solid fa-microchip" style="color: var(--emerald-600);"></i> Sanitation Audit Checklist
          </div>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px;">
            <div style="background: #ffffff; padding: 4px 8px; border-radius: var(--radius-xs); border: 1px solid #e2e8f0;">
              <div style="font-size: 0.6rem; color: #64748b;">GPS Match</div>
              <div style="font-size: 0.76rem; font-weight: 800; color: var(--emerald-700);">✓ ${proof.exifGpsMatch}%</div>
            </div>
            <div style="background: #ffffff; padding: 4px 8px; border-radius: var(--radius-xs); border: 1px solid #e2e8f0;">
              <div style="font-size: 0.6rem; color: #64748b;">AI Score</div>
              <div style="font-size: 0.76rem; font-weight: 800; color: var(--emerald-700);">✓ ${proof.aiCleanlinessScore}% Passed</div>
            </div>
            <div style="background: #ffffff; padding: 4px 8px; border-radius: var(--radius-xs); border: 1px solid #e2e8f0;">
              <div style="font-size: 0.6rem; color: #64748b;">MRF Weight</div>
              <div style="font-size: 0.76rem; font-weight: 800; color: #0f172a;">${proof.weightRecordedKg} kg Verified</div>
            </div>
            <div style="background: #ffffff; padding: 4px 8px; border-radius: var(--radius-xs); border: 1px solid #e2e8f0;">
              <div style="font-size: 0.6rem; color: #64748b;">Manifest</div>
              <div class="font-mono" style="font-size: 0.68rem; font-weight: 700; color: #b45309; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${proof.facilityManifestId}</div>
            </div>
          </div>
        </div>

        <!-- Cleaner Note -->
        <div style="font-size: 0.74rem; color: #475569; margin-bottom: 1rem; font-style: italic; background: #f0fdf4; padding: 6px 10px; border-radius: var(--radius-xs); border-left: 3px solid var(--emerald-500);">
          "${proof.cleanerNotes}" — <strong>${c.assignedTo}</strong>
        </div>

        <!-- Perfectly Fitting Mobile Action Buttons -->
        <div style="display: flex; gap: 8px; width: 100%; box-sizing: border-box;">
          <button class="btn btn-secondary" style="flex: 1; min-width: 0; padding: 8px 6px; font-size: 0.78rem; color: #e11d48; border-color: #fecdd3; background: #fff1f2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" onclick="window.VerifyView.rejectProof('${c.id}')">
            <i class="fa-solid fa-rotate-left"></i> Reject
          </button>
          <button class="btn btn-primary" style="flex: 1.5; min-width: 0; padding: 8px 6px; font-size: 0.78rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" onclick="window.VerifyView.approveProof('${c.id}')">
            <i class="fa-solid fa-stamp"></i> Approve ₱${c.rewardPhp.toFixed(0)}
          </button>
        </div>

      </div>
    `;
  },

  handleSlider(id, val) {
    const wrap = document.getElementById(`before-crop-${id}`);
    const handle = document.getElementById(`slider-handle-${id}`);
    const beforeImg = document.getElementById(`before-img-${id}`);
    const container = document.getElementById(`slider-wrap-${id}`);

    if (wrap && handle && container) {
      wrap.style.width = `${val}%`;
      handle.style.left = `${val}%`;
      if (beforeImg) {
        beforeImg.style.width = `${container.offsetWidth}px`;
      }
    }
  },

  approveProof(id) {
    const success = window.appState.verifyProof(id, true);
    if (success) {
      window.soundSystem.fanfare();
      window.showToast('Escrow Payout Approved! ₱ Bounty & Clean Points released to cleaner.', 'gold');
      window.renderRoute();
    }
  },

  rejectProof(id) {
    const modalHtml = `
      <div class="modal-card" style="max-width: 400px;">
        <button class="modal-close-btn" onclick="window.closeModal()"><i class="fa-solid fa-xmark"></i></button>
        <div style="text-align: center; margin-bottom: 1rem;">
          <div style="width: 44px; height: 44px; border-radius: 50%; background: #fee2e2; color: #e11d48; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; margin: 0 auto 0.5rem auto;">
            <i class="fa-solid fa-rotate-left"></i>
          </div>
          <h3 style="font-size: 1.1rem; font-weight: 800; color: #0f172a;">Request Re-Clean</h3>
          <p style="font-size: 0.78rem; color: #64748b;">Specify what was missed so the cleaner can correct it and resubmit.</p>
        </div>

        <div class="form-group">
          <label class="form-label">Notes for Cleaner</label>
          <textarea class="form-control" id="reject-notes-input" rows="3" placeholder="e.g. Litter residue still visible near street curb. Please sweep thoroughly." required></textarea>
        </div>

        <div style="display: flex; gap: 8px;">
          <button class="btn btn-secondary btn-block" onclick="window.closeModal()">Cancel</button>
          <button class="btn btn-block" style="background: #e11d48; color: #ffffff; border: none;" onclick="window.VerifyView.confirmReject('${id}')">
            Submit Re-Clean
          </button>
        </div>
      </div>
    `;
    window.openModal(modalHtml);
  },

  confirmReject(id) {
    const notes = document.getElementById('reject-notes-input')?.value || 'Incomplete cleanup proof.';
    window.appState.verifyProof(id, false, notes);
    window.closeModal();
    window.showToast('Task returned to cleaner for re-cleaning.', 'error');
    window.renderRoute();
  }
};
