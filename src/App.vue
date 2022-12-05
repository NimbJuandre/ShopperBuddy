<template>
  <v-app v-if="authenticated">
    <AppContent />
  </v-app>
</template>

<script>
import firebase from "firebase";
import AppContent from "./components/AppContent.vue";
export default {
  name: "App",
  components: {
    AppContent,
  },
  data: () => ({
    authenticated: true,
  }),
  mounted() {
    var _self = this;
    firebase.auth().onAuthStateChanged((user) => {
      // if not logged in redirect to login page
      if (!user) {
        this.authenticated = false;
        this.$router.replace('/login')
      }
      // if logged in (user available)  redirect to Home
      else if (this.$route.path == '/login' || this.$route.path == '/register') {
        this.authenticated = true;
        this.$router.replace('/');
      }
      else { // User loged in, call the HomeView getLists method
        this.$root.$emit('getLists');
      }
    })
  },
  methods: {

  },
};
</script>

<style>
#page {
  width: 100%;
}

.routerlink {
  text-decoration: none;
  color: inherit !important;
}
</style>