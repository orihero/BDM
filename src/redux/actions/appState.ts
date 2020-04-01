import { SHOW_MODAL, HIDE_MODAL, HIDE_ERROR } from "./../types";

export const hideError = () => ({
	type: HIDE_ERROR
});

export const showModal = (payload?) => ({
	type: SHOW_MODAL,
	payload
});

export const hideModal = () => ({
	type: HIDE_MODAL
});
