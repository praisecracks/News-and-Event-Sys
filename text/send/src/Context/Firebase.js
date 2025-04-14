import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// Initialize Firebase
const firebaseConfig = {
  apiKey:"AIzaSyAkntOz7mgnHViW7hYwG9OFi9EzAtV7SoM",
  authDomain:"findme-fuoye.firebaseapp.com",
  projectId:"findme-fuoye",
  storageBucket:"findme-fuoye.appspot.com",
  messagingSenderId:"210780144018",
  appId:"1:210780144018:web:51ee1081b990974439014b",
  measurementId:"G-P3WT478E7J",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();

