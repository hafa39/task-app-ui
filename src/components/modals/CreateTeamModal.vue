<template>
  <v-row class="mt-5 ml-5 mb-5">
    <v-dialog
        v-model="dialog"
        persistent
        max-width="600px"
    >
      <template v-slot:activator="{props}">
        <v-btn
            v-bind="props"
        >
          <v-icon left>mdi-plus</v-icon>
          team
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">New team</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                    v-model="team.name"
                    label="Name*"
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
              variant="text"
              @click="close"
          >
            Close
          </v-btn>
          <v-btn
              color="blue darken-1"
              text
              @click="saveTeam"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import teamService from '@/services/teams'
export default {
  name: "CreateTeamModal",
  data: () => ({
    dialog: false,
    team: {
      name: ''
    },
    errorMessage: ''
  }),
  methods: {
    async saveTeam () {
      let response
      try {
        response = await teamService.create(this.team)
        this.$store.dispatch('addTeam', response.data)
        this.close()
      }catch (error) {
        console.log(error)
        this.errorMessage = error.message}
    },
    close () {
      this.team.name = ''
      this.errorMessage = ''
      this.dialog = false
    }
  }
}
</script>

<style scoped>

</style>
