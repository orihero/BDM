import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import AppRouter from './src/routes/AppRouter';
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
