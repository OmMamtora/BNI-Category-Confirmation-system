// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: process.env.FIREBASE_API_KEY || "AIzaSyB2Io2wfmaCGeKsYLFGG016jLsfUjc81k0",
//   authDomain: process.env.FIREBASE_AUTH_DOMAIN || "bni-category-confirmation.firebaseapp.com",
//   projectId: process.env.FIREBASE_PROJECT_ID || "bni-category-confirmation",
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "bni-category-confirmation.firebasestorage.app",
//   messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "913020315977",
//   appId: process.env.FIREBASE_APP_ID || "1:913020315977:web:7f3626dc0cfbabe7591298"
// };

// const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);
// export const auth = getAuth(app);

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  throw new Error(
    'Missing Firebase config. Set FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, ' +
    'FIREBASE_PROJECT_ID, FIREBASE_STORAGE_BUCKET, FIREBASE_MESSAGING_SENDER_ID ' +
    'and FIREBASE_APP_ID in your .env file.'
  );
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
