<template>
    <v-list-item class="item" ripple @click="addItem(item)">
        <v-list-item-icon class="mr-0">
            <v-icon class="item-icon" :class='{ "rotate": selected }' rounded large>mdi-plus</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
            <v-list-item-title v-text="item.name"></v-list-item-title>
        </v-list-item-content>
        <v-list-item-icon v-if="selected" v-on:click.stop="deselectItemToAdd">
            <v-icon class="remove-icon" large>mdi-close</v-icon>
        </v-list-item-icon>
    </v-list-item>
</template>
<script>
import firebase from "firebase";
export default {
    name: 'Item',
    props: ['item'],
    data() {
        return {
            selected: false
        }
    },
    methods: {
        addItem(item) {
            if (item.newItem)
                this.createNewItem(item);
            else
                this.selectItemToAdd(item);
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
                .add(data);

            this.$emit('afterItemCreated', data)
        },
        selectItemToAdd(item) {
            this.selected = !this.selected;
            //this.$refs.itemIcon.
        },
        deselectItemToAdd() {
            this.selected = !this.selected;
            console.log('deselected', this.selected)
        }
    }
}
</script>
<style>
.item {
    cursor: pointer;
}

.remove-icon {
    border-radius: 0px;
    color: #f71b1b !important;
    transition: all .3s ease-in-out !important;
}

.item-icon {
    border-radius: 25px;
    color: white !important;
    background-color: lightgrey;
    margin-right: 15px;
    transition: all .3s ease-in-out !important;
}

.item-icon.rotate {
    transform: rotate(180deg);
    background-color: #1976d2 !important;
}

.v-list {
    padding: 0px !important;
}
</style>