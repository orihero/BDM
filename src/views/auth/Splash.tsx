import AsyncStorage from "@react-native-community/async-storage";
import React, { useEffect } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import { requests } from "../../api/requests";
import logo from "../../assets/images/logo.png";
import { colors } from "../../constants/index";
import { hideError, hideModal, userLoaded } from "../../redux/actions";
import { storeName } from "../../redux/reducers/user";
import { NavigationProps } from "../../utils/defaultPropTypes";
import NotificationService from "../../services/NotificationService";

let { width } = Dimensions.get("window");

const Splash = ({
	user,
	userLoaded,
	navigation,
	hideModal,
	hideError,
	...rest
}: NavigationProps) => {
	let effect = async () => {
		try {
			let credentials = await AsyncStorage.getItem(storeName);
			let data = JSON.parse(credentials);
			userLoaded(data);
			let res = await requests.user.me();
			userLoaded({ data: res.data.data, ...data });
			let userData = res.data.data;
			NotificationService.init();
			let token = await NotificationService.getFcmToken();
			let fcmResponse = await requests.auth.setDeviceToken({
				token,
				id: userData.id,
				tin: userData.tin
			});
			hideModal();
			hideError();
			navigation.navigate("Main");
		} catch (error) {
			console.warn(error);
			hideModal();
			hideError();
			navigation.navigate("Login");
		}
	};
	useEffect(() => {
		effect();
	}, []);
	return (
		<View style={styles.container}>
			<Image style={styles.image} source={logo} />
		</View>
	);
};

let ratio = 1250 / (width - 40);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.white,
		justifyContent: "center",
		alignItems: "center"
	},
	image: {
		height: 400 / ratio,
		width: 1250 / ratio
	}
});

const mapStateToProps = ({ user }) => ({
	user
});

const mapDispatchToProps = {
	userLoaded,
	hideModal,
	hideError
};

export default connect(mapStateToProps, mapDispatchToProps)(Splash);
