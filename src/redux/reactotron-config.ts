import AsyncStorage from "@react-native-community/async-storage";
import Reactotron from "reactotron-react-native";
import { reactotronRedux } from "reactotron-redux";
import sagaPlugin from "reactotron-redux-saga";

const reactotron = Reactotron.use(reactotronRedux())
	.use(sagaPlugin())
	.setAsyncStorageHandler(AsyncStorage) // AsyncStorage would either come from `react-native` or `@react-native-community/async-storage` depending on where you get it from
	// .configure({ host: "192.168.100.59" }) // controls connection & communication settings
	// .configure({ host: "192.168.1.32" }) // controls connection & communication settings
	.configure({ host: "192.168.10.161" }) // controls connection & communication settings
	.useReactNative() // add all built-in react native plugins
	.connect(); // let's connect!
export default reactotron;
