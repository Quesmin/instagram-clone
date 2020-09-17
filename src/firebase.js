import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBBOEooZcM8bsTOBVa_XhdozHdK5xDyWsU",
    authDomain: "instagram-clone-5edcb.firebaseapp.com",
    databaseURL: "https://instagram-clone-5edcb.firebaseio.com",
    projectId: "instagram-clone-5edcb",
    storageBucket: "instagram-clone-5edcb.appspot.com",
    messagingSenderId: "658989295361",
    appId: "1:658989295361:web:1ef9065079b04c2aa89d00"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };