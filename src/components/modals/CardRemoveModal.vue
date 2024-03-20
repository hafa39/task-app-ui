<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{props}">
      <v-btn class="ma-2"
             density="compact"
             outlined
             large
             fab
             color="red"
             v-bind="props"
             icon="mdi-close-circle"></v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">{{card.title}}</span>
      </v-card-title>
      <v-card-text>
        Do you want to remove the card?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            color="blue darken-1"
            text
            @click="close"
        >
          No
        </v-btn>
        <v-btn
            color="blue darken-1"
            text
            @click="removeCard"
        >
          Yes
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "CardRemoveModal",

  props: {
    card: {
      required: true,
      type: Object
    }
  },

  data () {
    return {
      dialog: false,
      errorMessage: ''
    }
  },

  methods : {
    close () {
      this.errorMessage = ''
      this.dialog = false
    },

    removeCard(){
      this.$emit('removeCard', this.card.id)
      this.close()
    }
  }

}
</script>

<style scoped>

</style>
