import React, { Fragment, useReducer, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { FieldType, FieldSize, FieldProps } from "../../views";
import DefaultCheckbox from "../common/DefaultCheckbox";
import RectangularSelect from "../common/RectangularSelect";
import RectangularInput from "../common/RectangularInput";
import { colors, Icons } from "../../constants";
import { strings } from "../../locales/strings";
import AntDesign from "react-native-vector-icons/AntDesign";
import DocumentPicker from "react-native-document-picker";
import { reducer, SET } from "../../utils/state";
import RectangularDatePicker from "../common/RectangularDatePicker";
import Autocomplete from "react-native-autocomplete-input";

interface FieldRendererProps {
	fields: FieldProps[];
	footer?: any;
	initialValue?: any;
	setData?: Function;
}

export interface Validation {
	integer?: boolean;
	float?: boolean;
}

const FieldsRenderer = ({
	fields,
	footer: Footer,
	initialValue,
	setData
}: FieldRendererProps) => {
	const [state, dispatch] = useReducer(reducer, initialValue || {});
	const [validations, setValidations] = useState(() => {
		let temp = fields.reduce(
			(prev, current) => ({
				...prev,
				[current.name]: current.validation
			}),
			{}
		);
		return temp;
	});
	let initialItems = () =>
		fields.reduce((prev, current) => {
			if (
				current.type === FieldType.SELECT ||
				current.type === FieldType.AUTOCOMPLETE
			) {
				return {
					...prev,
					[current.name]:
						{ ...current, data: current.staticValue } || current
				};
			}
			return prev;
		}, {});

	const [items, dispatchItems] = useReducer(reducer, {}, initialItems);
	let fetchItems = () => {
		Object.keys(items).map(key => {
			if (typeof items[key].fetch === "function") {
				let param =
					items[key].fetchParamFromStateName &&
					items[items[key].fetchParamFromStateName].data &&
					items[items[key].fetchParamFromStateName].data[
						state[items[key].fetchParamFromStateName]
					]
						? items[items[key].fetchParamFromStateName].data[
								state[items[key].fetchParamFromStateName]
						  ].actualValue
						: null;
				if (items[key].fetchParamFromStateName && !param) {
					//* It means first render
					param = state[items[key].fetchParamFromStateName];
					if (!param) return;
				}
				items[key]
					.fetch(param)
					.then(res => {
						dispatchItems({
							type: SET,
							name: key,
							value: {
								...items[key],
								data: res.data.map(items[key].map)
							}
						});
					})
					.catch(err => {
						console.warn(err.response);
					});
			}
		});
	};
	useEffect(() => {
		fetchItems();
		//TODO Imrpove or change
		// if (setData && typeof setData === 'function') {
		//     setData(getSubmitData())
		// }
		// console./ warn(getSubmitData());
	}, [state]);
	let pickFile = async (e: FieldProps) => {
		try {
			const res = await DocumentPicker.pick({
				type: [DocumentPicker.types.allFiles]
			});
			console.log(
				res.uri,
				res.type, // mime type
				res.name,
				res.size
			);
			updateState(e.name, res);
		} catch (err) {
			if (DocumentPicker.isCancel(err)) {
				// User cancelled the picker, exit any dialogs or menus and move on
			} else {
				throw err;
			}
		}
	};
	let updateState = (name, value) => {
		dispatch({ type: SET, name, value });
	};

	let getSubmitData = () => {
		let normalState = { ...state };
		Object.keys(normalState).forEach((key, i) => {
			//* Check if item is select
			if (items[key] && items[key].data) {
				normalState[key] =
					items[key].data[normalState[key]].actualValue;
			}
			//* Check if item should be an object
			if (key.indexOf(".") !== -1) {
				let parts = key.split(".");
				let obj = normalState[parts[0]] || {};
				normalState[parts[0]] = {
					...obj,
					[parts[1]]: normalState[key]
				};
				delete normalState[key];
			}
			if (
				items[key] &&
				items[key].visible &&
				items[key].type !== FieldType.AUTOCOMPLETE
			) {
				delete normalState[key];
			}
			//* Parse to corresponding dataType
			console.warn(validations[key]);

			if (validations[key]?.float) {
				normalState[key] = parseFloat(normalState[key]);
			}
			//TODO Validation
		});
		return normalState;
	};

	let renderFields = (fields: FieldProps[]) => {
		return fields.map(e => {
			if (e.visible === false) return null;
			switch (e.type) {
				case FieldType.AUTOCOMPLETE: {
					let filterData = async text => {
						if (state[e.name]) {
							dispatch({ type: SET, name: e.name, value: "" });
							return;
						}
						let res = await e.fetch(text);
						dispatchItems({
							type: SET,
							name: e.name,
							value: res.data
						});
					};
					let autocompleteItem = ({ item }) => {
						return (
							<TouchableWithoutFeedback
								onPress={() => {
									dispatch({
										type: SET,
										name: e.name,
										value: item
									});
									dispatchItems({
										type: SET,
										name: e.name,
										value: []
									});
								}}
							>
								<Text
									style={{
										paddingVertical: 5,
										marginVertical: 5,
										borderRadius: 6,
										backgroundColor: colors.white,
										paddingHorizontal: 5
									}}
								>
									{item.tin} {item.name}
								</Text>
							</TouchableWithoutFeedback>
						);
					};
					return (
						<View>
							<Text style={styles.inputTitle}>{e.title}</Text>
							<Autocomplete
								placeholder={e.placeholder}
								listContainerStyle={{
									borderWidth: 0,
									backgroundColor: colors.ultraLightGray
								}}
								listStyle={{
									borderWidth: 0,
									backgroundColor: colors.ultraLightGray
								}}
								containerStyle={{
									borderWidth: 0,
									padding: 8,
									backgroundColor: colors.ultraLightGray,
									borderRadius: 6
								}}
								style={{
									backgroundColor: colors.ultraLightGray
								}}
								inputContainerStyle={{ borderWidth: 0 }}
								data={items[e.name]}
								value={
									state[e.name]
										? state[e.name].tin +
										  " - " +
										  state[e.name].name
										: null
								}
								renderItem={autocompleteItem}
								onChangeText={filterData}
							/>
						</View>
					);
				}
				case FieldType.CHECKBOX:
					return (
						<View style={{ marginVertical: 15, ...styles[e.size] }}>
							<DefaultCheckbox
								size={14}
								numberOfLines={1}
								isActive={state[e.name]}
								setActive={() =>
									updateState(e.name, !state[e.name])
								}
								title={e.title}
							/>
						</View>
					);
				case FieldType.SELECT:
					if (!items[e.name]) {
						dispatchItems({
							type: SET,
							name: e.name,
							value: { ...e, data: e.staticValue } || e
						});
					}
					if (e.size === FieldSize.FULL) {
						return (
							<View>
								<Text style={styles.inputTitle}>{e.title}</Text>
								<RectangularSelect
									disabled={e.disabled}
									value={state[e.name]}
									items={
										items[e.name] ? items[e.name].data : []
									}
									onChange={val => {
										updateState(e.name, val);
									}}
									placeholder={e.placeholder}
								/>
							</View>
						);
					}
					return (
						<View style={styles[e.size]}>
							{e.title && (
								<Text
									numberOfLines={1}
									style={styles.inputTitle}
								>
									{e.title}
								</Text>
							)}
							<RectangularSelect
								disabled={e.disabled}
								value={state[e.name]}
								items={items[e.name] ? items[e.name].data : []}
								onChange={val => {
									updateState(e.name, val);
								}}
								placeholder={e.placeholder}
							/>
						</View>
					);
				case FieldType.DATE_PICKER:
					if (e.size === FieldSize.FULL) {
						return (
							<View>
								<Text style={styles.inputTitle}>{e.title}</Text>
								<RectangularDatePicker
									disabled={e.disabled}
									value={state[e.name]}
									onChange={val => updateState(e.name, val)}
									placeholder={e.placeholder}
								/>
							</View>
						);
					}
					return (
						<View style={styles[e.size]}>
							{e.title && (
								<Text
									numberOfLines={1}
									style={styles.inputTitle}
								>
									{e.title}
								</Text>
							)}
							<RectangularDatePicker
								disabled={e.disabled}
								value={state[e.name]}
								onChange={val => updateState(e.name, val)}
								placeholder={e.placeholder}
							/>
						</View>
					);
				case FieldType.INPUT:
					if (e.size === FieldSize.FULL) {
						return (
							<View>
								{e.title && (
									<Text style={styles.inputTitle}>
										{e.title}
									</Text>
								)}
								<RectangularInput
									disabled={e.disabled}
									onChange={val => updateState(e.name, val)}
									value={state[e.name]}
									placeholder={e.placeholder}
									keyboardType={
										e.validation?.float ||
										e.validation?.integer
											? "number"
											: null
									}
								/>
							</View>
						);
					}
					return (
						<View style={styles[e.size]}>
							{e.title && (
								<Text
									numberOfLines={1}
									style={styles.inputTitle}
								>
									{e.title}
								</Text>
							)}
							<RectangularInput
								disabled={e.disabled}
								onChange={val => updateState(e.name, val)}
								value={state[e.name]}
								placeholder={e.placeholder}
								keyboardType={
									e.validation?.float || e.validation?.integer
										? "number-pad"
										: null
								}
							/>
						</View>
					);
				case FieldType.COMPLEX:
					return (
						<Fragment>
							<Text style={styles.inputTitle}>
								{strings.address}
							</Text>
							{e.rows &&
								e.rows.map(el => {
									return (
										<View style={styles.row}>
											{renderFields(el)}
										</View>
									);
								})}
						</Fragment>
					);
				case FieldType.LINE:
					return (
						<Fragment>
							{e.title && (
								<Text
									numberOfLines={1}
									style={styles.inputTitle}
								>
									{e.title}
								</Text>
							)}
							<View style={styles.row}>
								{renderFields(e.columns)}
							</View>
						</Fragment>
					);
				case FieldType.FILE:
					return (
						<View style={styles.row}>
							<TouchableWithoutFeedback
								onPress={() => pickFile(e)}
							>
								<View style={styles.filePicker}>
									<Text
										numberOfLines={1}
										style={[
											styles.inputTitle,
											{ width: 140 }
										]}
									>
										{state[e.name]
											? state[e.name].name
											: strings.selectFile}
									</Text>
									<Icons name={"paperclip"} size={20} />
								</View>
							</TouchableWithoutFeedback>
							<TouchableWithoutFeedback
								onPress={() => updateState(e.name, null)}
							>
								<View style={styles.button}>
									<Text style={styles.inputTitle}>
										{strings.reset}
									</Text>
									<AntDesign
										name={"close"}
										size={20}
										color={colors.red}
									/>
								</View>
							</TouchableWithoutFeedback>
						</View>
					);
				default:
					return null;
			}
		});
	};
	return (
		<View>
			{renderFields(fields)}
			{Footer && (
				<Footer
					getSubmitData={getSubmitData}
					getRawData={() => state}
				/>
			)}
		</View>
	);
};

export const styles = StyleSheet.create({
	title: {
		fontSize: 26,
		fontWeight: "bold",
		marginBottom: 15
	},
	container: {
		padding: 15
	},
	inputTitle: {
		fontSize: 14,
		color: colors.gray,
		marginVertical: 10
	},
	row: {
		flexDirection: "row"
	},
	half: {
		flex: 1,
		paddingRight: 5,
		marginBottom: 7.5
	},
	quarter: {
		flex: 0.4,
		paddingRight: 5,
		marginBottom: 7.5
	},
	quarterThree: {
		flex: 0.6,
		paddingRight: 5,
		marginBottom: 7.5
	},
	filePicker: {
		flex: 0.6,
		borderStyle: "dashed",
		borderWidth: 1,
		borderRadius: 6,
		borderColor: colors.lightGray,
		flexDirection: "row",
		justifyContent: "space-between",
		paddingHorizontal: 15,
		paddingVertical: 7.5,
		marginVertical: 15,
		marginRight: 10,
		alignItems: "center"
	},
	button: {
		flex: 0.4,
		borderRadius: 6,
		borderWidth: 1,
		borderColor: colors.lightGray,
		marginVertical: 15,
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center"
	}
});

export default FieldsRenderer;
