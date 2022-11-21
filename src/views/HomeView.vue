<template>
    <div>
        <v-app-bar elevation="0">
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title class="font-weight-bold">My Lists</v-toolbar-title>
        </v-app-bar>
        <v-navigation-drawer v-model="drawer" absolute temporary>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title>Loged in</v-list-item-title>
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
        <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
            <template v-slot:activator="{ on, attrs }">
                <v-fab-transition>
                    <v-btn class="fab" color="primary" v-bind="attrs" v-on="on" fab dark absolute bottom right>
                        <v-icon>mdi-plus</v-icon>
                    </v-btn>
                </v-fab-transition>
            </template>
            <v-container fluid pa-0>
                <v-row justify="center" style="height:100vh" dense>
                    <v-col cols="12" lg="10" md="10"
                        class="fill-height d-flex flex-column justify-center align-center">
                        <v-card class="create-card">
                            <v-row>
                                <v-text-field rounded class="justify-center" label="New List" outlined></v-text-field>
                            </v-row>
                            <v-btn color="white" @click="dialog = false">
                                Cancel
                            </v-btn>
                            <v-btn color="green" @click="dialog = false">
                                Create
                            </v-btn>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-dialog>
    </div>
</template>

<script>
import firebase from "firebase";
export default {
    name: "Profile",
    data() {
        return {
            dialog: false,
            notifications: false,
            sound: true,
            widgets: false,
            drawer: null,
            items: [
                { title: 'Lists', icon: 'mdi-clipboard-list-outline' },
                { title: 'Trash', icon: 'mdi-delete' },
                { title: 'Settings', icon: 'mdi-cog' },
            ],
        }
    },
    methods: {
        Logout() {
            firebase.auth().signOut();
        }
    },
}
</script>

<style>
.fab {
    bottom: 15px !important;
}
.create-card{
    box-shadow: none !important;
}
</style>