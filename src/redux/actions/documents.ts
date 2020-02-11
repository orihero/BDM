import { FETCH_DOCUMENTS, DOCUMENTS_LOADED } from './../types';


export const fetchDocuments = (payload = {}) => ({
    type: FETCH_DOCUMENTS,
    payload
})

export const documentsLoaded = (payload = {}) => ({
    type: DOCUMENTS_LOADED,
    payload
})
