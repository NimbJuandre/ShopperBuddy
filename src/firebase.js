import firebase from 'firebase/app'
import 'firebase/firebase-messaging'

const firebaseConfig = {
    apiKey: "AIzaSyC4OKiNFyVA9iKRwxCIW_VW4Mf5YXPsCSg",
    authDomain: "shopper-buddy-c27a9.firebaseapp.com",
    databaseURL: "https://shopper-buddy-c27a9-default-rtdb.firebaseio.com",
    projectId: "shopper-buddy-c27a9",
    storageBucket: "shopper-buddy-c27a9.appspot.com",
    messagingSenderId: "1043445089791",
    appId: "1:1043445089791:web:7b479e20b9938ed862d3ca",
};

firebase.initializeApp(firebaseConfig)

export default firebase.messaging()