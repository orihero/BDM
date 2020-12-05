import AsyncStorage from "@react-native-community/async-storage";
import React, { useEffect, useRef, useState } from "react";
import {
	Animated,
	BackHandler,
	Dimensions,
	FlatList,
	KeyboardAvoidingView,
	ScrollView,
	StyleSheet,
	TouchableWithoutFeedback,
	View
} from "react-native";
import DocumentPicker from "react-native-document-picker";
import Feather from "react-native-vector-icons/Feather";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import { requests, url } from "../../api/requests";
import Text from "../../components/common/CustomText";
import GradientButton from "../../components/common/GradientButton";
import BlurWrapper from "../../components/containers/BlurWrapper";
import FieldsRenderer from "../../components/generators/FieldsRenderer";
import Modal from "../../components/Modal";
import DrawerContent, {
	BoxType,
	DocumentStatus,
	DrawerAction,
	DrawerActionTypes
} from "../../components/navigation/DrawerContent";
import Header from "../../components/navigation/Header";
import { colors } from "../../constants";
import { strings } from "../../locales/strings";
import {
	documentsLoaded,
	fetchDocuments,
	hideError,
	hideModal,
	showModal,
	userLoggedOut
} from "../../redux/actions";
import reactotron from "../../redux/reactotron-config";
import { storeName } from "../../redux/reducers/user";
import { SET_DANGER_ERROR } from "../../redux/types";
import { normalizeFilters } from "../../utils/object";
import { FieldProps, FieldSize, FieldType } from "../auth";
import Document from "./Document";

const minW = 60;
let { height, width } = Dimensions.get("window");
const maxW = width;

let filterFields: FieldProps[] = [
	{
		type: FieldType.LINE,
		title: strings.documentDate,
		columns: [
			{
				type: FieldType.DATE_PICKER,
				size: FieldSize.HALF,
				placeholder: strings.from,
				name: "dateFrom"
			},
			{
				type: FieldType.DATE_PICKER,
				size: FieldSize.HALF,
				placeholder: strings.to,
				name: "dateTo"
			}
		]
	},
	{
		title: strings.documentId,
		type: FieldType.INPUT,
		name: "id",
		placeholder: strings.documentId
	},
	{
		title: strings.documentNumber,
		type: FieldType.INPUT,
		name: "number",
		placeholder: strings.documentNumber
	},
	{
		title: strings.type,
		type: FieldType.SELECT,
		name: "type",
		placeholder: strings.type,
		fetch: () => requests.documents.getDocumentTypes(1),
		map: (e, index) => {
			return {
				label: e.typeName,
				value: index,
				actualValue: e.type
			};
		}
	},
	{
		title: strings.inn,
		type: FieldType.INPUT,
		name: "tin",
		placeholder: strings.inn
	},
	{
		title: strings.amount,
		type: FieldType.INPUT,
		name: "sum",
		placeholder: strings.amount
	},
	{
		title: strings.companyName,
		type: FieldType.INPUT,
		name: "companyName",
		placeholder: strings.companyName
	}
];

const Main = ({
	navigation,
	fetchDocuments,
	documents,
	hideModal,
	showModal,
	dispatch,
	hideError,
	user,
	userLoggedOut,
	documentsLoaded
}) => {
	let { data, status, boxType, notification } = documents;
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
	const [filters, setFilters] = useState({});
	const [filterVisible, setFilterVisible] = useState(false);
	useEffect(() => {
		try {
			if (notification) {
				let index = data.findIndex(
					e => e.id.toString() === notification.id
				);
				if (flatList.current && index) {
					flatList.current.scrollToIndex({ index });
					// documentsLoaded({
					// 	data,
					// 	boxType,
					// 	status,
					// 	notification: null
					// });
				}
			}
		} catch (error) {
			console.log("ON PUSH SCROLL ERROR:", error);
		}
	}, [documents]);
	let toggle = async (action: DrawerAction) => {
		if (!action || !action.type) {
			Animated.spring(width, {
				toValue: expanded ? minW : maxW,
				speed: 500
			}).start(() => setExpanded(!expanded));
			return;
		}
		reactotron.log({ action, toggling: true });
		switch (action.type) {
			case DrawerActionTypes.navigate:
				reactotron.log({ params: action.params });
				navigation.navigate(action.navigateTo, action.params);
				break;
			case DrawerActionTypes.changeBox:
				fetchDocuments(action);
				break;
			case DrawerActionTypes.logout:
				await AsyncStorage.setItem(storeName, "{}");
				userLoggedOut();
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
		if (filterVisible) {
			setFilterVisible(false);
			return true;
		}
		setModalData(defaultModal);
		return true;
	};

	const ref = useRef(null);
	const flatList = useRef(null);

	useEffect(() => {
		if (modalData.visible || filterVisible) {
			ref.current = BackHandler.addEventListener(
				"hardwareBackPress",
				handleBackButton
			);
		} else {
			if (ref.current) ref.current.remove();
		}
	}, [modalData, filterVisible]);

	let toggleFilters = () => {
		setFilterVisible(!filterVisible);
	};

	useEffect(() => {
		fetchDocuments();
		hideModal();
	}, []);

	let applyFilters = async (data: object) => {
		try {
			showModal();
			let normData = normalizeFilters({ ...data, boxType, status });
			console.log("REQUESTING : ", `${url}/document/get/data${normData}`);
			let docs = await requests.documents.filterDocuments(normData);
			setFilters(data);
			toggleFilters();
			documentsLoaded({ data: docs.data.data, status, boxType });
		} catch (error) {
			dispatch({
				type: SET_DANGER_ERROR,
				payload: strings.somethingWentWrong
			});
		}
		hideModal();
		await new Promise(resolve => setTimeout(() => resolve(), 4000));
		hideError();
	};

	let filterFooter = ({ getSubmitData }) => {
		return (
			<View style={styles.footerContainer}>
				<GradientButton
					textColor={colors.white}
					full
					flex
					text={strings.cancel}
					onPress={toggleFilters}
					startColor={colors.gray}
					endColor={colors.gray}
				/>
				<GradientButton
					textColor={colors.white}
					full
					flex
					text={strings.apply}
					onPress={() => applyFilters(getSubmitData())}
					startColor={colors.customPurple}
					endColor={colors.customPurple}
				/>
			</View>
		);
	};

	return (
		<BlurWrapper>
			<View style={{ flex: 1 }}>
				<Header
					title={user.data ? user.data.name : ""}
					toggleDrawer={toggle}
					scroll={!!user.data}
					filter={toggleFilters}
				/>
				<View style={styles.row}>
					<FlatList
						ref={flatList}
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
								{strings.close}
							</Text>
						</View>
					</Modal>
				)}
				{filterVisible && (
					<Modal>
						<View
							style={[
								styles.modalContent,
								{ height: height - 120, overflow: "hidden" }
							]}
						>
							<KeyboardAvoidingView behavior={"position"}>
								<ScrollView
									showsVerticalScrollIndicator={false}
								>
									<Text style={styles.modalTitle}>
										{strings.filter}
									</Text>
									<FieldsRenderer
										footer={filterFooter}
										fields={filterFields}
									/>
								</ScrollView>
							</KeyboardAvoidingView>
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
	},
	footerContainer: {
		flexDirection: "row"
	}
});

const mapStateToProps = ({ documents, user }) => ({
	documents,
	user
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
	return {
		dispatch,
		...bindActionCreators(
			{
				fetchDocuments,
				hideModal,
				showModal,
				hideError,
				userLoggedOut,
				documentsLoaded
			},
			dispatch
		)
	};
};

let ConnectedMain = connect(
	mapStateToProps,
	mapDispatchToProps
)(Main);

export { ConnectedMain as Main };
