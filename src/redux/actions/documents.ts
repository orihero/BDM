import { FETCH_DOCUMENTS, DOCUMENTS_LOADED, GET_DOCUMENT_COUNT, DOCUMENTS_COUNT_LOADED, CREATE_DOCUMENT } from './../types';


export const fetchDocuments = (payload = {}) => ({
    type: FETCH_DOCUMENTS,
    payload
})

export const documentsLoaded = (payload = {}) => ({
    type: DOCUMENTS_LOADED,
    payload
})

export const getDocumentsCount = () => ({
    type: GET_DOCUMENT_COUNT,
})

export const documentsCountLoaded = (payload = {}) => ({
    type: DOCUMENTS_COUNT_LOADED,
    payload
})

export const createDocument = (payload) => ({
    type: CREATE_DOCUMENT,
    payload
})

