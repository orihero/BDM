import { showModal, hideModal } from './../actions/appState';
import { setError } from '../actions/appState';
import { call, put, takeEvery } from 'redux-saga/effects';
import { requests } from './../../api/requests';
import { sign } from './../../utils/bdmImzoProvider';
import { userLoggedIn } from './../actions/user';
import { REQUEST_USER_LOG_IN } from './../types';

export function* requestUserLogin() {
    try {
        yield put(showModal())
        let request = yield call(sign, null)
        const data = yield call(requests.auth.login, { sign: request.pkcs7 });
        yield put(userLoggedIn(data.data));
    } catch (e) {
        yield put(setError(e.message));
    } finally {
        yield put(hideModal())
    }
}
function* user() {
    yield takeEvery(REQUEST_USER_LOG_IN, requestUserLogin);
}

export { user };
