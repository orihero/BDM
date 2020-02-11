import React from 'react';
import { StyleSheet } from 'react-native';
import NavigationService from '../services/NavigationService';
import Navigation from './Routes';


let RouterWithAppState = () => {
  return <Navigation ref={ref => NavigationService.setTopLevelNavigator(ref)} />
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})


export default RouterWithAppState
