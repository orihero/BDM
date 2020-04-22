import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import { requests } from "../../api/requests";
import GradientButton from "../../components/common/GradientButton";
import RoundButton from "../../components/common/RoundButton";
import FieldsRenderer from "../../components/generators/FieldsRenderer";
import { colors } from "../../constants";
import { strings } from "../../locales/strings";
import { FieldProps, FieldSize, FieldType } from "../auth";

const Profile = ({ navigation, user }) => {
	let visible = user.data.legalUser && user.data.legalUser;
	console.warn(user);

	console.warn("user");
	//find iin
	let fields: FieldProps[] = [
		{
			type: FieldType.INPUT,
			size: FieldSize.FULL,
			title: strings.inn,
			placeholder: strings.inn,
			disabled: true,
			name: "tin"
		},
		{
			type: FieldType.INPUT,
			size: FieldSize.FULL,
			title: strings.legalName,
			placeholder: strings.legalName,
			disabled: true,
			name: "name"
		},
		{
			name: "regionId",
			type: FieldType.SELECT,
			placeholder: strings.region,
			title: strings.region,
			size: FieldSize.FULL,
			fetch: requests.helper.getRegions,
			map: (e, index) => ({
				value: index,
				label: e.name,
				actualValue: e.id
			})
		},
		{
			name: "districtId",
			type: FieldType.SELECT,
			placeholder: strings.town,
			title: strings.town,
			size: FieldSize.FULL,
			fetch: requests.helper.getDistricts,
			map: (e, index) => ({
				value: index,
				label: e.name,
				actualValue: e.id
			}),
			fetchParamFromStateName: "regionId"
		},
		{
			type: FieldType.INPUT,
			placeholder: strings.street,
			title: strings.street,
			size: FieldSize.FULL,
			name: "addressStreet"
		},
		{
			type: FieldType.INPUT,
			placeholder: strings.number,
			title: strings.number,
			size: FieldSize.FULL,
			name: "addressHomeNumber"
		},
		// {
		// 	type: FieldType.COMPLEX,
		// 	size: FieldSize.FULL,
		// 	title: strings.address,
		// 	rows: [
		// 		[
		// 			{
		// 				name: "regionId",
		// 				type: FieldType.SELECT,
		// 				placeholder: strings.region,
		// 				size: FieldSize.HALF,
		// 				fetch: requests.helper.getRegions,
		// 				map: (e, index) => ({
		// 					value: index,
		// 					label: e.name,
		// 					actualValue: e.id
		// 				})
		// 			},
		// 			{
		// 				name: "districtId",
		// 				type: FieldType.SELECT,
		// 				placeholder: strings.town,
		// 				size: FieldSize.HALF,
		// 				fetch: requests.helper.getDistricts,
		// 				map: (e, index) => ({
		// 					value: index,
		// 					label: e.name,
		// 					actualValue: e.id
		// 				}),
		// 				fetchParamFromStateName: "regionId"
		// 			}
		// 		],
		// 		[
		// 			{
		// 				type: FieldType.INPUT,
		// 				placeholder: strings.street,
		// 				size: FieldSize.HALF,
		// 				name: "addressStreet"
		// 			},
		// 			{
		// 				type: FieldType.INPUT,
		// 				placeholder: strings.number,
		// 				size: FieldSize.HALF,
		// 				name: "addressHomeNumber"
		// 			}
		// 		]
		// 	]
		// },
		{
			type: FieldType.INPUT,
			placeholder: strings.okedCode,
			size: FieldSize.FULL,
			title: strings.okedCode,
			name: "okedId",
			visible
		},
		{
			type: FieldType.INPUT,
			placeholder: strings.director,
			size: FieldSize.FULL,
			title: strings.director,
			name: "mainDirector",
			visible
		},
		{
			type: FieldType.INPUT,
			placeholder: strings.accauntant,
			size: FieldSize.FULL,
			title: strings.accauntant,
			name: "mainAccountant",
			visible
		},
		{
			type: FieldType.LINE,
			columns: [
				{
					size: FieldSize.QUARTER,
					type: FieldType.SELECT,
					placeholder: "Да",
					staticValue: [
						{ label: "Да", value: 0, actualValue: true },
						{ label: "Нет", value: 1, actualValue: false }
					],
					name: "hasVatPayer"
				},
				{
					type: FieldType.INPUT,
					placeholder: "Рег.номер",
					size: FieldSize.QUERTER_THREE,
					name: "vatPayerCode"
				}
			],
			title: strings.nds,
			visible
		},
		// {
		// 	type: FieldType.INPUT,
		// 	placeholder: strings.bankAccount,
		// 	size: FieldSize.FULL,
		// 	title: strings.bankAccount,
		// 	name: "bankAccountNumber",
		// 	visible
		// },
		{
			type: FieldType.LINE,
			columns: [
				{
					size: FieldSize.QUARTER,
					type: FieldType.INPUT,
					placeholder: strings.mfo,
					name: "bankCode"
				},
				{
					type: FieldType.INPUT,
					placeholder: strings.lightAccount,
					size: FieldSize.QUERTER_THREE,
					name: "bankAccountNumber"
				}
			],
			title: strings.bankAccount,
			visible
		},
		{
			type: FieldType.LINE,
			columns: [
				{
					size: FieldSize.QUARTER,
					type: FieldType.INPUT,
					placeholder: strings.code,
					name: "phoneCode"
				},
				{
					type: FieldType.INPUT,
					placeholder: strings.phoneNumber,
					size: FieldSize.QUERTER_THREE,
					name: "phoneNumber"
				}
			],
			title: strings.phone
		},
		{
			type: FieldType.INPUT,
			placeholder: "Ваш email",
			size: FieldSize.FULL,
			title: strings.email,
			name: "email"
		}
		// {
		// 	type: FieldType.CHECKBOX,
		// 	title: `  ${strings.accept}`
		// }
	];
	let footer = ({ getSubmitData }) => {
		let save = async () => {
			let {
				phoneCode,
				phoneNumber,
				email,
				districtId,
				regionId,
				addressStreet,
				addressHomeNumber,
				vatPayerCode,
				accountNumber,
				hasVatPayer,
				bankCode,
				bankAccountNumber,
				okedId,
				mainDirector,
				mainAccountant
			} = getSubmitData();
			let data = {
				phoneCode,
				phoneNumber,
				email,
				districtId,
				regionId,
				addressStreet,
				addressHomeNumber,
				vatPayerCode,
				accountNumber,
				hasVatPayer,
				bankCode,
				bankAccountNumber,
				okedId,
				mainDirector,
				mainAccountant
			};
			try {
				let res = await requests.user.update(data);
				console.warn(res);
			} catch (error) {
				console.warn(error.response);
			}
		};
		let cancel = () => {
			navigation.navigate("Main");
		};
		return (
			<View style={styles.row}>
				<View style={{ flex: 1 }}>
					<GradientButton
						textColor={colors.white}
						full
						flex
						text={strings.save}
						onPress={save}
					/>
				</View>
			</View>
		);
	};
	return (
		<View>
			<ScrollView
				contentContainerStyle={styles.container}
				showsVerticalScrollIndicator={false}
			>
				<FieldsRenderer
					initialValue={user.data}
					fields={fields}
					footer={footer}
				/>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	title: {
		fontSize: 26,
		fontWeight: "bold",
		marginBottom: 15
	},
	container: {
		padding: 15
	},
	inputTitle: {
		fontSize: 16,
		color: colors.gray,
		marginVertical: 10
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-evenly"
	},
	half: {
		flex: 1,
		paddingRight: 5,
		marginBottom: 7.5
	},
	quarter: {
		flex: 0.25,
		paddingRight: 5,
		marginBottom: 7.5
	},
	quarterThree: {
		flex: 0.75,
		paddingRight: 5,
		marginBottom: 7.5
	}
});

const mapStateToProps = ({ user }) => ({
	user
});

const mapDispatchToProps = {};

let Connected = connect(
	mapStateToProps,
	mapDispatchToProps
)(Profile);

export { Connected as Profile };
