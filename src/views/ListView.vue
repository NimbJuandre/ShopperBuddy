<template>
  <div v-if="list">
    <v-app-bar elevation="0">
      <v-btn icon @click="closeList">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title class="font-weight-bold">{{ list.title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- User dialog-->
      <v-dialog v-if="list && !list.linkedList" v-model="userDialog" fullscreen hide-overlay
        transition="dialog-bottom-transition">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon @click="userDialog = true" v-bind="attrs" v-on="on">
            <v-icon>mdi-account-plus</v-icon>
          </v-btn>
        </template>
        <v-card rounded="false">
          <v-card-title class="card-title pa-0">
            <v-toolbar fixed class="item-add-toolbar" color="primary">
              <v-btn icon dark @click="userDialog = false">
                <v-icon>mdi-arrow-left</v-icon>
              </v-btn>
              <v-toolbar-title class="toolbar-title pt-4 pl-1">
                <v-text-field v-model="userSearchText" @keyup="searchUsers()" @click:clear="resetSearchUsers()"
                  background-color="white" rounded clearable class="add-item-input mt-1 text-h6"
                  label="Enter user name or email" single-line></v-text-field>
              </v-toolbar-title>
            </v-toolbar>
          </v-card-title>
          <v-list v-for="(user, i) in users" :key="i">
            <User :user="user" @InviteUser="InviteUser" @UnInviteUser="UnInviteUser"></User>
          </v-list>
        </v-card>
      </v-dialog>
    </v-app-bar>
    <div class="progressbar-wrapper">
      <ProgressBar v-if="list.items" :list="list" :showLabel="false">
      </ProgressBar>
    </div>
    <!-- Note dialog -->
    <v-dialog v-model="itemNoteDialog" :retain-focus="false" transition="dialog-bottom-transition">
      <v-card rounded>
        <v-card-title class="card-title pa-0">
          <v-toolbar fixed class="item-add-toolbar" color="primary">
            <v-btn icon dark @click="itemNoteDialog = false">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <v-toolbar-title class="toolbar-title pl-1">Add a note</v-toolbar-title>
            <v-toolbar-items>
              <v-btn icon dark @click="updateItemNote()">
                <v-icon>mdi-content-save</v-icon>
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>
        </v-card-title>
        <v-text-field v-model="note" autofocus background-color="white" rounded clearable
          v-on:keyup.enter="updateItemNote()" class="add-item-input mt-1 text-h6" label="Add a custom note for this item"
          single-line></v-text-field>
      </v-card>
    </v-dialog>
    <v-list>
      <v-list-item @click="updateListItemStatus($event, item)" :class="{ isCompleted: item.isCompleted }"
        class="list-item" v-for="(item, i) in list.items" :key="i" ripple>
        <v-list-item-action>
          <v-checkbox @click.stop="updateListItemStatus($event, item)" :input-value="item.isCompleted"
            :ripple="false"></v-checkbox>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title class="item-title"
            v-text="item.name + (item.count > 1 ? ' x ' + item.count : '')"></v-list-item-title>
          <v-list-item-subtitle class="item-title" v-if="item.note" v-text="item.note"></v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-icon class="ml-0" title="Click to update the note" v-on:click.stop="openItemNoteDialog(item)">
          <v-icon large>mdi-note</v-icon>
        </v-list-item-icon>
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
          <v-card-title class="card-title pa-0">
            <v-toolbar fixed class="item-add-toolbar" color="primary">
              <v-btn icon dark @click="dialog = false">
                <v-icon>mdi-arrow-left</v-icon>
              </v-btn>
              <v-toolbar-title class="toolbar-title pt-4 pl-1">
                <v-text-field v-model="searchText" @keyup="search()" v-on:keyup.enter="createItem"
                  @click:clear="resetSearchItems()" background-color="white" rounded clearable
                  class="add-item-input mt-1 text-h6" label="Add new Item" single-line></v-text-field>
              </v-toolbar-title>
            </v-toolbar>
          </v-card-title>
          <v-list v-for="(item, i) in items" :key="i">
            <Item v-if="item.visible" ref="itemComponentRef" :item="item" :hideDelete="isLinked"
              @afterItemCreated="afterItemCreated" @selectItem="selectItem"
              @minusSelectedItemCount="minusSelectedItemCount" @deselectItem="deselectItem" @deleteItem="deleteItem">
            </Item>
          </v-list>
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
import User from "../components/User.vue";
import ProgressBar from "../components/ProgressBar.vue";
export default {
  name: "ListView",
  components: {
    Item,
    User,
    ProgressBar,
  },
  data() {
    return {
      list: null,
      currentUserID: null,
      isLinked: false,
      items: [],
      users: [],
      dialog: false,
      userDialog: false,
      itemNoteDialog: false,
      searchText: "",
      userSearchText: '',
      tab: null,
      applyChanges: false,
      note: '',
      noteItem: null,
    };
  },
  async mounted() {
    await this.selectAllUsers();
    await this.getList(this.$route.query.id);
    await this.selectItems();
  },
  methods: {
    async getList(id) {
      this.list = [];
      this.currentUserID = await this.getListUserID(id);

      var listRef = firebase
        .firestore()
        .collection("users")
        .doc(this.currentUserID)
        .collection("lists")
        .doc(id);

      var initialListRef = await listRef.get();
      this.list = initialListRef.data();

      listRef.onSnapshot((snap) => {
        if (!snap.exists) return;

        var list = snap.data();
        list.id = snap.id;
        this.list = list;
        list.linkedList = this.isLinked;

        // Get the the item selected and count props when the item exists in the list.items
        this.items.forEach(item => {
          var addedItem = this.list.items.find((i) => i.id === item.id);
          if (addedItem) {
            item.selected = true;
            item.count = addedItem.count;
          } else {
            item.selected = false;
            item.count = 0;
          }
        });

        this.list.items.sort(function (x, y) {
          return (x.isCompleted === y.isCompleted) ? 0 : x.isCompleted ? 1 : -1;
        });

        if (this.users && this.list.linkedUsers.length > 0) { // update the users selected prop
          this.list.linkedUsers.forEach(linkedUser => {
            var user = this.users.find((u) => u.uid === linkedUser.uid)
            if (user)
              user.selected = linkedUser.selected;
          });
        }
      });
    },
    async getListUserID(listID) {
      var ref = await firebase
        .firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .collection("lists")
        .doc(listID)
        .get();

      var refData = ref.data()
      if (refData.listRef) {
        var sharedListRef = await refData.listRef.get();
        this.isLinked = true;
        return sharedListRef.ref.parent.parent.id;
      }

      this.isLinked = false;
      return firebase.auth().currentUser.uid;
    },
    async selectItems() {
      this.items = [];
      var itemsRef = firebase
        .firestore()
        .collection("users")
        .doc(this.currentUserID)
        .collection("items");

      itemsRef.onSnapshot((snap) => {
        snap.forEach((doc) => {
          var item = doc.data();
          item.id = doc.id;
          item.visible = true;

          // Get the the item selected and count props when the item exists in the list.items
          if (this.list.items) {
            var addedItem = this.list.items.find((i) => i.id === item.id);
            if (addedItem) {
              item.selected = true;
              item.count = addedItem.count;
            } else {
              item.selected = false;
              item.count = 0;
            }
          }

          // Only add the item if i does not exists in the item array
          if (!this.items.find((i) => i.id === item.id))
            this.items.push(item);
        });

        this.sortSelectedItems();
      });
    },
    async selectAllUsers() {
      this.users = [];
      var userRef = firebase
        .firestore()
        .collection("logedInUsers");

      var ref = await userRef.get();
      ref.docs.forEach((doc) => {
        var user = doc.data();

        if (user.uid === firebase.auth().currentUser.uid) // Dont add the current user to the list
          return;

        user.visible = true;
        //user.selected = this.list.linkedUsers.includes(user.uid);
        user.selected = false;

        this.users.push(user);
      });
    },
    createItem() {
      if (!this.searchText)
        return;

      var itemtoAdd = this.items.filter((i) => {
        return i.visible === true;
      });

      this.$refs.itemComponentRef[0].addItem(itemtoAdd[0]);
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
    showAllUsers() {
      this.users.forEach(function (user) {
        user.visible = true;
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
    async searchUsers() {
      if (this.userSearchText.length == 0) {
        this.showAllUsers();
        return;
      }

      this.users.forEach(function (user) { // hide all the users when searching
        user.visible = false;
      });

      for (let index = 0; index < this.users.length; ++index) {
        let user = this.users[index];

        if ( // check the user's display name and email
          user.displayName.toLowerCase().trim().includes(this.userSearchText.toLowerCase().trim()) ||
          user.email.toLowerCase().trim().includes(this.userSearchText.toLowerCase().trim())
        )
          user.visible = true;
      }
    },
    afterItemCreated(data) {
      firebase
        .firestore()
        .collection("users")
        .doc(this.currentUserID)
        .collection("items").add(data).then(function (res) {
          this.selectItem({ id: res.id });
          this.sortSelectedItems();
        }.bind(this));

      this.searchText = "";
      this.removeNewItems();
      this.showAllItems();
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

      this.list.items.forEach(function (item) { // Update the item's count and selected props
        var existingItem = selectedItems.find((i) => i.id === item.id);

        if (existingItem) {
          //existingItem.count = item.count;
          existingItem.isCompleted = item.isCompleted;
          existingItem.note = item.note || '';
        }
      });

      await firebase
        .firestore()
        .collection("users")
        .doc(this.currentUserID)
        .collection("lists")
        .doc(this.list.id)
        .update({ items: selectedItems });

      this.dialog = false;
      this.applyChanges = false;
      this.searchText = '';
    },
    async updateListItemStatus(event, item) {
      let currentListItem = this.list.items.find((i) => i.id == item.id);
      currentListItem.isCompleted = !currentListItem.isCompleted;

      await firebase
        .firestore()
        .collection("users")
        .doc(this.currentUserID)
        .collection("lists")
        .doc(this.list.id)
        .update({ items: this.list.items });

      this.list.items.sort(function (x, y) {
        return (x.isCompleted === y.isCompleted) ? 0 : x.isCompleted ? 1 : -1;
      });
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
    resetSearchUsers() {
      this.showAllUsers();
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
        .doc(this.currentUserID)
        .collection("lists")
        .doc(this.list.id)
        .update({ items: selectedItems });
    },
    sortSelectedItems() {
      this.items.sort(function (x, y) {
        return (x.selected === y.selected) ? 0 : x.selected ? -1 : 1;
      });
    },
    async InviteUser(user) {
      var linkedUsers = this.list.linkedUsers;

      if (!linkedUsers.includes(user.uid))
        linkedUsers.push({
          uid: user.uid,
          email: user.email,
          selected: true
        });

      await firebase
        .firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .collection("lists")
        .doc(this.list.id)
        .update({ linkedUsers: linkedUsers });

      await this.addSharedListRefToUser(user);
    },
    async UnInviteUser(selectedUser) {
      var user = this.users.find((u) => u.uid === selectedUser.uid);
      user.selected = false;

      // Remove the linked user
      var linkedUsers = this.list.linkedUsers.filter((linkedUser) => {
        return linkedUser.uid !== selectedUser.uid;
      });

      await firebase
        .firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .collection("lists")
        .doc(this.list.id)
        .update({ linkedUsers: linkedUsers });

      await this.RemoveSharedListRefToUser(user);
    },
    async addSharedListRefToUser(user) {
      await firebase
        .firestore()
        .collection("users")
        .doc(user.uid)
        .collection("lists")
        .doc(this.list.id)
        .set({
          listRef: firebase.firestore().doc(`users/${firebase.auth().currentUser.uid}/lists/${this.list.id}`),
        });
    },
    async RemoveSharedListRefToUser(user) {
      await firebase
        .firestore()
        .collection("users")
        .doc(user.uid)
        .collection("lists")
        .doc(this.list.id)
        .delete();
    },
    async deleteItem(item) {
      await firebase
        .firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .collection("items")
        .doc(item.id)
        .delete();

      this.removeItem(item);
      this.refresh();
    },
    refresh() {
      this.getList(this.list.id);
      this.selectItems();
    },
    updateItemNote() {
      var selectedItem = this.list.items.find((i) => i.id === this.noteItem.id);
      selectedItem.note = this.note;

      firebase
        .firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .collection("lists")
        .doc(this.list.id)
        .update({ items: this.list.items });

      this.note = '';
      this.noteItem = null;
      this.itemNoteDialog = false;
    },
    openItemNoteDialog(item) {
      this.note = item.note;
      this.noteItem = item;
      this.itemNoteDialog = true;
    }
  },
};
</script>
<style>
.fab {
  bottom: 35px !important;
}

.item-add-toolbar {
  background-color: #1976d2 !important;
  border-bottom-left-radius: 0px !important;
  border-bottom-right-radius: 0px !important;
  border-top-left-radius: 0px !important;
  border-top-right-radius: 0px !important;
}

.card-title {
  position: sticky;
  top: 0;
  z-index: 999;
}

.toolbar-title {
  width: 100% !important;
}

.toolbar-tab {
  color: white !important;
}

.list-item {
  cursor: pointer;
  box-shadow: 0px 1px 4px -2px rgb(171 149 149 / 50%);
  -webkit-box-shadow: 0px 1px 4px -2px rgb(171 149 149 / 50%);
  color: transparent !important;
}

.item-title {
  white-space: break-spaces;
}

.v-list-item__title {
  color: rgba(0, 0, 0, 0.87) !important;
}

.v-input--selection-controls__input:hover .v-input--selection-controls__ripple:before {
  background-color: transparent !important;
}

.list-item.isCompleted {
  background-color: #dadada91;
  filter: grayscale(20%);
}

.progressbar-wrapper {
  margin: 5px 18px;
}
</style>
