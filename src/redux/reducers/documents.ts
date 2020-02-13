import { DOCUMENTS_LOADED, DOCUMENTS_COUNT_LOADED } from './../types';
const initialState = {
    boxType: -1,
    status: -1,
    data: [],
    count: {
        inputBox: {
            recieved: -1,
            signiture: -1,
            reject: -1
        },
        outputBox: {
            sent: -1,
            signature: -1,
            reject: -1,
            downloaded: -1
        }
    }
}

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case DOCUMENTS_COUNT_LOADED:
            return { ...state, count: payload }
        case DOCUMENTS_LOADED:
            return { ...state, data: payload }
        default:
            return state
    }
}
