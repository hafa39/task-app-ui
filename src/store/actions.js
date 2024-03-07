import meService from "@/services/me";
import excService from "@/services/api_exception_handler";

export const getUser = async ({ commit }) => {
    try {
        const response = await meService.getUser();
        commit('updateUser', response.data);
    } catch (e) {
        await excService.handleExc(e)
    }
}

export const getTeams = async ({commit}) =>{
    try {
        const response = await meService.getTeams();
        commit('updateTeams',response.data)
    }catch(e){
        console.log(e)
    }
}

export const getBoards = async ({commit}) =>{
    try {
        const response = await meService.getBoards();
        commit('updateBoards',response.data)
    }catch (e) {
        console.log(e)
    }
}

export const addTeam = ({commit},team) => {
    commit('addTeam', team)
}

export const addBoard = ({commit},board) => {
    commit('addBoard', board)
}