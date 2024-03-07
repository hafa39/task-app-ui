import axios from 'axios'

export default {

    getUser(){
        return axios.get('/user', {withCredentials: true})
    },

    //When making same-origin (or same-domain) requests with Axios or other HTTP request libraries in a browser-based environment, you usually don't need to explicitly set the "withCredentials" option to true. This is because same-origin requests are, by default, sent with credentials, such as cookies and HTTP authentication.
    getTeams(){
        return axios.get('/teams')
    },
    getBoards(){
        return axios.get('/boards')
    },

}
