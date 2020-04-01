import React, { useEffect } from "react";
import {
	StatusBar,
	Platform,
	UIManager,
	Permission,
	PermissionsAndroid
} from "react-native";
import AppRouter from "./src/routes/AppRouter";
import NotificationService from "./src/services/NotificationService";
import { Provider } from "react-redux";
import configureStore from "./src/redux/configureStore";
import { configureAxios } from "./src/api/requests";

if (Platform.OS === "android") {
	if (UIManager.setLayoutAnimationEnabledExperimental) {
		UIManager.setLayoutAnimationEnabledExperimental(true);
	}
}

const App = () => {
	let store = configureStore();
	configureAxios(store);
	NotificationService.setState(store);
	let requestPermissions = async () => {
		try {
			let permission = await PermissionsAndroid.requestMultiple([
				"android.permission.WRITE_EXTERNAL_STORAGE",
				"android.permission.READ_EXTERNAL_STORAGE"
			]);
		} catch (error) {
			console.warn(error.message);
		}
	};
	useEffect(() => {
		requestPermissions();
	}, []);
	return (
		<Provider store={store}>
			<StatusBar barStyle="dark-content" />
			<AppRouter />
		</Provider>
	);
};

export default App;
