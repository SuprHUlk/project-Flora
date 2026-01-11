import * as admin from "firebase-admin";
import logger from "../config/logger";

const FIREBASE_STORAGE_URL = process.env.FIREBASE_STORAGE_URL!;

let firebaseApp: admin.app.App;

const serviceAccount = {
    type: process.env.FIREBASE_TYPE!,
    project_id: process.env.FIREBASE_PROJECT_ID!,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID!,
    private_key: process.env.FIREBASE_PRIVATE_KEY!,
    client_email: process.env.FIREBASE_CLIENT_EMAIL!,
    client_id: process.env.FIREBASE_CLIENT_ID!,
    auth_uri: process.env.FIREBASE_AUTH_URI!,
    token_uri: process.env.FIREBASE_TOKEN_URI!,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL!,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL!,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN!,
};

function connectFirebase() {
    try {
        firebaseApp = admin.initializeApp({
            credential: admin.credential.cert(
                serviceAccount as admin.ServiceAccount
            ),
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
