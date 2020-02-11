import axios from 'axios'

let url = 'http://api-mobile.24m.uz/api'

export let requests = {
    auth: {
        login: (sign) => axios.post(`${url}/auth/login`, sign)
    }
}

