import { showModal, hideModal, hideError } from './../actions/appState';
import { documentsLoaded } from './../actions/documents';
import { strings } from './../../locales/strings';
import { SET_DANGER_ERROR, FETCH_DOCUMENTS } from './../types';
import { requests } from './../../api/requests';
import { call, put, takeEvery, delay } from 'redux-saga/effects';

export function* fetchDocumentsAsync({ payload: { boxType = 1, status = 10, page = 1, perPage = 20, } }) {
    try {
        yield put(showModal())
        let response = yield call(requests.documents.getDocuments, { boxType, status, page, perPage });
        yield put(documentsLoaded(response.data))
    } catch ({ response }) {
        //* We do not have an internet
        if (!response) {
            //TODO control no internet case
        }
        console.warn(response);

        yield put({ type: SET_DANGER_ERROR, payload: `${strings.somethingWentWrong}: ${JSON.stringify(response.data.message)}` })
    } finally {
        yield put(hideModal());
        yield delay(3000)
        yield put(hideError())
    }
}

export function* documents() {
    yield takeEvery(FETCH_DOCUMENTS, fetchDocumentsAsync);
}