import React, { useState, useEffect } from "react";
import {
	ActivityIndicator,
	Dimensions,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
	BackHandler
} from "react-native";
import Pdf from "react-native-pdf";
import SimpleLine from "react-native-vector-icons/Feather";
import { connect } from "react-redux";
import RNFB from "rn-fetch-blob";
import { requests, url } from "../../api/requests";
import Text from "../../components/common/CustomText";
import RectangularInput from "../../components/common/RectangularInput";
import BlurWrapper from "../../components/containers/BlurWrapper";
import Modal from "../../components/Modal";
import InnerHeader from "../../components/navigation/InnerHeader";
import { colors } from "../../constants";
import { strings } from "../../locales/strings";
import {
	acceptDocument,
	hideError,
	hideModal,
	showModal
} from "../../redux/actions";
import { docIdUrls } from "../../redux/sagas/documents";
import {
	SET_DANGER_ERROR,
	SET_SUCCESS_MESSAGE,
	SET_WARNING_ERROR
} from "../../redux/types";
import { sign } from "../../utils/bdmImzoProvider";
import { NavigationProps } from "../../utils/defaultPropTypes";
import { convertToTypeOf } from "../../utils/object";

let { width, height } = Dimensions.get("window");

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const PdfViewer = ({
	navigation,
	accessToken,
	dispatch,
	documents,
	user
}: NavigationProps) => {
	//* notNull docId -- recieved document
	let docId = navigation.getParam("docId");
	//* notNull filePath -- document was created
	let newDocument = navigation.getParam("newDocument");
	let { dataForSign, filePath, fileName } = newDocument || {};
	//* notNull content -- we have to sign invoice JSON
	let data = navigation.getParam("data");
	let signed = navigation.getParam("signed");

	const [modalVisible, setModalVisible] = useState(false);
	const [reason, setReason] = useState("");
	let { boxType, status } = documents;

	let accept = async () => {
		//* Check if new document
		if (newDocument) {
			//* Start loading
			dispatch(showModal(strings.creatingDocument));
			try {
				//* Sign document hash
				let { pkcs7 } = await sign(dataForSign);
				if (!pkcs7) {
					//* User did not sign
					dispatch(hideModal());
					dispatch({
						type: SET_WARNING_ERROR,
						payload: strings.yourSignIsNeeded
					});
					await sleep(3000);
					dispatch(hideError());
					return;
				}
				//* Check if the document is invoice
				if (data.documentType === 2) {
					//* Creating upload data for invoice document
					let sum = data.products.reduce(
						(prev, current) =>
							prev + parseFloat(current.DeliverySumWithVat),
						0
					);
					let invoiceData = {
						invoiceJSON: dataForSign,
						sign: pkcs7,
						sum,
						description: data.description
					};
					//TODO get facture id
					// let invoiceData = yield call(
					// 	requests.documents.getIvoiceId
					// );
					// let FacturaId = invoiceData.data.data;
					requests.documents.create(
						docIdUrls[data.documentType].url,
						invoiceData
					);
				} else {
					//* Creating upload data for non-invoice document
					let { documentModel } = data;
					let completeData = {
						...data,
						sign: pkcs7,
						fileName,
						filePath
					};
					let createRequestBody = Object.keys(
						documentModel[data.parentName]
					).reduce(
						(prev, current) => ({
							...prev,
							[current]: completeData[current]
						}),
						{}
					);
					console.warn({
						contract: createRequestBody.contract,
						buyer: createRequestBody.buyer
					});
					let res = await requests.documents.create(
						data.documentType,
						{ [data.parentName]: { ...createRequestBody } }
					);
					console.log(res.data);
				}
			} catch (error) {
				console.warn(error.response);
				dispatch(hideModal());
				dispatch({
					type: SET_DANGER_ERROR,
					payload: strings.somethingWentWrong + `\n${error.message}`
				});
				await sleep(3000);
				dispatch(hideError());
				return;
			} finally {
				dispatch(hideModal());
				dispatch({
					type: SET_SUCCESS_MESSAGE,
					payload: strings.documentCreatedSuccesfully
				});
				navigation.navigate("Main");
				await sleep(3000);
				dispatch(hideError());
			}
			return;
		}
		//* Creating accept request
		let payload = {
			documentId: docId,
			actionType: "accept",
			tin: navigation.getParam("tin"),
			boxType,
			status,
			docTypeId: navigation.getParam("type")
		};
		console.log({ payload });
		dispatch(acceptDocument(payload));
	};
	let reject = () => {
		setModalVisible(!modalVisible);
		// dispatch(acceptDocument({ documentId: docId, actionType: "reject" }));
	};

	let onDelete = () => {
		// setModalVisible(!modalVisible);
		dispatch(acceptDocument({ documentId: docId, actionType: "delete" }));
	};

	let download = async () => {
		showModal(strings.fetchingData);
		let documentNumber = navigation.getParam("number");
		let documentDate = navigation.getParam("date");
		let buyerTin = navigation.getParam("tin");
		let documentTypeName = navigation.getParam("type");
		let docType = docIdUrls[documentTypeName].name;
		//* Get file content
		let data = await RNFB.fetch(
			"GET",
			docId
				? `${url}/document/view/pdf/${docId}`
				: `${url}/document/instant/view/pdf?path=${filePath}/${fileName}`,
			{ Authorization: `Bearer ${accessToken}` }
		);
		let tempName = docId
			? `${docType}№${documentNumber}_от${documentDate}_от${buyerTin}.pdf`
			: fileName;
		let res = await RNFB.fs.writeFile(
			RNFB.fs.dirs.DownloadDir + "/" + tempName,
			data.base64(),
			"base64"
		);
		dispatch({
			type: SET_SUCCESS_MESSAGE,
			payload: `Файл сохранен в папке загрузок как ${tempName}`
		});
		await sleep(3000);
		dispatch(hideError());
	};

	let backHandler = () => {
		navigation.navigate("Main");
		return true;
	};

	useEffect(() => {
		BackHandler.addEventListener("hardwareBackPress", backHandler);
		return BackHandler.removeEventListener(
			"hardwareBackPress",
			backHandler
		);
	}, []);

	let { hasSign } = user;

	let newDocumentButtons = [
		{
			name: "check-circle",
			color: colors.green,
			size: 18,
			onPress: accept
		},
		{ name: "download", color: colors.blue, size: 18, onPress: download },
		{ name: "delete", color: colors.red, size: 18, onPress: reject }
	];

	let buttonsToRender = [];

	//* Opening existing document
	if (docId) {
		if (!signed) {
			buttonsToRender.push({
				name: "check-circle",
				color: colors.green,
				size: 18,
				onPress: accept
			});
		}
		buttonsToRender.push({
			name: "download",
			color: colors.blue,
			size: 18,
			onPress: download
		});
	}
	//* Creating document
	if (status === 10 && boxType === 1) {
		buttonsToRender.push({
			name: "delete",
			color: colors.red,
			size: 18,
			onPress: reject
		});
	} else {
		buttonsToRender.push({
			name: "trash-2",
			color: colors.yellow,
			size: 18,
			onPress: onDelete
		});
	}
	if (filePath) {
		buttonsToRender = newDocumentButtons;
	}
	return (
		<BlurWrapper>
			<View style={styles.container}>
				<InnerHeader />
				<Pdf
					source={{
						uri: docId
							? `${url}/document/view/pdf/${docId}`
							: `${url}/document/instant/view/pdf?path=${filePath}/${fileName}`,
						headers: { Authorization: `Bearer ${accessToken}` }
					}}
					onError={error => {
						dispatch({
							type: SET_DANGER_ERROR,
							payload: strings.fileCorrupted
						});
						setTimeout(() => dispatch(hideError()), 3000);
					}}
					activityIndicator={e => {
						return <ActivityIndicator />;
					}}
					enablePaging
					style={styles.container}
				/>
				<View style={styles.row}>
					{hasSign &&
						buttonsToRender.map(({ onPress, color, ...e }) => {
							return (
								<TouchableWithoutFeedback {...{ onPress }}>
									<View
										style={[
											styles.buttonContainer,
											{ backgroundColor: color }
										]}
									>
										<SimpleLine
											{...e}
											color={colors.white}
										/>
									</View>
								</TouchableWithoutFeedback>
							);
						})}
				</View>
				{modalVisible && (
					<Modal>
						<View style={styles.modalContainer}>
							<Text style={styles.modalTitle}>
								{strings.rejectReason}
							</Text>
							<RectangularInput
								placeholder={strings.rejectReason}
								multiline={true}
								value={reason}
								onChange={e => setReason(e)}
							/>
							<View style={styles.buttonsRow}>
								<Text
									onPress={reject}
									style={styles.textButton}
								>
									{strings.cancel}
								</Text>
								<Text
									onPress={() => {
										if (reason === "") {
											dispatch({
												type: SET_DANGER_ERROR,
												payload:
													strings.pleaseFillAllOfTheFields
											});
											setTimeout(() => {
												dispatch(hideError());
											}, 4000);
											return;
										}
										let payload = {
											documentId: docId,
											actionType: "reject",
											tin: navigation.getParam("tin"),
											boxType,
											status,
											docTypeId: navigation.getParam(
												"type"
											),
											notes: reason
										};
										dispatch(acceptDocument(payload));
										setModalVisible(false);
									}}
									style={styles.textButton}
								>
									{strings.confirm}
								</Text>
							</View>
						</View>
					</Modal>
				)}
			</View>
		</BlurWrapper>
	);
};

let ratio = width / height;
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.white,
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").height
	},
	row: {
		flexDirection: "row",
		justifyContent: "center"
	},
	buttonContainer: {
		backgroundColor: colors.white,
		borderRadius: 40,
		width: 40,
		margin: 10,
		height: 40,
		justifyContent: "center",
		alignItems: "center",
		elevation: 2
	},
	modalContainer: {
		padding: 15,
		backgroundColor: colors.white,
		width: width - 40
	},
	buttonsRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		margin: 15
	},
	textButton: {
		textTransform: "uppercase",
		color: colors.blue,
		fontSize: 12
	},
	modalTitle: {
		fontSize: 18,
		color: colors.black,
		marginVertical: 15
	}
});

let mapStateToProps = ({ user: { accessToken, ...user }, documents }) => ({
	accessToken,
	documents,
	user
});

let Connected = connect(mapStateToProps)(PdfViewer);

export { Connected as PdfViewer };
