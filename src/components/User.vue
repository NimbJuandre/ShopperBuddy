<template>
  <v-list-item v-if="user.visible" class="user-item" ripple>
    <v-list-item-icon class="user-icon" v-text="userDisplayNameLetter">
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title v-text="user.displayName"></v-list-item-title>
      <v-list-item-subtitle v-text="user.email"></v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action>
      <v-btn class='invite' icon title="Click to logout" @click="InviteUser(user)">
        INVITE
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
      deg: 0,
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
  place-content: center;
  padding-right: 3px;
  margin-right: 10px !important;
}

.invite {
  border-radius: 25px;
  background-color: #1976d2;
  height: 25px !important;
  width: 70px !important;
  color: white !important;
}
</style>
