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
import { url } from "../../api/requests";
import BlurWrapper from "../../components/containers/BlurWrapper";
import InnerHeader from "../../components/navigation/InnerHeader";
import { colors } from "../../constants";
import { acceptDocument, hideError } from "../../redux/actions";
import { SET_DANGER_ERROR } from "../../redux/types";
import { NavigationProps } from "../../utils/defaultPropTypes";
import SimpleLine from "react-native-vector-icons/Feather";
import {
	BoxType,
	DocumentStatus
} from "../../components/navigation/DrawerContent";
import { sign } from "../../utils/bdmImzoProvider";

let { width, height } = Dimensions.get("window");

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
	//* notNull content -- we have to sign invoice JSON
	let content = navigation.getParam("content");

	let { boxType, status } = documents;
	let accept = async () => {
		//* Check if new document
		if (filePath) {
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
							: `${url}/document/instant/view/pdf?path=${filePath}`,
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
							{/* <RoundButton
              full
              flex
              backgroundColor={colors.red}
              text={strings.reject}
              onPress={reject}
            />
            <GradientButton
              textColor={colors.white}
              fill
              flex
              text={strings.sign}
              onPress={accept}
            /> */}
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
		backgroundColor: colors.white
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
