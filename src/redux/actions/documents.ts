import { FETCH_DOCUMENTS, DOCUMENTS_LOADED, GET_REGIONS, DOCUMENTS_COUNT_LOADED, CREATE_DOCUMENT, ACCEPT_DOCUMENT } from './../types';


export const fetchDocuments = (payload = {}) => ({
    type: FETCH_DOCUMENTS,
    payload
})

export const documentsLoaded = (payload = {}) => ({
    type: DOCUMENTS_LOADED,
    payload
})

export const getRegions = () => ({
    type: GET_REGIONS,
})

export const documentsCountLoaded = (payload = {}) => ({
    type: DOCUMENTS_COUNT_LOADED,
    payload
})

export const createDocument = (payload) => ({
    type: CREATE_DOCUMENT,
    payload
})

export const acceptDocument = (payload) => ({
    type: ACCEPT_DOCUMENT,
    payload
})
