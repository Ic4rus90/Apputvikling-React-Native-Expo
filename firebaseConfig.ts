// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAOopaBro33pDiPwwZcuoqcnpCVnseT3CU",
    authDomain: "supernova-4abff.firebaseapp.com",
    projectId: "supernova-4abff",
    storageBucket: "supernova-4abff.appspot.com",
    messagingSenderId: "533902350849",
    appId: "1:533902350849:web:de9d2191b0b6f24e547e00",
    measurementId: "G-YPZ71NDP5W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export {auth, db};