import axios from "axios";

export default {

    add (detail) {
        return axios.post('/cards', detail)
    },

    changePositions (positionChanges) {
        return axios.post('/cards/positions', positionChanges)
    },

    get(cardId){
        return axios.get('/cards/'+cardId)
    },

    changeCardTitle(cardId,title){
        return axios.put('/cards/'+cardId+'/title',{"title":title})
    },

    changeCardDescription(cardId,description){
        return axios.put('/cards/'+cardId+'/description',{"description":description})
    },

    getCardActivities(cardId){
      return axios.get('/activities', {
          params: {
              cardId: cardId
          }
      })
    },

    addCardComment(cardId, comment){
        return axios.post('/cards/'+cardId+'/comments',{"comment":comment})
    },


    removeCard(cardId) {
        return axios.delete('/cards/'+cardId)
    },

    removeComment(commentId){
        return axios.delete("/activities",{ params: {
                commentId: commentId
            }})
    }
}

