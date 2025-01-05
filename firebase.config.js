// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Replace with your Firebase project credentials
const firebaseConfig = {
    apiKey: "AIzaSyDI7lg07djwncbqZKZ9iOmWrFCZSPxpJK0",
    authDomain: "image-uploader-21ee1.firebaseapp.com",
    projectId: "image-uploader-21ee1",
    storageBucket: "image-uploader-21ee1.firebasestorage.app",
    messagingSenderId: "263036446081",
    appId: "1:263036446081:web:1ea9d6e78e1c225332f480"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
