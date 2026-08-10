// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCxKpvlp0QpAhcBuqHWIPaHzEUdUp1qGQY",
  authDomain: "streetclean-bda54.firebaseapp.com",
  projectId: "streetclean-bda54",
  storageBucket: "streetclean-bda54.firebasestorage.app",
  messagingSenderId: "443391008611",
  appId: "1:443391008611:web:4095ddf58c54a0795b7d56",
  measurementId: "G-T8H7YP3TLZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);