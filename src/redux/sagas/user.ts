import { call, put, takeEvery, delay } from 'redux-saga/effects';
import { requests } from './../../api/requests';
import { strings } from './../../locales/strings';
import { sign } from './../../utils/bdmImzoProvider';
import { hideError, hideModal, showModal } from './../actions/appState';
import { userLoaded, userLoggedIn } from './../actions/user';
import { REQUEST_USER_LOG_IN, SET_DANGER_ERROR } from './../types';

export function* requestUserLogin({ payload: remember }) {
    try {
        yield put(showModal())
        let request = yield call(sign, null)
        const data = yield call(requests.auth.login, { sign: request.pkcs });
        yield put(remember ? userLoggedIn(data.data) : userLoaded(data.data));
    } catch (e) {
        yield put({ type: SET_DANGER_ERROR, payload: strings.somethingWentWrong });
    } finally {
        yield put(hideModal())
        yield delay(3000);
        yield put(hideError())
    }
}
function* user() {
    yield takeEvery(REQUEST_USER_LOG_IN, requestUserLogin);
}

export { user };

