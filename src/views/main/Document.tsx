import moment from "moment";
import React, { useEffect, useState } from "react";
import {
	Animated,
	Image,
	StyleSheet,
	TouchableWithoutFeedback,
	View
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { withNavigation } from "react-navigation";
import { connect } from "react-redux";
import { requests } from "../../api/requests";
import icon from "../../assets/images/logo_100x100-01.png";
import Text from "../../components/common/CustomText";
import { statuses } from "../../components/navigation/Header";
import { colors, commonStyles } from "../../constants";
import { strings } from "../../locales/strings";
import { NavigationProps } from "../../utils/defaultPropTypes";
import { normalizePrice } from "../../utils/object";

export interface DocumentProps {
	documentId: string;
	documentNumber: string;
	documentSentDate: string;
	documentDate: string;
	buyerName: string;
	sum: string;
	buyerTin: string;
	navigation: NavigationProps;
	buyerTin2: string;
}

const Document: React.FC<DocumentProps> = ({
	navigation,
	boxType,
	status,
	item,
	showDescription,
	notification
}) => {
	let {
		id,
		tin,
		name,
		tin2,
		name2,
		type,
		typeName,
		number,
		date,
		createdDate,
		sum,
		actedDate,
		description,
		currency,
		signed
	} = item;
	let price = normalizePrice(sum ? sum.toString() : sum);
	let newDate = moment(date).format("DD-MM-YYYY");
	let newActedDate = moment(createdDate).format("DD-MM-YYYY");
	let newCreatedDate = moment(createdDate).format("DD-MM-YYYY");
	const [animatedValue, setAnimatedValue] = useState(new Animated.Value(0));
	let startShake = () => {
		Animated.sequence([
			Animated.timing(animatedValue, {
				toValue: 10,
				duration: 100,
				useNativeDriver: true,
				delay: 800
			}),
			Animated.timing(animatedValue, {
				toValue: -10,
				duration: 100,
				useNativeDriver: true
			}),
			Animated.timing(animatedValue, {
				toValue: 10,
				duration: 100,
				useNativeDriver: true
			}),
			Animated.timing(animatedValue, {
				toValue: 0,
				duration: 100,
				useNativeDriver: true
			})
		]).start();
	};
	useEffect(() => {
		if (notification && id.toString() === notification.id) {
			startShake();
		}
	}, [notification]);
	return (
		<Animated.View
			style={[
				commonStyles.shadow,
				styles.container,
				{
					transform: [
						{
							translateX: animatedValue
						}
					]
				}
			]}
		>
			<View style={styles.row}>
				<View>
					<TouchableWithoutFeedback
						onPress={() => {
							navigation.navigate("PdfViewer", {
								docId: id,
								date,
								number,
								tin,
								type,
								signed
							});
						}}
					>
						<Image
							source={icon}
							style={{
								width: 32,
								height: 32,
								marginRight: 10
							}}
						/>
					</TouchableWithoutFeedback>
					<View
						style={{
							position: "absolute",
							left: 40,
							alignSelf: "center",
							flexDirection: "row"
						}}
					>
						{!!description && (
							<TouchableWithoutFeedback
								onPress={() =>
									showDescription({
										visible: true,
										title: strings.comments,
										text: description,
										date,
										number,
										tin
									})
								}
							>
								<SimpleLineIcons
									name={"envelope"}
									color={colors.blue}
									size={24}
									style={{
										alignSelf: "center",
										padding: 5
									}}
								/>
							</TouchableWithoutFeedback>
						)}
						{status === 60 && (
							<TouchableWithoutFeedback
								onPress={async () => {
									try {
										let result = await requests.documents.getReason(
											id
										);
										showDescription({
											visible: true,
											title: strings.rejectReason,
											text: result.data.data,
											date,
											number,
											tin
										});
									} catch (error) {}
								}}
							>
								<Feather
									name={"alert-triangle"}
									color={colors.blue}
									size={24}
									style={{
										alignSelf: "center",
										padding: 5
									}}
								/>
							</TouchableWithoutFeedback>
						)}
						{!!signed && (
							<Feather
								name={"check-circle"}
								color={colors.blue}
								size={24}
								style={{
									alignSelf: "center",
									padding: 5
								}}
							/>
						)}
					</View>
				</View>

				<View
					style={{
						alignItems: "flex-end",
						justifyContent: "center"
					}}
				>
					<Text selectable style={styles.secondaryText}>
						ID {id}
					</Text>
				</View>
			</View>
			<Text
				selectable
				style={[
					styles.secondaryText,
					{ textAlign: "center", fontWeight: "bold" }
				]}
			>{`№${number}`}</Text>
			<Text
				selectable
				style={[styles.secondaryText, { textAlign: "center" }]}
			>
				{typeName}
			</Text>
			<Text
				selectable
				style={[
					styles.secondaryText,
					{ textAlign: "center", fontWeight: "bold" }
				]}
			>
				от {newDate}
			</Text>
			<Text
				selectable
				style={[
					styles.regularText,
					{
						textAlign: "center",
						fontSize: 18,
						paddingVertical: 8,
						fontWeight: "bold"
					}
				]}
			>{`${price} ${currency}`}</Text>
			<Text style={styles.title}>{name}</Text>
			<View>
				<View
					style={[
						styles.row,
						{
							borderBottomWidth: 1,
							borderBottomColor: colors.ultraLightGray
						}
					]}
				>
					<Text selectable style={styles.regularText}>
						{strings.inn}
					</Text>
					<Text selectable style={styles.regularText}>
						{tin}
					</Text>
				</View>
				{tin2 ? (
					<>
						<Text style={styles.title}>{name2}</Text>
						<View
							style={[
								styles.row,
								{
									borderBottomWidth: 1,
									borderBottomColor: colors.ultraLightGray
								}
							]}
						>
							<Text selectable style={styles.regularText}>
								{strings.inn2}
							</Text>
							<Text selectable style={styles.regularText}>
								{tin2}
							</Text>
						</View>
					</>
				) : null}
				<View
					style={[
						styles.row,
						{
							borderBottomWidth: 1,
							borderBottomColor: colors.ultraLightGray
						}
					]}
				>
					<Text selectable style={styles.regularText}>
						{statuses[boxType][status].date}
					</Text>
					<Text selectable style={styles.regularText}>
						{newCreatedDate}
					</Text>
				</View>
				{status !== 10 && (
					<View
						style={[
							styles.row,
							{
								borderBottomWidth: 1,
								borderBottomColor: colors.ultraLightGray
							}
						]}
					>
						<Text selectable style={styles.regularText}>
							{statuses[boxType][status].acted}
						</Text>
						<Text selectable style={styles.regularText}>
							{newActedDate}
						</Text>
					</View>
				)}
			</View>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	container: {
		margin: 10,
		borderRadius: 10,
		padding: 15,
		backgroundColor: colors.white
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingTop: 10,
		paddingBottom: 10
	},
	secondaryText: {
		color: colors.gray,
		fontWeight: "100",
		fontSize: 16
	},
	title: {
		fontWeight: "bold",
		color: colors.blue,
		fontSize: 20
	},
	regularText: {
		fontWeight: "400",
		color: colors.black,
		fontSize: 16
	}
});

const mapStateToProps = ({ documents: { boxType, status, notification } }) => ({
	boxType,
	status,
	notification
});

export default connect(mapStateToProps)(withNavigation(Document));
