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
        <v-layout row justify-center>
            <v-dialog v-if="showFab" v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
                <template v-slot:activator="{ on, attrs }">
                    <v-fab-transition>
                        <v-btn class="fab" color="primary" v-bind="attrs" v-on="on" fab dark absolute bottom right>
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </v-fab-transition>
                </template>
                <v-toolbar dark color="primary">
                    <v-btn icon dark @click="dialog = false">
                        <v-icon>mdi-arrow-left</v-icon>
                    </v-btn>
                    <v-toolbar-title>Settings</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                        <v-btn dark text @click="dialog = false">
                            Save
                        </v-btn>
                    </v-toolbar-items>
                </v-toolbar>
            </v-dialog>
        </v-layout>
    </div>
</template>
<script>
export default {
    name: 'ListView',
    data() {
        return {
            dialog: false,
            showFab: false
        }
    },
    mounted() {
        this.showFab = true
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