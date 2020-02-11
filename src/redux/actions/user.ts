import { USER_LOADED, USER_LOGGED_IN, USER_LOGGED_OUT, REQUEST_USER_LOG_IN } from './../types';


export const userLoaded = (payload) => ({
    type: USER_LOADED,
    payload
})

export const userLoggedIn = (payload) => ({
    type: USER_LOGGED_IN,
    payload
})

export const userLoggedOut = (payload) => ({
    type: USER_LOGGED_OUT,
    payload
})

export const requestUserLogin = (payload) => ({
    type: REQUEST_USER_LOG_IN,
    payload
})
