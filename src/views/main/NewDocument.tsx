import React, { useEffect, useState } from "react";
import {
	ScrollView,
	StyleSheet,
	TouchableWithoutFeedback,
	View
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { connect } from "react-redux";
import { requests } from "../../api/requests";
import Text from "../../components/common/CustomText";
import GradientButton from "../../components/common/GradientButton";
import RectangularSelect from "../../components/common/RectangularSelect";
import RoundButton from "../../components/common/RoundButton";
import BlurWrapper from "../../components/containers/BlurWrapper";
import FieldsRenderer from "../../components/generators/FieldsRenderer";
import InnerHeader from "../../components/navigation/InnerHeader";
import { colors } from "../../constants";
import { strings } from "../../locales/strings";
import { createDocument } from "../../redux/actions";
import { NavigationProps } from "../../utils/defaultPropTypes";
import { contractFields, contract } from "../../docs/contract";

interface Props {
	createDocument: Function;
	user: any;
}

let docIds = {
	1: {
		fields: contractFields,
		parentName: "contract",
		documentModel: contract
	}
};

const NewDocument: React.FC<Props & NavigationProps> = ({
	navigation,
	createDocument,
	user
}) => {
	const [documentType, setDocumentType] = useState(null);
	const [invoiceType, setInvoiceType] = useState(null);
	const [documentTypes, setDocumentTypes] = useState([]);
	const [invoiceTypes, setInvoiceTypes] = useState([]);
	const [fields, setFields] = useState([]);
	const [products, setProducts] = useState([
		{
			Name: "Beta",
			Count: "68",
			MeasureId: 5,
			Summa: "6",
			DeliverySum: "7",
			VatRate: 7,
			VatSum: "6",
			DeliverySumWithVat: "6",
			OrderNo: 1
		}
	]);
	let effect = async () => {
		try {
			let res = await requests.documents.getDocumentTypes(1);
			setDocumentTypes(
				res.data.map((e, i) => ({
					label: e.typeName || "",
					value: e.type,
					actualValue: e.type
				}))
			);
		} catch (res) {}
	};
	useEffect(() => {
		if (!!documentType)
			setFields(
				(docIds[documentType] && docIds[documentType].fields) || []
			);
	}, [documentType]);
	useEffect(() => {
		effect();
	}, []);

	let footer = ({ getSubmitData }) => {
		let onSubmit = () => {
			let data = getSubmitData();
			let { parentName, documentModel } = docIds[documentType] || {};
			let { buyerTin: buyer } = data;
			let { tin: buyerTin } = buyer;
			// let {}
			console.log({ buyerTin });
			createDocument({
				...data,
				buyerTin,
				buyer,
				documentType,
				seller: user.data,
				products,
				parentName,
				documentModel
			});
		};
		let onCancel = () => {
			navigation.goBack();
		};
		return (
			<View>
				{documentType === 2 && (
					<View style={styles.productsWrapper}>
						<View style={styles.productsContainer}>
							<Text style={styles.inputTitle}>
								{strings.products}
							</Text>
							<Text style={styles.inputTitle}>
								{products.length}
							</Text>
						</View>
						<TouchableWithoutFeedback
							onPress={() => {
								navigation.navigate("Products", {
									products,
									setProducts
								});
							}}
						>
							<View style={styles.button}>
								<Text style={styles.inputTitle}>
									{strings.edit}
								</Text>
								<AntDesign
									name={"edit"}
									size={20}
									color={colors.green}
								/>
							</View>
						</TouchableWithoutFeedback>
					</View>
				)}

				{!!documentType && (
					<View style={styles.row}>
						<View style={{ flex: 1 }}>
							<RoundButton
								full
								flex
								backgroundColor={colors.gray}
								text={strings.cancel}
								onPress={onCancel}
							/>
						</View>
						<View style={{ flex: 1 }}>
							<GradientButton
								textColor={colors.white}
								fill
								flex
								text={strings.send}
								onPress={onSubmit}
							/>
						</View>
					</View>
				)}
			</View>
		);
	};
	return (
		<BlurWrapper>
			<View style={styles.flex}>
				<InnerHeader back={"Main"} title={strings.newTwoSide} />
				<ScrollView
					contentContainerStyle={styles.container}
					showsVerticalScrollIndicator={false}
				>
					<View>
						<Text style={styles.inputTitle}>{strings.type}</Text>
						<RectangularSelect
							value={documentType}
							items={documentTypes}
							onChange={val => {
								setDocumentType(val);
							}}
							placeholder={strings.type}
						/>
					</View>
					<FieldsRenderer fields={fields} footer={footer} />
				</ScrollView>
			</View>
		</BlurWrapper>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.white,
		padding: 15
	},
	flex: { flex: 1 },
	row: {
		flexDirection: "row",
		justifyContent: "space-around"
	},
	inputTitle: {
		fontSize: 16,
		color: colors.gray,
		marginVertical: 10
	},
	productsContainer: {
		padding: 10,
		borderWidth: 1,
		borderRadius: 6,
		borderStyle: "dashed",
		flexDirection: "row",
		justifyContent: "space-between",
		flex: 1,
		borderColor: colors.lightGray,
		marginRight: 10
	},
	productsWrapper: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginVertical: 15
	},
	button: {
		paddingHorizontal: 10,
		borderRadius: 6,
		borderWidth: 1,
		borderColor: colors.lightGray,
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center"
	}
});

const mapStateToProps = ({ user }) => ({
	user
});

const mapDispatchToProps = {
	createDocument
};

let Connected = connect(
	mapStateToProps,
	mapDispatchToProps
)(NewDocument);

export { Connected as NewDocument };

/**
 * 	let initialFields: FieldProps[] = [
		{
			type: FieldType.INPUT,
			title: strings.documentName,
			placeholder: strings.documentName,
			size: FieldSize.FULL,
			name: "other",
			visible: docType === 10
		},
		{
			type: FieldType.AUTOCOMPLETE,
			title: strings.recieverInn,
			placeholder: strings.recieverInn,
			size: FieldSize.FULL,
			name: "buyer",
			fetch: requests.user.getRequisite
		},
		{
			type: FieldType.LINE,
			size: FieldSize.FULL,
			columns: [
				{
					type: FieldType.INPUT,
					title: strings.documentNumber,
					size: FieldSize.QUARTER,
					placeholder: strings.number,
					name: "document.documentNo"
				},
				{
					type: FieldType.DATE_PICKER,
					placeholder: strings.selectDate,
					size: FieldSize.QUERTER_THREE,
					title: strings.selectDate,
					name: "document.documentDate"
				}
			]
		},
		{
			type: FieldType.LINE,
			size: FieldSize.FULL,
			columns: [
				{
					type: FieldType.INPUT,
					title: strings.contractNumber,
					size: FieldSize.QUARTER,
					placeholder: strings.contractNumber,
					name: "contract.contractNumber"
				},
				{
					type: FieldType.DATE_PICKER,
					placeholder: strings.selectDate,
					size: FieldSize.QUERTER_THREE,
					title: strings.contractDate,
					name: "contract.contractDate"
				}
			],
			visible: docType !== 8 && docType !== 1
		},
		{
			type: FieldType.LINE,
			size: FieldSize.FULL,
			columns: [
				{
					type: FieldType.CHECKBOX,
					title: strings.service,
					size: FieldSize.QUARTER,
					placeholder: strings.service,
					name: "service"
				},
				{
					type: FieldType.CHECKBOX,
					title: strings.constructAKT,
					size: FieldSize.QUARTER,
					placeholder: strings.constructAKT,
					name: "constructAKT"
				}
			],
			visible:
				docType === 3 || docType === 4 || docType === 6 || docType === 2
		},
		{
			type: FieldType.LINE,
			size: FieldSize.FULL,
			columns: [
				{
					type: FieldType.INPUT,
					title: strings.empovermentNumber,
					size: FieldSize.QUARTER,
					placeholder: strings.number,
					name: "empovermentNumber"
				},
				{
					type: FieldType.DATE_PICKER,
					placeholder: strings.empovermentDate,
					size: FieldSize.QUERTER_THREE,
					title: strings.selectDate,
					name: "empovermentDate"
				}
			],
			visible: docType === 2
		},
		{
			type: FieldType.CHECKBOX,
			title: strings.hasIndividualPerson,
			placeholder: strings.recieverInn,
			size: FieldSize.FULL,
			name: "hasIndividualPerson",
			visible: false
		},
		{
			type: FieldType.INPUT,
			placeholder: strings.individualTin,
			size: FieldSize.FULL,
			name: "individualPerson.tin",
			visible: false
		},
		{
			type: FieldType.LINE,
			size: FieldSize.FULL,
			columns: [
				{
					type: FieldType.INPUT,
					title: strings.amount,
					size: FieldSize.QUERTER_THREE,
					placeholder: strings.enterAmount,
					name: "sum"
				},
				{
					type: FieldType.SELECT,
					placeholder: strings.uzs,
					size: FieldSize.QUARTER,
					title: strings.currency,
					name: "currencyId",
					staticValue: [
						{ label: "UZS", actualValue: 1, value: 0 },
						{ label: "USD", actualValue: 2, value: 1 },
						{ label: "RUB", actualValue: 3, value: 2 },
						{ label: "EUR", actualValue: 4, value: 3 }
					]
				}
			]
		},
		{
			type: FieldType.INPUT,
			title: strings.productReleased,
			placeholder: strings.productReleased,
			size: FieldSize.FULL,
			name: "productReleased",
			visible: docType === 2
		},
		{
			type: FieldType.INPUT,
			title: strings.comments,
			placeholder: strings.enterComments,
			size: FieldSize.FULL,
			name: "description"
		},
		{
			type: FieldType.FILE,
			placeholder: strings.selectFile,
			size: FieldSize.FULL,
			name: "file",
			visible: docType !== 2
		}
	];
 */
