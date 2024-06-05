<template>
  <v-navigation-drawer
      expand-on-hover
      rail
      location="left"
      permanent="true"
  >
<!--    prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"-->
<!--
    v-bind:prepend-avatar="user.avatar.dataUrl"
-->
    <v-list>
      <v-list-item
          v-bind:title="user.name"
          v-bind:subtitle="user.fullName"
          v-bind:prepend-avatar="avatar.dataUrl"
      ></v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item prepend-icon="mdi-home-city" title="Home" value="home" to="/"></v-list-item>
      <user-profile-modal v-on:updated="updateUserInfo" v-on:updateAvatar="updateAvatar"/>
      <v-list-item prepend-icon="mdi-help-circle" title="Help" value="help" to="/help"></v-list-item>
      <!--      <v-list-item prepend-icon="mdi-folder" title="My Files" value="myfiles"></v-list-item>-->
<!--      <v-list-item prepend-icon="mdi-account-multiple" title="Shared with me" value="shared"></v-list-item>-->
<!--      <v-list-item prepend-icon="mdi-star" title="Starred" value="starred"></v-list-item>-->
      <v-list-item prepend-icon="mdi-logout" title="Logout" value="logout" v-on:click="logout"></v-list-item>
    </v-list>
    <template v-slot:append>
    </template>
  </v-navigation-drawer>

</template>

<script>


import meService from "@/services/me";
import authService from "@/services/authentification";

import UserProfileModal from "@/components/modals/UserProfileModal.vue";
import attachmentService from "@/services/attachments";
import {mapGetters} from "vuex";
import {avatar} from "../store/getters";
export default {
name: "SideNavigation",
  components: {UserProfileModal},

  data(){
    return {
      usertest: {
        username : 'user',
        firstName: 'fn',
        lastName: 'ln',
      }
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'hasBoards',
      'personalBoards',
      'teamBoards',
      'avatar'
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
        const avatar = (await meService.getAvatar()).data
        attachmentService.createBlobUrl(avatar)
        console.log(avatar)
        this.$store.dispatch('updateUserAvatar',avatar)
        console.log(this.user)
      }catch (e) {
        console.log(e)
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
    },

    updateUserInfo(user){
      this.$store.dispatch('updateUser',user)
    },

    updateAvatar(avatar){
      attachmentService.createBlobUrl(avatar)
      this.$store.dispatch('updateUserAvatar',avatar)
      window.location.reload();
    }
  },
  mounted () {
    this.getMe()
  }
}
</script>

<style scoped>

</style>
