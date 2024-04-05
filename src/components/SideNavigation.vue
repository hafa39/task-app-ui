<template>
  <v-navigation-drawer
      expand-on-hover
      rail
      location="left"
      permanent="true"
  >
    <v-list>
      <v-list-item
          prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
          v-bind:title="user.name"
          v-bind:subtitle="user.fullName"
      ></v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item prepend-icon="mdi-home-city" title="Home" value="home"></v-list-item>
      <v-list-item prepend-icon="mdi-account" title="My Account" value="account"></v-list-item>
      <v-list-item prepend-icon="mdi-folder" title="My Files" value="myfiles"></v-list-item>
      <v-list-item prepend-icon="mdi-account-multiple" title="Shared with me" value="shared"></v-list-item>
      <v-list-item prepend-icon="mdi-star" title="Starred" value="starred"></v-list-item>
    </v-list>
    <template v-slot:append>
      <div class="pa-2">
        <v-btn size="small" block v-on:click="logout">
          Logout
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>

</template>

<script>


import meService from "@/services/me";
import authService from "@/services/authentification";
import {mapGetters} from "vuex";
export default {
name: "SideNavigation",

  data(){
    return {
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
    async getMe(){
      try {
        const user = (await meService.getUser()).data
        this.$store.dispatch('updateUser',user)
      }catch (e) {
        console.log(e)
        if (e.response && e.response.status === 401) {
          console.log(e.response.status)
          await authService.login();
        }
      }
      try {
        const teams = (await meService.getTeams()).data
        this.$store.dispatch('updateTeams',teams)
      }catch (e) {
        console.log(e)
      }
      try {
        const boards = (await meService.getBoards()).data
        this.$store.dispatch('updateBoards',boards)
      }catch (e) {
        console.log(e)
      }
    },

    logout() {
      authService.logout()
          .then((response) => {
            window.location.reload();
          })
          .catch((error) => {
            console.log(error)
          });
    }
  },
  mounted () {
    this.getMe()
  }
}
</script>

<style scoped>

</style>
