// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBALpzTlw77ZyAsuYEc3sroUN0jQ59MzpI",
  authDomain: "trackex-f617f.firebaseapp.com",
  projectId: "trackex-f617f",
  storageBucket: "trackex-f617f.appspot.com",
  messagingSenderId: "914320393506",
  appId: "1:914320393506:web:3eb9df89b3017afbbf117b",
  measurementId: "G-J28DM9BQ8H",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
