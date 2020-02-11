import React from 'react'
import Navigation from './Routes'
import { View, StyleSheet } from 'react-native';
import Modal from '../components/Modal';
import NavigationService from '../services/NavigationService';


let RouterWithAppState = () => {
  return <Navigation ref={ref => NavigationService.setTopLevelNavigator(ref)} />
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})


export default RouterWithAppState
