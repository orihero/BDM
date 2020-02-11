import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import AppRouter from './src/routes/AppRouter';
import NotificationService from './src/services/NotificationService';
import { Provider } from 'react-redux';
import configureStore from './src/redux/configureStore';
import { configureAxios } from './src/api/requests'

const App = () => {
  useEffect(() => {
    NotificationService.init();
  }, []);
  let store = configureStore()
  configureAxios(store)
  return (
    <Provider store={store}>
      <StatusBar barStyle="dark-content" />
      <AppRouter />
    </Provider>
  );
};

export default App;
