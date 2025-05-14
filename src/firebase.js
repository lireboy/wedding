import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

console.log("🔍 Firebase ENV Check:");
console.log("API KEY:", process.env.GATSBY_FIREBASE_API_KEY);
console.log("PROJECT ID:", process.env.GATSBY_FIREBASE_PROJECT_ID);
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.GATSBY_FIREBASE_API_KEY,
  authDomain: process.env.GATSBY_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.GATSBY_FIREBASE_PROJECT_ID,
  storageBucket: process.env.GATSBY_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.GATSBY_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.GATSBY_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export default db;