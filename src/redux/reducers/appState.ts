import { SET_ERROR, HIDE_MODAL, SHOW_MODAL } from './../types';

const initialState = {
    error: null,
    loading: false
}

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case SET_ERROR:
            return { ...state, error: payload }
        case SHOW_MODAL:
            return { ...state, loading: true }
        case HIDE_MODAL:
            return { ...state, loading: false }
        default:
            return state
    }
}
