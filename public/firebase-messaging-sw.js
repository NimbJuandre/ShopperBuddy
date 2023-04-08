importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js');

var config = {
    messagingSenderId: "1043445089791",
};
firebase.initializeApp(config);

let messaging = firebase.messaging();