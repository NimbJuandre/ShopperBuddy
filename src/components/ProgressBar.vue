<template>
    <div>
        <v-col cols="11">
            <v-progress-linear v-model=progressBarPercentage rounded color="green" background-color="grey lighten-1"
                height="10">
            </v-progress-linear>
        </v-col>
        <v-col class="pa-0 mt-2" cols="1">
            <label class="progress-text font-weight-bold">{{ progressBarText }}</label>
        </v-col>
    </div>
</template>
<script>
export default {
    name: 'ProgressBar',
    props: ['list'],
    data() {
        return {
            dialog: false,
        }
    },
    computed: {
        // a computed getter
        totalItemCompleted() {
            // `this` points to the component instance
            var completedItems = this.list.items.filter(i => i.isCompleted).length;
            return completedItems
        },
        progressBarPercentage() {
            return parseInt(Math.round((this.list.items.length / this.totalItemCompleted) * 100));
        },
        progressBarText() {
            return `${this.totalItemCompleted}/${this.list.items.length}`;
        }
    }
}
</script>
<style>

</style>