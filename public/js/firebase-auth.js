// import { auth } from './firebase.js';

// import {
//  signInWithEmailAndPassword,
//  signOut
// }
// from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

// export async function login(email,password){

//     return await signInWithEmailAndPassword(
//         auth,
//         email,
//         password
//     );

// }

// export async function logout(){

//     return await signOut(auth);

// }

import { auth } from './firebase.js';
import { signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

export async function login(email, password) {
    return await signInWithEmailAndPassword(auth, email, password);
}

export async function logout() {
    return await signOut(auth);
}
