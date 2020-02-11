import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import AppRouter from './src/routes/AppRouter';
import NotificationService from './src/services/NotificationService';
import { Provider } from 'react-redux';
import configureStore from './src/redux/configureStore';

const App = () => {
  useEffect(() => {
    NotificationService.init();
  }, []);
  let store = configureStore()
  return (
    <Provider store={store}>
      <StatusBar barStyle="dark-content" />
      <AppRouter />
    </Provider>
  );
};

export default App;
