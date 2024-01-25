// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBV9tiKKQRNFvkiNkJeZkHrZQNfyi4W4g4",
  authDomain: "expenses-tracker-4412a.firebaseapp.com",
  projectId: "expenses-tracker-4412a",
  storageBucket: "expenses-tracker-4412a.appspot.com",
  messagingSenderId: "958955138054",
  appId: "1:958955138054:web:ec7d7acbc0f7b37b61e787",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
