import { sign as eSign } from './../../utils/bdmImzoProvider';
import { showModal, hideModal, hideError } from './../actions/appState';
import { documentsLoaded, documentsCountLoaded } from './../actions/documents';
import { strings } from './../../locales/strings';
import { SET_DANGER_ERROR, FETCH_DOCUMENTS, GET_DOCUMENT_COUNT, SET_SUCCESS_ERROR, CREATE_DOCUMENT, ACCEPT_DOCUMENT, REJECT_DOCUMENT, DELETE_DOCUMENT, GET_REGIONS } from './../types';
import { requests } from './../../api/requests';
import { call, put, takeEvery, delay, fork } from 'redux-saga/effects';
import { constructFileFromUri } from '../../utils/formData';
import RnFs from 'react-native-fs'
import { Platform } from 'react-native';
import NavigationService from '../../services/NavigationService';

export let docIdUrls = {
    "1": {
        url: "/create/contract"
    },
    "2": {
        url: '/create/invoice'
    },
    "3": {
        url: '/create/act/completed'
    },
    "4": {
        url: '/create/act/acceptance'
    },
    5: {
        url: '/create/act/reconciliation'
    },
    "6": {
        url: '/create/empowerment'
    },
    "other": {
        url: '/create/other'
    }
}

export function* fetchDocumentsAsync({ payload: { boxType = 1, status = 10, page = 1, perPage = 20, } }) {
    try {
        yield put(showModal())
        let response = yield call(requests.documents.getDocuments, { boxType, status, page, perPage }) || {};
        yield put(documentsLoaded({ data: response.data, boxType, status }));
        let res = yield call(requests.documents.getDocumentsCount, {});
        yield put(documentsCountLoaded(res.data))
        yield delay(10)
        yield put(hideModal());
    } catch ({ response }) {
        yield put(hideModal());
        //* We do not have an internet
        if (!response) {
            //TODO control no internet case
            return;
        }
        yield put({ type: SET_DANGER_ERROR, payload: `${strings.somethingWentWrong}: ${JSON.stringify(response.data.message)}` });
        yield delay(3000)
        yield put(hideError())
    } finally {

    }
}

export function* getRegions(data) {
    try {
        yield put(showModal());
        let response = yield call(requests.documents.getDocumentsCount, {});
        yield put(documentsCountLoaded(response.data))
        yield put(hideModal());
    } catch ({ response }) {
        //* We do not have an internet
        if (!response) {
            //TODO control no internet case
        }
        yield put({ type: SET_DANGER_ERROR, payload: `${strings.somethingWentWrong}` })
        yield delay(3000)
        yield put(hideError())
    }
}


/**
 ** Saga for creating a document with sign!
 * @param param0 Action type
 */
export function* createDocument({ payload: data }) {
    try {
        //* Show loading
        yield put(showModal(strings.uploadingFile));
        //* Construct fileUpload request body
        let fileData = { file: constructFileFromUri(data.file), tinRecipient: data.tin, documentTypeId: data.type, documentNumber: data.document.documentNumber, documentDate: data.document.documentDate }
        //* Uploading file
        let response = yield call(requests.documents.uploadFile, fileData);
        //* Change loading screen message to creating document
        yield put(showModal(strings.creatingDocument));
        //* Let user know that the file uploaded succesfully
        yield put({ type: SET_SUCCESS_ERROR, payload: `${strings.uploadSuccess}` })
        //* Getting path of file to convert it base64 with react-native-fs
        let path = (Platform.OS == 'ios')
            ? data.file.uri.replace('file://', '')
            : data.file.uri;
        //* Convert file to base64
        let fileBase64 = yield call(RnFs.readFile, path, 'base64');
        //* Sign the file
        let sign = yield call(eSign, fileBase64)
        //* Check if yhr user signed otherwise reject!
        if (!sign.pkcs7) {
            yield put({ type: SET_DANGER_ERROR, payload: strings.somethingWentWrong })
            yield put(hideModal())
            yield delay(3000);
            yield put(hideError())
            return;
        }
        //* Construct request body for creating document
        let { filePath, fileName } = response.data.data;
        let documentData = { ...data, filePath, fileName, sign: sign.pkcs7, buyerCompanyName: 'BBB' };
        delete documentData.file;
        delete documentData.type;
        //* Getting document url specific to documentType
        let url = docIdUrls[data.type].url || docIdUrls.other;
        //* Creating document
        let docResponse = yield call(requests.documents.create, url, documentData);
        //* Clear messages and loading screens
        NavigationService.navigate('Main')
        yield put(hideModal());
        yield delay(500)
        yield put({ type: SET_SUCCESS_ERROR, payload: strings.documentCreatedSuccesfully })
        yield delay(3000);
        yield put(hideError())
    } catch (error) {
        console.warn(error);
        let { response } = error || {};
        if (!response) {
            yield put({ type: SET_DANGER_ERROR, payload: `${strings.somethingWentWrong}: ${JSON.stringify(error)}` })
        } else {
            yield put({ type: SET_DANGER_ERROR, payload: `${strings.somethingWentWrong}: ${JSON.stringify(response.data.message)}` })
        }
        console.warn(response);
        yield put(hideModal())
        yield delay(3000)
        yield put(hideError())
    }
}

export function* documentInteractionHandler({ payload: documentId }) {
    try {
        //* Show loading
        yield put(showModal(strings.fetchingData));
        let signMessage = yield call(requests.documents.getSignMessage, documentId)
        let sign = yield call(eSign, signMessage.data.data)
        let response = yield call(requests.documents.sign, { documentId, sign });
        yield put(hideModal())
        yield put({ type: SET_SUCCESS_ERROR, payload: strings.signedSuccessfully })
        yield delay(3000)
        yield put(hideError())
    } catch (error) {
        console.warn(error);
        let { response } = error || {};
        if (!response) {
            yield put({ type: SET_DANGER_ERROR, payload: `${strings.somethingWentWrong}: ${JSON.stringify(error)}` })
        } else {
            yield put({ type: SET_DANGER_ERROR, payload: `${strings.somethingWentWrong}: ${JSON.stringify(response.data.message)}` })
        }
        console.warn(response);
        yield put(hideModal())
        yield delay(3000)
        yield put(hideError())
    }
}


export function* documents() {
    yield takeEvery(FETCH_DOCUMENTS, fetchDocumentsAsync);
}

export function* handlegGetRegions() {
    yield takeEvery(GET_REGIONS, getRegions);
}

export function* docuemntInteraction() {
    yield takeEvery([ACCEPT_DOCUMENT, REJECT_DOCUMENT, DELETE_DOCUMENT], documentInteractionHandler);
}

export function* documentCreation() {
    yield takeEvery(CREATE_DOCUMENT, createDocument)
}