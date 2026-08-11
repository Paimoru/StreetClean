/* StreetClean shared UI */

const NAV_ITEMS = [
  { href: "index.html", label: "Home", icon: "🏠", key: "home" },
  { href: "report.html", label: "Report", icon: "📍", key: "report", role: "resident" },
  { href: "commissions.html", label: "Browse", icon: "🧹", key: "commissions", role: "cleaner" },
  { href: "my-tasks.html", label: "My Tasks", icon: "✅", key: "mytasks", role: "cleaner" },
  { href: "verify.html", label: "Verify", icon: "🔎", key: "verify", role: "verifier" },
  { href: "wallet.html", label: "Wallet", icon: "💰", key: "wallet", role: "cleaner" }
];

function renderShell(activeKey, session) {
  const headerEl = document.getElementById("app-header");
  const navEl = document.getElementById("app-nav");
  const role = session?.profile?.role || "resident";
  const name = session?.profile?.name || session?.user?.displayName || session?.user?.email || "User";

  if (headerEl) {
    headerEl.innerHTML = `
      <a class="brand" href="index.html">
        <svg class="mark" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="46" stroke="white" stroke-width="6"/>
          <path d="M50 20 L58 45 L50 40 L42 45 Z M50 40 L50 78" stroke="white" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        StreetClean
      </a>
      <div class="account-menu">
        <span class="account-name">${escapeHtml(name)}</span>
        <button class="header-logout" id="logout-btn">Log out</button>
      </div>
    `;

    document.getElementById("logout-btn").addEventListener("click", async () => {
      await AuthModule.logoutUser();
      window.location.href = "index.html";
    });
  }

  if (navEl) {
    navEl.innerHTML = NAV_ITEMS
      .filter((item) => !item.role || item.role === role || item.key === "home")
      .map((item) => `
        <a href="${item.href}" class="${item.key === activeKey ? "active" : ""}">
          <span class="icon">${item.icon}</span>${item.label}
        </a>
      `).join("");
  }
}

async function startPage(activeKey, callback, allowedRoles = null) {
  const session = allowedRoles
    ? await AuthModule.requireRole(allowedRoles)
    : await AuthModule.requireAuth();

  if (!session) return;

  renderShell(activeKey, session);
  await DB.ensureSeedData();
  await callback(session);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
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
  const mins = Math.max(0, Math.floor((Date.now() - ts) / 60000));
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
    verified: ["badge-verified", "Verified & Paid"]
  };
  const [cls, label] = map[status] || ["badge-open", status];
  return `<span class="badge ${cls}">${label}</span>`;
}

/* Compress images before saving them into Firestore.
   This avoids needing Firebase Storage for the prototype. */
function readImageAsDataURL(fileInput, callback) {
  const file = fileInput.files && fileInput.files[0];
  if (!file) return callback(null);

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const maxSize = 700;
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      callback(canvas.toDataURL("image/jpeg", 0.62));
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}
