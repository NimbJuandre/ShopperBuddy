<template>
  <div v-if="list">
    <v-app-bar elevation="0">
      <v-btn icon @click="closeList">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title class="font-weight-bold">{{
        list.title
      }}</v-toolbar-title>
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
      <v-list-item @click="updateListItemStatus(item)" :class="{ isCompleted: item.isCompleted }" class="list-item"
        v-for="(item, i) in list.items" :key="i" ripple>
        <v-list-item-action>
          <v-checkbox :input-value="item.isCompleted"></v-checkbox>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title v-text="item.name + (item.count > 1 ? ' x ' + item.count : '')"></v-list-item-title>
        </v-list-item-content>
        <v-list-item-icon class="ml-0" v-on:click.stop="removeItem(item)">
          <v-icon class="remove-icon" large>mdi-delete</v-icon>
        </v-list-item-icon>
      </v-list-item>
    </v-list>
    <v-row justify="center">
      <!-- Items Dialog -->
      <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <template v-slot:activator="{ on, attrs }">
          <v-fab-transition>
            <v-btn class="fab" color="primary" v-bind="attrs" v-on="on" fab dark fixed bottom right>
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
                background-color="white" rounded clearable class="add-item-input mt-1 text-h6" label="Add new Item"
                single-line></v-text-field>
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
                <Item v-if="item.visible" :item="item" @afterItemCreated="afterItemCreated" @selectItem="selectItem"
                  @minusSelectedItemCount="minusSelectedItemCount" @deselectItem="deselectItem" @deleteItem="deleteItem">
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
          <v-btn v-if="applyChanges" class="fab" color="primary" @click="updateList" fab dark fixed bottom right>
            <v-icon>mdi-check</v-icon>
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
  name: "ListView",
  components: {
    Item,
    ProgressBar,
  },
  data() {
    return {
      list: null,
      items: [],
      dialog: false,
      searchText: "",
      tab: null,
      applyChanges: false,
    };
  },
  async mounted() {
    await this.getList(this.$route.query.id);
    await this.getItems();
  },
  methods: {
    async getList(id) {
      this.list = [];

      var listRef = firebase
        .firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .collection("lists")
        .doc(id);

      listRef.onSnapshot((snap) => {
        var list = snap.data();
        if (!list) return;

        list.id = snap.id;
        this.list = list;
      });
    },
    async getItems() {
      var itemsRef = firebase.firestore().collection("items");
      this.items = [];

      itemsRef.onSnapshot((snap) => {
        snap.forEach((doc) => {
          var item = doc.data();
          item.id = doc.id;
          item.visible = true;

          // Get the the item selected and count props when the item exists in the list.items
          var addedItem = this.list.items.find((i) => i.id === item.id);
          if (addedItem) {
            item.selected = true;
            item.count = addedItem.count;
          } else {
            item.selected = false;
            item.count = 0;
          }

          // Only add the item if i does not exists in the item array
          if (!this.items.find((i) => i.id === item.id))
            this.items.push(item);
        });

        this.sortSelectedItems();
      });
    },
    removeNewItems() {
      // Remove the newItems 
      this.items = this.items.filter(function (item) {
        return item.newItem === undefined;
      });
    },
    showAllItems() {
      this.items.forEach(function (item) {
        item.visible = true;
      });
    },
    async search() {
      this.removeNewItems();

      if (this.searchText.length == 0) {
        this.showAllItems();
        return;
      }

      this.items.forEach(function (item) { // hide all the items when searching
        item.visible = false;
      });

      // If the item does not exits, add a new item
      if (
        this.items
          .map((n) => n.name.toLowerCase().trim())
          .indexOf(this.searchText.toLowerCase().trim()) === -1
      )
        this.items.unshift({ name: this.searchText, newItem: true, visible: true });

      // Loop the existing items and add it to the searchItems array
      for (let index = 0; index < this.items.length; ++index) {
        let item = this.items[index];

        if (
          item.name
            .toLowerCase()
            .trim()
            .includes(this.searchText.toLowerCase().trim())
        )
          item.visible = true;
      }
    },
    afterItemCreated() {
      this.removeNewItems();
      this.showAllItems();
      this.searchText = "";
    },
    selectItem(item) {
      var item = this.items.find((i) => i.id === item.id);

      item.selected = true;
      item.count++;
      this.applyChanges = true;
    },
    minusSelectedItemCount(item) {
      var item = this.items.find((i) => i.id === item.id);

      item.selected = true;
      item.count--;
      this.applyChanges = true;
    },
    async updateList() {
      var selectedItems = this.items.filter((i) => {
        return i.selected === true;
      });

      this.list.items.forEach(function (item) { // Updte the item's count and selected props
        var existingItem = selectedItems.find((i) => i.id === item.id);

        if (existingItem) {
          existingItem.count = item.count;
          existingItem.isCompleted = item.isCompleted;
        }
      });

      await firebase
        .firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .collection("lists")
        .doc(this.list.id)
        .update({ items: selectedItems });

      this.dialog = false;
      this.applyChanges = false;
    },
    async updateListItemStatus(item) {
      let currentListItem = this.list.items.find((i) => i.id == item.id);
      currentListItem.isCompleted = !currentListItem.isCompleted;

      this.list.items.sort(function (x, y) {
        return (x.isCompleted === y.isCompleted) ? 0 : x.isCompleted ? 1 : -1;
      });

      await firebase
        .firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .collection("lists")
        .doc(this.list.id)
        .update({ items: this.list.items });

    },
    deselectItem(item) {
      var item = this.items.find((i) => i.id === item.id);

      item.selected = false;
      item.count = 0;
      this.applyChanges = true;
    },
    resetSearchItems() {
      this.removeNewItems();
      this.showAllItems();
    },
    closeList() {
      this.$router.push({ path: "/" });
    },
    async removeItem(clickedItem) {
      var item = this.items.find((i) => i.id === clickedItem.id);
      var selectedItems = this.list.items.filter((i) => {
        return i.id !== clickedItem.id;
      });

      item.selected = false;
      item.count = 0;
      item.isCompleted = false;

      this.sortSelectedItems();

      await firebase
        .firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .collection("lists")
        .doc(this.list.id)
        .update({ items: selectedItems });
    },
    sortSelectedItems() {
      this.items.sort(function (x, y) {
        return (x.selected === y.selected) ? 0 : x.selected ? -1 : 1;
      });
    },
    shareList() { },
    deleteItem(item) {
      this.removeItem(item);
      this.refresh();
    },
    refresh() {
      this.getList(this.list.id);
      this.getItems();
    },
  },
};
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
  -webkit-box-shadow: 0px 1px 4px -2px rgb(171 149 149 / 50%)
}

.list-item.isCompleted {
  background-color: #dadada91;
  filter: grayscale(20%);
}

.progressbar-wrapper {
  margin: 5px 18px;
}
</style>
