/* ==========================================================================
   StreetClean — data layer (db.js)

   TODAY: everything reads/writes to localStorage, so the app fully works
   with zero setup, offline, on any laptop.

   DAY 2: swap the *inside* of each function below for a Firestore call.
   Nothing outside this file needs to change — every page calls DB.xxx(),
   never localStorage directly. That's the whole point of this file.

   Example of what a Day-2 swap looks like, for getTasks():
     async function getTasks() {
       const snap = await getDocs(collection(db, "tasks"));
       return snap.docs.map(d => ({ id: d.id, ...d.data() }));
     }
   ========================================================================== */

const DB = (() => {
  const KEYS = {
    TASKS: "sc_tasks",
    WALLET: "sc_wallet",
    TXNS: "sc_transactions",
    ROLE: "sc_role",
  };

  // ---------- seed data (only runs once, first time the app is opened) ----------
  const SEED_TASKS = [
    {
      id: "t1",
      title: "Peñaranda Park — south entrance",
      description:
        "Plastic cups and food wrappers piled near the benches after the weekend market.",
      photoBefore: null,
      photoAfter: null,
      bounty: 150,
      status: "open", // open -> claimed -> pending_verification -> verified
      claimedBy: null,
      reporter: "Resident • M. Reyes",
      createdAt: Date.now() - 1000 * 60 * 60 * 5,
    },
    {
      id: "t2",
      title: "Legazpi Boulevard — bike lane",
      description: "Illegal dumping spotted along the boulevard bike lane, blocking part of the path.",
      photoBefore: null,
      photoAfter: null,
      bounty: 220,
      status: "open",
      claimedBy: null,
      reporter: "Business • Boulevard Cafe",
      createdAt: Date.now() - 1000 * 60 * 60 * 26,
    },
    {
      id: "t3",
      title: "Embarcadero de Legazpi — parking area",
      description: "Litter accumulating around the parking bays, mostly bottles and cigarette packs.",
      photoBefore: null,
      photoAfter: null,
      bounty: 180,
      status: "claimed",
      claimedBy: "You",
      reporter: "Resident • J. Bariga",
      createdAt: Date.now() - 1000 * 60 * 60 * 40,
    },
    {
      id: "t4",
      title: "Albay Park and Wildlife — main pathway",
      description: "Dumped construction debris along the jogging path near the east gate.",
      photoBefore: null,
      photoAfter: null,
      bounty: 300,
      status: "pending_verification",
      claimedBy: "You",
      reporter: "LGU • Barangay 42",
      createdAt: Date.now() - 1000 * 60 * 60 * 60,
    },
  ];

  function seedIfEmpty() {
    if (!localStorage.getItem(KEYS.TASKS)) {
      localStorage.setItem(KEYS.TASKS, JSON.stringify(SEED_TASKS));
    }
    if (!localStorage.getItem(KEYS.WALLET)) {
      localStorage.setItem(KEYS.WALLET, "0");
    }
    if (!localStorage.getItem(KEYS.TXNS)) {
      localStorage.setItem(KEYS.TXNS, JSON.stringify([]));
    }
    if (!localStorage.getItem(KEYS.ROLE)) {
      localStorage.setItem(KEYS.ROLE, "cleaner");
    }
  }

  function readTasks() {
    return JSON.parse(localStorage.getItem(KEYS.TASKS) || "[]");
  }

  function writeTasks(tasks) {
    localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
  }

  // ---------- public API ----------

  function getTasks() {
    return readTasks().sort((a, b) => b.createdAt - a.createdAt);
  }

  function getTaskById(id) {
    return readTasks().find((t) => t.id === id) || null;
  }

  function getOpenTasks() {
    return getTasks().filter((t) => t.status === "open");
  }

  function getMyTasks() {
    return getTasks().filter((t) => t.claimedBy === "You" && t.status !== "verified");
  }

  function getPendingVerification() {
    return getTasks().filter((t) => t.status === "pending_verification");
  }

  function getVerifiedTasks() {
    return getTasks().filter((t) => t.status === "verified");
  }

  // Report becomes a fundable commission immediately (Tier 1: reporter funds it)
  function addReport({ title, description, bounty, photoBefore }) {
    const tasks = readTasks();
    const task = {
      id: "t" + Date.now(),
      title,
      description,
      bounty: Number(bounty) || 0,
      photoBefore: photoBefore || null,
      photoAfter: null,
      status: "open",
      claimedBy: null,
      reporter: "Resident • You",
      createdAt: Date.now(),
    };
    tasks.push(task);
    writeTasks(tasks);
    return task;
  }

  function claimTask(id) {
    const tasks = readTasks();
    const task = tasks.find((t) => t.id === id);
    if (!task || task.status !== "open") return null;
    task.status = "claimed";
    task.claimedBy = "You";
    writeTasks(tasks);
    return task;
  }

  function submitProof(id, photoAfter) {
    const tasks = readTasks();
    const task = tasks.find((t) => t.id === id);
    if (!task || task.status !== "claimed") return null;
    task.photoAfter = photoAfter || null;
    task.status = "pending_verification";
    writeTasks(tasks);
    return task;
  }

  function verifyAndPay(id) {
    const tasks = readTasks();
    const task = tasks.find((t) => t.id === id);
    if (!task || task.status !== "pending_verification") return null;
    task.status = "verified";
    writeTasks(tasks);

    const balance = getWalletBalance() + task.bounty;
    localStorage.setItem(KEYS.WALLET, String(balance));

    const txns = getTransactions();
    txns.unshift({
      id: "x" + Date.now(),
      taskTitle: task.title,
      amount: task.bounty,
      date: Date.now(),
    });
    localStorage.setItem(KEYS.TXNS, JSON.stringify(txns));

    return task;
  }

  function getWalletBalance() {
    return Number(localStorage.getItem(KEYS.WALLET) || 0);
  }

  function getTransactions() {
    return JSON.parse(localStorage.getItem(KEYS.TXNS) || "[]");
  }

  function getRole() {
    return localStorage.getItem(KEYS.ROLE) || "cleaner";
  }

  function setRole(role) {
    localStorage.setItem(KEYS.ROLE, role);
  }

  function resetDemoData() {
    localStorage.removeItem(KEYS.TASKS);
    localStorage.removeItem(KEYS.WALLET);
    localStorage.removeItem(KEYS.TXNS);
    seedIfEmpty();
  }

  seedIfEmpty();

  return {
    getTasks,
    getTaskById,
    getOpenTasks,
    getMyTasks,
    getPendingVerification,
    getVerifiedTasks,
    addReport,
    claimTask,
    submitProof,
    verifyAndPay,
    getWalletBalance,
    getTransactions,
    getRole,
    setRole,
    resetDemoData,
  };
})();
