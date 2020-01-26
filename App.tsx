import React, {useEffect} from 'react';
import AppRouter from './src/routes/AppRouter';
import {StatusBar} from 'react-native';
import NotificationService from './src/services/NotificationService';

const App = () => {
  useEffect(() => {
    NotificationService.init();
  }, []);
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <AppRouter />
    </>
  );
};

export default App;
