
import { initializeApp } from 'firebase/app';

import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider
} from 'firebase/auth';

// Kindred Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB7Chh28yRldP0BsREb16WHBNYwz1WBgfs",
  authDomain: "kindred-b7860.firebaseapp.com",
  projectId: "kindred-b7860",
  storageBucket: "kindred-b7860.firebasestorage.app",
  messagingSenderId: "389245462102",
  appId: "1:389245462102:web:a7e26a451bfe028d6a3df7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Google authentication
export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Microsoft / Outlook authentication
export const microsoftProvider = new OAuthProvider('microsoft.com');

microsoftProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;
