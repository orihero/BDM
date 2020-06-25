import React from "react";
import { View, TextInput, StyleSheet, Platform } from "react-native";
import { colors } from "../../constants";
import { strings } from "../../locales/strings";

interface RectangularInputProps {
	placeholder?: string;
	onChange?: Function;
	value?: string;
	disabled?: string;
	containerStyle?: any;
}

const RectangularInput = ({
	placeholder,
	onChange = () => {},
	value,
	disabled,
	containerStyle,
	...rest
}: RectangularInputProps) => {
	return (
		<View style={[styles.container, containerStyle]}>
			<TextInput
				style={styles.input}
				placeholder={placeholder}
				editable={!disabled}
				value={value}
				onChangeText={onChange}
				placeholderTextColor={colors.gray}
				{...rest}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		borderRadius: 8,
		backgroundColor: colors.ultraLightGray,
		justifyContent: "center",
		height: 60,
		paddingLeft: 10
	},
	input: {
		textAlignVertical: "center",
		fontSize: 15
	}
});

export default RectangularInput;
