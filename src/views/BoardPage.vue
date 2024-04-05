<template>
  <div>
    <page-header/>
    <div class="board">
      <v-container>
        <div class="board-header">
          <v-row>
            <v-col cols="3">
              <h3>Board: {{board.name}}</h3>
            </v-col>
            <v-col cols="3">
              <h3></h3>
            </v-col>
            <v-col cols="3">
              <h3>Members</h3>
              <div v-for="member in members" v-bind:key="member.id">
                <user-avatar v-bind:user="member"/>
                <!--<v-avatar color="primary" size="x-small">
                  <span>{{member.shortName}}</span>
                </v-avatar>-->
              </div>
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
                      <div class="mt-3">
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
                        <v-btn type="submit" block class="mt-2">Submit</v-btn>
                        <v-btn color="orange" class="mt-4"  block @click="resetAddCardForm">Reset Form</v-btn>
                        <v-btn color="error" class="mt-4" @click="closeAddCardForm(cardList)">Cancel</v-btn>
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
                      <v-btn type="submit" block class="mt-2">Add List</v-btn>
                      <v-btn color="orange" class="mt-4"  block @click="resetAddListForm">Reset</v-btn>
                      <v-btn color="error" class="mt-4" @click="closeAddListForm()">Cancel</v-btn>
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
import PageHeader from "@/components/PageHeaderNotUsed.vue";
import draggable from 'vuedraggable'
import boardService from "@/services/boards";
import cardListService from "@/services/card-lists";
import parser from '../../../../Task-agile-cloud-v3/ui/src/utils/error-parser.js'
import AddMemberModal from "@/components/modals/AddMemberModal";
import cardService from "@/services/cards";
import CardModal from "@/components/modals/CardModal";
import CardRemoveModal from "@/components/modals/CardRemoveModal";
import UserAvatar from "@/components/ui/UserAvatar";

export default {
name: "BoardPage",
  components: {UserAvatar, CardRemoveModal, CardModal, AddMemberModal, PageHeader,draggable },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.loadBoard()
    })
  },
  data () {
    return {

      board: { id: 0, name: '', personal: false },
      cardLists: [/* {id, name, cards, cardForm} */],
      team: { name: '' },
      members: [/* {id, shortName} */],
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
      await cardService.removeCard(cardId)
    },

    onMemberAdded (member) {
      this.members.push(member)
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

  }
}
</script>

<style scoped>

</style>
