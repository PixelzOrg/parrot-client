import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth"
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDpkojb6L7Lu8mgaS-3POed_mJSu8hG5Yg",
  authDomain: "rnauth-cf9b0.firebaseapp.com",
  projectId: "rnauth-cf9b0",
  storageBucket: "rnauth-cf9b0.appspot.com",
  messagingSenderId: "1070896766757",
  appId: "1:1070896766757:web:fa13fd056ad9d492e104cc"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const getCurrentUserUid = () => {
  const user = FIREBASE_AUTH.currentUser;
  if (user) {
    return user.uid;
  } else {
    console.warn('No user is currently signed in.');
    return null;
  }
};