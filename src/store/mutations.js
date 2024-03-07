
export default {
    updateUser(state,data){
        console.log("mutation update user")
        state.user.name = data.username
        state.user.fullName = data.firstName + ' ' +data.lastName
        state.user.shortName = (data.firstName.slice(0,1)+data.lastName.slice(0,1)).toUpperCase()
        state.user.id = data.id
    },

    updateTeams(state,data){
        console.log("mutation update teams")
        state.teams = data
    },

    updateBoards(state,data){
        console.log("mutation update boards")
        state.boards = data
    },

    addTeam (state, team) {
        console.log("mutation add team")
        state.teams.push(team)
    },

    addBoard (state, board){
        console.log("mutation add board")
        state.boards.push(board)
    }
}
