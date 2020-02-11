import { SHOW_MODAL, HIDE_MODAL, HIDE_ERROR, } from './../types';


export const hideError = () => ({
    type: HIDE_ERROR,
})

export const showModal = () => ({
    type: SHOW_MODAL,
})

export const hideModal = () => ({
    type: HIDE_MODAL,
})
