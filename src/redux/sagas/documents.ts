import { warnUser } from './../../utils/warn';
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


let facutre = {
    "FacturaId": "5d8b79047f398c00010b2cb7",   // http://api-mobile.24m.uz/api/invoice/get/id
    "FacturaDoc": {  //№ документа + Дата документа
        "FacturaNo": "1",
        "FacturaDate": "2019-09-25"
    },
    "ContractDoc": { //№ договора + Дата договора
        "ContractNo": "2",
        "ContractDate": "2019-09-25"
    },
    "FacturaEmpowermentDoc": { //№ доверен. + Дата доверенности
        "AgentFacturaId": "5d8b78fffa1fdd0001f9432a",
        "EmpowermentNo": "3",
        "AgentFio": "",
        "AgentTin": ""
    },
    "ItemReleasedDoc": { // Товар отпустил
        "ItemReleasedFio": "YO‘LDOSHEV ISMOIL IBROHIM O‘G‘LI"
    },
    "SellerTin": "........",
    "BuyerTin": "...........",
    "Seller": {
        "Name": "YO‘LDOSHEV ISMOIL IBROHIM O‘G‘LI",
        "Account": "12345678909876543210",
        "BankId": "00444",
        "Address": "ГОРОД ТАШКЕНТ ЮНУСАБАДСКИЙ РАЙОН Shifokorlar 54",
        "Mobile": "998729056",
        "WorkPhone": "998729056",
        "Oked": "77777",
        "DistrictId": "2603",
        "Director": "YO‘LDOSHEV ISMOIL",
        "Accountant": "YO‘LDOSHEV ISMOIL",
        "VatRegCode": "777777777777"
    },
    "Buyer": {
        "Name": "BARATOV BEGZOD RUSTAM O‘G‘LI",
        "Account": "12345678900987654321",
        "BankId": "00000",
        "Address": "ГОРОД ТАШКЕНТ ЧИЛОНЗАРСКИЙ РАЙОН hyz 1323",
        "Mobile": "946773132",
        "WorkPhone": "946773132",
        "Oked": "",
        "DistrictId": "2606",
        "Director": "BARATOV BEGZOD",
        "Accountant": "BARATOV BEGZOD",
        "VatRegCode": ""
    },
    "ProductList": {
        "FacturaProductId": "5d8b78fc78734c0001779406", // http://api-mobile.24m.uz/api/invoice/get/id
        "Tin": ".........",  // "SellerTin": "........",
        "HasFuel": false,
        "HasVat": true,
        "Products": [
            {
                "OrdNo": 1,
                "Name": "dsa",
                "MeasureId": "18",
                "Count": "21",
                "Summa": "0",
                "DeliverySum": "0",
                "VatRate": "20",
                "VatSum": "0",
                "DeliverySumWithVat": "0",
                "FuelRate": "0",
                "FuelSum": "0",
                "DeliverySumWithFuel": "0",
                "WithoutVat": false
            }
        ]
    },
    "sign": "Sign content of json`s sign",
    "description": "description" //Примечание
}

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
        yield put(documentsCountLoaded(res.data));
        console.warn('HIDING MODAL');
        yield put(delay(100))
        yield put(hideModal());
    } catch (error) {
        //* We do not have an internet
        let { response } = error || {};
        if (!response) {
            yield put({ type: SET_DANGER_ERROR, payload: `${strings.somethingWentWrong}: ${error.message}` })
        } else {
            yield put({ type: SET_DANGER_ERROR, payload: `${strings.somethingWentWrong}: ${JSON.stringify(response.data.message)}` })
        }
        yield delay(3000)
        yield put(hideError())
        yield put(hideModal());
    }
}

export function* getRegions(data) {
    try {
        yield put(showModal());
        let response = yield call(requests.documents.getDocumentsCount, {});
        yield put(documentsCountLoaded(response.data))
        yield put(hideModal());
    } catch (error) {
        //* We do not have an internet
        let { response } = error || {};
        if (!response) {
            yield put({ type: SET_DANGER_ERROR, payload: `${strings.somethingWentWrong}: ${error.message}` })
        } else {
            yield put({ type: SET_DANGER_ERROR, payload: `${strings.somethingWentWrong}: ${JSON.stringify(response.data.message)}` })
        }
        yield delay(3000)
        yield put(hideError())
    }
}



/**
 ** Saga for creating a document!
 * @param param0 Action type
 */
export function* createDocument({ payload: data }) {
    try {
        //* Show loading
        yield put(showModal(strings.loading));
        //* Construct fileUpload request body
        console.warn(data.documentType);
        if (data.documentType === 2) {
            let { seller = {}, buyerTin: buyer } = data;
            //* Get invoiceID
            let FacturaDoc = { FacturaNo: data.document.documentNumber, FacturaDate: data.document.documentDate };
            let ContractDoc = { ContractNo: data.contract.contractNumber, ContractDate: data.contract.contractDate };
            let FacturaEmpowermentDoc = {
                AgentFacturaId: data.empovermentNumber, EmpowermentNo: data.empovermentDate, AgentFio: "",
                AgentTin: ""
            }
            let ItemReleasedDoc = { ItemReleasedFio: data.productReleased }
            let SellerTin = seller.tin;
            let Seller = { Name: seller.name, Address: seller.address, AccountNumber: seller.accountNumber, Oked: seller.oked, DistrictId: seller.districtId, Director: seller.mainDirector, Accautant: seller.mainAccauntant, VatRageCode: seller.vatPayerCode, Mobile: seller.phoneCode + seller.phoneNumber, Work: seller.phoneCode + seller.phoneNumber, BankId: '0044' }
            let BuyerTin = buyer.tin;
            let Buyer = { Name: buyer.name, Address: buyer.address, AccountNumber: buyer.accountNumber, Oked: buyer.okedId, DistrictId: buyer.districtId, Director: buyer.mainDirector, Accautant: buyer.mainAccauntant, VatRageCode: buyer.vatPayerCode, Mobile: buyer.phoneNumber, WorkPhone: buyer.phoneNumber, BankId: buyer.bankCode };
            let ProductList = { Tin: seller.tin, HasFuel: false, HasVat: true, Products: data.products.map(e => ({ ...e.submitData })) }
            let invoiceJson = { FacturaDoc, ContractDoc, FacturaEmpowermentDoc, ItemReleasedDoc, SellerTin, Seller, BuyerTin, Buyer, ProductList, sum: 12.0, description: data.description };
            console.warn(data.products);
            console.warn(invoiceJson);
            let invoicePDF = yield call(requests.documents.uploadFile, { invoiceJson, tinRecipient: data.buyerTin.tin, documentTypeId: data.documentType, documentNumber: data.document.documentNumber, documentDate: data.document.documentDate });

            let invoiceData = yield call(requests.documents.getIvoiceId)
            let FacturaId = invoiceData.data.data;
            yield put(hideModal());
            return;
        }
        let fileData = { file: constructFileFromUri(data.file), tinRecipient: data.buyerTin.tin, documentTypeId: data.documentType, documentNumber: data.document.documentNumber, documentDate: data.document.documentDate }
        //* Uploading file
        let response = yield call(requests.documents.uploadFile, fileData);
        yield put(hideModal());
        NavigationService.navigate('PdfViewer', { filePath: response.data.data.filePath + "/" + response.data.data.fileName });
        return;
        //! Signing should be on
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
        //* Check if the user signed otherwise reject!
        if (!sign.pkcs7) {
            yield put(showModal(strings.uploadingFile))
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
            yield put({ type: SET_DANGER_ERROR, payload: `${strings.somethingWentWrong}: ${error.message}` })
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
            yield put({ type: SET_DANGER_ERROR, payload: `${strings.somethingWentWrong}: ${error.message}` })
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