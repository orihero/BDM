import React from "react";
import {
	ActivityIndicator,
	Dimensions,
	StyleSheet,
	TouchableWithoutFeedback,
	View
} from "react-native";
import Pdf from "react-native-pdf";
import { connect } from "react-redux";
import {} from "rn-fetch-blob";
import { url, requests } from "../../api/requests";
import BlurWrapper from "../../components/containers/BlurWrapper";
import InnerHeader from "../../components/navigation/InnerHeader";
import { colors } from "../../constants";
import {
	acceptDocument,
	hideError,
	showModal,
	hideModal
} from "../../redux/actions";
import {
	SET_DANGER_ERROR,
	SET_SUCCESS_ERROR,
	SET_WARNING_ERROR
} from "../../redux/types";
import { NavigationProps } from "../../utils/defaultPropTypes";
import SimpleLine from "react-native-vector-icons/Feather";
import {
	BoxType,
	DocumentStatus
} from "../../components/navigation/DrawerContent";
import { sign } from "../../utils/bdmImzoProvider";
import { strings } from "../../locales/strings";
import { docIdUrls } from "../../redux/sagas/documents";

let { width, height } = Dimensions.get("window");

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const PdfViewer = ({
	navigation,
	accessToken,
	dispatch,
	documents
}: NavigationProps) => {
	//* notNull docId -- recieved document
	let docId = navigation.getParam("docId");
	//* notNull filePath -- document was created
	let filePath = navigation.getParam("filePath");
	let fileName = navigation.getParam("fileName");
	//* notNull content -- we have to sign invoice JSON
	let content = navigation.getParam("content");
	let data = navigation.getParam("data");
	let dataForSign = navigation.getParam("dataForSign");

	let { boxType, status } = documents;
	let accept = async () => {
		//* Check if new document
		if (filePath) {
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
						description: data.description,
						filePath,
						fileName
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
					dispatch(hideModal());
					dispatch({
						type: SET_SUCCESS_ERROR,
						payload: strings.documentCreatedSuccesfully
					});
					navigation.navigate("Main");
					await sleep(3000);
					dispatch(hideError());
					return;
				} else {
					//* Creating upload data for non-invoice document
					let { buyerTin: buyer, ...rest } = data;
					let documentData = {
						...rest,
						filePath,
						fileName,
						sign: pkcs7,
						buyerCompanyName: buyer.name,
						buyerTin: buyer.tin
					};
					//* Remove local file path
					delete documentData.file;
					delete documentData.type;
					//* Getting document url specific to documentType
					let url =
						docIdUrls[data.documentType].url || docIdUrls.other;
					//* Creating document
					let res = await requests.documents.create(
						url,
						documentData
					);
					dispatch(hideModal());
					dispatch({
						type: SET_SUCCESS_ERROR,
						payload: strings.documentCreatedSuccesfully
					});
					navigation.navigate("Main");
					await sleep(3000);
					dispatch(hideError());
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
			}
			return;
		}
		dispatch(acceptDocument(docId));
	};
	let reject = () => {};

	let download = () => {};

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
	let defaultButtons = [
		{
			name: "check-circle",
			color: colors.green,
			size: 18,
			onPress: accept
		},
		{ name: "delete", color: colors.red, size: 18, onPress: download },
		{ name: "trash-2", color: colors.yellow, size: 18, onPress: reject }
	];
	let buttonsToRender = docId
		? defaultButtons
		: filePath
		? newDocumentButtons
		: [];
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
							payload: error.message
						});
						setTimeout(() => dispatch(hideError()), 3000);
					}}
					activityIndicator={e => {
						return <ActivityIndicator />;
					}}
					enablePaging
					style={styles.container}
				/>
				{boxType === BoxType.inbox &&
					status === DocumentStatus.sentOrRecieved && (
						<View style={styles.row}>
							{buttonsToRender.map(({ onPress, color, ...e }) => {
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
	}
});

let mapStateToProps = ({ user: { accessToken }, documents }) => ({
	accessToken,
	documents
});

let Connected = connect(mapStateToProps)(PdfViewer);

export { Connected as PdfViewer };
