import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const commonStyles = StyleSheet.create({
	centeredContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center"
	},
	shadow: {
		elevation: 4,
		shadowColor: colors.black,
		shadowOpacity: 0.1,
		shadowOffset: {
			width: 0,
			height: 5
		}
	}
});
