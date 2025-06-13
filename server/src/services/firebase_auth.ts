import {applicationDefault, initializeApp} from 'firebase-admin/app';
import {getAuth} from "firebase-admin/auth";


// Initialize the default app 
const app = initializeApp({
    credential: applicationDefault(),
});

// Retrieve services via the defaultApp variable...
let auth = getAuth(app);

export {
    auth
}