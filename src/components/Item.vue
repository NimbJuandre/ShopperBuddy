<template>
    <v-list-item class="item" ripple @click="addItem(item)">
        <v-list-item-icon class="mr-0">
            <v-icon class="item-icon" rounded large>mdi-plus</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
            <v-list-item-title v-text="item.name"></v-list-item-title>
        </v-list-item-content>
    </v-list-item>
</template>
<script>
import firebase from "firebase";
export default {
    name: 'Item',
    props: ['item'],
    methods: {
        addItem(item) {
            if (item.newItem)
                this.createNewItem(item);
        },
        async createNewItem(item) {
            const data = {
                name: item.name,
                count: 0,
                modifiedDate: new Date(),
            };

            await firebase
                .firestore()
                .collection("items")
                .add(data)
        }
    }
}
</script>
<style>
.item {
    cursor: pointer;
}

.v-list {
    padding:0px !important;
}
</style>