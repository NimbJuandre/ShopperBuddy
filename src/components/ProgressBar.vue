<template>
  <div class="progress-row">
    <div class="progress-col">
      <v-progress-linear :value="progressBarPercentage" rounded color="green" background-color="grey lighten-1"
        height="10">
      </v-progress-linear>
    </div>
    <div v-if="showLabel" class="progress-text-col">
      <label class="progress-text font-weight-bold">{{
        progressBarText
      }}</label>
    </div>
  </div>
</template>
<script>
export default {
  name: "ProgressBar",
  props: ["list", "showLabel"],
  data() {
    return {
      dialog: false,
    };
  },
  computed: {
    totalItemCompleted() {
      var completedItems = this.list.items.filter((i) => i.isCompleted).length;
      return completedItems;
    },
    progressBarPercentage() {
      if (this.list.items.length === 0)
        return 0;

      return parseInt(
        Math.round((this.totalItemCompleted / this.list.items.length) * 100)
      );
    },
    progressBarText() {
      return `${this.totalItemCompleted}/${this.list.items.length}`;
    },
  },
};
</script>
<style>
.progress-row {
  display: flex;
  width: 100%;
}

.progress-col {
  width: 100%;
  margin-top: 6px;
}

.progress-text-col {
  margin-left: 15px;
}
</style>
