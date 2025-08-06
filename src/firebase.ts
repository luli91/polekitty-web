import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB-EyEGA_3azz2PurbnPSFrWe5rZeTtq5A",
  authDomain: "polekitty.firebaseapp.com",
  projectId: "polekitty",
  storageBucket: "polekitty.firebasestorage.app",
  messagingSenderId: "518917396704",
  appId: "1:518917396704:web:966d2a7b82e5df2ad11885",
  measurementId: "G-GXFZYY9Q5B"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
