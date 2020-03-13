import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, Animated, Dimensions } from "react-native";
import Document, { DocumentProps } from "./Document";
import DrawerContent, {
	DrawerActionTypes
} from "../../components/navigation/DrawerContent";
import { colors } from "../../constants";
import Header from "../../components/navigation/Header";
import { strings } from "../../locales/strings";
import { connect } from "react-redux";
import { fetchDocuments, getRegions, hideModal } from "../../redux/actions";
import BlurWrapper from "../../components/containers/BlurWrapper";
import { DrawerAction } from "../../components/navigation/DrawerContent";

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
	documents: { data },
	hideModal
}) => {
	const [width, setWidth] = useState(new Animated.Value(minW));
	const [expanded, setExpanded] = useState(false);
	let toggle = (action: DrawerAction) => {
		switch (action.type) {
			case DrawerActionTypes.navigate:
				navigation.navigate(action.navigateTo);
				break;
			case DrawerActionTypes.changeBox:
				console.warn(action);

				fetchDocuments(action);
				break;
		}
		Animated.spring(width, { toValue: expanded ? minW : maxW }).start(() =>
			setExpanded(!expanded)
		);
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
			</View>
		</BlurWrapper>
	);
};

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		flex: 1
	},
	flatContainer: { paddingBottom: 30, marginLeft: minW }
});

const mapStateToProps = ({ documents }) => ({
	documents
});

const mapDispatchToProps = {
	fetchDocuments,
	hideModal
};

let ConnectedMain = connect(mapStateToProps, mapDispatchToProps)(Main);

export { ConnectedMain as Main };
