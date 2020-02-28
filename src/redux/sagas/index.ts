import { all } from 'redux-saga/effects'
import { documents, handlegGetRegions, documentCreation, docuemntInteraction } from './documents'
import { user } from './user'

export default function* rootSaga() {
    yield all([
        user(),
        documents(),
        handlegGetRegions(),
        documentCreation(),
        docuemntInteraction()
    ])
}