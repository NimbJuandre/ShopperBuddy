<template>
    <v-app-bar elevation="0">
        <v-btn icon @click="closeList">
            <v-icon>mdi-arrow-left</v-icon>
            <!-- <router-link class="routerlink" to="/">
                <v-icon>mdi-arrow-left</v-icon>
            </router-link> -->
        </v-btn>
        <v-toolbar-title class="font-weight-bold">My Lists</v-toolbar-title>
    </v-app-bar>
</template>
<script>
export default {
    name: 'ListView',
    methods: {
        closeList() {
            this.$root.$emit('getLists');
            this.$router.push({ path: '/' })
        }
    }
}
</script>