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
  created() {
    if (this.$workbox) {
      this.$workbox.addEventListener("waiting", () => {
        this.showUpgradeUI = true;
      });
    }
  },
  mounted() {
    firebase.auth().onAuthStateChanged((user) => {
      // if not logged in redirect to login page
      if (!user) {
        this.$router.replace("/login");
      }
      // if logged in (user available)  redirect to Home
      else if (
        this.$route.path == "/login" ||
        this.$route.path == "/register"
      ) {
        this.$router.replace("/");
      }
    });
  },
  methods: {
    async accept() {
      this.showUpgradeUI = false
      await this.$workbox.messageSW({ type: "SKIP_WAITING" });
    }
  },
};
</script>

<style>
#page {
  width: 100%;
}

.theme--light.v-app-bar.v-toolbar.v-sheet {
  background-color: #ffffff !important;
}

.routerlink {
  text-decoration: none;
  color: inherit !important;
}
</style>
