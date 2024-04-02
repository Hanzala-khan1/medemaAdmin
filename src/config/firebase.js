import { initializeApp ,getApps} from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBpuO0Ld7tJp7x4gq4KJt321Bpd5YZdtOE",
  authDomain: "medemaa-495d8.firebaseapp.com",
  projectId: "medemaa-495d8",
  storageBucket: "medemaa-495d8.appspot.com",
  messagingSenderId: "118416916073",
  appId: "1:118416916073:web:3263cf4e3907db90efecf8",
  measurementId: "G-SXSQTLVZNC"
};

let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
