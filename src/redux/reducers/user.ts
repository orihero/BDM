import { USER_LOADED, USER_LOGGED_IN, USER_LOGGED_OUT } from './../types';
import AsyncStorage from '@react-native-community/async-storage'

const initialState = {
    settings: {}
}

export let storeName = '@credentials';

export let user = (state = initialState, { type, payload }) => {
    let newState;
    switch (type) {
        case USER_LOADED:
            return { ...state, ...payload }
        case USER_LOGGED_IN:
            newState = { ...state, ...payload };
            AsyncStorage.setItem(storeName, JSON.stringify(newState))
            return newState
        case USER_LOGGED_OUT:
            AsyncStorage.setItem(storeName, JSON.stringify(initialState));
            return initialState;
        default:
            return state
    }
}
