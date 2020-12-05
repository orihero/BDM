import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	BackHandler,
	Dimensions,
	StyleSheet,
	TouchableWithoutFeedback,
	View
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
import reactotron from "../../redux/reactotron-config";
import { docIdUrls } from "../../redux/sagas/documents";
import {
	SET_DANGER_ERROR,
	SET_SUCCESS_MESSAGE,
	SET_WARNING_ERROR
} from "../../redux/types";
import { sign, attach } from "../../utils/bdmImzoProvider";
import { NavigationProps } from "../../utils/defaultPropTypes";
import {taxDepartmentDocs} from '../../redux/sagas/documents'

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
		if (!!newDocument) {
			//* Start loading
			dispatch(showModal(strings.creatingDocument));
			try {
				//* Check if the document is invoice
				if (taxDepartmentDocs[data.documentType]) {
					console.warn({ data, newDocument });
					let facturaID = await requests.documents.getInvoiceId();
					let productId = await requests.documents.getInvoiceId();
					reactotron.logImportant(data);
					let docModel =
						data.documentModel[data.parentName][data.middleName];
					let createdDocModel = Object.keys(docModel).reduce(
						(prev, current) => {
							return {
								...prev,
								[current]: data.data[current]
							};
						},
						{}
					);
					let content = {
						...createdDocModel,
						ProductList: {
							...data.products,
							[data.productIdName]: productId.data.data,
							Tin: data.seller.tin,
						},
						[data.facturaIdName]: facturaID.data.data,
						Seller: data.seller,
						SellerTin: data.seller.tin,
						SellerName:  data.seller.name,
						BuyerName: data.buyer.name,
						Buyer: data.buyer,
						BuyerTin: data.buyer.tin,
						Version: 1,
						FacturaType: 0,
						SingleSidedType: 0,
					}
					if(data.documentType===29){
						content.ActDoc.ActText = `Мы, нижеподписавшиеся, 
						${data.buyer.name}, именуемое в дальнейшем Исполнитель, с одной стороны, и 
						${data.seller.name}, именуемое в дальнейшем Заказчик, с другой стороны, 
						составили настоящий Акт о том, что работы выполнены в соответствии с условиями Заказчика в полном объёме.`
					}
					//* Sign document hash
					let { pkcs7, signature } = await sign(JSON.stringify(content));
					//* Creating upload data for invoice document
					let time = await requests.documents.getTimestamp(signature);
					let attachedSign = await attach(time.data.data);
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
					reactotron.logImportant({ docModel, createdDocModel });
					let submitData = {
						[data.parentName]: {
							[data.middleName]: content,
							sign: attachedSign.pkcs7,
							sum: data.data.sum,
							description: data.description,
							fileName,
							filePath
						}
					};
					
					let createRes = await requests.documents.create(
						data.invoiceType||data.documentType,
						submitData
					);
					console.warn({ createRes });
				} else {
					let {pkcs7} = await sign(dataForSign);
					//* Creating upload data for non-invoice document
					let { documentModel } = data;
					let completeData = {
						...data.data,
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
					let submitData = { ...createRequestBody }
					reactotron.log({submitData})
					let res = await requests.documents.create(
						data.documentType,
						{ [data.parentName]:  submitData}
					);
				}
				dispatch(hideModal());
				dispatch({
					type: SET_SUCCESS_MESSAGE,
					payload: strings.documentCreatedSuccesfully
				});
				navigation.navigate("Main");
				await sleep(3000);
				dispatch(hideError());
			} catch (error) {
				let txt = error?.response?.data?.message||"{}";
				let message=strings.pleaseFillAllOfTheFields;
				try {
					message = JSON.parse(txt)?.errorMessage
				} catch (error) {
					
				}
				dispatch(hideModal());
				dispatch({
					type: SET_DANGER_ERROR,
					payload: strings.somethingWentWrong + `\n${message}`
				});
				await sleep(6000);
				dispatch(hideError());
				return;
			} finally {
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
	console.log({
		path: `${url}/document/instant/view/pdf?path=${filePath}/${fileName}`
	});

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
