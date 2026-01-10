import * as admin from "firebase-admin";
import logger from "../config/logger";

const FIREBASE_CONFIG_PATH = process.env.FIREBASE_CONFIG_PATH!;
const FIREBASE_STORAGE_URL = process.env.FIREBASE_STORAGE_URL!;

let firebaseApp: admin.app.App;

function connectFirebase() {
    try {
        firebaseApp = admin.initializeApp({
            credential: admin.credential.cert(FIREBASE_CONFIG_PATH),
            storageBucket: FIREBASE_STORAGE_URL,
        });
        logger.info("Firebase Connected");
    } catch (err) {
        logger.error("Cannot connect to firebase: ", { error: err });
    }
}

function getFirebase(): admin.app.App {
    if (!firebaseApp) {
        throw new Error("Firebase not initialized!");
    }
    return firebaseApp;
}

export { connectFirebase, getFirebase };
