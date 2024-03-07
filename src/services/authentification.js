export default {
    login(){
        //Spring Security exposes an /oauth2/authorization/{registrationId} endpoint that you can use to start the authentication flow based on OAuth2/OIDC.
        window.open('/oauth2/authorization/keycloak','_self')
        //window.open('http://localhost:9000/oauth2/authorization/keycloak')
    },

    // there is a issue related to how browser process the redirects. The xsrf header will be automatically add to re redirect request which cause a cors issue
    // therefore we should add the csrf token in post body as form-urlencoded
    // we have also another issue, that we should apply mode:"no-cors", When you set the mode to "no-cors," only safe cross-origin requests are allowed. This means that the request is made without CORS headers, and you won't be able to access the response body or headers. This mode is useful for making requests to a different origin in scenarios where you only need to check if the request was successful but don't need to access the response data.
    logout(){
        //return axios.post('http://localhost:9000/logout', {withCredentials: true})
        const xsrfToken = this.getCookieValue("XSRF-TOKEN"); // Define a function to read the cookie
        const formData = new FormData();
        formData.append("_csrf", xsrfToken);

        // Step 2: Include the XSRF token in the request headers
        return fetch('http://localhost:9000/logout', {
            method: 'POST',
            mode: "no-cors",
            //redirect : 'manual',
            //credentials: 'include', // Include credentials (cookies)
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                //"XSRF-TOKEN": xsrfToken// Set the content type
            },
            body: new URLSearchParams(formData).toString(),
        })
    },

    getCookieValue(name) {
        const cookies = document.cookie.split('; ');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].split('=');
            if (cookie[0] === name) {
                return decodeURIComponent(cookie[1]);
            }
        }
        return '';
    },
}