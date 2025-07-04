import firebase from "firebase-admin";

const FIREBASE_CONFIG_PATH = process.env.FIREBASE_CONFIG_PATH!;

const firebaseDb = firebase.initializeApp({
  credential: firebase.credential.cert(FIREBASE_CONFIG_PATH),
});

export default firebaseDb;
