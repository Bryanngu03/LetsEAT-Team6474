//firebase.js
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC6mRN8fYVj_lqT3wpyq3Q0S8CnLS1WEiE",
  authDomain: "letseat-38d96.firebaseapp.com",
  databaseURL: "https://letseat-38d96-default-rtdb.firebaseio.com",
  projectId: "letseat-38d96",
  storageBucket: "letseat-38d96.appspot.com",
  messagingSenderId: "161288441615",
  appId: "1:161288441615:web:19e142b10adb4345b0787a",
  measurementId: "G-TWRK35NHX8"
};
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app(); // if already initialized, use that one
}

const db = firebase.firestore();

export { firebase, db };
