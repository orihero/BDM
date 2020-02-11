import { SHOW_MODAL, HIDE_MODAL } from './../types';
import { SET_ERROR } from '../types';

export const setError = (payload) => ({
    type: SET_ERROR,
    payload
})

export const showModal = () => ({
    type: SHOW_MODAL,
})

export const hideModal = () => ({
    type: HIDE_MODAL,
})
