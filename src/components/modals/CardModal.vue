<template>
  <v-dialog v-model="dialog" persistent max-width="1000px">
    <template v-slot:activator="{props}">
      <v-btn
          class="ma-2"
          density="compact"
          outlined
          large
          fab
          color="blue-grey"
          v-bind="props"
          v-on:click="loadCard(cardId)"
          icon="mdi-open-in-new"
      >
      </v-btn>
    </template>
    <v-snackbar v-model="snackbar.showSnackbar"
                :color="snackbar.snackbarColor"
                :timeout="snackbar.snackbarTimeout"
                :top="true"
    >
      {{ snackbar.snackbarMessage }}
    </v-snackbar>
    ___________

    <v-card>
      <v-row>
        <v-col cols="6">
          <v-card-title>
            <v-textarea class="mt-5"
                        rows="1"
                        row-height="15"
                        id="cardTitle"
                        label="Title"
                        v-model="card.title"
                        ref="titleTextArea"
                        @keydown.enter.prevent="changeCardTitle">
            </v-textarea>
          </v-card-title>
          <v-card-text>
            <v-textarea v-model="card.description"
                        label="Description"
                        auto-grow rows="3"
                        @keydown.enter.prevent="changeCardDescription"
                        ref="descriptionTextArea"
            ></v-textarea>
            <small class="text-muted">Press 'Enter' to apply the changes.</small>
          </v-card-text>

          <v-card-text>
            <v-icon left>mdi-paperclip</v-icon>
            Attachments
            <v-list max-height="300">
              <v-list-item v-for="attachment in attachments"
                           :key="attachment.id"
                           :title="attachment.fileName"
                           :href="attachment.dataUrl"
                           target="_blank"
              >
                <v-img v-bind:src="attachment.dataUrl"
                       style="max-height: 200px"
                ></v-img>
                <v-list-item-action>
                  <v-btn v-on:click.stop.prevent="removeAttachment(attachment.id)" icon>
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card-text>

          <v-card-text>
            <v-textarea class="mt-5"
                        rows="1"
                        row-height="20"
                        label="Add comment"
                        v-model="newComment"
                        ref="commentTextArea"
                        @keydown.enter.prevent="addComment">
            </v-textarea>
            <v-card-subtitle>
              <v-icon>mdi-comment</v-icon>
              <span>Comments</span>
            </v-card-subtitle>
            <v-list max-height="300">
              <v-list-item v-for="comment in cardComments"
                           :key="comment.id"
                           target="_blank"
              >
                <v-row>
                  <v-col cols="6">
                    <strong>{{ comment.user.shortName + ": "}}</strong>
                    <span>{{ comment.text +" " }}</span>
                    <v-spacer></v-spacer>
                    <span>{{ comment.when +" "}}ago</span>
                  </v-col>
                  <v-col>
                    <v-btn class="ma-2" density="compact" outlined large fab icon="mdi-close-circle"
                           v-on:click="removeComment(comment.id)"
                           v-show="comment.user.userId === user.id"
                    />
                  </v-col>
                </v-row>

              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-text>
            <div v-show="errorMessage" class="text-red">{{ errorMessage }}</div>
          </v-card-text>
        </v-col>

        <v-col cols="2"></v-col>

        <v-col class="mt-10">
          <v-card-title>Add to card</v-card-title>
          <v-card-text class="v-col-8">
            <v-file-input
                density="compact"
                label="upload"
                @change="uploadFile"
                ref="fileInput"
            >
            </v-file-input>
          </v-card-text>

          <v-card-text>
            <v-icon left>mdi-format-list-bulleted</v-icon>
            Activities
            <v-list max-height="300">
              <v-list-item v-for="activity in cardActivities"
                           :key="activity.createdDate"
                           :title="activity.detail"
              >
                <strong>{{ activity.user.shortName + " "}}</strong>
                <span>{{ activity.actionDetail +" " }}</span>
                <v-spacer></v-spacer>
                <span>{{ activity.when +" "}}ago</span>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-col>
      </v-row>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn v-show="!card.archived" color="green darken-1" text @click="setArchived(true)">Archive</v-btn>
        <v-btn v-show="card.archived" color="green darken-1" text @click="setArchived(false)">Activate</v-btn>
        <v-btn color="blue darken-1" text @click="close">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import cardService from "@/services/cards";
import attachmentService from "@/services/attachments";
import { formatDistance } from 'date-fns'
import {mapGetters} from "vuex";
import cards from "@/services/cards";
export default {
  name: "CardModal",
  props: {
    cardId: {
      required: true,
      type: Number
    },
    members:{
      required: true,
      type: Array
    }
  },
  data () {
    return {
      dialog: false,
      board: {
        name: '',
        description: ''
      },
      card : {},
      assignees: [],
      attachments: [],
      activities: [],
      comments:[],
      newComment: '',
      editingDescription: false,
      errorMessage: '',

      snackbar: {
        showSnackbar: false,
        snackbarMessage: '',
        snackbarColor: 'success',
        snackbarTimeout: 3000
      }
    }
  },

  computed:{

    ...mapGetters([
      'user',
    ]),

    cardActivities () {
      if (!this.members.length || !this.activities.length) {
        return []
      }
      const userById = {}
      this.members.forEach(member => {
        console.log(member)
        userById[member.userId] = member
      })
      const cardActivities = []
      const now = new Date()
      this.activities.forEach(activity => {
        const detail = JSON.parse(activity.detail)
        let actionDetail = ''
        if (activity.type === 'add-comment') {
          actionDetail = detail.comment
        } else if (activity.type === 'add-card') {
          actionDetail = 'Added this card'
        } else if (activity.type === 'add-attachment') {
          actionDetail = 'Added attachment ' + detail.fileName
        } else if (activity.type === 'change-card-description') {
          actionDetail = 'Changed card description'
        } else if (activity.type === 'change-card-title') {
          actionDetail = 'Changed card title'
        }

        cardActivities.push({
          id: activity.id,
          user: userById[activity.userId],
          type: activity.type,
          actionDetail: actionDetail,
          when: formatDistance(new Date(activity.createdDate), now),
          createdDate: activity.createdDate
        })

      })
      cardActivities.sort(
          (a1, a2) => {
            return Date.parse(a2.createdDate )- Date.parse(a1.createdDate)
          })
      //console.log("test")
      //console.log(cardActivities)

      return cardActivities
    },

    cardComments(){
      const userById = {}
      this.members.forEach(member => {
        console.log(member)
        userById[member.userId] = member
      })
      const cardComments = []
      const now = new Date()
      this.activities.forEach(activity => {
        const detail = JSON.parse(activity.detail)
        let commentText = ''
        if (activity.type === 'add-comment') {
          commentText = detail.comment

          cardComments.push({
            id: activity.id,
            user: userById[activity.userId],
            text: commentText,
            when: formatDistance(new Date(activity.createdDate), now),
            createdDate: activity.createdDate
          })
        }
        cardComments.sort((c1, c2) => {
          return Date.parse(c2.createdDate )- Date.parse(c1.createdDate)
        })

        console.log(cardComments)
      })
      return cardComments
    }
  },

  methods : {
    loadCard(cardId){
      cardService.get(cardId).then(response =>{
            this.card = response.data
            this.loadAttachments(this.card.id)
            this.loadActivities(this.card.id)

          }
      )

    },

    loadAttachments (cardId) {
      attachmentService.getCardAttachments(cardId).then(response => {
        let attachments = response.data
        attachments.forEach(attachment => {
          attachmentService.createBlobUrl(attachment)
        })
        this.attachments = attachments
      }).catch(error => {
        console.log(error.message)
      })
    },


    loadActivities (cardId) {
      cardService.getCardActivities(cardId).then(response => {
        this.activities = response.data
      }).catch(error => {
        console.log(error.message)
      })
    },

    close () {
      this.board.name = ''
      this.board.description = ''
      this.errorMessage = ''
      this.dialog = false
    },

    changeCardTitle () {
      cardService.changeCardTitle(this.cardId, this.card.title).then(() => {
        this.$emit('titleChanged', {id: this.cardId, title: this.card.title})
        this.loadActivities(this.cardId)
        this.$refs.titleTextArea.blur();
        this.showSnackbar('Card description changed.')
        /* $('#cardModal').focus()*/
      }).catch(error => {
        console.log(error.message)
      })
    },

    changeCardDescription () {
      cardService.changeCardDescription(this.cardId, this.card.description).then(() => {
        this.$emit('descriptionChanged', {id: this.cardId, description: this.card.description})
        this.editingDescription = false
        this.loadActivities(this.cardId)
        this.$refs.descriptionTextArea.blur();
        // Set the success message to be displayed in the snackbar
        this.showSnackbar('Card title changed.')
      }).catch(error => {
        console.log(error.message)
      })
    },

    addComment () {
      cardService.addCardComment(this.cardId, this.newComment).then(response => {
        this.newComment = ''
        //this.activities.push(commentActivity)
        this.loadActivities(this.cardId)
        this.$refs.commentTextArea.blur();
        this.showSnackbar('Comment added.')
      }).catch(error => {
        console.log(error.message)
      })
    },

    removeComment(commentId){
      cardService.removeComment(commentId).then(
          ()=>{
            this.loadActivities(this.card.id)
            this.showSnackbar('Comment removed.')
          }
      ).catch(error => {
        console.log(error.message)
      })
    },

    removeAttachment(attachmentId){
      attachmentService.removeAttachment(attachmentId).then(
          ()=>{
            this.loadAttachments(this.card.id)
            this.showSnackbar('Attachment removed.')
          }
      )
    },

    uploadFile(event) {
      // Check if a file has been selected
      console.log(event)
      this.uploading = true;
      let selectedFile = event.target.files[0]
      // Create a FormData object to send the file
      const formData = new FormData()
      formData.append("file", selectedFile, selectedFile.name)
      console.log(formData)

      // Send the file to the server using Axios
      attachmentService.add(formData,this.cardId).then(response =>{
        let attachment = response.data
        attachmentService.createBlobUrl(attachment)
        console.log(response.data)
        this.attachments.push(attachment)
        this.loadActivities(this.cardId)
        // Clear selected file from file input
        this.$refs.fileInput.reset()
        this.showSnackbar('Attachment added.')
      }).catch(error => console.log(error))
    },

    setArchived(isArchived){
      cardService.setArchived(this.cardId,isArchived)
          .then(()=>{
            this.$emit('archivedChanged', {id: this.cardId, archived: isArchived})
            this.close()
          })
    },

    showSnackbar(message){
      this.snackbar.snackbarMessage = message
      this.snackbar.showSnackbar = true
    }

  }



}
</script>

<style scoped>

</style>
