/* ==========================================================================
   StreetClean — shared UI helpers (app.js)
   Renders the header + bottom nav into every page, so you only edit
   the nav in ONE place. Include this after db.js on every page.
   ========================================================================== */

const NAV_ITEMS = [
  { href: "index.html", label: "Home", icon: "🏠", key: "home" },
  { href: "report.html", label: "Report", icon: "📍", key: "report" },
  { href: "commissions.html", label: "Browse", icon: "🧹", key: "commissions" },
  { href: "my-tasks.html", label: "My Tasks", icon: "✅", key: "mytasks" },
  { href: "verify.html", label: "Verify", icon: "🔎", key: "verify" },
  { href: "wallet.html", label: "Wallet", icon: "💰", key: "wallet" },
];

function renderShell(activeKey) {
  const headerEl = document.getElementById("app-header");
  const navEl = document.getElementById("app-nav");

  if (headerEl) {
    headerEl.innerHTML = `
      <a class="brand" href="index.html">
        <svg class="mark" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="46" stroke="white" stroke-width="6"/>
          <path d="M50 20 L58 45 L50 40 L42 45 Z M50 40 L50 78" stroke="white" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        StreetClean
      </a>
      <div class="role-picker">
        <select id="role-select" aria-label="Switch role view">
          <option value="cleaner">View as: Cleaner</option>
          <option value="resident">View as: Resident</option>
          <option value="verifier">View as: Verifier</option>
        </select>
      </div>
    `;
    const roleSelect = document.getElementById("role-select");
    roleSelect.value = DB.getRole();
    roleSelect.addEventListener("change", (e) => {
      DB.setRole(e.target.value);
      showToast("Now viewing as " + e.target.options[e.target.selectedIndex].text.replace("View as: ", ""));
    });
  }

  if (navEl) {
    navEl.innerHTML = NAV_ITEMS.map(
      (item) => `
        <a href="${item.href}" class="${item.key === activeKey ? "active" : ""}">
          <span class="icon">${item.icon}</span>${item.label}
        </a>`
    ).join("");
  }
}

function showToast(message) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function timeAgo(ts) {
  const mins = Math.floor((Date.now() - ts) / 60000);
  if (mins < 60) return mins + "m ago";
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + "h ago";
  return Math.floor(hrs / 24) + "d ago";
}

function badgeFor(status) {
  const map = {
    open: ["badge-open", "Open"],
    claimed: ["badge-claimed", "Claimed"],
    pending_verification: ["badge-pending", "Pending review"],
    verified: ["badge-verified", "Verified & Paid"],
  };
  const [cls, label] = map[status] || ["badge-open", status];
  return `<span class="badge ${cls}">${label}</span>`;
}

// Reads a <input type="file"> image and hands back a base64 data URL
function readImageAsDataURL(fileInput, callback) {
  const file = fileInput.files && fileInput.files[0];
  if (!file) return callback(null);
  const reader = new FileReader();
  reader.onload = (e) => callback(e.target.result);
  reader.readAsDataURL(file);
}
