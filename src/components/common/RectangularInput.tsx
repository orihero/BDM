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
	onChange = () => { },
	value,
	disabled,
	containerStyle,
	...rest
}: RectangularInputProps) => {
	return (
		<View style={[styles.container, containerStyle]}>
			<TextInput
				{...rest}
				numberOfLines={2}
				placeholder={placeholder}
				editable={!disabled}
				value={value}
				onChangeText={onChange}
				placeholderTextColor={colors.gray}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		borderRadius: 8,
		backgroundColor: colors.ultraLightGray,
		padding: Platform.select({ android: 6, ios: 20 }),
		paddingHorizontal: 20
	}
});

export default RectangularInput;
