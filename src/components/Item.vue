<template>
  <v-list-item class="item" ripple @click="addItem(item)">
    <v-list-item-icon class="mr-0">
      <v-icon
        class="item-icon"
        :class="{ rotate: item.selected }"
        v-bind:style="{ transform: `rotate(${deg}deg)` }"
        rounded
        large
        >mdi-plus</v-icon
      >
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title v-text="item.name"></v-list-item-title>
    </v-list-item-content>
    <div v-if="item.selected">
      <v-list-item-icon
        class="ma-0"
        v-if="count <= 1"
        v-on:click.stop="deselectItem(item)"
      >
        <v-icon class="remove-icon" large>mdi-close</v-icon>
      </v-list-item-icon>
      <v-list-item-icon
        class="item-count ma-0"
        v-else
        v-on:click.stop="minusItemToAdd(item)"
      >
        {{ count }}
        <v-icon class="remove-icon" large>mdi-minus</v-icon>
      </v-list-item-icon>
    </div>
    <v-list-item-icon
      v-if="!item.newItem"
      class="ml-0"
      v-on:click.stop="deleteItem(item)"
    >
      <v-icon class="remove-icon" large>mdi-delete</v-icon>
    </v-list-item-icon>
  </v-list-item>
</template>
<script>
import firebase from "firebase";
export default {
  name: "Item",
  props: ["item"],
  data() {
    return {
      deg: 0,
      count: this.item.count,
    };
  },
  methods: {
    addItem(item) {
      if (item.newItem) this.createNewItem(item);
      else this.selectItemToAdd(item);
    },
    async createNewItem(item) {
      const data = {
        name: item.name.trim(),
        count: 0,
        modifiedDate: new Date(),
        isCompleted: false,
      };

      this.$emit("afterItemCreated", data);

      await firebase.firestore().collection("items").add(data);
    },
    selectItemToAdd(item) {
      this.deg += 360;
      this.count++;

      this.$emit("selectItem", item);
    },
    deselectItem(item) {
      this.count = 0;
      this.deg -= 360;

      this.$emit("deselectItem", item);
    },
    async deleteItem(item) {
      await firebase.firestore().collection("items").doc(item.id).delete();

      this.$emit("refreshItems", item.id);
    },
    minusItemToAdd(item) {
      this.count--;
      this.deg -= 360;

      this.$emit("minusSelectedItemCount", item);
    },
  },
};
</script>
<style>
.item {
  cursor: pointer;
}

.remove-icon {
  border-radius: 0px;
  color: #f71b1b !important;
  transition: all 0.3s ease-in-out !important;
}

.item-count {
  align-items: center;
}

.item-icon {
  border-radius: 25px;
  color: white !important;
  background-color: lightgrey;
  margin-right: 15px;
  transition: all 0.4s ease-in-out !important;
}

.item-icon.rotate {
  transform: rotate(180deg);
  background-color: #1976d2 !important;
}

.v-list {
  padding: 0px !important;
}
</style>
