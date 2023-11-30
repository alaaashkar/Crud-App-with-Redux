import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBW8Hoxgj5hLih1gYCqSUT-cYXPkp-jVyc",
  authDomain: "crud-app-a7415.firebaseapp.com",
  projectId: "crud-app-a7415",
  storageBucket: "crud-app-a7415.appspot.com",
  messagingSenderId: "250193833308",
  appId: "1:250193833308:web:985317091243e62b556599"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app)