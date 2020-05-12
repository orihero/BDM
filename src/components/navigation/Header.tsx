import React from "react";
import {
	View,
	StyleSheet,
	TouchableWithoutFeedback,
	Dimensions
} from "react-native";
import { Icons, colors } from "../../constants";
import Text from "../common/CustomText";
import { SafeAreaView, withNavigation } from "react-navigation";
import { connect } from "react-redux";
import { strings } from "../../locales/strings";
import AutoScroll from "react-native-auto-scrolling";

interface Props {
	title?: string;
	navigation: any;
	toggleDrawer?: Function;
}

export let statuses = {
	1: {
		10: { header: "Полученные", date: "Получен" },
		30: {
			header: "Подписанные",
			date: "Получен",
			acted: "Подписан"
		},
		60: {
			header: "Отказанные",
			date: "Получен",
			acted: "Отказан"
		},
		71: {
			header: "Корзина",
			date: "Получен",
			acted: "Удалён"
		}
	},
	2: {
		10: { header: "Отправленные", date: "Отправлен" },
		30: {
			header: "Подписанные",
			date: "Отправлен",
			acted: "Подписан"
		},
		60: {
			header: "Отказанные",
			date: "Отправлен",
			acted: "Отказан"
		},
		71: {
			header: "Корзина",
			date: "Отправлен",
			acted: "Удалён"
		},
		11: {
			header: "Загруженные",
			date: "Отправлен",
			acted: "Удалён"
		}
	}
};

let Header = ({
	navigation,
	toggleDrawer = () => {},
	boxType,
	status,
	user,
	scroll = false,
	title,
	filter = () => {}
}: Props) => {
	return (
		<SafeAreaView style={styles.wrapper}>
			<View style={styles.container}>
				<TouchableWithoutFeedback onPress={toggleDrawer}>
					<Icons
						name={"menu"}
						color={colors.black}
						style={{ paddingRight: 20 }}
						size={18}
					/>
				</TouchableWithoutFeedback>
				<View style={{ flex: 1 }}>
					<AutoScroll>
						<Text style={styles.title}>{title}</Text>
					</AutoScroll>
				</View>
				<View style={styles.row}>
					{/* <Icons
						name="filter"
						color={colors.black}
						style={styles.mr10}
						size={18}
					/> */}
					<TouchableWithoutFeedback onPress={filter}>
						<Icons
							name="search"
							style={{ paddingLeft: 20 }}
							color={colors.black}
							size={18}
						/>
					</TouchableWithoutFeedback>
				</View>
			</View>
		</SafeAreaView>
	);
};

const mapStateToProps = ({ documents: { boxType, status }, user }) => ({
	boxType,
	status,
	user
});

export default connect(mapStateToProps)(withNavigation(Header));

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		padding: 15,
		justifyContent: "space-between"
	},
	title: {
		fontSize: 17,
		color: colors.black,
		fontWeight: "bold"
	},
	wrapper: {
		backgroundColor: colors.white
	},
	row: {
		flexDirection: "row"
	},
	mr10: {
		marginRight: 10
	}
});
