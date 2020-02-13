import axios from 'axios'

let url = 'http://api-mobile.24m.uz/api';

export let configureAxios = (storeInstance) => {
    axios.interceptors.request.use((res) => {
        let token = storeInstance.getState().user.accessToken;
        if (token) {
            res.headers.Authorization = `Bearer ${token}`
        }
        return res;
    })
}


export let requests = {
    auth: {
        login: (sign) => axios.post(`${url}/auth/login`, sign)
    },
    documents: {
        getDocuments: ({ boxType, status, page, perPage }) => axios.get(`${url}/document/get/data?boxType=${boxType}&status=${status}&page=${page}&perPage=${perPage}`),
        getDocumentsCount: () => axios.get(`${url}/document/get/counts/by/status`),
        getDocumentTypes: () => axios.get(`${url}/user/get/document/types`)
    }
}

