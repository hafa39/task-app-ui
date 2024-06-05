<template>
  <SideNavigation/>
  <div>
    <div class="board">
      <v-container>
        <div class="board-header">
          <v-row>
            <v-col cols="3">
              <h3>Board: {{board.name}}</h3>
              <v-checkbox label="Show archived" v-model="showArchived" value="true"></v-checkbox>
            </v-col>
            <v-col cols="3">
              <h3></h3>
            </v-col>
            <v-col cols="3">
              <h3>Members</h3>
              <v-row>
                <div v-for="member in members" v-bind:key="member.id">
                  <user-avatar v-bind:user="member" v-bind:avatar="member.avatar"/>
                  <!--<v-avatar color="primary" size="x-small">
                    <span>{{member.shortName}}</span>
                  </v-avatar>-->
                </div>
              </v-row>

              <add-member-modal v-bind:boardId="board.id" v-on:added="onMemberAdded"/>
            </v-col>
          </v-row>
        </div>
        <div class="board-body">
          <draggable
              v-model="cardLists"
              group="cardLists"
              @start="drag=true"
              @end=onCardListDragEnded
              item-key="id"
              class="v-row mb-5 mt-5">
            <template #item="{element: cardList}">
              <div class="v-col-2">
                <div class="card-list">
                  <div class="list-header">
                    <h3>{{cardList.name}}</h3>
                  </div>
                  <draggable
                      v-model="cardList.cards"
                      group="cards"
                      @start="drag=true"
                      @end="onCardDragEnded"
                      item-key="id"
                  >
                    <template #item="{element: card}">
                      <div class="mt-3" v-show="!card.archived || showArchived">
                        <v-card
                            outlined>
                          <v-card-title>
                            {{card.title}}
                          </v-card-title>
                          <v-card-subtitle>
                            Subtitle
                          </v-card-subtitle>
                          <v-card-actions>
                            <card-remove-modal v-bind:card="card"
                                               v-on:removeCard = "removeCard"
                            />
                            <card-modal v-bind:card-id="card.id"
                                        v-bind:members="members"
                                        v-on:titleChanged = "updateCardTitle"
                                        v-on:descriptionChanged = "updateCardDescription"
                                        v-on:archivedChanged = "updateCardArchived"
                            >

                            </card-modal>
                          </v-card-actions>
                        </v-card>
                      </div>
                    </template>
                  </draggable>

                  <v-btn class=" mt-5 add-card-button" v-show="!cardList.cardForm.open" @click="openAddCardForm(cardList)">+ Add a card</v-btn>

                  <div class="mt-5 card form" v-if="cardList.cardForm.open" >
                    <v-sheet class="mx-auto">
                      <v-form @submit.prevent="addCard(cardList)"
                              ref="AddCardForm" >
                        <v-text-field v-model="cardList.cardForm.title"
                                      v-bind:id="'cardTitle' + cardList.id"
                                      label="Card name"
                                      @keydown.enter.prevent="addCard(cardList)"
                                      :rules="nameRules"
                                      ref="AddCardFormField"
                        ></v-text-field>
                        <v-btn icon type="submit" color="primary" class="mr-2" size="small"><v-icon>mdi-plus</v-icon></v-btn>
                        <v-btn icon color="secondary" class="mr-2" size="small" @click="resetAddCardForm"><v-icon>mdi-refresh</v-icon></v-btn>
                        <v-btn icon color="error" class="mr-2" size="small" @click="closeAddCardForm(cardList)"><v-icon>mdi-close</v-icon></v-btn>
                      </v-form>
                    </v-sheet>
                  </div>
                </div>
              </div>
            </template>
            <template #footer>
              <div class="v-col-2">
                <v-btn class="mt-4" v-show="!addListForm.open" @click="openAddListForm()">+ Add a list</v-btn>
                <div class="mt-5 cardList form" v-show="addListForm.open">
                  <v-sheet class="mx-auto" >
                    <v-form @submit.prevent="addCardList()"  ref="AddListForm">
                      <v-text-field v-model="addListForm.name"
                                    label="List name"
                                    @keydown.enter.prevent="addCardList()"
                                    ref="AddCardListFormField">

                      </v-text-field>
                      <v-btn type="submit" icon color="primary" size="small" class="mr-2"><v-icon>mdi-plus</v-icon></v-btn>
                      <v-btn icon color="secondary" @click="resetAddListForm" size="small" class="mr-2"><v-icon>mdi-refresh</v-icon></v-btn>
                      <v-btn icon color="error" @click="closeAddListForm" size="small" class="mr-2"><v-icon>mdi-close</v-icon></v-btn>
                    </v-form>
                  </v-sheet>
                </div>
              </div>
            </template>
          </draggable>
        </div>
      </v-container>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import boardService from "@/services/boards";
import cardListService from "@/services/card-lists";
import parser from '@/utils/error-parser.js'
import AddMemberModal from "@/components/modals/AddMemberModal";
import cardService from "@/services/cards";
import CardModal from "@/components/modals/CardModal";
import CardRemoveModal from "@/components/modals/CardRemoveModal";
import UserAvatar from "@/components/ui/UserAvatar";
import SideNavigation from "@/components/SideNavigation.vue";
import PageHeader from "@/components/PageHeader.vue";
import me from "@/services/me";
import attachmentService from "@/services/attachments";
import cardLists from "@/services/card-lists";

export default {
name: "BoardPage",
  components: {SideNavigation, UserAvatar, CardRemoveModal, CardModal, AddMemberModal, PageHeader,draggable },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.loadBoard()
    })
  },
  data () {
    return {
      showArchived: false ,
      board: { id: 0, name: '', personal: false },
      cardLists: [/* {id, name, cards, cardForm} */],
      team: { name: '' },
      members: [/* {id, shortName} */{id:"",avatar:{dataUrl:""}}],
      addListForm: {
        open: false,
        name: ''
      },
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 20) || 'Name must be less than 10 characters',
      ],
    }
  },
  methods : {

    async loadBoard(){
      console.log('[BoardPage] Loading board')
      let response
      try {
        response = await boardService.getBoard(this.$route.params.boardId)
        //data = await boardService.getBoard(999).data
      } catch (e) {
        console.log(parser.parse(e))
        return
      }
      let data = response.data
      console.log(data)
      //this.team.name = data.team ? data.team.name : ''
      this.board.id = data.board.id
      this.board.personal = data.board.personal
      this.board.name = data.board.name
      this.members = data.members

      this.members = this.members.map(member => {
        member.avatar  = me.getAvatarByUserId(member.userId)
            .then(response => {
              member.avatar = response.data
              attachmentService.createBlobUrl(member.avatar)
            }).catch(e => member)
        return member
      })
      console.log(this.members)

      try {
        response = await cardListService.getCardLists(this.$route.params.boardId)
      } catch (e) {
        console.log(parser.parse(e))
        return
      }
      data = response.data
      console.log(data)

      this.cardLists.splice(0)

      data.sort((list1, list2) => {
        return list1.position - list2.position
      })

      data.forEach(cardList => {
        cardList.cards.sort((card1, card2) => {
          return card1.position - card2.position
        })

        this.cardLists.push({
          id: cardList.id,
          name: cardList.name,
          cards: cardList.cards,
          cardForm: {
            open: false,
            title: ''
          }
        })
      })
    },

    async removeCard(cardId){
      try {
        await cardService.removeCard(cardId)
        this.cardLists.forEach(cardList=>{
          cardList.cards = cardList.cards.filter(card => card.id !== cardId);
        })
      }catch (e) {
        console.log(parser.parse(error.message))
      }

    },

    onMemberAdded (member) {
      this.loadBoard()
    },

    addCard (cardList) {
      if (!cardList.cardForm.title.trim()) {
        return
      }

      const card = {
        boardId: this.board.id,
        cardListId: cardList.id,
        title: cardList.cardForm.title,
        position: cardList.cards.length
      }

      cardService.add(card).then(response => {
        const savedCard = response.data
        this.appendCardToList(cardList, savedCard)
        cardList.cardForm.title = ''
        this.closeAddCardForm(cardList)
      }).catch(error => {
        console.log(parser.parse(error.message))
      })
    },

    appendCardToList (cardList, card) {
      const existingIndex = cardList.cards.findIndex(existingCard => { return existingCard.id === card.id })
      if (existingIndex === -1) {
        cardList.cards.push({
          id: card.id,
          title: card.title
        })
      }
    },

    onCardListDragEnded (event) {
      console.log('[BoardPage] Card list drag ended', event)

      // Get the latest card list order and send it to the back-end
      const positionChanges = {
        boardId: this.board.id,
        cardListPositions: []
      }
      this.cardLists.forEach((cardList, index) => {
        positionChanges.cardListPositions.push({
          cardListId: cardList.id,
          position: index
        })
      })
      try {
        cardListService.changePositions(positionChanges)
      }catch (e) {
        console.log(e)
      }
    },

    addCardList () {
      if (!this.addListForm.name) {
        return
      }
      const cardList = {
        boardId: this.board.id,
        name: this.addListForm.name,
        position: this.cardLists.length
      }
      cardListService.add(cardList).then(response => {
        let savedCardList = response.data
        this.cardLists.push({
          id: savedCardList.id,
          name: savedCardList.name,
          cards: [],
          cardForm: {
            open: false,
            title: ''
          }
        })
        this.closeAddListForm()
      }).catch(error => {
        console.log(error.message)
      })
    },

    openAddListForm () {
      this.addListForm.open = true
      // Close all add card form
      this.cardLists.forEach((cardList) => { cardList.cardForm.open = false })
      this.$nextTick(() => {
        this.$refs.AddCardListFormField.focus();
      });
      /* this.$nextTick(() => {
         $('#cardListName').trigger('focus')
       })*/
    },
    closeAddListForm () {
      this.addListForm.open = false
      this.addListForm.name = ''
    },
    resetAddListForm () {
      this.$refs.AddListForm.reset()
    },

    onCardDragEnded (event) {
      console.log('[BoardPage] Card drag ended', event)
      const positionChanges = {
        boardId: this.board.id,
        cardPositions: []
      }

      // optimize
      for (let cardList of this.cardLists){
        cardList.cards.forEach((card, index) => {
          positionChanges.cardPositions.push({
            cardListId: cardList.id,
            cardId: card.id,
            position: index
          })
        })
      }

      cardService.changePositions(positionChanges).catch(error => {
        console.log(error.message)
      })
    },

    resetAddCardForm () {
      this.$refs.AddCardForm.reset()
    },
    openAddCardForm (cardList) {
      // Close other add card form
      this.cardLists.forEach((cardList) => { cardList.cardForm.open = false })
      //close addListForm
      this.addListForm.open = false
      this.addListForm.name = ''
      cardList.cardForm.open = true
      this.$nextTick(() => {
        this.$refs.AddCardFormField.focus();
      });
      //this.focusCardForm(cardList)
    },
    closeAddCardForm (cardList) {
      cardList.cardForm.open = false
    },

    updateCardTitle (change) { //{cardId: this.cardId, title: this.title}
      console.log("update card title")
      console.log(change)
      this.cardLists.forEach(list =>
          list.cards.forEach(card =>
          {
            if(card.id === change.id){
              console.log(true)
              card.title = change.title
            }
          }))
    },

    updateCardDescription (change) { //{id: this.cardId, description: this.card.description}}
      console.log("update card description")
      console.log(change)
      this.cardLists.forEach(list =>
          list.cards.forEach(card =>
          {
            if(card.id === change.id){
              console.log(true)
              card.description = change.description
            }
          }))
    },

    updateCardArchived(change){
      console.log("update card archived")
      console.log(change)
      this.cardLists.forEach(list => {
        list.cards.forEach(card => {
          if (card.id === change.id){
            card.archived = change.archived
          }
        })
      })
    }


  }
}
</script>

<style scoped>

</style>
