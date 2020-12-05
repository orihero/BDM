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
import {
	actContent,
	invoiceStOrUnOrComFields as actFields
} from "../../docs/actContent";
import {
	triterialContractFields,
	trilateralContractOrRentConModel
} from "../../docs/trilateralContractOrRentCon";
import { invoiceExcise, invoiceExciseFields } from "../../docs/invoiceExcise";
import { baseDocument, baseDocumentFields } from "../../docs/baseDocument";
import {
	comissionerReport,
	comissionerReportFields
} from "../../docs/comissionerReport";
import { contract, contractFields } from "../../docs/contract";
import { empowermentFields, empowermentModel } from "../../docs/empowerment";
import {
	invoiceStOrUnOrCom,
	invoiceStOrUnOrComFields
} from "../../docs/invoiceStOrUnOrCom";
import { latterModel, latterFields } from "../../docs/latter";
import { otherFields, otherModel } from "../../docs/other";
import { strings } from "../../locales/strings";
import { createDocument, showModal } from "../../redux/actions";
import reactotron from "../../redux/reactotron-config";
import { NavigationProps } from "../../utils/defaultPropTypes";
import { getObjectProperty } from "../../utils/object";
import {
	actReconciliationFields,
	actReconciliationModel
} from "../../docs/actReconciliation";

interface Props {
	createDocument: Function;
	user: any;
}

let twoSideDocIds = {
	10: {
		fields: otherFields,
		parentName: "other",
		documentModel: otherModel,
		documentNumberProperty: "document.documentNo",
		documentDateProperty: "document.documentDate"
	},
	5: {
		fields: actReconciliationFields,
		parentName: "actReconciliation",
		documentModel: actReconciliationModel,
		documentNumberProperty: "document.documentNo",
		documentDateProperty: "document.documentDate"
	},
	25: {
		fields: baseDocumentFields,
		parentName: "baseDocument",
		documentModel: baseDocument,
		documentNumberProperty: "document.documentNo",
		documentDateProperty: "document.documentDate"
	},
	4: {
		fields: baseDocumentFields,
		parentName: "baseDocument",
		documentModel: baseDocument,
		documentNumberProperty: "document.documentNo",
		documentDateProperty: "document.documentDate"
	},
	7: {
		fields: comissionerReportFields,
		parentName: "comissionerReport",
		documentModel: comissionerReport,
		documentNumberProperty: "contract.contractNo",
		documentDateProperty: "contract.contractDate"
	},
	3: {
		fields: baseDocumentFields,
		parentName: "baseDocument",
		documentModel: baseDocument,
		documentNumberProperty: "document.documentNo",
		documentDateProperty: "document.documentDate"
	},
	11: {
		fields: baseDocumentFields,
		parentName: "baseDocument",
		documentModel: baseDocument,
		documentNumberProperty: "document.documentNo",
		documentDateProperty: "document.documentDate"
	},
	6: {
		fields: empowermentFields,
		parentName: "empowerment",
		documentModel: empowermentModel,
		documentNumberProperty: "document.documentNo",
		documentDateProperty: "document.documentDate"
	},
	29: {
		fields: actFields,
		parentName: "actTax",
		middleName: "actContent",
		documentModel: actContent,
		documentNumberProperty: "ActDoc.ActNo",
		documentDateProperty: "ActDoc.ActDate",
		facturaIdName: "ActId",
		productIdName: "ActProductId"
	},
	22: {
		fields: comissionerReportFields,
		parentName: "invoiceStOrUnOrCom",
		middleName: "invoicecContent",
		documentModel: comissionerReport,
		documentNumberProperty: "ActDoc.ActNo",
		documentDateProperty: "ActDoc.ActDate",
		facturaIdName: "ActId",
		productIdName: "ActProductId"
	},
	1: {
		fields: contractFields,
		parentName: "contract",
		documentModel: contract,
		documentNumberProperty: "document.documentNo",
		documentDateProperty: "document.documentDate"
	},
	8: {
		fields: latterFields,
		parentName: "latter",
		documentModel: latterModel,
		documentNumberProperty: "document.documentNo",
		documentDateProperty: "document.documentDate"
	},
	2: {
		fields: invoiceStOrUnOrComFields,
		parentName: "invoiceStandard",
		middleName: "invoiceContent",
		documentModel: invoiceStOrUnOrCom,
		documentNumberProperty: "FacturaDoc.FacturaNo",
		documentDateProperty: "FacturaDoc.FacturaDate",
		facturaIdName: "FacturaId",
		productIdName: "FacturaProductId"
	},
	13: {
		fields: invoiceExciseFields,
		parentName: "invoiceExcise",
		middleName: "invoiceExciseContent",
		documentModel: invoiceExcise,
		documentNumberProperty: "FacturaDoc.FacturaNo",
		documentDateProperty: "FacturaDoc.FacturaDate",
		facturaIdName: "FacturaId",
		productIdName: "FacturaProductId"
	}
};

let threeSideDocIds = {
	1: {
		fields: triterialContractFields,
		parentName: "contract",
		documentModel: trilateralContractOrRentConModel,
		documentNumberProperty: "document.documentNo",
		documentDateProperty: "document.documentDate"
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
	let productList = navigation.getParam("productList");
	let isTriterial = navigation.getParam("triterial");
	let docIds = isTriterial ? threeSideDocIds : twoSideDocIds;
	const [products, setProducts] = useState(productList || {});
	useEffect(() => {
		console.log({ productList });

		setProducts(productList || {});
	}, [productList]);
	let effect = async () => {
		reactotron.log({ isTriterial });
		if (isTriterial) {
			let res = await requests.documents.getDocumentTypes(3);
			let temp = res.data.reduce((prev, e) => {
				if (e.type === 34) {
					return prev;
				}
				return [
					...prev,
					{
						label: e.typeName || "",
						value: e.type,
						actualValue: e.type
					}
				];
			}, []);
			setDocumentTypes(temp);
			return;
		}
		try {
			let res = await requests.documents.getDocumentTypes(1);
			let temp = res.data.reduce((prev, e) => {
				if (e.type === 34) {
					return prev;
				}
				return [
					...prev,
					{
						label: e.typeName || "",
						value: e.type,
						actualValue: e.type
					}
				];
			}, []);
			setDocumentTypes(temp);
		} catch (res) {
			console.error(res);
		}
		try {
			let res = await requests.documents.getDocumentTypes(2);
			setInvoiceTypes(
				res.data.map((e, i) => ({
					label: e.typeName || "",
					value: e.type,
					actualValue: e.type
				}))
			);
		} catch (res) {}
	};
	useEffect(() => {
		reactotron.log({ products });
	}, [products]);
	useEffect(() => {
		let hasProduct =
			docIds[documentType] &&
			docIds[documentType].parentName &&
			getObjectProperty(
				docIds,
				`${documentType}.documentModel.${
					docIds[documentType].parentName
				}.${docIds[documentType].middleName}.ProductList`
			);
		setProducts(productList || hasProduct || {});
		if (documentType === 2) {
			setFields(
				(docIds[invoiceType] && docIds[invoiceType].fields) || []
			);

			return;
		} else {
			setInvoiceType(null);
		}
		console.log({ documentType });
		if (documentType !== null && documentType !== undefined)
			setFields(
				(docIds[documentType] && docIds[documentType].fields) || []
			);
	}, [documentType, invoiceType]);
	useEffect(() => {
		effect();
	}, []);

	let isInvoice = documentType === 2;

	let footer = ({ getSubmitData }) => {
		let onSubmit = () => {
			showModal(strings.loading);
			let data = getSubmitData();
			let {
				parentName,
				documentModel,
				middleName,
				documentNumberProperty,
				documentDateProperty,
				facturaIdName,
				productIdName
			} = docIds[invoiceType || documentType] || {};
			reactotron.log({ data });

			let { buyerTin: buyer } = data;
			if (!buyer) {
				buyer = data.BuyerTin;
			}
			let { tin: buyerTin } = buyer;
			// let {}
			createDocument({
				data,
				buyerTin,
				buyer,
				documentType,
				seller: user.data,
				products,
				parentName,
				middleName,
				documentModel,
				invoiceType,
				documentNumberProperty,
				documentDateProperty,
				facturaIdName,
				productIdName
			});
		};
		let onCancel = () => {
			navigation.goBack();
		};

		let hasProduct =
			docIds[documentType] &&
			docIds[documentType].parentName &&
			getObjectProperty(
				docIds,
				`${documentType}.documentModel.${
					docIds[documentType].parentName
				}.${docIds[documentType].middleName}.ProductList`
			);
		console.log({ hasProduct });
		return (
			<View>
				{!!hasProduct && (
					<View style={styles.productsWrapper}>
						<View style={styles.productsContainer}>
							<Text style={styles.inputTitle}>
								{strings.products}
							</Text>
							<Text style={styles.inputTitle}>
								{!!products.Products &&
									products.Products.length}
							</Text>
						</View>
						<TouchableWithoutFeedback
							onPress={() => {
								navigation.navigate("Products", {
									initalProducts: products,
									setProducts,
									model: hasProduct.Products[0]
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
				<InnerHeader
					back={"Main"}
					title={
						isTriterial ? strings.newThreeSide : strings.newTwoSide
					}
				/>
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
					{isInvoice && (
						<View>
							<Text style={styles.inputTitle}>
								{strings.invoiceType}
							</Text>
							<RectangularSelect
								value={invoiceType}
								items={invoiceTypes}
								onChange={val => {
									setInvoiceType(val);
								}}
								placeholder={strings.invoiceType}
							/>
						</View>
					)}
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
