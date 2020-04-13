import React, { useState } from "react";
import {
	Dimensions,
	Image,
	LayoutAnimation,
	SafeAreaView,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
	Linking,
	KeyboardAvoidingView,
	ScrollView,
	Platform,
	ToastAndroid
} from "react-native";
import { connect } from "react-redux";
import logo from "../../assets/images/logo.png";
import Text from "../../components/common/CustomText";
import DefaultCheckbox from "../../components/common/DefaultCheckbox";
import GradientButton from "../../components/common/GradientButton";
import RectangularSelect from "../../components/common/RectangularSelect";
import { colors, commonStyles } from "../../constants";
import { strings } from "../../locales/strings";
import { requestUserLogin } from "../../redux/actions";
import BlurWrapper from "../../components/containers/BlurWrapper";
import FA5 from "react-native-vector-icons/FontAwesome5";
import RectangularInput from "../../components/common/RectangularInput";
import Launcher from "react-native-intent-launcher";

let { width } = Dimensions.get("window");

const mapDispatchToProps = {
	requestUserLogin
};

let socialIcons = [
	{ name: "phone-square", url: "tel://+998951942424" },
	{ name: "telegram-plane", url: "https://t.me/bdm_24m_uz" },
	{ name: "instagram", url: "https://www.instagram.com/bdmuzb/" },
	{ name: "facebook-square", url: "https://www.facebook.com/bdmuzb" },
	{ name: "linkedin", url: "https://www.linkedin.com/company/bdm-24m" }
];
const Login = ({ navigation, requestUserLogin }) => {
	let isIos = Platform.OS === "ios";
	const [remember, setRemember] = useState(true);
	const [isUsername, setIsUsername] = useState(isIos);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	let loginWithUsername = () => {
		requestUserLogin({ remember, username, password });
	};
	let onLogin = async () => {
		try {
			await Launcher.isAppInstalled("uz.yt.eimzo");
		} catch (error) {
			ToastAndroid.show(strings.downloadEImzoApp, 2000);
			return;
		}
		requestUserLogin({ remember });
	};
	let onStandartLoginCheck = () => {
		setIsUsername(!isUsername);
	};
	let renderContent = () => {
		if (!isUsername) {
			return (
				<View>
					<Text style={styles.promptSmallText}>
						{strings.downloadEImzoApp}
					</Text>
					<GradientButton
						onPress={onLogin}
						full
						text={strings.loginWithEImzo}
					/>
					<GradientButton
						onPress={onStandartLoginCheck}
						full
						startColor={colors.darkPurple}
						endColor={colors.lighPurple}
						text={strings.defaultLogin}
					/>
				</View>
			);
		}
		return (
			<View>
				<RectangularInput
					containerStyle={{ marginBottom: 20 }}
					placeholder={strings.enterLogin}
					onChange={e => setUsername(e)}
				/>
				<RectangularInput
					containerStyle={{ marginBottom: 20 }}
					placeholder={strings.enterPassword}
					secureTextEntry={true}
					onChange={e => setPassword(e)}
				/>
				<View style={styles.rememberContainer}>
					<DefaultCheckbox
						isActive={remember}
						setActive={() => {
							LayoutAnimation.configureNext(
								LayoutAnimation.create(
									200,
									LayoutAnimation.Types.easeInEaseOut,
									LayoutAnimation.Properties.scaleXY
								)
							);
							setRemember(!remember);
						}}
						title={`  ${strings.remember}`}
					/>
					{!isIos && (
						<Text
							onPress={onStandartLoginCheck}
							style={styles.promptSmallText}
						>
							{strings.loginWithEImzo}
						</Text>
					)}
				</View>
				<GradientButton
					onPress={loginWithUsername}
					full
					text={strings.login}
				/>
			</View>
		);
	};
	return (
		<BlurWrapper>
			<SafeAreaView style={styles.container}>
				<View
					style={[
						commonStyles.centeredContainer,
						{ alignItems: "flex-start", flex: 1.2 }
					]}
				>
					<Image source={logo} style={styles.image} />
				</View>
				<View style={{ paddingHorizontal: 20 }}>{renderContent()}</View>
				<View style={styles.footer}>
					{socialIcons.map((e, i) => {
						return (
							<View key={i}>
								<TouchableWithoutFeedback
									key={i.toString()}
									onPress={() => Linking.openURL(e.url)}
								>
									<FA5
										name={e.name}
										size={32}
										color={colors.blue}
										style={styles.icon}
									/>
								</TouchableWithoutFeedback>
							</View>
						);
					})}
				</View>
			</SafeAreaView>
		</BlurWrapper>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 15,
		backgroundColor: colors.white
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingHorizontal: 15,
		paddingBottom: 15
	},
	footerBottom: {},
	image: {
		width: width - 30,
		height: (width - 30) / 3.18
	},
	promptText: {
		color: colors.lightGray,
		fontSize: 18
	},
	promptBoldText: {
		color: colors.black,
		fontSize: 14,
		fontWeight: "bold"
	},
	promptSmallText: {
		color: colors.lightGray,
		fontSize: 12,
		textAlign: "center",
		fontWeight: "bold"
	},
	enterAccount: {
		color: colors.black,
		fontSize: 26,
		fontWeight: "bold"
	},
	footer: {
		flex: 0.8,
		justifyContent: "center",
		flexDirection: "row",
		alignItems: "flex-end"
	},
	icon: {
		margin: 15
	},
	rememberContainer: {
		marginBottom: 20,
		flexDirection: "row",
		justifyContent: "space-between"
	}
});

let WrappedLogin = connect(null, mapDispatchToProps)(Login);

export { WrappedLogin as Login };

{
	/* <TouchableWithoutFeedback
            onPress={() => navigation.navigate('Register')}>
            <View style={styles.footerBottom}>
              <Text style={styles.promptSmallText}>{strings.noAccount}</Text>
              <Text style={styles.promptBoldText}>
                {'   '}
                {strings.register}
              </Text>
            </View>
          </TouchableWithoutFeedback> */
}

{
	/* <View style={{ justifyContent: 'center', flex: 1 }}>
            <RectangularSelect disabled />
          </View> */
}
