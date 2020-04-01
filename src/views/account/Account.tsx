import React from "react";
import { View, Dimensions } from "react-native";
import { createMaterialTopTabNavigator } from "react-navigation-tabs";
import { Profile, Integration, Tariffs } from "./index";
import { createAppContainer } from "react-navigation";
import { colors } from "../../constants";
import { strings } from "../../locales/strings";
import BlurWrapper from "../../components/containers/BlurWrapper";

interface Props {}

let tabConfig = {
	tabBarPosition: "top",
	swipeEnabled: true,
	style: {
		borderColor: colors.inkBlue
	},
	tabBarOptions: {
		scrollEnabled: true,
		tabStyle: {
			width: Dimensions.get("window").width / 3,
			borderColor: colors.inkBlue,
			borderBottomColor: colors.inkBlue
		},
		upperCaseLabel: false,
		activeTintColor: "#000000",
		inactiveTintColor: "#000000",
		style: {
			backgroundColor: "#fff",
			borderColor: colors.inkBlue,
			borderBottomColor: colors.inkBlue
		},
		labelStyle: {
			textAlign: "center",
			fontSize: 16,
			fontWeight: "100",
			color: colors.gray
		},
		indicatorStyle: {
			borderBottomColor: colors.inkBlue,
			borderBottomWidth: 3
		}
	}
};

let Account = ({}: Props): React.ReactElement => {
	let tabs = createMaterialTopTabNavigator(
		{
			Profile: {
				screen: Profile,
				navigationOptions: {
					title: strings.profile
				}
			},
			Integration: {
				screen: Integration,
				navigationOptions: {
					title: strings.integration
				}
			},
			Tariffs: {
				screen: Tariffs,
				navigationOptions: {
					title: strings.tariffs
				}
			}
		},
		tabConfig
	);
	let AccountRoutes = createAppContainer(tabs);
	return (
		<BlurWrapper>
			<AccountRoutes />
		</BlurWrapper>
	);
};

export { Account };
