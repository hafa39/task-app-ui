<template>
    <v-dialog
        v-model="dialog"
        persistent
        max-width="600px"
    >
      <template v-slot:activator="{props}">
        <v-list-item prepend-icon="mdi-account" title="My Account" value="account" v-bind="props"
                     v-on:click="loadProfile()"></v-list-item>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">User {{user.username}}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                    v-model="user.firstName"
                    label="Firstname"
                    required
                >  </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                    v-model="user.lastName"
                    label="Lastname"
                    required
                >  </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
<!--                @change="uploadFile"-->
                <v-file-input
                    @change="handleFileSelection"
                    accept="image/png, image/jpeg"
                    label="Avatar"
                    placeholder="Pick an avatar"
                    prepend-icon="mdi-camera"
                >
                </v-file-input>
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
              @click="updateProfile"
          >
            update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

</template>

<script>
import {mapGetters} from "vuex";
import meService from "@/services/me"
import cardService from "@/services/cards";
import errorParser from "@/utils/error-parser";
export default {
  name: "UserProfileModal",
  data(){
    return {
      dialog: false,
      errorMessage: '',
      user: {},
      avatar: ""
    }
  },

  methods: {
    loadProfile(){
      meService.getUser().then(response =>{
            this.user = response.data})
    },
    updateProfile2 () {
      meService.updateUserInfo(this.user
      ).then((user) => {
        if (this.avatar !== ""){
          const formData = new FormData()
          formData.append("file", this.avatar, this.avatar.name)
          meService.createAvatar(formData)
              .then(response =>{
                    let updatedAvatar = response.data
                    this.$emit('updateAvatar', updatedAvatar)
              }).catch(error => console.log(error))
        }
        this.$emit('updated', this.user)
        this.close()
      }).catch(error => {
        let err = errorParser.parse(error)
        console.log(err)
        this.errorMessage = err.message
      })
    },

    async updateProfile (){
      try {
        await meService.updateUserInfo(this.user)
      }catch (e) {
        let err = errorParser.parse(e)
        this.errorMessage = err.message
      }

      try {
        if (this.avatar !== ""){
          const formData = new FormData()
          formData.append("file", this.avatar, this.avatar.name)
          let response = await meService.createAvatar(formData)
          let updatedAvatar = response.data
          this.$emit('updateAvatar', updatedAvatar)
        }
      }catch (e) {
        let err = errorParser.parse(e)
        this.errorMessage = err.message
      }
    },

    close () {
      this.errorMessage = ''
      this.dialog = false
    },
    handleFileSelection(event) {
      // Update the selectedFile data property with the selected file
      this.avatar = event.target.files[0];
    },
  }
}
</script>


<style scoped>

</style>