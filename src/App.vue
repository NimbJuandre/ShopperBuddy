<template>
  <v-app>
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
    firebase.auth().onAuthStateChanged((user) => {
      // if not logged in redirect to login page
      if (!user) {
        this.$router.replace('/login')
      }
      // if logged in (user available)  redirect to Home
      else if (this.$route.path == '/login' || this.$route.path == '/register') {
        this.$router.replace('/');
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