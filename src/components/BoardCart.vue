<template>
  <v-card class="mr-5" outlined>
    <v-card-title> {{board.name}} </v-card-title>
    <v-card-subtitle> {{ board.description }}</v-card-subtitle>
    <v-card-text> text</v-card-text>
    <v-card-actions >
      <v-btn rounded color="" right v-on:click="openBoard">Edit</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "BoardCart",
  props : {
    board : {
      required : false,
      type: Object
    }
  },
  methods :{
    openBoard(){
      this.$emit("openBoard",this.board)
    }
  }
}
</script>

<style scoped>

</style>
