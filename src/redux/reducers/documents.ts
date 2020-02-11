import { DOCUMENTS_LOADED } from './../types';
const initialState = {
    boxType: -1,
    status: -1,
    data: [],
}

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case DOCUMENTS_LOADED:
            return { ...state, data: payload }
        default:
            return state
    }
}
