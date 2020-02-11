import { combineReducers } from 'redux';
import { user } from './user'
import appState from './appState'

export let reducers = combineReducers({ user, appState })