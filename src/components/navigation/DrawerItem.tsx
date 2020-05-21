import React, { useState, useEffect } from "react";
import {
	LayoutAnimation,
	StyleSheet,
	TouchableWithoutFeedback,
	View
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { withNavigation } from "react-navigation";
import { colors, Icons } from "../../constants";
import Text from "../common/CustomText";
import { DrawerAction, DrawerActionTypes } from "./DrawerContent";
import { connect } from "react-redux";
import { getObjectProperty } from "../../utils/object";
import NavigationService from "../../services/NavigationService";

export interface DrawerItemProps {
	iconName?: string;
	title?: string;
	children?: DrawerItemProps[];
	bottom?: boolean;
	iconSize?: number;
	navigation?: any;
	feather?: boolean;
	style?: any;
	onPress?: Function;
	drawerVisible?: boolean;
	action?: DrawerAction;
	countPath?: string;
	active?: boolean;
}

const DrawerItem: React.FC<DrawerItemProps> = ({
	iconName,
	title,
	children,
	iconSize = 40,
	navigation,
	feather,
	style,
	onPress,
	drawerVisible,
	active,
	action,
	count,
	countPath,
	boxType,status
}) => {
	const [expanded, setExpanded] = useState(false);
	let closeDrawer = (action: DrawerAction) => {
		onPress(action);
		setExpanded(false);
	};
	useEffect(() => {
		if (!drawerVisible) {
			// LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
			setExpanded(false);
		}
	}, [drawerVisible]);
	return (
		<TouchableWithoutFeedback
			onPress={() => {
				if (!children && action?.navigateTo) {
					NavigationService.navigate(action.navigateTo);
					return;
				}
				// LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
				if (!drawerVisible) {
					onPress({});
				}
				setExpanded(!expanded);
			}}
		>
			<View>
				<View style={styles.container}>
					<View style={styles.left}>
						<View style={[styles.iconWrapper, style]}>
							{active && <View style={styles.activeIndicator} />}
							{iconName &&
								iconName !== "" &&
								(feather ? (
									<Feather
										name={iconName}
										size={iconSize}
										color={colors.black}
									/>
								) : (
									<Icons
										name={iconName}
										size={iconSize}
										color={colors.black}
									/>
								))}
						</View>
						<View style={{ justifyContent: "space-between",flexDirection:'row',alignItems:'center' }}>
							<Text style={styles.title}>
								{title}{" "}
							</Text>
							{!!countPath &&<Text style={{textAlign:'right'}}>{
									`(${getObjectProperty(count, countPath) ||
										"0"})`}</Text>}
						</View>
					</View>
					{/* {children && (
						<Icons
							name={"down-chevron"}
							style={{
								transform: [
									{ rotateX: expanded ? "180deg" : "0deg" }
								]
							}}
							size={18}
						/>
					)} */}
				</View>
				<View style={styles.childsContainer}>
					{children &&
						children.map(el => {
							return (
								<DrawerItem
									active={
										el.action?status === el.action.status&&boxType===action?.boxType:false
									}
									count={count}
									{...el}
									style={{ width: 40 }}
									onPress={() =>
										closeDrawer({ ...el.action, ...action })
									}
								/>
							);
						})}
				</View>
			</View>
		</TouchableWithoutFeedback>
	);
};
const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		padding: 3,
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 6
	},
	iconWrapper: {
		justifyContent: "center",
		width: 60
	},
	title: {
		fontWeight: "400",
		fontSize: 15,
		textAlignVertical: "center",
		width: 180
	},
	left: {
		flexDirection: "row"
	},
	childsContainer: {
		paddingLeft: 10
	},
	activeIndicator: {
		padding: 18,
		borderRadius: 60,
		backgroundColor: colors.lightGray,
		position: "absolute",
		transform: [{ translateX: -6 }]
	}
});

const mapStateToProps = ({ documents: { count,status,boxType } }) => ({
	count,
	status,boxType
});

const mapDispatchToProps = {};

export default connect(mapStateToProps)(DrawerItem);
