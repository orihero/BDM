import { MessageTypes } from "./../../components/FloatingMessage";
import {
	SET_DANGER_ERROR,
	HIDE_MODAL,
	SHOW_MODAL,
	HIDE_ERROR,
	SET_SUCCESS_MESSAGE,
	SET_WARNING_ERROR
} from "./../types";

const initialState = {
	error: null,
	loading: false,
	loadingMessage: null
};

export default (state = initialState, { type, payload }) => {
	switch (type) {
		case SET_DANGER_ERROR:
			return {
				...state,
				error: { type: MessageTypes.Danger, message: payload }
			};
		case SET_WARNING_ERROR:
			return {
				...state,
				error: { type: MessageTypes.Warning, message: payload }
			};
		case SET_SUCCESS_MESSAGE:
			return {
				...state,
				error: { type: MessageTypes.Success, message: payload }
			};
		case HIDE_ERROR:
			return { ...state, error: null };
		case SHOW_MODAL:
			return { ...state, loading: true, loadingMessage: payload };
		case HIDE_MODAL:
			return { ...state, loading: false, loadingMessage: null };
		default:
			return state;
	}
};
