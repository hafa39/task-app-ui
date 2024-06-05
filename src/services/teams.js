import axios from 'axios'


export default{

    /**
     * Create a team
     * @param {*} detail the detail of the team
     */
    create(detail){
        return axios.post('/teams',detail)
    },

    update(team){
        console.log(team)
        return axios.patch('/teams/'+team.id, {"name":team.name})
    }
}
