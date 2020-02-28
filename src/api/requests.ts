import axios from 'axios';
import { formData } from '../utils/formData'

export let url = 'http://api-mobile.24m.uz/api';

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
        getDocumentTypes: () => axios.get(`${url}/user/get/document/types`),
        create: (path, data) => axios.post(`${url}/document${path}`, data),
        uploadFile: (data) => axios.post(`${url}/document/get/path/for/view/pdf`, formData(data)),
        getSignMessage: (docId) => axios.get(`${url}/document/get/content/forsign/${docId}`),
        sign: (credentials) => axios.post(`${url}/document/accept`, credentials)
    },
    user: {
        me: () => axios.get(`${url}/user`),
        changeTariff: credentials => axios.put(`${url}/user/billing/plan`, credentials),
        create1CAccount: (credentials) => axios.post(`${url}/user/1c/account/password`, credentials),
        change1CAccount: (credentials) => axios.put(`${url}/user/1c/account/password`, credentials),
        search: (tin) => axios.get(`${url}/info/users/requisite/list/${tin}`),
        update: credentails => axios.update(`${url}/user`, credentails)
    },
    helper: {
        getRegions: (id) => axios.get(`${url}/info/regions/list${id ? `/${id}` : ""}`),
        getDistricts: (id) => axios.get(`${url}/info/districts/list${id ? `/${id}` : ""}`),
        getMeasures: () => axios.get(`${url}/info/measuries/list`),
    }
}

