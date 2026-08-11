/* StreetClean authentication */
const AuthModule = (() => {
  async function registerUser(name, email, password, role) {
    const cred = await auth.createUserWithEmailAndPassword(email.trim(), password);
    const uid = cred.user.uid;

    await firestore.collection("users").doc(uid).set({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      createdAt: firebase.firestore.Timestamp.now()
    });

    await cred.user.updateProfile({ displayName: name.trim() });
    return cred.user;
  }

  async function loginUser(email, password) {
    const cred = await auth.signInWithEmailAndPassword(email.trim(), password);
    return cred.user;
  }

  function onAuthChange(callback) {
    return auth.onAuthStateChanged(callback);
  }

  function logoutUser() {
    return auth.signOut();
  }

  function getCurrentUser() {
    return auth.currentUser;
  }

  async function getUserProfile(uid) {
    const doc = await firestore.collection("users").doc(uid).get();
    return doc.exists ? doc.data() : null;
  }

  function requireAuth() {
    return new Promise((resolve) => {
      const unsubscribe = onAuthChange(async (user) => {
        unsubscribe();
        if (!user) {
          window.location.href = "index.html";
          return;
        }
        const profile = await getUserProfile(user.uid);
        resolve({ user, profile });
      });
    });
  }

  async function requireRole(allowedRoles) {
    const session = await requireAuth();
    if (!session) return null;

    if (!session.profile || !allowedRoles.includes(session.profile.role)) {
      alert("You don't have access to this page with your current role.");
      window.location.href = "index.html";
      return null;
    }

    return session;
  }

  return {
    registerUser,
    loginUser,
    logoutUser,
    onAuthChange,
    getCurrentUser,
    getUserProfile,
    requireAuth,
    requireRole
  };
})();
