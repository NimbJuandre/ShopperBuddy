<template>
  <v-list-item v-if="user.visible" class="user-item" ripple>
    <v-list-item-icon class="user-icon" v-text="userDisplayNameLetter">
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title v-text="user.displayName"></v-list-item-title>
      <v-list-item-subtitle v-text="user.email"></v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action>
      <v-btn v-if="!user.selected" class='link' color="blue" icon title="Click to invite the user to your list" @click="InviteUser(user)">
        INVITE
      </v-btn>
      <v-btn v-else class='link' color="red" icon title="Click to uninvite the user to your list" @click="UnInviteUser(user)">
        UNINVITE
      </v-btn>
    </v-list-item-action>
  </v-list-item>
</template>
<script>
export default {
  name: "User",
  props: ["user"],
  data() {
    return {

    };
  },
  computed: {
    userDisplayNameLetter() {
      return this.user.displayName.substring(0, 1);
    },
  },
  methods: {
    InviteUser(user) {
      this.$emit("InviteUser", user);
    },
    UnInviteUser(user) {
      this.$emit("UnInviteUser", user);
    },
  },
};
</script>
<style>
.user-item {
  cursor: pointer;
  box-shadow: 0px 1px 4px -2px rgb(171 149 149 / 50%);
  -webkit-box-shadow: 0px 1px 4px -2px rgb(171 149 149 / 50%);
  color: transparent !important;
}

.user-icon {
  background-color: lightblue;
  color: black;
  border-radius: 50%;
  font-size: x-large;
  width: 36px;
  place-content: space-around;
  margin-right: 10px !important;
}

.link {
  border-radius: 25px;
  height: 25px !important;
  width: 80px !important;
  color: white !important;
}
</style>
