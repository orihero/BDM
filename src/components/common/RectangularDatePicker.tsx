import React, { useState } from "react";
import { StyleSheet, View, TouchableWithoutFeedback } from "react-native";
import { colors, Icons } from "../../constants";
import Picker from "@react-native-community/datetimepicker";
import Text from "./CustomText";
import { strings } from "../../locales/strings";

interface DatePickerProps {
	placeholder?: string;
	containerStyle?: Object;
	disabled?: boolean;
	items?: any[];
	onChange?: Function;
	value?: string;
}

const RectangularDatePicker = ({
	placeholder = strings.certificate,
	containerStyle,
	items = [],
	onChange = () => {},
	value
}: DatePickerProps) => {
	let normalize = selection => {
		let selectedDate = selection || new Date();
		let day =
			selectedDate.getDate() >= 10
				? selectedDate.getDate().toString()
				: "0" + selectedDate.getDate().toString();
		let year = selectedDate.getFullYear();
		let month =
			selectedDate.getMonth() >= 10
				? selectedDate.getMonth().toString()
				: "0" + selectedDate.getMonth().toString();

		let date = `${day}.${month}.${year}`;
		return date;
	};
	const [visible, setVisible] = useState(false);
	return (
		<TouchableWithoutFeedback onPress={() => setVisible(!visible)}>
			<View>
				<View style={[styles.container, containerStyle]}>
					<Text style={[styles.placeholder, value && styles.value]}>
						{value ? value : placeholder}
					</Text>
					<Icons
						name={"down-chevron"}
						size={18}
						color={colors.gray}
					/>
				</View>
				{visible && (
					<Picker
						value={Date.now()}
						onChange={(e, selectedDate) => {
							setVisible(false);
							onChange(normalize(selectedDate || Date.now()));
						}}
					/>
				)}
			</View>
		</TouchableWithoutFeedback>
	);
};

const styles = StyleSheet.create({
	container: {
		borderRadius: 8,
		backgroundColor: colors.ultraLightGray,
		padding: 20,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center"
	},
	placeholder: {
		color: colors.gray
	},
	value: {
		color: colors.black
	}
});

export default RectangularDatePicker;
