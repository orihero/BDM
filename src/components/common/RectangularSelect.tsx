import React from "react";
import { StyleSheet, View } from "react-native";
import { colors, Icons } from "../../constants";
import Picker from "react-native-picker-select";
import Text from "./CustomText";
import { strings } from "../../locales/strings";

interface RectangularSelectProps {
	placeholder?: string;
	containerStyle?: Object;
	disabled?: boolean;
	items?: any[];
	onChange?: Function;
	value?: string;
}

const RectangularSelect = ({
	placeholder = strings.certificate,
	containerStyle,
	disabled = false,
	items = [],
	onChange = () => {},
	value
}: RectangularSelectProps) => {
	return (
		<Picker
			onValueChange={e => {
				onChange(e);
			}}
			disabled={disabled}
			value={value}
			Icon={() => (
				<Icons
					name={"down-chevron"}
					size={18}
					color={colors.gray}
					style={styles.icon}
				/>
			)}
			placeholder={{
				label: placeholder || "",
				value: -1,
				color: colors.gray
			}}
			items={items}
			style={pickerStyles}
		/>
	);
};

const pickerStyles = StyleSheet.create({
	container: {
		borderRadius: 8,
		backgroundColor: colors.ultraLightGray,
		padding: 23,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center"
	},
	placeholder: {
		color: colors.gray
	},
	value: {
		color: colors.black
	},
	inputAndroid: {},
	contentContainerStyle: {
		borderRadius: 8
	},
	viewContainer: {
		borderRadius: 8,
		backgroundColor: colors.ultraLightGray,
		height: 60,
		justifyContent: "center",
		paddingHorizontal: 10
	}
});

const styles = StyleSheet.create({
	icon: {
		right: 10
	}
});

export default RectangularSelect;
