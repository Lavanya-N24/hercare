import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyBCL8FEiatZNQXNhsF0uACB-veUgzoiyCE",
    authDomain: "hercare-app-aa20b.firebaseapp.com",
    projectId: "hercare-app-aa20b",
    storageBucket: "hercare-app-aa20b.firebasestorage.app",
    messagingSenderId: "155313359731",
    appId: "1:155313359731:web:c57706a751845b456bd306",
    measurementId: "G-M1T5ESZT23"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');
// Always show account picker, even if user is already signed in
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Cloud Firestore
export const db = getFirestore(app);

export default app;