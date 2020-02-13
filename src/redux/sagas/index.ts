import { all } from 'redux-saga/effects'
import { documents, documentsCount } from './documents'
import { user } from './user'

export default function* rootSaga() {
    yield all([
        user(),
        documents(),
        documentsCount()
    ])
}