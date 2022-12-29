<template>
    <v-list-item>
        <v-list-item-icon class="mr-0">
            <v-icon class="item-icon" rounded large>mdi-plus</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
            <v-list-item-title v-text="item.name"></v-list-item-title>
        </v-list-item-content>
    </v-list-item>
</template>
<script>
export default {
    name: 'Item',
    props: ['item'],
    methods: {
        // openList(id) {
        //     this.$router.push({ path: '/ListView', query: { id: id } })
        //     // this.$router.push({ path: '/ListView' })
        // }
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