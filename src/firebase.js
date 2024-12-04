// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCEapGXVX3Ozr_A2idXSYp312ZCmZV35RQ",
  authDomain: "uwb-gold-brew.firebaseapp.com",
  databaseURL: "https://uwb-gold-brew-default-rtdb.firebaseio.com",
  projectId: "uwb-gold-brew",
  storageBucket: "uwb-gold-brew.firebasestorage.app",
  messagingSenderId: "370231606287",
  appId: "1:370231606287:web:bc0bef1a25ebcecf16b77a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getDatabase(app);

export {auth, db}
