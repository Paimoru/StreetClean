/* ==========================================================================
   StreetClean — Firebase config

   Paste your team's config object from:
   Firebase console -> Project settings -> Your apps -> (</>) web app

   Only ONE person needs to create the project; everyone on the team
   uses the same config values here.
   ========================================================================== */

const firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY",
  authDomain: "PASTE_YOUR_PROJECT.firebaseapp.com",
  projectId: "PASTE_YOUR_PROJECT_ID",
  storageBucket: "PASTE_YOUR_PROJECT.appspot.com",
  messagingSenderId: "PASTE_YOUR_SENDER_ID",
  appId: "PASTE_YOUR_APP_ID",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const firestore = firebase.firestore();
