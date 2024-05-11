<template>
  <v-row >
    <v-dialog
        v-model="dialog"
        persistent
        max-width="600px"
    >
      <template v-slot:activator="{props}">
        <v-btn
            class="mt-4"
            outlined
            rounded=""
            fab
            v-bind="props"
        >
          <v-icon> mdi-plus</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">Add member</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                    v-model="username"
                    label="Username"
                    required
                >  </v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <div v-show="errorMessage" class="text-red">{{ errorMessage }}</div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="blue darken-1"
              text
              @click="close"
          >
            Close
          </v-btn>
          <v-btn
              color="blue darken-1"
              text
              @click="addMember"
          >
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import boardService from "@/services/boards";

export default {
  name: "AddMemberModal",
  props: {
    boardId: {
      required: true,
      type: Number
    }
  },
  data () {
    return {
      dialog: false,
      username: '',
      errorMessage: ''
    }
  },


  methods: {
    addMember () {
      /*this.$v.$touch()
      if (this.$v.$invalid) {
        return
      }*/

      boardService.addMember(this.boardId, this.username).then((member) => {
        this.$emit('added', member)
        this.close()
      }).catch(error => {
        console.log(error)
        this.errorMessage = error.response.data.message
      })
    },
    close () {
      this.username = ''
      this.errorMessage = ''
      this.dialog = false
    }
  }
}
</script>

<style scoped>

</style>
