<template>
  <v-row >
    <v-dialog
        v-model="dialog"
        persistent
        max-width="600px"
    >
      <template v-slot:activator="{props}">
        <v-btn
            class="ma-2"
            outlined
            large
            fab
            v-bind="props"
        >
          <v-icon> mdi-plus</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">New board</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                    v-model="board.name"
                    label="Name*"
                    required
                >  </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                    v-model="board.description"
                    label="Description*"
                    required
                >  </v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <div v-show="errorMessage" class="text-red">{{ errorMessage }}</div>
          <small>*indicates required field</small>
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
              @click="saveBoard"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import boardService from '@/services/boards'

export default {
  name: 'CreateBoardModal',
  props: {
    teamId: {
      required: true,
      type: Number
    }
  },
  data () {
    return {
      dialog: false,
      board: {
        name: '',
        description: ''
      },
      errorMessage: ''
    }
  },


  methods: {
    async saveBoard () {
      const board = {
        teamId: this.teamId,
        name: this.board.name,
        description: this.board.description
      }
      try {
        const response = await boardService.create(board)
        const createdBoard = response.data
        console.log(createdBoard)
        this.$store.dispatch('addBoard', createdBoard)
        //this.$emit('created', createdBoard.id)
        this.close()
      }
      catch (error){
        this.errorMessage = error.message
      }
    },
    close () {
      this.board.name = ''
      this.board.description = ''
      this.errorMessage = ''
      this.dialog = false
    }
  }
}
</script>

<style scoped>

</style>
