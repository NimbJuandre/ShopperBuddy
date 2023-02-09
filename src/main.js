import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import firebase from 'firebase/app';
import 'material-design-icons-iconfont/dist/material-design-icons.css'

const firebaseConfig = {
  apiKey: "AIzaSyC4OKiNFyVA9iKRwxCIW_VW4Mf5YXPsCSg",
  authDomain: "shopper-buddy-c27a9.firebaseapp.com",
  databaseURL: "https://shopper-buddy-c27a9-default-rtdb.firebaseio.com",
  projectId: "shopper-buddy-c27a9",
  storageBucket: "shopper-buddy-c27a9.appspot.com",
  messagingSenderId: "1043445089791",
  appId: "1:1043445089791:web:7b479e20b9938ed862d3ca"
};

firebase.initializeApp(firebaseConfig)

Vue.config.productionTip = false;

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
