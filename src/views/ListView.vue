<template>
    <div v-if="list">
        <v-app-bar elevation="0">
            <v-btn icon @click="closeList">
                <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <v-toolbar-title class="font-weight-bold">{{ list.title }}</v-toolbar-title>
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
                <v-card rounded="false">
                    <v-toolbar class="item-add-toolbar" color="primary">
                        <v-btn icon dark @click="dialog = false">
                            <v-icon>mdi-arrow-left</v-icon>
                        </v-btn>
                        <v-toolbar-title class="toolbar-title pt-4 pl-1">
                            <v-text-field v-model="searchText" @keyup="search()" @click:clear="resetSearchItems()"
                                background-color="white" rounded clearable class="add-item-input mt-1 text-h6"
                                label="Add new Item" single-line></v-text-field>
                        </v-toolbar-title>

                        <template v-slot:extension>
                            <v-tabs v-model="tab" align-with-title>
                                <v-tabs-slider color="white"></v-tabs-slider>
                                <v-tab class="toolbar-tab">POPULAR</v-tab>
                                <v-tab class="toolbar-tab">RECENT</v-tab>
                            </v-tabs>
                        </template>
                    </v-toolbar>

                    <v-tabs-items v-model="tab">
                        <v-tab-item>
                            <v-list v-for="(item, i) in items" :key="i">
                                <Item v-bind:item="item" @afterItemCreated="afterItemCreated"></Item>
                            </v-list>
                        </v-tab-item>
                        <v-tab-item>
                            <v-card flat>
                                <v-card-text> RECENT</v-card-text>
                            </v-card>
                        </v-tab-item>
                    </v-tabs-items>
                </v-card>
            </v-dialog>
        </v-row>
    </div>
</template>
<script>
import firebase from "firebase";
import Item from "../components/Item.vue";
export default {
    name: 'ListView',
    components: {
        Item
    },
    data() {
        return {
            list: null,
            items: [],
            originalItems: [],
            dialog: false,
            searchText: '',
            tab: null
        }
    },
    async mounted() {
        await this.getList(this.$route.query.id);
        await this.getItems();
    },
    methods: {
        async getList(id) {
            var listRef = await firebase
                .firestore()
                .collection("users")
                .doc(firebase.auth().currentUser.uid)
                .collection("lists")
                .doc(id);


            listRef.onSnapshot(snap => {
                var list = snap.data()
                list.id = snap.id
                this.list = list;
            });
        },
        async getItems() {
            var itemsRef = await firebase
                .firestore()
                .collection("items");

            itemsRef.onSnapshot(snap => {
                snap.forEach(doc => {
                    var item = doc.data();
                    item.id = doc.id;
                    this.items.push(item);
                });
                this.originalItems = this.items;
            });
        },
        async search() {
            let searchItems = [];

            if (this.searchText.length == 0) {
                this.items = this.originalItems;
                return;
            }

            searchItems.push({ name: this.searchText, newItem: true });

            for (let index = 0; index < this.originalItems.length; ++index) {
                let item = this.originalItems[index];

                if (item.name.toLowerCase().includes(this.searchText.toLowerCase()))
                    searchItems.push(item)
            }

            this.items = searchItems;
        },
        afterItemCreated(addedItem) {
            this.items.shift();
            this.searchText = '';
        },
        resetSearchItems() {
            this.items = this.originalItems;
        },
        closeList() {
            this.$router.push({ path: '/' })
        },
        shareList() {

        },        
    }
}
</script>
<style>
.fab {
    bottom: 35px !important;
}

.item-add-toolbar {
    border-bottom-left-radius: 0px !important;
    border-bottom-right-radius: 0px !important;
    border-top-left-radius: 0px !important;
    border-top-right-radius: 0px !important;
}

.toolbar-title {
    width: 100% !important;
}

.toolbar-tab {
    color: white !important;
}

</style>