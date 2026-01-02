// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAEx45Mt2Gqz1pzUP1q6iyWngBeJ6AYnWg",
  authDomain: "react-chat-app-8c28e.firebaseapp.com",
  projectId: "react-chat-app-8c28e",
  storageBucket: "react-chat-app-8c28e.firebasestorage.app",
  messagingSenderId: "609912468714",
  appId: "1:609912468714:web:52c5351949e03aaae21393",
  measurementId: "G-EFZYS6E3GR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth, Firestore, and Auth Provider
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();