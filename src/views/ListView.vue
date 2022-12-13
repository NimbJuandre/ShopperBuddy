<template>
    <div>
        <v-app-bar elevation="0">
            <v-btn icon @click="closeList">
                <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <v-toolbar-title class="font-weight-bold">My Lists</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="shareList">
                <v-icon>mdi-account-plus</v-icon>
            </v-btn>
        </v-app-bar>
        <v-row justify="center">
            <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
                <template v-slot:activator="{ on, attrs }">
                    <v-fab-transition>
                        <v-btn class="fab" color="primary" v-bind="attrs" v-on="on" fab dark absolute bottom right>
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </v-fab-transition>
                </template>
                <v-card>
                    <v-toolbar dark color="primary">
                        <v-btn icon dark @click="dialog = false">
                            <v-icon>mdi-arrow-left</v-icon>
                        </v-btn>
                        <!-- <v-spacer></v-spacer> -->
                        <v-toolbar-items>
                            <v-text-field v-model="newListItem" class="mt-1 text-h6" label="Add new Item" single-line rounded></v-text-field>
                        </v-toolbar-items>
                    </v-toolbar>
                </v-card>
            </v-dialog>
        </v-row>
    </div>
</template>
<script>
export default {
    name: 'ListView',
    data() {
        return {
            dialog: false,
            newListItem: ''
        }
    },
    methods: {
        closeList() {
            this.$router.push({ path: '/' })
        },
        shareList() {

        },
        addItemToList() {
            this.$router.push({ path: '/' })
        }
    }
}
</script>
<style>
.fab {
    bottom: 35px !important;
}
</style>