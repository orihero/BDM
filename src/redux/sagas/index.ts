import { all, } from 'redux-saga/effects'
import { user } from './user'
import { documents } from './documents'

export default function* rootSaga() {
    yield all([
        user(),
        documents()
    ])
}