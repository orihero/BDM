import React, { useState, useEffect } from "react";
import {
	View,
	FlatList,
	StyleSheet,
	Animated,
	Dimensions,
	TouchableWithoutFeedback
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

// let data: DocumentProps[] = [
//   {
//     id: '#4465',
//     number: '№001',
//     date: '26.11.2019',
//     name: 'OOO The Mind',
//     amount: '150 000 сум',
//     type: 'Электронный',
//     sent: '15.10.2019',
//     signed: 'Да',
//     inn: '45862185',
//   },
//   {
//     id: '#4465',
//     number: '№001',
//     date: '26.11.2019',
//     name: 'OOO The Mind',
//     amount: '150 000 сум',
//     type: 'Электронный',
//     sent: '15.10.2019',
//     signed: 'Да',
//     inn: '45862185',
//   },
//   {
//     id: '#4465',
//     number: '№001',
//     date: '26.11.2019',
//     name: 'OOO The Mind',
//     amount: '150 000 сум',
//     type: 'Электронный',
//     sent: '15.10.2019',
//     signed: 'Да',
//     inn: '45862185',
//   },
// ];
const minW = 60;
const maxW = 300;
let { height } = Dimensions.get("window");

const Main = ({
	navigation,
	fetchDocuments,
	documents: { data, status, boxType },
	hideModal,
	showModal,
	dispatch,
	hideError
}) => {
	const [width, setWidth] = useState(new Animated.Value(minW));
	const [expanded, setExpanded] = useState(false);
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
				console.warn(action);

				fetchDocuments(action);
				break;
			case DrawerActionTypes.logout:
				await AsyncStorage.setItem('@credentials', '{}');
				dispatch(userLoggedOut());
				navigation.navigate(action.navigateTo);
				break;
		}
		Animated.spring(width, { toValue: expanded ? minW : maxW }).start(() =>
			setExpanded(!expanded)
		);
	};

	let newUpload = async () => {
		try {
			showModal(strings.uploadingFile);
			const res = await DocumentPicker.pick({
				type: [DocumentPicker.types.allFiles]
			});
			console.log(
				res.uri,
				res.type, // mime type
				res.name,
				res.size
			);
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

	useEffect(() => {
		// getRegions();
		fetchDocuments();
		hideModal();
	}, []);
	return (
		<BlurWrapper>
			<View style={{ flex: 1 }}>
				<Header title={strings.inbox} toggleDrawer={toggle} />
				<View style={styles.row}>
					<FlatList
						ListEmptyComponent={() => (
							<Text
								style={{ marginTop: 100, textAlign: "center" }}
							>
								{strings.noData}
							</Text>
						)}
						contentContainerStyle={styles.flatContainer}
						data={data}
						showsVerticalScrollIndicator={false}
						keyExtractor={(e, i) => i.toString()}
						renderItem={({ item }) => <Document {...item} />}
					/>
					<Animated.View
						style={{
							width,
							zIndex: 5,
							backgroundColor: colors.white,
							height,
							position: "absolute"
						}}
					>
						<DrawerContent
							navigation={navigation}
							expanded={expanded}
							onPress={toggle}
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
	}
});

const mapStateToProps = ({ documents }) => ({
	documents
});

const mapDispatchToProps = {
	fetchDocuments,
	hideModal,
	showModal,
	hideError
};

let ConnectedMain = connect(mapStateToProps, mapDispatchToProps)(Main);

export { ConnectedMain as Main };
