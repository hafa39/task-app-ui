<template>
  <SideNavigation />
  <v-container fluid class=" blue-grey darken-4 mt-5 ">
    <div>
      <create-team-modal/>
    </div>
    <v-container fluid class=" blue-grey darken-4 mt-5 ">
      <h2 class="mb-5 grey--text" > Personal Boards</h2>
      <v-row md = "2">

        <v-col md = "2"
               v-for="board in personalBoards"
               :key="board.id">

          <board-cart v-bind:board="board" v-on:openBoard = openBoard> </board-cart>
        </v-col>
        <v-col md = "2">
          <create-board-modal v-bind:team-id="0"/>
        </v-col>
      </v-row>
    </v-container>

    <div v-for="team in teamBoards">
      <v-container fluid class="blue-grey darken-4 mt-5" >
        <h2 class=" mb-5 grey--text" > {{team.name}}</h2>
        <v-row no-gutters
               style="height: 200px;"
               class=""
        >
          <v-col md = "2"
                 v-for="board in team.boards"
                 :key="board.id"
          >
            <board-cart v-bind:board="board" v-on:openBoard = openBoard> </board-cart>
          </v-col>
          <v-col md = "2">
            <create-board-modal v-bind:team-id="team.id"/>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-container>
</template>

<script>

import BoardCart from "@/components/BoardCart.vue";
import CreateBoardModal from "@/components/modals/CreateBoardModal.vue";
import PageHeader from "@/components/PageHeader.vue";
import SideNavigation from "@/components/SideNavigation.vue";
import {mapGetters} from "vuex";
import CreateTeamModal from "@/components/modals/CreateTeamModal.vue";


export default {
name: "HomePage",
  components: {SideNavigation, CreateTeamModal, CreateBoardModal, BoardCart, PageHeader},

  data () {
    return {
      selectedTeamId: 0
    }
  },
  computed: {
    ...mapGetters([
      'personalBoards',
      'teamBoards'
    ])
  },
  methods :{
    openBoard (board) {
      this.$router.push({name: 'board', params: {boardId: board.id}})
    },
  }
}
</script>

<style scoped>

</style>
