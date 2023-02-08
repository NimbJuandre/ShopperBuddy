<template>
    <v-card v-if="list" class="list-card pa-3" @click="openList(list.id)" ripple outlined elevation="10">
        <v-card-title>
            <h2>{{ list.title }}</h2>
            <v-spacer></v-spacer>
            <v-btn class="list-options" icon>
                <v-dialog v-model="dialog" max-width="320">
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon v-bind="attrs" v-on="on">mdi-dots-vertical</v-icon>
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
                            <v-btn color="green darken-1" text @click="dialog = false">
                                Disagree
                            </v-btn>
                            <v-btn color="green darken-1" text @click.stop="deleteList(list.id)">
                                Agree
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-btn>
        </v-card-title>

        <v-card-text>
            <v-row>
                <v-col cols="11">
                    <v-progress-linear rounded color="green" background-color="grey lighten-1" height="10">
                    </v-progress-linear>
                </v-col>
                <v-col class="pa-0 mt-2" cols="1">
                    <label class="progress-text font-weight-bold">1/2</label>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>
<script>
import firebase from "firebase";
export default {
    name: 'List',
    props: ['list'],
    data() {
        return {
            dialog: false,
        }
    },
    methods: {
        openList(id) {
            this.$router.push({ path: '/ListView', query: { id: id } })
            // this.$router.push({ path: '/ListView' })
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
        }
    }
}
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