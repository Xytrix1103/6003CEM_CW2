// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyCcsmmGBiB4Q23MxMzJekL3eY4lvBdPskE",
	authDomain: "cem-cw2.firebaseapp.com",
	projectId: "cem-cw2",
	storageBucket: "cem-cw2.firebasestorage.app",
	messagingSenderId: "538934747845",
	appId: "1:538934747845:web:e5ec654b42d6e12c0006ac"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);