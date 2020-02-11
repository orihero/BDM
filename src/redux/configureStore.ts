import { createStore, applyMiddleware } from 'redux';
import { reducers } from './reducers';
import sagas from './sagas'
import createSagaMiddleware from 'redux-saga';

let configureStore = () => {
  let sagaMiddleware = createSagaMiddleware();
  let store = createStore(reducers, applyMiddleware(sagaMiddleware));
  sagaMiddleware.run(sagas)
  return store
};

export default configureStore;
