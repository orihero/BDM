import { call, put, takeEvery, delay } from "redux-saga/effects";
import { requests } from "./../../api/requests";
import { strings } from "./../../locales/strings";
import { sign } from "./../../utils/bdmImzoProvider";
import { hideError, hideModal, showModal } from "./../actions/appState";
import { userLoaded, userLoggedIn } from "./../actions/user";
import { REQUEST_USER_LOG_IN, SET_DANGER_ERROR } from "./../types";
import NavigationService from "../../services/NavigationService";

export function* requestUserLogin({
	payload: { remember, password, username }
}) {
	try {
		yield put(showModal());
		let data;
		let hasSign = false;
		//* Login with username
		if (username || password) {
			data = yield call(requests.auth.login, {
				userName: username,
				password
			});
			hasSign = false;
		} else {
			let request = yield call(sign, null);
			if (!!request.pkcs7) {
				data = yield call(requests.auth.login, {
					sign: request.pkcs7
				});
			} else {
				yield put(hideModal());
				return;
			}
			hasSign = true;
		}
		yield put(
			remember
				? userLoggedIn({ ...data.data, hasSign })
				: userLoaded({ ...data.data, hasSign })
		);
		let userData = yield call(requests.user.me);
		yield put(userLoaded({ data: userData.data.data }));
		yield put(hideModal());
		yield delay(100);
		NavigationService.navigate("Main", {});
	} catch (e) {
		let { data } = e.response || {};
		let { message } = data || {};
		yield put({
			type: SET_DANGER_ERROR,
			payload: `${strings.somethingWentWrong}: ${JSON.stringify(data)}`
		});
		yield put(hideModal());
		yield delay(3000);
		yield put(hideError());
	}
}

function* user() {
	yield takeEvery(REQUEST_USER_LOG_IN, requestUserLogin);
}

export { user };
