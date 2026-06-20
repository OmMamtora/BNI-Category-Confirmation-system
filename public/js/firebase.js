import { initializeApp }
from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";

import { getFirestore }
from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

import { getAuth }
from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyB2Io2wfmaCGeKsYLFGG016jLsfUjc81k0",
    authDomain: "bni-category-confirmation.firebaseapp.com",
    projectId: "bni-category-confirmation",
    storageBucket: "bni-category-confirmation.firebasestorage.app",
    messagingSenderId: "913020315977",
    appId: "1:913020315977:web:7f3626dc0cfbabe7591298"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);