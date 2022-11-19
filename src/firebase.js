import { initializeApp } from "firebase/app";
import{GoogleAuthProvider,  getAuth,  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCo1TynEo7rDo3J0vlU6OlksN-TBuiVGhA",
    authDomain: "fiuber-grupo10.firebaseapp.com",
    projectId: "fiuber-grupo10",
    storageBucket: "fiuber-grupo10.appspot.com",
    messagingSenderId: "387389293972",
    appId: "1:387389293972:web:592d75bc6feff46965fb81",
    measurementId: "G-4VRCNS3V2J"
  };
  


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const logInWithEmailAndPassword = async (email, password, callback) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    sessionStorage.setItem('accessToken', result.user.accessToken);    
  } catch (err) {
    callback(err.message)
    console.error(err);
  }
};
const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Mail enviado! revise su casilla de correo.");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const logout = () => {
  window.sessionStorage.clear();
  signOut(auth);
};

const getAllUsers = async () => {
  try {        
    const q = query(collection(db, "users"));
    const docs = await getDocs(q);    
    const users = [];
    docs.forEach(x => users.push(x.data()));    
    return users;
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
export {
  auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
  getAllUsers
};