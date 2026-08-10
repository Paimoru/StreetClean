/* ==========================================================================
   StreetClean — auth.js  (Member 2's file)

   Covers: registration, login, sessions, roles, and page-level access control.
   Include AFTER the firebase SDK scripts + firebase-config.js on every page
   that needs auth (which is basically every page except maybe a landing page).
   ========================================================================== */

const AuthModule = (() => {
  // ---------- Registration ----------
  // Creates the login credential in Firebase Auth, THEN creates a matching
  // profile doc in Firestore that holds the role (Auth itself has no concept
  // of "roles" - that's on us to store).
  async function registerUser(name, email, password, role) {
    const cred = await auth.createUserWithEmailAndPassword(email, password);
    const uid = cred.user.uid;

    await firestore.collection("users").doc(uid).set({
      name,
      email,
      role, // "resident" | "cleaner" | "verifier"
      walletBalance: 0,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    await cred.user.updateProfile({ displayName: name });
    return cred.user;
  }

  // ---------- Login ----------
  async function loginUser(email, password) {
    const cred = await auth.signInWithEmailAndPassword(email, password);
    return cred.user;
  }

  // ---------- Sessions ----------
  // Firebase persists the session in the browser automatically - you don't
  // write any session code. This just gives you an easy way to react when
  // the login state changes (page load, login, logout, tab reopened, etc).
  function onAuthChange(callback) {
    return auth.onAuthStateChanged(callback);
  }

  function logoutUser() {
    return auth.signOut();
  }

  function getCurrentUser() {
    return auth.currentUser;
  }

  // ---------- Roles ----------
  // Fetches the profile doc (name, role, walletBalance) for a given uid.
  async function getUserProfile(uid) {
    const doc = await firestore.collection("users").doc(uid).get();
    return doc.exists ? doc.data() : null;
  }

  // ---------- Access control ----------
  // Drop this at the top of any page's <script> that should require login.
  // Redirects to login.html if nobody's signed in. Resolves with the
  // logged-in user's profile (including role) once ready.
  function requireAuth() {
    return new Promise((resolve) => {
      onAuthChange(async (user) => {
        if (!user) {
          window.location.href = "login.html";
          return;
        }
        const profile = await getUserProfile(user.uid);
        resolve({ user, profile });
      });
    });
  }

  // Convenience: redirect away from a page unless the user has one of the
  // allowed roles. Example: requireRole(["verifier"]) on verify.html.
  async function requireRole(allowedRoles) {
    const { user, profile } = await requireAuth();
    if (!profile || !allowedRoles.includes(profile.role)) {
      alert("You don't have access to this page with your current role.");
      window.location.href = "index.html";
      return null;
    }
    return { user, profile };
  }

  return {
    registerUser,
    loginUser,
    logoutUser,
    onAuthChange,
    getCurrentUser,
    getUserProfile,
    requireAuth,
    requireRole,
  };
})();
