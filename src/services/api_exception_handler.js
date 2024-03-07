import authService from "@/services/authentification";

export default {
    async handleExc(error){
        console.log("handle exception")
        console.log(error)
        if (error.response && error.response.status === 401) {
            await authService.login();
        }
    }
}
