import { isDevEnv } from '@utils/helpers';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { type FirebaseApp, initializeApp } from 'firebase/app';
import {
  type Auth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  type UserCredential,
} from 'firebase/auth';
import {
  connectFirestoreEmulator,
  type Firestore,
  getFirestore,
} from 'firebase/firestore';
import {
  connectFunctionsEmulator,
  type Functions,
  getFunctions,
} from 'firebase/functions';

const USE_FIRESTORE_EMULATOR = false;
const USE_FUNCTIONS_EMULATOR = false;

const buildKey = () => {
  return [
    import.meta.env.VITE__FIREBASE_I,
    import.meta.env.VITE__FIREBASE_P,
    import.meta.env.VITE__FIREBASE_A,
  ]
    .reverse()
    .join('');
};

const firebaseConfig = () => ({
  apiKey: buildKey(),
  authDomain: import.meta.env.VITE__FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE__FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE__FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE__FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE__FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE__FIREBASE_API_ID,
  measurementId: import.meta.env.VITE__FIREBASE_MEASUREMENT_ID,
});

const firebaseApp: FirebaseApp = initializeApp(firebaseConfig());

export const analytics = getAnalytics(firebaseApp);
export const auth: Auth = getAuth(firebaseApp);
export const firestore: Firestore = getFirestore(firebaseApp);
export const functions: Functions = getFunctions(firebaseApp);

// const localHost = import.meta.env.VITE__LOCAL_IP || 'localhost';
const localHost = 'localhost';
const runEmulators = true;

if (runEmulators && window.location.hostname.includes(localHost)) {
  if (USE_FIRESTORE_EMULATOR) {
    // biome-ignore lint/suspicious/noConsole: on purpose
    console.log(`%cEmulating firestore to ${localHost}`, 'color:dodgerblue');
    connectFirestoreEmulator(firestore, localHost, 8091);
    // setGlobalState('usingFirestoreEmulator', localHost);
  }
  if (USE_FUNCTIONS_EMULATOR) {
    // biome-ignore lint/suspicious/noConsole: on purpose
    console.log(`%cEmulating functions to ${localHost}`, 'color:cyan');
    connectFunctionsEmulator(functions, localHost, 5003);
    connectFunctionsEmulator(functions, 'localhost', 5003);
    // setGlobalState('usingFunctionsEmulator', localHost);
  }
}

export default firebaseApp;

/**
 * Sign up user via email through firebase auth
 * @param email - the email of the user to sign up
 * @param password - the password of the user to sign up
 * @returns - the user credential
 */
export function signUp(
  email: string,
  password: string,
): Promise<UserCredential> {
  return createUserWithEmailAndPassword(auth, email, password);
}

/**
 * Sign in user via email through firebase auth
 * @param email - the email of the user to sign in
 * @param password - the password of the user to sign in
 * @returns - the user credential
 */
export function signIn(
  email: string,
  password: string,
): Promise<UserCredential> {
  return signInWithEmailAndPassword(auth, email, password);
}

/**
 * Sign in user via google through firebase auth
 * @returns - the user credential
 */
export function signInWithGoogle(): Promise<UserCredential> {
  return signInWithPopup(auth, new GoogleAuthProvider());
}

/**
 * Sign out current user
 * @returns - a promise that resolves when the user is signed out
 */
export async function signOut(): Promise<void> {
  return auth.signOut();
}

/**
 * Encodes a Firestore document path for use in the Firestore console URL.
 * It replaces '/' with '~2F' to ensure the path is correctly formatted.
 * @param documentPath - The Firestore document path to encode.
 * @returns The encoded Firestore path.
 */
function encodeFirestorePath(documentPath: string): string {
  // Split the path by '/'
  // Remove any leading/trailing slashes and then split
  const pathSegments = documentPath.replace(/^\/+|\/+$/g, '').split('/');

  // URL-encode each segment and join with '~2F'
  // Firestore console uses '~2F' as an encoded '/' for the path part
  const encodedPath = pathSegments
    .map((segment) => encodeURIComponent(segment))
    .join('~2F');

  return encodedPath ? `~2F${encodedPath}` : '';
}

/**
 * Generates a Firestore console URL for a given document path.
 * If using emulators, it returns the local emulator URL.
 * Otherwise, it constructs the URL based on environment variables.
 * @param path - The Firestore document path to generate the URL for.
 * @param usingEmulators - Whether to use the Firestore emulator or not.
 * @returns The constructed Firestore console URL.
 */
export const getFirestoreConsoleUrl = (
  path: string,
  usingEmulators = false,
) => {
  const firestoreUrl = import.meta.env.VITE__FIRESTORE_URL;
  const firestoreProjectId = import.meta.env.VITE__FIREBASE_PROJECT_ID;
  const firestorePath = import.meta.env.VITE__FIRESTORE_PATH;
  const baseConsoleUrl = `${firestoreUrl}/${firestoreProjectId}/${firestorePath}`;

  return usingEmulators
    ? `http://127.0.0.1:4000/firestore/default/data/${path}`
    : `${baseConsoleUrl}${encodeFirestorePath(path)}`;
};

/**
 * Logs an analytics event using Firebase Analytics.
 * @param eventName - The name of the event to log.
 * @param eventParams - Optional parameters for the event.
 * @returns A promise that resolves when the event is logged.
 */
export const logAnalyticsEvent = (
  eventName: string,
  eventParams?: Parameters<typeof logEvent>[2],
) => {
  if (isDevEnv) return Promise.resolve();
  return logEvent(analytics, eventName, eventParams);
};
