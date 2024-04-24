export const updateUser = ({commit},user) => {
    commit('updateUser', user)
}

export const updateUserAvatar = ({commit},avatar) => {
    commit('updateUserAvatar', avatar)
}

export const updateTeams = ({commit},teams) => {
    commit('updateTeams',teams)
}

export const updateBoards = ({commit},boards) =>{
    commit('updateBoards',boards)
}

export const addBoard = ({commit},board) => {
    commit('addBoard',board)
}
export const removeBoard = ({commit},boardId) => {
    commit('removeBoard',boardId)
}
export const addTeam = ({commit},team) =>{
    commit('addTeam',team)
}

