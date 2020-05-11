import React, { useState, useEffect, useRef } from "react";
import {
	View,
	FlatList,
	StyleSheet,
	Animated,
	Dimensions,
	TouchableWithoutFeedback,
	BackHandler
} from "react-native";
import Document, { DocumentProps } from "./Document";
import DrawerContent, {
	DrawerActionTypes,
	BoxType,
	DocumentStatus
} from "../../components/navigation/DrawerContent";
import { colors } from "../../constants";
import Header from "../../components/navigation/Header";
import { strings } from "../../locales/strings";
import { connect } from "react-redux";
import {
	fetchDocuments,
	getRegions,
	hideModal,
	showModal,
	hideError,
	userLoggedOut
} from "../../redux/actions";
import BlurWrapper from "../../components/containers/BlurWrapper";
import { DrawerAction } from "../../components/navigation/DrawerContent";
import Text from "../../components/common/CustomText";
import Feather from "react-native-vector-icons/Feather";
import DocumentPicker from "react-native-document-picker";
import { requests } from "../../api/requests";
import { SET_DANGER_ERROR } from "../../redux/types";
import AsyncStorage from "@react-native-community/async-storage";
import { storeName } from "../../redux/reducers/user";
import Modal from "../../components/Modal";

const minW = 60;
let { height, width } = Dimensions.get("window");
const maxW = width;

const Main = ({
	navigation,
	fetchDocuments,
	documents: { data, status, boxType },
	hideModal,
	showModal,
	dispatch,
	hideError,
	user
}) => {
	const [width, setWidth] = useState(new Animated.Value(minW));
	const [expanded, setExpanded] = useState(false);
	let defaultModal = {
		visible: false,
		title: "",
		number: "",
		tin: "",
		date: "",
		text: ""
	};
	const [modalData, setModalData] = useState(defaultModal);
	let toggle = async (action: DrawerAction) => {
		if (!action || !action.type) {
			Animated.spring(width, {
				toValue: expanded ? minW : maxW
			}).start(() => setExpanded(!expanded));
			return;
		}
		switch (action.type) {
			case DrawerActionTypes.navigate:
				navigation.navigate(action.navigateTo);
				break;
			case DrawerActionTypes.changeBox:
				fetchDocuments(action);
				break;
			case DrawerActionTypes.logout:
				await AsyncStorage.setItem(storeName, "{}");
				dispatch(userLoggedOut());
				navigation.navigate(action.navigateTo);
				break;
		}
		Animated.spring(width, { toValue: minW }).start(() =>
			setExpanded(!expanded)
		);
	};

	let newUpload = async () => {
		try {
			showModal(strings.uploadingFile);
			const res = await DocumentPicker.pick({
				type: [DocumentPicker.types.allFiles]
			});
			let { uri, type, name } = res;
			let uploadRes = await requests.documents.uploadExcel({
				documentTypeId: 19,
				file: { uri, type, name }
			});
		} catch (err) {
			if (DocumentPicker.isCancel(err)) {
				// User cancelled the picker, exit any dialogs or menus and move on
			} else {
				dispatch({ type: SET_DANGER_ERROR, payload: err.message });
			}
		} finally {
			hideModal();
			setTimeout(() => hideError(), 3000);
		}
	};

	let handleBackButton = () => {
		setModalData(defaultModal);
		return true;
	};

	const ref = useRef(null);

	useEffect(() => {
		if (modalData.visible) {
			ref.current = BackHandler.addEventListener(
				"hardwareBackPress",
				handleBackButton
			);
		} else {
			if (ref.current) ref.current.remove();
		}
	}, [modalData]);

	useEffect(() => {
		// getRegions();
		fetchDocuments();
		hideModal();
	}, []);
	return (
		<BlurWrapper>
			<View style={{ flex: 1 }}>
				<Header
					title={user.data ? user.data.name : ""}
					toggleDrawer={toggle}
					scroll={!!user.data}
				/>
				<View style={styles.row}>
					<FlatList
						ListEmptyComponent={() => (
							<Text
								style={{
									marginTop: 100,
									textAlign: "center"
								}}
							>
								{strings.noData}
							</Text>
						)}
						contentContainerStyle={styles.flatContainer}
						data={data}
						showsVerticalScrollIndicator={false}
						keyExtractor={(e, i) => i.toString()}
						renderItem={({ item }) => (
							<Document
								{...{ item }}
								showDescription={data => setModalData(data)}
							/>
						)}
					/>
					<Animated.View
						style={{
							width,
							zIndex: 5,
							height,
							position: "absolute"
						}}
					>
						<DrawerContent
							navigation={navigation}
							expanded={expanded}
							onPress={toggle}
							progress={width}
						/>
					</Animated.View>
				</View>
				{boxType === BoxType.outbox &&
					status === DocumentStatus.uploaded && (
						<View style={styles.roundButtonContainer}>
							<TouchableWithoutFeedback onPress={newUpload}>
								<View style={styles.roundButton}>
									<Feather
										name="plus"
										size={36}
										color={colors.white}
									/>
								</View>
							</TouchableWithoutFeedback>
						</View>
					)}
				{modalData.visible && (
					<Modal>
						<View style={styles.modalContent}>
							<Text style={styles.modalTitle}>
								{modalData.title}
							</Text>
							<Text style={styles.modalDescription}>
								{strings.senderTin}:{" "}
								<Text style={styles.modalActive}>
									{modalData.tin}
								</Text>
							</Text>
							<Text style={styles.modalDescription}>
								{strings.documentNumber}:{" "}
								<Text style={styles.modalActive}>
									{modalData.number}
								</Text>
							</Text>
							<Text style={styles.modalDescription}>
								{strings.documentDate}:{" "}
								<Text style={styles.modalActive}>
									{modalData.date}
								</Text>
							</Text>
							<Text style={styles.modalText}>
								{modalData.text}
							</Text>
							<Text
								onPress={() =>
									setModalData({
										...defaultModal,
										visible: false
									})
								}
								style={styles.modalButton}
							>
								{strings.cancel}
							</Text>
						</View>
					</Modal>
				)}
			</View>
		</BlurWrapper>
	);
};

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		flex: 1
	},
	flatContainer: { paddingBottom: 30, marginLeft: minW },
	roundButtonContainer: {
		position: "absolute",
		bottom: 15,
		right: 15
	},
	roundButton: {
		width: 60,
		height: 60,
		backgroundColor: colors.blue,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 60
	},
	modalContent: {
		padding: 20,
		backgroundColor: colors.white,
		left: 10,
		right: 10,
		borderRadius: 8,
		width: width - 40
	},
	modalTitle: {
		color: colors.black,
		fontSize: 18,
		fontWeight: "bold"
	},
	modalText: {
		color: colors.darkGray,
		margin: 10,
		fontSize: 16
	},
	modalButton: {
		textTransform: "uppercase",
		color: colors.customBlue,
		fontSize: 12,
		textAlign: "right"
	},
	modalDescription: {
		fontWeight: "bold",
		fontSize: 16,
		color: colors.black
	},
	modalActive: {
		fontWeight: "bold",
		fontSize: 16,
		color: colors.customBlue
	}
});

const mapStateToProps = ({ documents, user }) => ({
	documents,
	user
});

const mapDispatchToProps = {
	fetchDocuments,
	hideModal,
	showModal,
	hideError
};

let ConnectedMain = connect(
	mapStateToProps,
	mapDispatchToProps
)(Main);

export { ConnectedMain as Main };
