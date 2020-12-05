import React, { useEffect, useState } from "react";
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import reactotron from "reactotron-react-native";
import { requests } from "../../api/requests";
import DefaultCheckbox from "../../components/common/DefaultCheckbox";
import RectangleButton from "../../components/common/GradientButton";
import RectangularInput from "../../components/common/RectangularInput";
import RectangularSelect from "../../components/common/RectangularSelect";
import { colors } from "../../constants";
import { strings } from "../../locales/strings";

let multiply = (first: number, second: number) => first * second;
let percent = (first: number, second: number) => first * (second / 100);

let add = (first: number, second: number) => first + second;

let calculatedFields = {
	DeliverySum: {
		firstField: "Count",
		secondField: "Summa",
		calculator: multiply
	},
	TotalSum: {
		firstField: "Count",
		secondField: "Summa",
		calculator: multiply
	},
	VatSum: {
		firstField: "VatRate",
		secondField: "DeliverySum",
		calculator: percent
	},
	DeliverySumWithVat: {
		firstField: "VatSum",
		secondField: "DeliverySum",
		calculator: add
	}
};

let reflectiveFields = {
	Count: {
		results: ["DeliverySum", "DeliverySumWithVat"],
		secondField: "Summa",
		calculator: multiply
	},
	Summa: {
		results: ["DeliverySum", "DeliverySumWithVat", "TotalSum"],
		secondField: "Count",
		calculator: multiply
	},
	VatRate: {
		results: ["VatSum", "DeliverySumWithVat"],
		secondField: "Count",
		calculator: multiply
	}
};

const ProductsList = ({ navigation }) => {
	let model = navigation.getParam("model");
	let initialProducts = navigation.getParam("initalProducts") || {};
	//TODO optimize by removing in focus and use onBlur only
	let defaultTemp = {
		index: -1,
		key: "",
		value: ""
	};
	const [products, setProducts] = useState([
		...(initialProducts.Products || [])
	]);
	const [tempValue, setTempValue] = useState(defaultTemp);
	const [list, setList] = useState([]);
	const [withoutVat, setWithoutVat] = useState(false);
	useEffect(() => {
		requests.helper.getMeasures().then(res => {
			setList(
				res.data.map(e => ({
					label: e.name,
					value: e.id
				}))
			);
		});
	}, []);
	let renderProduct = (productModel, index) => {
		return (
			<View style={styles.productContainer}>
				{Object.keys(productModel).map((key: string) => {
					let type = typeof model[key];
					if (key.toLowerCase().indexOf("ordno") !== -1) {
						return (
							<Text style={styles.title}>
								{strings.product} № {index + 1}
							</Text>
						);
					}
					let isAutCalculated = !!calculatedFields[key];

					if (isAutCalculated) {
						return (
							<RectangularInput
								placeholder={strings[key] || key}
								containerStyle={{
									marginVertical: 5
								}}
								value={productModel[key]}
								editable={false}
							/>
						);
					}
					switch (type) {
						case "boolean":
							if (!withoutVat) return null;
							return (
								<DefaultCheckbox
									style={{
										margin: 10,
										marginHorizontal: 0
									}}
									title={strings[key] || key}
									isActive={!!productModel[key]}
									toggle={val =>
										setProducts(
											products.filter((e, i) => {
												if (i === index) {
													e[key] = val;
												}
												return e;
											})
										)
									}
								/>
							);
						case "string":
						case "number": {
							if (key.toLowerCase().endsWith("id")) {
								return (
									<RectangularSelect
										placeholder={strings.measure}
										value={productModel[key]}
										items={list}
										onChange={val =>
											setProducts(
												products.filter((e, i) => {
													if (i === index) {
														e[key] = val;
													}
													return e;
												})
											)
										}
										style={{
											marginHorizontal: 15
										}}
									/>
								);
							}
						}
						default:
							return (
								<RectangularInput
									placeholder={strings[key] || key}
									containerStyle={{
										marginVertical: 5
									}}
									onFocus={() => {
										setTempValue({
											index,
											key,
											value: products[index][key]
										});
									}}
									value={
										tempValue.key === key &&
										index === tempValue.index
											? tempValue.value
											: productModel[key]
									}
									onChange={value =>
										setTempValue({
											...tempValue,
											value
										})
									}
									onBlur={() => {
										setTempValue(defaultTemp);
										let tempProducts = products.filter(
											(temp, i) => {
												if (i === tempValue.index) {
													temp[key] = tempValue.value;
													let reflectiveField =
														reflectiveFields[key];

													if (!!reflectiveField) {
														reflectiveField.results.forEach(
															field => {
																reactotron.log({
																	field,
																	val:
																		model[
																			field
																		]
																});

																if (
																	model[
																		field
																	] ===
																	undefined
																) {
																	return;
																}
																let calculatedField =
																	calculatedFields[
																		field
																	];

																let result =
																	calculatedField.calculator(
																		parseFloat(
																			temp[
																				calculatedField
																					.firstField
																			]
																		),
																		parseFloat(
																			temp[
																				calculatedField
																					.secondField
																			]
																		)
																	) || "";
																temp[
																	field
																] = result.toString();
																console.log({
																	temp: temp,
																	result,
																	field,
																	firstField:
																		temp[
																			calculatedField
																				.firstField
																		],
																	calculatedField
																});
															}
														);
													}
												}
												return temp;
											}
										);
										setProducts(tempProducts);
									}}
								/>
							);
					}
				})}
				<TouchableOpacity
					onPress={() =>
						setProducts(products.filter((e, i) => index !== i))
					}
				>
					<Ionicons
						name="ios-trash"
						size={26}
						style={{
							padding: 15,
							borderRadius: 40,
							backgroundColor: colors.ultraLightGray,
							paddingHorizontal: 20,
							marginHorizontal: 10,
							alignSelf: "flex-end"
						}}
						color={colors.red}
					/>
				</TouchableOpacity>
			</View>
		);
	};

	let addProduct = () => {
		console.log("ADDING MODEL ", { model });

		setProducts([...products, { ...model, OrdNo: products.length + 1 }]);
	};

	let onComplete = () => {
		let formedProducts = Object.keys(initialProducts).reduce(
			(prev, current) => {
				if (current.toLowerCase() === "hasvat") {
					return { ...prev, [current]: !withoutVat };
				}
				if (current.toLowerCase() === "products") {
					let totalSumForPdf = 0;
					products.forEach(e => {
						totalSumForPdf = parseFloat(e.TotalSum);
					});
					return { ...prev, [current]: products, totalSumForPdf };
				}
				return { ...prev, [current]: initialProducts[current] };
			},
			{}
		);

		navigation.navigate("NewDocument", {
			productList: formedProducts
		});
	};
	let onCancel = () => {
		navigation.navigate("NewDocument");
	};
	reactotron.log({ initalProducts: initialProducts });
	return (
		<View>
			<ScrollView>
				<View style={styles.container}>
					{initialProducts.HasVat !== undefined &&
						initialProducts.HasVat !== null && (
							<DefaultCheckbox
								style={{ margin: 10, marginHorizontal: 0 }}
								title={strings.withoutVat}
								isActive={withoutVat}
								setActive={val => {
									setWithoutVat(!withoutVat);
								}}
							/>
						)}
					{products.map(renderProduct)}
					<View style={styles.row}>
						<RectangleButton
							backgroundColor={colors.white}
							text={strings.cancel}
							startColor={colors.gray}
							endColor={colors.gray}
							onPress={onCancel}
							style={{
								marginTop: 20,
								marginHorizontal: 20
							}}
							flex
							full
						/>
						<RectangleButton
							backgroundColor={colors.white}
							text={strings.save}
							onPress={onComplete}
							style={{
								marginTop: 20,
								// paddingVertical: 25,
								marginHorizontal: 20
							}}
							flex
							full
						/>
					</View>
				</View>
			</ScrollView>
			<View style={styles.roundButtonContainer}>
				<TouchableWithoutFeedback onPress={addProduct}>
					<View style={styles.roundButton}>
						<Feather name="plus" size={36} color={colors.white} />
					</View>
				</TouchableWithoutFeedback>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 15,
		backgroundColor: colors.white,
		paddingBottom: 80
	},
	productContainer: {
		backgroundColor: colors.white,
		elevation: 4,
		marginVertical: 10,
		paddingBottom: 15,
		padding: 15
	},
	title: {
		fontSize: 18
	},
	roundButtonContainer: {
		position: "absolute",
		bottom: 15,
		right: 15
	},
	roundButton: {
		width: 60,
		height: 60,
		backgroundColor: colors.inkBlue,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 60
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between"
	}
});

export default ProductsList;
