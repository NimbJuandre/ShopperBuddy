<template>
  <v-card v-if="list" class="list-card pa-3" @click="openList(list.id)" ripple outlined elevation="10">
    <v-card-title>
      <h2>{{ list.title }}</h2>
      <v-spacer></v-spacer>
      <v-btn v-if="!list.linkedList" class="list-options" icon>
        <v-bottom-sheet v-model="sheet">
          <template v-slot:activator="{ on, attrs }">
            <v-icon v-bind="attrs" v-on="on">mdi-dots-vertical</v-icon>
          </template>
          <v-sheet class="text-center" height="200px">
            <v-row>
              <v-col>
                <v-btn class="mt-6" text color="error" @click="sheet = !sheet">close</v-btn>
              </v-col>
            </v-row>
            <v-dialog v-model="dialog" max-width="320">
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" class="mt-6" text color="error">Delete</v-btn>
              </template>
              <v-card>
                <v-card-title class="text-h5 grey lighten-2">
                  Delete this list?
                </v-card-title>

                <v-card-text>
                  Do you wish to delete this list permanently
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="green darken-1" text @click="disagreeDeleteList()">
                    Disagree
                  </v-btn>
                  <v-btn color="red darken-1" text @click.stop="deleteList(list.id)">
                    Agree
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-sheet>
        </v-bottom-sheet>
      </v-btn>
    </v-card-title>
    <v-card-text class="pb-0">
      <ProgressBar :list="list" :showLabel="true"> </ProgressBar>
    </v-card-text>
    <v-chip-group>
      <v-chip v-for="(linkedUser, i) in list.linkedUsers" :key="i">
        {{ linkedUser.email }}
      </v-chip>
    </v-chip-group>
  </v-card>
</template>
<script>
import firebase from "firebase";
import ProgressBar from "../components/ProgressBar.vue";
export default {
  name: "List",
  props: ["list"],
  components: {
    ProgressBar,
  },
  data() {
    return {
      dialog: false,
      sheet: false,
    };
  },
  methods: {
    openList(id) {
      this.$router.push({ path: "/ListView", query: { id: id } });
    },
    async deleteList(id) {
      await firebase
        .firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .collection("lists")
        .doc(id)
        .delete();

      this.dialog = false;
      this.sheet = false;

      if (this.list.linkedUsers.length > 0)
        this.removeLinkedListRef()
    },
    removeLinkedListRef() {
      this.list.linkedUsers.forEach(user => {
        firebase
          .firestore()
          .collection("users")
          .doc(user.uid)
          .collection("lists")
          .doc(this.list.id)
          .delete();
      });
    },
    disagreeDeleteList() {
      this.dialog = false;
      this.sheet = false;
    },
  },
};
</script>
<style>
.v-card {
  border-radius: 15px !important;
}

.list-card {
  cursor: pointer;
  transition: box-shadow 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.list-card-hover {
  box-shadow: 9px 9px 9px rgba(20, 20, 20, 0.6) !important;
}

.list-card .list-options {
  right: -14px;
  top: -12px;
}

.progress-text {
  font-size: large;
}
</style>
