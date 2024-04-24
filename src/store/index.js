import { createStore } from 'vuex'
import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'

const state = {
  user: {
    name: null
  },
  avatar: {
    id: null
  },
  teams: [/* {id, name} */],
  boards: [/* {id, name, description, teamId} */]
}

export default createStore({
  state,
  getters,
  actions,
  mutations
})
