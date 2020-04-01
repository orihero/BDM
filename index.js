/**
 * @format
 */

import { AppRegistry, Platform, UIManager } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import NotificationService from "./src/services/NotificationService";

AppRegistry.registerHeadlessTask(
	"RNFirebaseBackgroundMessage",
	() => NotificationService.backgroundPushes
);
AppRegistry.registerComponent(appName, () => App);
