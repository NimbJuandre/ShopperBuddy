<template>
    <div>
        <v-app-bar elevation="0">
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title class="font-weight-bold">My Lists</v-toolbar-title>
        </v-app-bar>
        <v-navigation-drawer v-model="drawer" absolute temporary>
            <v-list-item v-if="user">
                <v-list-item-content class="title">
                    <v-list-item-title class="title-text">{{ user.displayName }}</v-list-item-title>
                    <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-spacer></v-spacer>
                <v-btn icon title="Click to logout" @click="Logout">
                    <v-icon>mdi-logout</v-icon>
                </v-btn>
            </v-list-item>

            <v-divider></v-divider>

            <v-list dense>
                <v-list-item v-for="item in items" :key="item.title" link>
                    <v-list-item-icon>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
        <v-container fluid grid-list-md>
            <v-layout row wrap>
                <v-responsive class="mx-auto" v-if="loading">
                    <v-responsive class="ma-3" height="125" v-for="index in 5" :key="index">
                        <v-skeleton-loader ref="skeleton" :boilerplate="false" type="image" :tile=true
                            class="mx-auto"></v-skeleton-loader>
                    </v-responsive>
                </v-responsive>
                <v-flex v-else v-for="list in lists" :key="list.id" xs12 md6 lg6 pa-3>
                    <List :list="list" @removeSharedListRefToUser="removeSharedListRefToUser"></List>
                </v-flex>
            </v-layout>
        </v-container>
        <!-- <v-layout row justify-center> -->
        <v-btn class="fab" color="primary" @click="dialog = true" fab dark fixed bottom right>
            <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-dialog v-model="dialog" max-width="600px" persistent>
            <v-card>
                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-text-field v-on:keyup.enter="createList" v-model="createListName"
                                class="create-list-name font-weight-bold text-h5" autofocus label="New List" required>
                            </v-text-field>
                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-col class="text-left">
                        <v-btn color="blue darken-1" @click="resetCreateModal">Close</v-btn>
                    </v-col>
                    <v-btn color="green darken-1" @click="createList">Create</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!-- </v-layout> -->
    </div>
</template>

<script>
import firebase from "firebase";
import { inject } from 'vue'
import List from "../components/List.vue";
export default {
    name: "Home",
    components: {
        List
    },
    inject: ['messaging'],
    props: ['artists'],
    data() {
        return {
            user: null,
            loading: true,
            dialog: false,
            notifications: false,
            sound: true,
            widgets: false,
            drawer: null,
            createListName: '',
            lists: [],
            listObj: {
                title: ""
            },
            items: [
                { title: 'Lists', icon: 'mdi-clipboard-list-outline' },
                { title: 'Trash', icon: 'mdi-delete' },
                { title: 'Settings', icon: 'mdi-cog' },
            ],
        }
    },
    mounted() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.user = user;
                this.selectLists();
                this.saveUser(user)
            }
        })
    },
    methods: {
        async Logout() {
            await firebase
                .firestore()
                .collection("logedInUsers")
                .doc(firebase.auth().currentUser.uid).delete();

            firebase.auth().signOut();
        },
        async createList() {
            try {
                if (this.createListName.length === 0)
                    return;

                this.dialog = false;

                await firebase
                    .firestore()
                    .collection("users")
                    .doc(firebase.auth().currentUser.uid)
                    .collection("lists")
                    .add({
                        title: this.createListName,
                        items: [],
                        linkedUsers: [],
                        owner: {
                            email: this.user.email,
                            uid: this.user.uid
                        }
                        // createdAt: new Date(),
                    });
                this.createListName = '';
            }
            catch (err) {
                alert(err);
                console.log(err);
            }
        },
        async selectLists() {
            var listsRef = await firebase
                .firestore()
                .collection("users")
                .doc(firebase.auth().currentUser.uid)
                .collection("lists");

            listsRef.onSnapshot(snap => {
                this.lists = [];
                snap.forEach(doc => {
                    var list = doc.data();
                    list.id = doc.id;

                    if (list.listRef) {
                        list.listRef.get()
                            .then(res => {
                                list = res.data()
                                list.id = doc.id;
                                list.linkedList = true;
                                list.linkedUsers = [{
                                    email: `Shared by ${list.owner.email}`,
                                    uid: this.user.uid
                                }]
                                this.lists.push(list);
                            })
                            .catch(err => console.error(err));
                    } else {
                        this.lists.push(list);
                    }

                    this.lists.forEach(list => { // This snapshot is needed to update each list.
                        var listRef = firebase
                            .firestore()
                            .collection("users")
                            .doc(this.currentUserID)
                            .collection("lists")
                            .doc(list.id);

                        listRef.onSnapshot((snap) => {
                            list = snap.data();
                        });
                    });
                });
                this.loading = false;
            });
        },
        async saveUser(user) {
            const model = {
                uid: user.uid,
                displayName: user.displayName,
                email: user.email
            };

            await firebase
                .firestore()
                .collection("logedInUsers")
                .doc(firebase.auth().currentUser.uid).set(model)
        },
        resetCreateModal() {
            this.dialog = false;
            this.createListName = '';
        },
        async removeSharedListRefToUser(user, list) {
            var originalListRef = firebase
                .firestore()
                .collection("users")
                .doc((list.linkedList ? list.owner.uid : firebase.auth().currentUser.uid))
                .collection("lists")
                .doc(list.id)
            var originalListGet = await originalListRef.get();
            var originalListData = originalListGet.data()
            var linkedUsers = originalListData.linkedUsers.filter(function (linkedUser) {
                //return user.uid !== firebase.auth().currentUser.uid
                return linkedUser.uid !== user.uid
            });

            // Remove the user from the shared by user's linkedUsers array
            originalListRef.update({ linkedUsers: linkedUsers });

            // Remove the list ref from this user
            var originalListRef = await firebase
                .firestore()
                .collection("users")
                .doc((list.linkedList ? firebase.auth().currentUser.uid : user.uid))
                .collection("lists")
                .doc(list.id)
                .delete();
        }
    },
}
</script>

<style>
.title {
    max-width: 85%;
    overflow: inherit;
}

.title-text {
    white-space: pre-wrap;
    width: max-content;
    overflow: inherit;
}

.fab {
    right: 25px !important;
    bottom: 35px !important;
}

.create-card {
    box-shadow: none !important;
}

.v-responsive {
    border-radius: 15px;
}
</style>