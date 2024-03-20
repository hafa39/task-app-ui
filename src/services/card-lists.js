import axios from 'axios'

export default{

    getCardLists(boardId) {
        return axios.get('/cardlists', {
            params: {
                boardId: boardId  // Assuming boardId is the value you want to use as a query parameter
            }
        });
    },

    changePositions (positionChanges) {
        return axios.post('/cardlists/positions', positionChanges)
    },

    add(cardList){
        return axios.post('/cardlists',cardList)
    }
}
