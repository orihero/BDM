import { getObjectProperty } from "./../../utils/object";
import { Platform, Clipboard } from "react-native";
import RnFs from "react-native-fs";
import { call, delay, put, takeEvery } from "redux-saga/effects";
import NavigationService from "../../services/NavigationService";
import { constructFileFromUri } from "../../utils/formData";
import { requests } from "./../../api/requests";
import { strings } from "./../../locales/strings";
import { sign as eSign, attach, append } from "./../../utils/bdmImzoProvider";
import { hideError, hideModal, showModal } from "./../actions/appState";
import {
	documentsCountLoaded,
	documentsLoaded,
	fetchDocuments
} from "./../actions/documents";
import {
	ACCEPT_DOCUMENT,
	CREATE_DOCUMENT,
	DELETE_DOCUMENT,
	FETCH_DOCUMENTS,
	GET_REGIONS,
	REJECT_DOCUMENT,
	SET_DANGER_ERROR,
	SET_SUCCESS_MESSAGE
} from "./../types";
import reactotron from "../reactotron-config";

let invoice = {
	FacturaId: "5d8b79047f398c00010b2cb7",
	FacturaDoc: {
		FacturaNo: "1",
		FacturaDate: "2019-09-25"
	},
	ContractDoc: {
		ContractNo: "2",
		ContractDate: "2019-09-25"
	},
	FacturaEmpowermentDoc: {
		AgentFacturaId: "5d8b78fffa1fdd0001f9432a",
		EmpowermentNo: "3",
		AgentFio: "",
		AgentTin: ""
	},
	ItemReleasedDoc: {
		ItemReleasedFio: "YO‘LDOSHEV ISMOIL IBROHIM O‘G‘LI"
	},
	SellerTin: "566584586",
	BuyerTin: "577777309",
	Seller: {
		Name: "BARATOV BEGZOD RUSTAM O‘G‘LI",
		Account: "12345678900987654321",
		BankId: "00000",
		Address: "ГОРОД ТАШКЕНТ ЧИЛОНЗАРСКИЙ РАЙОН hyz 1323",
		Mobile: "946773132",
		WorkPhone: "946773132",
		Oked: "",
		DistrictId: "2606",
		Director: "BARATOV BEGZOD",
		Accountant: "BARATOV BEGZOD",
		VatRegCode: ""
	},
	Buyer: {
		Name: "YO‘LDOSHEV ISMOIL IBROHIM O‘G‘LI",
		Account: "12345678909876543210",
		BankId: "00444",
		Address: "ГОРОД ТАШКЕНТ ЮНУСАБАДСКИЙ РАЙОН Shifokorlar 54",
		Mobile: "998729056",
		WorkPhone: "998729056",
		Oked: "77777",
		DistrictId: "2603",
		Director: "YO‘LDOSHEV ISMOIL",
		Accountant: "YO‘LDOSHEV ISMOIL",
		VatRegCode: "777777777777"
	},

	ProductList: {
		FacturaProductId: "5d8b78fc78734c0001779406",
		Tin: ".........",
		HasFuel: false,
		HasVat: true,
		Products: [
			{
				OrdNo: 0,
				Name: "",
				MeasureId: 0,
				Count: 0,
				Summa: 0,
				DeliverySum: 0,
				VatRate: 0,
				VatSum: 0,
				DeliverySumWithVat: 0,
				FuelRate: 0,
				FuelSum: 0,
				DeliverySumWithFuel: 0,
				WithoutVat: true,
				BasePrice: 0,
				series: "",
				expirationDate: "",
				extraPrice: 0
			}
		]
	},
	sign: "Sign content of json`s sign",
	description: "description" //Примечание
};

export let docIdUrls = {
	"1": {
		url: "/create/contract",
		name: "Договор"
	},
	"2": {
		url: "/create/invoice",
		name: "Счет-фактура"
	},
	"3": {
		url: "/create/act/completed",
		name: "Акт-выпольненных-работ"
	},
	"4": {
		url: "/create/act/acceptance",
		name: "Акт-прием-передачи"
	},
	5: {
		url: "/create/act/reconciliation",
		name: "Акт-сверки-взаиморасчетов"
	},
	"6": {
		url: "/create/empowerment",
		name: "Доверенность"
	},
	other: {
		url: "/create/other",
		name: "Прочие"
	}
};

export function* fetchDocumentsAsync({
	payload: { boxType = 1, status = 10, page = 1, perPage = 20, ...rest }
}) {
	try {
		yield put(showModal());
		let response = yield call(requests.documents.getDocuments, {
			boxType,
			status,
			page,
			perPage
		}) || {};
		let payload = {
			data: response.data.data,
			boxType,
			status,
			...rest
		};
		yield put(documentsLoaded(payload));
		let res = yield call(requests.documents.getDocumentsCount, {});
		yield put(documentsCountLoaded(res.data));
		yield put(delay(100));
		yield put(hideModal());
	} catch (error) {
		//* We do not have an internet
		let { response } = error || {};
		if (!response) {
			yield put({
				type: SET_DANGER_ERROR,
				payload: `${strings.connectToInternet}`
			});
		} else {
			yield put({
				type: SET_DANGER_ERROR,
				payload: `${strings.somethingWentWrong}: ${JSON.stringify(
					response.data.message
				)}`
			});
		}
		yield delay(3000);
		yield put(hideError());
		yield put(hideModal());
	}
}

export function* getRegions(data) {
	try {
		yield put(showModal());
		let response = yield call(requests.documents.getDocumentsCount, {});
		yield put(documentsCountLoaded(response.data));
		yield put(hideModal());
	} catch (error) {
		//* We do not have an internet
		let { response } = error || {};
		if (!response) {
			yield put({
				type: SET_DANGER_ERROR,
				payload: `${strings.somethingWentWrong}: ${error.message}`
			});
		} else {
			yield put({
				type: SET_DANGER_ERROR,
				payload: `${strings.somethingWentWrong}: ${JSON.stringify(
					response.data.message
				)}`
			});
		}
		yield delay(3000);
		yield put(hideError());
	}
}

export let taxDepartmentDocs = {
	29: true,
	2: true,
	24: true,
	19: true,
	13: true
};

/**
 ** Saga for creating a document!
 * @param param0 Action type
 */
export function* createDocument({ payload: data }) {
	try {
		//* Show loading
		yield put(showModal(strings.loading));
		//* Construct fileUpload request body
		let isTaxDoc = taxDepartmentDocs[data.documentType || data.invoiceType];
		reactotron.log({ isTaxDoc });
		if (isTaxDoc) {
			// let { seller = {}, buyerTin: buyer } = data;
			// //* Get invoiceID
			// let FacturaDoc = {
			// 	FacturaNo: data.document.documentNumber,
			// 	FacturaDate: data.document.documentDate
			// };
			// let ContractDoc = {
			// 	ContractNo: data.contract.contractNumber,
			// 	ContractDate: data.contract.contractDate
			// };
			// let FacturaEmpowermentDoc = {
			// 	AgentFacturaId: data.empovermentNumber,
			// 	EmpowermentNo: data.empovermentDate,
			// 	AgentFio: "",
			// 	AgentTin: ""
			// };
			// let ItemReleasedDoc = { ItemReleasedFio: data.productReleased };
			// let SellerTin = seller.tin;
			// //* Construct seller data
			// let Seller = {
			// 	Name: seller.name,
			// 	Address: seller.address,
			// 	Account: seller.accountNumber,
			// 	Oked: seller.oked,
			// 	DistrictId: seller.districtId,
			// 	Director: seller.mainDirector,
			// 	Accountant: seller.mainAccauntant,
			// 	VatRegCode: seller.vatPayerCode,
			// 	Mobile: seller.phoneCode + seller.phoneNumber,
			// 	WorkPhone: seller.phoneCode + seller.phoneNumber,
			// 	BankId: seller.bankCode
			// };
			// let BuyerTin = buyer.tin;
			// //* Construct buyer data
			// let Buyer = {
			// 	Name: buyer.name,
			// 	Address: buyer.address,
			// 	Account: buyer.accountNumber,
			// 	Oked: buyer.okedId,
			// 	DistrictId: buyer.districtId,
			// 	Director: buyer.mainDirector,
			// 	Accountant: buyer.mainAccauntant,
			// 	VatRegCode: buyer.vatPayerCode,
			// 	Mobile: buyer.phoneNumber,
			// 	WorkPhone: buyer.phoneNumber,
			// 	BankId: buyer.bankCode
			// };
			// let ProductList = {
			// 	Tin: seller.tin,
			// 	HasFuel: false,
			// 	HasVat: true,
			// 	Products: data.products.map((e, i) => ({
			// 		...invoice.ProductList.Products[0],
			// 		...e.submitData,
			// 		OrderNo: i + 1
			// 	}))
			// };
			// //* Construct final invoice data
			// let invoiceJson = {
			// 	FacturaDoc,
			// 	ContractDoc,
			// 	FacturaEmpowermentDoc,
			// 	ItemReleasedDoc,
			// 	SellerTin,
			// 	Seller,
			// 	BuyerTin,
			// 	Buyer,
			// 	ProductList
			// };
			// console.warn(JSON.stringify(invoiceJson));
			let {
				documentModel,
				buyer: Buyer,
				seller: Seller,
				thirdParty,
				documentNumberProperty,
				documentDateProperty
			} = data;
			if (!Buyer) {
				Buyer = data.BuyerTin;
			}
			reactotron.log({ from: "CREATE DOCUMENT SAGA", data });
			let { totalSumForPdf, ...rest } = data.products;
			data.products = { ...rest, Tin: Seller.tin };
			let completeData = {
				...data.data,
				...data,
				Buyer,
				BuyerTin: Buyer.tin,
				Seller,
				SellerTin: Seller.tin,
				ProductList: data.products,
				SellerName: Seller.name,
				BuyerName: Buyer.name,
				thirdParty,
				thirdPartyTin:thirdParty?.tin,
				sum: totalSumForPdf
			};
			let invoiceJson = Object.keys(
				documentModel[data.parentName][data.middleName]
			).reduce(
				(prev, current) => ({
					...prev,
					[current]: completeData[current]
				}),
				{}
			);

			console.log({ invoiceJson });

			let invoicePDF = yield call(requests.documents.uploadFile, {
				invoiceJson: JSON.stringify(invoiceJson),
				tinRecipient: Buyer.tin,
				documentTypeId: data.documentType || data.invoiceType,
				documentNumber: getObjectProperty(
					data.data,
					documentNumberProperty
				),
				documentDate: getObjectProperty(
					data.data,
					documentDateProperty
				),
				sum: totalSumForPdf
			});
			yield put(hideModal());
			let { fileName, filePath } = invoicePDF.data.data;
			console.log({ invoice: invoicePDF.data.data });

			NavigationService.navigate("PdfViewer", {
				newDocument: {
					fileName,
					filePath,
					dataForSign: JSON.stringify(invoiceJson)
				},
				data: { ...data, totalSumForPdf },
				invoiceJson
			});
			return;
		}
		let { documentNumberProperty, documentDateProperty, } = data;
		let fileData = {
			file: constructFileFromUri(data.data.file),
			tinRecipient: data.buyerTin.tin,
			documentTypeId: data.documentType,
			documentNumber: getObjectProperty(
				data.data,
				documentNumberProperty
			),
			documentDate: getObjectProperty(data.data, documentDateProperty)
		};
		//* Uploading file
		let response = yield call(requests.documents.uploadFile, fileData);
		let {thirdParty} = data?.data||{};
		yield put(hideModal());
		NavigationService.navigate("PdfViewer", {
			newDocument: {
				...response.data.data,
				dataForSign: response.data.data.documentContentForSign
			},
			data:{...data,thirdPartyTin:thirdParty?.tin}
		});
		return;
		//! Signing should be on
		//* Change loading screen message to creating document
		yield put(showModal(strings.creatingDocument));
		//* Let user know that the file uploaded succesfully
		yield put({
			type: SET_SUCCESS_MESSAGE,
			payload: `${strings.uploadSuccess}`
		});
		//* Getting path of file to convert it base64 with react-native-fs
		let path =
			Platform.OS == "ios"
				? data.file.uri.replace("file://", "")
				: data.file.uri;
		//* Convert file to base64
		let fileBase64 = yield call(RnFs.readFile, path, "base64");
		//* Sign the file
		let sign = yield call(eSign, fileBase64);
		//* Check if the user signed otherwise reject!
		if (!sign.pkcs7) {
			yield put(showModal(strings.uploadingFile));
			yield put({
				type: SET_DANGER_ERROR,
				payload: strings.somethingWentWrong
			});
			yield put(hideModal());
			yield delay(3000);
			yield put(hideError());
			return;
		}
		//* Construct request body for creating document
		let { filePath, fileName } = response.data.data;
		let documentData = {
			...data,
			filePath,
			fileName,
			sign: sign.pkcs7,
			buyerCompanyName: "BBB"
		};
		delete documentData.file;
		delete documentData.type;
		//* Getting document url specific to documentType
		let url = docIdUrls[data.type].url || docIdUrls.other;
		//* Creating document
		let docResponse = yield call(
			requests.documents.create,
			url,
			documentData
		);
		//* Clear messages and loading screens
		NavigationService.navigate("Main");
		yield put(hideModal());
		yield delay(500);
		yield put({
			type: SET_SUCCESS_MESSAGE,
			payload: strings.documentCreatedSuccesfully
		});
		yield delay(3000);
		yield put(hideError());
	} catch (error) {
		let { response } = error || {};
		if (!response) {
			yield put({
				type: SET_DANGER_ERROR,
				payload: `${strings.somethingWentWrong}: ${error.message}`
			});
		} else {
			yield put({
				type: SET_DANGER_ERROR,
				payload: `${strings.somethingWentWrong}: ${JSON.stringify(
					response.data.message
				)}`
			});
		}
		// Clipboard.setString(JSON.stringify(response));
		yield put(hideModal());
		yield delay(3000);
		yield put(hideError());
	}
}

export function* documentInteractionHandler({
	payload: {
		documentId,
		actionType,
		notes,
		newInvoiceContent = "",
		tin,
		boxType,
		status,
		docTypeId
	}
}) {
	try {
		//* Show loading
		yield put(showModal(strings.fetchingData));
		let message = ""; //* For showing success message

		//* Check the action type
		switch (actionType) {
			case "delete":
				{
					//* Remove the document from TaxDep if its type is invoice
					//* docTypeId === 2 && boxType === 2 means: it is sent invoice
					// if (docTypeId === 2 && boxType === 2) {
					// 	//* invoice content as json
					// 	let signMessage = yield call(
					// 		requests.documents.getJsonContent,
					// 		documentId
					// 	);
					// 	//* parsed content for signing
					// 	let newJson = JSON.parse(signMessage.data.data);
					// 	//* signing
					// 	let sign = yield call(eSign, newJson);
					// 	//* cancel invoice from TaxDep
					// 	let cancelResult = call(
					// 		requests.documents.cancelInvoice,
					// 		documentId,
					// 		{
					// 			sign
					// 		}
					// 	);
					// }
					//* regular delete documents
					let response = yield call(
						requests.documents.delete,
						documentId
					);
					message = strings.deletedSuccesfully;
				}
				break;
			case "accept":
				{
					console.log("ACCEPTING");
					//* Different method for accept content
					let signMessage = yield call(
						requests.documents.getSignMessageForAccept,
						documentId
					);
					//* signing
					console.log("GETTING SIGN TO", {
						message: signMessage.data.data
					});
					let apppendResult = yield call(
						append,
						signMessage.data.data
					);
					let tst = yield call(
						requests.documents.getTimestamp,
						apppendResult.signature
					);
					let sign = yield call(attach, tst.data.data);
					console.log("RECIEVED SIGN", sign);
					let response = yield call(requests.documents.sign, {
						documentId,
						sign: sign.pkcs7
					});
					//* sending push
					let pushResult = yield call(requests.documents.sendPush, {
						id: documentId.toString(),
						tin,
						message: 20
					});
					message = strings.signedSuccessfully;
				}
				break;
			case "reject": {
				//* store sign
				let sign;
				//* if the document is invoice delete it from TaxDep
				console.warn({ reject: docTypeId });

				if (docTypeId === 2) {
					//* getting content for signing
					let signMessage = yield call(
						requests.documents.getJsonContent,
						documentId
					);
					//* forming sign request
					let newJson = {
						Factura: JSON.parse(signMessage.data.data),
						Notes: notes
					};
					//* signing
					let createdSign = yield call(
						eSign,
						JSON.stringify(newJson)
					);

					// //* signing
					// let rawSign = yield call(append, createdSign.pkcs7);

					//* getting timestamp from api
					let tst = yield call(
						requests.documents.getTimestamp,
						createdSign.signature
					);
					console.log({
						tst
					});

					sign = yield call(attach, tst.data.data);
					console.log({
						sign
					});
				} else {
					//* handling reject of other types
					let signMessage = yield call(
						requests.documents.getSignMessage,
						documentId
					);
					sign = yield call(eSign, signMessage.data.data);
				}

				console.log({
					rejectContent: {
						documentId,
						sign: sign.pkcs7,
						notes
					}
				});

				let response = yield call(requests.documents.reject, {
					documentId,
					sign: sign.pkcs7,
					notes
				});

				yield call(requests.documents.sendPush, {
					id: documentId,
					tin,
					message: 30
				});
				message = strings.successfullyRejected;
				break;
			}
			default:
				break;
		}
		yield put(fetchDocuments());
		yield put(hideModal());
		NavigationService.navigate("Main");
		yield put({
			type: SET_SUCCESS_MESSAGE,
			payload: message
		});
		yield delay(3000);
		yield put(hideError());
	} catch (error) {
		console.warn(error);
		let { response } = error || {};
		if (!response) {
			yield put({
				type: SET_DANGER_ERROR,
				payload: `${strings.somethingWentWrong}: ${error.message}`
			});
		} else {
			yield put({
				type: SET_DANGER_ERROR,
				payload: `${strings.somethingWentWrong}: ${JSON.stringify(
					response.data.message
				)}`
			});
		}
		console.warn(response);
		yield put(hideModal());
		yield delay(3000);
		yield put(hideError());
	}
}

export function* documents() {
	yield takeEvery(FETCH_DOCUMENTS, fetchDocumentsAsync);
}

export function* handlegGetRegions() {
	yield takeEvery(GET_REGIONS, getRegions);
}

export function* docuemntInteraction() {
	yield takeEvery(
		[ACCEPT_DOCUMENT, REJECT_DOCUMENT, DELETE_DOCUMENT],
		documentInteractionHandler
	);
}

export function* documentCreation() {
	yield takeEvery(CREATE_DOCUMENT, createDocument);
}
