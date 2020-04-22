import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-navigation";
import { strings } from "../../locales/strings";
import DrawerItem, { DrawerItemProps } from "./DrawerItem";
import { connect } from "react-redux";
import Text from "../common/CustomText";
import { colors } from "../../constants";

interface DrawerContentProps {
	navigation: any;
	onPress?: Function;
	expanded?: boolean;
	user?: any;
	boxType?: number;
}

export enum BoxType {
	inbox = 1,
	outbox = 2
}

export enum DocumentStatus {
	sentOrRecieved = 10,
	uploaded = 11,
	signed = 30,
	rejected = 60,
	deleted = 71
}

export enum DrawerActionTypes {
	navigate = 0,
	changeBox = 1,
	logout=2
}

export interface DrawerAction {
	type?: DrawerActionTypes;
	navigateTo?: string;
	boxType?: BoxType;
	status?: DocumentStatus;
}

let menus: DrawerItemProps[] = [
	// {
	// 	iconName: "add-file",
	// 	title: strings.create,
	// 	children: [
	// 		{
	// 			title: strings.twoSide,
	// 			iconName: "double",
	// 			iconSize: 24,
	// 			action: {
	// 				navigateTo: "NewDocument"
	// 			}
	// 		},
	// 		{
	// 			title: strings.threeSide,
	// 			iconName: "triple",
	// 			iconSize: 24,
	// 			action: {
	// 				navigateTo: "NewDocument"
	// 			}
	// 		}
	// 	]
	// },
	{
		iconName: "file-down",
		title: strings.inbox,
		action: {
			boxType: BoxType.inbox,
			type: DrawerActionTypes.changeBox
		},
		children: [
			{
				title: strings.recieved,
				iconName: "download",
				feather: true,
				iconSize: 24,
				action: {
					status: DocumentStatus.sentOrRecieved
				},
				countPath: "inputBox.recieved"
			},
			{
				title: strings.signed,
				iconName: "check-circle",
				feather: true,
				iconSize: 24,
				action: {
					status: DocumentStatus.signed
				},
				countPath: "inputBox.signature"
			},
			{
				title: strings.rejected,
				iconName: "delete",
				feather: true,
				iconSize: 24,
				action: {
					status: DocumentStatus.rejected
				},
				countPath: "inputBox.reject"
			},
			{
				title: strings.trash,
				iconName: "trash-2",
				feather: true,
				iconSize: 24,
				action: {
					status: DocumentStatus.deleted
				}
			}
		]
	},
	{
		iconName: "file-up",
		title: strings.outbox,
		action: {
			boxType: BoxType.outbox,
			type: DrawerActionTypes.changeBox
		},
		children: [
			{
				title: strings.sent,
				iconName: "send",
				feather: true,
				iconSize: 24,
				action: {
					status: DocumentStatus.sentOrRecieved
				},
				countPath: "outputBox.sent"
			},
			{
				title: strings.signed,
				iconName: "check-circle",
				feather: true,
				iconSize: 24,
				action: {
					status: DocumentStatus.signed
				},
				countPath: "outputBox.signature"
			},
			{
				title: strings.uploaded,
				iconName: "upload-cloud",
				feather: true,
				iconSize: 24,
				action: {
					status: DocumentStatus.uploaded
				},
				countPath: "outputBox.downloaded"
			},
			{
				title: strings.rejected,
				iconName: "delete",
				feather: true,
				iconSize: 24,
				action: {
					status: DocumentStatus.rejected
				},
				countPath: "outputBox.reject"
			},
			{
				title: strings.trash,
				iconName: "trash-2",
				feather: true,
				iconSize: 24,
				action: {
					status: DocumentStatus.deleted
				}
			}
		]
	},
	{
		iconName: "user",
		title: strings.personalCabinet,
		iconSize: 35,
		feather: true,
		action: {
			navigateTo: "Account"
		}
	},
	{
		iconName: "logout",
		// title: strings.logout,
		bottom: true,
		iconSize: 30,
		action: {
			navigateTo: "Login",
			type: DrawerActionTypes.logout
		}
	}
];

const DrawerContent: React.FC<DrawerContentProps> = ({
	navigation,
	onPress,
	expanded,
	boxType,
	user
}) => {
	return (
		<View style={{ flex: 1 }}>
			<SafeAreaView style={styles.container}>
				<View style={{ maxHeight: 400 }}>
					<ScrollView showsVerticalScrollIndicator={false}>
						{menus.map((e, i) => {
							if (e.bottom) {
								return null;
							}
							return (
								<DrawerItem
									key={i}
									{...e}
									active={boxType === e.action?.boxType}
									drawerVisible={expanded}
									onPress={onPress}
								/>
							);
						})}
					</ScrollView>
				</View>
			</SafeAreaView>
			<View style={styles.logoutWrapper}>
				<DrawerItem {...menus[menus.length - 1]} onPress={onPress} />
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: { paddingVertical: 30, paddingHorizontal: 5, flex: 1 },
	logo: { width: 200, height: 200 / 3.18 },
	logoutWrapper: {
		padding: 15,
		position: "absolute",
		right: 0,
		left: 0,
		bottom: 80
	}
});

const mapStateToProps = ({ documents: { boxType, status, count }, user }) => ({
	boxType,
	status,
	count,
	user
});

const mapDispatchToProps = {};

export default connect(mapStateToProps)(DrawerContent);
