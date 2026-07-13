import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyASdSkBtubHcw_QY1bxEfQcURWW_POnMek",
  authDomain: "cotizadorled.firebaseapp.com",
  projectId: "cotizadorled",
  storageBucket: "cotizadorled.firebasestorage.app",
  messagingSenderId: "20531297803",
  appId: "1:20531297803:web:27793dde3962c2919a910e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
