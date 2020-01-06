// API
const API_URL = 'http://127.0.0.1:5000'

// getJSON
const getJSON = (path, options) => 
    fetch(path, options)
        .then(res => res.json())
        .catch(err => console.warn(`API_ERROR: ${err.message}`));


// API functions
export default class API {

    // constructor
    constructor(url = API_URL) {
        this.url = url;
    } 
 
    // makeAPIRequest
    makeAPIRequest(path, token) {
      return getJSON(`${this.url}/${path}`, token);
    }

    // POST
    makePostRequest (path, payload) {
        const opts = {
            method: 'POST', 
            headers :{'access-control-allow-origin': 'http://127.0.0.1:5000', 
                      'content-type': 'application/json', 
                      'vary': 'Origin', 
                     },
            body: payload, 
        }
        return getJSON(`${this.url}/${path}`, opts);
    }

    // PUT
    makePutRequest (path, data) {
        console.log('params', data)
        const opts = {
            method: 'PUT',   
            body: data,   
        }
        return getJSON(`${this.url}/${path}`, opts)
    }

    // Feed
    getFeed(token) {
        return this.makeAPIRequest('user/feed?p=0&n=10', token);
    }

    // get my user information
    getUser(token) {
        return this.makeAPIRequest('user/', token);
    }

    // get other users information
    getotherUser(token,info) {
        return this.makeAPIRequest(`user${info}`, token);
    }

    // Follow
    follow(token,info) {
        return this.makeAPIRequest(`user/follow${info}`, token);
    }

    // Unfollow
    unfollow(token,info) {
        return this.makeAPIRequest(`user/unfollow${info}`, token);
    }

    // Login
    login(params) {
        return this.makePostRequest('auth/login', params);
    }

    // Register
    register(params) {
        return this.makePostRequest('auth/signup', params);
    }

    // Postprofile
    postprofile(opts){
        return getJSON(`${this.url}/user/`, opts);
    }
}
