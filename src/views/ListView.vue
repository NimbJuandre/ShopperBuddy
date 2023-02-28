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
        <div class="progressbar-wrapper">
            <ProgressBar v-if="list.items" :list="list" :showLabel="false">
            </ProgressBar>
        </div>
        <v-list>
            <v-list-item class="list-item" v-for="(item, i) in list.items" :key="i" ripple>
                <v-list-item-action @click="updateListItemStatus(item)">
                    <v-checkbox :input-value="item.isCompleted"></v-checkbox>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title v-text="item.name"></v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
        <v-row justify="center">
            <!-- Items Dialog -->
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
                                <Item v-bind:item="item" @afterItemCreated="afterItemCreated" @selectItem="selectItem"
                                    @minusSelectedItemCount="minusSelectedItemCount" @deselectItem="deselectItem"
                                    @refreshItems="refresh">
                                </Item>
                            </v-list>
                        </v-tab-item>
                        <v-tab-item>
                            <v-card flat>
                                <v-card-text> RECENT</v-card-text>
                            </v-card>
                        </v-tab-item>
                    </v-tabs-items>
                </v-card>
                <v-fab-transition>
                    <v-btn class="fab" color="primary" @click="updateList" fab dark fixed bottom right>
                        <v-icon>mdi-plus</v-icon>
                    </v-btn>
                </v-fab-transition>
            </v-dialog>
        </v-row>
    </div>
</template>
<script>
import firebase from "firebase";
import Item from "../components/Item.vue";
import ProgressBar from "../components/ProgressBar.vue";
export default {
    name: 'ListView',
    components: {
        Item,
        ProgressBar
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
            this.list = [];

            var listRef = await firebase
                .firestore()
                .collection("users")
                .doc(firebase.auth().currentUser.uid)
                .collection("lists")
                .doc(id);


            listRef.onSnapshot(snap => {
                var list = snap.data()
                if (!list)
                    return;

                list.id = snap.id
                this.list = list;
            });
        },
        async getItems() {
            this.items = [];
            this.originalItems = [];
            var itemsRef = await firebase
                .firestore()
                .collection("items");

            itemsRef.onSnapshot(snap => {
                snap.forEach(doc => {
                    var item = doc.data();
                    item.id = doc.id;

                    // Get the the item's selected andcount props when the item exists in the list.items
                    var addedItem = this.list.items.find(i => i.id === item.id);
                    if (addedItem) {
                        item.selected = true;
                        item.count = addedItem.count;
                    }
                    else {
                        item.selected = false;
                        item.count = 0;
                    }

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

            if (this.originalItems.map(n => n.name.toLowerCase().trim()).indexOf(this.searchText.toLowerCase().trim()) === -1)
                searchItems.push({ name: this.searchText, newItem: true });

            for (let index = 0; index < this.originalItems.length; ++index) {
                let item = this.originalItems[index];

                if (item.name.toLowerCase().trim().includes(this.searchText.toLowerCase().trim()))
                    searchItems.push(item)
            }

            this.items = searchItems;
        },
        afterItemCreated() {
            this.items.shift();
            this.searchText = '';
        },
        selectItem(item) {
            var item = this.items.find(i => i.id === item.id);

            item.selected = true;
            item.count++;
        },
        minusSelectedItemCount(item) {
            var item = this.items.find(i => i.id === item.id);

            item.selected = true;
            item.count--;
        },
        async updateList() {
            var selectedItems = this.items.filter(i => {
                return i.selected === true
            });

            await firebase
                .firestore()
                .collection("users")
                .doc(firebase.auth().currentUser.uid)
                .collection("lists")
                .doc(this.list.id)
                .update({ items: selectedItems });

            this.dialog = false;
        },
        async updateListItemStatus(item) {
            let currentListItem = this.list.items.find(i => i.id == item.id);
            currentListItem.isCompleted = !currentListItem.isCompleted;

            await firebase
                .firestore()
                .collection("users")
                .doc(firebase.auth().currentUser.uid)
                .collection("lists")
                .doc(this.list.id)
                .update({ items: this.list.items });
        },
        deselectItem(item) {
            this.items.find(i => i.id === item.id).selected = false;
        },
        resetSearchItems() {
            this.items = this.originalItems;
        },
        closeList() {
            this.$router.push({ path: '/' })
        },
        shareList() {

        },
        refresh(id) {
            this.getList(id)
            this.getItems();
        }
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

.list-item {
    cursor: pointer;
}

.progressbar-wrapper {
    margin: 5px 18px;
}
</style>