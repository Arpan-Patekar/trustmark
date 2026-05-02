import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyArT-dO6-RkCmBgCOLjoaegx8Qrmgzmlhc",
  authDomain: "trustmark-9a17a.firebaseapp.com",
  projectId: "trustmark-9a17a",
  storageBucket: "trustmark-9a17a.firebasestorage.app",
  messagingSenderId: "679744529673",
  appId: "1:679744529673:web:8c416f574118ce126cdfd8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);