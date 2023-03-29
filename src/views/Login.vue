<template>
  <v-app id="inspire">
    <v-main>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <div class="ma-4">
                <h1 class="text-center">Welcome Back!</h1>
                <h4 class="text-center">Sign in with</h4>
                <v-row class="mt-5" align="center" justify="center">
                  <v-btn-toggle>
                    <v-btn>
                      <Google />
                    </v-btn>
                    <!-- <v-btn>
                      <GitHub />
                    </v-btn> -->
                  </v-btn-toggle>
                </v-row>
              </div>
              <!-- <h4 class="mt-8" align="center">Or</h4>
              <v-card-text class="pt-0">
                <v-form>
                  <v-text-field
                    v-model.trim="email"
                    prepend-icon="person"
                    name="login"
                    label="Login"
                    type="text"
                  ></v-text-field>
                  <v-text-field
                    v-model.trim="password"
                    id="password"
                    prepend-icon="lock"
                    name="password"
                    label="Password"
                    type="password"
                  >
                  </v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="Login" color="primary">Login</v-btn>
              </v-card-actions> -->
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-main>
  </v-app>
</template>
<script>
import Google from "../components/LoginProviders/Google.vue";
import GitHub from "../components/LoginProviders/GitHub.vue";
import firebase from "firebase";

export default {
  name: "Login",
  components: {
    Google,
    GitHub,
  },
  data: () => ({
    email: null,
    password: null,
    isLoading: false,
  }),
  // methods: {
  //   Login() {
  //     console.log("login");
  //     this.isLoading = true;
  //     firebase
  //       .auth()
  //       .signInWithEmailAndPassword(this.email, this.password)
  //       .then((data) => {
  //         console.log("Successw");
  //       })
  //       .catch((err) => alert(err.message));
  //   },
  // },
};
</script>

<style></style>
