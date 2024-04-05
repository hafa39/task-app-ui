<template>
  <v-app-bar
      app
      color="teal"
      dark
  >
    <v-container>
      <div class="d-flex align-center">
        <h3 class="font-weight-bold ">TaskAgile</h3>
        <!--<h3 class="font-weight-bold ">User: {{user.name}}</h3>-->
        <user-header  v-bind:user="user" v-on:logout="logout"/>
        <!--<v-btn v-on:click="logout">Logout</v-btn>-->
      </div>
    </v-container>
  </v-app-bar>

</template>

<script>
import { mapGetters } from 'vuex'
import meService from "@/services/me";
import authService from "@/services/authentification";
import axios from "axios";
import UserHeader from "@/components/ui/UserHeader.vue";
export default{
  name: "PageHeader",
  components: {UserHeader},
  data(){
    return {
      username : ''
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'hasBoards',
      'personalBoards',
      'teamBoards'
    ])
  },
  methods : {
    logout() {
      authService.logout()
          .then((response) => {
            window.location.reload();
          })
          .catch((error) => {
            console.log(error)
          });
    },
    async getMe(){
      try {
        await this.$store.dispatch('getUser')
        console.log('test')
        await this.$store.dispatch('getTeams')
        await this.$store.dispatch('getBoards')
      }catch (e) {
        console.log(e)
      }
    }
  },

  mounted () {
    this.getMe().then().catch()
  }
}
</script>

<style scoped>

</style>