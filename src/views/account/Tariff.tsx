import React from "react";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import Text from "../../components/common/CustomText";
import LinearGradient from "react-native-linear-gradient";
import { colors } from "../../constants";
import { strings } from "../../locales/strings";

export interface TariffProps {
	id?: number;
	title?: string;
	shortDescription?: string;
	price?: string;
	period?: string;
	description?: string;
	reason?: string;
	onPress?: Function;
}

export const Tariff: React.FC<TariffProps> = ({
	title,
	description,
	shortDescription,
	price,
	period,
	reason,
	onPress
}) => {
	return (
		<View style={styles.container}>
			<View style={styles.top}>
				<Text style={styles.title}>{title}</Text>
				<Text style={styles.description}>{shortDescription}</Text>
			</View>
			<View style={styles.middle}>
				<View style={styles.midTop}>
					<Text style={styles.regularText}>{price}</Text>
					<Text style={styles.regularText}>{period}</Text>
				</View>
				<View style={styles.midCenter}>
					<Text style={styles.regularText}>{description}</Text>
				</View>
				{/* <View style={styles.midBottom}>
          <Text style={styles.regularText}>{reason}</Text>
        </View> */}
			</View>
			<TouchableWithoutFeedback onPress={onPress}>
				<View style={styles.bottom}>
					<LinearGradient
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 0 }}
						style={StyleSheet.absoluteFill}
						colors={[colors.darkBlue, colors.blue]}
					/>
					<Text style={styles.title}>{strings.select}</Text>
				</View>
			</TouchableWithoutFeedback>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		margin: 15,
		borderRadius: 20,
		overflow: "hidden"
	},
	top: {
		backgroundColor: colors.inkBlue,
		padding: 15,
		alignItems: "center"
	},
	middle: {},
	bottom: { padding: 15, alignItems: "center" },
	title: {
		fontSize: 22,
		fontWeight: "bold",
		color: colors.white
	},
	description: {
		fontWeight: "100",
		opacity: 0.7,
		fontSize: 15,
		color: colors.white
	},
	regularText: {
		fontSize: 15,
		color: colors.darkGray,
		textAlign: "center",
		fontWeight: "bold"
	},
	midTop: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		paddingVertical: 15
	},
	midCenter: {
		padding: 15,
		borderTopWidth: 1,
		borderBottomWidth: 1,
		borderColor: colors.ultraLightGray
	},
	midBottom: { padding: 15, alignItems: "center" }
});
