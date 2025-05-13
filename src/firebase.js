import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB9q0xpwXaKbl0--5r47JBDwvPxj0Gn58o",
  authDomain: "hochzeit-rsvp.firebaseapp.com",
  projectId: "hochzeit-rsvp",
  storageBucket: "hochzeit-rsvp.firebasestorage.app",
  messagingSenderId: "1059115959541",
  appId: "1:1059115959541:web:eb13fd3a3b43eae824b1bc"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export default db;