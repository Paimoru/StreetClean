/* ==========================================================================
   StreetClean — Firestore data layer

   All persistent data is stored in Firebase Firestore.
   Firebase Authentication supplies the account UID used to associate
   every action with the correct user.

   Photos are compressed client-side and stored as small data URLs in the
   task document. This keeps the prototype working without Firebase Storage.
   ========================================================================== */

const DB = (() => {
  const SEED_TASKS = [
    {
      id: "t1",
      title: "Peñaranda Park — south entrance",
      description: "Plastic cups and food wrappers piled near the benches after the weekend market.",
      photoBefore: null,
      photoAfter: null,
      bounty: 150,
      status: "open",
      claimedBy: null,
      claimedByName: null,
      reporterId: "seed",
      reporterName: "M. Reyes",
      createdAt: firebase.firestore.Timestamp.fromMillis(Date.now() - 1000 * 60 * 60 * 5)
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
      claimedByName: null,
      reporterId: "seed",
      reporterName: "Boulevard Cafe",
      createdAt: firebase.firestore.Timestamp.fromMillis(Date.now() - 1000 * 60 * 60 * 26)
    },
    {
      id: "t3",
      title: "Embarcadero de Legazpi — parking area",
      description: "Litter accumulating around the parking bays, mostly bottles and cigarette packs.",
      photoBefore: null,
      photoAfter: null,
      bounty: 180,
      status: "claimed",
      claimedBy: null,
      claimedByName: "Demo cleaner",
      reporterId: "seed",
      reporterName: "J. Bariga",
      createdAt: firebase.firestore.Timestamp.fromMillis(Date.now() - 1000 * 60 * 60 * 40)
    },
    {
      id: "t4",
      title: "Albay Park and Wildlife — main pathway",
      description: "Dumped construction debris along the jogging path near the east gate.",
      photoBefore: null,
      photoAfter: null,
      bounty: 300,
      status: "pending_verification",
      claimedBy: null,
      claimedByName: "Demo cleaner",
      reporterId: "seed",
      reporterName: "Barangay 42",
      createdAt: firebase.firestore.Timestamp.fromMillis(Date.now() - 1000 * 60 * 60 * 60)
    }
  ];

  function currentUser() {
    const user = AuthModule.getCurrentUser();
    if (!user) throw new Error("Please log in first.");
    return user;
  }

  function toTask(doc) {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt && data.createdAt.toMillis
        ? data.createdAt.toMillis()
        : Date.now()
    };
  }

  async function ensureSeedData() {
    const snap = await firestore.collection("tasks").limit(1).get();
    if (!snap.empty) return;

    const batch = firestore.batch();
    SEED_TASKS.forEach((task) => {
      const ref = firestore.collection("tasks").doc(task.id);
      batch.set(ref, task);
    });
    await batch.commit();
  }

  async function getTasks() {
    const snap = await firestore.collection("tasks").orderBy("createdAt", "desc").get();
    return snap.docs.map(toTask);
  }

  async function getTaskById(id) {
    const doc = await firestore.collection("tasks").doc(id).get();
    return doc.exists ? toTask(doc) : null;
  }

  async function getOpenTasks() {
    return (await getTasks()).filter((t) => t.status === "open");
  }

  async function getMyTasks() {
    const uid = currentUser().uid;
    return (await getTasks()).filter(
      (t) => t.claimedBy === uid && t.status !== "verified"
    );
  }

  async function getPendingVerification() {
    return (await getTasks()).filter((t) => t.status === "pending_verification");
  }

  async function getVerifiedTasks() {
    return (await getTasks()).filter((t) => t.status === "verified");
  }

  async function addReport({ title, description, bounty, photoBefore }) {
    const user = currentUser();
    const profile = await AuthModule.getUserProfile(user.uid);
    const ref = firestore.collection("tasks").doc();

    const task = {
      title: title.trim(),
      description: description.trim(),
      bounty: Number(bounty) || 0,
      photoBefore: photoBefore || null,
      photoAfter: null,
      status: "open",
      claimedBy: null,
      claimedByName: null,
      reporterId: user.uid,
      reporterName: profile?.name || user.displayName || user.email,
      createdAt: firebase.firestore.Timestamp.now()
    };

    await ref.set(task);
    return { id: ref.id, ...task, createdAt: Date.now() };
  }

  async function claimTask(id) {
    const user = currentUser();
    const profile = await AuthModule.getUserProfile(user.uid);
    const ref = firestore.collection("tasks").doc(id);

    const result = await firestore.runTransaction(async (tx) => {
      const doc = await tx.get(ref);
      if (!doc.exists) return null;

      const task = doc.data();
      if (task.status !== "open") return null;

      tx.update(ref, {
        status: "claimed",
        claimedBy: user.uid,
        claimedByName: profile?.name || user.displayName || user.email
      });

      return { id: doc.id, ...task };
    });

    return result;
  }

  async function submitProof(id, photoAfter) {
    const user = currentUser();
    const ref = firestore.collection("tasks").doc(id);

    const result = await firestore.runTransaction(async (tx) => {
      const doc = await tx.get(ref);
      if (!doc.exists) return null;

      const task = doc.data();
      if (task.status !== "claimed" || task.claimedBy !== user.uid) return null;

      tx.update(ref, {
        photoAfter: photoAfter || null,
        status: "pending_verification"
      });

      return { id: doc.id, ...task };
    });

    return result;
  }

  async function verifyAndPay(id) {
    const user = currentUser();
    const profile = await AuthModule.getUserProfile(user.uid);
    if (profile?.role !== "verifier") throw new Error("Only verifiers can approve payments.");

    const taskRef = firestore.collection("tasks").doc(id);
    const txnRef = firestore.collection("transactions").doc();

    await firestore.runTransaction(async (tx) => {
      const doc = await tx.get(taskRef);
      if (!doc.exists) throw new Error("Task not found.");

      const task = doc.data();
      if (task.status !== "pending_verification") {
        throw new Error("This task is no longer waiting for verification.");
      }

      tx.update(taskRef, {
        status: "verified",
        verifiedBy: user.uid,
        verifiedByName: profile.name || user.email,
        verifiedAt: firebase.firestore.Timestamp.now()
      });

      tx.set(txnRef, {
        taskId: id,
        taskTitle: task.title,
        cleanerId: task.claimedBy,
        amount: Number(task.bounty) || 0,
        date: firebase.firestore.Timestamp.now(),
        verifiedBy: user.uid
      });
    });

    return true;
  }

  async function getWalletBalance() {
    const user = currentUser();
    const snap = await firestore.collection("transactions")
      .where("cleanerId", "==", user.uid)
      .get();

    return snap.docs.reduce((sum, doc) => sum + (Number(doc.data().amount) || 0), 0);
  }

  async function getTransactions() {
    const user = currentUser();
    const snap = await firestore.collection("transactions")
      .where("cleanerId", "==", user.uid)
      .get();

    return snap.docs
      .map((doc) => {
        const x = doc.data();
        return {
          id: doc.id,
          ...x,
          date: x.date?.toMillis ? x.date.toMillis() : Date.now()
        };
      })
      .sort((a, b) => b.date - a.date);
  }

  async function getRole() {
    const user = currentUser();
    const profile = await AuthModule.getUserProfile(user.uid);
    return profile?.role || "resident";
  }

  async function setRole(role) {
    const user = currentUser();
    await firestore.collection("users").doc(user.uid).update({ role });
  }

  return {
    ensureSeedData,
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
    setRole
  };
})();
