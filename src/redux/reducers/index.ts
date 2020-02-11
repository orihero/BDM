import { combineReducers } from 'redux';
import { user } from './user'
import appState from './appState'
import documents from './documents'

export let reducers = combineReducers({ user, appState, documents })