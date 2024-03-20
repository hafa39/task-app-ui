import axios from 'axios'
import parser from '@/utils/error-parser.js'
export default{

    /**
     * Create a team
     * @param {*} detail the detail of the coard
     */
    create(detail){
        return axios.post('/boards',detail)
    },

    getBoard(boardId){
        return axios.get('/boards/'+boardId)
    },

    addMember(boardId, username){
        return axios.post("/boards/"+boardId+"/members",{"username":username})
    }
}

