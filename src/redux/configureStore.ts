import { createStore, applyMiddleware, compose } from "redux";
import { reducers } from "./reducers";
import sagas from "./sagas";
import createSagaMiddleware from "redux-saga";
import reactotron from "./reactotron-config";
import Reactotron from "reactotron-react-native";

let configureStore = () => {
	const sagaMonitor = Reactotron.createSagaMonitor();
	let sagaMiddleware = createSagaMiddleware({ sagaMonitor });
	let store = createStore(
		reducers,
		compose(
			applyMiddleware(sagaMiddleware),
			reactotron.createEnhancer()
		)
	);
	sagaMiddleware.run(sagas);
	return store;
};

export default configureStore;
