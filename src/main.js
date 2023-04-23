import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import firebase from "firebase/app";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import wb from "./registerServiceWorker";
import vueConfetti from 'vue-confetti'

Vue.prototype.$messaging = firebase.messaging()
Vue.use(vueConfetti);

navigator.serviceWorker.register('/firebase-messaging-sw.js')
  .then((registration) => {
    Vue.prototype.$messaging.useServiceWorker(registration)
  }).catch(err => {
    console.log(err)
  })


Vue.config.productionTip = false;
Vue.prototype.$workbox = wb;
//Vue.prototype.$messaging = firebaseMessaging

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
